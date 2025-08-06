import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bus, 
  Route, 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp, 
  Activity,
  Navigation,
  Ticket,
  Star
} from 'lucide-react';
import { AnbessaLogo, ShegerLogo } from '@/components/ui/logos';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';

interface AnalyticsData {
  totalRoutes: number;
  activeRoutes: number;
  totalBuses: number;
  activeBuses: number;
  averageCapacity: number;
  popularRoutes: any[];
  recentActivity: any[];
}

interface RouteData {
  id: string;
  nameAm: string;
  nameEn: string;
  startPointNameAm: string;
  endPointNameAm: string;
  price: string;
  color: string;
  companyId: string;
  frequency: number;
}

interface BusData {
  id: string;
  plateNumber: string;
  routeName: string;
  coordinates: [number, number];
  currentCapacity: number;
  capacity: number;
  estimatedArrival: number;
  routeColor: string;
}

export default function Dashboard() {
  // const { t } = useTranslation(); // Temporarily disabled for demo

  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
    refetchInterval: 5000 // Update every 5 seconds
  });

  const { data: routes } = useQuery({
    queryKey: ['/api/routes'],
    refetchInterval: 10000
  });

  const { data: buses } = useQuery({
    queryKey: ['/api/buses/live'],
    refetchInterval: 3000 // Update every 3 seconds for live data
  });

  const analyticsData: AnalyticsData = (analytics as any)?.analytics || {
    totalRoutes: 0,
    activeRoutes: 0,
    totalBuses: 0,
    activeBuses: 0,
    averageCapacity: 0,
    popularRoutes: [],
    recentActivity: []
  };

  const routesData: RouteData[] = (routes as any)?.routes || [];
  const busesData: BusData[] = (buses as any)?.buses || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <AnbessaLogo className="h-10 w-10" />
                <ShegerLogo className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AddisBus Connect
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  የአዲስ አበባ የአውቶብስ ተከታታይ ሲስተም
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <Link href="/live-tracking">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Navigation className="h-4 w-4 mr-2" />
                  Live Map
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
              <Route className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.activeRoutes}/{analyticsData.totalRoutes}
              </div>
              <p className="text-xs text-green-100">
                ንቁ መስመሮች
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Buses</CardTitle>
              <Bus className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.activeBuses}/{analyticsData.totalBuses}
              </div>
              <p className="text-xs text-blue-100">
                በአገልግሎት ላይ የሚገኙ
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Capacity</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.averageCapacity.toFixed(0)}%
              </div>
              <p className="text-xs text-yellow-100">
                አማካይ ተሳፋሪዎች
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Real-time</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Live</div>
              <p className="text-xs text-red-100">
                ቀጥታ ሪፖርት
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="routes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="routes">Routes - መስመሮች</TabsTrigger>
            <TabsTrigger value="live">Live Buses - ቀጥታ</TabsTrigger>
            <TabsTrigger value="tickets">Tickets - ትኬቶች</TabsTrigger>
            <TabsTrigger value="analytics">Analytics - ትንተና</TabsTrigger>
          </TabsList>

          <TabsContent value="routes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Bus Routes - የአውቶብስ መስመሮች</h2>
              <Badge variant="secondary">{routesData.length} Routes</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routesData.map((route) => (
                <Card key={route.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {route.companyId === 'anbessa' ? (
                          <AnbessaLogo className="h-6 w-6" />
                        ) : (
                          <ShegerLogo className="h-6 w-6" />
                        )}
                        <Badge 
                          style={{ backgroundColor: route.color, color: 'white' }}
                          className="text-xs"
                        >
                          {route.companyId.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {route.price} ብር
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-sm">{route.nameAm}</CardTitle>
                    <CardDescription className="text-xs">
                      {route.nameEn}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-3 w-3 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {route.startPointNameAm}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-3 w-3 text-red-500" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {route.endPointNameAm}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-3 w-3 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Every {route.frequency} minutes
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Link href={`/routes/${route.id}`}>
                        <Button size="sm" variant="outline" className="flex-1">
                          View Route
                        </Button>
                      </Link>
                      <Link href={`/tickets/purchase?route=${route.id}`}>
                        <Button size="sm" className="flex-1">
                          <Ticket className="h-3 w-3 mr-1" />
                          Buy Ticket
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Live Bus Tracking - ቀጥታ የአውቶብስ ተከታታይ</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="h-3 w-3 mr-1" />
                {busesData.length} Live Buses
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {busesData.map((bus) => (
                <Card key={bus.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: bus.routeColor }}
                        />
                        <Badge variant="outline">{bus.plateNumber}</Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        ETA: {bus.estimatedArrival}m
                      </Badge>
                    </div>
                    <CardTitle className="text-sm">{bus.routeName}</CardTitle>
                    <CardDescription className="text-xs">
                      Live Location: {bus.coordinates[0].toFixed(4)}, {bus.coordinates[1].toFixed(4)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Capacity:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                              style={{ 
                                width: `${(bus.currentCapacity / bus.capacity) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {bus.currentCapacity}/{bus.capacity}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="w-full">
                        <MapPin className="h-3 w-3 mr-2" />
                        Track on Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            <div className="text-center py-12">
              <Ticket className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Digital Tickets - ዲጂታል ትኬቶች
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Purchase and manage your bus tickets digitally
              </p>
              <Link href="/tickets/purchase">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Ticket className="h-4 w-4 mr-2" />
                  Purchase Ticket - ትኬት ግዛ
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Routes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Popular Routes</CardTitle>
                  <CardDescription>በጣም ተወዳጅ መስመሮች</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.popularRoutes.slice(0, 3).map((route, index) => (
                      <div key={route.id} className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{route.nameAm}</div>
                          <div className="text-xs text-gray-500">{route.activeBuses} active buses</div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-sm font-medium">{(4.2 + Math.random() * 0.8).toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>የቅርብ ጊዜ እንቅስቃሴ</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={`${activity.id}-${index}`} className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div className="flex-1 text-sm">
                          <span className="font-medium">{activity.plateNumber}</span>
                          <span className="text-gray-500 ml-1">
                            on {activity.route} - {activity.capacity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(activity.lastUpdated).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}