import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/addisbus';

async function createAdmin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    // Check if admin already exists
    const existingAdmin = await users.findOne({ email: 'admin@addisbusconnect.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Admin details:', {
        email: existingAdmin.email,
        role: existingAdmin.role,
        _id: existingAdmin._id
      });
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@1234', 10);
    
    const adminUser = {
      email: 'admin@addisbusconnect.com',
      password: hashedPassword,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      preferredLanguage: 'en',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await users.insertOne(adminUser);
    console.log('Admin user created successfully:', result.insertedId);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

createAdmin();
