import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  MapPin, 
  Clock, 
  ArrowRight, 
  Bus, 
  Footprints,
  Navigation,
  Route,
  Timer,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface TripSegment {
  id: string;
  type: 'walk' | 'bus' | 'wait';
  duration: number; // minutes
  distance?: number; // meters
  from: string;
  to: string;
  routeName?: string;
  busId?: string;
  instructions?: string;
  cost?: number;
  crowdingLevel?: 'low' | 'medium' | 'high' | 'full';
}

interface TripOption {
  id: string;
  totalDuration: number;
  totalCost: number;
  totalWalkingDistance: number;
  segments: TripSegment[];
  score: number;
  carbonSaving?: number; // kg CO2 vs driving
  accessibility: 'high' | 'medium' | 'low';
  realTimeUpdates: boolean;
}

interface MultiModalTripPlannerProps {
  defaultFrom?: string;
  defaultTo?: string;
}

const MultiModalTripPlanner: React.FC<MultiModalTripPlannerProps> = ({ 
  defaultFrom = '', 
  defaultTo = '' 
}) => {
  const { t } = useLanguage();
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [tripOptions, setTripOptions] = useState<TripOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripOption | null>(null);
  const [preferences, setPreferences] = useState({
    prioritize: 'time', // 'time', 'cost', 'comfort', 'environment'
    maxWalkingDistance: 1000, // meters
    avoidCrowded: true,
    accessibilityNeeds: false
  });

  // Mock trip planning data
  const mockTripOptions: TripOption[] = [
    {
      id: '1',
      totalDuration: 45,
      totalCost: 15.50,
      totalWalkingDistance: 800,
      score: 85,
      carbonSaving: 2.3,
      accessibility: 'high',
      realTimeUpdates: true,
      segments: [
        {
          id: '1-1',
          type: 'walk',
          duration: 8,
          distance: 600,
          from: 'Current Location',
          to: 'Arat Kilo Bus Stop',
          instructions: 'Walk north on Haile Gebre Selassie Road'
        },
        {
          id: '1-2',
          type: 'wait',
          duration: 3,
          from: 'Arat Kilo Bus Stop',
          to: 'Arat Kilo Bus Stop',
          instructions: 'Wait for Route 3 bus'
        },
        {
          id: '1-3',
          type: 'bus',
          duration: 25,
          from: 'Arat Kilo',
          to: 'Meskel Square',
          routeName: 'Route 3: Arat Kilo - Meskel Square',
          busId: 'ANB-045',
          cost: 8.50,
          crowdingLevel: 'medium'
        },
        {
          id: '1-4',
          type: 'walk',
          duration: 5,
          distance: 200,
          from: 'Meskel Square Bus Stop',
          to: 'Destination',
          instructions: 'Walk east to final destination'
        },
        {
          id: '1-5',
          type: 'bus',
          duration: 12,
          from: 'Meskel Square',
          to: 'Bole',
          routeName: 'Route 7: Meskel - Bole',
          busId: 'SHG-102',
          cost: 7.00,
          crowdingLevel: 'low'
        },
        {
          id: '1-6',
          type: 'walk',
          duration: 4,
          distance: 300,
          from: 'Bole Bus Stop',
          to: 'Final Destination',
          instructions: 'Walk south to destination'
        }
      ]
    },
    {
      id: '2',
      totalDuration: 52,
      totalCost: 12.00,
      totalWalkingDistance: 1200,
      score: 78,
      carbonSaving: 2.1,
      accessibility: 'medium',
      realTimeUpdates: true,
      segments: [
        {
          id: '2-1',
          type: 'walk',
          duration: 12,
          distance: 900,
          from: 'Current Location',
          to: 'Piazza Bus Stop',
          instructions: 'Walk via Mexico Square'
        },
        {
          id: '2-2',
          type: 'bus',
          duration: 35,
          from: 'Piazza',
          to: 'Bole',
          routeName: 'Route 1: Piazza - Bole Direct',
          busId: 'ANB-023',
          cost: 12.00,
          crowdingLevel: 'high'
        },
        {
          id: '2-3',
          type: 'walk',
          duration: 5,
          distance: 300,
          from: 'Bole Bus Stop',
          to: 'Final Destination',
          instructions: 'Walk to final destination'
        }
      ]
    }
  ];

  const planTrip = async () => {
    if (!from.trim() || !to.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter and sort options based on preferences
    let filteredOptions = [...mockTripOptions];
    
    if (preferences.avoidCrowded) {
      filteredOptions = filteredOptions.filter(option => 
        !option.segments.some(segment => segment.crowdingLevel === 'full')
      );
    }
    
    if (preferences.maxWalkingDistance < 1000) {
      filteredOptions = filteredOptions.filter(option => 
        option.totalWalkingDistance <= preferences.maxWalkingDistance
      );
    }
    
    // Sort by preference
    switch (preferences.prioritize) {
      case 'time':
        filteredOptions.sort((a, b) => a.totalDuration - b.totalDuration);
        break;
      case 'cost':
        filteredOptions.sort((a, b) => a.totalCost - b.totalCost);
        break;
      case 'environment':
        filteredOptions.sort((a, b) => (b.carbonSaving || 0) - (a.carbonSaving || 0));
        break;
      default:
        filteredOptions.sort((a, b) => b.score - a.score);
    }
    
    setTripOptions(filteredOptions);
    setLoading(false);
  };

  const getSegmentIcon = (type: string) => {
    switch (type) {
      case 'walk': return <Footprints className="h-4 w-4" />;
      case 'bus': return <Bus className="h-4 w-4" />;
      case 'wait': return <Clock className="h-4 w-4" />;
      default: return <Navigation className="h-4 w-4" />;
    }
  };

  const getSegmentColor = (type: string) => {
    switch (type) {
      case 'walk': return 'text-blue-600 bg-blue-50';
      case 'bus': return 'text-green-600 bg-green-50';
      case 'wait': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCrowdingColor = (level?: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'full': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Route className="h-5 w-5 mr-2 text-primary" />
          Multi-Modal Trip Planner
          <Badge variant="secondary" className="ml-2">BETA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="plan" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plan">Plan Trip</TabsTrigger>
            <TabsTrigger value="options">Trip Options</TabsTrigger>
            <TabsTrigger value="details">Trip Details</TabsTrigger>
          </TabsList>

          {/* Plan Trip Tab */}
          <TabsContent value="plan" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Starting location (e.g., Arat Kilo)"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Destination (e.g., Bole Airport)"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Trip Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trip Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Prioritize</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={preferences.prioritize}
                      onChange={(e) => setPreferences({...preferences, prioritize: e.target.value})}
                    >
                      <option value="time">Fastest</option>
                      <option value="cost">Cheapest</option>
                      <option value="comfort">Most Comfortable</option>
                      <option value="environment">Eco-Friendly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Walking (m)</label>
                    <Input
                      type="number"
                      value={preferences.maxWalkingDistance}
                      onChange={(e) => setPreferences({...preferences, maxWalkingDistance: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="avoidCrowded"
                      checked={preferences.avoidCrowded}
                      onChange={(e) => setPreferences({...preferences, avoidCrowded: e.target.checked})}
                    />
                    <label htmlFor="avoidCrowded" className="text-sm">Avoid Crowded</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="accessibility"
                      checked={preferences.accessibilityNeeds}
                      onChange={(e) => setPreferences({...preferences, accessibilityNeeds: e.target.checked})}
                    />
                    <label htmlFor="accessibility" className="text-sm">Accessibility</label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={planTrip} 
              disabled={loading || !from.trim() || !to.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Planning your trip...
                </>
              ) : (
                <>
                  <Route className="h-4 w-4 mr-2" />
                  Plan Trip
                </>
              )}
            </Button>
          </TabsContent>

          {/* Trip Options Tab */}
          <TabsContent value="options" className="space-y-4">
            {tripOptions.length === 0 ? (
              <div className="text-center py-8">
                <Route className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Plan a trip to see route options</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tripOptions.map((option, index) => (
                  <Card 
                    key={option.id} 
                    className={`cursor-pointer transition-all ${selectedTrip?.id === option.id ? 'border-primary shadow-md' : 'hover:shadow-sm'}`}
                    onClick={() => setSelectedTrip(option)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            {index === 0 ? 'Recommended' : `Option ${index + 1}`}
                          </Badge>
                          {option.realTimeUpdates && (
                            <Badge variant="outline" className="text-green-600">
                              <Zap className="h-3 w-3 mr-1" />
                              Real-time
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{option.totalDuration} min</div>
                          <div className="text-sm text-gray-600">{option.totalCost} ETB</div>
                        </div>
                      </div>

                      {/* Route Visualization */}
                      <div className="flex items-center space-x-2 mb-3">
                        {option.segments.map((segment, segIndex) => (
                          <React.Fragment key={segment.id}>
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${getSegmentColor(segment.type)}`}>
                              {getSegmentIcon(segment.type)}
                              <span className="text-xs font-medium">
                                {segment.duration}m
                              </span>
                            </div>
                            {segIndex < option.segments.length - 1 && (
                              <ArrowRight className="h-3 w-3 text-gray-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Trip Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Footprints className="h-4 w-4 text-blue-600" />
                          <span>{option.totalWalkingDistance}m walk</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span>{option.carbonSaving}kg CO₂ saved</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Timer className="h-4 w-4 text-orange-600" />
                          <span>Score: {option.score}/100</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4 text-purple-600" />
                          <span>{option.accessibility} access</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Trip Details Tab */}
          <TabsContent value="details" className="space-y-4">
            {!selectedTrip ? (
              <div className="text-center py-8">
                <Navigation className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Select a trip option to see detailed directions</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Step-by-Step Directions</h3>
                  <div className="text-right text-sm text-gray-600">
                    <div>Total: {selectedTrip.totalDuration} minutes</div>
                    <div>Cost: {selectedTrip.totalCost} ETB</div>
                  </div>
                </div>

                {selectedTrip.segments.map((segment, index) => (
                  <Card key={segment.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getSegmentColor(segment.type)}`}>
                          {getSegmentIcon(segment.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">
                              Step {index + 1}: {segment.type === 'walk' ? 'Walk' : segment.type === 'bus' ? 'Take Bus' : 'Wait'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {segment.duration} minutes
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 mb-2">
                            From <span className="font-medium">{segment.from}</span> to <span className="font-medium">{segment.to}</span>
                          </div>
                          {segment.instructions && (
                            <div className="text-sm text-gray-600 mb-2">
                              {segment.instructions}
                            </div>
                          )}
                          {segment.routeName && (
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">{segment.routeName}</Badge>
                              {segment.crowdingLevel && (
                                <Badge className={getCrowdingColor(segment.crowdingLevel)}>
                                  {segment.crowdingLevel} crowding
                                </Badge>
                              )}
                            </div>
                          )}
                          {segment.cost && (
                            <div className="flex items-center space-x-1 text-sm">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span>{segment.cost} ETB</span>
                            </div>
                          )}
                          {segment.distance && (
                            <div className="text-sm text-gray-600">
                              Distance: {segment.distance}m
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Environmental Impact:</strong><br />
                      Saves {selectedTrip.carbonSaving}kg CO₂ vs driving
                    </div>
                    <div>
                      <strong>Accessibility:</strong><br />
                      {selectedTrip.accessibility} accessibility rating
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MultiModalTripPlanner;
