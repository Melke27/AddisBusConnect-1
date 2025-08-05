import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useLanguage } from "../hooks/useLanguage";
import { useAuth } from "../hooks/useAuth";
import type { IUser } from "@shared/schema";
import { QrCode, Bus, Calendar, Clock, MapPin, CreditCard } from "lucide-react";
import QRCode from "../components/QRCode";
import Navigation from "../components/Navigation";

interface Ticket {
  _id: string;
  userId: string;
  routeId: string;
  routeName: string;
  fromStop: string;
  toStop: string;
  price: number;
  status: 'active' | 'used' | 'expired';
  purchaseTime: string;
  validUntil: string;
  qrCode: string;
}

export default function UserTickets() {
  const { t, language } = useLanguage();
  const { user } = useAuth() as { user: IUser | undefined };

  const { data: tickets = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets', user?._id],
    queryFn: async () => {
      // Mock data for now
      return [
        {
          _id: '1',
          userId: user?._id || '',
          routeId: 'route-1',
          routeName: 'Arat Kilo ↔ Merkato',
          fromStop: 'Arat Kilo',
          toStop: 'Merkato',
          price: 15.00,
          status: 'active',
          purchaseTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          qrCode: 'TICKET_001_2024'
        },
        {
          _id: '2',
          userId: user?._id || '',
          routeId: 'route-2',
          routeName: 'Bole ↔ Piassa',
          fromStop: 'Bole',
          toStop: 'Piassa',
          price: 18.00,
          status: 'used',
          purchaseTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          validUntil: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          qrCode: 'TICKET_002_2024'
        }
      ];
    },
    enabled: !!user?._id,
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeTickets = tickets.filter(t => t.status === 'active');
  const pastTickets = tickets.filter(t => t.status === 'used' || t.status === 'expired');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 pb-20 md:pb-6">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <p className="text-gray-600">Manage your bus tickets and travel history</p>
        </div>

        {/* Active Tickets */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <QrCode className="h-6 w-6 text-green-600" />
            Active Tickets ({activeTickets.length})
          </h2>
          
          {activeTickets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No active tickets</p>
                <Button>Purchase Ticket</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeTickets.map((ticket) => (
                <Card key={ticket._id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Ticket Details */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Bus className="h-5 w-5 text-primary" />
                            {ticket.routeName}
                          </h3>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm text-gray-600">From</p>
                              <p className="font-medium">{ticket.fromStop}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <div>
                              <p className="text-sm text-gray-600">To</p>
                              <p className="font-medium">{ticket.toStop}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Purchased</p>
                              <p className="text-sm">{formatDate(ticket.purchaseTime)} at {formatTime(ticket.purchaseTime)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <div>
                              <p className="text-sm text-gray-600">Valid Until</p>
                              <p className="text-sm">{formatDate(ticket.validUntil)} at {formatTime(ticket.validUntil)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Amount Paid</p>
                            <p className="font-semibold text-green-600">{ticket.price} ETB</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* QR Code */}
                      <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                        <div className="mb-2">
                          <QRCode value={ticket.qrCode} size={120} />
                        </div>
                        <p className="text-xs text-gray-600 text-center">
                          Show this QR code to the conductor
                        </p>
                        <p className="text-xs font-mono text-gray-500 mt-1">
                          {ticket.qrCode}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Past Tickets */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-gray-600" />
            Travel History ({pastTickets.length})
          </h2>
          
          {pastTickets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">No travel history yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pastTickets.map((ticket) => (
                <Card key={ticket._id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bus className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{ticket.routeName}</p>
                          <p className="text-sm text-gray-600">
                            {ticket.fromStop} → {ticket.toStop}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(ticket.purchaseTime)} • {ticket.price} ETB
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(ticket.status)} variant="secondary">
                        {ticket.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}