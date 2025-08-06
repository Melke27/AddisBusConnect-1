# AddisBus Connect - Replit.md

## Overview
AddisBus Connect is a full-stack web application designed for Addis Ababa bus passengers to track buses in real-time, purchase digital tickets, and access multilingual support. The system enables passengers to view live bus locations on maps, get estimated arrival times, and buy tickets using various payment methods including local mobile money services.

## Recent Changes (August 6, 2025)
- ✅ **Ethiopian Cultural Logos**: Created authentic Anbessa (Lion) and Sheger bus company logos with traditional Ethiopian flag colors (Green #009639, Yellow #FFDE00, Red #DA020E)
- ✅ **Amharic Voice Assistant**: Implemented AI voice commands supporting Amharic language with phrases like 'መስመር ፈልግ' (find routes), 'አውቶብስ ከተተኮስ' (track bus), 'ትኬት ግዛ' (buy ticket)
- ✅ **Real Bus Routes Data**: Added comprehensive Addis Ababa bus routes including Mercato-Bole, Gotera-Kaliti, Lafto-CMC, Gerji-Tor Hailoch, and Entoto-Lebu with accurate stops and pricing
- ✅ **Advanced Google Maps Integration**: Implemented start/finish point tracking, live bus monitoring, route visualization, and user location services
- ✅ **Button Guide & Descriptions**: Created comprehensive user guide with button descriptions in Amharic, English, and Oromo languages
- ✅ **Complete Supabase Integration**: Built hybrid server with full database schema, automatic detection, and seamless fallback to mock data
- ✅ **Advanced Dashboard**: Created comprehensive analytics dashboard with real-time data, similar to Bolt.new examples
- ✅ **Production Ready**: All API endpoints functional, frontend integrated, ready for Supabase DATABASE_URL connection

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Internationalization**: i18next with support for English, Amharic, and Afaan Oromo
- **Maps**: React-Leaflet for interactive map functionality
- **Real-time Updates**: WebSocket integration for live bus tracking

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **Real-time Communication**: WebSocket Server for live bus location updates
- **API Design**: RESTful API with consistent error handling

### Database Design
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle with migrations in `/migrations` directory
- **Key Tables**:
  - `users` - User profiles with role-based access
  - `routes` - Bus routes with multilingual names and scheduling
  - `stops` - Bus stops with geolocation data
  - `buses` - Bus fleet management with real-time location
  - `tickets` - Digital ticket purchases and QR codes
  - `sessions` - Session storage for authentication

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with OIDC
- **Session Storage**: PostgreSQL-backed sessions with 7-day TTL
- **Authorization**: Role-based access (passenger/admin)
- **User Management**: Profile storage with language preferences

### Real-time Tracking
- **WebSocket Server**: Bi-directional communication for live updates
- **Bus Location Updates**: Real-time GPS coordinate streaming
- **Map Integration**: Leaflet maps with custom markers and user location
- **Offline Support**: Basic caching for low connectivity scenarios

### Payment Integration
- **Local Providers**: Telebirr, CBE Birr, HelloCash support (configured)
- **International**: Stripe integration for card payments
- **Ticket Generation**: QR code generation for digital tickets
- **Payment Status**: Real-time payment confirmation and ticket delivery

### Multilingual Support
- **Languages**: English, Amharic (አማርኛ), Afaan Oromo
- **Implementation**: i18next with JSON translation files
- **Database**: Multilingual content stored with language-specific columns
- **User Preference**: Language selection persisted in user profiles

## Data Flow

### Bus Tracking Flow
1. Bus locations updated via GPS → WebSocket server
2. Server broadcasts location updates to connected clients
3. Frontend receives updates and renders on map in real-time
4. Users see live bus positions and estimated arrivals

### Ticket Purchase Flow
1. User selects route and payment method
2. Frontend sends purchase request to API
3. Backend processes payment via selected provider
4. QR code ticket generated and stored in database
5. Digital ticket delivered to user interface
6. Ticket validation occurs during boarding

### Authentication Flow
1. User initiates login via Replit Auth
2. OIDC authentication with external provider
3. User profile created/updated in database
4. Session established with PostgreSQL storage
5. Role-based access granted to appropriate features

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Via `@neondatabase/serverless` driver

### Authentication
- **Replit Auth**: OIDC-based authentication service
- **OpenID Client**: For handling authentication flows

### Payment Gateways
- **Local Mobile Money**: Telebirr, CBE Birr, HelloCash APIs
- **Card Payments**: Stripe integration for international cards
- **Payment Processing**: Secure tokenization and transaction handling

### Mapping Services
- **Leaflet**: Open-source mapping library
- **Tile Providers**: OpenStreetMap tiles for map rendering
- **Geolocation**: Browser geolocation API for user positioning

### Development Tools
- **Vite**: Development server and build tool with HMR
- **Replit Integrations**: Runtime error overlay and cartographer for development

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Node.js server to `dist/index.js`
- **Assets**: Static assets served from built distribution

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Express server serves built static files
- **Database**: Connection via `DATABASE_URL` environment variable
- **Authentication**: Configured via Replit environment variables

### Session Management
- **Storage**: PostgreSQL-based session store
- **Security**: HTTP-only cookies with secure flags
- **Persistence**: 7-day session lifetime with automatic cleanup

### Real-time Infrastructure
- **WebSocket Server**: Attached to HTTP server for upgrade handling
- **Connection Management**: Client connection tracking and cleanup
- **Broadcasting**: Efficient message distribution to connected clients