import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Leaf, 
  TrendingDown, 
  Award, 
  Calendar, 
  TreePine,
  Car,
  Bus,
  MapPin,
  Target,
  Share2,
  Trophy,
  BarChart3,
  Globe
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

interface CarbonData {
  totalSaved: number; // kg CO2
  tripsCount: number;
  distanceTraveled: number; // km
  treesEquivalent: number;
  monthlyGoal: number;
  currentMonth: number;
  thisWeek: number;
  lastWeek: number;
  rank: number;
  totalUsers: number;
}

interface Trip {
  id: string;
  date: Date;
  route: string;
  distance: number;
  carbonSaved: number;
  alternativeMode: 'car' | 'taxi' | 'motorcycle';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

interface CarbonFootprintTrackerProps {
  userId?: string;
}

const CarbonFootprintTracker: React.FC<CarbonFootprintTrackerProps> = ({ userId }) => {
  const { t } = useLanguage();
  const { user } = useAuth() as { user: any };
  const [carbonData, setCarbonData] = useState<CarbonData | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'achievements' | 'compare'>('overview');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchCarbonData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCarbonData({
        totalSaved: 156.7,
        tripsCount: 84,
        distanceTraveled: 425.3,
        treesEquivalent: 7.2,
        monthlyGoal: 50,
        currentMonth: 32.4,
        thisWeek: 8.3,
        lastWeek: 6.7,
        rank: 847,
        totalUsers: 12453
      });

      setRecentTrips([
        {
          id: '1',
          date: new Date('2024-01-07'),
          route: 'Arat Kilo - Bole',
          distance: 8.5,
          carbonSaved: 2.1,
          alternativeMode: 'car'
        },
        {
          id: '2',
          date: new Date('2024-01-06'),
          route: 'Merkato - Piazza',
          distance: 4.2,
          carbonSaved: 1.3,
          alternativeMode: 'taxi'
        },
        {
          id: '3',
          date: new Date('2024-01-05'),
          route: 'CMC - Meskel Square',
          distance: 6.8,
          carbonSaved: 1.8,
          alternativeMode: 'car'
        }
      ]);

      setAchievements([
        {
          id: '1',
          title: 'First Ride',
          description: 'Take your first bus ride',
          icon: '🚌',
          unlocked: true
        },
        {
          id: '2',
          title: 'Week Warrior',
          description: 'Take the bus every day for a week',
          icon: '🗓️',
          unlocked: true
        },
        {
          id: '3',
          title: 'Carbon Saver',
          description: 'Save 100kg of CO₂ emissions',
          icon: '🌱',
          unlocked: true
        },
        {
          id: '4',
          title: 'Tree Planter',
          description: 'Save equivalent of 10 trees worth of CO₂',
          icon: '🌳',
          unlocked: false,
          progress: 7.2,
          target: 10
        },
        {
          id: '5',
          title: 'Century Club',
          description: 'Take 100 bus rides',
          icon: '💯',
          unlocked: false,
          progress: 84,
          target: 100
        },
        {
          id: '6',
          title: 'Eco Champion',
          description: 'Save 500kg of CO₂ emissions',
          icon: '🏆',
          unlocked: false,
          progress: 156.7,
          target: 500
        }
      ]);

      setLoading(false);
    };

