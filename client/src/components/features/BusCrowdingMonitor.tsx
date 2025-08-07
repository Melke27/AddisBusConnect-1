import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Users, AlertCircle, CheckCircle, Clock, Bus } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface CrowdingData {
  busId: string;
  routeName: string;
  currentCapacity: number;
  maxCapacity: number;
  crowdingLevel: 'low' | 'medium' | 'high' | 'full';
  estimatedArrival: number; // minutes
  lastUpdated: Date;
  nextBusIn: number; // minutes
}

interface BusCrowdingMonitorProps {
  routeId?: string;
  stopId?: string;
}

const BusCrowdingMonitor: React.FC<BusCrowdingMonitorProps> = ({ routeId, stopId }) => {
  const { t } = useLanguage();
  const [crowdingData, setCrowdingData] = useState<CrowdingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with real API call
  const mockCrowdingData: CrowdingData[] = [
    {
      busId: 'ANB-001',
      routeName: 'Merkato - Bole',
      currentCapacity: 25,
      maxCapacity: 60,
      crowdingLevel: 'low',
      estimatedArrival: 3,
      lastUpdated: new Date(),
      nextBusIn: 8
    },
    {
      busId: 'SHG-102',
      routeName: 'Arat Kilo - Piazza',
      currentCapacity: 45,
      maxCapacity: 50,
      crowdingLevel: 'high',
      estimatedArrival: 5,
      lastUpdated: new Date(),
      nextBusIn: 12
    },
    {
      busId: 'ANB-045',
      routeName: '4 Kilo - Meskel Square',
      currentCapacity: 30,
      maxCapacity: 60,
      crowdingLevel: 'medium',
      estimatedArrival: 7,
      lastUpdated: new Date(),
      nextBusIn: 15
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchCrowdingData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCrowdingData(mockCrowdingData);
      setLoading(false);
    };

    fetchCrowdingData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchCrowdingData();
    }, 30000);

    return () => clearInterval(interval);
  }, [routeId, stopId]);

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Update with new random data to simulate real-time changes
    const updatedData = mockCrowdingData.map(bus => ({
      ...bus,
      currentCapacity: Math.max(5, Math.min(bus.maxCapacity, bus.currentCapacity + (Math.random() - 0.5) * 10)),
      estimatedArrival: Math.max(1, bus.estimatedArrival + (Math.random() - 0.5) * 2),
      lastUpdated: new Date()
    }));
    
    // Update crowding levels based on new capacity
    updatedData.forEach(bus => {
      const percentage = (bus.currentCapacity / bus.maxCapacity) * 100;
      if (percentage >= 90) bus.crowdingLevel = 'full';
      else if (percentage >= 70) bus.crowdingLevel = 'high';
      else if (percentage >= 40) bus.crowdingLevel = 'medium';
      else bus.crowdingLevel = 'low';
    });
    
    setCrowdingData(updatedData);
    setRefreshing(false);
  };

  const getCrowdingColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'full': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCrowdingIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'full': return <AlertCircle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getCrowdingText = (level: string) => {
    switch (level) {
      case 'low': return { en: 'Comfortable', am: 'ምቹ', om: 'Mijataa' };
      case 'medium': return { en: 'Moderate', am: 'መካከለኛ', om: 'Gidduugaleessa' };
      case 'high': return { en: 'Crowded', am: 'የተጨናነቀ', om: 'Guutuu' };
      case 'full': return { en: 'Full', am: 'ሙሉ', om: 'Guutuu Guutuu' };
      default: return { en: 'Unknown', am: 'ያልታወቀ', om: 'Hin beekamu' };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading bus crowding data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          Bus Crowding Monitor
          <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
            LIVE
          </span>
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          disabled={refreshing}
        >
          {refreshing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          ) : null}
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {crowdingData.map((bus) => {
            const percentage = Math.round((bus.currentCapacity / bus.maxCapacity) * 100);
            const crowdingText = getCrowdingText(bus.crowdingLevel);
            
            return (
              <div key={bus.busId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Bus className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{bus.routeName}</div>
                      <div className="text-sm text-gray-500">Bus {bus.busId}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Arrives in <span className="text-primary">{Math.round(bus.estimatedArrival)} min</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Next bus: {bus.nextBusIn} min
                    </div>
                  </div>
                </div>

                {/* Crowding Level Badge */}
                <div className="flex items-center justify-between">
                  <Badge className={`${getCrowdingColor(bus.crowdingLevel)} text-white flex items-center space-x-1`}>
                    {getCrowdingIcon(bus.crowdingLevel)}
                    <span>{crowdingText.en}</span>
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {bus.currentCapacity}/{bus.maxCapacity} passengers ({percentage}%)
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getCrowdingColor(bus.crowdingLevel)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Comfort Recommendation */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Last updated: {bus.lastUpdated.toLocaleTimeString()}
                  </span>
                  {bus.crowdingLevel === 'high' || bus.crowdingLevel === 'full' ? (
                    <span className="text-orange-600 font-medium">
                      Consider waiting for next bus
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      Good time to board
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Crowding Levels</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Comfortable (0-40%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Moderate (40-70%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Crowded (70-90%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Full (90%+)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusCrowdingMonitor;
