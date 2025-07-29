import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertRouteSchema, insertStopSchema, insertBusSchema, insertTicketSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
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

  app.post('/api/routes', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

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

  // Stops API
  app.get('/api/stops', async (req, res) => {
    try {
      const stops = await storage.getAllStops();
      res.json(stops);
    } catch (error) {
      console.error("Error fetching stops:", error);
      res.status(500).json({ message: "Failed to fetch stops" });
    }
  });

  app.post('/api/stops', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

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

  app.get('/api/buses/:id/location', async (req, res) => {
    try {
      const bus = await storage.getBus(req.params.id);
      if (!bus) {
        return res.status(404).json({ message: "Bus not found" });
      }
      res.json({
        id: bus._id,
        latitude: bus.currentLatitude,
        longitude: bus.currentLongitude,
        lastUpdated: bus.lastUpdated,
      });
    } catch (error) {
      console.error("Error fetching bus location:", error);
      res.status(500).json({ message: "Failed to fetch bus location" });
    }
  });

  app.post('/api/buses', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

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

  app.put('/api/buses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const bus = await storage.updateBus(req.params.id, req.body);
      res.json(bus);
    } catch (error) {
      console.error("Error updating bus:", error);
      res.status(500).json({ message: "Failed to update bus" });
    }
  });

  // Tickets API
  app.get('/api/tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tickets = await storage.getUserTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.get('/api/tickets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const ticket = await storage.getTicket(req.params.id);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const userId = req.user.claims.sub;
      if (ticket.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(ticket);
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res.status(500).json({ message: "Failed to fetch ticket" });
    }
  });

  app.post('/api/tickets/purchase', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ticketData = {
        ...req.body,
        userId,
        qrCodeData: `TICKET_${Date.now()}_${userId}`,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // Valid for 24 hours
      };

      const validatedData = insertTicketSchema.parse(ticketData);
      const ticket = await storage.createTicket(validatedData);

      // Simulate payment processing
      setTimeout(async () => {
        await storage.updateTicket(ticket.id, { paymentStatus: "paid" });
      }, 2000);

      res.json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error purchasing ticket:", error);
      res.status(500).json({ message: "Failed to purchase ticket" });
    }
  });

  // Admin routes
  app.get('/api/admin/buses', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const buses = await storage.getAllBuses();
      res.json(buses);
    } catch (error) {
      console.error("Error fetching admin buses:", error);
      res.status(500).json({ message: "Failed to fetch buses" });
    }
  });

  app.get('/api/admin/payments', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const tickets = await storage.getAllTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time bus tracking
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    // Send initial bus locations
    storage.getAllBuses().then(buses => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'bus_locations',
          data: buses.map(bus => ({
            id: bus._id,
            plateNumber: bus.plateNumber,
            routeId: bus.routeId,
            latitude: bus.currentLatitude,
            longitude: bus.currentLongitude,
            lastUpdated: bus.lastUpdated,
          }))
        }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Simulate bus movement for demo purposes
  setInterval(async () => {
    const buses = await storage.getAllBuses();
    for (const bus of buses) {
      if (bus.currentLatitude && bus.currentLongitude) {
        // Simulate small movement
        const lat = bus.currentLatitude + (Math.random() - 0.5) * 0.001;
        const lng = bus.currentLongitude + (Math.random() - 0.5) * 0.001;
        
        await storage.updateBusLocation(bus._id, lat, lng);
      }
    }

    // Broadcast updated locations to all connected clients
    const updatedBuses = await storage.getAllBuses();
    const message = JSON.stringify({
      type: 'bus_locations',
      data: updatedBuses.map(bus => ({
        id: bus._id,
        plateNumber: bus.plateNumber,
        routeId: bus.routeId,
        latitude: bus.currentLatitude,
        longitude: bus.currentLongitude,
        lastUpdated: bus.lastUpdated,
      }))
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }, 5000); // Update every 5 seconds

  return httpServer;
}
