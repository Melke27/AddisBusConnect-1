import { useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import Navigation from "../components/Navigation";
import { MessageSquare, AlertTriangle, ThumbsUp, ThumbsDown, Send, Clock, MapPin, Bus } from "lucide-react";

interface FeedbackItem {
  id: string;
  type: 'delay' | 'safety' | 'facility' | 'suggestion';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  upvotes: number;
  downvotes: number;
}

export default function CommunityFeedback() {
  const { t } = useLanguage();
  
  const [feedbackForm, setFeedbackForm] = useState({
    type: '',
    title: '',
    description: '',
    location: '',
    route: ''
  });

  const [feedbackList] = useState<FeedbackItem[]>([
    {
      id: '1',
      type: 'delay',
      title: 'Bus Route 1 Frequent Delays',
      description: 'Route 1 buses are consistently 15-20 minutes late during morning hours.',
      location: 'Meskel Square Station',
      timestamp: '2 hours ago',
      status: 'acknowledged',
      upvotes: 12,
      downvotes: 1
    },
    {
      id: '2',
      type: 'facility',
      title: 'Broken Shelter at Bole Station',
      description: 'The waiting shelter has a broken roof, passengers get wet during rain.',
      location: 'Bole Station',
      timestamp: '5 hours ago',
      status: 'pending',
      upvotes: 8,
      downvotes: 0
    },
    {
      id: '3',
      type: 'suggestion',
      title: 'Add More Benches at Piassa',
      description: 'Piassa station needs more seating for elderly passengers.',
      location: 'Piassa Station',
      timestamp: '1 day ago',
      status: 'resolved',
      upvotes: 15,
      downvotes: 2
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting feedback:', feedbackForm);
    // In a real app, this would make an API call
    
    // Reset form
    setFeedbackForm({
      type: '',
      title: '',
      description: '',
      location: '',
      route: ''
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Clock className="h-4 w-4" />;
      case 'safety': return <AlertTriangle className="h-4 w-4" />;
      case 'facility': return <MapPin className="h-4 w-4" />;
      case 'suggestion': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'delay': return 'bg-orange-100 text-orange-800';
      case 'safety': return 'bg-red-100 text-red-800';
      case 'facility': return 'bg-blue-100 text-blue-800';
      case 'suggestion': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Community Feedback & Reporting
          </h1>
          <p className="text-gray-600 mt-1">Help improve public transportation by reporting issues and sharing suggestions</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Submit Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Submit Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Issue Type</Label>
                  <Select
                    value={feedbackForm.type}
                    onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delay">Bus Delay</SelectItem>
                      <SelectItem value="safety">Safety Concern</SelectItem>
                      <SelectItem value="facility">Facility Issue</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={feedbackForm.title}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={feedbackForm.location}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Bus station or area"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="route">Route (if applicable)</Label>
                  <Input
                    id="route"
                    value={feedbackForm.route}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, route: e.target.value }))}
                    placeholder="Bus route number or name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={feedbackForm.description}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed information about the issue or suggestion"
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Community Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Community Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbackList.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeIcon(item.type)}
                        <span className="ml-1 capitalize">{item.type}</span>
                      </Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{item.timestamp}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-green-600 hover:text-green-700">
                        <ThumbsUp className="h-3 w-3" />
                        {item.upvotes}
                      </button>
                      <button className="flex items-center gap-1 text-red-600 hover:text-red-700">
                        <ThumbsDown className="h-3 w-3" />
                        {item.downvotes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-sm mb-2">What to Report:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Bus delays and schedule issues</li>
                  <li>• Safety concerns at stations</li>
                  <li>• Broken facilities or infrastructure</li>
                  <li>• Suggestions for improvements</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Reporting Tips:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Be specific about location and time</li>
                  <li>• Provide clear, factual descriptions</li>
                  <li>• Include route numbers when relevant</li>
                  <li>• Be respectful and constructive</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-sm text-gray-600">
              <p>
                Your feedback helps city transportation authorities respond quickly to issues and improve services for everyone. 
                Reports are reviewed by transport officials and community moderators.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

