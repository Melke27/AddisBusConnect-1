import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  AlertTriangle, 
  Phone, 
  Shield, 
  MessageSquare, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Camera,
  Mic,
  Heart,
  Navigation
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  primary: boolean;
}

interface EmergencyReport {
  id: string;
  type: 'medical' | 'security' | 'harassment' | 'accident' | 'theft' | 'other';
  location: string;
  busId?: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'acknowledged' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface EmergencyFeaturesProps {
  busId?: string;
  currentLocation?: string;
}

const EmergencyFeatures: React.FC<EmergencyFeaturesProps> = ({ 
  busId, 
  currentLocation = 'Unknown Location' 
}) => {
  const { t } = useLanguage();
  const { user } = useAuth() as { user: any };
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [activeTab, setActiveTab] = useState<'panic' | 'report' | 'contacts' | 'history'>('panic');
  const [reportForm, setReportForm] = useState({
    type: 'security' as const,
    description: '',
    anonymous: false
  });
  const [panicTimer, setPanicTimer] = useState<number | null>(null);
  const [location, setLocation] = useState(currentLocation);

  // Mock emergency contacts
  useEffect(() => {
    setEmergencyContacts([
      {
        id: '1',
        name: 'Police Emergency',
        phone: '991',
        relationship: 'Emergency Service',
        primary: true
      },
      {
        id: '2',
        name: 'Medical Emergency',
        phone: '907',
        relationship: 'Emergency Service',
        primary: true
      },
      {
        id: '3',
        name: 'Family Contact',
        phone: '+251-911-123-456',
        relationship: 'Family',
        primary: false
      }
    ]);

    // Mock reports
    setReports([
      {
        id: '1',
        type: 'harassment',
        location: 'Merkato Bus Stop',
        busId: 'ANB-045',
        description: 'Inappropriate behavior from another passenger',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'acknowledged',
        severity: 'medium'
      }
    ]);
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          setLocation(`Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setLocation(currentLocation);
        }
      );
    }
  }, [currentLocation]);

  const activatePanicMode = () => {
    setIsPanicMode(true);
    
    // Start countdown for automatic emergency call
    let countdown = 10;
    setPanicTimer(countdown);
    
    const timer = setInterval(() => {
      countdown -= 1;
      setPanicTimer(countdown);
      
      if (countdown <= 0) {
        clearInterval(timer);
        makeEmergencyCall();
      }
    }, 1000);

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }

    // Store the timer ID to clear it if needed
    (window as any).panicTimer = timer;
  };

  const cancelPanicMode = () => {
    setIsPanicMode(false);
    setPanicTimer(null);
    
    if ((window as any).panicTimer) {
      clearInterval((window as any).panicTimer);
      (window as any).panicTimer = null;
    }
  };

  const makeEmergencyCall = () => {
    // In a real app, this would:
    // 1. Call emergency services
    // 2. Send location data
    // 3. Notify emergency contacts
    // 4. Alert bus driver/dispatch
    
    alert('Emergency services have been contacted. Help is on the way.');
    setIsPanicMode(false);
    setPanicTimer(null);
  };

  const submitReport = () => {
    const newReport: EmergencyReport = {
      id: Date.now().toString(),
      type: reportForm.type,
      location: location,
      busId: busId,
      description: reportForm.description,
      timestamp: new Date(),
      status: 'pending',
      severity: reportForm.type === 'medical' || reportForm.type === 'accident' ? 'high' : 'medium'
    };

    setReports([newReport, ...reports]);
    setReportForm({ type: 'security', description: '', anonymous: false });
    
    // Show success message
    alert('Report submitted successfully. You will be contacted if additional information is needed.');
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return <Heart className="h-4 w-4 text-red-600" />;
      case 'security': return <Shield className="h-4 w-4 text-orange-600" />;
      case 'harassment': return <Users className="h-4 w-4 text-purple-600" />;
      case 'accident': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'theft': return <Shield className="h-4 w-4 text-red-600" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'acknowledged': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-red-50">
        <CardTitle className="flex items-center text-red-800">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Emergency & Safety Features
          <Badge variant="destructive" className="ml-2">24/7</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          {[
            { key: 'panic', label: 'Panic Button', icon: <AlertTriangle className="h-4 w-4" /> },
            { key: 'report', label: 'Report Issue', icon: <MessageSquare className="h-4 w-4" /> },
            { key: 'contacts', label: 'Emergency Contacts', icon: <Phone className="h-4 w-4" /> },
            { key: 'history', label: 'Report History', icon: <Clock className="h-4 w-4" /> }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
              className="flex items-center space-x-2"
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* Panic Button Tab */}
        {activeTab === 'panic' && (
          <div className="space-y-6">
            {!isPanicMode ? (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Emergency Panic Button</h3>
                  <p className="text-gray-600 mb-6">
                    Press and hold the button below in case of emergency. 
                    Emergency services will be contacted automatically in 10 seconds.
                  </p>
                  
                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-32 h-32 rounded-full text-white text-xl font-bold shadow-lg hover:shadow-xl transition-all"
                    onClick={activatePanicMode}
                  >
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="h-8 w-8 mb-2" />
                      PANIC
                    </div>
                  </Button>
                </div>

                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Current Location</h4>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{location}</span>
                    </div>
                    {busId && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Navigation className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Current Bus: {busId}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {emergencyContacts.filter(c => c.primary).map((contact) => (
                    <Card key={contact.id} className="border-red-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-gray-600">{contact.phone}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`tel:${contact.phone}`)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6">
                  <AlertTriangle className="h-16 w-16 mx-auto text-red-600 mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-red-800 mb-2">PANIC MODE ACTIVATED</h3>
                  <p className="text-red-700 mb-4">
                    Emergency services will be contacted in {panicTimer} seconds
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={makeEmergencyCall}
                      className="w-full"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Emergency Services Now
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={cancelPanicMode}
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel (False Alarm)
                    </Button>
                  </div>
                </div>

                <Card className="bg-yellow-50 border-yellow-300">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Your location is being shared with:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Emergency Services (991, 907)</li>
                      <li>• Bus Dispatch Center</li>
                      <li>• Your emergency contacts</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Report Issue Tab */}
        {activeTab === 'report' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Report Safety Issue</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Issue Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={reportForm.type}
                  onChange={(e) => setReportForm({...reportForm, type: e.target.value as any})}
                >
                  <option value="security">Security Concern</option>
                  <option value="harassment">Harassment</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="accident">Accident</option>
                  <option value="theft">Theft</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Location</label>
                <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
            </div>

            {busId && (
              <div>
                <label className="block text-sm font-medium mb-2">Bus Information</label>
                <div className="flex items-center space-x-2 p-2 border rounded-md bg-gray-50">
                  <Navigation className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Bus ID: {busId}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Please describe the issue in detail. Include any relevant information that might help authorities respond appropriately."
                value={reportForm.description}
                onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={reportForm.anonymous}
                onChange={(e) => setReportForm({...reportForm, anonymous: e.target.checked})}
              />
              <label htmlFor="anonymous" className="text-sm">
                Submit anonymously (recommended for sensitive issues)
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setReportForm({ type: 'security', description: '', anonymous: false })}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Clear Form
              </Button>
              
              <Button
                onClick={submitReport}
                disabled={!reportForm.description.trim()}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
            </div>

            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-blue-600" />
                  Your Safety & Privacy
                </h4>
                <ul className="text-sm space-y-1 text-blue-800">
                  <li>• All reports are treated confidentially</li>
                  <li>• Anonymous reports are fully protected</li>
                  <li>• Emergency reports get priority response</li>
                  <li>• Your location data helps first responders</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Emergency Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Emergency Contacts</h3>
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>

            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <Card key={contact.id} className={contact.primary ? 'border-red-200 bg-red-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          contact.primary ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-600">{contact.phone}</div>
                          <div className="text-xs text-gray-500">{contact.relationship}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {contact.primary && (
                          <Badge variant="destructive" className="text-xs">Primary</Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${contact.phone}`)}
                        >
                          Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Report History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Report History</h3>

            {reports.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No reports submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getReportTypeIcon(report.type)}
                          <div>
                            <div className="font-medium capitalize">{report.type} Report</div>
                            <div className="text-sm text-gray-600">{report.location}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(report.status)} text-white text-xs mb-1`}>
                            {report.status}
                          </Badge>
                          <div className={`text-xs font-medium ${getSeverityColor(report.severity)}`}>
                            {report.severity} priority
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-700 mb-3">
                        {report.description}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{report.timestamp.toLocaleString()}</span>
                          {report.busId && <span>Bus: {report.busId}</span>}
                        </div>
                        <div>
                          Report #{report.id}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyFeatures;
