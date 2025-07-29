import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LiveMap from "@/components/LiveMap";
import TicketPurchase from "./TicketPurchase";
import AdminDashboard from "./AdminDashboard";
import Navigation from "@/components/Navigation";
import type { Route, User } from "@shared/schema";
import { 
  MapPin, 
  Flag, 
  Search, 
  Locate, 
  Ticket, 
  Map, 
  Clock,
  Bus,
  TrendingUp,
  TargetIcon,
  Plus
} from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth() as { user: User | undefined };
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);

  const { data: routes, isLoading: routesLoading } = useQuery<Route[]>({
    queryKey: ['/api/routes'],
  });

  const quickActions = [
    { icon: <Locate className="h-6 w-6" />, label: t('quickActions.nearbyStops') },
    { icon: <Ticket className="h-6 w-6" />, label: t('quickActions.myTickets') },
    { icon: <Map className="h-6 w-6" />, label: t('quickActions.liveMap') },
    { icon: <Clock className="h-6 w-6" />, label: t('quickActions.schedules') },
  ];

  const getNextBusTime = () => {
    const times = ['3 min', '5 min', '8 min', '12 min'];
    return times[Math.floor(Math.random() * times.length)];
  };

  const getNextBusColor = (time: string) => {
    const minutes = parseInt(time);
    if (minutes <= 5) return 'text-success';
    if (minutes <= 10) return 'text-warning';
    return 'text-gray-600';
  };

  if (selectedRoute) {
    return <TicketPurchase route={selectedRoute} onBack={() => setSelectedRoute(null)} />;
  }

  if (showAdmin && user?.role === 'admin') {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-medium mb-2">{t('search.title')}</h2>
          <p className="text-blue-100 mb-4">{t('search.subtitle')}</p>
          
          {/* Quick Search */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('search.from')}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t('search.fromPlaceholder')}
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex-1">
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('search.to')}
                </Label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t('search.toPlaceholder')}
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button className="bg-secondary hover:bg-yellow-500 text-gray-900 font-medium sm:self-end">
                <Search className="h-4 w-4 mr-2" />
                {t('search.searchButton')}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 bg-white hover:shadow-md transition-shadow"
            >
              <div className="text-primary">{action.icon}</div>
              <span className="text-sm font-medium text-center">{action.label}</span>
            </Button>
          ))}
        </div>
        
        {/* Popular Routes */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              {t('routes.popular')}
            </h3>
            <div className="space-y-3">
              {routesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                routes?.map((route) => {
                  const nextBus = getNextBusTime();
                  return (
                    <div
                      key={route.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Bus className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{route.nameEn}</div>
                          <div className="text-sm text-gray-500">
                            {t('routes.every')} {route.frequencyMinutes} {t('routes.minutesShort')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getNextBusColor(nextBus)}`}>
                          {t('routes.next')}: {nextBus}
                        </div>
                        <div className="text-xs text-gray-500">{route.price} {t('common.etb')}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Live Bus Tracking */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <TargetIcon className="h-5 w-5 mr-2 text-success" />
              {t('liveTracking.title')}
              <span className="ml-2 px-2 py-1 bg-success text-white text-xs rounded-full">
                {t('liveTracking.live')}
              </span>
            </h3>
            
            <LiveMap />
          </CardContent>
        </Card>

        {/* Admin Access */}
        {user?.role === 'admin' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{t('admin.dashboard')}</h3>
                  <p className="text-gray-600">Manage buses, routes, and view analytics</p>
                </div>
                <Button onClick={() => setShowAdmin(true)}>
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      {/* Floating Action Button */}
      <Button 
        className="fixed bottom-20 right-4 md:bottom-6 bg-secondary hover:bg-yellow-500 text-gray-900 w-14 h-14 rounded-full shadow-lg z-30"
        size="lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
