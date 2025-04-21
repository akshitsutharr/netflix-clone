import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Log the current directory
console.log('Current directory:', process.cwd());

// Run the frontend build
console.log('Building frontend...');
execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });

// Ensure the dist directory exists
const distDir = path.join(process.cwd(), 'frontend', 'dist');
if (fs.existsSync(distDir)) {
  console.log(`Build successful! Output directory: ${distDir}`);
  
  // List the files in the dist directory
  console.log('Files in dist directory:');
  const files = fs.readdirSync(distDir);
  files.forEach(file => {
    console.log(`- ${file}`);
  });
} else {
  console.error(`Error: Output directory ${distDir} not found!`);
  process.exit(1);
}

// Copy the dist folder to the root directory for Vercel if needed
const rootDistDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(rootDistDir)) {
  fs.mkdirSync(rootDistDir, { recursive: true });
  console.log('Created root dist directory');
}

// Copy all files from frontend/dist to root/dist
console.log('Copying files to root dist directory...');
execSync(`cp -r ${distDir}/* ${rootDistDir}`, { stdio: 'inherit' });
console.log('Build process completed!'); 