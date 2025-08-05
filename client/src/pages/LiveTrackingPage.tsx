import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedLiveMap from '@/components/EnhancedLiveMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Clock, MapPin, Users } from 'lucide-react';

export default function LiveTrackingPage() {
  const [activeTab, setActiveTab] = useState('map');
  
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Live Bus Tracking</h1>
        <p className="text-gray-600 mt-2">
          Track buses in real-time and get accurate arrival predictions
        </p>
      </div>

      <Tabs 
        defaultValue="map" 
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="stops">Nearby Stops</TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <EnhancedLiveMap />
        </TabsContent>

        <TabsContent value="routes">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularRoutes.map((route) => (
              <Card key={route.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Bus className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{route.buses} active buses</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Next bus in {route.nextBus}</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    View on Map
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stops">
          <div className="space-y-4">
            {nearbyStops.map((stop) => (
              <Card key={stop.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-lg">{stop.name}</CardTitle>
                  </div>
                  <p className="text-sm text-gray-500">{stop.distance} away</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {stop.routes.map((route) => (
                      <span 
                        key={route} 
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        Route {route}
                      </span>
                    ))}
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
