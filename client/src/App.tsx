import React, { useState, useEffect } from 'react';
import { Route, Router, Link, useLocation } from 'wouter';
import { MapPin, Bus, CreditCard, Settings, HelpCircle, Home, User, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { AnbessaLogo, ShegerLogo, AddisBusLogo } from './components/ui/logos';
import VoiceAssistant from './components/voice-assistant';
import AdvancedMap from './components/maps/advanced-map';
import ButtonGuide from './components/features/button-guide';
import NewFeatures from './pages/NewFeatures';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/use-auth';
import './App.css';

// Home Page Component
const HomePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'am' | 'om'>('am');
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Simulate recent activity
    setRecentActivity([
      { id: 1, type: 'route', message: 'የ መርካቶ - ቦሌ መስመር ተመልክቷል', time: '5 ደቂቃ በፊት' },
      { id: 2, type: 'ticket', message: 'ትኬት ተገዝቷል - 8.50 ብር', time: '15 ደቂቃ በፊት' },
      { id: 3, type: 'voice', message: 'የድምጽ ትእዛዝ ጥቅም ላይ ውሏል', time: '30 ደቂቃ በፊት' }
    ]);

    // Play welcome audio when component mounts
    const audio = new Audio('/audio/welcome_amharic.wav');
    audio.play().catch(e => console.error('Error playing welcome audio:', e));

  }, []);

  const handleVoiceCommand = (command: string) => {
    if (command.includes('መስመር ፈልግ')) {
      setLocation('/map');
    } else if (command.includes('ትኬት ግዛ')) {
      setLocation('/tickets');
    } else if (command.includes('እረዳኝ')) {
      setLocation('/help');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
      {/* Header with Ethiopian flag colors */}
      <header className="bg-gradient-to-r from-green-600 via-yellow-400 to-red-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AddisBusLogo className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold">AddisBus Connect</h1>
              <p className="text-sm opacity-90">የአዲስ አበባ የህዝብ ማመላለሻ ስርዓት</p>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex gap-2">
            <Button
              variant={selectedLanguage === 'am' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSelectedLanguage('am')}
              className="text-white border-white hover:bg-white/20"
            >
              አማርኛ
            </Button>
            <Button
              variant={selectedLanguage === 'en' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSelectedLanguage('en')}
              className="text-white border-white hover:bg-white/20"
            >
              English
            </Button>
            <Button
              variant={selectedLanguage === 'om' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSelectedLanguage('om')}
              className="text-white border-white hover:bg-white/20"
            >
              Oromiffa
            </Button>
          </div>
        </div>
      </header>

      {/* Voice Assistant */}
      <div className="fixed top-20 left-4 z-50">
        <VoiceAssistant onCommand={handleVoiceCommand} />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <Card className="mb-8 border-2 border-blue-200 bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              🇪🇹 እንኳን ደህና መጡ! 🚌
            </CardTitle>
            <p className="text-gray-600">
              {selectedLanguage === 'am' ? 
                'በአዲስ አበባ ውስጥ ቀላል፣ ፈጣን እና ደህንነቱ የተጠበቀ የአውቶብስ ጉዞ ያድርጉ' :
                selectedLanguage === 'om' ? 
                'Addis Ababaa keessatti imala awtoobusii salphaa, dafaa fi nageenya qabu taasisaa' :
                'Travel easily, quickly and safely by bus in Addis Ababa'
              }
            </p>
          </CardHeader>
        </Card>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 hover:border-green-400">
            <CardContent className="p-6 text-center" onClick={() => setLocation('/map')}>
              <MapPin className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold text-lg mb-2">
                {selectedLanguage === 'am' ? 'መስመሮች እና ካርታ' : 
                 selectedLanguage === 'om' ? 'Karaalee fi Kaarta' : 
                 'Routes & Map'}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedLanguage === 'am' ? 'የአውቶብስ መስመሮችን ይመልከቱ እና ቀጥታ ክትትል ያድርጉ' : 
                 selectedLanguage === 'om' ? 'Karaalee awtoobusii ilaaluu fi hordoffii kallattii taasisu' : 
                 'View bus routes and track in real-time'}
              </p>
              <Button className="mt-4 bg-green-600 hover:bg-green-700">
                {selectedLanguage === 'am' ? 'ይክፈት' : selectedLanguage === 'om' ? 'Bani' : 'Open'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-yellow-200 hover:border-yellow-400">
            <CardContent className="p-6 text-center" onClick={() => setLocation('/tickets')}>
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <h3 className="font-semibold text-lg mb-2">
                {selectedLanguage === 'am' ? 'ትኬት ግዛ' : 
                 selectedLanguage === 'om' ? 'Tikeetii Bitadhu' : 
                 'Buy Tickets'}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedLanguage === 'am' ? 'በቴሌብር፣ ሲቢኢ ብር ወይም ካርድ ትኬት ይግዙ' : 
                 selectedLanguage === 'om' ? 'Telebirr, CBE Birr yookaan kaardiidhaan tikeetii bitadhaa' : 
                 'Buy tickets with Telebirr, CBE Birr or card'}
              </p>
              <Button className="mt-4 bg-yellow-600 hover:bg-yellow-700">
                {selectedLanguage === 'am' ? 'ይግዙ' : selectedLanguage === 'om' ? 'Bitadhaa' : 'Purchase'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200 hover:border-red-400">
            <CardContent className="p-6 text-center" onClick={() => setLocation('/live')}>
              <Bus className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h3 className="font-semibold text-lg mb-2">
                {selectedLanguage === 'am' ? 'ቀጥታ ክትትል' : 
                 selectedLanguage === 'om' ? 'Hordoffii Kallattii' : 
                 'Live Tracking'}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedLanguage === 'am' ? 'አውቶብሶችን በቀጥታ ይከተሉ እና የመድረሻ ጊዜ ያውቁ' : 
                 selectedLanguage === 'om' ? 'Awtoobusota kallattiidhaan hordofaa fi yeroo dhufaatii beekaa' : 
                 'Track buses live and know arrival times'}
              </p>
              <Button className="mt-4 bg-red-600 hover:bg-red-700">
                {selectedLanguage === 'am' ? 'ይከተሉ' : selectedLanguage === 'om' ? 'Hordofaa' : 'Track'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 hover:border-blue-400">
            <CardContent className="p-6 text-center" onClick={() => setLocation('/help')}>
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold text-lg mb-2">
                {selectedLanguage === 'am' ? 'እርዳታ እና መመሪያ' : 
                 selectedLanguage === 'om' ? 'Gargaarsa fi Qajeelcha' : 
                 'Help & Guide'}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedLanguage === 'am' ? 'የተጠቃሚ መመሪያ እና የቁልፍ ቁልፎች መግለጫ' : 
                 selectedLanguage === 'om' ? 'Qajeelfama fayyadamaa fi ibsa qabduuwwanii' : 
                 'User guide and button descriptions'}
              </p>
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                {selectedLanguage === 'am' ? 'እርዳታ' : selectedLanguage === 'om' ? 'Gargaarsa' : 'Help'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bus Companies Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <div className="flex items-center gap-4">
                <AnbessaLogo className="w-16 h-16" />
                <div>
                  <CardTitle className="text-green-800">Anbessa City Bus</CardTitle>
                  <p className="text-green-600">አንበሳ የከተማ አውቶብስ</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Routes:</span>
                  <Badge variant="secondary">3 መስመሮች</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Price:</span>
                  <Badge variant="outline">7.50 ብር</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next Bus:</span>
                  <Badge className="bg-green-600">5 ደቂቃ</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader className="bg-red-50">
              <div className="flex items-center gap-4">
                <ShegerLogo className="w-16 h-16" />
                <div>
                  <CardTitle className="text-red-800">Sheger Bus</CardTitle>
                  <p className="text-red-600">ሸገር አውቶብስ</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Routes:</span>
                  <Badge variant="secondary">2 መስመሮች</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Price:</span>
                  <Badge variant="outline">8.50 ብር</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next Bus:</span>
                  <Badge className="bg-red-600">8 ደቂቃ</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedLanguage === 'am' 
                ? 'የቅርብ ጊዜ እንቅስቃሴ' 
                : selectedLanguage === 'om' 
                  ? 'Socha\'iinsa Yeroo Dhiyoo' 
                  : 'Recent Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Navigation Component
const Navigation: React.FC = () => {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          <Link href="/">
            <Button variant={location === '/' ? 'default' : 'ghost'} size="sm" className="flex flex-col gap-1 h-auto py-2">
              <Home size={20} />
              <span className="text-xs">ቤት</span>
            </Button>
          </Link>
          <Link href="/map">
            <Button variant={location === '/map' ? 'default' : 'ghost'} size="sm" className="flex flex-col gap-1 h-auto py-2">
              <MapPin size={20} />
              <span className="text-xs">ካርታ</span>
            </Button>
          </Link>
          <Link href="/live">
            <Button variant={location === '/live' ? 'default' : 'ghost'} size="sm" className="flex flex-col gap-1 h-auto py-2">
              <Bus size={20} />
              <span className="text-xs">ክትትል</span>
            </Button>
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/tickets">
                <Button variant={location === '/tickets' ? 'default' : 'ghost'} size="sm" className="flex flex-col gap-1 h-auto py-2">
                  <CreditCard size={20} />
                  <span className="text-xs">ትኬት</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant={location === '/dashboard' ? 'default' : 'ghost'} size="sm" className="flex flex-col gap-1 h-auto py-2">
                  <Settings size={20} />
                  <span className="text-xs">ዳሽቦርድ</span>
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/auth">
              <Button variant={location === '/auth' ? 'default' : 'ghost'} size="sm" className="flex flex-col gap-1 h-auto py-2">
                <User size={20} />
                <span className="text-xs">ግባ/ይመዝገቡ</span>
              </Button>
            </Link>
          )}
          <Link href="/features">
            <Button variant={location === '/features' ? 'default' : 'ghost'} size="sm" className="flex flex-col gap-1 h-auto py-2">
              <Sparkles size={18} />
              <span className="text-xs">Features</span>
            </Button>
          </Link>
          <Link href="/help">
            <Button variant={location === '/help' ? 'default' : 'ghost'} size="sm" className="flex flex-col gap-1 h-auto py-2">
              <HelpCircle size={20} />
              <span className="text-xs">እርዳታ</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Main App Component
const App: React.FC = () => {

  return (
    <Router>
      <div className="app-container">
        {/* Routes */}
        <Route path="/" component={HomePage} />
        
        {/* Auth Routes */}
        <Route path="/auth" component={Auth} />
        
        {/* Protected Routes */}
        <ProtectedRoute path="/dashboard">
          <Dashboard />
        </ProtectedRoute>
        <Route path="/map">
          <div className="bg-gray-50 pb-16">
            <div className="container mx-auto px-2 py-2">
              <AdvancedMap className="w-full h-[60vh] rounded-lg overflow-hidden shadow-lg" />
              
              {/* Quick Features Access */}
              <Card className="mt-4 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                    ተጨማሪ ባህሪያት - Quick Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/features'} className="text-xs">
                      🎤 Voice Assistant
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/features'} className="text-xs">
                      🚌 Live Tracking
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/features'} className="text-xs">
                      🌱 Carbon Tracker
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/features'} className="text-xs">
                      🆘 Emergency
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Route>
        <Route path="/live">
          <div className="bg-gray-50 pb-16">
            <div className="container mx-auto px-2 py-2">
              <AdvancedMap className="w-full h-[60vh] rounded-lg overflow-hidden shadow-lg" />
              
              {/* Live Bus Info */}
              <Card className="mt-4 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Bus className="w-5 h-5 mr-2 text-green-600" />
                    ቀጥታ የአውቶብስ መረጃ - Live Bus Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="font-bold text-green-800">8</div>
                      <div className="text-sm text-green-600">Active Buses</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="font-bold text-blue-800">4</div>
                      <div className="text-sm text-blue-600">Routes Online</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <div className="font-bold text-orange-800">~5 min</div>
                      <div className="text-sm text-orange-600">Avg Wait Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Route>
        <Route path="/tickets">
          <div className="min-h-screen bg-gray-50 pb-16 p-4">
            <Card>
              <CardHeader>
                <CardTitle>🎫 ትኬት ይግዙ - Buy Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Ticket purchasing feature coming soon with Telebirr, CBE Birr, and card payment integration.</p>
              </CardContent>
            </Card>
          </div>
        </Route>
        <Route path="/features">
          <div className="min-h-screen bg-gray-50 pb-20">
            <NewFeatures />
          </div>
        </Route>
        <Route path="/help">
          <div className="min-h-screen bg-gray-50 pb-16 p-4">
            <ButtonGuide language="am" />
          </div>
        </Route>
        
        {/* Admin Dashboard */}
        <Route path="/admin">
          <ProtectedRoute requireAdmin>
            <div className="min-h-screen bg-gray-50 pb-16">
              <AdminDashboard onBack={() => window.history.back()} />
            </div>
          </ProtectedRoute>
        </Route>
        
        {/* Navigation */}
        <Navigation />
      </div>
    </Router>
  );
};

export default App;

