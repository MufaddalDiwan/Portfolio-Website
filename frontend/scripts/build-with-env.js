#!/usr/bin/env node

/**
 * Build script that replaces environment variables in the production environment file
 * This is used by deployment platforms to inject environment variables at build time
 */

const fs = require('fs');
const path = require('path');

const envProdPath = path.join(__dirname, '../src/environments/environment.prod.ts');

// Read the current environment file
let envContent = fs.readFileSync(envProdPath, 'utf8');

// Replace API_BASE_URL if provided
if (process.env.API_BASE_URL) {
  console.log('Replacing API_BASE_URL with:', process.env.API_BASE_URL);
  envContent = envContent.replace(
    /apiBaseUrl:\s*['"][^'"]*['"]/,
    `apiBaseUrl: '${process.env.API_BASE_URL}'`
  );
}

// Write the updated content back
fs.writeFileSync(envProdPath, envContent);

console.log('Environment variables injected successfully');