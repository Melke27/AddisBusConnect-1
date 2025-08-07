import { Request, Response } from 'express';

interface BusLocation {
  id: string;
  routeId: string;
  routeName: string;
  routeColor: string;
  lat: number;
  lng: number;
  bearing: number;
  nextStop: string;
  etaToNextStop: number;
  occupancy: 'low' | 'medium' | 'high';
  lastUpdated: string;
  pathIndex: number; // Add pathIndex to track current position on route
}

const ROUTE_COLORS = [
  '#FF5252', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
  '#00BCD4', '#8BC34A', '#FFC107', '#E91E63', '#3F51B5'
];

const routes = [
  {
    id: 'r1',
    name: 'Meskel - Bole',
    color: ROUTE_COLORS[0],
    path: [
      { lat: 9.0054, lng: 38.7636 },
      { lat: 9.0154, lng: 38.7736 },
      { lat: 9.0254, lng: 38.7836 },
      { lat: 9.0354, lng: 38.7936 },
    ],
    stops: [
      { id: 's1', name: 'Meskel Square', lat: 9.0054, lng: 38.7636, routes: ['r1'] },
      { id: 's2', name: 'Bole Bridge', lat: 9.0254, lng: 38.7836, routes: ['r1', 'r2'] },
      { id: 's3', name: 'Bole Medhanialem', lat: 9.0354, lng: 38.7936, routes: ['r1'] },
    ]
  },
  {
    id: 'r2',
    name: 'Piassa - Mexico',
    color: ROUTE_COLORS[1],
    path: [
      { lat: 9.0354, lng: 38.7436 },
      { lat: 9.0254, lng: 38.7536 },
      { lat: 9.0154, lng: 38.7636 },
      { lat: 9.0054, lng: 38.7736 },
    ],
    stops: [
      { id: 's4', name: 'Piassa', lat: 9.0354, lng: 38.7436, routes: ['r2'] },
      { id: 's2', name: 'Bole Bridge', lat: 9.0254, lng: 38.7836, routes: ['r1', 'r2'] },
      { id: 's5', name: 'Mexico Square', lat: 9.0054, lng: 38.7736, routes: ['r2'] },
    ]
  },
  {
    id: 'r3',
    name: 'Shager - Route A',
    color: ROUTE_COLORS[2],
    path: [
      { lat: 8.9800, lng: 38.7500 },
      { lat: 8.9900, lng: 38.7600 },
      { lat: 9.0000, lng: 38.7700 },
    ],
    stops: [
      { id: 's6', name: 'Shager Stop 1', lat: 8.9800, lng: 38.7500, routes: ['r3'] },
      { id: 's7', name: 'Shager Stop 2', lat: 9.0000, lng: 38.7700, routes: ['r3'] },
    ]
  },
  {
    id: 'r4',
    name: 'Hanbessa - Route B',
    color: ROUTE_COLORS[3],
    path: [
      { lat: 9.0500, lng: 38.7000 },
      { lat: 9.0600, lng: 38.7100 },
      { lat: 9.0700, lng: 38.7200 },
    ],
    stops: [
      { id: 's8', name: 'Hanbessa Stop 1', lat: 9.0500, lng: 38.7000, routes: ['r4'] },
      { id: 's9', name: 'Hanbessa Stop 2', lat: 9.0700, lng: 38.7200, routes: ['r4'] },
    ]
  }
];

let busLocations: BusLocation[] = [];

const generateMockBusLocations = (count: number): BusLocation[] => {
  return Array.from({ length: count }, (_, i) => {
    const route = routes[i % routes.length];
    const pathIndex = Math.floor(Math.random() * route.path.length);
    const { lat, lng } = route.path[pathIndex];
    const nextStop = route.stops[Math.min(pathIndex + 1, route.stops.length - 1)];
    
    return {
      id: `bus-${i + 1}`,
      routeId: route.id,
      routeName: route.name,
      routeColor: route.color,
      lat: lat,
      lng: lng,
      bearing: Math.floor(Math.random() * 360),
      nextStop: nextStop?.name || 'Terminal',
      etaToNextStop: Math.floor(Math.random() * 15) + 1,
      occupancy: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      lastUpdated: new Date().toISOString(),
      pathIndex: pathIndex,
    };
  });
};

// Initialize bus locations
busLocations = generateMockBusLocations(12); // Increased count to include new buses

// Update bus positions every 5 seconds (simulated)
setInterval(() => {
  busLocations = busLocations.map(bus => {
    const route = routes.find(r => r.id === bus.routeId);
    if (!route || !route.path || route.path.length === 0) return bus;

    const currentPathIndex = bus.pathIndex;
    const nextPathIndex = (currentPathIndex + 1) % route.path.length;

    const currentPoint = route.path[currentPathIndex];
    const nextPoint = route.path[nextPathIndex];

    if (!currentPoint || !nextPoint) return bus; // Should not happen with correct indices
    
    const bearing = Math.atan2(
      nextPoint.lng - currentPoint.lng,
      nextPoint.lat - currentPoint.lat
    ) * (180 / Math.PI);

    return {
      ...bus,
      lat: nextPoint.lat,
      lng: nextPoint.lng,
      bearing,
      lastUpdated: new Date().toISOString(),
      pathIndex: nextPathIndex,
    };
  });
}, 5000);

export const getBusLocations = (req: Request, res: Response) => {
  res.json(busLocations);
};

export const getRoutes = (req: Request, res: Response) => {
  res.json(routes);
};


