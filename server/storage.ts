import {
  User,
  Route,
  Stop,
  Bus,
  Ticket,
  RouteStop,
  connectDB,
  type IUser,
  type IRoute,
  type IStop,
  type IBus,
  type ITicket,
  type IRouteStop,
  type UpsertUser,
  type InsertRoute,
  type InsertStop,
  type InsertBus,
  type InsertTicket,
} from "@shared/schema";
import mongoose from 'mongoose';

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<IUser | null>;
  upsertUser(user: UpsertUser): Promise<IUser>;
  
  // Route operations
  getAllRoutes(): Promise<IRoute[]>;
  getRoute(id: string): Promise<IRoute | null>;
  createRoute(route: InsertRoute): Promise<IRoute>;
  updateRoute(id: string, route: Partial<InsertRoute>): Promise<IRoute>;
  deleteRoute(id: string): Promise<void>;
  
  // Stop operations
  getAllStops(): Promise<IStop[]>;
  getStop(id: string): Promise<IStop | null>;
  createStop(stop: InsertStop): Promise<IStop>;
  updateStop(id: string, stop: Partial<InsertStop>): Promise<IStop>;
  deleteStop(id: string): Promise<void>;
  getStopsByRoute(routeId: string): Promise<(IStop & { sequence: number })[]>;
  
  // Bus operations
  getAllBuses(): Promise<IBus[]>;
  getBus(id: string): Promise<IBus | null>;
  createBus(bus: InsertBus): Promise<IBus>;
  updateBus(id: string, bus: Partial<InsertBus>): Promise<IBus>;
  deleteBus(id: string): Promise<void>;
  getBusesByRoute(routeId: string): Promise<IBus[]>;
  updateBusLocation(id: string, latitude: number, longitude: number): Promise<void>;
  
  // Ticket operations
  getAllTickets(): Promise<ITicket[]>;
  getTicket(id: string): Promise<ITicket | null>;
  getUserTickets(userId: string): Promise<ITicket[]>;
  createTicket(ticket: InsertTicket): Promise<ITicket>;
  updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<ITicket>;
  
  // Route-Stop operations
  addStopToRoute(routeId: string, stopId: string, sequence: number): Promise<IRouteStop>;
  removeStopFromRoute(routeId: string, stopId: string): Promise<void>;
}

export class HybridStorage implements IStorage {
  private isMongoConnected = false;
  private memoryData = {
    users: new Map<string, any>(),
    routes: new Map<string, any>(),
    stops: new Map<string, any>(),
    buses: new Map<string, any>(),
    tickets: new Map<string, any>(),
    routeStops: new Map<string, any>(),
  };

  constructor() {
    this.initializeConnection();
    this.initializeMemoryData();
  }

  private async initializeConnection() {
    try {
      await connectDB();
      this.isMongoConnected = mongoose.connection.readyState === 1;
      if (this.isMongoConnected) {
        await this.initializeMockData();
      }
    } catch (error) {
      console.log('Using in-memory storage fallback');
      this.isMongoConnected = false;
    }
  }

