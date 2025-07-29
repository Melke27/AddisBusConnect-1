import {
  users,
  routes,
  stops,
  buses,
  tickets,
  routeStops,
  type User,
  type UpsertUser,
  type Route,
  type InsertRoute,
  type Stop,
  type InsertStop,
  type Bus,
  type InsertBus,
  type Ticket,
  type InsertTicket,
  type RouteStop,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Route operations
  getAllRoutes(): Promise<Route[]>;
  getRoute(id: string): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;
  updateRoute(id: string, route: Partial<InsertRoute>): Promise<Route>;
  deleteRoute(id: string): Promise<void>;
  
  // Stop operations
  getAllStops(): Promise<Stop[]>;
  getStop(id: string): Promise<Stop | undefined>;
  createStop(stop: InsertStop): Promise<Stop>;
  updateStop(id: string, stop: Partial<InsertStop>): Promise<Stop>;
  deleteStop(id: string): Promise<void>;
  getStopsByRoute(routeId: string): Promise<(Stop & { sequence: number })[]>;
  
  // Bus operations
  getAllBuses(): Promise<Bus[]>;
  getBus(id: string): Promise<Bus | undefined>;
  createBus(bus: InsertBus): Promise<Bus>;
  updateBus(id: string, bus: Partial<InsertBus>): Promise<Bus>;
  deleteBus(id: string): Promise<void>;
  getBusesByRoute(routeId: string): Promise<Bus[]>;
  updateBusLocation(id: string, latitude: number, longitude: number): Promise<void>;
  
  // Ticket operations
  getAllTickets(): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  getUserTickets(userId: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<Ticket>;
  
  // Route-Stop operations
  addStopToRoute(routeId: string, stopId: string, sequence: number): Promise<RouteStop>;
  removeStopFromRoute(routeId: string, stopId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private routes: Map<string, Route> = new Map();
  private stops: Map<string, Stop> = new Map();
  private buses: Map<string, Bus> = new Map();
  private tickets: Map<string, Ticket> = new Map();
  private routeStops: Map<string, RouteStop> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock routes
    const route1: Route = {
      id: "route-1",
      nameEn: "Arat Kilo ↔ Merkato",
      nameAm: "አራት ኪሎ ↔ መርካቶ",
      nameOm: "Arat Kilo ↔ Merkato",
      startTimeHour: 5,
      startTimeMinute: 30,
      endTimeHour: 22,
      endTimeMinute: 0,
      frequencyMinutes: 7,
      price: "15.00",
      isActive: true,
      createdAt: new Date(),
    };

    const route2: Route = {
      id: "route-2",
      nameEn: "Bole ↔ Piassa",
      nameAm: "ቦሌ ↔ ፒያሳ",
      nameOm: "Bole ↔ Piassa",
      startTimeHour: 5,
      startTimeMinute: 45,
      endTimeHour: 21,
      endTimeMinute: 30,
      frequencyMinutes: 8,
      price: "18.00",
      isActive: true,
      createdAt: new Date(),
    };

    const route3: Route = {
      id: "route-3",
      nameEn: "Gerji ↔ Stadium",
      nameAm: "ገርጂ ↔ ስታዲየም",
      nameOm: "Gerji ↔ Stadium",
      startTimeHour: 6,
      startTimeMinute: 0,
      endTimeHour: 21,
      endTimeMinute: 0,
      frequencyMinutes: 10,
      price: "20.00",
      isActive: true,
      createdAt: new Date(),
    };

    this.routes.set(route1.id, route1);
    this.routes.set(route2.id, route2);
    this.routes.set(route3.id, route3);

    // Create mock stops
    const stops = [
      { id: "stop-1", nameEn: "Arat Kilo", nameAm: "አራት ኪሎ", nameOm: "Arat Kilo", latitude: "9.0340", longitude: "38.7600" },
      { id: "stop-2", nameEn: "Merkato", nameAm: "መርካቶ", nameOm: "Merkato", latitude: "9.0122", longitude: "38.7180" },
      { id: "stop-3", nameEn: "Bole", nameAm: "ቦሌ", nameOm: "Bole", latitude: "8.9906", longitude: "38.7578" },
      { id: "stop-4", nameEn: "Piassa", nameAm: "ፒያሳ", nameOm: "Piassa", latitude: "9.0336", longitude: "38.7469" },
    ];

    stops.forEach(stop => {
      this.stops.set(stop.id, { ...stop, createdAt: new Date() });
    });

    // Create mock buses
    const buses = [
      { id: "bus-1", plateNumber: "AA-101-001", routeId: "route-1", status: "active" as const, currentLatitude: "9.0340", currentLongitude: "38.7600" },
      { id: "bus-2", plateNumber: "AA-102-002", routeId: "route-1", status: "active" as const, currentLatitude: "9.0250", currentLongitude: "38.7400" },
      { id: "bus-3", plateNumber: "AA-201-003", routeId: "route-2", status: "active" as const, currentLatitude: "8.9906", currentLongitude: "38.7578" },
    ];

    buses.forEach(bus => {
      this.buses.set(bus.id, { 
        ...bus, 
        driverId: null,
        lastUpdated: new Date(),
        createdAt: new Date() 
      });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || randomUUID();
    const user: User = {
      ...userData,
      id,
      role: userData.role || "passenger",
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAllRoutes(): Promise<Route[]> {
    return Array.from(this.routes.values());
  }

  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const id = randomUUID();
    const newRoute: Route = {
      ...route,
      id,
      isActive: route.isActive || true,
      createdAt: new Date(),
    };
    this.routes.set(id, newRoute);
    return newRoute;
  }

  async updateRoute(id: string, route: Partial<InsertRoute>): Promise<Route> {
    const existing = this.routes.get(id);
    if (!existing) throw new Error("Route not found");
    
    const updated: Route = { ...existing, ...route };
    this.routes.set(id, updated);
    return updated;
  }

  async deleteRoute(id: string): Promise<void> {
    this.routes.delete(id);
  }

  async getAllStops(): Promise<Stop[]> {
    return Array.from(this.stops.values());
  }

  async getStop(id: string): Promise<Stop | undefined> {
    return this.stops.get(id);
  }

  async createStop(stop: InsertStop): Promise<Stop> {
    const id = randomUUID();
    const newStop: Stop = {
      ...stop,
      id,
      createdAt: new Date(),
    };
    this.stops.set(id, newStop);
    return newStop;
  }

  async updateStop(id: string, stop: Partial<InsertStop>): Promise<Stop> {
    const existing = this.stops.get(id);
    if (!existing) throw new Error("Stop not found");
    
    const updated: Stop = { ...existing, ...stop };
    this.stops.set(id, updated);
    return updated;
  }

  async deleteStop(id: string): Promise<void> {
    this.stops.delete(id);
  }

  async getStopsByRoute(routeId: string): Promise<(Stop & { sequence: number })[]> {
    const routeStopEntries = Array.from(this.routeStops.values())
      .filter(rs => rs.routeId === routeId)
      .sort((a, b) => a.sequence - b.sequence);

    return routeStopEntries.map(rs => {
      const stop = this.stops.get(rs.stopId);
      if (!stop) throw new Error("Stop not found");
      return { ...stop, sequence: rs.sequence };
    });
  }

  async getAllBuses(): Promise<Bus[]> {
    return Array.from(this.buses.values());
  }

  async getBus(id: string): Promise<Bus | undefined> {
    return this.buses.get(id);
  }

  async createBus(bus: InsertBus): Promise<Bus> {
    const id = randomUUID();
    const newBus: Bus = {
      ...bus,
      id,
      status: bus.status || "active",
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    this.buses.set(id, newBus);
    return newBus;
  }

  async updateBus(id: string, bus: Partial<InsertBus>): Promise<Bus> {
    const existing = this.buses.get(id);
    if (!existing) throw new Error("Bus not found");
    
    const updated: Bus = { 
      ...existing, 
      ...bus,
      lastUpdated: new Date(),
    };
    this.buses.set(id, updated);
    return updated;
  }

  async deleteBus(id: string): Promise<void> {
    this.buses.delete(id);
  }

  async getBusesByRoute(routeId: string): Promise<Bus[]> {
    return Array.from(this.buses.values()).filter(bus => bus.routeId === routeId);
  }

  async updateBusLocation(id: string, latitude: number, longitude: number): Promise<void> {
    const bus = this.buses.get(id);
    if (!bus) throw new Error("Bus not found");
    
    const updated: Bus = {
      ...bus,
      currentLatitude: latitude.toString(),
      currentLongitude: longitude.toString(),
      lastUpdated: new Date(),
    };
    this.buses.set(id, updated);
  }

  async getAllTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async getUserTickets(userId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.userId === userId);
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const newTicket: Ticket = {
      ...ticket,
      id,
      busId: ticket.busId || null,
      paymentStatus: ticket.paymentStatus || "pending",
      paymentMethod: ticket.paymentMethod || null,
      purchaseTime: new Date(),
      createdAt: new Date(),
    };
    this.tickets.set(id, newTicket);
    return newTicket;
  }

  async updateTicket(id: string, ticket: Partial<InsertTicket>): Promise<Ticket> {
    const existing = this.tickets.get(id);
    if (!existing) throw new Error("Ticket not found");
    
    const updated: Ticket = { ...existing, ...ticket };
    this.tickets.set(id, updated);
    return updated;
  }

  async addStopToRoute(routeId: string, stopId: string, sequence: number): Promise<RouteStop> {
    const id = randomUUID();
    const routeStop: RouteStop = {
      id,
      routeId,
      stopId,
      sequence,
    };
    this.routeStops.set(id, routeStop);
    return routeStop;
  }

  async removeStopFromRoute(routeId: string, stopId: string): Promise<void> {
    const entries = Array.from(this.routeStops.entries());
    for (const [id, routeStop] of entries) {
      if (routeStop.routeId === routeId && routeStop.stopId === stopId) {
        this.routeStops.delete(id);
        break;
      }
    }
  }
}

export const storage = new MemStorage();
