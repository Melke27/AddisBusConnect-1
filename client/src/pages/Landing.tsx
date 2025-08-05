import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/LanguageSelector";
import { Bus, MapPin, Smartphone, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Real-time Tracking",
      description: "Track bus locations live on interactive maps"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Digital Ticketing",
      description: "Buy tickets instantly with mobile payments"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Arrival Times",
      description: "Get accurate bus arrival predictions"
    },
    {
      icon: <Bus className="h-8 w-8 text-primary" />,
      title: "Route Planning",
      description: "Find the best routes to your destination"
    }
  ];

  // Check if we're in local development mode (browser environment)
  const isLocalDev = typeof window !== 'undefined';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-600">
      {/* Header */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center text-white">
        <div className="mb-8">
          <Bus className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('appName')}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
            {t('auth.loginDescription')}
          </p>
          
          {isLocalDev ? (
            <Link href="/">
              <Button
                size="lg"
                className="bg-secondary hover:bg-yellow-500 text-gray-900 font-medium text-lg px-8 py-3"
              >
                {t('auth.getStarted')}
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              className="bg-secondary hover:bg-yellow-500 text-gray-900 font-medium text-lg px-8 py-3"
              onClick={() => window.location.href = '/api/login'}
            >
              {t('auth.getStarted')}
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mt-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-blue-100 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
        Smart transportation for Addis Ababa
      </div>
    </div>
  );
}
