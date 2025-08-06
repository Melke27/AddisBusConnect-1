import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Supabase connection configuration
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not defined. Please provide your Supabase database URL.\n' +
    'Get it from: Supabase Dashboard → Project → Settings → Database → Connection string (Transaction pooler)\n' +
    'Format: postgresql://[user]:[password]@[host]:[port]/[database]'
  );
}

// Create the connection
const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
  ssl: 'require'
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Connection health check
export async function checkDatabaseConnection() {
  try {
    await client`SELECT 1 as health_check`;
    console.log('✅ Database connection successful');
    return { success: true, message: 'Connected to Supabase' };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { success: false, error: error.message };
  }
}

// Graceful shutdown
export async function closeDatabaseConnection() {
  try {
    await client.end();
    console.log('📝 Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

export default db;