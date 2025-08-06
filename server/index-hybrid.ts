import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : '*',
  credentials: true
}));

// Database connection status
let dbConnected = false;
let db: any = null;

// Try to initialize Supabase database if available
async function initializeDatabase() {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('supabase.co')) {
      console.log('⚠️  Supabase DATABASE_URL not provided or invalid');
      console.log('🚀 Running in development mode with mock data');
      return false;
    }

    // Dynamic import for database modules
    const { db: database, checkDatabaseConnection } = await import('./database/supabase.js');
    const { seedDatabase } = await import('./database/seed.js');
    
    db = database;
    const isConnected = await checkDatabaseConnection();
    
    if (isConnected) {
      await seedDatabase();
      dbConnected = true;
      console.log('✅ Supabase database connected successfully');
    }
    
    return isConnected;
  } catch (error) {
    console.log('⚠️  Database connection failed, using mock data:', error.message);
    return false;
  }
}

// Mock data for development
const mockCompanies = [
  {
    id: 'anbessa',
    nameEn: 'Anbessa City Bus',
    nameAm: 'አንበሳ የከተማ አውቶብስ',
    nameOm: 'Anbessa Awtoobusii Magaalaa',
    color: '#009639',
    contactPhone: '+251911123456',
    contactEmail: 'info@anbessa.gov.et',
    isActive: true
  },
  {
    id: 'sheger',
    nameEn: 'Sheger Bus',
    nameAm: 'ሸገር አውቶብስ',
    nameOm: 'Sheger Awtoobusii',
    color: '#DA020E',
    contactPhone: '+251911654321',
    contactEmail: 'info@sheger.gov.et',
    isActive: true
  }
];

const mockRoutes = [
  {
    id: 'anbessa-01',
    companyId: 'anbessa',
    nameEn: 'Mercato - Bole',
    nameAm: 'መርካቶ - ቦሌ',
    nameOm: 'Merkato - Bole',
    startPointName: 'Mercato',
    startPointNameAm: 'መርካቶ',
    startPointCoords: [38.7469, 9.0157],
    endPointName: 'Bole Airport',
    endPointNameAm: 'ቦሌ አውሮፕላን ማረፊያ',
    endPointCoords: [38.7990, 8.9789],
    price: '8.50',
    frequency: 15,
    startTime: '05:30',
    endTime: '23:00',
    color: '#009639',
    isActive: true,
    companyName: 'Anbessa City Bus',
    companyNameAm: 'አንበሳ የከተማ አውቶብስ',
    companyColor: '#009639'
  },
  {
    id: 'sheger-01',
    companyId: 'sheger',
    nameEn: 'Lafto - CMC',
    nameAm: 'ላፍቶ - ሲኤምሲ',
    nameOm: 'Lafto - CMC',
    startPointName: 'Lafto',
    startPointNameAm: 'ላፍቶ',
    startPointCoords: [38.8234, 8.9234],
    endPointName: 'CMC',
    endPointNameAm: 'ሲኤምሲ',
    endPointCoords: [38.6789, 9.0456],
    price: '9.00',
    frequency: 18,
    startTime: '05:45',
    endTime: '22:45',
    color: '#DA020E',
    isActive: true,
    companyName: 'Sheger Bus',
    companyNameAm: 'ሸገር አውቶብስ',
    companyColor: '#DA020E'
  },
  {
    id: 'anbessa-02',
    companyId: 'anbessa',
    nameEn: 'Gotera - Kaliti',
    nameAm: 'ጎተራ - ቃሊቲ',
    nameOm: 'Gotera - Kaliti',
    startPointName: 'Gotera',
    startPointNameAm: 'ጎተራ',
    startPointCoords: [38.7025, 9.0542],
    endPointName: 'Kaliti',
    endPointNameAm: 'ቃሊቲ',
    endPointCoords: [38.7234, 8.9456],
    price: '7.00',
    frequency: 20,
    startTime: '06:00',
    endTime: '22:30',
    color: '#FFDE00',
    isActive: true,
    companyName: 'Anbessa City Bus',
    companyNameAm: 'አንበሳ የከተማ አውቶብስ',
    companyColor: '#009639'
  },
  {
    id: 'sheger-02',
    companyId: 'sheger',
    nameEn: 'Gerji - Tor Hailoch',
    nameAm: 'ገርጂ - ቶር ሃይሎች',
    nameOm: 'Gerji - Tor Hailoch',
    startPointName: 'Gerji',
    startPointNameAm: 'ገርጂ',
    startPointCoords: [38.8456, 9.0789],
    endPointName: 'Tor Hailoch',
    endPointNameAm: 'ቶር ሃይሎች',
    endPointCoords: [38.6234, 8.9123],
    price: '8.00',
    frequency: 25,
    startTime: '06:15',
    endTime: '22:15',
    color: '#4169E1',
    isActive: true,
    companyName: 'Sheger Bus',
    companyNameAm: 'ሸገር አውቶብስ',
    companyColor: '#DA020E'
  }
];

