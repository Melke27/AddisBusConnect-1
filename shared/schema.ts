import mongoose, { Schema, Document } from 'mongoose';
import { z } from "zod";

// MongoDB connection
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/addis-bus';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed, using in-memory fallback:', error);
    // Continue without MongoDB - the storage will handle this gracefully
  }
};

// User Interface and Schema
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  role: 'passenger' | 'admin';
  preferredLanguage: 'en' | 'am' | 'om';
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profileImageUrl: String,
  role: { type: String, enum: ['passenger', 'admin'], default: 'passenger' },
  preferredLanguage: { type: String, enum: ['en', 'am', 'om'], default: 'en' },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);

// Route Interface and Schema
export interface IRoute extends Document {
  _id: string;
  nameEn: string;
  nameAm: string;
  nameOm: string;
  startTimeHour: number;
  startTimeMinute: number;
  endTimeHour: number;
  endTimeMinute: number;
  frequencyMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: Date;
}

const routeSchema = new Schema<IRoute>({
  nameEn: { type: String, required: true },
  nameAm: { type: String, required: true },
  nameOm: { type: String, required: true },
  startTimeHour: { type: Number, required: true },
  startTimeMinute: { type: Number, required: true },
  endTimeHour: { type: Number, required: true },
  endTimeMinute: { type: Number, required: true },
  frequencyMinutes: { type: Number, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Route = mongoose.model<IRoute>('Route', routeSchema);

// Stop Interface and Schema
export interface IStop extends Document {
  _id: string;
  nameEn: string;
  nameAm: string;
  nameOm: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

const stopSchema = new Schema<IStop>({
  nameEn: { type: String, required: true },
  nameAm: { type: String, required: true },
  nameOm: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
}, { timestamps: true });

export const Stop = mongoose.model<IStop>('Stop', stopSchema);

// Route Stops Interface and Schema
export interface IRouteStop extends Document {
  _id: string;
  routeId: string;
  stopId: string;
  sequence: number;
}

const routeStopSchema = new Schema<IRouteStop>({
  routeId: { type: String, required: true, ref: 'Route' },
  stopId: { type: String, required: true, ref: 'Stop' },
  sequence: { type: Number, required: true },
});

export const RouteStop = mongoose.model<IRouteStop>('RouteStop', routeStopSchema);

// Bus Interface and Schema
export interface IBus extends Document {
  _id: string;
  plateNumber: string;
  routeId?: string;
  driverId?: string;
  status: 'active' | 'inactive' | 'maintenance';
  currentLatitude?: number;
  currentLongitude?: number;
  lastUpdated: Date;
  createdAt: Date;
}

const busSchema = new Schema<IBus>({
  plateNumber: { type: String, required: true, unique: true },
  routeId: { type: String, ref: 'Route' },
  driverId: { type: String, ref: 'User' },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  currentLatitude: Number,
  currentLongitude: Number,
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

export const Bus = mongoose.model<IBus>('Bus', busSchema);

// Ticket Interface and Schema
export interface ITicket extends Document {
  _id: string;
  userId: string;
  routeId: string;
  busId?: string;
  purchaseTime: Date;
  validUntil: Date;
  qrCodeData: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'telebirr' | 'cbe' | 'card' | 'hellocash';
  amount: number;
  createdAt: Date;
}

const ticketSchema = new Schema<ITicket>({
  userId: { type: String, required: true, ref: 'User' },
  routeId: { type: String, required: true, ref: 'Route' },
  busId: { type: String, ref: 'Bus' },
  purchaseTime: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  qrCodeData: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['telebirr', 'cbe', 'card', 'hellocash'] },
  amount: { type: Number, required: true },
}, { timestamps: true });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);

// Session Interface and Schema (for authentication)
export interface ISession extends Document {
  _id: string;
  sid: string;
  sess: any;
  expire: Date;
}

const sessionSchema = new Schema<ISession>({
  sid: { type: String, required: true, unique: true },
  sess: { type: Schema.Types.Mixed, required: true },
  expire: { type: Date, required: true, index: true },
});

export const Session = mongoose.model<ISession>('Session', sessionSchema);

// Authentication Schemas
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  preferredLanguage: z.enum(['en', 'am', 'om']).default('en'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
});

// Validation Schemas
export const insertUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
  role: z.enum(['passenger', 'admin']).optional(),
  preferredLanguage: z.enum(['en', 'am', 'om']).optional(),
});

export const insertRouteSchema = z.object({
  nameEn: z.string().min(1),
  nameAm: z.string().min(1),
  nameOm: z.string().min(1),
  startTimeHour: z.number().min(0).max(23),
  startTimeMinute: z.number().min(0).max(59),
  endTimeHour: z.number().min(0).max(23),
  endTimeMinute: z.number().min(0).max(59),
  frequencyMinutes: z.number().min(1),
  price: z.number().positive(),
  isActive: z.boolean().optional(),
});

export const insertStopSchema = z.object({
  nameEn: z.string().min(1),
  nameAm: z.string().min(1),
  nameOm: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

export const insertBusSchema = z.object({
  plateNumber: z.string().min(1),
  routeId: z.string().optional(),
  driverId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  currentLatitude: z.number().optional(),
  currentLongitude: z.number().optional(),
});

export const insertTicketSchema = z.object({
  userId: z.string(),
  routeId: z.string(),
  busId: z.string().optional(),
  validUntil: z.date(),
  qrCodeData: z.string(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  paymentMethod: z.enum(['telebirr', 'cbe', 'card', 'hellocash']).optional(),
  amount: z.number().positive(),
});

// User Schema
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  preferredLanguage: z.enum(['en', 'am', 'om']).default('en'),
  role: z.enum(['passenger', 'admin']).default('passenger'),
  profileImageUrl: z.string().optional(),
  passwordResetToken: z.string().optional(),
  passwordResetExpires: z.date().optional()
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema> & { id?: string };
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type InsertStop = z.infer<typeof insertStopSchema>;
export type InsertBus = z.infer<typeof insertBusSchema>;
export type InsertTicket = z.infer<typeof insertTicketSchema>;