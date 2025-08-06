import React, { useState } from 'react';
import { 
  HelpCircle, 
  Map, 
  Bus, 
  CreditCard, 
  Route, 
  Navigation, 
  Clock, 
  MapPin,
  Mic,
  Volume2,
  Ticket,
  Star,
  AlertCircle,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ButtonInfo {
  icon: React.ReactNode;
  nameEn: string;
  nameAm: string; // Amharic
  nameOm: string; // Oromo
  descriptionEn: string;
  descriptionAm: string;
  descriptionOm: string;
  category: 'navigation' | 'tracking' | 'payment' | 'voice' | 'settings';
  shortcut?: string;
}

const buttonGuide: ButtonInfo[] = [
  // Navigation Buttons
  {
    icon: <Map className="w-5 h-5" />,
    nameEn: "View Map",
    nameAm: "ካርታ አሳይ",
    nameOm: "Karta Mul'isi",
    descriptionEn: "Display interactive map with bus routes, stops, and real-time bus locations",
    descriptionAm: "የአውቶብስ መስመሮች፣ ማቆሚያዎች እና ቀጥታ አውቶብስ አካባቢዎች ያለው መስተጋብራዊ ካርታ ያሳያል",
    descriptionOm: "Kaarta walqabataa karaa awtoobusii, dhaabbiiwwanii fi bakka awtoobusii yeroo ammaa mul'isa",
    category: "navigation",
    shortcut: "Ctrl+M"
  },
  {
    icon: <Route className="w-5 h-5" />,
    nameEn: "Find Routes",
    nameAm: "መስመሮች ፈልግ",
    nameOm: "Karaalee Barbaadi",
    descriptionEn: "Search and browse all available bus routes between different locations in Addis Ababa",
    descriptionAm: "በአዲስ አበባ ውስጥ በተለያዩ ቦታዎች መካከል ያሉ የአውቶብስ መስመሮችን ይፈልጉ እና ይመልከቱ",
    descriptionOm: "Addis Ababaa keessatti bakka adda addaa gidduutti argaman karaalee awtoobusii hunda barbaaduu fi ilaaluu",
    category: "navigation",
    shortcut: "Ctrl+R"
  },
  {
    icon: <Navigation className="w-5 h-5" />,
    nameEn: "Get Directions",
    nameAm: "አቅጣጫ ያግኙ",
    nameOm: "Qajeelcha Argadhu",
    descriptionEn: "Get step-by-step navigation from your location to your destination using public transport",
    descriptionAm: "የህዝብ ማመላለሻ በመጠቀም ከእርስዎ አካባቢ ወደ መድረሻዎ ደረጃ በደረጃ አቅጣጫ ያግኙ",
    descriptionOm: "Geejjiba ummataa fayyadamuudhaan bakka jirtanii kaasee gara iddoo dhufuu barbaaddanitti qajeelcha tartiiba tartiibaan argadhaa",
    category: "navigation",
    shortcut: "Ctrl+D"
  },

  // Tracking Buttons
  {
    icon: <Bus className="w-5 h-5" />,
    nameEn: "Track Bus",
    nameAm: "አውቶብስ ተከታተል",
    nameOm: "Awtoobusii Hordofi",
    descriptionEn: "Monitor real-time location of buses on your selected route with live updates every 30 seconds",
    descriptionAm: "በመረጡት መስመር ላይ ያሉ አውቶብሶችን በ30 ሰከንድ ውስጥ ቀጥታ ዝማኔዎች ያለው ትክክለኛ ጊዜ አካባቢ ይከታተሉ",
    descriptionOm: "Karaa filatanii irratti awtoobusota yeroo dhugaa keessatti sekoondii 30 sekondiitti fooyya'iinsa kallattii qabu hordofuu",
    category: "tracking",
    shortcut: "Ctrl+T"
  },
  {
    icon: <Clock className="w-5 h-5" />,
    nameEn: "Arrival Times",
    nameAm: "የመድረሻ ጊዜዎች",
    nameOm: "Yeroo Dhufaatii",
    descriptionEn: "View estimated arrival times for buses at your nearest stop with accuracy up to 95%",
    descriptionAm: "በአቅራቢያዎ ባለው ማቆሚያ ላይ የአውቶብሶች የመድረሻ ጊዜዎችን እስከ 95% ትክክለኛነት ያለው ይመልከቱ",
    descriptionOm: "Dhaabbii si dhiyoo jirutti yeroo dhufaatii awtoobusotaa sirriitti hanga %95 mul'isuu",
    category: "tracking",
    shortcut: "Ctrl+A"
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    nameEn: "Nearby Stops",
    nameAm: "በአቅራቢያ ያሉ ማቆሚያዎች",
    nameOm: "Dhaabbiiwwan Dhiyoo",
    descriptionEn: "Find all bus stops within 1km radius of your current location with walking directions",
    descriptionAm: "ከአሁኑ አካባቢዎ በ1 ኪሎ ሜትር ራዲየስ ውስጥ ያሉ ሁሉንም የአውቶብስ ማቆሚያዎች በእግር አቅጣጫዎች ይፈልጉ",
    descriptionOm: "Bakka amma jirtanii irraa kiiloomeetira 1 naannessaatti argaman dhaabbiiwwan awtoobusii hunda miillaan deemuu qajeelcha wajjin barbaaduu",
    category: "navigation",
    shortcut: "Ctrl+N"
  },

  // Payment Buttons
  {
    icon: <Ticket className="w-5 h-5" />,
    nameEn: "Buy Ticket",
    nameAm: "ትኬት ይግዙ",
    nameOm: "Tikeetii Bitadhaa",
    descriptionEn: "Purchase digital bus tickets with QR codes supporting Telebirr, CBE Birr, and card payments",
    descriptionAm: "ቴሌብር፣ ሲቢኢ ብር እና ካርድ ክፍያዎችን የሚደግፍ ኪውአር ኮድ ያለው ዲጂታል የአውቶብስ ትኬቶችን ይግዙ",
    descriptionOm: "Tikeetiiwwan awtoobusii dijitaalaa koodii QR qabu Telebirr, CBE Birr fi kaardii kaffaltiiwwan deeggaraniin bitachuu",
    category: "payment",
    shortcut: "Ctrl+B"
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    nameEn: "Payment Methods",
    nameAm: "የክፍያ ዘዴዎች",
    nameOm: "Malawwan Kaffaltii",
    descriptionEn: "Choose from multiple payment options: Mobile Money (Telebirr, CBE Birr, HelloCash) or Credit Cards",
    descriptionAm: "ከብዙ የክፍያ አማራጮች ይምረጡ፣ የሞባይል ገንዘብ (ቴሌብር፣ ሲቢኢ ብር፣ ሄሎካሽ) ወይም ክሬዲት ካርዶች",
    descriptionOm: "Filannoo kaffaltii hedduu keessaa filadhaa: Maallaqaa Mobaayilaa (Telebirr, CBE Birr, HelloCash) yookaan Kaardii Liqii",
    category: "payment",
    shortcut: "Ctrl+P"
  },

  // Voice Assistant Buttons  
  {
    icon: <Mic className="w-5 h-5" />,
    nameEn: "Voice Commands",
    nameAm: "የድምጽ ትእዛዞች",
    nameOm: "Ajajiiwwan Sagalee",
    descriptionEn: "Use voice commands in Amharic to control the app: 'መስመር ፈልግ' (find routes), 'አውቶብስ ከተተኮስ' (track bus)",
    descriptionAm: "መተግበሪያውን ለመቆጣጠር በአማርኛ የድምጽ ትእዛዞችን ይጠቀሙ፦ 'መስመር ፈልግ'፣ 'አውቶብስ ከተተኮስ'፣ 'ትኬት ግዛ'",
    descriptionOm: "Appii kana too'achuudhaaf ajajiiwwan sagalee Afaan Oromootiin fayyadamaa: 'karaalee barbaadi', 'awtoobusii hordofi'",
    category: "voice",
    shortcut: "Space"
  },
  {
    icon: <Volume2 className="w-5 h-5" />,
    nameEn: "Audio Announcements",
    nameAm: "የድምጽ መግለጫዎች",
    nameOm: "Beeksisaawwan Sagalee",
    descriptionEn: "Listen to real-time audio updates in Amharic about bus arrivals, route changes, and important notifications",
    descriptionAm: "ስለ አውቶብስ መምጣት፣ የመስመር ለውጦች እና አስፈላጊ ማሳወቂያዎች በአማርኛ ቀጥታ የድምጽ ዝማኔዎችን ይስሙ",
    descriptionOm: "Waa'ee dhufaatii awtoobusii, jijjiirama karaaleerii fi beeksisaawwan barbaachisaa Afaan Amaaraatiin fooyya'iinsa sagalee yeroo dhugaa dhaggeeffachuu",
    category: "voice",
    shortcut: "Ctrl+V"
  },

  // Settings and Help
  {
    icon: <Settings className="w-5 h-5" />,
    nameEn: "Settings",
    nameAm: "ቅንብሮች",
    nameOm: "Qindaa'inoota",
    descriptionEn: "Customize app preferences: language (አማርኛ/English/Afaan Oromo), notifications, map style, and accessibility options",
    descriptionAm: "የመተግበሪያ ምርጫዎችን ያበጁ፦ ቋንቋ (አማርኛ/English/Afaan Oromo)፣ ማሳወቂያዎች፣ የካርታ ዘይቤ፣ እና የተደራሽነት አማራጮች",
    descriptionOm: "Filannoowwan appii haala fedhaatti qindeessuu: afaan (Afaan Amaaraa/English/Afaan Oromoo), beeksisaawwan, akkaataa kaartaa, fi filannoowwan dhaqqabummaa",
    category: "settings",
    shortcut: "Ctrl+,"
  },
  {
    icon: <HelpCircle className="w-5 h-5" />,
    nameEn: "Help & Support",
    nameAm: "እርዳታ እና ድጋፍ",
    nameOm: "Gargaarsa fi Deeggarsa",
    descriptionEn: "Access user guide, FAQ, troubleshooting tips, and contact customer support in multiple languages",
    descriptionAm: "የተጠቃሚ መመሪያ፣ ተደጋጋሚ ጥያቄዎች፣ የችግር መፍቻ ምክሮች፣ እና በብዙ ቋንቋዎች የደንበኞች ድጋፍ ያግኙ",
    descriptionOm: "Qajeelfama fayyadamaa, gaaffii yeroo baay'ee gaafataman, gorsaawwan furmaata rakkoo, fi gargaarsa maamiltootaa afaan hedduu keessatti argachuu",
    category: "settings",
    shortcut: "F1"
  }
];

interface ButtonGuideProps {
  language?: 'en' | 'am' | 'om';
  category?: 'navigation' | 'tracking' | 'payment' | 'voice' | 'settings';
}

export const ButtonGuide: React.FC<ButtonGuideProps> = ({ language = 'am', category }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredButtons = buttonGuide.filter(button => {
    const matchesCategory = selectedCategory === 'all' || button.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      button.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      button.nameAm.includes(searchTerm) ||
      button.nameOm.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', name: { en: 'All Features', am: 'ሁሉም ባህሪያት', om: 'Amaloota Hundaa' } },
    { id: 'navigation', name: { en: 'Navigation', am: 'አሰሳ', om: 'Deemsa' } },
    { id: 'tracking', name: { en: 'Bus Tracking', am: 'አውቶብስ ክትትል', om: 'Hordoffii Awtoobusii' } },
    { id: 'payment', name: { en: 'Payments', am: 'ክፍያዎች', om: 'Kaffaltiiwan' } },
    { id: 'voice', name: { en: 'Voice Assistant', am: 'የድምጽ ረዳት', om: 'Gargaaraa Sagalee' } },
    { id: 'settings', name: { en: 'Settings', am: 'ቅንብሮች', om: 'Qindaa\'inoota' } }
  ];

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'navigation': return 'bg-blue-100 text-blue-800';
      case 'tracking': return 'bg-green-100 text-green-800';
      case 'payment': return 'bg-yellow-100 text-yellow-800';
      case 'voice': return 'bg-purple-100 text-purple-800';
      case 'settings': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="button-guide-container">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center bg-gradient-to-r from-green-600 via-yellow-400 to-red-600 text-white">
          <CardTitle className="text-xl font-bold">
            🇪🇹 AddisBus Connect - የተጠቃሚ መመሪያ 🚌
          </CardTitle>
          <p className="text-sm opacity-90">
            {language === 'am' ? 'ሁሉንም ቁልፎች እና ባህሪያቶች እንዴት መጠቀም እንደሚቻል ይወቁ' : 
             language === 'om' ? 'Akkaataa qabduuwwanii fi amaloota hunda itti fayyadamu baraadhaa' :
             'Learn how to use all buttons and features'}
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder={language === 'am' ? 'ባህሪያት ይፈልጉ...' : language === 'om' ? 'Amaloota barbaadaa...' : 'Search features...'}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="text-xs"
                >
                  {cat.name[language]}
                </Button>
              ))}
            </div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredButtons.map((button, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
                      {button.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">
                        {language === 'am' ? button.nameAm : 
                         language === 'om' ? button.nameOm : 
                         button.nameEn}
                      </h3>
                      
                      <Badge className={`mb-2 text-xs ${getCategoryColor(button.category)}`}>
                        {button.category === 'navigation' ? (language === 'am' ? 'አሰሳ' : language === 'om' ? 'Deemsa' : 'Navigation') :
                         button.category === 'tracking' ? (language === 'am' ? 'ክትትል' : language === 'om' ? 'Hordoffii' : 'Tracking') :
                         button.category === 'payment' ? (language === 'am' ? 'ክፍያ' : language === 'om' ? 'Kaffaltii' : 'Payment') :
                         button.category === 'voice' ? (language === 'am' ? 'ድምጽ' : language === 'om' ? 'Sagalee' : 'Voice') :
                         language === 'am' ? 'ቅንብር' : language === 'om' ? 'Qindaa\'ina' : 'Settings'}
                      </Badge>
                      
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {language === 'am' ? button.descriptionAm : 
                         language === 'om' ? button.descriptionOm : 
                         button.descriptionEn}
                      </p>
                      
                      {button.shortcut && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {language === 'am' ? 'አቋራጭ:' : language === 'om' ? 'Gabaabbii:' : 'Shortcut:'}
                          </span>
                          <Badge variant="outline" className="text-xs font-mono">
                            {button.shortcut}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredButtons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>{language === 'am' ? 'ምንም ውጤት አልተገኘም' : language === 'om' ? 'Galmaan hin argamne' : 'No results found'}</p>
            </div>
          )}

          {/* Quick Tips */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 text-blue-800">
                💡 {language === 'am' ? 'ፈጣን ምክሮች:' : language === 'om' ? 'Gorsaawwan Dafaa:' : 'Quick Tips:'}
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {language === 'am' ? 'ባር ቦታን በመጫን የድምጽ ትእዛዞችን ይጀምሩ' : language === 'om' ? 'Space tuquudhaan ajajiiwwan sagalee jalqabaa' : 'Press Space bar to start voice commands'}</li>
                <li>• {language === 'am' ? 'የካርታ አቋራጮችን ለፈጣን አሰሳ ይጠቀሙ' : language === 'om' ? 'Gabaabbiiwwan kaartaa deemsa dafaa oodhaaf fayyadamaa' : 'Use map shortcuts for quick navigation'}</li>
                <li>• {language === 'am' ? 'ቋንቋዎን በቅንብሮች ውስጥ ይቀይሩ' : language === 'om' ? 'Afaan keessan qindaa\'inoota keessatti jijjiiraa' : 'Change your language in Settings'}</li>
                <li>• {language === 'am' ? 'በእርዳታ ሲክሽን ውስጥ ተጨማሪ መረጃ ያግኙ' : language === 'om' ? 'Kutaa gargaarsaa keessatti odeeffannoo dabalataa argadhaa' : 'Find more information in the Help section'}</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ButtonGuide;