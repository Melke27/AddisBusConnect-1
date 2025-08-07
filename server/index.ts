import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import session from 'express-session';
import passport from 'passport';
import { connectDB } from '../shared/schema.js';
import './oauth.js'; // Initialize OAuth strategies
import authRoutes from './routes/auth.routes.js';
import http from 'http';

async function startServer() {
  const app = express();
  let server: any;

  try {
    // Connect to MongoDB first
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Session configuration
    app.use(session({
      secret: process.env.SESSION_SECRET || 'your-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
      }
    }));

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // CORS configuration
    app.use((req, res, next) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        process.env.CLIENT_URL
      ].filter(Boolean);
      
      const origin = req.headers.origin as string;
      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      
      next();
    });

    // Logging middleware
    app.use((req: Request, _res: Response, next: NextFunction) => {
      const start = Date.now();
      const { method, originalUrl: path } = req;
      
      // Log request start
      console.log(`${method} ${path} - Request started`);
      
      // Override the json method to log the response time
      const originalJson = _res.json;
      _res.json = function (bodyJson, ...args) {
        return originalJson.call(this, bodyJson, ...args);
      };
      next();
    });

    // Register API routes
    app.use('/api/auth', authRoutes);

    // Serve static files from the public directory
    app.use(express.static('public'));

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start the server
    const PORT = process.env.PORT || 5001;
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    return server;
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
