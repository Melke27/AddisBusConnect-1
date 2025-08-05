import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2 } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Types
type BusLocation = {
  id: string;
  routeId: string;
  routeName: string;
  routeColor: string;
  lat: number;
  lng: number;
  bearing: number;
  nextStop: string;
  etaToNextStop: number;
  occupancy: 'low' | 'medium' | 'high';
  lastUpdated: string;
};

type BusStop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
};

type Route = {
  id: string;
  name: string;
  color: string;
  stops: BusStop[];
  path: Array<[number, number]>;
};

// Color palette for routes
const ROUTE_COLORS = [
  '#FF5252', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
  '#00BCD4', '#8BC34A', '#FFC107', '#E91E63', '#3F51B5'
];

// Mock routes data
const mockRoutes: Route[] = [
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
];

// Generate mock bus locations
const generateMockBusLocations = (count: number): BusLocation[] => {
  return Array.from({ length: count }, (_, i) => {
    const route = mockRoutes[i % mockRoutes.length];
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

// Initialize mock bus locations
const mockBusLocations = generateMockBusLocations(10);

// Custom bus icon with rotation
const createBusIcon = (color: string, bearing: number) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 20px;
        height: 20px;
        display: block;
        left: -10px;
        top: -10px;
        position: relative;
        border-radius: 50% 50% 50% 0;
        transform: rotate(${bearing}deg);
        transform-origin: 50% 50%;
      ">
        <div style="
          position: absolute;
          width: 10px;
          height: 10px;
          background: white;
          top: 2px;
          left: 5px;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'bus-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export default function EnhancedLiveMap() {
  const mapRef = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [busLocations, setBusLocations] = useState<BusLocation[]>(mockBusLocations);
  const busMarkers = useRef<{ [key: string]: L.Marker }>({});
  const routeLayers = useRef<{ [key: string]: L.Polyline }>({});
  const stopMarkers = useRef<{ [key: string]: L.Marker }>({});
  const updateInterval = useRef<NodeJS.Timeout>();
  const allStops = Array.from(new Set(mockRoutes.flatMap(route => route.stops)));

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const defaultCoords: [number, number] = [9.0054, 38.7636];
    const map = L.map('map', {
      zoomControl: false,
      preferCanvas: true
    }).setView(defaultCoords, 13);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap contributors'
    }).addTo(map);
    
    // Add zoom control
    L.control.zoom({ position: 'topright' }).addTo(map);
    
    mapRef.current = map;

    // Add route polylines
    mockRoutes.forEach(route => {
      const polyline = L.polyline(route.path, {
        color: route.color,
        weight: 4,
        opacity: 0.7,
        lineJoin: 'round'
      }).addTo(map);
      
      routeLayers.current[route.id] = polyline;
      
      // Add route label
      if (route.path.length > 0) {
        const [lat, lng] = route.path[0];
        L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'route-label',
            html: `<div style="
              background: ${route.color};
              color: white;
              padding: 2px 8px;
              border-radius: 10px;
              font-weight: bold;
              font-size: 12px;
              white-space: nowrap;
            ">${route.name}</div>`,
            iconSize: [100, 20],
            iconAnchor: [0, 10]
          })
        }).addTo(map);
      }
    });
    
    // Add bus stop markers
    allStops.forEach(stop => {
      const marker = L.marker([stop.lat, stop.lng], {
        icon: L.divIcon({
          className: 'bus-stop',
          html: '🚏',
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        })
      }).addTo(map);
      
      // Add popup with stop info
      const popupContent = `
        <div class="p-2">
          <h3 class="font-bold">${stop.name}</h3>
          <p class="text-sm">Routes: ${stop.routes.map(r => 
            `<span class="inline-block w-3 h-3 rounded-full mr-1" 
                  style="background: ${mockRoutes.find(rt => rt.id === r)?.color || '#ccc'}"></span>${r}`
          ).join(', ')}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      stopMarkers.current[stop.id] = marker;
    });
    
    // Add bus markers
    busLocations.forEach(bus => {
      const marker = L.marker([bus.lat, bus.lng], {
        icon: createBusIcon(bus.routeColor, bus.bearing),
        zIndexOffset: 1000
      }).addTo(map);
      
      // Add popup with bus info
      const popupContent = `
        <div class="p-2 w-48">
          <div class="flex items-center mb-1">
            <span class="inline-block w-3 h-3 rounded-full mr-2" 
                  style="background: ${bus.routeColor}"></span>
            <h3 class="font-bold">${bus.routeName}</h3>
          </div>
          <p class="text-sm">Bus #${bus.id.split('-')[1]}</p>
          <p class="text-xs">Next: ${bus.nextStop} (${bus.etaToNextStop} min)</p>
          <div class="mt-1 flex items-center">
            <span class="text-xs">Occupancy: </span>
            <div class="ml-1 flex">
              ${['low', 'medium', 'high'].map((level, i) => 
                `<div class="w-2 h-2 mx-px rounded-full ${i < ['low', 'medium', 'high'].indexOf(bus.occupancy) + 1 ? 'bg-gray-700' : 'bg-gray-300'}"></div>`
              ).join('')}
            </div>
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      marker.on('click', () => setSelectedBus(bus));
      busMarkers.current[bus.id] = marker;
    });
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLoc: [number, number] = [latitude, longitude];
          setUserLocation(userLoc);
          
          // Add user location marker with a pulsing effect
          const userMarker = L.circleMarker(userLoc, {
            radius: 8,
            fillColor: '#4285F4',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(map);
          
          // Center map on user with a slight offset
          map.setView(userLoc, 15);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setIsLoading(false);
    }
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, []);

  // Update bus positions periodically
  useEffect(() => {
    updateInterval.current = setInterval(() => {
      setBusLocations(prevBuses => 
        prevBuses.map(bus => {
          const route = mockRoutes.find(r => r.id === bus.routeId);
          if (!route) return bus;
          
          // Find current position in path
          let closestIdx = 0;
          let minDist = Infinity;
          
          route.path.forEach(([lat, lng], idx) => {
            const dist = Math.sqrt(Math.pow(lat - bus.lat, 2) + Math.pow(lng - bus.lng, 2));
            if (dist < minDist) {
              minDist = dist;
              closestIdx = idx;
            }
          });
          
          // Move to next point
          const nextIdx = (closestIdx + 1) % route.path.length;
          const [nextLat, nextLng] = route.path[nextIdx];
          
          // Calculate bearing (in degrees)
          const y = Math.sin(nextLng - bus.lng) * Math.cos(nextLat);
          const x = Math.cos(bus.lat) * Math.sin(nextLat) - 
                    Math.sin(bus.lat) * Math.cos(nextLat) * Math.cos(nextLng - bus.lng);
          let bearing = Math.atan2(y, x) * (180 / Math.PI);
          
          // Small random movement
          const lat = bus.lat + (nextLat - bus.lat) * 0.1 + (Math.random() * 0.0005 - 0.00025);
          const lng = bus.lng + (nextLng - bus.lng) * 0.1 + (Math.random() * 0.0005 - 0.00025);
          
          // Update marker if it exists
          const marker = busMarkers.current[bus.id];
          if (marker) {
            marker.setLatLng([lat, lng]);
            marker.setIcon(createBusIcon(bus.routeColor, bearing));
          }
          
          return {
            ...bus,
            lat,
            lng,
            bearing,
            lastUpdated: new Date().toISOString(),
            nextStop: route.stops[nextIdx % route.stops.length]?.name || 'Terminal',
            etaToNextStop: Math.max(0, (bus.etaToNextStop - 3) % 15) // Simple countdown
          };
        })
      );
      setLastUpdated(new Date());
    }, 3000);
    
    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, []);

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      ) : (
        <div id="map" className="h-full w-full" />
      )}
      
      {/* Bus details panel */}
      {selectedBus && (
        <div className="absolute top-4 right-4 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-[1000]">
          <div 
            className="h-2 w-full"
            style={{ backgroundColor: selectedBus.routeColor }}
          ></div>
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
              <span className="inline-block w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: selectedBus.routeColor }}></span>
              Bus #{selectedBus.id.split('-')[1]}
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                  selectedBus.occupancy === 'low' ? 'bg-green-500' : 
                  selectedBus.occupancy === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></span>
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
                    {lastUpdated ? new Date(selectedBus.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              className="mt-4 w-full bg-blue-50 text-blue-600 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo([selectedBus.lat, selectedBus.lng], 16, {
                    duration: 1
                  });
                }
              }}
            >
              Track Bus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
            <button 
              onClick={() => userLocation && mapRef.current?.setView(userLocation, 15)}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              title="Center on my location"
            >
              📍
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Bus Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBus ? (
                <div>
                  <h3 className="font-bold">{selectedBus.routeName}</h3>
                  <p>Next stop: {selectedBus.nextStop}</p>
                  <p>ETA: {selectedBus.etaToNextStop} min</p>
                </div>
              ) : (
                <p>Select a bus to see details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
