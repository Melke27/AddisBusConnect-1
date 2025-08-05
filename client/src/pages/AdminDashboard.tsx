import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../hooks/useLanguage";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../components/ui/use-toast";
import Navigation from "../components/Navigation";
import { LocationManagement } from "../components/admin/LocationManagement";
import type { IBus, ITicket, IUser, IRoute, IStop } from "../shared/schema";
import { 
  ArrowLeft, 
  BarChart3, 
  Bus as BusIcon, 
  TicketIcon, 
  DollarSign,
  AlertTriangle,
  Route,
  TrendingUp,
  MapPin,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Activity
} from "lucide-react";

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoute, setSelectedRoute] = useState<IRoute | null>(null);
  const [selectedBus, setSelectedBus] = useState<IBus | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onBack} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch data
  const { data: statistics } = useQuery({
    queryKey: ['/api/admin/statistics'],
  });

  const { data: users } = useQuery<IUser[]>({
    queryKey: ['/api/admin/users'],
  });

  const { data: routes } = useQuery<IRoute[]>({
    queryKey: ['/api/routes'],
  });

  const { data: buses } = useQuery<IBus[]>({
    queryKey: ['/api/buses'],
  });

  const { data: tickets } = useQuery<ITicket[]>({
    queryKey: ['/api/admin/tickets'],
  });

  const statsCards = [
    {
      title: t('admin.totalUsers'),
      value: statistics?.totalUsers || 0,
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-50 text-primary'
    },
    {
      title: t('admin.activeBuses'),
      value: statistics?.activeBuses || 0,
      icon: <BusIcon className="h-5 w-5" />,
      color: 'bg-green-50 text-success'
    },
    {
      title: t('admin.todayTickets'),
      value: statistics?.todayTickets || 0,
      icon: <TicketIcon className="h-5 w-5" />,
      color: 'bg-yellow-50 text-secondary'
    },
    {
      title: t('admin.todayRevenue'),
      value: `$${statistics?.todayRevenue || '0.00'}`,
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const quickActions = [
    {
      title: t('admin.manageUsers'),
      description: t('admin.manageUsersDesc'),
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => setActiveTab('users')
    },
    {
      title: t('admin.manageRoutes'),
      description: t('admin.manageRoutesDesc'),
      icon: <Route className="h-6 w-6" />,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => setActiveTab('routes')
    },
    {
      title: t('admin.manageBuses'),
      description: t('admin.manageBusesDesc'),
      icon: <BusIcon className="h-6 w-6" />,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => setActiveTab('buses')
    },
    {
      title: t('admin.manageLocations'),
      description: t('admin.manageLocationsDesc'),
      icon: <MapPin className="h-6 w-6" />,
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => setActiveTab('locations')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-primary" />
              {t('admin.dashboard')}
            </h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Admin
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="buses">Buses</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className={`p-4 rounded-lg ${stat.color}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-gray-600">{stat.title}</div>
                        </div>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={action.action}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-3 ${action.color} text-white`}>
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BusIcon className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">New bus registered</p>
                        <p className="text-sm text-gray-600">AA-101-001 added to route Arat Kilo ↔ Merkato</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TicketIcon className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium">Ticket purchased</p>
                        <p className="text-sm text-gray-600">User purchased ticket for Bole ↔ Piassa route</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">1 hour ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.preferredLanguage.toUpperCase()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Route Management</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Route
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route Name</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes?.map((route) => (
                      <TableRow key={route._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{route.nameEn}</p>
                            <p className="text-sm text-gray-600">{route.nameAm}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{route.startTimeHour}:{route.startTimeMinute.toString().padStart(2, '0')} - {route.endTimeHour}:{route.endTimeMinute.toString().padStart(2, '0')}</p>
                            <p className="text-gray-600">Every {route.frequencyMinutes} min</p>
                          </div>
                        </TableCell>
                        <TableCell>${route.price}</TableCell>
                        <TableCell>
                          <Badge variant={route.isActive ? 'default' : 'secondary'}>
                            {route.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Bus Management</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Bus
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plate Number</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buses?.map((bus) => (
                      <TableRow key={bus._id}>
                        <TableCell className="font-medium">{bus.plateNumber}</TableCell>
                        <TableCell>{routes?.find(r => r._id === bus.routeId)?.nameEn || 'Unassigned'}</TableCell>
                        <TableCell>
                          <Badge variant={bus.status === 'active' ? 'default' : 'secondary'}>
                            {bus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {bus.currentLatitude && bus.currentLongitude ? (
                            <span className="text-sm">
                              {bus.currentLatitude.toFixed(4)}, {bus.currentLongitude.toFixed(4)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">No location</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {bus.lastUpdated ? new Date(bus.lastUpdated).toLocaleTimeString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Location Management</h2>
              <Button onClick={() => setActiveTab('overview')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview
              </Button>
            </div>
            <LocationManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