    fetchCarbonData();
  }, [userId]);

  const calculateCarbonEmission = (distance: number, mode: string) => {
    // CO2 emissions per km for different transport modes
    const emissions = {
      car: 0.25, // kg CO2 per km
      taxi: 0.28,
      motorcycle: 0.12,
      bus: 0.08 // much lower per passenger
    };
    return distance * (emissions[mode as keyof typeof emissions] || 0.25);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const shareProgress = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Carbon Footprint Progress',
        text: `I've saved ${carbonData?.totalSaved}kg of CO₂ by using public transport! 🌱`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `I've saved ${carbonData?.totalSaved}kg of CO₂ by using public transport! Join me at AddisBus Connect 🌱`
      );
      alert('Progress copied to clipboard!');
    }
  };

  if (loading || !carbonData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span>Loading carbon footprint data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const monthlyProgress = (carbonData.currentMonth / carbonData.monthlyGoal) * 100;

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center text-green-800">
          <Leaf className="h-5 w-5 mr-2" />
          Carbon Footprint Tracker
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">ECO</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {[
            { key: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
            { key: 'trips', label: 'Trip History', icon: <MapPin className="h-4 w-4" /> },
            { key: 'achievements', label: 'Achievements', icon: <Trophy className="h-4 w-4" /> },
            { key: 'compare', label: 'Community', icon: <Globe className="h-4 w-4" /> }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
              className="flex items-center space-x-2"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-800">
                        {carbonData.totalSaved.toFixed(1)}kg
                      </div>
                      <div className="text-sm text-green-600">Total CO₂ Saved</div>
                    </div>
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-800">
                        {carbonData.tripsCount}
                      </div>
                      <div className="text-sm text-blue-600">Bus Trips Taken</div>
                    </div>
                    <Bus className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-yellow-800">
                        {carbonData.treesEquivalent.toFixed(1)}
                      </div>
                      <div className="text-sm text-yellow-600">Trees Equivalent</div>
                    </div>
                    <TreePine className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-800">
                        #{carbonData.rank}
                      </div>
                      <div className="text-sm text-purple-600">Community Rank</div>
                    </div>
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Monthly Goal Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {carbonData.currentMonth.toFixed(1)}kg of {carbonData.monthlyGoal}kg goal
                    </span>
                    <span className="text-sm text-gray-600">
                      {monthlyProgress.toFixed(0)}% complete
                    </span>
                  </div>
                  <Progress value={monthlyProgress} className="w-full" />
                  <div className="text-sm text-gray-600">
                    {carbonData.monthlyGoal - carbonData.currentMonth > 0 
                      ? `${(carbonData.monthlyGoal - carbonData.currentMonth).toFixed(1)}kg remaining to reach your goal`
                      : 'Congratulations! You\'ve exceeded your monthly goal! 🎉'
                    }
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">This Week vs Last Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Week</span>
                      <span className="font-semibold text-green-600">
                        {carbonData.thisWeek}kg CO₂ saved
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Week</span>
                      <span className="font-semibold">
                        {carbonData.lastWeek}kg CO₂ saved
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Improvement</span>
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          +{(carbonData.thisWeek - carbonData.lastWeek).toFixed(1)}kg
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span>vs. Private Car</span>
                      <span className="font-semibold text-red-600">
                        -{(carbonData.distanceTraveled * 0.17).toFixed(1)}kg CO₂
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>vs. Taxi Rides</span>
                      <span className="font-semibold text-orange-600">
                        -{(carbonData.distanceTraveled * 0.20).toFixed(1)}kg CO₂
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="font-medium">Total Distance</span>
                      <span className="font-semibold">
                        {carbonData.distanceTraveled.toFixed(1)}km traveled
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Share Progress */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Share Your Progress</h3>
                    <p className="text-gray-600">
                      Inspire others to make eco-friendly transportation choices!
                    </p>
                  </div>
                  <Button onClick={shareProgress} className="bg-green-600 hover:bg-green-700">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trips Tab */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Trips</h3>
              <Badge variant="secondary">{recentTrips.length} trips this week</Badge>
            </div>

            <div className="space-y-3">
              {recentTrips.map((trip) => {
                const alternativeCO2 = calculateCarbonEmission(trip.distance, trip.alternativeMode);
                
                return (
                  <Card key={trip.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Bus className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">{trip.route}</div>
                            <div className="text-sm text-gray-600">
                              {trip.date.toLocaleDateString()} • {trip.distance}km
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            -{trip.carbonSaved.toFixed(1)}kg CO₂
                          </div>
                          <div className="text-xs text-gray-500">
                            vs. {trip.alternativeMode}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4 text-gray-600" />
                          <span>If you used {trip.alternativeMode}</span>
                        </div>
                        <span className="text-red-600 font-medium">
                          +{alternativeCO2.toFixed(1)}kg CO₂
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Eco Achievements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`transition-all ${
                    achievement.unlocked 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{achievement.title}</h4>
                          {achievement.unlocked && (
                            <Badge className="bg-green-600 text-white text-xs">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {achievement.description}
                        </p>
                        
                        {!achievement.unlocked && achievement.progress && achievement.target && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>
                                {achievement.progress.toFixed(1)} / {achievement.target}
                              </span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.target) * 100} 
                              className="w-full h-2" 
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Community Impact</h3>
              <p className="text-gray-600">
                See how you compare with other eco-conscious travelers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center border-yellow-200">
                <CardContent className="p-6">
                  <Trophy className="h-8 w-8 mx-auto text-yellow-600 mb-3" />
                  <div className="text-2xl font-bold text-yellow-800">#{carbonData.rank}</div>
                  <div className="text-sm text-gray-600">Your Rank</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Top {Math.round((carbonData.rank / carbonData.totalUsers) * 100)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center border-green-200">
                <CardContent className="p-6">
                  <Globe className="h-8 w-8 mx-auto text-green-600 mb-3" />
                  <div className="text-2xl font-bold text-green-800">{carbonData.totalUsers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Making a difference together
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center border-blue-200">
                <CardContent className="p-6">
                  <Leaf className="h-8 w-8 mx-auto text-blue-600 mb-3" />
                  <div className="text-2xl font-bold text-blue-800">2.4 tons</div>
                  <div className="text-sm text-gray-600">Community CO₂ Saved</div>
                  <div className="text-xs text-gray-500 mt-1">
                    This month alone
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-green-100 to-blue-100">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2">Community Challenge</h4>
                  <p className="text-gray-700 mb-4">
                    Help Addis Ababa save 10 tons of CO₂ this month!
                  </p>
                  <div className="w-full bg-white rounded-full h-4 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all"
                      style={{ width: '24%' }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    2.4 / 10 tons saved • 76% to go
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leaderboard - Top Eco Warriors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'EcoWarrior2024', co2Saved: 234.5, trips: 156 },
                    { rank: 2, name: 'GreenCommuter', co2Saved: 198.3, trips: 142 },
                    { rank: 3, name: 'BusLover_AA', co2Saved: 187.9, trips: 134 },
                    { rank: 4, name: 'You', co2Saved: carbonData.totalSaved, trips: carbonData.tripsCount, isUser: true }
                  ].map((user) => (
                    <div 
                      key={user.rank} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        user.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.rank === 1 ? 'bg-yellow-500 text-white' :
                          user.rank === 2 ? 'bg-gray-400 text-white' :
                          user.rank === 3 ? 'bg-orange-500 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <div className={`font-medium ${user.isUser ? 'text-blue-800' : ''}`}>
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {user.trips} trips
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {user.co2Saved.toFixed(1)}kg
                        </div>
                        <div className="text-xs text-gray-500">CO₂ saved</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CarbonFootprintTracker;
