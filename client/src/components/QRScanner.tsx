import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/useLanguage";
import { QrCode, Camera, X, Volume2 } from "lucide-react";

interface QRScannerProps {
  onScan?: (data: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock QR data for demonstration
  const mockQRData = {
    stationId: "ST001",
    stationName: {
      en: "Meskel Square Station",
      am: "መስቀል አደባባይ ጣቢያ",
      om: "Buufata Meskel Square",
      ti: "መስቀል ኣደባባይ ጣቢያ"
    },
    routes: [
      { id: "R001", name: "Route 1: Meskel - Bole", nextBus: "5 min" },
      { id: "R002", name: "Route 2: Meskel - Piassa", nextBus: "8 min" }
    ],
    facilities: ["Waiting Area", "Restroom", "Ticket Booth"]
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = () => {
    // Simulate QR code scan
    setScannedData(JSON.stringify(mockQRData));
    stopCamera();
    onScan?.(JSON.stringify(mockQRData));
    
    // Speak the station information
    speakStationInfo();
  };

  const speakStationInfo = () => {
    if ('speechSynthesis' in window) {
      const stationName = mockQRData.stationName[language as keyof typeof mockQRData.stationName] || mockQRData.stationName.en;
      const routeInfo = mockQRData.routes.map(route => `${route.name}, next bus in ${route.nextBus}`).join('. ');
      
      const text = `${stationName}. Available routes: ${routeInfo}`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'am' ? 'am-ET' : 
                      language === 'om' ? 'om-ET' : 
                      language === 'ti' ? 'ti-ET' : 'en-US';
      
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const closeDialog = () => {
    setIsOpen(false);
    stopCamera();
    setScannedData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-auto p-4 flex flex-col items-center gap-2 bg-white hover:shadow-md transition-shadow w-full"
        >
          <div className="text-primary">
            <QrCode className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-center">Scan QR Code</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!scannedData ? (
            <>
              {!isScanning ? (
                <div className="text-center space-y-4">
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Point your camera at a QR code at any bus station to get instant information
                  </p>
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-48 bg-black rounded-lg"
                    />
                    <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleScan} className="flex-1">
                      Simulate Scan
                    </Button>
                    <Button variant="outline" onClick={stopCamera}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Volume2 className="h-5 w-5 text-green-600" />
                  {mockQRData.stationName[language as keyof typeof mockQRData.stationName] || mockQRData.stationName.en}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Available Routes:</h4>
                  <div className="space-y-2">
                    {mockQRData.routes.map((route) => (
                      <div key={route.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{route.name}</span>
                        <span className="text-sm font-medium text-green-600">Next: {route.nextBus}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Facilities:</h4>
                  <div className="flex flex-wrap gap-1">
                    {mockQRData.facilities.map((facility, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button onClick={speakStationInfo} variant="outline" className="w-full">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Repeat Audio Information
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={closeDialog}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

