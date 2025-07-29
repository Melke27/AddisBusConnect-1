import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { Clock, Bus, MapPin, Calendar, DollarSign } from "lucide-react";
import { Link } from "wouter";

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

export default function Schedule() {
  const { t, language } = useLanguage();

  const { data: routes = [], isLoading } = useQuery<Route[]>({
    queryKey: ['/api/routes'],
  });

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getScheduleForRoute = (route: Route) => {
    const schedule = [];
    const startTime = route.startTimeHour * 60 + route.startTimeMinute;
    const endTime = route.endTimeHour * 60 + route.endTimeMinute;
    
    for (let time = startTime; time <= endTime; time += route.frequencyMinutes) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      schedule.push(formatTime(hour, minute));
    }
    
    return schedule;
  };

  const getNextBusTime = (route: Route) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = route.startTimeHour * 60 + route.startTimeMinute;
    const endTime = route.endTimeHour * 60 + route.endTimeMinute;

    if (currentTime < startTime) {
      return { time: formatTime(route.startTimeHour, route.startTimeMinute), status: 'upcoming' };
    }

    if (currentTime > endTime) {
      return { time: "Service ended", status: 'ended' };
    }

    const timeSinceStart = currentTime - startTime;
    const bussesPassed = Math.floor(timeSinceStart / route.frequencyMinutes);
    const nextBusTime = startTime + ((bussesPassed + 1) * route.frequencyMinutes);

    if (nextBusTime > endTime) {
      return { time: "Service ended", status: 'ended' };
    }

    const nextHour = Math.floor(nextBusTime / 60);
    const nextMinute = nextBusTime % 60;
    return { time: formatTime(nextHour, nextMinute), status: 'next' };
  };

  const activeRoutes = routes.filter(route => route.isActive);
  const inactiveRoutes = routes.filter(route => !route.isActive);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <div className="container mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Bus Schedules</h1>
          <p className="text-gray-600">Real-time schedules for all bus routes in Addis Ababa</p>
        </div>

        {/* Tabs for Active/Inactive Routes */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Routes ({activeRoutes.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Routes ({inactiveRoutes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeRoutes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active routes available</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {activeRoutes.map((route) => {
                  const routeName = language === 'am' ? route.nameAm : 
                                   language === 'om' ? route.nameOm : route.nameEn;
                  const schedule = getScheduleForRoute(route);
                  const nextBus = getNextBusTime(route);

                  return (
                    <Card key={route._id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Bus className="h-6 w-6 text-primary" />
                            {routeName}
                          </CardTitle>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Route Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-gray-600">Operating Hours</p>
                              <p className="text-sm font-medium">
                                {formatTime(route.startTimeHour, route.startTimeMinute)} - {formatTime(route.endTimeHour, route.endTimeMinute)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-gray-600">Frequency</p>
                              <p className="text-sm font-medium">Every {route.frequencyMinutes} min</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-gray-600">Fare</p>
                              <p className="text-sm font-medium">{route.price} ETB</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-xs text-gray-600">Next Bus</p>
                              <p className={`text-sm font-medium ${
                                nextBus.status === 'ended' ? 'text-red-600' : 
                                nextBus.status === 'next' ? 'text-green-600' : 'text-blue-600'
                              }`}>
                                {nextBus.time}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Schedule Grid */}
                        <div>
                          <h4 className="font-medium mb-3">Today's Schedule</h4>
                          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                            {schedule.map((time, index) => {
                              const now = new Date();
                              const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                              const isPast = time < currentTime;
                              const isNext = time === nextBus.time && nextBus.status === 'next';

                              return (
                                <div
                                  key={index}
                                  className={`text-center p-2 rounded text-sm ${
                                    isNext ? 'bg-green-100 text-green-800 font-bold border-2 border-green-300' :
                                    isPast ? 'bg-gray-100 text-gray-500' :
                                    'bg-blue-50 text-blue-700'
                                  }`}
                                >
                                  {time}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link href={`/routes/${route._id}`}>
                            <Button variant="outline" size="sm">
                              <MapPin className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/purchase?routeId=${route._id}`}>
                            <Button size="sm">
                              <DollarSign className="h-4 w-4 mr-2" />
                              Buy Ticket
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive" className="space-y-6">
            {inactiveRoutes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No inactive routes</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {inactiveRoutes.map((route) => {
                  const routeName = language === 'am' ? route.nameAm : 
                                   language === 'om' ? route.nameOm : route.nameEn;

                  return (
                    <Card key={route._id} className="opacity-75">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Bus className="h-6 w-6 text-gray-400" />
                            {routeName}
                          </CardTitle>
                          <Badge variant="secondary">Inactive</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-600">Operating Hours</p>
                              <p className="text-sm">
                                {formatTime(route.startTimeHour, route.startTimeMinute)} - {formatTime(route.endTimeHour, route.endTimeMinute)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-600">Frequency</p>
                              <p className="text-sm">Every {route.frequencyMinutes} min</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-600">Fare</p>
                              <p className="text-sm">{route.price} ETB</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-4">This route is currently inactive</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}