// Comprehensive Addis Ababa Bus Routes Data
// Updated with real bus stations and routes across the city

export interface BusStop {
  id: string;
  name: {
    en: string;
    am: string;
    om: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  zone: string;
  facilities: string[];
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  name: {
    en: string;
    am: string;
    om: string;
  };
  operator: 'Anbessa' | 'Sheger' | 'Alliance';
  color: string;
  stops: string[]; // Stop IDs
  schedule: {
    firstBus: string;
    lastBus: string;
    frequency: number; // minutes
  };
  price: number;
  distance: number; // km
  duration: number; // minutes
  status: 'active' | 'suspended' | 'maintenance';
}

export interface LiveBus {
  id: string;
  routeId: string;
  plateNumber: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  nextStopId: string;
  passengerCount: number;
  capacity: number;
  speed: number; // km/h
  bearing: number; // degrees
  lastUpdated: Date;
  status: 'in_service' | 'out_of_service' | 'maintenance';
  delay: number; // minutes
}

// All Major Bus Stops in Addis Ababa
export const busStops: BusStop[] = [
  // Central Business District
  {
    id: 'meskel-square',
    name: {
      en: 'Meskel Square',
      am: 'መስቀል አደባባይ',
      om: 'Finfinnee Meskel'
    },
    location: { lat: 9.0120, lng: 38.7634 },
    zone: 'Central',
    facilities: ['shelter', 'digital_display', 'ticket_booth', 'security']
  },
  {
    id: 'piazza',
    name: {
      en: 'Piazza (De Gaulle Square)',
      am: 'ፒያሳ',
      om: 'Piazza'
    },
    location: { lat: 9.0336, lng: 38.7369 },
    zone: 'Central',
    facilities: ['shelter', 'digital_display', 'shops']
  },
  {
    id: 'arat-kilo',
    name: {
      en: 'Arat Kilo',
      am: 'አራት ኪሎ',
      om: 'Aratti Kilo'
    },
    location: { lat: 9.0365, lng: 38.7614 },
    zone: 'Central',
    facilities: ['shelter', 'digital_display', 'atm', 'restroom']
  },
  {
    id: 'six-kilo',
    name: {
      en: 'Six Kilo (Adwa)',
      am: 'ስድስት ኪሎ',
      om: 'Jaata Kilo'
    },
    location: { lat: 9.0158, lng: 38.7891 },
    zone: 'Central',
    facilities: ['shelter', 'digital_display']
  },
  
  // Merkato Area
  {
    id: 'merkato',
    name: {
      en: 'Merkato',
      am: 'መርካቶ',
      om: 'Merkato'
    },
    location: { lat: 9.0142, lng: 38.7253 },
    zone: 'West',
    facilities: ['large_station', 'digital_display', 'ticket_booth', 'shops', 'security']
  },
  {
    id: 'shiromeda',
    name: {
      en: 'Shiromeda',
      am: 'ሽሮሜዳ',
      om: 'Shiromeda'
    },
    location: { lat: 9.0089, lng: 38.7445 },
    zone: 'West',
    facilities: ['shelter', 'digital_display']
  },
  
  // Bole Area
  {
    id: 'bole',
    name: {
      en: 'Bole',
      am: 'ቦሌ',
      om: 'Bole'
    },
    location: { lat: 8.9806, lng: 38.7578 },
    zone: 'South',
    facilities: ['shelter', 'digital_display', 'atm']
  },
  {
    id: 'bole-airport',
    name: {
      en: 'Bole International Airport',
      am: 'ቦሌ አለም አቀፍ አውሮፕላን ማረፊያ',
      om: 'Buufata Xayyaaraatti Bole'
    },
    location: { lat: 8.9779, lng: 38.7992 },
    zone: 'South',
    facilities: ['large_station', 'digital_display', 'ticket_booth', 'shops', 'wifi', 'restroom']
  },
  {
    id: 'megenagna',
    name: {
      en: 'Megenagna',
      am: 'መገናኛ',
      om: 'Megenagna'
    },
    location: { lat: 8.9889, lng: 38.7889 },
    zone: 'South',
    facilities: ['shelter', 'digital_display']
  },
  
  // CMC Area
  {
    id: 'cmc',
    name: {
      en: 'CMC (Kaliti)',
      am: 'ሲ.ኤም.ሲ',
      om: 'CMC'
    },
    location: { lat: 8.9500, lng: 38.7800 },
    zone: 'South',
    facilities: ['shelter', 'digital_display', 'security']
  },
  
  // Kazanchis Area
  {
    id: 'kazanchis',
    name: {
      en: 'Kazanchis',
      am: 'ካዛንቺስ',
      om: 'Kazanchis'
    },
    location: { lat: 9.0267, lng: 38.7756 },
    zone: 'Central',
    facilities: ['shelter', 'digital_display', 'atm']
  },
  
  // Mexico Square
  {
    id: 'mexico',
    name: {
      en: 'Mexico Square',
      am: 'ሜክሲኮ አደባባይ',
      om: 'Finfinnee Mexico'
    },
    location: { lat: 9.0445, lng: 38.7334 },
    zone: 'North',
    facilities: ['shelter', 'digital_display']
  },
  
  // Stadium Area
  {
    id: 'stadium',
    name: {
      en: 'Addis Ababa Stadium',
      am: 'አዲስ አበባ ስታዲየም',
      om: 'Istiidiyeemii Addis Ababa'
    },
    location: { lat: 9.0156, lng: 38.7445 },
    zone: 'Central',
    facilities: ['shelter', 'digital_display']
  },
  
  // Legehar Area
  {
    id: 'legehar',
    name: {
      en: 'Legehar (Train Station)',
      am: 'ለገሃር',
      om: 'Legehar'
    },
    location: { lat: 9.0089, lng: 38.7556 },
    zone: 'Central',
    facilities: ['large_station', 'digital_display', 'ticket_booth', 'shops']
  },
  
  // Goro Area
  {
    id: 'goro',
    name: {
      en: 'Goro',
      am: 'ጎሮ',
      om: 'Goro'
    },
    location: { lat: 8.9778, lng: 38.7334 },
    zone: 'South',
    facilities: ['shelter', 'digital_display']
  },
  
  // Addis Ketema
  {
    id: 'addis-ketema',
    name: {
      en: 'Addis Ketema',
      am: 'አዲስ ከተማ',
      om: 'Addis Ketema'
    },
    location: { lat: 9.0267, lng: 38.7445 },
    zone: 'Central',
    facilities: ['shelter', 'digital_display']
  },
  
  // Gulele Area
  {
    id: 'gulele',
    name: {
      en: 'Gulele',
      am: 'ጉሌሌ',
      om: 'Gulele'
    },
    location: { lat: 9.0556, lng: 38.7445 },
    zone: 'North',
    facilities: ['shelter', 'digital_display']
  },
  
  // Kotebe
  {
    id: 'kotebe',
    name: {
      en: 'Kotebe',
      am: 'ኮተቤ',
      om: 'Kotebe'
    },
    location: { lat: 8.9667, lng: 38.8000 },
    zone: 'South',
    facilities: ['shelter', 'digital_display']
  },
  
  // Kality
  {
    id: 'kality',
    name: {
      en: 'Kality',
      am: 'ቃሊቲ',
      om: 'Qaliiti'
    },
    location: { lat: 8.9334, lng: 38.7778 },
    zone: 'South',
    facilities: ['shelter', 'digital_display']
  },
  
  // Kirkos
  {
    id: 'kirkos',
    name: {
      en: 'Kirkos',
      am: 'ቂርቆስ',
      om: 'Kirkos'
    },
    location: { lat: 9.0089, lng: 38.7778 },
    zone: 'Central',
    facilities: ['shelter', 'digital_display']
  },
  
  // Nifas Silk
  {
    id: 'nifas-silk',
    name: {
      en: 'Nifas Silk',
      am: 'ንፋስ ስልክ',
      om: 'Nifas Silk'
    },
    location: { lat: 8.9889, lng: 38.7223 },
    zone: 'Southwest',
    facilities: ['shelter', 'digital_display']
  },
  
  // Yeka
  {
    id: 'yeka',
    name: {
      en: 'Yeka',
      am: 'የካ',
      om: 'Yeka'
    },
    location: { lat: 9.0445, lng: 38.7889 },
    zone: 'Northeast',
    facilities: ['shelter', 'digital_display']
  }
];

// Major Bus Routes in Addis Ababa
export const busRoutes: BusRoute[] = [
  // Anbessa Routes
  {
    id: 'route-01',
    routeNumber: '01',
    name: {
      en: 'Merkato - Bole Airport',
      am: 'መርካቶ - ቦሌ አውሮፕላን ማረፊያ',
      om: 'Merkato - Buufata Xayyaaraatti Bole'
    },
    operator: 'Anbessa',
    color: '#22C55E',
    stops: ['merkato', 'shiromeda', 'meskel-square', 'kazanchis', 'bole', 'megenagna', 'bole-airport'],
    schedule: {
      firstBus: '05:00',
      lastBus: '22:00',
      frequency: 8
    },
    price: 12.50,
    distance: 18.5,
    duration: 45,
    status: 'active'
  },
  
  {
    id: 'route-02',
    routeNumber: '02',
    name: {
      en: 'Piazza - Six Kilo',
      am: 'ፒያሳ - ስድስት ኪሎ',
      om: 'Piazza - Jaata Kilo'
    },
    operator: 'Anbessa',
    color: '#22C55E',
    stops: ['piazza', 'arat-kilo', 'kazanchis', 'meskel-square', 'six-kilo'],
    schedule: {
      firstBus: '05:30',
      lastBus: '21:30',
      frequency: 10
    },
    price: 8.50,
    distance: 12.0,
    duration: 25,
    status: 'active'
  },
  
  {
    id: 'route-03',
    routeNumber: '03',
    name: {
      en: 'Mexico - CMC',
      am: 'ሜክሲኮ - ሲ.ኤም.ሲ',
      om: 'Mexico - CMC'
    },
    operator: 'Anbessa',
    color: '#22C55E',
    stops: ['mexico', 'piazza', 'meskel-square', 'kirkos', 'goro', 'cmc'],
    schedule: {
      firstBus: '05:15',
      lastBus: '21:45',
      frequency: 12
    },
    price: 10.00,
    distance: 16.0,
    duration: 35,
    status: 'active'
  },
  
  {
    id: 'route-04',
    routeNumber: '04',
    name: {
      en: 'Gulele - Kotebe',
      am: 'ጉሌሌ - ኮተቤ',
      om: 'Gulele - Kotebe'
    },
    operator: 'Anbessa',
    color: '#22C55E',
    stops: ['gulele', 'mexico', 'arat-kilo', 'meskel-square', 'bole', 'kotebe'],
    schedule: {
      firstBus: '05:45',
      lastBus: '21:00',
      frequency: 15
    },
    price: 11.00,
    distance: 20.5,
    duration: 40,
    status: 'active'
  },
  
  // Sheger Routes
  {
    id: 'route-11',
    routeNumber: '11',
    name: {
      en: 'Legehar - Nifas Silk',
      am: 'ለገሃር - ንፋስ ስልክ',
      om: 'Legehar - Nifas Silk'
    },
    operator: 'Sheger',
    color: '#EF4444',
    stops: ['legehar', 'stadium', 'merkato', 'shiromeda', 'nifas-silk'],
    schedule: {
      firstBus: '05:00',
      lastBus: '22:30',
      frequency: 9
    },
    price: 9.50,
    distance: 14.5,
    duration: 30,
    status: 'active'
  },
  
  {
    id: 'route-12',
    routeNumber: '12',
    name: {
      en: 'Addis Ketema - Kality',
      am: 'አዲስ ከተማ - ቃሊቲ',
      om: 'Addis Ketema - Qaliiti'
    },
    operator: 'Sheger',
    color: '#EF4444',
    stops: ['addis-ketema', 'piazza', 'meskel-square', 'goro', 'cmc', 'kality'],
    schedule: {
      firstBus: '05:30',
      lastBus: '21:15',
      frequency: 11
    },
    price: 13.00,
    distance: 22.0,
    duration: 50,
    status: 'active'
  },
  
  {
    id: 'route-13',
    routeNumber: '13',
    name: {
      en: 'Yeka - Merkato Circle',
      am: 'የካ - መርካቶ ዙሪያ',
      om: 'Yeka - Naannoo Merkato'
    },
    operator: 'Sheger',
    color: '#EF4444',
    stops: ['yeka', 'arat-kilo', 'kazanchis', 'meskel-square', 'stadium', 'merkato'],
    schedule: {
      firstBus: '05:45',
      lastBus: '21:30',
      frequency: 13
    },
    price: 10.50,
    distance: 18.0,
    duration: 38,
    status: 'active'
  },
  
  // Alliance Routes
  {
    id: 'route-21',
    routeNumber: '21',
    name: {
      en: 'Express: Airport - Piazza',
      am: 'ፈጣን: አውሮፕላን ማረፊያ - ፒያሳ',
      om: 'Ariifachiisaa: Buufata - Piazza'
    },
    operator: 'Alliance',
    color: '#3B82F6',
    stops: ['bole-airport', 'bole', 'meskel-square', 'kazanchis', 'arat-kilo', 'piazza'],
    schedule: {
      firstBus: '04:30',
      lastBus: '23:00',
      frequency: 6
    },
    price: 15.00,
    distance: 16.5,
    duration: 25,
    status: 'active'
  },
  
  {
    id: 'route-22',
    routeNumber: '22',
    name: {
      en: 'Express: Merkato - Six Kilo',
      am: 'ፈጣን: መርካቶ - ስድስት ኪሎ',
      om: 'Ariifachiisaa: Merkato - Jaata Kilo'
    },
    operator: 'Alliance',
    color: '#3B82F6',
    stops: ['merkato', 'meskel-square', 'kazanchis', 'six-kilo'],
    schedule: {
      firstBus: '05:00',
      lastBus: '22:00',
      frequency: 7
    },
    price: 12.00,
    distance: 13.0,
    duration: 20,
    status: 'active'
  },
  
  // Night Routes
  {
    id: 'route-n1',
    routeNumber: 'N1',
    name: {
      en: 'Night: Bole Airport - Merkato',
      am: 'የሌሊት: ቦሌ አውሮፕላን ማረፊያ - መርካቶ',
      om: 'Halkan: Buufata - Merkato'
    },
    operator: 'Alliance',
    color: '#8B5CF6',
    stops: ['bole-airport', 'bole', 'meskel-square', 'stadium', 'merkato'],
    schedule: {
      firstBus: '22:30',
      lastBus: '04:30',
      frequency: 20
    },
    price: 18.00,
    distance: 16.0,
    duration: 30,
    status: 'active'
  },
  
  // Circular Routes
  {
    id: 'route-c1',
    routeNumber: 'C1',
    name: {
      en: 'Central Circle (Clockwise)',
      am: 'ማዕከላዊ ዙሪያ (በሰዓት አቅጣጫ)',
      om: 'Naannoo Gidduu (Gara Sa\'aatii)'
    },
    operator: 'Anbessa',
    color: '#F59E0B',
    stops: ['meskel-square', 'kazanchis', 'arat-kilo', 'piazza', 'addis-ketema', 'stadium', 'meskel-square'],
    schedule: {
      firstBus: '06:00',
      lastBus: '20:00',
      frequency: 10
    },
    price: 6.00,
    distance: 8.5,
    duration: 18,
    status: 'active'
  }
];

// Live Bus Data (simulated)
export const generateLiveBuses = (): LiveBus[] => {
  const buses: LiveBus[] = [];
  
  busRoutes.forEach((route, routeIndex) => {
    // Generate 2-4 buses per route
    const busCount = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < busCount; i++) {
      const stopIndex = Math.floor(Math.random() * route.stops.length);
      const currentStop = busStops.find(stop => stop.id === route.stops[stopIndex]);
      
      if (currentStop) {
        // Add some random offset to the bus location
        const latOffset = (Math.random() - 0.5) * 0.005;
        const lngOffset = (Math.random() - 0.5) * 0.005;
        
        buses.push({
          id: `${route.id}-bus-${i + 1}`,
          routeId: route.id,
          plateNumber: `${route.operator.substring(0, 3).toUpperCase()}-${(1000 + routeIndex * 10 + i).toString()}`,
          currentLocation: {
            lat: currentStop.location.lat + latOffset,
            lng: currentStop.location.lng + lngOffset
          },
          nextStopId: route.stops[(stopIndex + 1) % route.stops.length],
          passengerCount: Math.floor(Math.random() * 55) + 5,
          capacity: 60,
          speed: Math.floor(Math.random() * 40) + 10,
          bearing: Math.floor(Math.random() * 360),
          lastUpdated: new Date(),
          status: 'in_service',
          delay: Math.floor(Math.random() * 10) - 5 // -5 to +5 minutes
        });
      }
    }
  });
  