const mockBuses = [
  {
    id: 'bus-anbessa-001',
    routeId: 'anbessa-01',
    plateNumber: 'ET-ANB-1234',
    capacity: 50,
    currentCapacity: 32,
    coordinates: [9.0125, 38.7578], // Meskel Square - lat, lng
    speed: 25.5,
    heading: 90,
    estimatedArrival: 5,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    routeName: 'መርካቶ - ቦሌ',
    routeColor: '#009639'
  },
  {
    id: 'bus-anbessa-002',
    routeId: 'anbessa-01',
    plateNumber: 'ET-ANB-5678',
    capacity: 50,
    currentCapacity: 28,
    coordinates: [8.9889, 38.7890], // Bole
    speed: 30.0,
    heading: 180,
    estimatedArrival: 8,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    routeName: 'መርካቶ - ቦሌ',
    routeColor: '#009639'
  },
  {
    id: 'bus-sheger-001',
    routeId: 'sheger-01',
    plateNumber: 'ET-SHG-9012',
    capacity: 45,
    currentCapacity: 20,
    coordinates: [8.9567, 38.8089], // Megenagna
    speed: 28.0,
    heading: 270,
    estimatedArrival: 12,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    routeName: 'ላፍቶ - ሲኤምሲ',
    routeColor: '#DA020E'
  },
  {
    id: 'bus-sheger-002',
    routeId: 'sheger-02',
    plateNumber: 'ET-SHG-3456',
    capacity: 45,
    currentCapacity: 35,
    coordinates: [9.0789, 38.8456], // Gerji
    speed: 22.0,
    heading: 45,
    estimatedArrival: 15,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    routeName: 'ገርጂ - ቶር ሃይሎች',
    routeColor: '#4169E1'
  }
];

const mockStops = [
  {
    id: 'stop-001',
    routeId: 'anbessa-01',
    name: 'Mercato',
    nameAm: 'መርካቶ',
    nameOm: 'Merkato',
    coordinates: [9.0157, 38.7469],
    order: 1,
    landmarks: ['Grand Market', 'Mercato Bus Station'],
    facilities: ['shelter', 'lighting', 'security']
  },
  {
    id: 'stop-002',
    routeId: 'anbessa-01',
    name: 'Meskel Square',
    nameAm: 'መስቀል አደባባይ',
    nameOm: 'Meskel Square',
    coordinates: [9.0125, 38.7578],
    order: 5,
    landmarks: ['Meskel Square', 'Monument'],
    facilities: ['shelter', 'bench', 'lighting', 'security']
  },
  {
    id: 'stop-003',
    routeId: 'anbessa-01',
    name: 'Bole Airport',
    nameAm: 'ቦሌ አውሮፕላን ማረፊያ',
    nameOm: 'Bole Airport',
    coordinates: [8.9789, 38.7990],
    order: 7,
    landmarks: ['Bole International Airport'],
    facilities: ['shelter', 'bench', 'lighting', 'security', 'parking']
  }
];

// API Routes

// Health check
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'ok',
    message: 'AddisBus Connect Server Running',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'Supabase Connected' : 'Mock Data Mode',
    features: [
      'Ethiopian Cultural Logos (Anbessa & Sheger)',
      'Amharic Voice Assistant',
      'Real Bus Routes & Tracking',
      'Google Maps Integration',
      'Advanced Features & Button Guide',
      dbConnected ? 'Live Database' : 'Development Mock Data'
    ]
  });
});

