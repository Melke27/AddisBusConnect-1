import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useLanguage } from "../hooks/useLanguage";
import { Bell, BellOff, Clock, Bus, MapPin, AlertCircle, CheckCircle, Settings } from "lucide-react";

interface Notification {
  id: string;
  type: 'delay' | 'arrival' | 'route_change' | 'service_update';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  routeId?: string;
  routeName?: string;
}

interface NotificationSettings {
  busArrivals: boolean;
  delays: boolean;
  routeChanges: boolean;
  serviceUpdates: boolean;
  soundEnabled: boolean;
}

export default function Notifications() {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    busArrivals: true,
    delays: true,
    routeChanges: true,
    serviceUpdates: true,
    soundEnabled: false,
  });

  // Initialize with some mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'arrival',
        title: 'Bus Arriving Soon',
        message: 'Bus AA-101-001 on Arat Kilo ↔ Merkato route will arrive at Arat Kilo in 3 minutes',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        routeId: 'route-1',
        routeName: 'Arat Kilo ↔ Merkato'
      },
      {
        id: '2',
        type: 'delay',
        title: 'Service Delay',
        message: 'Bole ↔ Piassa route is experiencing 10-minute delays due to traffic congestion',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        routeId: 'route-2',
        routeName: 'Bole ↔ Piassa'
      },
      {
        id: '3',
        type: 'service_update',
        title: 'Service Update',
        message: 'Extended operating hours for Gerji ↔ Stadium route during the holiday season',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        routeId: 'route-3',
        routeName: 'Gerji ↔ Stadium'
      },
      {
        id: '4',
        type: 'route_change',
        title: 'Route Modification',
        message: 'Temporary route diversion for Arat Kilo ↔ Merkato due to road construction near Merkato',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        routeId: 'route-1',
        routeName: 'Arat Kilo ↔ Merkato'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'arrival':
        return <Bus className="h-5 w-5 text-green-600" />;
      case 'delay':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'route_change':
        return <MapPin className="h-5 w-5 text-blue-600" />;
      case 'service_update':
        return <AlertCircle className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'arrival':
        return 'bg-green-100 text-green-800';
      case 'delay':
        return 'bg-orange-100 text-orange-800';
      case 'route_change':
        return 'bg-blue-100 text-blue-800';
      case 'service_update':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // In a real app, this would save to the backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="relative">
              All Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* All Notifications */}
          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No notifications yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge 
                                className={`text-xs capitalize ${getNotificationBadgeColor(notification.type)}`}
                                variant="secondary"
                              >
                                {notification.type.replace('_', ' ')}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatTimeAgo(notification.timestamp)}</span>
                            {notification.routeName && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {notification.routeName}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-600"
                        >
                          ×
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Unread Notifications */}
          <TabsContent value="unread" className="space-y-4">
            {notifications.filter(n => !n.read).length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">All notifications have been read!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {notifications.filter(n => !n.read).map((notification) => (
                  <Card
                    key={notification.id}
                    className="cursor-pointer transition-all hover:shadow-md border-l-4 border-l-primary bg-primary/5"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge 
                              className={`text-xs capitalize ${getNotificationBadgeColor(notification.type)}`}
                              variant="secondary"
                            >
                              {notification.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatTimeAgo(notification.timestamp)}</span>
                            {notification.routeName && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {notification.routeName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <p className="text-sm text-gray-600">
                  Choose what notifications you'd like to receive
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bus className="h-4 w-4 text-green-600" />
                        <p className="font-medium">Bus Arrivals</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Get notified when your bus is arriving
                      </p>
                    </div>
                    <Switch
                      checked={settings.busArrivals}
                      onCheckedChange={(checked) => updateSettings('busArrivals', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <p className="font-medium">Delays & Disruptions</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Stay informed about service delays
                      </p>
                    </div>
                    <Switch
                      checked={settings.delays}
                      onCheckedChange={(checked) => updateSettings('delays', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <p className="font-medium">Route Changes</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Get updates about route modifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.routeChanges}
                      onCheckedChange={(checked) => updateSettings('routeChanges', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-purple-600" />
                        <p className="font-medium">Service Updates</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Receive general service announcements
                      </p>
                    </div>
                    <Switch
                      checked={settings.serviceUpdates}
                      onCheckedChange={(checked) => updateSettings('serviceUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-600" />
                        <p className="font-medium">Sound Notifications</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Play sound for important notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSettings('soundEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}