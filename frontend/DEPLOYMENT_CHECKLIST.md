# Frontend Deployment Checklist

## Pre-Deployment

- [ ] Backend API is deployed and accessible
- [ ] Environment variables are configured
- [ ] Build passes locally (`npm run build:prod`)
- [ ] All tests pass (`npm run test:run`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code is formatted (`npm run format:check`)

## Netlify Deployment

### Configuration Files
- [x] `netlify.toml` - Build and redirect configuration
- [x] `scripts/build-with-env.js` - Environment variable injection

### Environment Variables (Set in Netlify Dashboard)
- [ ] `API_BASE_URL` - Backend API URL (e.g., `https://your-api.com/api`)
- [ ] `NODE_VERSION` - Node.js version (`20`)
- [ ] `NPM_VERSION` - NPM version (`10`)

### Build Settings
- **Base directory**: `frontend`
- **Build command**: `npm run build:deploy`
- **Publish directory**: `dist/portfolio/browser`

## Vercel Deployment

### Configuration Files
- [x] `vercel.json` - Build and routing configuration
- [x] `scripts/build-with-env.js` - Environment variable injection

### Environment Variables (Set in Vercel Dashboard)
- [ ] `API_BASE_URL` - Backend API URL (e.g., `https://your-api.com/api`)
- [ ] `NODE_VERSION` - Node.js version (`20`)

### Build Settings
- **Framework Preset**: Angular
- **Root Directory**: `frontend`
- **Build Command**: `npm run build:deploy`
- **Output Directory**: `dist/portfolio/browser`

## Post-Deployment Verification

- [ ] Site loads without errors
- [ ] All sections are visible and functional
- [ ] Navigation works (scroll spy, mobile menu)
- [ ] Contact form submits successfully
- [ ] API calls work (check browser network tab)
- [ ] Theme toggle works
- [ ] Images load properly
- [ ] Site is responsive on mobile/tablet
- [ ] Run Lighthouse audit (target: all scores ≥ 95)

## Performance Optimizations Included

- [x] Brotli compression enabled
- [x] HTTP/2 support
- [x] Static asset caching (1 year)
- [x] HTML no-cache headers
- [x] Security headers (CSP, HSTS, etc.)
- [x] Bundle optimization (tree shaking, minification)
- [x] Image optimization (ngOptimizedImage)
- [x] Code splitting and lazy loading

## Monitoring

After deployment, set up monitoring:
- [ ] Analytics (Netlify/Vercel Analytics)
- [ ] Error tracking (optional: Sentry)
- [ ] Performance monitoring (Lighthouse CI)
- [ ] Uptime monitoring

## Troubleshooting

### Common Issues

1. **Build fails with environment errors**
   - Check that `API_BASE_URL` is set in platform dashboard
   - Verify Node.js version is 20

2. **404 errors on page refresh**
   - Verify redirect rules in netlify.toml/vercel.json
   - Check that SPA routing is configured

3. **API calls fail**
   - Verify `API_BASE_URL` is correct
   - Check CORS configuration on backend
   - Ensure backend is accessible from frontend domain

4. **Images don't load**
   - Check that images are in `public` folder or `assets`
   - Verify image paths are correct
   - Check Content Security Policy headers

5. **Performance issues**
   - Run Lighthouse audit to identify bottlenecks
   - Check bundle size with `npm run build:analyze`
   - Verify images are optimized

## Security Considerations

- [x] Content Security Policy configured
- [x] XSS protection enabled
- [x] HTTPS enforced (HSTS)
- [x] Clickjacking protection (X-Frame-Options)
- [x] MIME type sniffing disabled
- [x] Referrer policy configured

## Rollback Plan

If deployment fails:
1. Check build logs in platform dashboard
2. Revert to previous working commit
3. Redeploy from known good state
4. Fix issues in development branch
5. Test thoroughly before redeploying