import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { MapPin, Navigation, Bus, Clock, Route, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { busRoutes, BusRoute, findNearbyStops } from '../../data/routes';
import VoiceAssistant from '../voice-assistant';
import 'leaflet/dist/leaflet.css';

// Custom icons for different map markers
const createCustomIcon = (color: string, iconName: string) => {
  return divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">${iconName}</div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const startIcon = createCustomIcon('#00AA00', 'S');
const endIcon = createCustomIcon('#FF0000', 'E');
const busIcon = createCustomIcon('#0066FF', 'B');
const userIcon = createCustomIcon('#FF6600', 'U');

interface LiveBus {
  id: string;
  routeId: string;
  plateNumber: string;
  coordinates: [number, number];
  nextStop: string;
  estimatedArrival: number; // minutes
  capacity: number;
  currentCapacity: number;
  speed: number; // km/h
  heading: number; // degrees
}

interface AdvancedMapProps {
  selectedRouteId?: string;
  onRouteSelect?: (routeId: string) => void;
  className?: string;
}

export const AdvancedMap: React.FC<AdvancedMapProps> = ({ 
  selectedRouteId, 
  onRouteSelect, 
  className 
}) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [liveBuses, setLiveBuses] = useState<LiveBus[]>([]);
  const [nearbyStops, setNearbyStops] = useState<any[]>([]);
  const [trackingMode, setTrackingMode] = useState<'route' | 'bus' | 'navigation'>('route');
  const [isTracking, setIsTracking] = useState(false);
  const [estimatedArrival, setEstimatedArrival] = useState<number | null>(null);
  const voiceRef = useRef<any>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(coords);
          
          // Find nearby stops
          const nearby = findNearbyStops(coords[0], coords[1], 2); // 2km radius
          setNearbyStops(nearby);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Addis Ababa center
          setUserLocation([9.0320, 38.7469]);
        }
      );
    }
  }, []);

  // Simulate live bus data
  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedBuses: LiveBus[] = busRoutes.map(route => ({
        id: `bus-${route.id}`,
        routeId: route.id,
        plateNumber: `ET-${Math.random().toString(36).substr(2, 3).toUpperCase()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        coordinates: [
          route.stops[Math.floor(Math.random() * route.stops.length)].coordinates[1],
          route.stops[Math.floor(Math.random() * route.stops.length)].coordinates[0]
        ],
        nextStop: route.stops[Math.floor(Math.random() * route.stops.length)].name,
        estimatedArrival: Math.floor(Math.random() * 15) + 1,
        capacity: 50,
        currentCapacity: Math.floor(Math.random() * 50),
        speed: Math.floor(Math.random() * 40) + 10,
        heading: Math.floor(Math.random() * 360)
      }));
      setLiveBuses(simulatedBuses);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Select route effect
  useEffect(() => {
    if (selectedRouteId) {
      const route = busRoutes.find(r => r.id === selectedRouteId);
      setSelectedRoute(route || null);
    }
  }, [selectedRouteId]);

  const handleRouteSelect = (route: BusRoute) => {
    setSelectedRoute(route);
    setTrackingMode('route');
    if (onRouteSelect) onRouteSelect(route.id);
    
    // Announce route selection
    if (voiceRef.current) {
      voiceRef.current.announceRouteInfo(route.nameAm);
    }
  };

  const handleBusTracking = (bus: LiveBus) => {
    setTrackingMode('bus');
    setIsTracking(true);
    setEstimatedArrival(bus.estimatedArrival);
    
    // Announce bus arrival
    if (voiceRef.current) {
      voiceRef.current.announceArrival(selectedRoute?.nameAm || 'ይህ አውቶብስ', bus.estimatedArrival);
    }
  };

  const handleNavigationStart = () => {
    if (selectedRoute && userLocation) {
      setTrackingMode('navigation');
      setIsTracking(true);
      
      // Calculate estimated arrival time based on distance and speed
      const distance = calculateDistance(
        userLocation[0], userLocation[1],
        selectedRoute.endPoint.coordinates[1], selectedRoute.endPoint.coordinates[0]
      );
      const estimatedTime = Math.ceil(distance / 25 * 60); // Assume 25 km/h average speed
      setEstimatedArrival(estimatedTime);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number): number => deg * (Math.PI / 180);

  return (
    <div className={`advanced-map-container ${className}`}>
      {/* Voice Assistant */}
      <VoiceAssistant 
        ref={voiceRef}
        className="absolute top-4 left-4 z-1000"
        onCommand={(command) => {
          if (command.includes('መስመር ፈልግ')) {
            setTrackingMode('route');
          } else if (command.includes('አውቶብስ ከተተኮስ')) {
            setTrackingMode('bus');
          }
        }}
      />

      {/* Control Panel */}
      <Card className="absolute top-4 right-4 z-1000 w-80 bg-white/95 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-center">
            🇪🇹 AddisBus Connect 🚌
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Tracking Mode Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={trackingMode === 'route' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTrackingMode('route')}
              className="text-xs"
              title="መስመሮች አሳይ - Show all bus routes on the map"
            >
              <Route className="w-3 h-3 mr-1" />
              መስመሮች
            </Button>
            <Button
              variant={trackingMode === 'bus' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTrackingMode('bus')}
              className="text-xs"
              title="ቀጥታ ትራክንግ - Track buses in real-time"
            >
              <Bus className="w-3 h-3 mr-1" />
              ትራክንግ
            </Button>
            <Button
              variant={trackingMode === 'navigation' ? 'default' : 'outline'}
              size="sm"
              onClick={handleNavigationStart}
              className="text-xs"
              title="አቅጣጫ - Get turn-by-turn navigation"
            >
              <Navigation className="w-3 h-3 mr-1" />
              አቅጣጫ
            </Button>
          </div>

          {/* Route Selection */}
          {trackingMode === 'route' && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">የአውቶብስ መስመሮች:</h4>
              {busRoutes.slice(0, 3).map(route => (
                <Button
                  key={route.id}
                  variant={selectedRoute?.id === route.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleRouteSelect(route)}
                  className="w-full justify-start text-xs"
                  title={`${route.nameEn} - ዋጋ: ${route.price} ብር - ድግግሞሽ: በየ ${route.schedule.frequency} ደቂቃ`}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: route.color }}
                  />
                  {route.nameAm}
                </Button>
              ))}
            </div>
          )}

          {/* Live Buses */}
          {trackingMode === 'bus' && selectedRoute && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">ቀጥታ አውቶብሶች:</h4>
              {liveBuses
                .filter(bus => bus.routeId === selectedRoute.id)
                .slice(0, 2)
                .map(bus => (
                  <Card key={bus.id} className="p-2 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <div className="font-semibold">{bus.plateNumber}</div>
                        <div className="text-gray-600">ቀጣይ: {bus.nextStop}</div>
                      </div>
                      <div className="text-right text-xs">
                        <Badge variant="secondary" className="mb-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {bus.estimatedArrival}ደ
                        </Badge>
                        <div className="text-gray-600">
                          {bus.currentCapacity}/{bus.capacity} መቀመጫ
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBusTracking(bus)}
                      className="w-full mt-2 text-xs"
                      title="ይህንን አውቶብስ ይከተሉ - Track this specific bus"
                    >
                      ይህንን አውቶብስ ይከተሉ
                    </Button>
                  </Card>
                ))
              }
            </div>
          )}

          {/* Estimated Arrival */}
          {estimatedArrival && isTracking && (
            <Card className="p-2 bg-green-50 border-green-200">
              <div className="flex items-center justify-center text-sm">
                <AlertCircle className="w-4 h-4 mr-2 text-green-600" />
                <span className="font-semibold">በ {estimatedArrival} ደቂቃ ይደርሳል</span>
              </div>
            </Card>
          )}

          {/* Nearby Stops */}
          {nearbyStops.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">በአቅራቢያ ያሉ ማቆሚያዎች:</h4>
              {nearbyStops.slice(0, 3).map((stop, index) => (
                <div key={stop.id} className="text-xs p-2 bg-gray-50 rounded">
                  <div className="font-semibold">{stop.nameAm}</div>
                  <div className="text-gray-600">{stop.route}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map */}
      <MapContainer
        center={userLocation || [9.0320, 38.7469]}
        zoom={12}
        className="w-full h-96 rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <strong>የእርስዎ አካባቢ</strong>
                <br />
                Your Location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Selected Route */}
        {selectedRoute && trackingMode === 'route' && (
          <>
            {/* Route polyline */}
            <Polyline
              positions={selectedRoute.stops.map(stop => [stop.coordinates[1], stop.coordinates[0]])}
              color={selectedRoute.color}
              weight={6}
              opacity={0.7}
            />

            {/* Start point */}
            <Marker 
              position={[selectedRoute.startPoint.coordinates[1], selectedRoute.startPoint.coordinates[0]]} 
              icon={startIcon}
            >
              <Popup>
                <div className="text-center">
                  <strong>መነሻ: {selectedRoute.startPoint.nameAm}</strong>
                  <br />
                  Start: {selectedRoute.startPoint.name}
                  <br />
                  <Badge variant="secondary">ዋጋ: {selectedRoute.price} ብር</Badge>
                </div>
              </Popup>
            </Marker>

            {/* End point */}
            <Marker 
              position={[selectedRoute.endPoint.coordinates[1], selectedRoute.endPoint.coordinates[0]]} 
              icon={endIcon}
            >
              <Popup>
                <div className="text-center">
                  <strong>መድረሻ: {selectedRoute.endPoint.nameAm}</strong>
                  <br />
                  End: {selectedRoute.endPoint.name}
                  <br />
                  <Badge variant="secondary">ድግግሞሽ: በየ {selectedRoute.schedule.frequency}ደ</Badge>
                </div>
              </Popup>
            </Marker>

            {/* Bus stops */}
            {selectedRoute.stops.map(stop => (
              <Marker 
                key={stop.id} 
                position={[stop.coordinates[1], stop.coordinates[0]]}
                icon={createCustomIcon('#666', '●')}
              >
                <Popup>
                  <div className="text-center">
                    <strong>{stop.nameAm}</strong>
                    <br />
                    {stop.name}
                    <br />
                    <Badge variant="outline">ቅደም #{stop.order}</Badge>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}

        {/* Live Buses */}
        {trackingMode === 'bus' && liveBuses.map(bus => (
          <Marker 
            key={bus.id} 
            position={bus.coordinates} 
            icon={busIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>{bus.plateNumber}</strong>
                <br />
                ቀጣይ ማቆሚያ: {bus.nextStop}
                <br />
                <Badge variant="secondary">{bus.estimatedArrival} ደቂቃ</Badge>
                <br />
                <small>ፍጥነት: {bus.speed} ኪሜ/ሰ</small>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User location radius */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={1000} // 1km radius
            color="#FF6600"
            fillColor="#FF6600"
            fillOpacity={0.1}
            weight={2}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default AdvancedMap;