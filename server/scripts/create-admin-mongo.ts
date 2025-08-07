import { hashPassword } from '../auth.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Resolve the path to the shared schema
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../../');

// Load environment variables
dotenv.config({ path: join(projectRoot, '.env') });

// Import the User model after setting up the environment
const { User, connectDB } = await import('../../shared/schema.js');

async function createAdminUser() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@addisbusconnect.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
    
    if (!email || !password) {
      throw new Error('Admin email and password must be provided');
    }

    console.log('Connecting to MongoDB...');
    
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    console.log('Creating admin user with email:', email);
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
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
    if (error instanceof Error) {
      if (error.message.includes('duplicate key error')) {
        console.log('Admin user already exists');
      } else {
        console.error('Error creating admin user:', error.message);
      }
    } else {
      console.error('Unknown error creating admin user:', error);
    }
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
