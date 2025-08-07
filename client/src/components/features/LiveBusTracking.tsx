import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Users, 
  Navigation, 
  Zap, 
  AlertCircle,
  Wifi,
  RefreshCw,
  Filter,
  Search,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  busRoutes, 
  busStops, 
  generateLiveBuses, 
  getNextBusArrivals,
  getRoutesByOperator,
  type LiveBus,
  type BusRoute,
  type BusStop
} from '../../data/addisRoutes';

interface LiveBusTrackingProps {
  selectedStopId?: string;
  selectedRouteId?: string;
}

const LiveBusTracking: React.FC<LiveBusTrackingProps> = ({ 
  selectedStopId, 
  selectedRouteId 
}) => {
  const { t } = useLanguage();
  const [liveBuses, setLiveBuses] = useState<LiveBus[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<LiveBus[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'arrivals' | 'routes'>('list');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedBus, setSelectedBus] = useState<LiveBus | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Initialize and update live bus data
  useEffect(() => {
    const updateBusData = () => {
      const newBuses = generateLiveBuses();
      setLiveBuses(newBuses);
      setLastUpdated(new Date());
    };

    // Initial load
    updateBusData();

    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout;
    if (isAutoRefresh) {
      interval = setInterval(updateBusData, 15000); // Update every 15 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoRefresh]);

  // Filter buses based on operator and search
  useEffect(() => {
    let filtered = [...liveBuses];

    // Filter by operator
    if (selectedOperator !== 'all') {
      const operatorRoutes = getRoutesByOperator(selectedOperator);
      const operatorRouteIds = operatorRoutes.map(r => r.id);
      filtered = filtered.filter(bus => operatorRouteIds.includes(bus.routeId));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(bus => {
        const route = busRoutes.find(r => r.id === bus.routeId);
        const nextStop = busStops.find(s => s.id === bus.nextStopId);
        
        return (
          bus.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route?.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route?.name.am.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route?.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nextStop?.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nextStop?.name.am.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Filter by selected route if provided
    if (selectedRouteId) {
      filtered = filtered.filter(bus => bus.routeId === selectedRouteId);
    }

    setFilteredBuses(filtered);
  }, [liveBuses, selectedOperator, searchQuery, selectedRouteId]);

  const manualRefresh = () => {
    const newBuses = generateLiveBuses();
    setLiveBuses(newBuses);
    setLastUpdated(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_service': return 'bg-green-500';
      case 'out_of_service': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getDelayColor = (delay: number) => {
    if (delay <= 0) return 'text-green-600';
    if (delay <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCrowdingLevel = (passengerCount: number, capacity: number) => {
    const percentage = (passengerCount / capacity) * 100;
    if (percentage >= 90) return { level: 'Full', color: 'text-red-600', bg: 'bg-red-100' };
    if (percentage >= 70) return { level: 'Crowded', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (percentage >= 40) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Comfortable', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const getBusRoute = (routeId: string) => {
    return busRoutes.find(r => r.id === routeId);
  };

  const getBusStop = (stopId: string) => {
    return busStops.find(s => s.id === stopId);
  };

  const getNextArrivals = () => {
    if (!selectedStopId) return [];
    return getNextBusArrivals(selectedStopId, liveBuses).slice(0, 10);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl font-bold">Live Bus Tracking</CardTitle>
                <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                  <Wifi className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="text-sm text-gray-600">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={manualRefresh}
                  className="flex items-center space-x-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
                
                <Button
                  variant={isAutoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className="flex items-center space-x-1"
                >
                  <Zap className="h-4 w-4" />
                  <span>{isAutoRefresh ? 'Auto ON' : 'Auto OFF'}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by bus number, route, or stop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Operators</option>
                <option value="Anbessa">Anbessa</option>
                <option value="Sheger">Sheger</option>
                <option value="Alliance">Alliance</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-4 border-b">
            {[
              { key: 'list', label: 'Bus List', icon: <Bus className="h-4 w-4" /> },
              { key: 'arrivals', label: 'Next Arrivals', icon: <Clock className="h-4 w-4" /> },
              { key: 'routes', label: 'Route Overview', icon: <MapPin className="h-4 w-4" /> }
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
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bus List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredBuses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No buses found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredBuses.map((bus) => {
                const route = getBusRoute(bus.routeId);
                const nextStop = getBusStop(bus.nextStopId);
                const crowding = getCrowdingLevel(bus.passengerCount, bus.capacity);

                return (
                  <Card 
                    key={bus.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedBus?.id === bus.id ? 'border-blue-500 shadow-md' : ''
                    }`}
                    onClick={() => setSelectedBus(selectedBus?.id === bus.id ? null : bus)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            route?.operator === 'Anbessa' ? 'bg-green-600' :
                            route?.operator === 'Sheger' ? 'bg-red-600' :
                            'bg-blue-600'
                          }`}>
                            {route?.routeNumber}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{bus.plateNumber}</div>
                            <div className="text-sm text-gray-600">{route?.name.en}</div>
                            <div className="text-xs text-gray-500">{route?.operator} Bus</div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <Badge className={`${getStatusColor(bus.status)} text-white text-xs`}>
                            {bus.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className="text-sm font-medium">
                            {bus.speed} km/h
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center space-x-1">
                          <Navigation className="h-4 w-4 text-blue-600" />
                          <span>To: {nextStop?.name.en}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span>{bus.passengerCount}/{bus.capacity}</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${crowding.color}`}>
                          <AlertCircle className="h-4 w-4" />
                          <span>{crowding.level}</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${getDelayColor(bus.delay)}`}>
                          <Clock className="h-4 w-4" />
                          <span>
                            {bus.delay > 0 ? `+${bus.delay}` : bus.delay}min
                          </span>
                        </div>
                      </div>

                      {/* Passenger Load Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Passenger Load</span>
                          <span className="text-xs text-gray-600">
                            {Math.round((bus.passengerCount / bus.capacity) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              Math.round((bus.passengerCount / bus.capacity) * 100) >= 90 ? 'bg-red-500' :
                              Math.round((bus.passengerCount / bus.capacity) * 100) >= 70 ? 'bg-orange-500' :
                              Math.round((bus.passengerCount / bus.capacity) * 100) >= 40 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.round((bus.passengerCount / bus.capacity) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Last updated: {bus.lastUpdated.toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Selected Bus Details */}
          <div className="space-y-4">
            {selectedBus ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bus className="h-5 w-5" />
                    <span>Bus Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const route = getBusRoute(selectedBus.routeId);
                    const nextStop = getBusStop(selectedBus.nextStopId);
                    
                    return (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{selectedBus.plateNumber}</div>
                          <div className="text-gray-600">{route?.name.en}</div>
                          <Badge className={`mt-2 ${route?.operator === 'Anbessa' ? 'bg-green-600' :
                            route?.operator === 'Sheger' ? 'bg-red-600' : 'bg-blue-600'} text-white`}>
                            {route?.operator}
                          </Badge>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Route Number:</span>
                            <span className="font-medium">{route?.routeNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Next Stop:</span>
                            <span className="font-medium">{nextStop?.name.en}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Speed:</span>
                            <span className="font-medium">{selectedBus.speed} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Passengers:</span>
                            <span className="font-medium">{selectedBus.passengerCount}/{selectedBus.capacity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge className={`${getStatusColor(selectedBus.status)} text-white text-xs`}>
                              {selectedBus.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delay:</span>
                            <span className={`font-medium ${getDelayColor(selectedBus.delay)}`}>
                              {selectedBus.delay > 0 ? `+${selectedBus.delay}` : selectedBus.delay} min
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <div className="text-xs text-gray-500">
                            Location: {selectedBus.currentLocation.lat.toFixed(4)}, {selectedBus.currentLocation.lng.toFixed(4)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Last updated: {selectedBus.lastUpdated.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Select a bus to view details</p>
                </CardContent>
              </Card>
            )}

            {/* Live Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Live Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Buses:</span>
                    <span className="font-medium">{liveBuses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">In Service:</span>
                    <span className="font-medium text-green-600">
                      {liveBuses.filter(b => b.status === 'in_service').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Load:</span>
                    <span className="font-medium">
                      {Math.round(liveBuses.reduce((acc, bus) => acc + (bus.passengerCount / bus.capacity), 0) / liveBuses.length * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Routes:</span>
                    <span className="font-medium">{new Set(liveBuses.map(b => b.routeId)).size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'arrivals' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Next Bus Arrivals</span>
              {selectedStopId && (
                <Badge variant="secondary">
                  {getBusStop(selectedStopId)?.name.en}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedStopId ? (
              <div className="space-y-3">
                {getNextArrivals().map((arrival, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{arrival.routeNumber}</Badge>
                      <div>
                        <div className="font-medium">{arrival.routeName}</div>
                        <div className="text-sm text-gray-600">
                          Load: {arrival.passengerLoad}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        {arrival.estimatedArrival} min
                      </div>
                      <div className="text-xs text-gray-500">ETA</div>
                    </div>
                  </div>
                ))}
                {getNextArrivals().length === 0 && (
                  <p className="text-center text-gray-600 py-8">
                    No upcoming arrivals for this stop
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-8">
                Select a bus stop to view arrivals
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {busRoutes.map((route) => {
            const routeBuses = liveBuses.filter(bus => bus.routeId === route.id);
            const activeBuses = routeBuses.filter(bus => bus.status === 'in_service').length;
            const avgLoad = routeBuses.length > 0 
              ? Math.round(routeBuses.reduce((acc, bus) => acc + (bus.passengerCount / bus.capacity), 0) / routeBuses.length * 100)
              : 0;

            return (
              <Card key={route.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold`} 
                           style={{ backgroundColor: route.color }}>
                        {route.routeNumber}
                      </div>
                      <div>
                        <div className="font-medium">{route.name.en}</div>
                        <div className="text-xs text-gray-500">{route.operator}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{activeBuses} active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span>{route.schedule.frequency} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span>{route.price} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Load:</span>
                      <span>{avgLoad}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={route.status === 'active' ? 'bg-green-600' : 'bg-red-600'} variant="secondary">
                        {route.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveBusTracking;
