@echo off
set PORT=5001
set NODE_ENV=development
node --import tsx --no-warnings=ExperimentalWarning server/index.ts
