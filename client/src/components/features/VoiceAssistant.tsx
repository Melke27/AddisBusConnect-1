import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  Send, 
  Bot, 
  User,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Languages,
  Headphones,
  Zap,
  MapPin,
  Clock,
  Bus,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { busRoutes, busStops, generateLiveBuses, getNextBusArrivals } from '../../data/addisRoutes';

interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  isPlaying?: boolean;
  language?: string;
  category?: 'route' | 'schedule' | 'live' | 'help' | 'emergency';
}

interface VoiceSettings {
  language: 'en' | 'am' | 'om';
  voice: 'male' | 'female';
  speed: number;
  volume: number;
  autoPlay: boolean;
}

const VoiceAssistant: React.FC = () => {
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    language: 'en',
    voice: 'female',
    speed: 1.0,
    volume: 0.8,
    autoPlay: true
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognition = useRef<any>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis and recognition
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = true;
      speechRecognition.current.interimResults = true;
      speechRecognition.current.lang = voiceSettings.language === 'en' ? 'en-US' : 
                                      voiceSettings.language === 'am' ? 'am-ET' : 'om-ET';

      speechRecognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        if (event.results[event.results.length - 1].isFinal) {
          handleVoiceInput(transcript);
        }
      };

      speechRecognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Add welcome message
    const welcomeMessage: VoiceMessage = {
      id: 'welcome',
      type: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      category: 'help',
      language: voiceSettings.language
    };
    setMessages([welcomeMessage]);

    if (voiceSettings.autoPlay) {
      speakMessage(welcomeMessage.content);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = () => {
    switch (voiceSettings.language) {
      case 'am':
        return 'ሰላም! በAddisBus Connect የድምፅ ረዳት እንኳን ደህና መጡ። እንዴት ሊገኝዎት እችላለሁ? የአውቶቡስ መስመሮች፣ የመቆሚያ ቦታዎች፣ የቀጣይ መምጫ ጊዜ፣ ወይም የህዝብ ማመላለሻ ጉዳዮች ላይ እጠይቁኝ።';
      case 'om':
        return 'Nagaa! AddisBus Connect gargaaraa sagaleetin baga nagaan dhuftan. Akkamiin isin gargaaruu dandaʼa? Waaʼee karaa otobusii, bakka dhaabbataa, yeroo dhufaa itti aanu, yookaan dhimma geejjibaa hojiidhaan gaafachuu dandeessu.';
      default:
        return 'Hello! Welcome to AddisBus Connect Voice Assistant. How can I help you today? You can ask me about bus routes, stops, arrival times, live tracking, or any public transportation questions. Try saying "Show me live buses" or "Find route to Mercato"!';
    }
  };

  const speakMessage = (text: string, language?: string) => {
    if (!speechSynthesis.current) return;

    // Cancel any ongoing speech
    speechSynthesis.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language || (voiceSettings.language === 'en' ? 'en-US' : 
                                 voiceSettings.language === 'am' ? 'am-ET' : 'om-ET');
    utterance.rate = voiceSettings.speed;
    utterance.volume = voiceSettings.volume;
    
    // Try to find appropriate voice
    const voices = speechSynthesis.current.getVoices();
    const voice = voices.find(v => 
      v.lang.startsWith(utterance.lang.split('-')[0]) && 
      (voiceSettings.voice === 'female' ? v.name.includes('Female') : v.name.includes('Male'))
    ) || voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0])) || voices[0];
    
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.current.speak(utterance);
  };

  const startListening = () => {
    if (!speechRecognition.current) {
      alert('Speech recognition not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    setIsListening(true);
    speechRecognition.current.start();
  };

  const stopListening = () => {
    if (speechRecognition.current) {
      speechRecognition.current.stop();
    }
    setIsListening(false);
  };

  const handleVoiceInput = (transcript: string) => {
    setIsListening(false);
    
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: transcript,
      timestamp: new Date(),
      language: voiceSettings.language
    };

    setMessages(prev => [...prev, userMessage]);
    processVoiceCommand(transcript);
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    let response = '';
    let category: VoiceMessage['category'] = 'help';

    // Simulate processing delay
    setTimeout(() => {
      // Live tracking commands
      if (lowerCommand.includes('live') || lowerCommand.includes('track') || lowerCommand.includes('bus') && lowerCommand.includes('now')) {
        const liveBuses = generateLiveBuses();
        const activeBuses = liveBuses.filter(bus => bus.status === 'in_service').length;
        response = `I found ${activeBuses} buses currently in service. Route 12 to Mercato has 3 buses running, Route 5 to CMC is showing slight delays of 2-3 minutes. Would you like details about a specific route?`;
        category = 'live';
      }
      // Route information
      else if (lowerCommand.includes('route') || lowerCommand.includes('mercato') || lowerCommand.includes('cmc') || lowerCommand.includes('piassa')) {
        const route = busRoutes.find(r => 
          lowerCommand.includes(r.name.en.toLowerCase()) || 
          lowerCommand.includes(r.routeNumber.toLowerCase())
        );
        if (route) {
          response = `Route ${route.routeNumber} ${route.name.en} operates from ${route.schedule.firstBus} to ${route.schedule.lastBus} with buses every ${route.schedule.frequency} minutes. The fare is ${route.price} Ethiopian Birr. This route has ${route.stops.length} stops and takes approximately ${route.estimatedDuration} minutes.`;
        } else {
          response = 'I can help you with routes to Mercato, CMC, Piassa, Bole, Kazanchis and many more destinations. Which specific location are you traveling to?';
        }
        category = 'route';
      }
      // Schedule and timing
      else if (lowerCommand.includes('time') || lowerCommand.includes('when') || lowerCommand.includes('schedule') || lowerCommand.includes('next')) {
        response = 'Bus schedules vary by route. Most buses operate from 5:30 AM to 10:00 PM. Peak hours are 7-9 AM and 5-7 PM with buses every 5-10 minutes. During off-peak hours, expect buses every 15-20 minutes. Would you like the schedule for a specific route?';
        category = 'schedule';
      }
      // Emergency situations
      else if (lowerCommand.includes('emergency') || lowerCommand.includes('help') || lowerCommand.includes('problem') || lowerCommand.includes('accident')) {
        response = 'For emergencies, immediately contact 911 or the Ethiopian emergency services at 991. If you\'re experiencing a safety issue on the bus, use the emergency button in the app or contact the bus operator directly. I can also help you find the nearest police station or medical facility.';
        category = 'emergency';
      }
      // Greetings and general help
      else if (lowerCommand.includes('hello') || lowerCommand.includes('hi') || lowerCommand.includes('selam') || lowerCommand.includes('nagaa')) {
        response = 'Hello! I\'m your AddisBus Connect voice assistant. I can help you with real-time bus tracking, route information, schedules, fare details, and navigation assistance. What would you like to know about Addis Ababa\'s public transportation?';
        category = 'help';
      }
      // Default response with suggestions
      else {
        response = `I understand you said "${command}". I can help you with: finding bus routes, checking live bus locations, getting arrival times, learning about fares and schedules, or emergency assistance. Try asking "Where is the next bus to Mercato?" or "Show me live buses on Route 12".`;
        category = 'help';
      }

      const assistantMessage: VoiceMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        category,
        language: voiceSettings.language
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (voiceSettings.autoPlay) {
        speakMessage(response);
      }
    }, 1000);
  };

  const handleTextInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      language: voiceSettings.language
    };

    setMessages(prev => [...prev, userMessage]);
    processVoiceCommand(inputText);
    setInputText('');
  };

  const playMessage = (message: VoiceMessage) => {
    if (currentPlayingId === message.id) {
      speechSynthesis.current?.cancel();
      setCurrentPlayingId(null);
    } else {
      setCurrentPlayingId(message.id);
      speakMessage(message.content, message.language);
      
      // Clear playing state when done
      setTimeout(() => {
        setCurrentPlayingId(null);
      }, message.content.length * 50); // Rough estimate
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'route': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'schedule': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'route': return <Navigation className="h-4 w-4" />;
      case 'live': return <Zap className="h-4 w-4" />;
      case 'schedule': return <Clock className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const quickCommands = [
    { text: 'Show live buses', category: 'live' },
    { text: 'Route to Mercato', category: 'route' },
    { text: 'Next bus arrival', category: 'schedule' },
    { text: 'Emergency help', category: 'emergency' },
    { text: 'Bus fare information', category: 'help' },
    { text: 'Nearest bus stop', category: 'help' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Voice Assistant Header */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-blue-600" />
                {isSpeaking && (
                  <div className="absolute -top-1 -right-1">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-blue-900">
                  Voice Assistant
                </CardTitle>
                <p className="text-sm text-blue-700">
                  Ask me anything about AddisBus Connect
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-600 text-white">
                <Headphones className="h-3 w-3 mr-1" />
                {voiceSettings.language.toUpperCase()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Voice Settings */}
          {showSettings && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h4 className="font-medium mb-3">Voice Settings</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-600">Language</label>
                  <select
                    value={voiceSettings.language}
                    onChange={(e) => setVoiceSettings({...voiceSettings, language: e.target.value as any})}
                    className="w-full text-sm border rounded px-2 py-1"
                  >
                    <option value="en">English</option>
                    <option value="am">አማርኛ</option>
                    <option value="om">Oromiffa</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Voice</label>
                  <select
                    value={voiceSettings.voice}
                    onChange={(e) => setVoiceSettings({...voiceSettings, voice: e.target.value as any})}
                    className="w-full text-sm border rounded px-2 py-1"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Speed: {voiceSettings.speed}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.speed}
                    onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoplay"
                    checked={voiceSettings.autoPlay}
                    onChange={(e) => setVoiceSettings({...voiceSettings, autoPlay: e.target.checked})}
                  />
                  <label htmlFor="autoplay" className="text-xs text-gray-600">Auto-play responses</label>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Main Chat Interface */}
      <Card className="min-h-[500px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Chat with Voice Assistant</h3>
            <div className="flex items-center space-x-2">
              {isSpeaking && (
                <Badge className="bg-green-600 text-white animate-pulse">
                  <Volume2 className="h-3 w-3 mr-1" />
                  Speaking
                </Badge>
              )}
              {isListening && (
                <Badge className="bg-red-600 text-white animate-pulse">
                  <Mic className="h-3 w-3 mr-1" />
                  Listening
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
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
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          {message.category && (
                            <Badge className={`${getCategoryColor(message.category)} text-xs px-2 py-0`}>
                              {getCategoryIcon(message.category)}
                              <span className="ml-1">{message.category}</span>
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playMessage(message)}
                            className={`h-6 w-6 p-1 ${message.type === 'user' ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:bg-gray-200'}`}
                          >
                            {currentPlayingId === message.id ? (
                              <Pause className="h-3 w-3" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Commands */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Commands:</h4>
            <div className="flex flex-wrap gap-2">
              {quickCommands.map((cmd, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => processVoiceCommand(cmd.text)}
                  className="text-xs"
                >
                  {getCategoryIcon(cmd.category)}
                  <span className="ml-1">{cmd.text}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-3">
            <form onSubmit={handleTextInput} className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your question or use voice..."
                className="flex-1"
              />
              <Button type="submit" disabled={!inputText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>

            {/* Voice Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant={isListening ? "destructive" : "default"}
                onClick={isListening ? stopListening : startListening}
                className="flex items-center space-x-2"
                disabled={isSpeaking}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    <span>Stop Listening</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    <span>Start Voice</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  speechSynthesis.current?.cancel();
                  setIsSpeaking(false);
                  setCurrentPlayingId(null);
                }}
                disabled={!isSpeaking}
              >
                <VolumeX className="h-4 w-4" />
                <span>Stop Speaking</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setMessages([]);
                  const welcomeMsg: VoiceMessage = {
                    id: 'welcome-' + Date.now(),
                    type: 'assistant',
                    content: getWelcomeMessage(),
                    timestamp: new Date(),
                    category: 'help',
                    language: voiceSettings.language
                  };
                  setMessages([welcomeMsg]);
                  if (voiceSettings.autoPlay) {
                    speakMessage(welcomeMsg.content);
                  }
                }}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Features Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="h-5 w-5" />
            <span>Voice Assistant Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Real-time Information</h4>
              <ul className="text-sm space-y-1">
                <li>• Live bus tracking</li>
                <li>• Current delays and alerts</li>
                <li>• Next arrival times</li>
                <li>• Route status updates</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">Route Planning</h4>
              <ul className="text-sm space-y-1">
                <li>• Best route suggestions</li>
                <li>• Multiple destination options</li>
                <li>• Transfer information</li>
                <li>• Walking directions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-600">Smart Features</h4>
              <ul className="text-sm space-y-1">
                <li>• Multilingual support</li>
                <li>• Voice recognition</li>
                <li>• Text-to-speech</li>
                <li>• Emergency assistance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
