#!/usr/bin/env node

// Custom build script for frontend that avoids permission issues with react-scripts

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting custom frontend build...');

try {
  // Change to frontend directory
  const frontendDir = path.join(__dirname, 'frontend');
  console.log(`Changing to directory: ${frontendDir}`);
  process.chdir(frontendDir);
  
  // Install dependencies if node_modules doesn't exist
  if (!fs.existsSync('node_modules')) {
    console.log('Installing frontend dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Run build using npx to avoid permission issues
  console.log('Building frontend with npx...');
  execSync('npx react-scripts build', { stdio: 'inherit' });
  
  console.log('Frontend build completed successfully!');
} catch (error) {
  console.error('Frontend build failed:', error.message);
  process.exit(1);
}