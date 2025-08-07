import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  MapPin, 
  Bus, 
  Clock, 
  Navigation, 
  Search, 
  Filter, 
  Map,
  List,
  Route,
  Info,
  Star,
  Wifi,
  Accessibility,
  CreditCard,
  Users
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  busRoutes, 
  busStops, 
  getStopsByZone,
  findRoutesBetweenStops,
  getRoutesByOperator,
  type BusRoute,
  type BusStop
} from '../../data/addisRoutes';

interface BusStopsRoutesProps {
  onStopSelect?: (stopId: string) => void;
  onRouteSelect?: (routeId: string) => void;
}

const BusStopsRoutes: React.FC<BusStopsRoutesProps> = ({ onStopSelect, onRouteSelect }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'stops' | 'routes' | 'map'>('stops');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique zones from bus stops
  const zones = useMemo(() => {
    const uniqueZones = new Set(busStops.map(stop => stop.zone));
    return Array.from(uniqueZones).sort();
  }, []);

  // Filter stops based on search and zone
  const filteredStops = useMemo(() => {
    let filtered = [...busStops];

    // Filter by zone
    if (selectedZone !== 'all') {
      filtered = filtered.filter(stop => stop.zone === selectedZone);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(stop =>
        stop.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stop.name.am.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stop.name.om.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stop.zone.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedZone, searchQuery]);

  // Filter routes based on search and operator
  const filteredRoutes = useMemo(() => {
    let filtered = [...busRoutes];

    // Filter by operator
    if (selectedOperator !== 'all') {
      filtered = getRoutesByOperator(selectedOperator);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(route =>
        route.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.name.am.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.operator.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedOperator, searchQuery]);

  const getOperatorColor = (operator: string) => {
    switch (operator) {
      case 'Anbessa': return 'bg-green-600';
      case 'Sheger': return 'bg-red-600';
      case 'Alliance': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getStopRoutesCount = (stopId: string) => {
    return busRoutes.filter(route => route.stops.includes(stopId)).length;
  };

  const getRouteStops = (routeId: string) => {
    const route = busRoutes.find(r => r.id === routeId);
    return route ? route.stops.map(stopId => busStops.find(s => s.id === stopId)).filter(Boolean) : [];
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header with Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <CardTitle className="text-xl font-bold flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-blue-600" />
              <span>Bus Stops & Routes</span>
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <div className="grid grid-cols-2 gap-1 h-4 w-4">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
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
                  placeholder={activeTab === 'stops' ? "Search bus stops..." : "Search routes..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              {activeTab === 'stops' ? (
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">All Zones</option>
                  {zones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              ) : (
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
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-4 border-b">
            {[
              { key: 'stops', label: 'Bus Stops', icon: <MapPin className="h-4 w-4" />, count: filteredStops.length },
              { key: 'routes', label: 'Routes', icon: <Route className="h-4 w-4" />, count: filteredRoutes.length },
              { key: 'map', label: 'Map View', icon: <Map className="h-4 w-4" /> }
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
                {tab.count !== undefined && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'stops' && (
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredStops.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No bus stops found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredStops.map((stop) => {
              const routesCount = getStopRoutesCount(stop.id);
              
              return (
                <Card 
                  key={stop.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedStop?.id === stop.id ? 'border-blue-500 shadow-md' : ''
                  } ${viewMode === 'list' ? 'col-span-full' : ''}`}
                  onClick={() => {
                    setSelectedStop(selectedStop?.id === stop.id ? null : stop);
                    onStopSelect?.(stop.id);
                  }}
                >
                  <CardContent className={`${viewMode === 'list' ? 'p-4' : 'p-3'}`}>
                    <div className={`${viewMode === 'list' ? 'flex items-center space-x-4' : 'space-y-3'}`}>
                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                              {stop.name.en}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {stop.name.am} • {stop.name.om}
                            </p>
                          </div>
                          {stop.facilities.includes('wifi') && (
                            <Wifi className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                          <span className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{stop.zone}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Bus className="h-3 w-3" />
                            <span>{routesCount} routes</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {stop.facilities.slice(0, 3).map((facility) => (
                            <Badge key={facility} variant="outline" className="text-xs py-0 px-1">
                              {facility === 'shelter' && '🏠'}
                              {facility === 'seating' && '🪑'}
                              {facility === 'wifi' && '📶'}
                              {facility === 'accessibility' && <Accessibility className="h-3 w-3" />}
                              {facility === 'digital_display' && '📱'}
                              {facility === 'card_payment' && <CreditCard className="h-3 w-3" />}
                              {facility}
                            </Badge>
                          ))}
                          {stop.facilities.length > 3 && (
                            <Badge variant="outline" className="text-xs py-0 px-1">
                              +{stop.facilities.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {viewMode === 'list' && (
                        <div className="text-right space-y-1">
                          <div className="text-xs text-gray-500">
                            {stop.location.lat.toFixed(4)}, {stop.location.lng.toFixed(4)}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle view on map action
                            }}
                          >
                            View on Map
                          </Button>
                        </div>
                      )}
                    </div>

                    {selectedStop?.id === stop.id && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div className="text-xs text-gray-600">
                          <strong>Location:</strong> {stop.location.lat.toFixed(6)}, {stop.location.lng.toFixed(6)}
                        </div>
                        <div className="text-xs text-gray-600">
                          <strong>All Facilities:</strong> {stop.facilities.join(', ')}
                        </div>
                        <div className="text-xs text-gray-600">
                          <strong>Serving Routes:</strong> {routesCount} routes pass through this stop
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'routes' && (
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredRoutes.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <Route className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No routes found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredRoutes.map((route) => {
              const routeStops = getRouteStops(route.id);
              
              return (
                <Card 
                  key={route.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRoute?.id === route.id ? 'border-blue-500 shadow-md' : ''
                  } ${viewMode === 'list' ? 'col-span-full' : ''}`}
                  onClick={() => {
                    setSelectedRoute(selectedRoute?.id === route.id ? null : route);
                    onRouteSelect?.(route.id);
                  }}
                >
                  <CardContent className={`${viewMode === 'list' ? 'p-4' : 'p-3'}`}>
                    <div className={`${viewMode === 'list' ? 'flex items-center space-x-4' : 'space-y-3'}`}>
                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${getOperatorColor(route.operator)}`}
                            >
                              {route.routeNumber}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm md:text-base line-clamp-1">
                                {route.name.en}
                              </h3>
                              <p className="text-xs text-gray-600">
                                {route.name.am}
                              </p>
                              <Badge 
                                variant="outline" 
                                className={`mt-1 text-xs ${getOperatorColor(route.operator)} text-white border-0`}
                              >
                                {route.operator}
                              </Badge>
                            </div>
                          </div>
                          <Badge 
                            className={route.status === 'active' ? 'bg-green-600' : 'bg-red-600'}
                            variant="secondary"
                          >
                            {route.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-blue-600" />
                            <span>Every {route.schedule.frequency} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-green-600" />
                            <span>{routeStops.length} stops</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-medium">{route.price} ETB</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{route.estimatedDuration} min</span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-600">
                          <span className="font-medium">Hours:</span> {route.schedule.firstBus} - {route.schedule.lastBus}
                        </div>
                      </div>

                      {viewMode === 'list' && (
                        <div className="text-right space-y-1">
                          <div className="text-lg font-bold" style={{ color: route.color }}>
                            {route.routeNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            {route.distance} km
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle view route action
                            }}
                          >
                            View Route
                          </Button>
                        </div>
                      )}
                    </div>

                    {selectedRoute?.id === route.id && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div className="text-xs text-gray-600">
                          <strong>Distance:</strong> {route.distance} km • <strong>Estimated Duration:</strong> {route.estimatedDuration} min
                        </div>
                        <div className="text-xs text-gray-600">
                          <strong>First Stop:</strong> {routeStops[0]?.name.en || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600">
                          <strong>Last Stop:</strong> {routeStops[routeStops.length - 1]?.name.en || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600">
                          <strong>Total Stops:</strong> {routeStops.length}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'map' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Map className="h-5 w-5" />
              <span>Map View</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-600">
                <Map className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">Interactive Map</p>
                <p className="text-sm">
                  Map integration coming soon. This will show all bus stops and routes on an interactive map.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
                  <div className="text-sm">
                    <div className="font-medium text-green-600 mb-1">Bus Stops</div>
                    <div className="text-xs text-gray-600">
                      • {busStops.length} total stops
                      • {zones.length} zones covered
                      • Multiple facilities
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-blue-600 mb-1">Bus Routes</div>
                    <div className="text-xs text-gray-600">
                      • {busRoutes.length} active routes
                      • 3 operators
                      • Real-time tracking
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{busStops.length}</div>
            <div className="text-xs text-gray-600">Bus Stops</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Route className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold">{busRoutes.length}</div>
            <div className="text-xs text-gray-600">Routes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Bus className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-gray-600">Operators</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto text-orange-600 mb-2" />
            <div className="text-2xl font-bold">{zones.length}</div>
            <div className="text-xs text-gray-600">Zones</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusStopsRoutes;
