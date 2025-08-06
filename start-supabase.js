import { spawn } from 'child_process';

// Start the Supabase server with proper Node.js loader
const server = spawn('node', ['--import=tsx', 'server/index-supabase.ts'], {
  stdio: 'inherit',
  env: process.env
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});