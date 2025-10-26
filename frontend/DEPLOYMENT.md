# Frontend Deployment Guide

This guide covers deploying the Angular frontend to Netlify or Vercel.

## Prerequisites

- Backend API deployed and accessible
- Domain name (optional but recommended)
- Git repository connected to hosting platform

## Netlify Deployment

### 1. Connect Repository

1. Log in to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your Git provider and select the repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build:deploy`
   - **Publish directory**: `dist/portfolio/browser`

### 2. Environment Variables

Set these environment variables in Netlify dashboard (Site settings > Environment variables):

```
API_BASE_URL=https://your-backend-api.com/api
NODE_VERSION=20
NPM_VERSION=10
```

### 3. Deploy

The site will automatically deploy when you push to your main branch.

### 4. Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Add custom domain
3. Configure DNS records as instructed

## Vercel Deployment

### 1. Connect Repository

1. Log in to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure project settings:
   - **Framework Preset**: Angular
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build:deploy`
   - **Output Directory**: `dist/portfolio/browser`

### 2. Environment Variables

Set these environment variables in Vercel dashboard (Project settings > Environment variables):

```
API_BASE_URL=https://your-backend-api.com/api
NODE_VERSION=20
```

### 3. Deploy

The site will automatically deploy when you push to your main branch.

### 4. Custom Domain (Optional)

1. Go to Project settings > Domains
2. Add custom domain
3. Configure DNS records as instructed

## Build Optimizations

Both configurations include:

- **Brotli Compression**: Automatically enabled for smaller file sizes
- **HTTP/2**: Enabled by default on both platforms
- **Caching**: Static assets cached for 1 year, HTML files not cached
- **Security Headers**: CSP, XSS protection, HSTS, and more
- **SPA Routing**: All routes redirect to index.html for client-side routing

## Performance Features

- **Bundle Optimization**: Tree shaking, minification, and compression
- **Image Optimization**: Automatic WebP conversion and responsive images
- **Code Splitting**: Lazy loading for optimal performance
- **Preloading**: Critical resources preloaded for faster initial load

## Security Headers

Both configurations include comprehensive security headers:

- Content Security Policy (CSP)
- X-Content-Type-Options
- X-XSS-Protection
- X-Frame-Options
- Strict-Transport-Security (HSTS)
- Referrer-Policy

## Monitoring

After deployment, monitor your site using:

- Netlify Analytics or Vercel Analytics
- Google Lighthouse for performance audits
- Browser DevTools for debugging

## Troubleshooting

### Build Failures

1. Check build logs in the hosting platform dashboard
2. Verify all dependencies are in package.json
3. Ensure Node.js version compatibility
4. Check for TypeScript errors

### Environment Variables Not Working

1. Verify variable names match exactly
2. Redeploy after adding new variables
3. Check build logs for environment variable injection

### 404 Errors on Refresh

This is normal for SPAs. The redirect rules in netlify.toml and vercel.json handle this automatically.

### API Connection Issues

1. Verify API_BASE_URL is correct
2. Check CORS configuration on backend
3. Ensure backend is accessible from frontend domain
4. Check browser network tab for failed requests

## Performance Targets

The deployment configurations are optimized to achieve:

- Lighthouse Performance Score: ≥ 95
- Lighthouse Accessibility Score: ≥ 95
- Lighthouse Best Practices Score: ≥ 95
- Lighthouse SEO Score: ≥ 95

Run Lighthouse audits after deployment to verify these targets are met.