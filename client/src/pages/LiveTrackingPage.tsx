import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EnhancedLiveMap from '@/components/EnhancedLiveMap';
import RouteSearch from '@/components/RouteSearch';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Bus, Clock, Users, Map, X } from 'lucide-react';

export default function LiveTrackingPage() {
  const [activeTab, setActiveTab] = useState('routes');
  const [showMap, setShowMap] = useState(false);
  
  // Mock data for demonstration
  const popularRoutes = [
    { id: '1', name: 'Meskel - Bole', buses: 4, nextBus: '3 min' },
    { id: '2', name: 'Piassa - Mexico', buses: 3, nextBus: '5 min' },
    { id: '3', name: 'Arat Kilo - Merkato', buses: 5, nextBus: '2 min' },
  ];

  const nearbyStops = [
    { id: 's1', name: 'Meskel Square', distance: '0.2 km', routes: ['1', '2', '3'] },
    { id: 's2', name: 'Mexico Square', distance: '1.5 km', routes: ['2', '4'] },
    { id: 's3', name: 'Arat Kilo', distance: '2.1 km', routes: ['3', '5'] },
  ];

  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    setSelectedPlace(place);
    if (place?.geometry?.location) {
      setMapCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Live Bus Tracking</h1>
        <Button 
          variant={showMap ? "outline" : "default"} 
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2"
        >
          {showMap ? (
            <>
              <X className="h-4 w-4" />
              <span>Hide Map</span>
            </>
          ) : (
            <>
              <Map className="h-4 w-4" />
              <span>Show Map</span>
            </>
          )}
        </Button>
      </div>
      
      <div className="mb-6">
        <RouteSearch 
          onSelectPlace={handlePlaceSelect} 
          placeholder="Search for a location, bus stop, or address..."
          className="w-full max-w-2xl mx-auto"
        />
        
        {selectedPlace && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900">{selectedPlace.name}</h3>
                {selectedPlace.formatted_address && (
                  <p className="text-sm text-blue-700">{selectedPlace.formatted_address}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showMap && (
        <div className="mb-6 rounded-lg border overflow-hidden shadow-sm">
          <EnhancedLiveMap />
        </div>
      )}

      <Tabs 
        value={activeTab}
        onValueChange={setShowMap ? (value) => {
          setActiveTab(value);
          if (value === 'map') setShowMap(true);
        } : setActiveTab}
        className="w-full flex flex-col h-full"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-4">
          <TabsTrigger 
            value="map" 
            className="flex items-center gap-2"
            onClick={() => setShowMap(true)}
          >
            <MapPin className="h-4 w-4" />
            <span>Map View</span>
          </TabsTrigger>
          <TabsTrigger 
            value="routes" 
            className="flex items-center gap-2"
          >
            <Bus className="h-4 w-4" />
            <span>Routes</span>
          </TabsTrigger>
          <TabsTrigger 
            value="stops" 
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            <span>Nearby Stops</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="flex-1 flex flex-col min-h-0">
          <div className="text-center py-8 text-gray-500">
            <Map className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Map is currently {showMap ? 'visible' : 'hidden'}. Use the toggle above to {showMap ? 'hide' : 'show'} it.</p>
          </div>
        </TabsContent>

        <TabsContent value="routes">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularRoutes.map((route) => (
              <Card key={route.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{route.name}</span>
                    <span className="text-sm font-normal text-gray-500">{route.buses} buses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Next bus in {route.nextBus}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stops">
          <div className="space-y-4">
            {nearbyStops.map((stop) => (
              <Card key={stop.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{stop.name}</h3>
                      <p className="text-sm text-gray-500">{stop.distance} away</p>
                    </div>
                    <div className="flex space-x-1">
                      {stop.routes.map((route) => (
                        <span 
                          key={route} 
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                        >
                          {route}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    View Arrivals
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
