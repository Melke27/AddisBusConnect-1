import type { Express } from "express";
import { getBusLocations, getRoutes } from "./simulatedBusData";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertRouteSchema, insertStopSchema, insertBusSchema, insertTicketSchema, type IBus, type ITicket } from "@shared/schema";
import { z } from "zod";
import {
  authenticateToken,
  requireAdmin,
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  changePassword
} from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - only setup if environment variables are available
  if (process.env.REPLIT_DOMAINS) {
    await setupAuth(app);
  }

  // Authentication routes
  app.post('/api/auth/signup', signup);
  app.post('/api/auth/login', login);
  app.post('/api/auth/logout', logout);
  app.post('/api/auth/forgot-password', forgotPassword);
  app.post('/api/auth/reset-password', resetPassword);
  app.get('/api/auth/user', authenticateToken, getCurrentUser);
  app.put('/api/auth/profile', authenticateToken, updateProfile);
  app.put('/api/auth/change-password', authenticateToken, changePassword);

  // Legacy auth route for compatibility
  app.get('/api/auth/user-legacy', async (req: any, res) => {
    try {
      // For local development, return mock user data
      if (!process.env.REPLIT_DOMAINS) {
        return res.json({
          id: 'local-dev-user',
          email: 'dev@example.com',
          firstName: 'Local',
          lastName: 'Developer',
          role: 'user'
        });
      }
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Routes API
  app.get('/api/routes', async (req, res) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ message: "Failed to fetch routes" });
    }
  });

  app.get('/api/stops', async (req, res) => {
    try {
      const stops = await storage.getAllStops();
      res.json(stops);
    } catch (error) {
      console.error("Error fetching stops:", error);
      res.status(500).json({ message: "Failed to fetch stops" });
    }
  });

  app.get('/api/routes/:id', async (req, res) => {
    try {
      const route = await storage.getRoute(req.params.id);
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
      res.json(route);
    } catch (error) {
      console.error("Error fetching route:", error);
      res.status(500).json({ message: "Failed to fetch route" });
    }
  });

  app.post('/api/routes', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertRouteSchema.parse(req.body);
      const route = await storage.createRoute(validatedData);
      res.json(route);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating route:", error);
      res.status(500).json({ message: "Failed to create route" });
    }
  });

  app.put('/api/routes/:id', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertRouteSchema.partial().parse(req.body);
      const route = await storage.updateRoute(req.params.id, validatedData);
      res.json(route);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating route:", error);
      res.status(500).json({ message: "Failed to update route" });
    }
  });

  app.delete('/api/routes/:id', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      await storage.deleteRoute(req.params.id);
      res.json({ message: "Route deleted successfully" });
    } catch (error) {
      console.error("Error deleting route:", error);
      res.status(500).json({ message: "Failed to delete route" });
    }
  });

  // Stops API
  app.post('/api/stops', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertStopSchema.parse(req.body);
      const stop = await storage.createStop(validatedData);
      res.json(stop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating stop:", error);
      res.status(500).json({ message: "Failed to create stop" });
    }
  });

  app.put('/api/stops/:id', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertStopSchema.partial().parse(req.body);
      const stop = await storage.updateStop(req.params.id, validatedData);
      res.json(stop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating stop:", error);
      res.status(500).json({ message: "Failed to update stop" });
    }
  });

  app.delete('/api/stops/:id', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      await storage.deleteStop(req.params.id);
      res.json({ message: "Stop deleted successfully" });
    } catch (error) {
      console.error("Error deleting stop:", error);
      res.status(500).json({ message: "Failed to delete stop" });
    }
  });

  // Buses API
  app.get('/api/buses', async (req, res) => {
    try {
      const buses = await storage.getAllBuses();
      res.json(buses);
    } catch (error) {
      console.error("Error fetching buses:", error);
      res.status(500).json({ message: "Failed to fetch buses" });
    }
  });

  app.post('/api/buses', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertBusSchema.parse(req.body);
      const bus = await storage.createBus(validatedData);
      res.json(bus);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating bus:", error);
      res.status(500).json({ message: "Failed to create bus" });
    }
  });

  app.put('/api/buses/:id', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertBusSchema.partial().parse(req.body);
      const bus = await storage.updateBus(req.params.id, validatedData);
      res.json(bus);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating bus:", error);
      res.status(500).json({ message: "Failed to update bus" });
    }
  });

  app.delete('/api/buses/:id', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      await storage.deleteBus(req.params.id);
      res.json({ message: "Bus deleted successfully" });
    } catch (error) {
      console.error("Error deleting bus:", error);
      res.status(500).json({ message: "Failed to delete bus" });
    }
  });

  // Admin API endpoints
  app.get('/api/admin/users', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      // Get all users (admin only)
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/statistics', authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const [users, routes, buses, tickets] = await Promise.all([
        storage.getAllUsers(),
        storage.getAllRoutes(),
        storage.getAllBuses(),
        storage.getAllTickets()
      ]);

      const activeBuses = buses.filter((bus: IBus) => bus.status === 'active').length;
      const todayTickets = tickets.filter((ticket: ITicket) => {
        if (!ticket.purchaseTime) return false;
        const today = new Date().toDateString();
        return new Date(ticket.purchaseTime).toDateString() === today;
      }).length;

      const todayRevenue = tickets.filter((ticket: ITicket) => {
        if (!ticket.purchaseTime) return false;
        const today = new Date().toDateString();
        return new Date(ticket.purchaseTime).toDateString() === today && ticket.paymentStatus === 'paid';
      }).reduce((sum: number, ticket: ITicket) => sum + (parseFloat(ticket.amount.toString()) || 0), 0);

      res.json({
        totalUsers: users.length,
        totalRoutes: routes.length,
        activeBuses,
        todayTickets,
        todayRevenue: todayRevenue.toFixed(2),
        totalTickets: tickets.length
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Tickets API
  app.get('/api/tickets', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user._id;
      const tickets = await storage.getUserTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.post('/api/tickets', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user._id;
      const validatedData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket({ ...validatedData, userId });
      res.json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating ticket:", error);
      res.status(500).json({ message: "Failed to create ticket" });
    }
  });

  // Live tracking WebSocket
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Live Bus Data API
  app.get("/api/live-bus-locations", getBusLocations);
  app.get("/api/live-routes", getRoutes);

  return server;
}