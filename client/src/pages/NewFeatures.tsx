import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  Route, 
  AlertTriangle, 
  Leaf, 
  Zap,
  MapPin,
  Shield,
  TrendingUp,
  Star,
  ArrowRight,
  Sparkles,
  Mic,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';

// Import the new feature components
import BusCrowdingMonitor from '../components/features/BusCrowdingMonitor';
import MultiModalTripPlanner from '../components/features/MultiModalTripPlanner';
import EmergencyFeatures from '../components/features/EmergencyFeatures';
import CarbonFootprintTracker from '../components/features/CarbonFootprintTracker';
import LiveBusTracking from '../components/features/LiveBusTracking';
import BusStopsRoutes from '../components/features/BusStopsRoutes';
import VoiceAssistant from '../components/features/VoiceAssistant';
import HelpSupport from '../components/features/HelpSupport';

interface FeatureInfo {
  id: string;
  title: string;
  description: string;
  category: 'safety' | 'environment' | 'navigation' | 'social';
  status: 'new' | 'beta' | 'coming-soon';
  icon: React.ReactNode;
  benefits: string[];
  component: React.ComponentType<any>;
}

const NewFeatures: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth() as { user: any };
  const [activeFeature, setActiveFeature] = useState<string>('live-tracking');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const features: FeatureInfo[] = [
    {
      id: 'live-tracking',
      title: 'Live Bus Tracking',
      description: 'Track all buses in real-time with GPS precision. See exact locations, delays, passenger loads, and arrival predictions.',
      category: 'navigation',
      status: 'new',
      icon: <Zap className="h-6 w-6" />,
      benefits: [
        'Real-time GPS tracking',
        'Live passenger counts',
        'Delay notifications',
        'Arrival predictions'
      ],
      component: LiveBusTracking
    },
    {
      id: 'stops-routes',
      title: 'Bus Stops & Routes Explorer',
      description: 'Comprehensive database of all bus stops and routes in Addis Ababa with detailed information and facilities.',
      category: 'navigation',
      status: 'new',
      icon: <MapPin className="h-6 w-6" />,
      benefits: [
        'Complete stops database',
        'Facility information',
        'Multi-language support',
        'Interactive maps'
      ],
      component: BusStopsRoutes
    },
    {
      id: 'crowding',
      title: 'Real-time Bus Crowding Monitor',
      description: 'See how crowded buses are before you board. Make informed decisions about when to travel for maximum comfort.',
      category: 'navigation',
      status: 'new',
      icon: <Users className="h-6 w-6" />,
      benefits: [
        'Avoid overcrowded buses',
        'Real-time passenger count',
        'Comfort level predictions',
        'Alternative bus suggestions'
      ],
      component: BusCrowdingMonitor
    },
    {
      id: 'trip-planner',
      title: 'Multi-Modal Trip Planner',
      description: 'Plan complex journeys involving multiple buses, walking routes, and connections. Get optimized routes based on your preferences.',
      category: 'navigation',
      status: 'beta',
      icon: <Route className="h-6 w-6" />,
      benefits: [
        'Multi-route journey planning',
        'Walking directions included',
        'Preference-based optimization',
        'Real-time route updates'
      ],
      component: MultiModalTripPlanner
    },
    {
      id: 'emergency',
      title: 'Emergency & Safety Features',
      description: 'Stay safe with panic buttons, safety reporting, and emergency contacts. Your security is our top priority.',
      category: 'safety',
      status: 'new',
      icon: <AlertTriangle className="h-6 w-6" />,
      benefits: [
        'One-touch panic button',
        'Anonymous incident reporting',
        'Emergency contact system',
        'Location sharing with authorities'
      ],
      component: EmergencyFeatures
    },
    {
      id: 'carbon-tracker',
      title: 'Carbon Footprint Tracker',
      description: 'Track your environmental impact and see how much CO₂ you\'ve saved by choosing public transport over private vehicles.',
      category: 'environment',
      status: 'new',
      icon: <Leaf className="h-6 w-6" />,
      benefits: [
        'Environmental impact tracking',
        'Community leaderboards',
        'Achievement system',
        'Monthly goals and challenges'
      ],
      component: CarbonFootprintTracker
    },
    {
      id: 'voice-assistant',
      title: 'Advanced Voice Assistant',
      description: 'Interactive voice assistant with live voice talks, multilingual support, and detailed descriptions for all features and questions.',
      category: 'navigation',
      status: 'new',
      icon: <Mic className="h-6 w-6" />,
      benefits: [
        'Natural voice conversations',
        'Multilingual support (EN/AM/OM)',
        'Live voice responses',
        'Hands-free navigation'
      ],
      component: VoiceAssistant
    },
    {
      id: 'help-support',
      title: 'Comprehensive Help & Support',
      description: 'Interactive help center with detailed descriptions, audio guides, live chat, and comprehensive FAQ system.',
      category: 'safety',
      status: 'new',
      icon: <HelpCircle className="h-6 w-6" />,
      benefits: [
        'Detailed FAQ with audio',
        'Live chat support',
        '24/7 assistance',
        'Video tutorials'
      ],
      component: HelpSupport
    }
  ];

  const categories = [
    { key: 'all', label: 'All Features', icon: <Sparkles className="h-4 w-4" /> },
    { key: 'safety', label: 'Safety & Security', icon: <Shield className="h-4 w-4" /> },
    { key: 'environment', label: 'Environmental', icon: <Leaf className="h-4 w-4" /> },
    { key: 'navigation', label: 'Navigation & Planning', icon: <MapPin className="h-4 w-4" /> }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-500 text-white';
      case 'beta': return 'bg-blue-500 text-white';
      case 'coming-soon': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'NEW';
      case 'beta': return 'BETA';
      case 'coming-soon': return 'COMING SOON';
      default: return 'AVAILABLE';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety': return <Shield className="h-4 w-4" />;
      case 'environment': return <Leaf className="h-4 w-4" />;
      case 'navigation': return <MapPin className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === selectedCategory);

  const activeFeatureData = features.find(f => f.id === activeFeature);
  const ActiveComponent = activeFeatureData?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 mr-3 animate-pulse" />
              <h1 className="text-3xl font-bold">New Features</h1>
              <Sparkles className="h-8 w-8 ml-3 animate-pulse" />
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover the latest innovations in AddisBus Connect. 
              Enhanced safety, smarter navigation, and environmental consciousness.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full">
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                  className="flex items-center space-x-2"
                >
                  {category.icon}
                  <span>{category.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Features Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredFeatures.map((feature) => (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  activeFeature === feature.id 
                    ? 'border-primary shadow-md bg-blue-50' 
                    : 'border-gray-200 hover:border-primary/50'
                }`}
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {feature.icon}
                      {getCategoryIcon(feature.category)}
                    </div>
                    <Badge className={`${getStatusColor(feature.status)} text-xs px-2 py-1`}>
                      {getStatusLabel(feature.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="space-y-1">
                    {feature.benefits.slice(0, 2).map((benefit, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-500">
                        <ArrowRight className="h-3 w-3 mr-2 text-green-500" />
                        {benefit}
                      </div>
                    ))}
                    {feature.benefits.length > 2 && (
                      <div className="text-xs text-gray-400 mt-2">
                        +{feature.benefits.length - 2} more benefits
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Tabs */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 mb-6">
            {features.map((feature) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex items-center space-x-2 text-sm"
              >
                {feature.icon}
                <span className="hidden sm:inline">{feature.title.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Active Feature Details */}
          {activeFeatureData && (
            <div className="mb-8">
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {activeFeatureData.icon}
                      <div>
                        <CardTitle className="text-xl">{activeFeatureData.title}</CardTitle>
                        <p className="text-gray-600 mt-1">{activeFeatureData.description}</p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(activeFeatureData.status)} text-sm px-3 py-1`}>
                      {getStatusLabel(activeFeatureData.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-2">
                        {activeFeatureData.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-yellow-600" />
                        Feature Highlights
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Badge variant="outline" className="mr-2">Real-time</Badge>
                          Live data updates
                        </div>
                        <div className="flex items-center text-sm">
                          <Badge variant="outline" className="mr-2">Multilingual</Badge>
                          Amharic, English, Oromo support
                        </div>
                        <div className="flex items-center text-sm">
                          <Badge variant="outline" className="mr-2">Mobile-first</Badge>
                          Optimized for smartphones
                        </div>
                        {activeFeatureData.status === 'beta' && (
                          <div className="flex items-center text-sm">
                            <Badge variant="outline" className="mr-2">Beta</Badge>
                            Help us improve with feedback
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Interactive Feature Demo */}
          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {feature.icon}
                    <span>Try {feature.title}</span>
                    {feature.status === 'beta' && (
                      <Badge variant="outline" className="text-blue-600">
                        Beta Testing
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-gray-600">
                    Experience this feature in action. All data shown is simulated for demonstration purposes.
                  </p>
                </CardHeader>
                <CardContent>
                  {ActiveComponent && <ActiveComponent />}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Feedback Section */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Love These New Features?</h3>
              <p className="text-gray-600 mb-4">
                Help us improve by sharing your feedback. Your input drives our innovation!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Features
                </Button>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Join Beta Testing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Teaser */}
        <Card className="mt-6 border-2 border-dashed border-yellow-300 bg-yellow-50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Sparkles className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-yellow-800">Coming Soon</h3>
                <Sparkles className="h-6 w-6 text-yellow-600 ml-2" />
              </div>
              <p className="text-yellow-700 mb-4">
                Even more exciting features are in development! Stay tuned for:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center justify-center text-yellow-600">
                  <Users className="h-4 w-4 mr-2" />
                  Social Features
                </div>
                <div className="flex items-center justify-center text-yellow-600">
                  <Zap className="h-4 w-4 mr-2" />
                  AI Assistant
                </div>
                <div className="flex items-center justify-center text-yellow-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  Offline Maps
                </div>
                <div className="flex items-center justify-center text-yellow-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics Dashboard
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewFeatures;
