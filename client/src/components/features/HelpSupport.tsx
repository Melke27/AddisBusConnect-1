import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Users,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  Mic,
  Volume2,
  PlayCircle,
  Download
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'routes' | 'payment' | 'app' | 'safety' | 'general';
  helpful: number;
  notHelpful: number;
  tags: string[];
  audioUrl?: string;
  hasVideo?: boolean;
}

interface SupportMessage {
  id: string;
  type: 'user' | 'support';
  content: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: string[];
}

const HelpSupport: React.FC = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [userFeedback, setUserFeedback] = useState<{[key: string]: 'helpful' | 'not_helpful'}>({});

  const audioRef = useRef<HTMLAudioElement>(null);

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I find the best route to my destination?',
      answer: 'To find the best route: 1) Open the app and tap "Plan Trip" 2) Enter your starting point and destination 3) Choose your preferences (fastest, cheapest, least walking) 4) Review the suggested routes with real-time information 5) Select your preferred route and start your journey. The app will provide turn-by-turn directions and live updates during your trip.',
      category: 'routes',
      helpful: 45,
      notHelpful: 3,
      tags: ['route planning', 'navigation', 'trip planning'],
      hasVideo: true
    },
    {
      id: '2',
      question: 'How can I track buses in real-time?',
      answer: 'Real-time bus tracking is available through: 1) The "Live Tracking" feature on the home screen 2) Tap on any route to see all buses currently running 3) View bus locations, delays, and passenger loads 4) Set up arrival notifications for your favorite stops 5) Use voice commands like "Show me buses to Mercato" for hands-free tracking.',
      category: 'app',
      helpful: 52,
      notHelpful: 2,
      tags: ['live tracking', 'real-time', 'buses'],
      audioUrl: '/audio/live-tracking-help.mp3',
      hasVideo: true
    },
    {
      id: '3',
      question: 'What payment methods are accepted?',
      answer: 'AddisBus Connect accepts multiple payment methods: 1) Cash payments directly to the bus driver 2) Mobile money (M-Birr, HelloCash, Amole) 3) Contactless smart cards 4) Bank cards (Visa, Mastercard) 5) Digital wallet through the app. For convenience, we recommend setting up mobile money or getting a smart card for faster boarding.',
      category: 'payment',
      helpful: 38,
      notHelpful: 5,
      tags: ['payment', 'mobile money', 'smart cards', 'cash'],
      hasVideo: true
    },
    {
      id: '4',
      question: 'How do I report a safety issue or emergency?',
      answer: 'For safety issues and emergencies: 1) Use the red "Emergency" button in the app for immediate assistance 2) For non-urgent issues, use "Report Issue" feature 3) Call emergency services: 911 (general) or 991 (police) 4) Contact bus operators directly through the app 5) Use the panic button feature that shares your location with authorities. Your safety is our top priority.',
      category: 'safety',
      helpful: 67,
      notHelpful: 1,
      tags: ['emergency', 'safety', 'reporting', 'panic button'],
      audioUrl: '/audio/safety-help.mp3'
    },
    {
      id: '5',
      question: 'How does the voice assistant work?',
      answer: 'The voice assistant helps you navigate hands-free: 1) Tap the microphone icon or say "Hey AddisBus" 2) Ask questions in English, Amharic, or Oromiffa 3) Get spoken responses with detailed information 4) Voice commands work for routes, schedules, live tracking 5) Adjust voice settings for speed and language preferences. Try asking "Where is the next bus to CMC?" or "Show me live buses on Route 12".',
      category: 'app',
      helpful: 41,
      notHelpful: 4,
      tags: ['voice assistant', 'multilingual', 'hands-free'],
      audioUrl: '/audio/voice-assistant-help.mp3',
      hasVideo: true
    },
    {
      id: '6',
      question: 'What should I do if the app is not working properly?',
      answer: 'If you experience app issues: 1) Check your internet connection (WiFi or mobile data) 2) Force close and restart the app 3) Update to the latest version from app store 4) Clear app cache in your phone settings 5) Restart your device 6) If problems persist, contact our support team with your device model and error details. We provide 24/7 technical support.',
      category: 'app',
      helpful: 29,
      notHelpful: 8,
      tags: ['troubleshooting', 'app issues', 'technical support'],
      hasVideo: true
    },
    {
      id: '7',
      question: 'How can I save money on bus fares?',
      answer: 'Save money on transportation: 1) Use our trip planner to find the cheapest routes 2) Consider daily or weekly passes for regular commuters 3) Travel during off-peak hours for potential discounts 4) Use the carbon footprint tracker to earn reward points 5) Join our loyalty program for frequent riders 6) Group travel discounts available for 5+ people.',
      category: 'payment',
      helpful: 55,
      notHelpful: 3,
      tags: ['savings', 'discounts', 'loyalty program', 'passes'],
      audioUrl: '/audio/save-money-help.mp3'
    },
    {
      id: '8',
      question: 'How do I provide feedback or suggestions?',
      answer: 'We value your feedback: 1) Use the "Feedback" section in app settings 2) Rate your trip experience after each journey 3) Report issues through the "Report Problem" feature 4) Contact us via email, phone, or live chat 5) Participate in our monthly user surveys 6) Join our beta testing program for new features. Your input helps us improve the service.',
      category: 'general',
      helpful: 33,
      notHelpful: 2,
      tags: ['feedback', 'suggestions', 'rating', 'beta testing']
    }
  ];

  const categories = [
    { key: 'all', label: 'All Topics', icon: <HelpCircle className="h-4 w-4" /> },
    { key: 'routes', label: 'Routes & Planning', icon: <BookOpen className="h-4 w-4" /> },
    { key: 'app', label: 'App Features', icon: <FileText className="h-4 w-4" /> },
    { key: 'payment', label: 'Payment & Fares', icon: <Users className="h-4 w-4" /> },
    { key: 'safety', label: 'Safety & Emergency', icon: <AlertTriangle className="h-4 w-4" /> },
    { key: 'general', label: 'General Support', icon: <Lightbulb className="h-4 w-4" /> }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.log('Audio play failed:', error);
        // Fallback to text-to-speech
        const utterance = new SpeechSynthesisUtterance('Audio playback is not available. Please read the text description.');
        window.speechSynthesis.speak(utterance);
      });
    }
  };

  const handleFeedback = (faqId: string, type: 'helpful' | 'not_helpful') => {
    setUserFeedback({ ...userFeedback, [faqId]: type });
    // Here you would typically send this feedback to your backend
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: SupportMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setSupportMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate support response
    setTimeout(() => {
      const responses = [
        'Thank you for contacting AddisBus Connect support. I\'m here to help you with any questions about our bus services.',
        'I understand your concern. Let me provide you with detailed information to resolve this issue.',
        'Great question! Let me walk you through the solution step by step.',
        'I\'m happy to assist you with this. Here\'s what you need to know:',
        'Thank you for your patience. I\'ve reviewed your question and here\'s the detailed answer:'
      ];

      const supportMessage: SupportMessage = {
        id: (Date.now() + 1).toString(),
        type: 'support',
        content: responses[Math.floor(Math.random() * responses.length)] + ' For immediate assistance, you can also call our 24/7 helpline at +251-11-XXX-XXXX.',
        timestamp: new Date(),
        status: 'delivered'
      };

      setSupportMessages(prev => [...prev, supportMessage]);
    }, 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-purple-900 mb-2">
              Help & Support Center
            </CardTitle>
            <p className="text-purple-700">
              Get detailed answers to your questions about AddisBus Connect. 
              Available in English, Amharic, and Oromiffa with audio support.
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Categories */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for help topics, features, or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.key}
                  variant={activeCategory === category.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.key)}
                  className="flex items-center space-x-2"
                >
                  {category.icon}
                  <span>{category.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Frequently Asked Questions</span>
                <Badge variant="outline">{filteredFAQs.length} topics</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFAQs.map(faq => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">{faq.helpful}</span>
                          </div>
                          {faq.hasVideo && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              <Video className="h-3 w-3 mr-1" />
                              Video
                            </Badge>
                          )}
                          {faq.audioUrl && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              <Volume2 className="h-3 w-3 mr-1" />
                              Audio
                            </Badge>
                          )}
                        </div>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {expandedFAQ === faq.id && (
                      <div className="border-t border-gray-200 p-4">
                        <div className="space-y-4">
                          {/* Answer */}
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>

                          {/* Media Controls */}
                          <div className="flex items-center space-x-3">
                            {faq.audioUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => playAudio(faq.audioUrl!)}
                                className="flex items-center space-x-1"
                              >
                                <PlayCircle className="h-4 w-4" />
                                <span>Listen</span>
                              </Button>
                            )}
                            {faq.hasVideo && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center space-x-1"
                              >
                                <Video className="h-4 w-4" />
                                <span>Watch Video</span>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-1"
                            >
                              <Download className="h-4 w-4" />
                              <span>Save</span>
                            </Button>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {faq.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Feedback */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="text-sm text-gray-600">Was this helpful?</span>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant={userFeedback[faq.id] === 'helpful' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleFeedback(faq.id, 'helpful')}
                                className="flex items-center space-x-1"
                              >
                                <ThumbsUp className="h-3 w-3" />
                                <span>Yes</span>
                              </Button>
                              <Button
                                variant={userFeedback[faq.id] === 'not_helpful' ? 'destructive' : 'outline'}
                                size="sm"
                                onClick={() => handleFeedback(faq.id, 'not_helpful')}
                                className="flex items-center space-x-1"
                              >
                                <ThumbsDown className="h-3 w-3" />
                                <span>No</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Sidebar */}
        <div className="space-y-4">
          {/* Contact Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Contact Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowChat(!showChat)}
                className="w-full flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Live Chat</span>
                <Badge className="ml-auto bg-green-600">24/7</Badge>
              </Button>
              
              <Button variant="outline" className="w-full flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Call Support</span>
                <Badge variant="outline" className="ml-auto">Free</Badge>
              </Button>
              
              <Button variant="outline" className="w-full flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Support</span>
                <Clock className="h-3 w-3 ml-auto" />
              </Button>
            </CardContent>
          </Card>

          {/* Popular Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Popular Topics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  'Real-time bus tracking',
                  'Payment methods',
                  'Route planning',
                  'Voice assistant usage',
                  'Emergency features'
                ].map((topic, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded flex items-center space-x-2"
                    onClick={() => setSearchQuery(topic)}
                  >
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                    <span>{topic}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Service Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">App Services</span>
                  <Badge className="bg-green-600">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Live Tracking</span>
                  <Badge className="bg-green-600">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Systems</span>
                  <Badge className="bg-green-600">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Voice Assistant</span>
                  <Badge className="bg-yellow-600">Maintenance</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Chat */}
      {showChat && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Live Chat Support</span>
                <Badge className="bg-green-600">Online</Badge>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {supportMessages.length === 0 ? (
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Welcome to AddisBus Connect Support!</p>
                  <p className="text-sm">How can we help you today?</p>
                </div>
              ) : (
                supportMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Element */}
      <audio ref={audioRef} controls className="hidden" />
    </div>
  );
};

export default HelpSupport;