  return buses;
};

// Get routes by operator
export const getRoutesByOperator = (operator: string) => {
  return busRoutes.filter(route => route.operator === operator);
};

// Get stops in a zone
export const getStopsInZone = (zone: string) => {
  return busStops.filter(stop => stop.zone === zone);
};

// Find routes between two stops
export const findRoutesBetweenStops = (fromStopId: string, toStopId: string) => {
  return busRoutes.filter(route => 
    route.stops.includes(fromStopId) && 
    route.stops.includes(toStopId) &&
    route.stops.indexOf(fromStopId) < route.stops.indexOf(toStopId)
  );
};

// Get next bus arrivals for a stop
export const getNextBusArrivals = (stopId: string, liveBuses: LiveBus[]) => {
  const arrivals = [];
  
  for (const bus of liveBuses) {
    const route = busRoutes.find(r => r.id === bus.routeId);
    if (route && route.stops.includes(stopId)) {
      const stopIndex = route.stops.indexOf(stopId);
      const busStopIndex = route.stops.indexOf(bus.nextStopId);
      
      // Calculate estimated arrival time
      let estimatedMinutes = 0;
      if (stopIndex > busStopIndex) {
        estimatedMinutes = (stopIndex - busStopIndex) * 2; // Assume 2 minutes between stops
      } else {
        estimatedMinutes = (route.stops.length - busStopIndex + stopIndex) * 2;
      }
      
      arrivals.push({
        busId: bus.id,
        routeNumber: route.routeNumber,
        routeName: route.name.en,
        estimatedArrival: estimatedMinutes + bus.delay,
        passengerLoad: Math.round((bus.passengerCount / bus.capacity) * 100),
        status: bus.status
      });
    }
  }
  
  return arrivals.sort((a, b) => a.estimatedArrival - b.estimatedArrival);
};
