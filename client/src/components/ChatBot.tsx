import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Send, Bot, User, Volume2, Mic, MicOff } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export default function ChatBot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getLanguageCode();
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }

    // Add welcome message when chat opens
    if (isOpen && messages.length === 0) {
      addBotMessage(getWelcomeMessage());
    }
  }, [isOpen, language]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getLanguageCode = () => {
    switch (language) {
      case 'am': return 'am-ET';
      case 'om': return 'om-ET';
      case 'ti': return 'ti-ET';
      default: return 'en-US';
    }
  };

  const getWelcomeMessage = () => {
    const messages = {
      en: "Hello! I'm your AddisBus Connect assistant. I can help you with bus routes, schedules, fares, and general transportation information. How can I assist you today?",
      am: "ሰላም! እኔ የአዲስ ቡስ ኮነክት ረዳትዎ ነኝ። ስለ አውቶቡስ መንገዶች፣ መርሐ ግብሮች፣ ክፍያዎች እና አጠቃላይ የመጓጓዣ መረጃዎች ልረዳዎ እችላለሁ። ዛሬ እንዴት ልረዳዎ?",
      om: "Akkam! Ani gargaaraa AddisBus Connect keessan. Waa'ee karaalee otobusii, sagantaalee, kaffaltii fi odeeffannoo geejjibaa waliigalaa isin gargaaruu nan danda'a. Har'a akkamitti isin gargaaruu danda'a?",
      ti: "ሰላም! ኣነ ናይ ኣዲስ ቡስ ኮነክት ሓጋዚኹም እየ። ብዛዕባ ኣውቶቡስ መስመራት፣ ሰሌዳታት፣ ክፍሊት እሞ ሓፈሻዊ ናይ መጓዓዝያ ሓበሬታ ክሕግዘኩም እኽእል። ሎሚ ከመይ ክሕግዘኩም እኽእል?"
    };
    return messages[language as keyof typeof messages] || messages.en;
  };

  const addMessage = (content: string, type: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addBotMessage = (content: string) => {
    addMessage(content, 'bot');
    // Speak the bot message
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = getLanguageCode();
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Route information
    if (lowerMessage.includes('route') || lowerMessage.includes('መንገድ') || lowerMessage.includes('karaa') || lowerMessage.includes('መስመር')) {
      const responses = {
        en: "Our main routes include: Route 1 (Meskel - Bole), Route 2 (Meskel - Piassa), Route 3 (Meskel - Mercato), and Route 4 (Bole - Airport). Each route runs every 10-15 minutes during peak hours. Which specific route would you like to know more about?",
        am: "ዋና መንገዶቻችን የሚከተሉት ናቸው፡ መንገድ 1 (መስቀል - ቦሌ)፣ መንገድ 2 (መስቀል - ፒያሳ)፣ መንገድ 3 (መስቀል - መርካቶ)፣ እና መንገድ 4 (ቦሌ - አየር ማረፊያ)። እያንዳንዱ መንገድ በከፍተኛ ሰዓታት በየ10-15 ደቂቃ ይሰራል። የትኛውን መንገድ በዝርዝር ማወቅ ይፈልጋሉ?",
        om: "Karaaleen keenya ijoo: Karaa 1 (Meskel - Bole), Karaa 2 (Meskel - Piassa), Karaa 3 (Meskel - Mercato), fi Karaa 4 (Bole - Buufata Xiyyaaraa) dha. Karaan tokkoon tokkoon sa'aatii baay'ee nama baay'ee keessa daqiiqaa 10-15 hojjeta. Karaa kam waa'ee bal'inaan beekuu barbaadda?",
        ti: "ቀንዲ መስመራትና እዞም ዝስዕቡ እዮም፡ መስመር 1 (መስቀል - ቦሌ)፣ መስመር 2 (መስቀል - ፒያሳ)፣ መስመር 3 (መስቀል - መርካቶ)፣ እሞ መስመር 4 (ቦሌ - ኣየር ማረፊያ)። ነፍሲ ወከፍ መስመር ኣብ ዝበዝሑ ሰዓታት ኣብ ነፍሲ ወከፍ 10-15 ደቒቓ ይሰርሕ። ኣየናይ መስመር ብዝርዝር ክትፈልጥ ትደሊ?"
      };
      return responses[language as keyof typeof responses] || responses.en;
    }
    
    // Schedule information
    if (lowerMessage.includes('schedule') || lowerMessage.includes('time') || lowerMessage.includes('መርሐ ግብር') || lowerMessage.includes('ሰዓት') || lowerMessage.includes('sagantaa') || lowerMessage.includes('yeroo') || lowerMessage.includes('ሰሌዳ')) {
      const responses = {
        en: "Buses operate from 5:30 AM to 10:00 PM daily. Peak hours are 7:00-9:00 AM and 5:00-7:00 PM with buses every 5-10 minutes. Off-peak hours have buses every 15-20 minutes. First bus starts at 5:30 AM, last bus at 9:45 PM.",
        am: "አውቶቡሶች ከጠዋቱ 5:30 እስከ ምሽቱ 10:00 ድረስ በየቀኑ ይሰራሉ። ከፍተኛ ሰዓታት ከጠዋቱ 7:00-9:00 እና ከምሽቱ 5:00-7:00 ሲሆን አውቶቡሶች በየ5-10 ደቂቃ ይመጣሉ። ዝቅተኛ ሰዓታት በየ15-20 ደቂቃ አውቶቡሶች አሉ። የመጀመሪያው አውቶቡስ ጠዋት 5:30 ይጀምራል፣ የመጨረሻው ምሽት 9:45።",
        om: "Otobusoonni guyyaa guyyaan ganama 5:30 hanga galgala 10:00 hojjetu. Sa'aatiin baay'ee nama baay'ee ganama 7:00-9:00 fi galgala 5:00-7:00 yoo ta'u otobusoonni daqiiqaa 5-10 keessatti dhufan. Sa'aatii nama xiqqaa keessa daqiiqaa 15-20 keessatti otobusoonni ni jiru. Otobusiin jalqabaa ganama 5:30 jalqaba, kan dhumaa galgala 9:45.",
        ti: "ኣውቶቡሳት ካብ ንግሆ 5:30 ክሳብ ምሸት 10:00 ኩሉ መዓልቲ ይሰርሑ። ዝበዝሑ ሰዓታት ካብ ንግሆ 7:00-9:00 እሞ ካብ ምሸት 5:00-7:00 ኮይኖም ኣውቶቡሳት ኣብ ነፍሲ ወከፍ 5-10 ደቒቓ ይመጹ። ዝሓደሩ ሰዓታት ኣብ ነፍሲ ወከፍ 15-20 ደቒቓ ኣውቶቡሳት ኣለዉ። ቀዳማይ ኣውቶቡስ ንግሆ 5:30 ይጅምር፣ ናይ መወዳእታ ምሸት 9:45።"
      };
      return responses[language as keyof typeof responses] || responses.en;
    }
    
    // Fare information
    if (lowerMessage.includes('fare') || lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('ክፍያ') || lowerMessage.includes('ዋጋ') || lowerMessage.includes('kaffaltii') || lowerMessage.includes('gatii') || lowerMessage.includes('ክፍሊት')) {
      const responses = {
        en: "Bus fares are: Short distance (1-3 stops): 3 ETB, Medium distance (4-8 stops): 5 ETB, Long distance (9+ stops): 8 ETB. Students get 50% discount with valid ID. Senior citizens (65+) ride free. You can pay with cash, Telebirr, or CBE Birr.",
        am: "የአውቶቡስ ክፍያዎች፡ አጭር ርቀት (1-3 ማቆሚያዎች)፡ 3 ብር፣ መካከለኛ ርቀት (4-8 ማቆሚያዎች)፡ 5 ብር፣ ረጅም ርቀት (9+ ማቆሚያዎች)፡ 8 ብር። ተማሪዎች በትክክለኛ መታወቂያ 50% ቅናሽ ያገኛሉ። ከ65 ዓመት በላይ የሆኑ ዜጎች ነጻ ይጓዛሉ። በጥሬ ገንዘብ፣ ቴሌብር ወይም ሲቢኢ ብር መክፈል ይችላሉ።",
        om: "Kaffaltiin otobusii: Fageenya gabaabaa (dhaabbilee 1-3): ETB 3, Fageenya giddugaleessa (dhaabbilee 4-8): ETB 5, Fageenya dheeraa (dhaabbilee 9+): ETB 8. Barattoonni ragaa sirrii qabaatan harka 50% argatu. Jaarsoliin (waggaa 65+) bilisaan deeman. Maallaqa, Telebirr ykn CBE Birr itti kaffaluu dandeessa.",
        ti: "ናይ ኣውቶቡስ ክፍሊት፡ ሓጺር ርሕቀት (1-3 መዓርፎታት)፡ 3 ብር፣ ማእከላይ ርሕቀት (4-8 መዓርፎታት)፡ 5 ብር፣ ነዊሕ ርሕቀት (9+ መዓርፎታት)፡ 8 ብር። ተማሃሮ ብቅኑዕ መንነት 50% ቅናሽ ይረኽቡ። ዓበይቲ (65+) ነጻ ይጓዓዙ። ብጥሬ ገንዘብ፣ ቴሌብር ወይ ሲቢኢ ብር ክትኸፍል ትኽእል።"
      };
      return responses[language as keyof typeof responses] || responses.en;
    }
    
    // Safety information
    if (lowerMessage.includes('safety') || lowerMessage.includes('security') || lowerMessage.includes('ደህንነት') || lowerMessage.includes('nageenya') || lowerMessage.includes('ሰላምነት')) {
      const responses = {
        en: "Safety tips: Keep valuables secure, be aware of your surroundings, report suspicious activities to bus staff or authorities. Emergency number: 911. All buses have CCTV cameras and emergency buttons. Stay near well-lit areas at bus stops.",
        am: "የደህንነት ምክሮች፡ ውድ ዕቃዎችዎን በደህና ያስቀምጡ፣ በአካባቢዎ ያለውን ሁኔታ ያውቁ፣ አጠራጣሪ እንቅስቃሴዎችን ለአውቶቡስ ሰራተኞች ወይም ባለስልጣናት ያሳውቁ። የአደጋ ጊዜ ቁጥር፡ 911። ሁሉም አውቶቡሶች የሲሲቲቪ ካሜራዎች እና የአደጋ ጊዜ ቁልፎች አሏቸው። በአውቶቡስ ማቆሚያዎች በደንብ በሚበራ አካባቢ ይቆዩ።",
        om: "Gorsa nageenya: Meeshaalee gatii guddaa qaban nagaan eegaa, naannoo keessan beekaa, sochii shakkii qabu hojjettoota otobusii ykn aangoo kennaniif himaa. Lakkoofsa balaa: 911. Otobusoonni hundi kaameraa CCTV fi qabduu balaa qabu. Buufatoota otobusii keessatti naannoo ifaan ibsamu biratti turaa.",
        ti: "ናይ ሰላምነት ምኽርታት፡ ክቡራት ንብረትኩም ብሰላም ሓልዩ፣ ኣብ ከባቢኹም ዘሎ ኩነታት ፍለጡ፣ ጥርጡር ንጥፈታት ንሰራሕተኛታት ኣውቶቡስ ወይ ሓለፍቲ ሕብሩ። ናይ ሓደጋ ቁጽሪ፡ 911። ኩሎም ኣውቶቡሳት ናይ ሲሲቲቪ ካሜራታትን ናይ ሓደጋ ቁልፍታትን ኣለዎም። ኣብ ኣውቶቡስ መዓርፎታት ብጽቡቕ ዝበርሃ ቦታታት ቀረቡ።"
      };
      return responses[language as keyof typeof responses] || responses.en;
    }
    
    // Default response
    const defaultResponses = {
      en: "I can help you with information about bus routes, schedules, fares, safety tips, and general transportation questions. You can also ask me about specific stations or how to get from one place to another. What would you like to know?",
      am: "ስለ አውቶቡስ መንገዶች፣ መርሐ ግብሮች፣ ክፍያዎች፣ የደህንነት ምክሮች እና አጠቃላይ የመጓጓዣ ጥያቄዎች መረጃ ልረዳዎ እችላለሁ። ስለ ልዩ ጣቢያዎች ወይም ከአንድ ቦታ ወደ ሌላ እንዴት መሄድ እንደሚቻል መጠየቅ ይችላሉ። ምን ማወቅ ይፈልጋሉ?",
      om: "Waa'ee karaalee otobusii, sagantaalee, kaffaltii, gorsa nageenya fi gaaffilee geejjibaa waliigalaa odeeffannoo isin gargaaruu nan danda'a. Buufatoota addaa ykn bakka tokko irraa gara bakka biraatti akkamitti akka deeman gaafachuu dandeessu. Maal beekuu barbaaddu?",
      ti: "ብዛዕባ ኣውቶቡስ መስመራት፣ ሰሌዳታት፣ ክፍሊት፣ ናይ ሰላምነት ምኽርታት እሞ ሓፈሻዊ ናይ መጓዓዝያ ሕቶታት ሓበሬታ ክሕግዘኩም እኽእል። ብዛዕባ ፍሉይ ጣቢያታት ወይ ካብ ሓደ ቦታ ናብ ካልእ ከመይ ክትኸዱ ከም እትኽእሉ ክትሓቱ ትኽእሉ። እንታይ ክትፈልጡ ትደልዩ?"
    };
    return defaultResponses[language as keyof typeof defaultResponses] || defaultResponses.en;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    addMessage(inputValue, 'user');
    setInputValue("");
    setIsTyping(true);
    
    // Simulate bot thinking time
    setTimeout(() => {
      const response = getBotResponse(inputValue);
      addBotMessage(response);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (content: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = getLanguageCode();
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-20 left-4 md:bottom-6 bg-primary hover:bg-primary/90 text-white w-14 h-14 rounded-full shadow-lg z-30"
            size="lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Assistant
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.type === 'bot' && (
                        <Button
                          onClick={() => speakMessage(message.content)}
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-6 p-1 text-xs"
                        >
                          <Volume2 className="h-3 w-3 mr-1" />
                          Speak
                        </Button>
                      )}
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="border-t pt-4 mt-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about routes, schedules, fares..."
                  className="flex-1"
                />
                <Button
                  onClick={isListening ? stopListening : startListening}
                  variant="outline"
                  size="sm"
                  className={isListening ? "bg-red-50 border-red-200" : ""}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button onClick={handleSend} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {isListening && (
                <p className="text-xs text-gray-500 mt-1">Listening...</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

