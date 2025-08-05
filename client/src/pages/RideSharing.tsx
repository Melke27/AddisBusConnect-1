import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { Car, Phone, MapPin, Clock, Star, ExternalLink, Navigation as NavigationIcon } from "lucide-react";

interface RideOption {
  id: string;
  type: 'taxi' | 'rideshare' | 'bajaj';
  name: string;
  phone?: string;
  estimatedTime: string;
  estimatedFare: string;
  rating: number;
  description: string;
  available: boolean;
}

export default function RideSharing() {
  const { t } = useLanguage();
  
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [searchResults, setSearchResults] = useState<RideOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockRideOptions: RideOption[] = [
    {
      id: '1',
      type: 'rideshare',
      name: 'Ride Ethiopia',
      estimatedTime: '5-8 min',
      estimatedFare: '45-60 ETB',
      rating: 4.5,
      description: 'Comfortable sedan, GPS tracking, cashless payment',
      available: true
    },
    {
      id: '2',
      type: 'taxi',
      name: 'Yellow Taxi Service',
      phone: '+251-911-123456',
      estimatedTime: '10-15 min',
      estimatedFare: '50-70 ETB',
      rating: 4.2,
      description: 'Traditional taxi service, call to book',
      available: true
    },
    {
      id: '3',
      type: 'bajaj',
      name: 'Bajaj Connect',
      phone: '+251-911-789012',
      estimatedTime: '3-5 min',
      estimatedFare: '25-35 ETB',
      rating: 4.0,
      description: 'Quick and affordable three-wheeler service',
      available: true
    },
    {
      id: '4',
      type: 'rideshare',
      name: 'ZayRide',
      estimatedTime: '7-12 min',
      estimatedFare: '40-55 ETB',
      rating: 4.3,
      description: 'Local rideshare app with competitive prices',
      available: false
    }
  ];

  const handleSearch = () => {
    if (!fromLocation.trim() || !toLocation.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockRideOptions);
      setIsSearching(false);
    }, 1500);
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'taxi':
      case 'rideshare':
        return <Car className="h-5 w-5" />;
      case 'bajaj':
        return <NavigationIcon className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'taxi': return 'bg-yellow-100 text-yellow-800';
      case 'rideshare': return 'bg-blue-100 text-blue-800';
      case 'bajaj': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'taxi': return 'Taxi';
      case 'rideshare': return 'Ride Share';
      case 'bajaj': return 'Bajaj';
      default: return 'Vehicle';
    }
  };

  const handleBookRide = (option: RideOption) => {
    if (option.phone) {
      window.open(`tel:${option.phone}`, '_self');
    } else {
      // In a real app, this would open the respective app or website
      alert(`Opening ${option.name} app...`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Car className="h-6 w-6" />
            Last-Mile Transportation
          </h1>
          <p className="text-gray-600 mt-1">Find taxi and rideshare options to complete your journey</p>
        </div>

        {/* Search Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Find Transportation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="from">From (Bus Station/Current Location)</Label>
                <Input
                  id="from"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="e.g., Meskel Square Station"
                />
              </div>
              
              <div>
                <Label htmlFor="to">To (Final Destination)</Label>
                <Input
                  id="to"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="e.g., Bole Atlas Hotel"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSearch} 
              className="w-full"
              disabled={isSearching || !fromLocation.trim() || !toLocation.trim()}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                'Find Transportation Options'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Available Transportation Options</h2>
            
            {searchResults.map((option) => (
              <Card key={option.id} className={!option.available ? 'opacity-60' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getVehicleIcon(option.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{option.name}</h3>
                          <Badge className={getTypeColor(option.type)}>
                            {getTypeName(option.type)}
                          </Badge>
                          {!option.available && (
                            <Badge variant="secondary">Unavailable</Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{option.estimatedTime}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{option.estimatedFare}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{option.rating}</span>
                          </div>
                        </div>
                        
                        {option.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                            <Phone className="h-4 w-4" />
                            <span>{option.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleBookRide(option)}
                        disabled={!option.available}
                        className="min-w-[100px]"
                      >
                        {option.phone ? 'Call Now' : 'Book Ride'}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Information Cards */}
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          {/* Popular Services */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Services in Addis Ababa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Ride Ethiopia</h4>
                    <p className="text-sm text-gray-600">Most popular rideshare app</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">App</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">ZayRide</h4>
                    <p className="text-sm text-gray-600">Local rideshare service</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">App</Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Yellow Taxi</h4>
                    <p className="text-sm text-gray-600">Traditional taxi service</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Call</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips & Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Transportation Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Safety First</h4>
                  <p className="text-gray-600">Always verify driver details and share your trip with someone</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-1">Payment Options</h4>
                  <p className="text-gray-600">Most services accept cash, Telebirr, and mobile payments</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-1">Peak Hours</h4>
                  <p className="text-gray-600">Expect higher fares and longer wait times during rush hours</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-1">Bajaj (Three-wheeler)</h4>
                  <p className="text-gray-600">Great for short distances and navigating traffic</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Transportation Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-800">Emergency Taxi</h4>
                <p className="text-red-600 font-mono text-lg">911</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Tourist Police</h4>
                <p className="text-blue-600 font-mono text-lg">+251-111-551-888</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Airport Shuttle</h4>
                <p className="text-green-600 font-mono text-lg">+251-116-650-000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