  private initializeMemoryData() {
    // Create mock routes
    const route1 = {
      _id: "route-1",
      nameEn: "Arat Kilo ↔ Merkato",
      nameAm: "አራት ኪሎ ↔ መርካቶ",
      nameOm: "Arat Kilo ↔ Merkato",
      startTimeHour: 5,
      startTimeMinute: 30,
      endTimeHour: 22,
      endTimeMinute: 0,
      frequencyMinutes: 7,
      price: 15.00,
      isActive: true,
      createdAt: new Date(),
    };

    const route2 = {
      _id: "route-2",
      nameEn: "Bole ↔ Piassa",
      nameAm: "ቦሌ ↔ ፒያሳ",
      nameOm: "Bole ↔ Piassa",
      startTimeHour: 5,
      startTimeMinute: 45,
      endTimeHour: 21,
      endTimeMinute: 30,
      frequencyMinutes: 8,
      price: 18.00,
      isActive: true,
      createdAt: new Date(),
    };

    const route3 = {
      _id: "route-3",
      nameEn: "Gerji ↔ Stadium",
      nameAm: "ገርጂ ↔ ስታዲየም",
      nameOm: "Gerji ↔ Stadium",
      startTimeHour: 6,
      startTimeMinute: 0,
      endTimeHour: 21,
      endTimeMinute: 0,
      frequencyMinutes: 10,
      price: 20.00,
      isActive: true,
      createdAt: new Date(),
    };

    this.memoryData.routes.set(route1._id, route1);
    this.memoryData.routes.set(route2._id, route2);
    this.memoryData.routes.set(route3._id, route3);

    // Create mock stops
    const stops = [
      { _id: "stop-1", nameEn: "Arat Kilo", nameAm: "አራት ኪሎ", nameOm: "Arat Kilo", latitude: 9.0340, longitude: 38.7600, createdAt: new Date() },
      { _id: "stop-2", nameEn: "Merkato", nameAm: "መርካቶ", nameOm: "Merkato", latitude: 9.0122, longitude: 38.7180, createdAt: new Date() },
      { _id: "stop-3", nameEn: "Bole", nameAm: "ቦሌ", nameOm: "Bole", latitude: 8.9906, longitude: 38.7578, createdAt: new Date() },
      { _id: "stop-4", nameEn: "Piassa", nameAm: "ፒያሣ", nameOm: "Piassa", latitude: 9.0336, longitude: 38.7469, createdAt: new Date() },
    ];

    stops.forEach(stop => {
      this.memoryData.stops.set(stop._id, stop);
    });

    // Create mock buses
    const buses = [
      { 
        _id: "bus-1", 
        plateNumber: "AA-101-001", 
        routeId: "route-1", 
        status: "active", 
        currentLatitude: 9.0340, 
        currentLongitude: 38.7600,
        lastUpdated: new Date(),
        createdAt: new Date()
      },
      { 
        _id: "bus-2", 
        plateNumber: "AA-102-002", 
        routeId: "route-1", 
        status: "active", 
        currentLatitude: 9.0250, 
        currentLongitude: 38.7400,
        lastUpdated: new Date(),
        createdAt: new Date()
      },
      { 
        _id: "bus-3", 
        plateNumber: "AA-201-003", 
        routeId: "route-2", 
        status: "active", 
        currentLatitude: 8.9906, 
        currentLongitude: 38.7578,
        lastUpdated: new Date(),
        createdAt: new Date()
      },
    ];

    buses.forEach(bus => {
      this.memoryData.buses.set(bus._id, bus);
    });
  }

  private async initializeMockData() {
    try {
      // Check if data already exists
      const existingRoutes = await Route.countDocuments();
      if (existingRoutes > 0) return;

      // Create mock routes
      const routes = await Route.insertMany([
        {
          nameEn: "Arat Kilo ↔ Merkato",
          nameAm: "አራት ኪሎ ↔ መርካቶ",
          nameOm: "Arat Kilo ↔ Merkato",
          startTimeHour: 5,
          startTimeMinute: 30,
          endTimeHour: 22,
          endTimeMinute: 0,
          frequencyMinutes: 7,
          price: 15.00,
          isActive: true,
        },
        {
          nameEn: "Bole ↔ Piassa",
          nameAm: "ቦሌ ↔ ፒያሳ",
          nameOm: "Bole ↔ Piassa",
          startTimeHour: 5,
          startTimeMinute: 45,
          endTimeHour: 21,
          endTimeMinute: 30,
          frequencyMinutes: 8,
          price: 18.00,
          isActive: true,
        },
        {
          nameEn: "Gerji ↔ Stadium",
          nameAm: "ገርጂ ↔ ስታዲየም",
          nameOm: "Gerji ↔ Stadium",
          startTimeHour: 6,
          startTimeMinute: 0,
          endTimeHour: 21,
          endTimeMinute: 0,
          frequencyMinutes: 10,
          price: 20.00,
          isActive: true,
        }
      ]);

      // Create mock stops
      await Stop.insertMany([
        { nameEn: "Arat Kilo", nameAm: "አራት ኪሎ", nameOm: "Arat Kilo", latitude: 9.0340, longitude: 38.7600 },
        { nameEn: "Merkato", nameAm: "መርካቶ", nameOm: "Merkato", latitude: 9.0122, longitude: 38.7180 },
        { nameEn: "Bole", nameAm: "ቦሌ", nameOm: "Bole", latitude: 8.9906, longitude: 38.7578 },
        { nameEn: "Piassa", nameAm: "ፒያሳ", nameOm: "Piassa", latitude: 9.0336, longitude: 38.7469 },
      ]);

      // Create mock buses
      await Bus.insertMany([
        {
          plateNumber: "AA-101-001",
          routeId: routes[0]._id.toString(),
          status: "active",
          currentLatitude: 9.0340,
          currentLongitude: 38.7600,
        },
        {
          plateNumber: "AA-102-002",
          routeId: routes[0]._id.toString(),
          status: "active",
          currentLatitude: 9.0250,
          currentLongitude: 38.7400,
        },
        {
          plateNumber: "AA-201-003",
          routeId: routes[1]._id.toString(),
          status: "active",
          currentLatitude: 8.9906,
          currentLongitude: 38.7578,
        },
      ]);

      console.log('Mock data initialized successfully');
    } catch (error) {
      console.log('Failed to initialize MongoDB data, using memory fallback');
    }
  }

