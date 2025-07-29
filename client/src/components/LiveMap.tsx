import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Locate, Layers, Maximize } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BusLocation {
  id: string;
  plateNumber: string;
  routeId: string;
  latitude: string;
  longitude: string;
  lastUpdated: string;
}

interface LiveMapProps {
  height?: string;
  showControls?: boolean;
}

export default function LiveMap({ height = "h-64", showControls = true }: LiveMapProps) {
  const { t } = useLanguage();
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Addis Ababa center
          setUserLocation([9.0320, 38.7469]);
        }
      );
    } else {
      // Default to Addis Ababa center
      setUserLocation([9.0320, 38.7469]);
    }

    // Connect to WebSocket for real-time bus updates
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'bus_locations') {
        setBusLocations(message.data);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current = socket;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const centerOnUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (!userLocation) {
    return (
      <div className={`${height} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <div className="text-gray-600">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  // Create custom bus icon
  const busIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1976D2" width="24" height="24">
        <path d="M5,11L6.5,6.5H17.5L19,11M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  return (
    <div className="space-y-4">
      <MapContainer
        center={userLocation}
        zoom={13}
        className={`${height} rounded-lg`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        <Marker position={userLocation}>
          <Popup>Your Location</Popup>
        </Marker>
        
        {/* Bus markers */}
        {busLocations.map((bus) => {
          if (!bus.latitude || !bus.longitude) return null;
          
          return (
            <Marker
              key={bus.id}
              position={[parseFloat(bus.latitude), parseFloat(bus.longitude)]}
              icon={busIcon}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-medium">{bus.plateNumber}</div>
                  <div className="text-sm text-gray-600">
                    Last updated: {new Date(bus.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {showControls && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={centerOnUserLocation}
            className="flex items-center gap-1"
          >
            <Locate className="h-4 w-4" />
            {t('liveTracking.myLocation')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Layers className="h-4 w-4" />
            {t('liveTracking.traffic')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Maximize className="h-4 w-4" />
            {t('liveTracking.fullScreen')}
          </Button>
        </div>
      )}
    </div>
  );
}
