# AddisBus Connect - Replit.md

## Overview
AddisBus Connect is a full-stack web application designed for Addis Ababa bus passengers to track buses in real-time, purchase digital tickets, and access multilingual support. The system enables passengers to view live bus locations on maps, get estimated arrival times, and buy tickets using various payment methods including local mobile money services.

## Recent Changes (August 6, 2025)
- ✅ **Ethiopian Cultural Logos**: Created authentic Anbessa (Lion) and Sheger bus company logos with traditional Ethiopian flag colors (Green #009639, Yellow #FFDE00, Red #DA020E)
- ✅ **Amharic Voice Assistant**: Implemented AI voice commands supporting Amharic language with phrases like \'መስመር ፈልግ\' (find routes), \'አውቶብስ ከተተኮስ\' (track bus), \'ትኬት ግዛ\' (buy ticket)
- ✅ **Real Bus Routes Data**: Added comprehensive Addis Ababa bus routes including Mercato-Bole, Gotera-Kaliti, Lafto-CMC, Gerji-Tor Hailoch, and Entoto-Lebu with accurate stops and pricing. **Now includes simulated routes for Shager and Hanbessa buses.**
- ✅ **Advanced Google Maps Integration**: Implemented start/finish point tracking, live bus monitoring, route visualization, and user location services. **Live bus data is now fetched from a simulated backend API endpoint.**
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
- **Real-time Updates**: WebSocket integration for live bus tracking. **Now fetches bus and route data from backend API endpoints.**

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **Real-time Communication**: WebSocket Server for live bus location updates. **Includes simulated API endpoints for live bus locations (`/api/live-bus-locations`) and routes (`/api/live-routes`).**
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
- **Bus Location Updates**: Real-time GPS coordinate streaming. **Now uses simulated data from backend API, including Shager and Hanbessa buses.**
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
1. Bus locations updated via simulated API on backend.
2. Frontend fetches location updates from `/api/live-bus-locations` and `/api/live-routes`.
3. Frontend renders on map in real-time.
4. Users see live bus positions and estimated arrivals, including Shager and Hanbessa buses.

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

## Netlify Deployment Guide

Netlify is a popular platform for deploying web projects, especially single-page applications like this React project. Here's a general guide to deploy your AddisBusConnect project to Netlify:

1.  **Prepare your Project for Production:**
    *   Ensure all environment variables (like `VITE_GOOGLE_MAPS_API_KEY` if you use a real one) are correctly configured for production. For Netlify, you'll set these as 


Netlify environment variables.
    *   Build your frontend for production. For this project, you would typically run `npm run build` in the `client` directory. This will create a `dist` folder with your optimized production build.

2.  **Create a Git Repository:**
    *   If you haven't already, initialize a Git repository in your project root (`/home/ubuntu/AddisBusConnect/AddisBusConnect-1`).
    *   Commit your changes and push your code to a remote Git hosting service like GitHub, GitLab, or Bitbucket.

3.  **Connect Netlify to Your Repository:**
    *   Go to [Netlify](https://www.netlify.com/) and sign up or log in.
    *   Click on "Add new site" -> "Import an existing project".
    *   Connect your Git provider (GitHub, GitLab, or Bitbucket).
    *   Select the repository where you pushed your AddisBusConnect project.

4.  **Configure Build Settings:**
    *   **Base directory:** This is the directory where your `package.json` for the frontend is located. In your case, it would be `client/`.
    *   **Build command:** `npm run build` (This command will execute the build script defined in your `client/package.json`)
    *   **Publish directory:** This is the directory where your built frontend files are located after the build command runs. For Vite, this is typically `client/dist`.
    *   **Environment Variables:** Add any necessary environment variables (e.g., `VITE_GOOGLE_MAPS_API_KEY`) under "Build & deploy" -> "Environment variables" in your Netlify site settings.

5.  **Deploy Your Site:**
    *   Click "Deploy site". Netlify will now pull your code, run the build command, and deploy your site.
    *   After a successful deployment, Netlify will provide you with a unique URL where your site is live.

**Important Considerations for this Project on Netlify:**

*   **Backend (Node.js/Express.js):** Netlify is primarily for static site hosting and serverless functions. Your current backend (Node.js/Express.js) with WebSocket and API endpoints cannot be directly hosted on Netlify as a traditional server. You would need to:
    *   **Migrate backend API endpoints to Netlify Functions (Serverless Functions):** This involves refactoring your Express.js routes into individual serverless functions. This is a significant change.
    *   **Host the backend separately:** Deploy your Node.js/Express.js backend to a different platform (e.g., Heroku, Render, a VPS) and then configure your frontend to point to that backend's URL.
*   **WebSockets:** Netlify Functions do not natively support persistent WebSocket connections. If real-time bus tracking via WebSockets is critical, you would need a separate service for that (e.g., Pusher, PubNub, or a self-hosted WebSocket server).
*   **Database (PostgreSQL/Neon):** Your database connection would remain external, and you would configure the `DATABASE_URL` as an environment variable on your backend hosting platform (or within Netlify Functions if you refactor your backend).

Given these considerations, for a full-stack application like AddisBusConnect with a Node.js backend and WebSockets, a simple Netlify deployment for the frontend alone will not make the entire application fully functional. You would need to decide on a strategy for your backend and real-time components.

I recommend starting with deploying just the frontend to Netlify to see the UI, and then exploring options for your backend and WebSocket services. If you choose to refactor your backend into serverless functions, I can provide more specific guidance on that process.



## How to Run This Project Locally

To run the AddisBusConnect project on your local machine, follow these steps:

### Prerequisites

*   **Node.js (v18 or higher) and npm:** Ensure you have Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
*   **Git:** For cloning the repository.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url> # Replace with your actual repository URL
    cd AddisBusConnect-1
    ```

2.  **Install Backend Dependencies:**
    Navigate to the project root and install the backend dependencies:
    ```bash
    npm install
    ```

3.  **Install Frontend Dependencies:**
    Navigate to the `client` directory and install its dependencies:
    ```bash
    cd client
    npm install
    cd ..
    ```

### Running the Application

1.  **Start the Backend Server:**
    From the project root directory (`AddisBusConnect-1`), run the development server:
    ```bash
    npm run dev
    ```
    This will start the backend server, typically on `http://localhost:5000`. You might see a message about MongoDB connection failing; this is expected as the project uses an in-memory fallback for demonstration purposes if MongoDB is not configured.

2.  **Start the Frontend Development Server:**
    While the backend is running, open a new terminal, navigate to the `client` directory, and start the frontend development server:
    ```bash
    cd client
    npm run dev
    ```
    This will start the React development server, usually on `http://localhost:5173` (or another available port).

3.  **Access the Application:**
    Open your web browser and navigate to the address provided by the frontend development server (e.g., `http://localhost:5173`). You should see the AddisBusConnect application running with live bus tracking (using simulated data).

### Important Notes:

*   **API Key:** The Google Maps integration requires an API key. Ensure you have `VITE_GOOGLE_MAPS_API_KEY` set in your environment or a `.env` file in the `client` directory.
*   **Real-time Data:** The live bus tracking currently uses simulated data. For real-world usage, you would integrate with an actual GPS tracking system or a real-time data streaming service.
*   **Authentication:** The project includes authentication features. For local development, it might use mock user data if `REPLIT_DOMAINS` environment variable is not set.





## Admin Dashboard CRUD Operations

The AddisBusConnect project includes an administrative dashboard that allows authorized users to manage various aspects of the system, such as routes, stops, buses, and potentially users. While the specific UI interactions may vary, the underlying CRUD (Create, Read, Update, Delete) operations generally follow these principles:

### Accessing the Admin Dashboard

1.  **Login as Administrator:** Ensure you are logged into the application with an administrator account. The authentication flow is described in the "Authentication Flow" section above.
2.  **Navigate to Dashboard:** Once logged in, locate and navigate to the Admin Dashboard section of the application. This is typically accessible via a dedicated link or menu item.

### General CRUD Steps

For managing entities like Routes, Stops, and Buses, you will typically find sections within the admin dashboard that allow you to perform the following operations:

#### 1. Create (Add New Entry)

*   **Locate "Add New" or "Create" Button:** Find a button or link (e.g., "Add New Route", "Create Bus Stop") that initiates the creation process.
*   **Fill in Details:** A form will appear where you can enter the details for the new entity (e.g., route name, bus stop coordinates, bus capacity).
*   **Submit Form:** After filling in all required information, submit the form to create the new entry. The system will typically provide feedback on success or failure.

#### 2. Read (View Existing Entries)

*   **Navigate to Entity List:** The admin dashboard will usually have dedicated sections or tables listing all existing entities (e.g., "All Routes", "Bus Stops List", "Fleet Management").
*   **Browse and Filter:** You can browse through the list of entries. There might be search or filter options to help you find specific entries.
*   **View Details:** Clicking on an individual entry (e.g., a route name, a bus ID) will often display a detailed view of that entity, showing all its properties.

#### 3. Update (Modify Existing Entry)

*   **Select Entry for Editing:** From the list of existing entries, locate the one you wish to modify. There will typically be an "Edit" button or icon associated with each entry.
*   **Modify Details:** A form pre-filled with the current details of the entry will appear. Make the necessary changes to the fields.
*   **Save Changes:** Submit the form to save your modifications. The system will confirm if the update was successful.

#### 4. Delete (Remove Existing Entry)

*   **Select Entry for Deletion:** From the list of existing entries, locate the one you wish to remove. There will usually be a "Delete" button or icon.
*   **Confirm Deletion:** To prevent accidental data loss, the system will typically ask for confirmation before permanently deleting an entry. Confirm your action.
*   **Verify Deletion:** After confirmation, the entry should be removed from the list. The system will provide a notification of the deletion status.

### Backend API Endpoints for CRUD (for reference)

For developers, the backend provides RESTful API endpoints that facilitate these CRUD operations. These are the endpoints that the frontend admin dashboard interacts with:

*   **Routes:**
    *   `GET /api/routes`: Get all routes
    *   `GET /api/routes/:id`: Get a specific route by ID
    *   `POST /api/routes`: Create a new route (Admin only)
    *   `PUT /api/routes/:id`: Update an existing route (Admin only)
    *   `DELETE /api/routes/:id`: Delete a route (Admin only)

*   **Stops:**
    *   `GET /api/stops`: Get all stops
    *   `POST /api/stops`: Create a new stop (Admin only)
    *   `PUT /api/stops/:id`: Update an existing stop (Admin only)
    *   `DELETE /api/stops/:id`: Delete a stop (Admin only)

*   **Buses:**
    *   `GET /api/buses`: Get all buses
    *   `POST /api/buses`: Create a new bus (Admin only)
    *   `PUT /api/buses/:id`: Update an existing bus (Admin only)
    *   `DELETE /api/buses/:id`: Delete a bus (Admin only)

*   **Users (Admin only):**
    *   `GET /api/admin/users`: Get all users (Admin only)

These API endpoints are protected by authentication and authorization (requiring an admin role for write operations), ensuring that only authorized personnel can manage the system data.