  async getUser(id: string): Promise<IUser | null> {
    if (this.isMongoConnected) {
      try {
        return await User.findById(id);
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return this.memoryData.users.get(id) || null;
  }

  async upsertUser(userData: UpsertUser): Promise<IUser> {
    if (this.isMongoConnected) {
      try {
        const { id, ...rest } = userData;
        if (id) {
          const updatedUser = await User.findByIdAndUpdate(id, rest, { new: true, upsert: true });
          return updatedUser!;
        } else {
          const newUser = new User(rest);
          await newUser.save();
          return newUser;
        }
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const id = userData.id || `user-${Date.now()}`;
    const user = { ...userData, _id: id, createdAt: new Date(), updatedAt: new Date() };
    this.memoryData.users.set(id, user);
    return user as IUser;
  }

  async getAllRoutes(): Promise<IRoute[]> {
    if (this.isMongoConnected) {
      try {
        return await Route.find();
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return Array.from(this.memoryData.routes.values());
  }

  async getRoute(id: string): Promise<IRoute | null> {
    if (this.isMongoConnected) {
      try {
        return await Route.findById(id);
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return this.memoryData.routes.get(id) || null;
  }

  async createRoute(route: InsertRoute): Promise<IRoute> {
    if (this.isMongoConnected) {
      try {
        const newRoute = new Route(route);
        await newRoute.save();
        return newRoute;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const id = `route-${Date.now()}`;
    const newRoute = { ...route, _id: id, createdAt: new Date() };
    this.memoryData.routes.set(id, newRoute);
    return newRoute as IRoute;
  }

  async updateRoute(id: string, route: Partial<InsertRoute>): Promise<IRoute> {
    if (this.isMongoConnected) {
      try {
        const updatedRoute = await Route.findByIdAndUpdate(id, route, { new: true });
        if (!updatedRoute) throw new Error("Route not found");
        return updatedRoute;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const existing = this.memoryData.routes.get(id);
    if (!existing) throw new Error("Route not found");
    const updated = { ...existing, ...route };
    this.memoryData.routes.set(id, updated);
    return updated;
  }

  async deleteRoute(id: string): Promise<void> {
    if (this.isMongoConnected) {
      try {
        await Route.findByIdAndDelete(id);
        return;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    this.memoryData.routes.delete(id);
  }

  async getAllStops(): Promise<IStop[]> {
    if (this.isMongoConnected) {
      try {
        return await Stop.find();
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return Array.from(this.memoryData.stops.values());
  }

  async getStop(id: string): Promise<IStop | null> {
    if (this.isMongoConnected) {
      try {
        return await Stop.findById(id);
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return this.memoryData.stops.get(id) || null;
  }

  async createStop(stop: InsertStop): Promise<IStop> {
    if (this.isMongoConnected) {
      try {
        const newStop = new Stop(stop);
        await newStop.save();
        return newStop;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const id = `stop-${Date.now()}`;
    const newStop = { ...stop, _id: id, createdAt: new Date() };
    this.memoryData.stops.set(id, newStop);
    return newStop as IStop;
  }

  async updateStop(id: string, stop: Partial<InsertStop>): Promise<IStop> {
    if (this.isMongoConnected) {
      try {
        const updatedStop = await Stop.findByIdAndUpdate(id, stop, { new: true });
        if (!updatedStop) throw new Error("Stop not found");
        return updatedStop;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const existing = this.memoryData.stops.get(id);
    if (!existing) throw new Error("Stop not found");
    const updated = { ...existing, ...stop };
    this.memoryData.stops.set(id, updated);
    return updated;
  }

  async deleteStop(id: string): Promise<void> {
    if (this.isMongoConnected) {
      try {
        await Stop.findByIdAndDelete(id);
        return;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    this.memoryData.stops.delete(id);
  }

  async getStopsByRoute(routeId: string): Promise<(IStop & { sequence: number })[]> {
    if (this.isMongoConnected) {
      try {
        const routeStops = await RouteStop.find({ routeId }).sort({ sequence: 1 });
        const stopsWithSequence: (IStop & { sequence: number })[] = [];
        
        for (const rs of routeStops) {
          const stop = await Stop.findById(rs.stopId);
          if (stop) {
            stopsWithSequence.push({ ...stop.toObject() as IStop, sequence: rs.sequence });
          }
        }
        
        return stopsWithSequence;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback - return empty for now, can be enhanced
    return [];
  }

  async getAllBuses(): Promise<IBus[]> {
    if (this.isMongoConnected) {
      try {
        return await Bus.find();
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return Array.from(this.memoryData.buses.values());
  }

  async getBus(id: string): Promise<IBus | null> {
    if (this.isMongoConnected) {
      try {
        return await Bus.findById(id);
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return this.memoryData.buses.get(id) || null;
  }

  async createBus(bus: InsertBus): Promise<IBus> {
    if (this.isMongoConnected) {
      try {
        const newBus = new Bus(bus);
        await newBus.save();
        return newBus;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const id = `bus-${Date.now()}`;
    const newBus = { ...bus, _id: id, lastUpdated: new Date(), createdAt: new Date() };
    this.memoryData.buses.set(id, newBus);
    return newBus as IBus;
  }

  async updateBus(id: string, bus: Partial<InsertBus>): Promise<IBus> {
    if (this.isMongoConnected) {
      try {
        const updatedBus = await Bus.findByIdAndUpdate(id, { ...bus, lastUpdated: new Date() }, { new: true });
        if (!updatedBus) throw new Error("Bus not found");
        return updatedBus;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const existing = this.memoryData.buses.get(id);
    if (!existing) throw new Error("Bus not found");
    const updated = { ...existing, ...bus, lastUpdated: new Date() };
    this.memoryData.buses.set(id, updated);
    return updated;
  }

  async deleteBus(id: string): Promise<void> {
    if (this.isMongoConnected) {
      try {
        await Bus.findByIdAndDelete(id);
        return;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    this.memoryData.buses.delete(id);
  }

  async getBusesByRoute(routeId: string): Promise<IBus[]> {
    if (this.isMongoConnected) {
      try {
        return await Bus.find({ routeId });
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return Array.from(this.memoryData.buses.values()).filter((bus: any) => bus.routeId === routeId);
  }

  async updateBusLocation(id: string, latitude: number, longitude: number): Promise<void> {
    if (this.isMongoConnected) {
      try {
        await Bus.findByIdAndUpdate(id, {
          currentLatitude: latitude,
          currentLongitude: longitude,
          lastUpdated: new Date(),
        });
        return;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const bus = this.memoryData.buses.get(id);
    if (bus) {
      bus.currentLatitude = latitude;
      bus.currentLongitude = longitude;
      bus.lastUpdated = new Date();
      this.memoryData.buses.set(id, bus);
    }
  }

  async getAllTickets(): Promise<ITicket[]> {
    if (this.isMongoConnected) {
      try {
        return await Ticket.find();
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return Array.from(this.memoryData.tickets.values());
  }

  async getTicket(id: string): Promise<ITicket | null> {
    if (this.isMongoConnected) {
      try {
        return await Ticket.findById(id);
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return this.memoryData.tickets.get(id) || null;
  }

  async getUserTickets(userId: string): Promise<ITicket[]> {
    if (this.isMongoConnected) {
      try {
        return await Ticket.find({ userId });
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    return Array.from(this.memoryData.tickets.values()).filter((ticket: any) => ticket.userId === userId);
  }

  async createTicket(ticket: InsertTicket): Promise<ITicket> {
    if (this.isMongoConnected) {
      try {
        const newTicket = new Ticket(ticket);
        await newTicket.save();
        return newTicket;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const id = `ticket-${Date.now()}`;
    const newTicket = { ...ticket, _id: id, purchaseTime: new Date(), createdAt: new Date() };
    this.memoryData.tickets.set(id, newTicket);
    return newTicket as ITicket;
  }

  async updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<ITicket> {
    if (this.isMongoConnected) {
      try {
        const updatedTicket = await Ticket.findByIdAndUpdate(id, ticket, { new: true });
        if (!updatedTicket) throw new Error("Ticket not found");
        return updatedTicket;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const existing = this.memoryData.tickets.get(id);
    if (!existing) throw new Error("Ticket not found");
    const updated = { ...existing, ...ticket };
    this.memoryData.tickets.set(id, updated);
    return updated;
  }

  async addStopToRoute(routeId: string, stopId: string, sequence: number): Promise<IRouteStop> {
    if (this.isMongoConnected) {
      try {
        const routeStop = new RouteStop({ routeId, stopId, sequence });
        await routeStop.save();
        return routeStop;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const id = `routestop-${Date.now()}`;
    const routeStop = { _id: id, routeId, stopId, sequence };
    this.memoryData.routeStops.set(id, routeStop);
    return routeStop as IRouteStop;
  }

  async removeStopFromRoute(routeId: string, stopId: string): Promise<void> {
    if (this.isMongoConnected) {
      try {
        await RouteStop.findOneAndDelete({ routeId, stopId });
        return;
      } catch (error) {
        console.log('MongoDB error, falling back to memory');
      }
    }
    
    // Memory fallback
    const entries = Array.from(this.memoryData.routeStops.entries());
    for (const [id, routeStop] of entries) {
      if ((routeStop as any).routeId === routeId && (routeStop as any).stopId === stopId) {
        this.memoryData.routeStops.delete(id);
        break;
      }
    }
  }
}

export const storage = new HybridStorage();