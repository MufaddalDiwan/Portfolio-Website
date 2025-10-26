# Backend Deployment Checklist

Use this checklist to ensure your backend is properly configured for production deployment.

## Pre-Deployment Checklist

### ✅ Files Created/Updated

- [x] `Procfile` - Process definitions for hosting platforms
- [x] `gunicorn.conf.py` - Gunicorn WSGI server configuration  
- [x] `requirements.txt` - Updated with all production dependencies
- [x] `deploy.py` - Deployment script with health checks
- [x] `start.sh` - Production startup script
- [x] `validate_deployment.py` - Deployment validation script
- [x] `DEPLOYMENT.md` - Comprehensive deployment documentation
- [x] `DEPLOYMENT_CHECKLIST.md` - This checklist
- [x] `.env.example` - Updated with all environment variables
- [x] Enhanced health check endpoint in `app.py`

### ✅ Configuration Verified

- [x] Gunicorn configured with proper worker settings
- [x] Database migrations set up for automatic deployment
- [x] Health check endpoint includes database connectivity test
- [x] CORS configuration ready for production frontend URL
- [x] Error handling and logging configured
- [x] Rate limiting configured for contact endpoint

## Deployment Steps

### 1. Environment Setup

**Required Environment Variables:**
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SECRET_KEY` - Flask secret key (generate with `python -c "import secrets; print(secrets.token_hex(32))"`)
- [ ] `ALLOWED_ORIGIN` - Frontend URL for CORS

**Optional Environment Variables:**
- [ ] `SENDGRID_API_KEY` - For email functionality
- [ ] `ADMIN_USER` - Admin panel username (default: admin)
- [ ] `ADMIN_PASS` - Admin panel password (default: admin)
- [ ] `WEB_CONCURRENCY` - Number of Gunicorn workers (default: 2)
- [ ] `PORT` - Server port (default: 8000)

### 2. Platform-Specific Deployment

#### Render
- [ ] Connect GitHub repository
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `gunicorn --config gunicorn.conf.py app:app`
- [ ] Add environment variables in dashboard
- [ ] Enable auto-deploy on git push

#### Railway
- [ ] Connect GitHub repository
- [ ] Add environment variables in dashboard
- [ ] Deploy automatically triggers on git push

#### Heroku
- [ ] Create Heroku app: `heroku create your-app-name`
- [ ] Add PostgreSQL: `heroku addons:create heroku-postgresql:mini`
- [ ] Set environment variables: `heroku config:set KEY=value`
- [ ] Deploy: `git push heroku main`

### 3. Post-Deployment Verification

- [ ] Health check endpoint responds: `GET /health`
- [ ] Database migrations completed successfully
- [ ] Admin panel accessible: `/admin`
- [ ] API endpoints respond correctly:
  - [ ] `GET /api/projects`
  - [ ] `GET /api/experience`
  - [ ] `GET /api/meta`
  - [ ] `POST /api/contact` (test with valid data)
- [ ] CORS headers present for frontend origin
- [ ] Rate limiting working on contact endpoint

### 4. Initial Data Setup

- [ ] Access admin panel at `/admin`
- [ ] Create initial site metadata (hero title, bio, social links)
- [ ] Add sample projects (or run `python seed.py`)
- [ ] Add experience entries
- [ ] Test contact form functionality

## Monitoring Setup

### Application Monitoring
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure log aggregation
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring

### Database Monitoring
- [ ] Enable database backups
- [ ] Set up connection monitoring
- [ ] Configure slow query logging

## Security Checklist

- [ ] Strong SECRET_KEY generated and set
- [ ] Database credentials secured
- [ ] CORS configured for specific origin (no wildcards)
- [ ] Admin credentials changed from defaults
- [ ] HTTPS enabled on hosting platform
- [ ] Environment variables not committed to git

## Performance Optimization

- [ ] Gunicorn worker count optimized for traffic
- [ ] Database connection pooling configured
- [ ] Static file serving optimized
- [ ] Response compression enabled
- [ ] Database indexes created for frequently queried fields

## Backup and Recovery

- [ ] Database backup strategy implemented
- [ ] Environment variables documented securely
- [ ] Recovery procedures tested
- [ ] Rollback plan documented

## Common Issues and Solutions

### Database Connection Issues
```bash
# Test database connection
python -c "from app import create_app; app = create_app(); app.app_context().push(); from models import db; db.session.execute('SELECT 1')"
```

### Migration Issues
```bash
# Run migrations manually
python deploy.py
# or
alembic upgrade head
```

### CORS Issues
- Verify ALLOWED_ORIGIN matches frontend URL exactly
- Check for trailing slashes
- Ensure protocol (http/https) matches

### Email Issues
- Verify SendGrid API key
- Check SendGrid account status
- Test with curl:
```bash
curl -X POST https://your-api.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

## Validation Commands

```bash
# Run deployment validation
python validate_deployment.py

# Test health endpoint
curl https://your-api-url.com/health

# Check environment variables
env | grep -E "(DATABASE_URL|SECRET_KEY|ALLOWED_ORIGIN)"

# Test database connection
python -c "from app import create_app; app = create_app(); app.app_context().push(); from models import db; print('DB OK' if db.session.execute('SELECT 1') else 'DB Error')"
```

## Success Criteria

Your deployment is successful when:

- [ ] Health check returns 200 status with "healthy" status
- [ ] All API endpoints respond correctly
- [ ] Admin panel is accessible and functional
- [ ] Contact form sends emails successfully
- [ ] Frontend can communicate with backend (CORS working)
- [ ] Database migrations run automatically on deployment
- [ ] Application logs are accessible and informative

## Next Steps After Deployment

1. **Monitor**: Set up monitoring and alerting
2. **Optimize**: Monitor performance and optimize as needed
3. **Scale**: Adjust worker count and database resources based on traffic
4. **Maintain**: Regular updates and security patches
5. **Backup**: Verify backup and recovery procedures work

---

**Need Help?** 
- Check the detailed `DEPLOYMENT.md` guide
- Review application logs for specific error messages
- Test individual components using the validation commands above