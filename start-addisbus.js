import { spawn } from 'child_process';
import path from 'path';

console.log('🇪🇹 Starting AddisBus Connect...');

// Start the enhanced hybrid server
const server = spawn('node', ['--import=tsx', 'server/index-hybrid.ts'], {
  stdio: 'inherit',
  env: process.env
});

server.on('close', (code) => {
  console.log(`AddisBus Connect server exited with code ${code}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down AddisBus Connect...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit(0);
});