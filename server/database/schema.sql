-- AddisBus Connect Database Schema for Supabase
-- Ethiopian bus tracking system with cultural integration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with Ethiopian language preferences
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  preferred_language VARCHAR(10) DEFAULT 'am' CHECK (preferred_language IN ('en', 'am', 'om')),
  profile_image_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bus companies (Anbessa and Sheger)
CREATE TABLE IF NOT EXISTS bus_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(100) NOT NULL,
  name_am VARCHAR(100) NOT NULL,
  name_om VARCHAR(100) NOT NULL,
  logo_url TEXT,
  brand_color VARCHAR(7) NOT NULL, -- Hex color
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bus routes with multilingual support
CREATE TABLE IF NOT EXISTS bus_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES bus_companies(id) ON DELETE CASCADE,
  route_code VARCHAR(20) UNIQUE NOT NULL,
  name_en VARCHAR(200) NOT NULL,
  name_am VARCHAR(200) NOT NULL,
  name_om VARCHAR(200) NOT NULL,
  start_point_name_en VARCHAR(100) NOT NULL,
  start_point_name_am VARCHAR(100) NOT NULL,
  start_point_coordinates POINT NOT NULL,
  end_point_name_en VARCHAR(100) NOT NULL,
  end_point_name_am VARCHAR(100) NOT NULL,
  end_point_coordinates POINT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  distance_km DECIMAL(8,2),
  estimated_duration_minutes INTEGER,
  frequency_minutes INTEGER DEFAULT 15,
  start_time TIME DEFAULT '05:30:00',
  end_time TIME DEFAULT '23:00:00',
  route_color VARCHAR(7) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bus stops with geolocation
CREATE TABLE IF NOT EXISTS bus_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en VARCHAR(100) NOT NULL,
  name_am VARCHAR(100) NOT NULL,
  name_om VARCHAR(100) NOT NULL,
  coordinates POINT NOT NULL,
  address_en TEXT,
  address_am TEXT,
  landmarks_am TEXT,
  accessibility_features TEXT[],
  is_major_stop BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Route stops junction table (for ordering stops on routes)
CREATE TABLE IF NOT EXISTS route_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID REFERENCES bus_routes(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES bus_stops(id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL,
  travel_time_from_previous INTEGER DEFAULT 0, -- minutes
  UNIQUE(route_id, stop_order),
  UNIQUE(route_id, stop_id)
);

-- Buses with real-time tracking
CREATE TABLE IF NOT EXISTS buses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id UUID REFERENCES bus_routes(id) ON DELETE CASCADE,
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  bus_number VARCHAR(10),
  capacity INTEGER DEFAULT 50,
  accessibility_enabled BOOLEAN DEFAULT FALSE,
  wifi_enabled BOOLEAN DEFAULT FALSE,
  air_conditioning BOOLEAN DEFAULT FALSE,
  current_coordinates POINT,
  current_speed DECIMAL(5,2) DEFAULT 0, -- km/h
  heading INTEGER DEFAULT 0, -- degrees (0-359)
  is_active BOOLEAN DEFAULT TRUE,
  is_in_service BOOLEAN DEFAULT FALSE,
  last_maintenance_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time bus locations (for tracking history)
CREATE TABLE IF NOT EXISTS bus_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
  coordinates POINT NOT NULL,
  speed DECIMAL(5,2) DEFAULT 0,
  heading INTEGER DEFAULT 0,
  passenger_count INTEGER DEFAULT 0,
  next_stop_id UUID REFERENCES bus_stops(id),
  estimated_arrival_minutes INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digital tickets with QR codes
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  route_id UUID REFERENCES bus_routes(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  qr_code VARCHAR(100) UNIQUE NOT NULL,
  purchase_amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('telebirr', 'cbe_birr', 'hellocash', 'card')),
  payment_reference VARCHAR(100),
  boarding_stop_id UUID REFERENCES bus_stops(id),
  destination_stop_id UUID REFERENCES bus_stops(id),
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
  used_at TIMESTAMP WITH TIME ZONE,
  used_bus_id UUID REFERENCES buses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites (saved routes)
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  route_id UUID REFERENCES bus_routes(id) ON DELETE CASCADE,
  boarding_stop_id UUID REFERENCES bus_stops(id),
  destination_stop_id UUID REFERENCES bus_stops(id),
  nickname VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, route_id, boarding_stop_id, destination_stop_id)
);

-- Notifications system
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title_en VARCHAR(200) NOT NULL,
  title_am VARCHAR(200) NOT NULL,
  message_en TEXT NOT NULL,
  message_am TEXT NOT NULL,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('route_update', 'bus_delay', 'service_alert', 'promotion', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback and ratings
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  route_id UUID REFERENCES bus_routes(id) ON DELETE CASCADE,
  bus_id UUID REFERENCES buses(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment_en TEXT,
  comment_am TEXT,
  feedback_type VARCHAR(50) CHECK (feedback_type IN ('service', 'cleanliness', 'punctuality', 'comfort', 'staff', 'general')),
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for Ethiopian bus companies
INSERT INTO bus_companies (name_en, name_am, name_om, brand_color, contact_phone) VALUES 
('Anbessa City Bus', 'አንበሳ የከተማ አውቶብስ', 'Anbessa Magaalaa Awtoobusii', '#009639', '+251911123456'),
('Sheger Bus', 'ሸገር አውቶብስ', 'Sheger Awtoobusii', '#DA020E', '+251911654321');

-- Insert sample bus stops (major Addis Ababa locations)
INSERT INTO bus_stops (name_en, name_am, name_om, coordinates, is_major_stop) VALUES 
('Mercato', 'መርካቶ', 'Merkato', POINT(38.7469, 9.0157), TRUE),
('Piazza', 'ፒያሳ', 'Piiyaazaa', POINT(38.7578, 9.0343), TRUE),
('Meskel Square', 'መስቀል አደባባይ', 'Finfinnee Meskel', POINT(38.7578, 9.0125), TRUE),
('Bole Airport', 'ቦሌ አውሮፕላን ማረፊያ', 'Bole Airport', POINT(38.7990, 8.9789), TRUE),
('Stadium', 'ስታድየም', 'Isiteediyaam', POINT(38.7656, 9.0012), TRUE),
('4 Kilo', '4 ኪሎ', '4 Kilo', POINT(38.7614, 9.0411), TRUE);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bus_locations_bus_id ON bus_locations(bus_id);
CREATE INDEX IF NOT EXISTS idx_bus_locations_recorded_at ON bus_locations(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_buses_route_id ON buses(route_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_route_id ON route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_bus_stops_coordinates ON bus_stops USING GIST(coordinates);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bus_routes_updated_at BEFORE UPDATE ON bus_routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user data
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id::text);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id::text);
CREATE POLICY "Users can view their own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id::text);
CREATE POLICY "Users can view their own favorites" ON user_favorites FOR SELECT USING (auth.uid() = user_id::text);
CREATE POLICY "Users can manage their own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id::text);
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id::text);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id::text);