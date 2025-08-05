import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { useRef, useState, useEffect } from 'react';
import { Loader2, Search, MapPin } from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface RouteSearchProps {
  onSelectPlace: (place: google.maps.places.PlaceResult | null) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

const libraries: (
  | 'places'
  | 'geometry'
  | 'drawing'
  | 'localContext'
  | 'visualization'
)[] = ['places'];

export default function RouteSearch({
  onSelectPlace,
  placeholder = 'Search for a location...',
  className = '',
  initialValue = '',
}: RouteSearchProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Initialize services when script is loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const mapDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(mapDiv);
    }
  }, [isLoaded]);

  // Fetch predictions when query changes
  useEffect(() => {
    if (!debouncedQuery || !autocompleteService.current) {
      setPredictions([]);
      return;
    }

    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        const request = {
          input: debouncedQuery,
          componentRestrictions: { country: 'et' }, // Ethiopia
          types: ['establishment', 'geocode'],
        };

        autocompleteService.current?.getPlacePredictions(
          request,
          (results, status) => {
            if (status === 'OK' && results) {
              setPredictions(results);
              setShowPredictions(true);
            } else {
              setPredictions([]);
            }
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error('Error fetching predictions:', error);
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [debouncedQuery]);

  // Handle click outside to close predictions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlaceSelect = (placeId: string) => {
    if (!placesService.current) return;

    const request = {
      placeId,
      fields: ['name', 'formatted_address', 'geometry', 'place_id'],
    };

    placesService.current.getDetails(request, (place, status) => {
      if (status === 'OK' && place) {
        onSelectPlace(place);
        setSearchQuery(place.name || place.formatted_address || '');
        setShowPredictions(false);
      }
    });
  };

  if (loadError) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        Error loading Google Maps. Please try again later.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
        <span>Loading search...</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={searchContainerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowPredictions(true);
          }}
          onFocus={() => setShowPredictions(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60 focus:outline-none sm:text-sm">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="cursor-pointer hover:bg-gray-100 px-4 py-2 flex items-center"
              onClick={() => handlePlaceSelect(prediction.place_id)}
            >
              <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
              <div className="truncate">
                <div className="font-medium text-gray-900">{prediction.structured_formatting.main_text}</div>
                <div className="text-gray-500 text-sm truncate">
                  {prediction.structured_formatting.secondary_text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
