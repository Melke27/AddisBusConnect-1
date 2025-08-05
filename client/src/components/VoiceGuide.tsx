import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, VolumeX, Mic, MicOff } from "lucide-react";

interface VoiceGuideProps {
  text?: string;
  autoSpeak?: boolean;
}

export default function VoiceGuide({ text, autoSpeak = false }: VoiceGuideProps) {
  // Set supported languages
  const supportedLanguages = [
    { code: 'am', label: 'አማርኛ', speech: 'am-ET' },
    { code: 'en', label: 'English', speech: 'en-US' },
  ];
  const [responseLang, setResponseLang] = useState<'am' | 'en'>('am');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'am-ET,en-US'; // Accept both Amharic and English
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    if (autoSpeak && text) {
      speak(text, responseLang);
    }
  }, [text, autoSpeak]);

  const getLanguageCode = (lang: 'am' | 'en') => lang === 'am' ? 'am-ET' : 'en-US';

  const speak = (textToSpeak: string, lang: 'am' | 'en' = 'am') => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = getLanguageCode(lang);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = (command: string) => {
    // Detect language
    let lang: 'am' | 'en' = 'am';
    if (/[a-z]/i.test(command)) lang = 'en';
    setResponseLang(lang);
    // Basic voice commands
    if (
      command.includes('station') || command.includes('ጣቢያ')
    ) {
      speak(getStationInfo(lang), lang);
    } else if (
      command.includes('route') || command.includes('መንገድ')
    ) {
      speak(getRouteInfo(lang), lang);
    } else if (
      command.includes('time') || command.includes('ሰዓት')
    ) {
      speak(getTimeInfo(lang), lang);
    } else if (
      command.includes('help') || command.includes('እርዳታ')
    ) {
      speak(getHelpInfo(lang), lang);
    } else {
      speak(getDefaultResponse(lang), lang);
    }
  };

  const getStationInfo = (lang: 'am' | 'en') => {
    if (lang === 'en') {
      return "The nearest bus station is Meskel Square, 200 meters away. It serves routes to Bole, Piassa, and Mercato.";
    }
    return "በጣም ቅርብ የሆነው የአውቶቡስ ጣቢያ መስቀል አደባባይ ነው፣ 200 ሜትር ርቀት ላይ። ወደ ቦሌ፣ ፒያሳ እና መርካቶ የሚሄዱ መንገዶችን ያገለግላል።";
  };
  const getRouteInfo = (lang: 'am' | 'en') => {
    if (lang === 'en') {
      return "Bus routes from Meskel Square go to Bole, Piassa, and Mercato. Please use the direct route.";
    }
    return "የአውቶቡስ መንገዶቹ ከመስቀል አደባባይ ወደ ቦሌ፣ ፒያሳ እና መርካቶ ይሄዳሉ። በቀጥታ መንገድ ይጠቀሙ።";
  };
  const getTimeInfo = (lang: 'am' | 'en') => {
    if (lang === 'en') {
      return "The next bus will arrive in 5 minutes. Please wait at the station.";
    }
    return "ቀጣዩ አውቶቡስ በ5 ደቂቃ ውስጥ ይደርሳል። እባክዎ በጣቢያው ይጠብቁ።";
  };
  const getHelpInfo = (lang: 'am' | 'en') => {
    if (lang === 'en') {
      return "You can ask me about nearby stations, bus routes, arrival times, or say 'help' for assistance. I support voice commands in English and Amharic.";
    }
    return "ስለ አቅራቢያ ጣቢያዎች፣ የአውቶቡስ መንገዶች፣ የመድረሻ ሰዓቶች ወይም ለእርዳታ 'እርዳታ' ማለት ይችላሉ። የድምጽ ትዕዛዞችን በአማርኛ እና በእንግሊዝኛ እደግፋለሁ።";
  };
  const getDefaultResponse = (lang: 'am' | 'en') => {
    if (lang === 'en') {
      return "I didn't understand that command. You can ask about stations, routes, times, or say 'help' for assistance.";
    }
    return "ያንን ትዕዛዝ አልተረዳሁትም። ስለ ጣቢያዎች፣ መንገዶች፣ ሰዓቶች መጠየቅ ወይም ለእርዳታ 'እርዳታ' ማለት ይችላሉ።";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          የድምጽ አገልግሎት / Voice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {text && (
            <Button
              onClick={() => speak(text, responseLang)}
              disabled={isSpeaking}
              className="flex-1"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-4 w-4 mr-2" />
                  {responseLang === 'am' ? 'በመናገር ላይ...' : 'Speaking...'}
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  {responseLang === 'am' ? 'አንብብ' : 'Speak'}
                </>
              )}
            </Button>
          )}
          
          {isSpeaking && (
            <Button onClick={stopSpeaking} variant="outline">
              <VolumeX className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "outline"}
            className="flex-1"
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                {responseLang === 'am' ? 'ስማት አቁም' : 'Stop Listening'}
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                {responseLang === 'am' ? 'የድምጽ ትዕዛዝ' : 'Voice Command'}
              </>
            )}
          </Button>
        </div>
        
        {isListening && (
          <div className="text-center text-sm text-gray-600">
            {responseLang === 'am'
              ? 'በድምጽ ትዕዛዝ ላይ... "ጣቢያ", "መንገድ", "ሰዓት" ወይም "እርዳታ" ይሉ'
              : 'Listening... Try saying "station", "route", "time", or "help"'}
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          የተደገፉ ቋንቋዎች፡ አማርኛ, English
        </div>
      </CardContent>
    </Card>
  );
}

