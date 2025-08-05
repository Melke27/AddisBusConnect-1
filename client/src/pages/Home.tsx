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
import QRScanner from "@/components/QRScanner";
import VoiceGuide from "@/components/VoiceGuide";
import ChatBot from "@/components/ChatBot";
import type { IRoute, IUser, IStop } from "@shared/schema";
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
  Plus,
  Calendar,
  Bell,
  ArrowRight,
  MessageCircle,
  Route
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth() as { user: IUser | undefined };
  const [selectedRoute, setSelectedRoute] = useState<IRoute | null>(null);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchResults, setSearchResults] = useState<IRoute[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data: routes, isLoading: routesLoading } = useQuery<IRoute[]>({
    queryKey: ['/api/routes'],
  });

  const { data: stops, isLoading: stopsLoading } = useQuery<IStop[]>({
    queryKey: ['/api/stops'],
  });

  const quickActions = [
    { icon: <Locate className="h-6 w-6" />, label: t('quickActions.nearbyStops') || 'Nearby Stops' },
    { icon: <Ticket className="h-6 w-6" />, label: t('quickActions.myTickets') || 'My Tickets' },
    { icon: <Map className="h-6 w-6" />, label: t('quickActions.liveMap') || 'Live Map' },
    { icon: <Clock className="h-6 w-6" />, label: t('quickActions.schedules') || 'Schedules' },
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

  // Search function
  const handleSearch = () => {
    if (!searchFrom.trim() && !searchTo.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (!routes) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      const filteredRoutes = routes.filter(route => {
        const fromMatch = searchFrom.trim() && 
          (route.nameEn.toLowerCase().includes(searchFrom.toLowerCase()) ||
           route.nameAm?.toLowerCase().includes(searchFrom.toLowerCase()) ||
           route.nameOm?.toLowerCase().includes(searchFrom.toLowerCase()));
        
        const toMatch = searchTo.trim() && 
          (route.nameEn.toLowerCase().includes(searchTo.toLowerCase()) ||
           route.nameAm?.toLowerCase().includes(searchTo.toLowerCase()) ||
           route.nameOm?.toLowerCase().includes(searchTo.toLowerCase()));

        // Also search through stops if available
        if (stops) {
          const fromStopMatch = searchFrom.trim() && 
            stops.some(stop => 
              stop.nameEn.toLowerCase().includes(searchFrom.toLowerCase()) ||
              stop.nameAm?.toLowerCase().includes(searchFrom.toLowerCase()) ||
              stop.nameOm?.toLowerCase().includes(searchFrom.toLowerCase())
            );
          
          const toStopMatch = searchTo.trim() && 
            stops.some(stop => 
              stop.nameEn.toLowerCase().includes(searchTo.toLowerCase()) ||
              stop.nameAm?.toLowerCase().includes(searchTo.toLowerCase()) ||
              stop.nameOm?.toLowerCase().includes(searchTo.toLowerCase())
            );

          if (searchFrom.trim() && searchTo.trim()) {
            return (fromMatch || fromStopMatch) && (toMatch || toStopMatch);
          } else if (searchFrom.trim()) {
            return fromMatch || fromStopMatch;
          } else if (searchTo.trim()) {
            return toMatch || toStopMatch;
          }
        } else {
          if (searchFrom.trim() && searchTo.trim()) {
            return fromMatch && toMatch;
          } else if (searchFrom.trim()) {
            return fromMatch;
          } else if (searchTo.trim()) {
            return toMatch;
          }
        }
        
        return false;
      });

      setSearchResults(filteredRoutes);
      setIsSearching(false);
    }, 500);
  };

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
        {/* Welcome Section with Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mr-4">
              <Bus className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">Welcome to AddisBus Connect</h1>
              <p className="text-gray-600">Your smart transportation assistant for Addis Ababa</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-medium mb-2 text-white">
            {t('search.title') || 'Find Your Bus'}
          </h2>
          <p className="text-blue-100 mb-4">
            {t('search.subtitle') || 'Track buses in real-time and buy digital tickets'}
          </p>
          
          {/* Quick Search */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('search.from') || 'From'}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t('search.fromPlaceholder') || 'Enter starting point (e.g., Arat Kilo, Bole)'}
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 text-gray-900"
                  />
                </div>
              </div>
              <div className="flex-1">
                <Label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('search.to') || 'To'}
                </Label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t('search.toPlaceholder') || 'Enter destination (e.g., Merkato, Piassa)'}
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 text-gray-900"
                  />
                </div>
              </div>
              <Button 
                className="bg-secondary hover:bg-yellow-500 text-gray-900 font-medium sm:self-end"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {isSearching ? 'Searching...' : (t('search.searchButton') || 'Search')}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Route className="h-5 w-5 mr-2 text-primary" />
                Search Results ({searchResults.length})
              </h3>
              <div className="space-y-3">
                {searchResults.map((route) => {
                  const nextBus = getNextBusTime();
                  return (
                    <div
                      key={route._id}
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
                            Every {route.frequencyMinutes} minutes • {route.price} ETB
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getNextBusColor(nextBus)}`}>
                          Next: {nextBus}
                        </div>
                        <Link href={`/routes/${route._id}`}>
                          <ArrowRight className="h-4 w-4 text-gray-400 mt-1" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Bus Stations */}
        {stops && stops.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Popular Bus Stations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stops.slice(0, 8).map((stop) => (
                  <div
                    key={stop._id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => setSearchFrom(stop.nameEn)}
                  >
                    <div className="font-medium text-sm">{stop.nameEn}</div>
                    <div className="text-xs text-gray-500">{stop.nameAm}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Link href="/schedule">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 bg-white hover:shadow-md transition-shadow w-full"
            >
              <div className="text-primary"><Calendar className="h-6 w-6" /></div>
              <span className="text-sm font-medium text-center text-gray-900">Schedules</span>
            </Button>
          </Link>
          
          <Link href="/notifications">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 bg-white hover:shadow-md transition-shadow w-full"
            >
              <div className="text-primary"><Bell className="h-6 w-6" /></div>
              <span className="text-sm font-medium text-center text-gray-900">Notifications</span>
            </Button>
          </Link>
          
          <Link href="/tickets">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 bg-white hover:shadow-md transition-shadow w-full"
            >
              <div className="text-primary"><Ticket className="h-6 w-6" /></div>
              <span className="text-sm font-medium text-center text-gray-900">My Tickets</span>
            </Button>
          </Link>
          
          <QRScanner />
          
          <Link href="/feedback">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 bg-white hover:shadow-md transition-shadow w-full"
            >
              <div className="text-primary"><MessageCircle className="h-6 w-6" /></div>
              <span className="text-sm font-medium text-center">Feedback</span>
            </Button>
          </Link>
        </div>
        
        {/* Popular Routes */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Popular Routes
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
                      key={route._id}
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
                            Every {route.frequencyMinutes} minutes • {route.price} ETB
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getNextBusColor(nextBus)}`}>
                          Next: {nextBus}
                        </div>
                        <Link href={`/routes/${route._id}`}>
                          <ArrowRight className="h-4 w-4 text-gray-400 mt-1" />
                        </Link>
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
              <TargetIcon className="h-5 w-5 mr-2 text-green-600" />
              Live Bus Tracking
              <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                LIVE
              </span>
            </h3>
            
            <LiveMap />
          </CardContent>
        </Card>

        {/* Voice Guide */}
        <VoiceGuide 
          text="Welcome to AddisBus Connect. Your smart transportation assistant for Addis Ababa."
          autoSpeak={false}
        />
        
        {/* Admin Access */}
        {user?.role === 'admin' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Admin Dashboard</h3>
                  <p className="text-gray-600">Manage buses, routes, and view analytics</p>
                </div>
                <Link href="/admin">
                  <Button>View Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      
      {/* ChatBot */}
      <ChatBot />
      
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
