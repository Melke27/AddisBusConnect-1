import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import type { Bus, Ticket } from "@shared/schema";
import { 
  ArrowLeft, 
  BarChart3, 
  Bus as BusIcon, 
  TicketIcon, 
  DollarSign,
  AlertTriangle,
  Route,
  TrendingUp
} from "lucide-react";

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { t } = useLanguage();

  const { data: buses, isLoading: busesLoading } = useQuery<Bus[]>({
    queryKey: ['/api/admin/buses'],
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/admin/payments'],
  });

  // Calculate stats
  const activeBuses = buses?.filter(bus => bus.status === 'active').length || 0;
  const todayTickets = payments?.filter(ticket => {
    const today = new Date().toDateString();
    return new Date(ticket.purchaseTime!).toDateString() === today;
  }).length || 0;
  
  const todayRevenue = payments?.filter(ticket => {
    const today = new Date().toDateString();
    return new Date(ticket.purchaseTime!).toDateString() === today && ticket.paymentStatus === 'paid';
  }).reduce((sum, ticket) => sum + parseFloat(ticket.amount), 0) || 0;

  const activeAlerts = 3; // Mock data

  const statsCards = [
    {
      title: t('admin.activeBuses'),
      value: activeBuses,
      icon: <BusIcon className="h-5 w-5" />,
      color: 'bg-blue-50 text-primary'
    },
    {
      title: t('admin.todayTickets'),
      value: todayTickets,
      icon: <TicketIcon className="h-5 w-5" />,
      color: 'bg-green-50 text-success'
    },
    {
      title: t('admin.revenue'),
      value: todayRevenue.toFixed(2),
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-yellow-50 text-secondary'
    },
    {
      title: t('admin.alerts'),
      value: activeAlerts,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'bg-red-50 text-error'
    }
  ];

  const quickActions = [
    {
      title: t('admin.manageBuses'),
      description: t('admin.manageBusesDesc'),
      icon: <BusIcon className="h-6 w-6" />,
      color: 'bg-primary hover:bg-blue-700',
      action: () => console.log('Manage buses')
    },
    {
      title: t('admin.manageRoutes'),
      description: t('admin.manageRoutesDesc'),
      icon: <Route className="h-6 w-6" />,
      color: 'bg-success hover:bg-green-600',
      action: () => console.log('Manage routes')
    },
    {
      title: t('admin.viewReports'),
      description: t('admin.viewReportsDesc'),
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-secondary hover:bg-yellow-500 text-gray-900',
      action: () => console.log('View reports')
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
          
          <h1 className="text-2xl font-bold flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-primary" />
            {t('admin.dashboard')}
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  className={`${action.color} text-white p-4 h-auto text-left justify-start flex-col items-start space-y-2`}
                  onClick={action.action}
                >
                  <div className="flex items-center space-x-2">
                    {action.icon}
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Buses */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Active Buses</h3>
              {busesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {buses?.slice(0, 5).map((bus) => (
                    <div key={bus.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          bus.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span className="font-medium">{bus.plateNumber}</span>
                      </div>
                      <span className="text-sm text-gray-600 capitalize">{bus.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
              {paymentsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {payments?.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{payment.amount} ETB</div>
                        <div className="text-sm text-gray-600">{payment.paymentMethod}</div>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${
                        payment.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.paymentStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
