import { GoogleMap, Marker, Polyline, useLoadScript, Circle } from '@react-google-maps/api';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Bus as BusIcon } from 'lucide-react';
import { Bus, BusStop, Route, Coordinates } from '@/types';
import axios from 'axios';

interface GoogleMapsComponentProps {
  center?: {
    lat: number;
    lng: number;
  } | null;
}

const mapContainerStyle = useMemo(() => ({
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
}), []);

// Use prop center if provided, otherwise default to Addis Ababa
const defaultCenter = useMemo(
  () => ({
    lat: 9.005401, // Default to Addis Ababa coordinates
    lng: 38.763611,
  }),
  []
);

// Color palette for routes
const ROUTE_COLORS = [
  '#FF5252', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
  '#00BCD4', '#8BC34A', '#FFC107', '#E91E63', '#3F51B5'
];

const GoogleMapsComponent = ({ center: propCenter }: GoogleMapsComponentProps) => {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  // Fetch bus and route data
  useEffect(() => {
    if (!isLoaded) return;

    const fetchBusData = async () => {
      try {
        const [busRes, routeRes] = await Promise.all([
          axios.get('/api/live-bus-locations'),
          axios.get('/api/live-routes')
        ]);
        setBuses(busRes.data);
        setRoutes(routeRes.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching bus data:', error);
        setIsLoading(false);
      }
    };

    fetchBusData();

    const interval = setInterval(fetchBusData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [isLoaded]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Center map on user's location if map is loaded
          if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [isLoaded]);

  // Create bus icon with rotation
  const getBusIcon = (color: string, bearing: number) => {
    return {
      path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: bearing,
      scale: 0.8,
      anchor: new window.google.maps.Point(12, 12)
    };
  };

  // Create bus stop icon
  const getStopIcon = (color: string) => {
    return {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 1.2,
      anchor: new window.google.maps.Point(12, 24)
    };
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={propCenter || defaultCenter}
        zoom={13}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_TOP,
          },
        }}
      >
        {/* User location */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={20}
            options={{
              fillColor: '#4285F4',
              fillOpacity: 0.3,
              strokeWeight: 0,
            }}
          />
        )}

        {/* Bus routes */}
        {routes.map((route) => (
          <Polyline
            key={route.id}
            path={route.path.map((point) => ({ lat: point.lat, lng: point.lng }))}
            options={{
              strokeColor: route.color,
              strokeOpacity: 0.7,
              strokeWeight: 4,
            }}
          />
        ))}

        {/* Bus stops */}
        {routes.flatMap(route => route.stops).map((stop, index) => (
          <Marker
            key={`stop-${index}`}
            position={{ lat: stop.lat, lng: stop.lng }}
            icon={getStopIcon('#666')}
            title={stop.name}
          />
        ))}

        {/* Buses */}
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            position={{ lat: bus.lat, lng: bus.lng }}
            icon={getBusIcon(bus.routeColor, bus.bearing)}
            onClick={() => setSelectedBus(bus)}
            title={`${bus.routeName} - ${bus.id}`}
          />
        ))}
      </GoogleMap>

      {/* Bus details panel */}
      {selectedBus && (
        <div className="absolute top-4 right-4 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-10">
          <div 
            className="h-2 w-full"
            style={{ backgroundColor: selectedBus.routeColor }}
          />
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{selectedBus.routeName}</h3>
              <button 
                onClick={() => setSelectedBus(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span 
                className="inline-block w-2 h-2 rounded-full mr-2" 
                style={{ backgroundColor: selectedBus.routeColor }}
              />
              Bus #{selectedBus.id.split('-')[1]}
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <span 
                  className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    selectedBus.occupancy === 'low' ? 'bg-green-500' : 
                    selectedBus.occupancy === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
                {selectedBus.occupancy.charAt(0).toUpperCase() + selectedBus.occupancy.slice(1)} occupancy
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Next Stop</p>
                <p className="font-medium">{selectedBus.nextStop || 'Terminal'}</p>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">ETA</p>
                  <p className="font-medium">{selectedBus.etaToNextStop} min</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(selectedBus.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              className="mt-4 w-full bg-blue-50 text-blue-600 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.panTo({ lat: selectedBus.lat, lng: selectedBus.lng });
                  mapRef.current.setZoom(16);
                }
              }}
            >
              Track Bus
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin mr-2" />
            <span>Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsComponent;


