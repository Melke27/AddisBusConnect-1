import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import LanguageSelector from "./LanguageSelector";
import { Bus, Bell, User, Home, Map, Ticket, UserIcon, Calendar, Settings, LogOut, Shield, ChevronDown, MapPin, Radar } from "lucide-react";

export default function Navigation() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();

  // Debug logging to check user and admin status
  if (isAuthenticated) {
    console.log('User data:', user);
    console.log('Is admin:', isAdmin);
    console.log('User role:', user?.role);
  }

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-200">
                      <Bus className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <MapPin className="h-2 w-2 text-gray-800" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors">
                      AddisBus Connect
                    </h1>
                    <p className="text-xs text-blue-100 opacity-80">
                      Smart Transportation
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link href="/notifications">
                    <Bell className="h-5 w-5 cursor-pointer hover:bg-white/20 p-1 rounded transition-colors" />
                  </Link>
                  <Link href="/schedule">
                    <Calendar className="h-5 w-5 cursor-pointer hover:bg-white/20 p-1 rounded transition-colors" />
                  </Link>
                  <Link href="/tickets">
                    <Ticket className="h-5 w-5 cursor-pointer hover:bg-white/20 p-1 rounded transition-colors" />
                  </Link>
                  
                  {isAdmin && (
                    <div className="flex items-center space-x-2">
                      <Link href="/">
                        <Button variant="ghost" className={`flex items-center space-x-2 ${isActive('/') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                          <Home className="h-5 w-5" />
                          <span>Home</span>
                        </Button>
                      </Link>
                      <Link href="/admin">
                        <Button variant="ghost" className={`flex items-center space-x-2 ${isActive('/admin') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                          <Shield className="h-5 w-5" />
                          <span>Admin</span>
                        </Button>
                      </Link>
                      <Link href="/live-tracking">
                        <Button variant="ghost" className={`flex items-center space-x-2 ${isActive('/live-tracking') ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                          <Radar className="h-5 w-5" />
                          <span>Live Tracking</span>
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-white hover:bg-white/20 p-2 border border-white/30">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <User className="h-4 w-4" />
                          </div>
                          <span className="hidden sm:inline text-sm font-medium">
                            {user?.firstName || 'User'}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth?mode=login">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 border border-white/30">
                      {String(t('auth.login'))}
                    </Button>
                  </Link>
                  <Link href="/auth?mode=signup">
                    <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium border-0">
                      {String(t('auth.signUp'))}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
          <div className="flex justify-around items-center h-16">
            <Link href="/">
              <div className={`flex flex-col items-center p-2 ${isActive('/') ? 'text-primary' : 'text-gray-500'}`}>
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">{String(t('nav.home'))}</span>
              </div>
            </Link>
            
            <Link href="/map">
              <div className={`flex flex-col items-center p-2 ${isActive('/map') ? 'text-primary' : 'text-gray-500'}`}>
                <Map className="h-5 w-5" />
                <span className="text-xs mt-1">{String(t('nav.map'))}</span>
              </div>
            </Link>
            
            <Link href="/tickets">
              <div className={`flex flex-col items-center p-2 ${isActive('/tickets') ? 'text-primary' : 'text-gray-500'}`}>
                <Ticket className="h-5 w-5" />
                <span className="text-xs mt-1">{String(t('nav.tickets'))}</span>
              </div>
            </Link>
            
            <Link href="/profile">
              <div className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'text-primary' : 'text-gray-500'}`}>
                <UserIcon className="h-5 w-5" />
                <span className="text-xs mt-1">{String(t('nav.profile'))}</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