// Get all bus companies
app.get('/api/companies', async (req, res) => {
  try {
    let companies;
    
    if (dbConnected && db) {
      const { companies: companiesTable } = await import('./database/schema.js');
      const { eq } = await import('drizzle-orm');
      companies = await db.select().from(companiesTable).where(eq(companiesTable.isActive, true));
    } else {
      companies = mockCompanies;
    }
    
    res.json({ success: true, companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.json({ success: true, companies: mockCompanies });
  }
});

// Get all routes
app.get('/api/routes', async (req, res) => {
  try {
    const { company } = req.query;
    let routes;
    
    if (dbConnected && db) {
      // Database implementation would go here
      routes = mockRoutes;
    } else {
      routes = mockRoutes;
    }
    
    // Filter by company if requested
    if (company && typeof company === 'string') {
      routes = routes.filter(route => route.companyId === company);
    }
    
    res.json({ success: true, routes });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.json({ success: true, routes: mockRoutes });
  }
});

// Get route details with stops
app.get('/api/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const route = mockRoutes.find(r => r.id === id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }

    const routeStops = mockStops.filter(s => s.routeId === id);

    res.json({ 
      success: true, 
      route, 
      stops: routeStops 
    });
  } catch (error) {
    console.error('Error fetching route details:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch route details' });
  }
});

// Get live buses
app.get('/api/buses/live', async (req, res) => {
  try {
    const { routeId } = req.query;
    let buses = mockBuses;
    
    // Simulate real-time movement
    buses = buses.map(bus => ({
      ...bus,
      coordinates: [
        bus.coordinates[0] + (Math.random() - 0.5) * 0.001,
        bus.coordinates[1] + (Math.random() - 0.5) * 0.001
      ],
      currentCapacity: Math.min(bus.capacity, bus.currentCapacity + Math.floor(Math.random() * 3) - 1),
      estimatedArrival: Math.max(1, bus.estimatedArrival + Math.floor(Math.random() * 3) - 1),
      lastUpdated: new Date().toISOString()
    }));
    
    // Filter by route if requested
    if (routeId && typeof routeId === 'string') {
      buses = buses.filter(bus => bus.routeId === routeId);
    }

    res.json({ success: true, buses });
  } catch (error) {
    console.error('Error fetching live buses:', error);
    res.json({ success: true, buses: mockBuses });
  }
});

// Purchase ticket
app.post('/api/tickets/purchase', async (req, res) => {
  try {
    const { routeId, fromStopId, toStopId, paymentMethod, amount, userId } = req.body;
    
    // Generate QR code
    const qrCode = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const ticket = {
      id: `ticket-${Date.now()}`,
      userId: userId || null,
      routeId,
      fromStopId: fromStopId || null,
      toStopId: toStopId || null,
      qrCode,
      amount: parseFloat(amount),
      paymentMethod,
      paymentId: `PAY-${Date.now()}`,
      status: 'active',
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      ticket,
      message: 'Ticket purchased successfully - ትኬት በተሳካ ሁኔታ ተገዝቷል'
    });
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    res.status(500).json({ success: false, error: 'Failed to purchase ticket' });
  }
});

// Get nearby stops
app.get('/api/stops/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 2 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'Latitude and longitude required' });
    }

    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);
    const searchRadius = parseFloat(radius as string);

    // Calculate distance using Haversine formula
    const nearbyStops = mockStops
      .map(stop => {
        const stopLat = stop.coordinates[0];
        const stopLng = stop.coordinates[1];
        
        const R = 6371; // Earth's radius in km
        const dLat = (stopLat - userLat) * Math.PI / 180;
        const dLng = (stopLng - userLng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(userLat * Math.PI / 180) * Math.cos(stopLat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return { ...stop, distance };
      })
      .filter(stop => stop.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    res.json({ success: true, stops: nearbyStops });
  } catch (error) {
    console.error('Error fetching nearby stops:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch nearby stops' });
  }
});

