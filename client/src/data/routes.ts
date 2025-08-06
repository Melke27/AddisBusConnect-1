// Real Addis Ababa bus routes data for Anbessa and Sheger bus companies
export interface BusRoute {
  id: string;
  company: 'anbessa' | 'sheger';
  nameEn: string;
  nameAm: string; // Amharic name
  nameOm: string; // Oromo name
  startPoint: {
    name: string;
    nameAm: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  endPoint: {
    name: string;
    nameAm: string;
    coordinates: [number, number];
  };
  stops: Array<{
    id: string;
    name: string;
    nameAm: string;
    coordinates: [number, number];
    order: number;
  }>;
  schedule: {
    startTime: string; // "06:00"
    endTime: string; // "22:00"
    frequency: number; // minutes between buses
  };
  price: number; // in Ethiopian Birr
  color: string; // hex color for map display
  isActive: boolean;
}

// Real Addis Ababa bus routes
export const busRoutes: BusRoute[] = [
  // Anbessa City Bus Routes
  {
    id: 'anbessa-01',
    company: 'anbessa',
    nameEn: 'Mercato - Bole',
    nameAm: 'መርካቶ - ቦሌ',
    nameOm: 'Merkato - Bole',
    startPoint: {
      name: 'Mercato',
      nameAm: 'መርካቶ',
      coordinates: [38.7469, 9.0157]
    },
    endPoint: {
      name: 'Bole Airport',
      nameAm: 'ቦሌ አውሮፕላን ማረፊያ',
      coordinates: [38.7990, 8.9789]
    },
    stops: [
      { id: 'stop-1', name: 'Mercato', nameAm: 'መርካቶ', coordinates: [38.7469, 9.0157], order: 1 },
      { id: 'stop-2', name: 'Piazza', nameAm: 'ፒያሳ', coordinates: [38.7578, 9.0343], order: 2 },
      { id: 'stop-3', name: 'Arat Kilo', nameAm: 'አራት ኪሎ', coordinates: [38.7614, 9.0411], order: 3 },
      { id: 'stop-4', name: 'Mexico', nameAm: 'ሜክሲኮ', coordinates: [38.7654, 9.0298], order: 4 },
      { id: 'stop-5', name: 'Meskel Square', nameAm: 'መስቀል አደባባይ', coordinates: [38.7578, 9.0125], order: 5 },
      { id: 'stop-6', name: 'Bole', nameAm: 'ቦሌ', coordinates: [38.7890, 8.9889], order: 6 },
      { id: 'stop-7', name: 'Bole Airport', nameAm: 'ቦሌ አውሮፕላን ማረፊያ', coordinates: [38.7990, 8.9789], order: 7 }
    ],
    schedule: {
      startTime: '05:30',
      endTime: '23:00',
      frequency: 15
    },
    price: 8.50,
    color: '#009639',
    isActive: true
  },
  {
    id: 'anbessa-02',
    company: 'anbessa',
    nameEn: 'Gotera - Kaliti',
    nameAm: 'ጎተራ - ቃሊቲ',
    nameOm: 'Gotera - Kaliti',
    startPoint: {
      name: 'Gotera',
      nameAm: 'ጎተራ',
      coordinates: [38.7025, 9.0542]
    },
    endPoint: {
      name: 'Kaliti',
      nameAm: 'ቃሊቲ',
      coordinates: [38.7234, 8.9456]
    },
    stops: [
      { id: 'stop-8', name: 'Gotera', nameAm: 'ጎተራ', coordinates: [38.7025, 9.0542], order: 1 },
      { id: 'stop-9', name: 'Merkato', nameAm: 'መርካቶ', coordinates: [38.7469, 9.0157], order: 2 },
      { id: 'stop-10', name: 'Addis Ketema', nameAm: 'አዲስ ከተማ', coordinates: [38.7389, 9.0089], order: 3 },
      { id: 'stop-11', name: 'Lideta', nameAm: 'ልደታ', coordinates: [38.7267, 8.9978], order: 4 },
      { id: 'stop-12', name: 'Tekle Haymanot', nameAm: 'ተክለ ሃይማኖት', coordinates: [38.7189, 8.9767], order: 5 },
      { id: 'stop-13', name: 'Kaliti', nameAm: 'ቃሊቲ', coordinates: [38.7234, 8.9456], order: 6 }
    ],
    schedule: {
      startTime: '06:00',
      endTime: '22:30',
      frequency: 20
    },
    price: 7.00,
    color: '#FFDE00',
    isActive: true
  },
  // Sheger Bus Routes
  {
    id: 'sheger-01',
    company: 'sheger',
    nameEn: 'Lafto - CMC',
    nameAm: 'ላፍቶ - ሲኤምሲ',
    nameOm: 'Lafto - CMC',
    startPoint: {
      name: 'Lafto',
      nameAm: 'ላፍቶ',
      coordinates: [38.8234, 8.9234]
    },
    endPoint: {
      name: 'CMC',
      nameAm: 'ሲኤምሲ',
      coordinates: [38.6789, 9.0456]
    },
    stops: [
      { id: 'stop-14', name: 'Lafto', nameAm: 'ላፍቶ', coordinates: [38.8234, 8.9234], order: 1 },
      { id: 'stop-15', name: 'Megenagna', nameAm: 'መገናኛ', coordinates: [38.8089, 8.9567], order: 2 },
      { id: 'stop-16', name: 'Hayahulet', nameAm: 'ሃያሁለት', coordinates: [38.7945, 8.9789], order: 3 },
      { id: 'stop-17', name: 'Stadium', nameAm: 'ስታድየም', coordinates: [38.7656, 9.0012], order: 4 },
      { id: 'stop-18', name: '4 Kilo', nameAm: '4 ኪሎ', coordinates: [38.7614, 9.0411], order: 5 },
      { id: 'stop-19', name: 'Saris', nameAm: 'ሳሪስ', coordinates: [38.7234, 9.0334], order: 6 },
      { id: 'stop-20', name: 'CMC', nameAm: 'ሲኤምሲ', coordinates: [38.6789, 9.0456], order: 7 }
    ],
    schedule: {
      startTime: '05:45',
      endTime: '22:45',
      frequency: 18
    },
    price: 9.00,
    color: '#DA020E',
    isActive: true
  },
  {
    id: 'sheger-02',
    company: 'sheger',
    nameEn: 'Gerji - Tor Hailoch',
    nameAm: 'ገርጂ - ቶር ሃይሎች',
    nameOm: 'Gerji - Tor Hailoch',
    startPoint: {
      name: 'Gerji',
      nameAm: 'ገርጂ',
      coordinates: [38.8456, 9.0789]
    },
    endPoint: {
      name: 'Tor Hailoch',
      nameAm: 'ቶር ሃይሎች',
      coordinates: [38.6234, 8.9123]
    },
    stops: [
      { id: 'stop-21', name: 'Gerji', nameAm: 'ገርጂ', coordinates: [38.8456, 9.0789], order: 1 },
      { id: 'stop-22', name: 'Bole Medhanialem', nameAm: 'ቦሌ መድሃኔዓለም', coordinates: [38.8123, 9.0234], order: 2 },
      { id: 'stop-23', name: 'Mexico', nameAm: 'ሜክሲኮ', coordinates: [38.7654, 9.0298], order: 3 },
      { id: 'stop-24', name: 'Churchill Road', nameAm: 'ቸርችል መንገድ', coordinates: [38.7456, 9.0189], order: 4 },
      { id: 'stop-25', name: 'Kazanchis', nameAm: 'ካዛንቺስ', coordinates: [38.7234, 9.0067], order: 5 },
      { id: 'stop-26', name: 'Bambis', nameAm: 'ባምቢስ', coordinates: [38.6789, 8.9678], order: 6 },
      { id: 'stop-27', name: 'Tor Hailoch', nameAm: 'ቶር ሃይሎች', coordinates: [38.6234, 8.9123], order: 7 }
    ],
    schedule: {
      startTime: '06:15',
      endTime: '22:15',
      frequency: 25
    },
    price: 8.00,
    color: '#4169E1',
    isActive: true
  },
  {
    id: 'anbessa-03',
    company: 'anbessa',
    nameEn: 'Entoto - Lebu',
    nameAm: 'እንጦጦ - ልቡ',
    nameOm: 'Entoto - Lebu',
    startPoint: {
      name: 'Entoto',
      nameAm: 'እንጦጦ',
      coordinates: [38.7456, 9.0989]
    },
    endPoint: {
      name: 'Lebu',
      nameAm: 'ልቡ',
      coordinates: [38.6789, 8.8567]
    },
    stops: [
      { id: 'stop-28', name: 'Entoto', nameAm: 'እንጦጦ', coordinates: [38.7456, 9.0989], order: 1 },
      { id: 'stop-29', name: 'Shiro Meda', nameAm: 'ሽሮ መዳ', coordinates: [38.7334, 9.0567], order: 2 },
      { id: 'stop-30', name: '6 Kilo', nameAm: '6 ኪሎ', coordinates: [38.7189, 9.0234], order: 3 },
      { id: 'stop-31', name: 'Sidist Kilo', nameAm: 'ስድስት ኪሎ', coordinates: [38.7056, 9.0089], order: 4 },
      { id: 'stop-32', name: 'Kera', nameAm: 'ኬራ', coordinates: [38.6923, 8.9456], order: 5 },
      { id: 'stop-33', name: 'Lebu', nameAm: 'ልቡ', coordinates: [38.6789, 8.8567], order: 6 }
    ],
    schedule: {
      startTime: '06:30',
      endTime: '21:30',
      frequency: 30
    },
    price: 6.50,
    color: '#32CD32',
    isActive: true
  }
];

// Function to get routes by company
export const getRoutesByCompany = (company: 'anbessa' | 'sheger'): BusRoute[] => {
  return busRoutes.filter(route => route.company === company);
};

// Function to find nearby stops
export const findNearbyStops = (userLat: number, userLng: number, radiusKm: number = 1): Array<BusRoute['stops'][0] & { route: string }> => {
  const nearbyStops: Array<BusRoute['stops'][0] & { route: string }> = [];
  
  busRoutes.forEach(route => {
    route.stops.forEach(stop => {
      const distance = calculateDistance(userLat, userLng, stop.coordinates[1], stop.coordinates[0]);
      if (distance <= radiusKm) {
        nearbyStops.push({
          ...stop,
          route: route.nameEn
        });
      }
    });
  });
  
  return nearbyStops.sort((a, b) => {
    const distA = calculateDistance(userLat, userLng, a.coordinates[1], a.coordinates[0]);
    const distB = calculateDistance(userLat, userLng, b.coordinates[1], b.coordinates[0]);
    return distA - distB;
  });
};

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}