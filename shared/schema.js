"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertTicketSchema = exports.insertBusSchema = exports.insertStopSchema = exports.insertRouteSchema = exports.insertUserSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = exports.Session = exports.Ticket = exports.Bus = exports.RouteStop = exports.Stop = exports.Route = exports.User = exports.connectDB = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const zod_1 = require("zod");
// MongoDB connection
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/addis-bus';
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection failed, using in-memory fallback:', error);
        // Continue without MongoDB - the storage will handle this gracefully
    }
};
exports.connectDB = connectDB;
const userSchema = new mongoose_1.Schema({
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
exports.User = mongoose_1.default.model('User', userSchema);
const routeSchema = new mongoose_1.Schema({
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
exports.Route = mongoose_1.default.model('Route', routeSchema);
const stopSchema = new mongoose_1.Schema({
    nameEn: { type: String, required: true },
    nameAm: { type: String, required: true },
    nameOm: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
}, { timestamps: true });
exports.Stop = mongoose_1.default.model('Stop', stopSchema);
const routeStopSchema = new mongoose_1.Schema({
    routeId: { type: String, required: true, ref: 'Route' },
    stopId: { type: String, required: true, ref: 'Stop' },
    sequence: { type: Number, required: true },
});
exports.RouteStop = mongoose_1.default.model('RouteStop', routeStopSchema);
const busSchema = new mongoose_1.Schema({
    plateNumber: { type: String, required: true, unique: true },
    routeId: { type: String, ref: 'Route' },
    driverId: { type: String, ref: 'User' },
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
    currentLatitude: Number,
    currentLongitude: Number,
    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });
exports.Bus = mongoose_1.default.model('Bus', busSchema);
const ticketSchema = new mongoose_1.Schema({
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
exports.Ticket = mongoose_1.default.model('Ticket', ticketSchema);
const sessionSchema = new mongoose_1.Schema({
    sid: { type: String, required: true, unique: true },
    sess: { type: mongoose_1.Schema.Types.Mixed, required: true },
    expire: { type: Date, required: true, index: true },
});
exports.Session = mongoose_1.default.model('Session', sessionSchema);
// Authentication Schemas
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    preferredLanguage: zod_1.z.enum(['en', 'am', 'om']).default('en'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string(),
    password: zod_1.z.string().min(6),
});
// Validation Schemas
exports.insertUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    profileImageUrl: zod_1.z.string().optional(),
    role: zod_1.z.enum(['passenger', 'admin']).optional(),
    preferredLanguage: zod_1.z.enum(['en', 'am', 'om']).optional(),
});
exports.insertRouteSchema = zod_1.z.object({
    nameEn: zod_1.z.string().min(1),
    nameAm: zod_1.z.string().min(1),
    nameOm: zod_1.z.string().min(1),
    startTimeHour: zod_1.z.number().min(0).max(23),
    startTimeMinute: zod_1.z.number().min(0).max(59),
    endTimeHour: zod_1.z.number().min(0).max(23),
    endTimeMinute: zod_1.z.number().min(0).max(59),
    frequencyMinutes: zod_1.z.number().min(1),
    price: zod_1.z.number().positive(),
    isActive: zod_1.z.boolean().optional(),
});
exports.insertStopSchema = zod_1.z.object({
    nameEn: zod_1.z.string().min(1),
    nameAm: zod_1.z.string().min(1),
    nameOm: zod_1.z.string().min(1),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
});
exports.insertBusSchema = zod_1.z.object({
    plateNumber: zod_1.z.string().min(1),
    routeId: zod_1.z.string().optional(),
    driverId: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'inactive', 'maintenance']).optional(),
    currentLatitude: zod_1.z.number().optional(),
    currentLongitude: zod_1.z.number().optional(),
});
exports.insertTicketSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    routeId: zod_1.z.string(),
    busId: zod_1.z.string().optional(),
    validUntil: zod_1.z.date(),
    qrCodeData: zod_1.z.string(),
    paymentStatus: zod_1.z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
    paymentMethod: zod_1.z.enum(['telebirr', 'cbe', 'card', 'hellocash']).optional(),
    amount: zod_1.z.number().positive(),
});
// User Schema
exports.insertUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    preferredLanguage: zod_1.z.enum(['en', 'am', 'om']).default('en'),
    role: zod_1.z.enum(['passenger', 'admin']).default('passenger'),
    profileImageUrl: zod_1.z.string().optional(),
    passwordResetToken: zod_1.z.string().optional(),
    passwordResetExpires: zod_1.z.date().optional()
});
