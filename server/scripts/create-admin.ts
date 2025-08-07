import { hashPassword } from '../auth';
import { db } from '../database/supabase';
import { users } from '../database/schema';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@addisbusconnect.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
    
    if (!email || !password) {
      throw new Error('Admin email and password must be provided');
    }

    console.log('Creating admin user with email:', email);
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Insert the admin user
    const [adminUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      emailVerified: true,
      preferredLanguage: 'en'
    }).returning();
    
    console.log('Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    });
    
    return adminUser;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('duplicate key value violates unique constraint')) {
        console.log('Admin user already exists');
        return null;
      }
      console.error('Error creating admin user:', error.message);
    } else {
      console.error('Unknown error creating admin user:', error);
    }
    return null;
  }
}

// Run the script
createAdminUser()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