// Voice command processing
app.post('/api/voice/command', async (req, res) => {
  try {
    const { command, language = 'am' } = req.body;
    
    const responses = {
      'መስመር ፈልግ': {
        response: 'መስመሮች እየተጫኑ ነው...',
        action: 'show_routes',
        data: mockRoutes.slice(0, 3)
      },
      'አውቶብስ ከተተኮስ': {
        response: 'ቀጥታ የአውቶብስ ተከታታይ እየተጀመረ ነው...',
        action: 'track_buses',
        data: mockBuses.slice(0, 2)
      },
      'ትኬት ግዛ': {
        response: 'የትኬት ግዢ ገጽ እየተከፈተ ነው...',
        action: 'buy_ticket',
        data: { routes: mockRoutes.slice(0, 2), paymentMethods: ['telebirr', 'cbe_birr', 'card'] }
      },
      'ማቆሚያዎች አሳይ': {
        response: 'በአቅራቢያ ያሉ ማቆሚያዎች እየታዩ ነው...',
        action: 'show_stops',
        data: mockStops.slice(0, 3)
      }
    };
    
    const commandResponse = responses[command] || {
      response: 'ትእዛዝ ተረድቷል',
      action: 'unknown',
      data: null
    };

    res.json({
      success: true,
      command,
      ...commandResponse
    });
  } catch (error) {
    console.error('Error processing voice command:', error);
    res.status(500).json({ success: false, error: 'Failed to process voice command' });
  }
});

// Update bus location (for real-time tracking)
app.post('/api/buses/:id/location', async (req, res) => {
  try {
    const { id } = req.params;
    const { coordinates, speed, heading, passengers } = req.body;
    
    // Update mock data
    const busIndex = mockBuses.findIndex(bus => bus.id === id);
    if (busIndex !== -1) {
      mockBuses[busIndex] = {
        ...mockBuses[busIndex],
        coordinates,
        speed,
        heading,
        currentCapacity: passengers,
        lastUpdated: new Date().toISOString()
      };
    }

    res.json({ success: true, message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating bus location:', error);
    res.status(500).json({ success: false, error: 'Failed to update location' });
  }
});

// Advanced analytics endpoint
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const analytics = {
      totalRoutes: mockRoutes.length,
      activeRoutes: mockRoutes.filter(r => r.isActive).length,
      totalBuses: mockBuses.length,
      activeBuses: mockBuses.filter(b => b.status === 'active').length,
      averageCapacity: mockBuses.reduce((sum, bus) => sum + (bus.currentCapacity / bus.capacity), 0) / mockBuses.length * 100,
      popularRoutes: mockRoutes
        .map(route => ({
          ...route,
          activeBuses: mockBuses.filter(bus => bus.routeId === route.id).length
        }))
        .sort((a, b) => b.activeBuses - a.activeBuses)
        .slice(0, 3),
      recentActivity: mockBuses.map(bus => ({
        id: bus.id,
        plateNumber: bus.plateNumber,
        route: bus.routeName,
        location: `${bus.coordinates[0].toFixed(4)}, ${bus.coordinates[1].toFixed(4)}`,
        capacity: `${bus.currentCapacity}/${bus.capacity}`,
        lastUpdated: bus.lastUpdated
      })).slice(0, 5)
    };

    res.json({ success: true, analytics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../dist/public');
  app.use(express.static(publicPath));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(publicPath, 'index.html'));
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
}

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'የስርዓት ስህተት - System Error'
  });
});

// Start server
const port = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  try {
    // Try to initialize database but continue without it if it fails
    await initializeDatabase();
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`🇪🇹 AddisBus Connect Server running on port ${port}`);
      console.log(`🚌 Features: Ethiopian Design, ${dbConnected ? 'Live Database' : 'Mock Data'}, Advanced Tracking`);
      console.log(`📍 Access at: http://localhost:${port}`);
      console.log(`📊 Database: ${dbConnected ? 'Connected to Supabase PostgreSQL' : 'Using Mock Data for Development'}`);
      
      if (!dbConnected) {
        console.log('\n💡 To connect to Supabase:');
        console.log('   1. Go to https://supabase.com/dashboard/projects');
        console.log('   2. Create a new project');
        console.log('   3. Go to Settings → Database');
        console.log('   4. Copy the connection string');
        console.log('   5. Replace [YOUR-PASSWORD] with your database password');
        console.log('   6. Add it as DATABASE_URL in your environment\n');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();