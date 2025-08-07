import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/addis-bus';

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['passenger', 'admin'], default: 'passenger' },
  preferredLanguage: { type: String, enum: ['en', 'am', 'om'], default: 'en' },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Hash password function
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

async function createAdminUser() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@addisbusconnect.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Creating admin user with email:', email);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', {
        id: existingAdmin._id,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      return existingAdmin;
    }
    
    // Create new admin user
    const hashedPassword = await hashPassword(password);
    const adminUser = new User({
      email,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      emailVerified: true,
      preferredLanguage: 'en'
    });
    
    await adminUser.save();
    
    console.log('Admin user created successfully:', {
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role
    });
    
    return adminUser;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return null;
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
}

// Run the script
createAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
