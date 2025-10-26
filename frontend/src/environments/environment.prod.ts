/**
 * Production environment configuration
 * This file is used when building the application for production
 *
 * IMPORTANT: Update apiBaseUrl to match your production backend URL
 * For deployment platforms, this value can be replaced during build process
 */
export const environment = {
  production: true,
  // Backend API base URL for production - UPDATE THIS TO YOUR ACTUAL PRODUCTION URL
  // For Netlify/Vercel: Set API_BASE_URL environment variable in dashboard
  apiBaseUrl: 'https://api.example.com/api',
};
