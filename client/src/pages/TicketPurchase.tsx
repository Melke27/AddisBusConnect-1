import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "../hooks/useLanguage";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import Navigation from "../components/Navigation";
import QRCode from "../components/QRCode";
import type { Route, Ticket } from "../shared/schema";
import { 
  ArrowLeft, 
  Ticket as TicketIcon, 
  Clock, 
  ShoppingCart,
  CheckCircle,
  Download,
  Share,
  Smartphone,
  CreditCard,
  Building2
} from "lucide-react";

interface TicketPurchaseProps {
  route: Route;
  onBack: () => void;
}

export default function TicketPurchase({ route, onBack }: TicketPurchaseProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [purchasedTicket, setPurchasedTicket] = useState<Ticket | null>(null);

  const purchaseMutation = useMutation({
    mutationFn: async () => {
      if (!paymentMethod) {
        throw new Error("Please select a payment method");
      }
      
      const response = await apiRequest('POST', '/api/tickets/purchase', {
        routeId: route.id,
        paymentMethod,
        amount: route.price,
      });
      
      return response.json();
    },
    onSuccess: (ticket: Ticket) => {
      setPurchasedTicket(ticket);
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      toast({
        title: t('common.success'),
        description: "Ticket purchased successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const paymentOptions = [
    {
      id: 'telebirr',
      name: t('payment.telebirr'),
      icon: <Smartphone className="h-5 w-5" />,
      color: 'bg-orange-500',
      description: 'Ethiopia\'s leading mobile money service'
    },
    {
      id: 'cbe',
      name: t('payment.cbe'),
      icon: <Building2 className="h-5 w-5" />,
      color: 'bg-blue-600',
      description: 'Commercial Bank of Ethiopia Mobile Banking'
    },
    {
      id: 'awashBank',
      name: t('payment.awashBank'),
      icon: <Building2 className="h-5 w-5" />,
      color: 'bg-purple-600',
      description: 'Awash Bank Mobile Banking'
    },
    {
      id: 'bankOfAbyssinia',
      name: t('payment.bankOfAbyssinia'),
      icon: <Building2 className="h-5 w-5" />,
      color: 'bg-red-600',
      description: 'Bank of Abyssinia Mobile Banking'
    },
    {
      id: 'helloMoney',
      name: t('payment.helloMoney'),
      icon: <Smartphone className="h-5 w-5" />,
      color: 'bg-yellow-500',
      description: 'Hello Money Mobile Wallet'
    },
    {
      id: 'card',
      name: t('payment.card'),
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-green-600',
      description: 'Credit or Debit Card'
    }
  ];

  if (purchasedTicket) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-success" />
                {t('ticket.yourTicket')}
              </h3>
              
              <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-lg p-6 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm opacity-90">{t('ticket.route')}</div>
                    <div className="font-medium">{route.nameEn}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">{t('ticket.ticketId')}</div>
                    <div className="font-medium">#{purchasedTicket.id.slice(-8).toUpperCase()}</div>
                  </div>
                </div>
                
                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg text-center">
                  <QRCode value={purchasedTicket.qrCodeData} size={128} className="mb-2" />
                  <div className="text-gray-600 text-sm">{t('ticket.showQR')}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <div className="opacity-90">{t('ticket.date')}</div>
                    <div className="font-medium">
                      {new Date(purchasedTicket.purchaseTime!).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="opacity-90">{t('ticket.validUntil')}</div>
                    <div className="font-medium">
                      {new Date(purchasedTicket.validUntil).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  {t('ticket.download')}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share className="h-4 w-4 mr-2" />
                  {t('ticket.share')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <TicketIcon className="h-5 w-5 mr-2 text-secondary" />
              {t('ticket.purchase')}
            </h3>
            
            <div className="space-y-4">
              {/* Route Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{route.nameEn}</div>
                    <div className="text-sm text-gray-500">
                      {t('ticket.estimated')} 25 {t('routes.minutesShort')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-primary">
                      {route.price} {t('common.etb')}
                    </div>
                    <div className="text-xs text-gray-500">Per ticket</div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-success">
                  <Clock className="h-4 w-4 mr-1" />
                  {t('routes.next')} bus in 3 {t('routes.minutes')}
                </div>
              </div>
              
              {/* Payment Options */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('ticket.paymentMethod')}
                </Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {paymentOptions.map((option) => (
                      <Label
                        key={option.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:ring-2 has-[:checked]:ring-primary"
                      >
                        <RadioGroupItem value={option.id} className="mr-3" />
                        <div className="flex items-center">
                          <div className={`w-8 h-8 ${option.color} rounded mr-2 flex items-center justify-center text-white`}>
                            {option.icon}
                          </div>
                          <span className="font-medium">{option.name}</span>
                        </div>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              {/* Purchase Button */}
              <Button
                className="w-full bg-secondary hover:bg-yellow-500 text-gray-900 font-medium"
                size="lg"
                onClick={() => purchaseMutation.mutate()}
                disabled={purchaseMutation.isPending || !paymentMethod}
              >
                {purchaseMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    {t('common.processing')}
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t('ticket.purchaseButton')} - {route.price} {t('common.etb')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
