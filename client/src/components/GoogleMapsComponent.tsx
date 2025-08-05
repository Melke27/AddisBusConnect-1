import { GoogleMap, Marker, Polyline, useLoadScript, Circle } from '@react-google-maps/api';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Bus as BusIcon } from 'lucide-react';
import { Bus, BusStop, Route, Coordinates } from '@/types';

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

// Mock routes data - replace with real API calls
const routes = useMemo<Route[]>(() => [
  {
    id: 'r1',
    name: 'Meskel - Bole',
    color: ROUTE_COLORS[0],
    path: [
      [9.0054, 38.7636],
      [9.0154, 38.7736],
      [9.0254, 38.7836],
      [9.0354, 38.7936],
    ],
    stops: [
      { id: 's1', name: 'Meskel Square', lat: 9.0054, lng: 38.7636, routes: ['r1'] },
      { id: 's2', name: 'Bole Bridge', lat: 9.0254, lng: 38.7836, routes: ['r1', 'r2'] },
      { id: 's3', name: 'Bole Medhanialem', lat: 9.0354, lng: 38.7936, routes: ['r1'] },
    ]
  },
  {
    id: 'r2',
    name: 'Piassa - Mexico',
    color: ROUTE_COLORS[1],
    path: [
      [9.0354, 38.7436],
      [9.0254, 38.7536],
      [9.0154, 38.7636],
      [9.0054, 38.7736],
    ],
    stops: [
      { id: 's4', name: 'Piassa', lat: 9.0354, lng: 38.7436, routes: ['r2'] },
      { id: 's2', name: 'Bole Bridge', lat: 9.0254, lng: 38.7836, routes: ['r1', 'r2'] },
      { id: 's5', name: 'Mexico Square', lat: 9.0054, lng: 38.7736, routes: ['r2'] },
    ]
  }
], []);

// Generate mock bus locations
const generateMockBusLocations = (count: number): BusLocation[] => {
  return Array.from({ length: count }, (_, i) => {
    const route = routes[i % routes.length];
    const pathIndex = Math.floor(Math.random() * (route.path.length - 1));
    const [lat, lng] = route.path[pathIndex];
    const nextStop = route.stops[Math.min(pathIndex + 1, route.stops.length - 1)];
    
    return {
      id: `bus-${i + 1}`,
      routeId: route.id,
      routeName: route.name,
      routeColor: route.color,
      lat: lat + (Math.random() * 0.005 - 0.0025),
      lng: lng + (Math.random() * 0.005 - 0.0025),
      bearing: Math.floor(Math.random() * 360),
      nextStop: nextStop?.name || 'Terminal',
      etaToNextStop: Math.floor(Math.random() * 15) + 1,
      occupancy: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      lastUpdated: new Date().toISOString()
    };
  });
};

const GoogleMapsComponent = ({ center: propCenter }: GoogleMapsComponentProps) => {
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  // Initialize bus locations
  useEffect(() => {
    if (isLoaded) {
      setBuses(generateMockBusLocations(8));
      setIsLoading(false);
    }
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

  // Update bus positions every 5 seconds (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses =>
        prevBuses.map(bus => {
          // Simple simulation - move bus along its route
          const route = routes.find(r => r.id === bus.routeId);
          if (!route || !route.path || route.path.length === 0) return bus;

          // Find current position index in the path
          const currentPos = route.path.findIndex(
            (point) =>
              point.lat === bus.lat &&
              point.lng === bus.lng
          );

          // If not found, start from the beginning
          const currentPositionIndex = currentPos === -1 ? 0 : currentPos;
          
          // Move to next point or loop back to start
          const nextIndex = (currentPositionIndex + 1) % route.path.length;
          const nextPoint = route.path[nextIndex];

          // Calculate bearing for bus direction
          const prevIndex = currentPositionIndex === 0 ? route.path.length - 1 : currentPositionIndex - 1;
          const prevPoint = route.path[prevIndex];
          
          const bearing = Math.atan2(
            nextPoint[1] - prevPoint[1],
            nextPoint[0] - prevPoint[0]
          ) * (180 / Math.PI);

          return {
            ...bus,
            lat: nextPoint[0],
            lng: nextPoint[1],
            bearing,
            lastUpdated: new Date().toISOString(),
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [routes]);

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
            path={route.path.map(([lat, lng]) => ({ lat, lng }))}
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
