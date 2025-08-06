import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, checkDatabaseConnection } from './database/supabase';
import { seedDatabase } from './database/seed';
import { routes, buses, stops, tickets, companies, users, busTracking } from './database/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

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

// Initialize database
async function initializeDatabase() {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }
    
    // Seed database with initial data
    await seedDatabase();
    
    console.log('🚀 Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// API Routes

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await db.select().from(companies).limit(1);
    res.json({
      status: 'ok',
      message: 'AddisBus Connect Server with Supabase Running',
      timestamp: new Date().toISOString(),
      features: [
        'Ethiopian Cultural Design',
        'Supabase Database Integration',
        'Real-time Bus Tracking',
        'Amharic Voice Assistant',
        'Payment Integration Ready'
      ]
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed' 
    });
  }
});

// Get all bus companies
app.get('/api/companies', async (req, res) => {
  try {
    const companiesList = await db.select().from(companies).where(eq(companies.isActive, true));
    res.json({ success: true, companies: companiesList });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch companies' });
  }
});

// Get all routes with company information
app.get('/api/routes', async (req, res) => {
  try {
    const { company } = req.query;
    
    let query = db.select({
      id: routes.id,
      companyId: routes.companyId,
      nameEn: routes.nameEn,
      nameAm: routes.nameAm,
      nameOm: routes.nameOm,
      startPointName: routes.startPointName,
      startPointNameAm: routes.startPointNameAm,
      startPointCoords: routes.startPointCoords,
      endPointName: routes.endPointName,
      endPointNameAm: routes.endPointNameAm,
      endPointCoords: routes.endPointCoords,
      price: routes.price,
      frequency: routes.frequency,
      startTime: routes.startTime,
      endTime: routes.endTime,
      color: routes.color,
      isActive: routes.isActive,
      companyName: companies.nameEn,
      companyNameAm: companies.nameAm,
      companyColor: companies.color
    })
    .from(routes)
    .leftJoin(companies, eq(routes.companyId, companies.id))
    .where(eq(routes.isActive, true));

    if (company && typeof company === 'string') {
      query = query.where(eq(routes.companyId, company));
    }

    const routesList = await query;
    res.json({ success: true, routes: routesList });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch routes' });
  }
});

// Get route details with stops
app.get('/api/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const route = await db.select().from(routes).where(eq(routes.id, id)).limit(1);
    if (!route.length) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }

    const routeStops = await db.select().from(stops)
      .where(and(eq(stops.routeId, id), eq(stops.isActive, true)))
      .orderBy(stops.order);

    res.json({ 
      success: true, 
      route: route[0], 
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
    
    let query = db.select({
      id: buses.id,
      routeId: buses.routeId,
      plateNumber: buses.plateNumber,
      capacity: buses.capacity,
      currentCapacity: buses.currentCapacity,
      currentLocation: buses.currentLocation,
      speed: buses.speed,
      heading: buses.heading,
      estimatedArrival: buses.estimatedArrival,
      status: buses.status,
      lastUpdated: buses.lastUpdated,
      routeName: routes.nameAm,
      routeColor: routes.color
    })
    .from(buses)
    .leftJoin(routes, eq(buses.routeId, routes.id))
    .where(and(eq(buses.isActive, true), eq(buses.status, 'active')));

    if (routeId && typeof routeId === 'string') {
      query = query.where(eq(buses.routeId, routeId));
    }

    const livebuses = await query;
    
    // Transform coordinates for frontend
    const transformedBuses = livebuses.map(bus => ({
      ...bus,
      coordinates: bus.currentLocation ? 
        bus.currentLocation.replace(/[()]/g, '').split(',').map(Number).reverse() : 
        null
    }));

    res.json({ success: true, buses: transformedBuses });
  } catch (error) {
    console.error('Error fetching live buses:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch live buses' });
  }
});

// Purchase ticket
app.post('/api/tickets/purchase', async (req, res) => {
  try {
    const { routeId, fromStopId, toStopId, paymentMethod, amount, userId } = req.body;
    
    // Generate QR code
    const qrCode = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Create ticket
    const ticketData = {
      userId: userId || null,
      routeId,
      fromStopId: fromStopId || null,
      toStopId: toStopId || null,
      qrCode,
      amount: amount.toString(),
      paymentMethod,
      paymentId: `PAY-${Date.now()}`,
      status: 'active',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours validity
    };

    const [newTicket] = await db.insert(tickets).values(ticketData).returning();

    res.json({
      success: true,
      ticket: newTicket,
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

    // Using PostgreSQL point distance calculation
    const nearbyStops = await db.execute(sql`
      SELECT s.*, r.name_am as route_name, r.color as route_color
      FROM stops s
      JOIN routes r ON s.route_id = r.id
      WHERE s.is_active = true
        AND r.is_active = true
        AND point(${lng}, ${lat}) <@> s.coordinates < ${radius}
      ORDER BY point(${lng}, ${lat}) <@> s.coordinates
      LIMIT 10
    `);

    res.json({ success: true, stops: nearbyStops.rows });
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
        data: null
      },
      'አውቶብስ ከተተኮስ': {
        response: 'ቀጥታ የአውቶብስ ተከታታይ እየተጀመረ ነው...',
        action: 'track_buses',
        data: null
      },
      'ትኬት ግዛ': {
        response: 'የትኬት ግዢ ገጽ እየተከፈተ ነው...',
        action: 'buy_ticket',
        data: null
      },
      'ማቆሚያዎች አሳይ': {
        response: 'በአቅራቢያ ያሉ ማቆሚያዎች እየታዩ ነው...',
        action: 'show_stops',
        data: null
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
    
    // Update bus location
    await db.update(buses)
      .set({
        currentLocation: `(${coordinates[1]},${coordinates[0]})`,
        speed: speed?.toString(),
        heading,
        currentCapacity: passengers,
        lastUpdated: new Date()
      })
      .where(eq(buses.id, id));

    // Insert tracking record
    await db.insert(busTracking).values({
      busId: id,
      coordinates: `(${coordinates[1]},${coordinates[0]})`,
      speed: speed?.toString(),
      heading,
      passengers
    });

    res.json({ success: true, message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating bus location:', error);
    res.status(500).json({ success: false, error: 'Failed to update location' });
  }
});

// Serve static files
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
    await initializeDatabase();
    
    app.listen(port, '0.0.0.0', () => {
      console.log(`🇪🇹 AddisBus Connect Server with Supabase running on port ${port}`);
      console.log(`🚌 Features: Ethiopian Design, Real Database, Live Tracking`);
      console.log(`📍 Access at: http://localhost:${port}`);
      console.log(`📊 Database: Connected to Supabase PostgreSQL`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();