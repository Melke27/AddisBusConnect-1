import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Get DATABASE_URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create PostgreSQL connection
const connection = postgres(databaseUrl, {
  ssl: 'require',
  max: 20,
  idle_timeout: 20,
  connect_timeout: 60,
});

// Create Drizzle database instance
export const db = drizzle(connection, { schema });

// Health check function
export async function checkDatabaseConnection() {
  try {
    await connection`SELECT 1`;
    console.log('✅ Supabase database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Close database connection
export async function closeDatabaseConnection() {
  await connection.end();
}