import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import LanguageSelector from "./LanguageSelector";
import { Bus, Bell, User, Home, Map, Ticket, UserIcon } from "lucide-react";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bus className="h-6 w-6" />
                <h1 className="text-xl font-medium">{t('appName')}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 cursor-pointer hover:bg-blue-600 p-1 rounded" />
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                    <User className="h-4 w-4" />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-blue-600"
                    onClick={() => window.location.href = '/api/logout'}
                  >
                    {t('auth.logout')}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-blue-600"
                  onClick={() => window.location.href = '/api/login'}
                >
                  {t('auth.login')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
        <div className="flex justify-around py-2">
          <Link href="/">
            <button className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}>
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1">{t('navigation.home')}</span>
            </button>
          </Link>
          
          <Link href="/map">
            <button className={`flex flex-col items-center p-2 ${isActive('/map') ? 'text-primary' : 'text-gray-500'}`}>
              <Map className="h-5 w-5" />
              <span className="text-xs mt-1">{t('navigation.map')}</span>
            </button>
          </Link>
          
          <Link href="/tickets">
            <button className={`flex flex-col items-center p-2 ${isActive('/tickets') ? 'text-primary' : 'text-gray-500'}`}>
              <Ticket className="h-5 w-5" />
              <span className="text-xs mt-1">{t('navigation.tickets')}</span>
            </button>
          </Link>
          
          <Link href="/profile">
            <button className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}>
              <UserIcon className="h-5 w-5" />
              <span className="text-xs mt-1">{t('navigation.profile')}</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
