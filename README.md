# 🚌 AddisBusConnect - የአዲስ አበባ የህዝብ ማመላለሻ ስርዓት

![AddisBus Connect](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Ethiopia](https://img.shields.io/badge/Country-Ethiopia-green)
![Languages](https://img.shields.io/badge/Languages-4-blue)
![Payment Methods](https://img.shields.io/badge/Payment%20Methods-8-orange)

A comprehensive **Ethiopian public transportation system** for Addis Ababa, featuring real-time bus tracking, multilingual support, Ethiopian payment integration, and cultural branding.

---

## 🇪🇹 **Features**

### ✅ **Core Features**
- 🚌 **Real-Time Bus Tracking** - Live GPS tracking of Anbessa and Sheger buses
- 🌍 **Multi-Language Support** - አማርኛ (Amharic), English, Afaan Oromo, ትግርኛ (Tigrinya)
- 💳 **Ethiopian Payment Integration** - TeleBirr, CBE, Mobile Banking, Cards
- 🎤 **Voice Assistant** - Amharic voice commands ("መስመር ፈልግ", "ትኬት ግዛ")
- 🦁 **Cultural Branding** - Authentic Anbessa (Lion) and Sheger bus logos
- 📱 **QR Code Tickets** - Digital ticketing with QR code validation
- 📊 **Admin Dashboard** - Complete analytics and management system
- 🗺️ **Interactive Maps** - Google Maps integration with route visualization

### 🏦 **Payment Methods Supported**
1. **TeleBirr** (ቴሌ ብር) - Ethiopia's leading mobile money
2. **CBE Mobile Banking** (ሲቢኢ ሞባይል ባንኪንግ)
3. **Awash Bank Mobile** (አዋሽ ባንክ ሞባይል)
4. **Bank of Abyssinia Mobile** (የአቢሲኒያ ባንክ ሞባይል)
5. **Cooperative Bank Mobile** (ህብረት ባንክ ሞባይል)
6. **Hello Money** (ሄሎ ማኒ)
7. **M-Pesa** (ኤም-ፔሳ)
8. **Credit/Debit Cards** (ክሬዲት/ዴቢት ካርድ)

---

## 🏗️ **Tech Stack**

### **Frontend**
- ⚛️ **React 18.3.1** + TypeScript
- 🚀 **Vite** (Development & Build)
- 🎨 **Tailwind CSS** + Shadcn/ui components
- 🗺️ **Google Maps API** + React-Leaflet
- 🌐 **i18next** (Internationalization)
- 📱 **Responsive Design** (Mobile-first)

### **Backend**
- 🟢 **Node.js** + Express.js + TypeScript
- 🍃 **MongoDB Atlas** (Primary database)
- 🐘 **PostgreSQL** + Drizzle ORM (Alternative)
- 🔒 **JWT Authentication** + OAuth
- ⚡ **WebSocket** (Real-time tracking)
- 🎯 **RESTful API** (9+ endpoints)

---

## 📁 **Project Structure**

```
AddisBusConnect-1/
├── 📂 client/                    # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/        # UI Components
│   │   │   ├── 📂 ui/            # Shadcn/ui components
│   │   │   ├── 📂 features/      # Feature components
│   │   │   ├── 📂 auth/          # Authentication
│   │   │   └── 📂 maps/          # Map components
│   │   ├── 📂 pages/             # Application pages
│   │   ├── 📂 locales/           # Translation files
│   │   │   ├── 📄 am.json        # አማርኛ (Amharic)
│   │   │   ├── 📄 en.json        # English
│   │   │   ├── 📄 om.json        # Afaan Oromo
│   │   │   └── 📄 ti.json        # ትግርኛ (Tigrinya)
│   │   ├── 📂 data/              # Route data
│   │   └── 📂 hooks/             # Custom hooks
│   └── 📂 public/
│       ├── 📂 audio/             # Voice assistant audio
│       └── 📂 images/            # Logos and assets
├── 📂 server/                    # Node.js Backend
│   ├── 📂 database/              # Database schemas
│   ├── 📂 routes/                # API routes
│   ├── 📂 services/              # Business logic
│   └── 📂 scripts/               # Admin scripts
├── 📂 shared/                    # Shared schemas
└── 📄 README.md                  # This file
```

---

## 🚀 **Quick Start**

### **Prerequisites**
- 📦 **Node.js** (v18 or higher)
- 📦 **npm** or **yarn**
- 🌐 **MongoDB Atlas** account (optional - uses fallback)
- 🗺️ **Google Maps API** key (optional - for maps)

### **Installation**

1. **Clone and Install Dependencies:**
```bash
# Navigate to project
cd C:\Users\think\Desktop\AddisBusConnect-1

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

2. **Environment Setup:**
```bash
# Copy environment variables
# Update .env file with your configurations
```

3. **Start Development Servers:**

**Option 1: Full Stack Development**
```bash
# Terminal 1: Start Backend (Port 5001)
npm run dev

# Terminal 2: Start Frontend (Port 5173)
cd client
npm run dev
```

**Option 2: Quick Test Server (Port 3002)**
```bash
# Run the enhanced server with all features
node server-3002.js
```

### **Access the Application:**
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:5001
- 🧪 **Test Server**: http://localhost:3002

---

## 📊 **API Documentation**

### **Public Endpoints**
```http
GET  /api/health                    # Server status and features
GET  /api/routes                    # Available bus routes
GET  /api/buses/live                # Live bus locations
GET  /api/companies                 # Bus companies (Anbessa, Sheger)
GET  /api/payment-methods           # Payment options
GET  /api/analytics/dashboard       # Public analytics
```

### **Authentication Endpoints**
```http
POST /api/auth/signup               # User registration
POST /api/auth/login                # User login
POST /api/auth/logout               # User logout
GET  /api/auth/user                 # Get current user
```

### **Ticket & Payment Endpoints**
```http
GET  /api/tickets                   # User tickets (authenticated)
POST /api/tickets/purchase          # Purchase ticket
POST /api/voice/command             # Process voice commands
```

### **Admin Endpoints** (Admin Only)
```http
GET    /api/admin/users             # All users
GET    /api/admin/statistics        # System statistics
POST   /api/routes                  # Create route
PUT    /api/routes/:id              # Update route
DELETE /api/routes/:id              # Delete route
```

---

## 🌍 **Multi-Language Support**

### **Supported Languages:**
- 🇪🇹 **አማርኛ (Amharic)** - Primary language
- 🇬🇧 **English** - International users
- 🇪🇹 **Afaan Oromo** - Oromo speakers
- 🇪🇹 **ትግርኛ (Tigrinya)** - Tigrinya speakers

### **Language Files:**
- `client/src/locales/am.json` - Amharic translations
- `client/src/locales/en.json` - English translations
- `client/src/locales/om.json` - Oromo translations
- `client/src/locales/ti.json` - Tigrinya translations

---

## 🎤 **Voice Assistant Commands**

### **Amharic Voice Commands:**
- 🔍 **"መስመር ፈልግ"** - Find routes
- 🚌 **"አውቶብስ ከተተኮስ"** - Track buses
- 🎫 **"ትኬት ግዛ"** - Buy ticket
- ❓ **"እርዳታ"** - Get help
- 🛑 **"ማቆሚያዎች አሳይ"** - Show stops

---

## 💳 **Payment Integration**

### **Mobile Money & Banking:**
```typescript
// Payment methods configuration
const paymentMethods = [
  { id: 'telebirr', name: 'TeleBirr', type: 'mobile_wallet' },
  { id: 'cbe', name: 'CBE Mobile Banking', type: 'mobile_banking' },
  { id: 'awashBank', name: 'Awash Bank Mobile', type: 'mobile_banking' },
  { id: 'bankOfAbyssinia', name: 'Bank of Abyssinia', type: 'mobile_banking' },
  { id: 'cooperativeBank', name: 'Cooperative Bank', type: 'mobile_banking' },
  { id: 'helloMoney', name: 'Hello Money', type: 'mobile_wallet' },
  { id: 'mpesa', name: 'M-Pesa', type: 'mobile_wallet' },
  { id: 'card', name: 'Credit/Debit Card', type: 'card' }
];
```

---

## 🚌 **Bus Companies & Routes**

### **Anbessa City Bus** (አንበሳ የከተማ አውቶብስ)
- 🦁 **Logo**: Lion symbol with Ethiopian colors
- 🛣️ **Routes**: Mercato-Bole, Gotera-Kaliti
- 💰 **Average Price**: 7.50 ETB
- 🎨 **Brand Color**: Green (#009639)

### **Sheger Bus** (ሸገር አውቶብስ)
- 🚌 **Logo**: Modern bus design
- 🛣️ **Routes**: Lafto-CMC, Gerji-Tor Hailoch
- 💰 **Average Price**: 8.50 ETB
- 🎨 **Brand Color**: Red (#DA020E)

---

## 🗺️ **Routes & Stops**

### **Popular Routes:**
1. **መርካቶ - ቦሌ** (Mercato - Bole) - 8.50 ETB
2. **ላፍቶ - ሲኤምሲ** (Lafto - CMC) - 9.00 ETB
3. **ጎተራ - ቃሊቲ** (Gotera - Kaliti) - 7.00 ETB
4. **ገርጂ - ቶር ሃይሎች** (Gerji - Tor Hailoch) - 8.00 ETB

---

## 📱 **Mobile Features**

- 📱 **Responsive Design** - Works on all devices
- 🔔 **Push Notifications** - Bus arrival alerts
- 📍 **GPS Location** - Find nearest stops
- 🎫 **QR Code Scanner** - Ticket validation
- 📊 **Offline Support** - Basic functionality without internet

---

## 🔒 **Security Features**

- 🔐 **JWT Authentication** - Secure user sessions
- 🛡️ **Password Encryption** - bcrypt hashing
- 🚫 **CORS Protection** - Cross-origin security
- 🔑 **API Rate Limiting** - Prevent abuse
- 📝 **Input Validation** - Zod schema validation

---

## 📊 **Admin Dashboard**

### **Admin Features:**
- 👥 **User Management** - View and manage users
- 🚌 **Fleet Management** - Add/edit buses and routes
- 📈 **Analytics** - Revenue, ridership statistics
- 🎫 **Ticket Management** - Monitor ticket sales
- 🔧 **System Settings** - Configure app settings

### **Analytics Metrics:**
- 📊 **Daily Revenue** - Track earnings
- 🚌 **Active Buses** - Monitor fleet status
- 🎫 **Ticket Sales** - Sales statistics
- 👥 **User Activity** - User engagement metrics

---

## 🌐 **Deployment Guide**

### **Netlify Deployment**

1. **Prepare for Deployment:**
```bash
# Build the client
cd client
npm run build
```

2. **Netlify Configuration:**
Create `netlify.toml` file:
```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. **Deploy Steps:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=client/dist
```

### **Environment Variables for Production:**
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## 🧪 **Testing**

### **Available Scripts:**
```bash
# Type checking
npm run check

# Build project
npm run build

# Start production server
npm run start

# Create admin user
npm run create-admin
```

### **Test the API:**
```bash
# Test health endpoint
curl http://localhost:3002/api/health

# Test routes endpoint
curl http://localhost:3002/api/routes

# Test live bus data
curl http://localhost:3002/api/buses/live
```

---

## 🤝 **Contributing**

### **Development Workflow:**
1. 🍴 Fork the repository
2. 🌿 Create feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to branch (`git push origin feature/amazing-feature`)
5. 🔄 Open Pull Request

### **Code Style:**
- ✅ TypeScript for type safety
- 📏 ESLint + Prettier for formatting
- 📝 Comment complex logic
- 🧪 Write tests for new features

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **MongoDB Connection Failed:**
```bash
# The app uses in-memory fallback, check logs
# Update MONGODB_URI in .env file
```

2. **Port Already in Use:**
```bash
# Kill process on port
npx kill-port 5001
# Or use different port
PORT=5002 npm run dev
```

3. **Build Errors:**
```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install
```

4. **Voice Assistant Not Working:**
```bash
# Check audio files in client/public/audio/
# Ensure HTTPS for microphone access
```

---

## 📈 **Roadmap**

### **Upcoming Features:**
- 🚀 **Real GPS Integration** - Live bus tracking
- 💳 **Advanced Payment** - Cryptocurrency support
- 🤖 **AI Route Optimization** - Smart routing
- 📱 **Mobile App** - React Native version
- 🌟 **Gamification** - Rewards system
- 🚦 **Traffic Integration** - Real-time traffic data

---

## 📄 **License**

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👥 **Team**

- 🇪🇹 **Ethiopian Developers** - Local expertise
- 🌍 **International Contributors** - Global perspective
- 🚌 **Transportation Experts** - Domain knowledge

---

## 📞 **Support**

### **Get Help:**
- 📧 **Email**: support@addisbusconnect.com
- 💬 **Discord**: [Join our community]
- 📚 **Documentation**: [View full docs]
- 🐛 **Issues**: [Report bugs]

### **Ethiopian Support:**
- 📞 **Phone**: +251-11-XXX-XXXX
- 📧 **Email አማርኛ**: support-am@addisbusconnect.com
- 🏢 **Address**: Addis Ababa, Ethiopia

---

## 🙏 **Acknowledgments**

- 🇪🇹 **Ethiopian Ministry of Transport** - For collaboration
- 🚌 **Anbessa City Bus** - Partnership and data
- 🚌 **Sheger Bus** - Route information
- 🌍 **Open Source Community** - Amazing tools and libraries
- 👥 **Beta Testers** - Valuable feedback

---

## 🎯 **Quick Commands**

```bash
# 🚀 Start everything quickly
npm run dev & cd client && npm run dev

# 🧪 Test API endpoints
node server-3002.js

# 🏗️ Build for production
npm run build

# 👑 Create admin user
npm run create-admin

# 🔍 Check types
npm run check
```

---

<div align="center">

### 🇪🇹 **Made with ❤️ for Ethiopia**

**AddisBusConnect** - Connecting Addis Ababa, One Bus at a Time

[![GitHub Stars](https://img.shields.io/github/stars/your-repo/addisbusconnect?style=social)](https://github.com/your-repo/addisbusconnect)
[![Follow](https://img.shields.io/twitter/follow/addisbusconnect?style=social)](https://twitter.com/addisbusconnect)

</div>

---

*Last Updated: January 2025 | Version 1.0.0 | Production Ready*
