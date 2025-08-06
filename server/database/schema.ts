import { pgTable, text, integer, decimal, boolean, timestamp, uuid, point, jsonb, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  preferredLanguage: text('preferred_language').default('am'), // am, en, om
  profileImage: text('profile_image'),
  isActive: boolean('is_active').default(true),
  role: text('role').default('passenger'), // passenger, admin, driver
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Bus companies table
export const companies = pgTable('companies', {
  id: text('id').primaryKey(), // anbessa, sheger
  nameEn: text('name_en').notNull(),
  nameAm: text('name_am').notNull(),
  nameOm: text('name_om').notNull(),
  logo: text('logo'),
  color: text('color').notNull(),
  contactPhone: text('contact_phone'),
  contactEmail: text('contact_email'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Routes table
export const routes = pgTable('routes', {
  id: text('id').primaryKey(),
  companyId: text('company_id').references(() => companies.id).notNull(),
  nameEn: text('name_en').notNull(),
  nameAm: text('name_am').notNull(),
  nameOm: text('name_om').notNull(),
  startPointName: text('start_point_name').notNull(),
  startPointNameAm: text('start_point_name_am').notNull(),
  startPointCoords: point('start_point_coords').notNull(),
  endPointName: text('end_point_name').notNull(),
  endPointNameAm: text('end_point_name_am').notNull(),
  endPointCoords: point('end_point_coords').notNull(),
  distance: decimal('distance', { precision: 5, scale: 2 }), // in km
  estimatedDuration: integer('estimated_duration'), // in minutes
  price: decimal('price', { precision: 6, scale: 2 }).notNull(),
  frequency: integer('frequency').notNull(), // minutes between buses
  startTime: text('start_time').notNull(), // HH:MM
  endTime: text('end_time').notNull(), // HH:MM
  color: text('color').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Bus stops table
export const stops = pgTable('stops', {
  id: uuid('id').primaryKey().defaultRandom(),
  routeId: text('route_id').references(() => routes.id).notNull(),
  name: text('name').notNull(),
  nameAm: text('name_am').notNull(),
  nameOm: text('name_om'),
  coordinates: point('coordinates').notNull(),
  order: integer('order').notNull(),
  landmarks: text('landmarks').array(),
  facilities: text('facilities').array(), // ['shelter', 'bench', 'lighting']
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Buses table
export const buses = pgTable('buses', {
  id: uuid('id').primaryKey().defaultRandom(),
  routeId: text('route_id').references(() => routes.id).notNull(),
  plateNumber: text('plate_number').unique().notNull(),
  capacity: integer('capacity').notNull(),
  currentCapacity: integer('current_capacity').default(0),
  currentLocation: point('current_location'),
  currentStopId: uuid('current_stop_id').references(() => stops.id),
  nextStopId: uuid('next_stop_id').references(() => stops.id),
  speed: decimal('speed', { precision: 5, scale: 2 }), // km/h
  heading: integer('heading'), // degrees 0-360
  estimatedArrival: integer('estimated_arrival'), // minutes to next stop
  status: text('status').default('active'), // active, maintenance, out_of_service
  driverName: text('driver_name'),
  driverPhone: text('driver_phone'),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Tickets table
export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  routeId: text('route_id').references(() => routes.id).notNull(),
  fromStopId: uuid('from_stop_id').references(() => stops.id),
  toStopId: uuid('to_stop_id').references(() => stops.id),
  qrCode: text('qr_code').unique().notNull(),
  amount: decimal('amount', { precision: 6, scale: 2 }).notNull(),
  paymentMethod: text('payment_method').notNull(), // telebirr, cbe_birr, card, cash
  paymentId: text('payment_id'),
  status: text('status').default('active'), // active, used, expired, cancelled
  validFrom: timestamp('valid_from').notNull(),
  validUntil: timestamp('valid_until').notNull(),
  usedAt: timestamp('used_at'),
  busId: uuid('bus_id').references(() => buses.id),
  metadata: jsonb('metadata'), // additional ticket info
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Real-time tracking table
export const busTracking = pgTable('bus_tracking', {
  id: serial('id').primaryKey(),
  busId: uuid('bus_id').references(() => buses.id).notNull(),
  coordinates: point('coordinates').notNull(),
  speed: decimal('speed', { precision: 5, scale: 2 }),
  heading: integer('heading'),
  passengers: integer('passengers').default(0),
  timestamp: timestamp('timestamp').defaultNow().notNull()
});

// Feedback table
export const feedback = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  routeId: text('route_id').references(() => routes.id),
  busId: uuid('bus_id').references(() => buses.id),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  category: text('category'), // cleanliness, punctuality, driver, comfort
  isAnonymous: boolean('is_anonymous').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  routes: many(routes)
}));

export const routesRelations = relations(routes, ({ one, many }) => ({
  company: one(companies, {
    fields: [routes.companyId],
    references: [companies.id]
  }),
  stops: many(stops),
  buses: many(buses),
  tickets: many(tickets)
}));

export const stopsRelations = relations(stops, ({ one }) => ({
  route: one(routes, {
    fields: [stops.routeId],
    references: [routes.id]
  })
}));

export const busesRelations = relations(buses, ({ one, many }) => ({
  route: one(routes, {
    fields: [buses.routeId],
    references: [routes.id]
  }),
  currentStop: one(stops, {
    fields: [buses.currentStopId],
    references: [stops.id]
  }),
  nextStop: one(stops, {
    fields: [buses.nextStopId],
    references: [stops.id]
  }),
  tickets: many(tickets),
  tracking: many(busTracking)
}));

export const usersRelations = relations(users, ({ many }) => ({
  tickets: many(tickets),
  feedback: many(feedback)
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  user: one(users, {
    fields: [tickets.userId],
    references: [users.id]
  }),
  route: one(routes, {
    fields: [tickets.routeId],
    references: [routes.id]
  }),
  fromStop: one(stops, {
    fields: [tickets.fromStopId],
    references: [stops.id]
  }),
  toStop: one(stops, {
    fields: [tickets.toStopId],
    references: [stops.id]
  }),
  bus: one(buses, {
    fields: [tickets.busId],
    references: [buses.id]
  })
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;

export const insertRouteSchema = createInsertSchema(routes);
export const selectRouteSchema = createSelectSchema(routes);
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type SelectRoute = z.infer<typeof selectRouteSchema>;

export const insertBusSchema = createInsertSchema(buses);
export const selectBusSchema = createSelectSchema(buses);
export type InsertBus = z.infer<typeof insertBusSchema>;
export type SelectBus = z.infer<typeof selectBusSchema>;

export const insertTicketSchema = createInsertSchema(tickets);
export const selectTicketSchema = createSelectSchema(tickets);
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type SelectTicket = z.infer<typeof selectTicketSchema>;