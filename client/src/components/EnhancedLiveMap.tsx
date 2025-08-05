import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Types
type BusLocation = {
  id: string;
  routeId: string;
  routeName: string;
  lat: number;
  lng: number;
  nextStop: string;
  etaToNextStop: number;
  occupancy: 'low' | 'medium' | 'high';
};

type Route = {
  id: string;
  name: string;
  stops: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
  }>;
  path: Array<[number, number]>;
};

// Mock data
const mockBusLocations: BusLocation[] = [];
const mockRoutes: Route[] = [];

export default function EnhancedLiveMap() {
  const mapRef = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  const busMarkers = useRef<{ [key: string]: L.Marker }>({});
  const routeLayers = useRef<{ [key: string]: L.Polyline }>({});

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const defaultCoords: [number, number] = [9.0054, 38.7636];
    const map = L.map('map').setView(defaultCoords, 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          map.setView([latitude, longitude], 15);
        },
        (error) => console.error('Location error:', error)
      );
    }

    return () => map.remove();
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full h-[500px] relative rounded-lg overflow-hidden">
          <div id="map" className="w-full h-full" />
          
          <div className="absolute top-4 right-4 z-[1000] space-y-2">
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
