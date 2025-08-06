import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

// Amharic translations for common phrases
const amharicPhrases = {
  listening: 'እሰማለሁ...',
  speak: 'ይናገሩ',
  welcome: 'እንኳን ደህና መጡ ወደ አዲስ ብስ ኮነክት',
  busArriving: 'አውቶብስ በ {} ደቂቃ ይደርሳል',
  routeInfo: 'የ {} መስመር መረጃ',
  ticketPurchased: 'ትኬት በተሳካ ሁኔታ ተገዝቷል',
  noConnection: 'የኢንተርኔት ግንኙነት የለም',
  error: 'ስህተት ተከስቷል',
  findRoute: 'መስመር ፈልግ',
  buyTicket: 'ትኬት ግዛ',
  trackBus: 'አውቶብስ ከተተኮስ',
  nearbyStops: 'በአቅራቢያ ያሉ ማቆሚያዎች'
};

// Voice commands in Amharic
const voiceCommands = {
  'መስመር ፈልግ': () => console.log('Finding routes...'),
  'ትኬት ግዛ': () => console.log('Opening ticket purchase...'),
  'አውቶብስ ከተተኮስ': () => console.log('Tracking bus...'),
  'ማቆሚያዎች አሳይ': () => console.log('Showing nearby stops...'),
  'እረዳኝ': () => console.log('Opening help...'),
};

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
  className?: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand, className }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'am-ET'; // Amharic language code
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setTranscript(transcript);
          
          // Check for voice commands
          Object.keys(voiceCommands).forEach(command => {
            if (transcript.toLowerCase().includes(command.toLowerCase())) {
              voiceCommands[command as keyof typeof voiceCommands]();
              if (onCommand) onCommand(command);
            }
          });
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          speak(amharicPhrases.error);
        };
      }
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Welcome message
    setTimeout(() => {
      speak(amharicPhrases.welcome);
    }, 1000);
  }, []);

  const speak = (text: string) => {
    if (synthRef.current && text) {
      setIsSpeaking(true);
      
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'am-ET';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
      speak(amharicPhrases.listening);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Public methods for external use
  const announceArrival = (routeName: string, minutes: number) => {
    const message = amharicPhrases.busArriving.replace('{}', minutes.toString());
    speak(message);
  };

  const announceTicketPurchase = () => {
    speak(amharicPhrases.ticketPurchased);
  };

  const announceRouteInfo = (routeName: string) => {
    const message = amharicPhrases.routeInfo.replace('{}', routeName);
    speak(message);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`voice-assistant ${className}`}>
      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-green-600 via-yellow-400 to-red-600 rounded-lg shadow-lg">
        <Button
          variant={isListening ? "destructive" : "default"}
          size="sm"
          onClick={isListening ? stopListening : startListening}
          className="flex items-center gap-2"
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          {isListening ? 'ማቆም' : amharicPhrases.speak}
        </Button>
        
        <Button
          variant={isSpeaking ? "destructive" : "secondary"}
          size="sm"
          onClick={isSpeaking ? stopSpeaking : () => speak(amharicPhrases.welcome)}
          className="flex items-center gap-2"
        >
          {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {isSpeaking ? 'ዝጋ' : 'ተናገር'}
        </Button>
        
        {transcript && (
          <div className="text-sm text-white bg-black/20 px-2 py-1 rounded">
            {transcript}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;