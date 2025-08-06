import { pgTable, text, uuid, varchar, decimal, integer, boolean, timestamp, point, time, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  preferredLanguage: varchar('preferred_language', { length: 10 }).default('am'),
  profileImageUrl: text('profile_image_url'),
  isAdmin: boolean('is_admin').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// Bus companies
export const busCompanies = pgTable('bus_companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  nameEn: varchar('name_en', { length: 100 }).notNull(),
  nameAm: varchar('name_am', { length: 100 }).notNull(),
  nameOm: varchar('name_om', { length: 100 }).notNull(),
  logoUrl: text('logo_url'),
  brandColor: varchar('brand_color', { length: 7 }).notNull(),
  contactPhone: varchar('contact_phone', { length: 20 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Bus routes
export const busRoutes = pgTable('bus_routes', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').references(() => busCompanies.id, { onDelete: 'cascade' }),
  routeCode: varchar('route_code', { length: 20 }).unique().notNull(),
  nameEn: varchar('name_en', { length: 200 }).notNull(),
  nameAm: varchar('name_am', { length: 200 }).notNull(),
  nameOm: varchar('name_om', { length: 200 }).notNull(),
  startPointNameEn: varchar('start_point_name_en', { length: 100 }).notNull(),
  startPointNameAm: varchar('start_point_name_am', { length: 100 }).notNull(),
  startPointCoordinates: point('start_point_coordinates').notNull(),
  endPointNameEn: varchar('end_point_name_en', { length: 100 }).notNull(),
  endPointNameAm: varchar('end_point_name_am', { length: 100 }).notNull(),
  endPointCoordinates: point('end_point_coordinates').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  distanceKm: decimal('distance_km', { precision: 8, scale: 2 }),
  estimatedDurationMinutes: integer('estimated_duration_minutes'),
  frequencyMinutes: integer('frequency_minutes').default(15),
  startTime: time('start_time').default('05:30:00'),
  endTime: time('end_time').default('23:00:00'),
  routeColor: varchar('route_color', { length: 7 }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// Bus stops
export const busStops = pgTable('bus_stops', {
  id: uuid('id').primaryKey().defaultRandom(),
  nameEn: varchar('name_en', { length: 100 }).notNull(),
  nameAm: varchar('name_am', { length: 100 }).notNull(),
  nameOm: varchar('name_om', { length: 100 }).notNull(),
  coordinates: point('coordinates').notNull(),
  addressEn: text('address_en'),
  addressAm: text('address_am'),
  landmarksAm: text('landmarks_am'),
  accessibilityFeatures: text('accessibility_features').array(),
  isMajorStop: boolean('is_major_stop').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Route stops junction
export const routeStops = pgTable('route_stops', {
  id: uuid('id').primaryKey().defaultRandom(),
  routeId: uuid('route_id').references(() => busRoutes.id, { onDelete: 'cascade' }),
  stopId: uuid('stop_id').references(() => busStops.id, { onDelete: 'cascade' }),
  stopOrder: integer('stop_order').notNull(),
  travelTimeFromPrevious: integer('travel_time_from_previous').default(0)
}, (table) => ({
  routeOrderIdx: uniqueIndex('route_order_idx').on(table.routeId, table.stopOrder),
  routeStopIdx: uniqueIndex('route_stop_idx').on(table.routeId, table.stopId)
}));

// Buses
export const buses = pgTable('buses', {
  id: uuid('id').primaryKey().defaultRandom(),
  routeId: uuid('route_id').references(() => busRoutes.id, { onDelete: 'cascade' }),
  plateNumber: varchar('plate_number', { length: 20 }).unique().notNull(),
  busNumber: varchar('bus_number', { length: 10 }),
  capacity: integer('capacity').default(50),
  accessibilityEnabled: boolean('accessibility_enabled').default(false),
  wifiEnabled: boolean('wifi_enabled').default(false),
  airConditioning: boolean('air_conditioning').default(false),
  currentCoordinates: point('current_coordinates'),
  currentSpeed: decimal('current_speed', { precision: 5, scale: 2 }).default('0'),
  heading: integer('heading').default(0),
  isActive: boolean('is_active').default(true),
  isInService: boolean('is_in_service').default(false),
  lastMaintenanceDate: timestamp('last_maintenance_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
}, (table) => ({
  routeIdx: index('buses_route_idx').on(table.routeId)
}));

// Bus locations (tracking history)
export const busLocations = pgTable('bus_locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  busId: uuid('bus_id').references(() => buses.id, { onDelete: 'cascade' }),
  coordinates: point('coordinates').notNull(),
  speed: decimal('speed', { precision: 5, scale: 2 }).default('0'),
  heading: integer('heading').default(0),
  passengerCount: integer('passenger_count').default(0),
  nextStopId: uuid('next_stop_id').references(() => busStops.id),
  estimatedArrivalMinutes: integer('estimated_arrival_minutes'),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow()
}, (table) => ({
  busIdx: index('bus_locations_bus_idx').on(table.busId),
  recordedAtIdx: index('bus_locations_recorded_idx').on(table.recordedAt)
}));

// Digital tickets
export const tickets = pgTable('tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  routeId: uuid('route_id').references(() => busRoutes.id, { onDelete: 'cascade' }),
  ticketNumber: varchar('ticket_number', { length: 50 }).unique().notNull(),
  qrCode: varchar('qr_code', { length: 100 }).unique().notNull(),
  purchaseAmount: decimal('purchase_amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  paymentReference: varchar('payment_reference', { length: 100 }),
  boardingStopId: uuid('boarding_stop_id').references(() => busStops.id),
  destinationStopId: uuid('destination_stop_id').references(() => busStops.id),
  validFrom: timestamp('valid_from', { withTimezone: true }).defaultNow(),
  validUntil: timestamp('valid_until', { withTimezone: true }).notNull(),
  status: varchar('status', { length: 20 }).default('active'),
  usedAt: timestamp('used_at', { withTimezone: true }),
  usedBusId: uuid('used_bus_id').references(() => buses.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
  userIdx: index('tickets_user_idx').on(table.userId),
  statusIdx: index('tickets_status_idx').on(table.status)
}));

// User favorites
export const userFavorites = pgTable('user_favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  routeId: uuid('route_id').references(() => busRoutes.id, { onDelete: 'cascade' }),
  boardingStopId: uuid('boarding_stop_id').references(() => busStops.id),
  destinationStopId: uuid('destination_stop_id').references(() => busStops.id),
  nickname: varchar('nickname', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => ({
  userFavoriteIdx: uniqueIndex('user_favorite_idx').on(table.userId, table.routeId, table.boardingStopId, table.destinationStopId)
}));

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  titleEn: varchar('title_en', { length: 200 }).notNull(),
  titleAm: varchar('title_am', { length: 200 }).notNull(),
  messageEn: text('message_en').notNull(),
  messageAm: text('message_am').notNull(),
  notificationType: varchar('notification_type', { length: 50 }).notNull(),
  isRead: boolean('is_read').default(false),
  priority: varchar('priority', { length: 20 }).default('normal'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Feedback
export const feedback = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  routeId: uuid('route_id').references(() => busRoutes.id, { onDelete: 'cascade' }),
  busId: uuid('bus_id').references(() => buses.id),
  rating: integer('rating'),
  commentEn: text('comment_en'),
  commentAm: text('comment_am'),
  feedbackType: varchar('feedback_type', { length: 50 }),
  isAnonymous: boolean('is_anonymous').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertBusRouteSchema = createInsertSchema(busRoutes);
export const selectBusRouteSchema = createSelectSchema(busRoutes);
export const insertTicketSchema = createInsertSchema(tickets);
export const selectTicketSchema = createSelectSchema(tickets);
export const insertBusSchema = createInsertSchema(buses);
export const selectBusSchema = createSelectSchema(buses);
export const insertBusLocationSchema = createInsertSchema(busLocations);
export const selectBusLocationSchema = createSelectSchema(busLocations);

// TypeScript types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type BusRoute = typeof busRoutes.$inferSelect;
export type NewBusRoute = typeof busRoutes.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type Bus = typeof buses.$inferSelect;
export type NewBus = typeof buses.$inferInsert;
export type BusLocation = typeof busLocations.$inferSelect;
export type NewBusLocation = typeof busLocations.$inferInsert;