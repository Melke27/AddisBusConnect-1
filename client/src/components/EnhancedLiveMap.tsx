import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';

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

// Mock data for routes
const mockRoutes: Route[] = [
  {
    id: 'route-1',
    name: 'Mercato - Bole',
    color: ROUTE_COLORS[0],
    stops: [
      { id: 'stop-1', name: 'Mercato', lat: 9.0054, lng: 38.7636, routes: ['route-1'] },
      { id: 'stop-2', name: 'Bole', lat: 9.0254, lng: 38.7836, routes: ['route-1'] }
    ],
    path: [[9.0054, 38.7636], [9.0154, 38.7736], [9.0254, 38.7836]]
  },
  {
    id: 'route-2',
    name: 'Meskel - Bole',
    color: ROUTE_COLORS[1],
    stops: [
      { id: 'stop-3', name: 'Meskel Square', lat: 9.0054, lng: 38.7636, routes: ['route-2'] },
      { id: 'stop-4', name: 'Bole Bridge', lat: 9.0254, lng: 38.7836, routes: ['route-2'] }
    ],
    path: [[9.0054, 38.7636], [9.0154, 38.7736], [9.0254, 38.7836]]
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

const EnhancedLiveMap: React.FC = () => {
  // State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  
  // Refs
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const busMarkers = useRef<{ [key: string]: L.Marker }>({});
  const routeLayers = useRef<{ [key: string]: L.Polyline }>({});
  const stopMarkers = useRef<{ [key: string]: L.Marker }>({});
  const updateInterval = useRef<NodeJS.Timeout>();
  
  // Bus locations state
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  
  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    // Initialize map with default coordinates (Addis Ababa)
    const defaultCoords: [number, number] = [9.0054, 38.7636];
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      preferCanvas: true
    }).setView(defaultCoords, 13);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Store map reference
    mapRef.current = map;
    
    // Set up map layers and markers
    setupMapLayers(map);
    
    // Initial load of bus locations
    refreshBusLocations();
    
    // Set up auto-refresh for bus locations
    updateInterval.current = setInterval(() => {
      refreshBusLocations();
    }, 15000); // Refresh every 15 seconds
    
    // Clean up on unmount
    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
      if (map) {
        map.remove();
      }
    };
  }, []);
  
  // Set up map layers (routes and stops)
  const setupMapLayers = (map: L.Map) => {
    // Add routes to map
    mockRoutes.forEach(route => {
      // Skip if route layer already exists
      if (routeLayers.current[route.id]) return;
      
      const routeLayer = L.polyline(route.path, {
        color: route.color,
        weight: 4,
        opacity: 0.7
      }).addTo(map);
      
      routeLayers.current[route.id] = routeLayer;
      
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
      
      // Add stops to map
      route.stops.forEach(stop => {
        if (!stopMarkers.current[stop.id]) {
          const stopMarker = L.marker([stop.lat, stop.lng], {
            icon: L.divIcon({
              className: 'bus-stop-marker',
              html: '🚏',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })
          }).bindPopup(`
            <div class="p-2">
              <h4 class="font-bold">${stop.name}</h4>
              <p>Routes: ${stop.routes.join(', ')}</p>
            </div>
          `).addTo(map);
          
          stopMarkers.current[stop.id] = stopMarker;
        }
      });
    });
  };
  
  // Refresh bus locations (mock implementation)
  const refreshBusLocations = () => {
    if (!mapRef.current) return;
    
    // In a real app, this would be an API call
    const updatedLocations = generateMockBusLocations(10);
    setBusLocations(updatedLocations);
    setLastUpdated(new Date());
    
    // Update or add bus markers
    updatedLocations.forEach(bus => {
      if (!busMarkers.current[bus.id]) {
        // Create new marker if it doesn't exist
        const icon = createBusIcon(bus.routeColor, bus.bearing);
        const marker = L.marker([bus.lat, bus.lng], { icon })
          .addTo(mapRef.current!)
          .bindPopup(`
            <div class="p-2">
              <h4 class="font-bold">${bus.routeName}</h4>
              <p>Next stop: ${bus.nextStop}</p>
              <p>ETA: ${bus.etaToNextStop} min</p>
            </div>
          `);
        
        busMarkers.current[bus.id] = marker;
      } else {
        // Update existing marker
        const marker = busMarkers.current[bus.id];
        marker.setLatLng([bus.lat, bus.lng]);
        
        // Update rotation if needed
        if (marker.setRotationAngle) {
          marker.setRotationAngle(bus.bearing);
        }
      }
    });
    
    // Remove old markers that are no longer in the data
    Object.keys(busMarkers.current).forEach(busId => {
      if (!updatedLocations.some(bus => bus.id === busId)) {
        mapRef.current?.removeLayer(busMarkers.current[busId]);
        delete busMarkers.current[busId];
      }
    });
    
    setIsLoading(false);
  };
  
  // Handle map click to select a bus
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!mapRef.current) return;
    
    // Find if a bus was clicked
    const clickedBus = busLocations.find(bus => {
      const marker = busMarkers.current[bus.id];
      if (!marker) return false;
      
      const point = mapRef.current?.latLngToContainerPoint(marker.getLatLng());
      if (!point) return false;
      
      const clickPoint = mapRef.current?.latLngToContainerPoint(e.latlng);
      if (!clickPoint) return false;
      
      // Simple distance check (in pixels)
      const distance = point.distanceTo(clickPoint);
      return distance < 20; // 20px tolerance
    });
    
    setSelectedBus(clickedBus || null);
  };
  
  // Set up map click handler
  useEffect(() => {
    if (!mapRef.current) return;
    
    mapRef.current.on('click', handleMapClick);
    
    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
      }
    };
  }, [busLocations]);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Map container */}
      <div 
        ref={mapContainerRef} 
        className="w-full flex-1 min-h-[400px] bg-gray-100"
        style={{ minHeight: '60vh' }}
      ></div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
            <p>Loading map data...</p>
          </div>
        </div>
      )}
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2 flex flex-col items-end">
        <button 
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setView([9.0054, 38.7636], 13); // Reset to default view
            }
          }}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
          title="Reset view"
        >
          🏠
        </button>
      </div>
      
      {/* Bus info card */}
      <div className="absolute bottom-4 left-4 z-10 w-11/12 md:w-1/3">
        <Card>
          <CardHeader>
            <CardTitle>🚌 Real-time Bus Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedBus ? (
              <div>
                <div className="flex items-center mb-2">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: selectedBus.routeColor }}
                  ></div>
                  <h3 className="font-bold text-lg">{selectedBus.routeName}</h3>
                </div>
                <p className="text-gray-700">
                  <span className="font-medium">Next stop:</span> {selectedBus.nextStop}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">ETA:</span> {selectedBus.etaToNextStop} min
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {lastUpdated?.toLocaleTimeString() || 'Just now'}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">Click on a bus to see details</p>
                <p className="text-xs text-gray-400 mt-1">
                  {busLocations.length} buses in service
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default React.memo(EnhancedLiveMap);
