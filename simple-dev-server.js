import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS setup for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// API Routes for bus functionality
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AddisBus Connect Server Running',
    timestamp: new Date().toISOString(),
    features: [
      'Ethiopian Cultural Logos (Anbessa & Sheger)',
      'Amharic Voice Assistant', 
      'Real Bus Routes & Tracking',
      'Google Maps Integration',
      'Advanced Features & Button Guide'
    ]
  });
});

// Bus routes API
app.get('/api/routes', (req, res) => {
  res.json({
    success: true,
    routes: [
      {
        id: 'anbessa-01',
        company: 'anbessa',
        nameEn: 'Mercato - Bole',
        nameAm: 'መርካቶ - ቦሌ',
        price: 8.50,
        color: '#009639',
        isActive: true
      },
      {
        id: 'sheger-01',
        company: 'sheger',
        nameEn: 'Lafto - CMC',
        nameAm: 'ላፍቶ - ሲኤምሲ',
        price: 9.00,
        color: '#DA020E',
        isActive: true
      }
    ]
  });
});

// Live bus tracking API
app.get('/api/buses/live', (req, res) => {
  res.json({
    success: true,
    buses: [
      {
        id: 'bus-anbessa-001',
        plateNumber: 'ET-ANB-1234',
        routeId: 'anbessa-01',
        coordinates: [9.0157, 38.7469],
        nextStop: 'መስቀል አደባባይ',
        estimatedArrival: 5,
        capacity: 50,
        currentCapacity: 32
      },
      {
        id: 'bus-sheger-001', 
        plateNumber: 'ET-SHG-5678',
        routeId: 'sheger-01',
        coordinates: [8.9567, 38.8089],
        nextStop: 'መገናኛ',
        estimatedArrival: 8,
        capacity: 45,
        currentCapacity: 28
      }
    ]
  });
});

// Ticket purchase API
app.post('/api/tickets/purchase', (req, res) => {
  const { routeId, paymentMethod, amount } = req.body;
  
  res.json({
    success: true,
    ticket: {
      id: `ticket-${Date.now()}`,
      routeId,
      qrCode: `QR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      amount,
      paymentMethod,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    },
    message: 'Ticket purchased successfully - ትኬት በተሳካ ሁኔታ ተገዝቷል'
  });
});

// Voice commands API
app.post('/api/voice/command', (req, res) => {
  const { command, language = 'am' } = req.body;
  
  const responses = {
    'መስመር ፈልግ': 'መስመሮች እየተጫኑ ነው...',
    'አውቶብስ ከተተኮስ': 'ቀጥታ የአውቶብስ ተከታታይ እየተጀመረ ነው...',
    'ትኬት ግዛ': 'የትኬት ግዢ ገጽ እየተከፈተ ነው...',
    'ማቆሚያዎች አሳይ': 'በአቅራቢያ ያሉ ማቆሚያዎች እየታዩ ነው...'
  };
  
  res.json({
    success: true,
    command,
    response: responses[command] || 'ትእዛዝ ተረድቷል',
    action: command.includes('መስመር') ? 'show_routes' :
            command.includes('አውቶብስ') ? 'track_buses' :
            command.includes('ትኬት') ? 'buy_ticket' :
            command.includes('ማቆሚያ') ? 'show_stops' : 'unknown'
  });
});

// Serve static files in production or development
const publicPath = path.join(__dirname, 'dist/public');
app.use(express.static(publicPath));

// Serve the React app for any non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(publicPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'የስርዓት ስህተት - System Error'
  });
});

const port = parseInt(process.env.PORT || '5000', 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`🇪🇹 AddisBus Connect Server running on port ${port}`);
  console.log(`🚌 Features: Ethiopian Logos, Amharic Voice Assistant, Real Routes`);
  console.log(`📍 Access at: http://localhost:${port}`);
});