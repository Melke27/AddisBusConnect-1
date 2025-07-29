import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";
import { Clock, MapPin, Bus, Users, DollarSign, Calendar } from "lucide-react";
import { Link } from "wouter";
import LiveMap from "@/components/LiveMap";

interface Route {
  _id: string;
  nameEn: string;
  nameAm: string;
  nameOm: string;
  startTimeHour: number;
  startTimeMinute: number;
  endTimeHour: number;
  endTimeMinute: number;
  frequencyMinutes: number;
  price: number;
  isActive: boolean;
}

interface Bus {
  _id: string;
  plateNumber: string;
  routeId: string;
  status: string;
  currentLatitude?: number;
  currentLongitude?: number;
  lastUpdated: string;
}

export default function RouteDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();

  const { data: route, isLoading: routeLoading } = useQuery<Route>({
    queryKey: ['/api/routes', id],
    enabled: !!id,
  });

  const { data: buses = [], isLoading: busesLoading } = useQuery<Bus[]>({
    queryKey: ['/api/buses', { routeId: id }],
    queryFn: async () => {
      const response = await fetch('/api/buses');
      const allBuses = await response.json();
      return allBuses.filter((bus: Bus) => bus.routeId === id);
    },
    enabled: !!id,
  });

  if (routeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Route not found</p>
            <Link href="/">
              <Button className="mt-4">Go Back Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const routeName = language === 'am' ? route.nameAm : 
                   language === 'om' ? route.nameOm : route.nameEn;

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getNextBusTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    const startTime = route.startTimeHour * 60 + route.startTimeMinute;
    const endTime = route.endTimeHour * 60 + route.endTimeMinute;

    if (currentTime < startTime) {
      return formatTime(route.startTimeHour, route.startTimeMinute);
    }

    if (currentTime > endTime) {
      return "Service ended for today";
    }

    // Calculate next bus time
    const timeSinceStart = currentTime - startTime;
    const bussesPassed = Math.floor(timeSinceStart / route.frequencyMinutes);
    const nextBusTime = startTime + ((bussesPassed + 1) * route.frequencyMinutes);

    if (nextBusTime > endTime) {
      return "Service ended for today";
    }

    const nextHour = Math.floor(nextBusTime / 60);
    const nextMinute = nextBusTime % 60;
    return formatTime(nextHour, nextMinute);
  };

  const activeBuses = buses.filter(bus => bus.status === 'active');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" size="sm">← Back</Button>
          </Link>
          <Badge variant={route.isActive ? "default" : "secondary"}>
            {route.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Route Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-6 w-6 text-primary" />
              {routeName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Schedule Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Operating Hours</p>
                  <p className="font-medium">
                    {formatTime(route.startTimeHour, route.startTimeMinute)} - {formatTime(route.endTimeHour, route.endTimeMinute)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Frequency</p>
                  <p className="font-medium">Every {route.frequencyMinutes} min</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Fare</p>
                  <p className="font-medium">{route.price} ETB</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Active Buses</p>
                  <p className="font-medium">{activeBuses.length}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Next Bus */}
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Next Bus
              </h3>
              <p className="text-2xl font-bold text-primary">
                {getNextBusTime()}
              </p>
            </div>

            {/* Purchase Ticket Button */}
            <Link href={`/purchase?routeId=${route._id}`}>
              <Button className="w-full" size="lg">
                Purchase Ticket - {route.price} ETB
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Live Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Live Bus Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 rounded-lg overflow-hidden">
              <LiveMap />
            </div>
          </CardContent>
        </Card>

        {/* Bus List */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status</CardTitle>
          </CardHeader>
          <CardContent>
            {busesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-3 bg-gray-100 rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {activeBuses.map((bus) => (
                  <div key={bus._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Bus className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{bus.plateNumber}</p>
                        <p className="text-sm text-gray-600">
                          Last updated: {new Date(bus.lastUpdated).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={bus.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {bus.status}
                    </Badge>
                  </div>
                ))}
                {activeBuses.length === 0 && (
                  <p className="text-center text-gray-600 py-8">
                    No active buses on this route
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}