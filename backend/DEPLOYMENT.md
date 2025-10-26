# Backend Deployment Guide

This guide covers deploying the Portfolio API backend to production hosting platforms like Render, Railway, or Heroku.

## Prerequisites

- Python 3.11+
- PostgreSQL database (for production)
- SendGrid account (for email functionality)
- Hosting platform account (Render, Railway, etc.)

## Environment Variables

The following environment variables must be configured in your hosting platform:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `SECRET_KEY` | Flask secret key for sessions | `your-super-secret-key-here` |
| `ALLOWED_ORIGIN` | Frontend URL for CORS | `https://yourportfolio.netlify.app` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PORT` | Server port | `8000` | `8000` |
| `WEB_CONCURRENCY` | Number of Gunicorn workers | `2` | `4` |
| `SENDGRID_API_KEY` | SendGrid API key for emails | None | `SG.xxx...` |
| `ADMIN_USER` | Admin panel username | `admin` | `admin` |
| `ADMIN_PASS` | Admin panel password | `admin` | `secure-password` |
| `FLASK_ENV` | Flask environment | `production` | `production` |

### Email Configuration (Alternative to SendGrid)

If not using SendGrid, configure SMTP:

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_SERVER` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USERNAME` | SMTP username | `your-email@gmail.com` |
| `SMTP_PASSWORD` | SMTP password | `your-app-password` |
| `SMTP_USE_TLS` | Use TLS encryption | `true` |

## Deployment Steps

### 1. Platform-Specific Setup

#### Render
1. Connect your GitHub repository
2. Choose "Web Service"
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn --config gunicorn.conf.py app:app`
5. Add environment variables in the dashboard

#### Railway
1. Connect your GitHub repository
2. Railway will auto-detect the Python app
3. Add environment variables in the dashboard
4. Deploy automatically triggers on git push

#### Heroku
1. Create a new Heroku app
2. Add PostgreSQL addon: `heroku addons:create heroku-postgresql:mini`
3. Set environment variables: `heroku config:set KEY=value`
4. Deploy: `git push heroku main`

### 2. Database Setup

The `Procfile` includes a release command that runs migrations automatically:

```
release: alembic upgrade head
```

For manual migration:
```bash
python deploy.py
```

### 3. Initial Data Seeding

After deployment, seed the database with sample content:

```bash
# SSH into your deployment environment
python seed.py
```

## File Structure

```
backend/
├── Procfile              # Process definitions for hosting platforms
├── gunicorn.conf.py      # Gunicorn WSGI server configuration
├── deploy.py             # Deployment script with health checks
├── requirements.txt      # Python dependencies
├── app.py               # Main Flask application
├── models.py            # Database models
├── migrations/          # Alembic database migrations
└── DEPLOYMENT.md        # This file
```

## Health Checks

The API includes a health check endpoint for monitoring:

```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "message": "Portfolio API is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "connected",
  "version": "1.0.0"
}
```

## Monitoring and Logging

### Application Logs

The application logs to stdout/stderr, which most platforms capture automatically:

- Request/response logging
- Error logging with stack traces
- Rate limit violations
- Database connection issues

### Performance Monitoring

Consider adding these monitoring tools:

- **Sentry**: Error tracking and performance monitoring
- **New Relic**: Application performance monitoring
- **DataDog**: Infrastructure and application monitoring

## Security Considerations

### Environment Variables
- Never commit secrets to version control
- Use platform-specific secret management
- Rotate secrets regularly (especially SECRET_KEY and database passwords)

### Database Security
- Use connection pooling (configured in gunicorn.conf.py)
- Enable SSL for database connections in production
- Regular database backups

### CORS Configuration
- Set ALLOWED_ORIGIN to your exact frontend URL
- Never use wildcards (*) in production

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check database server accessibility
   - Ensure database exists and user has permissions

2. **Migration Failures**
   - Check database permissions
   - Verify migration files are included in deployment
   - Run migrations manually if needed

3. **CORS Errors**
   - Verify ALLOWED_ORIGIN matches frontend URL exactly
   - Check for trailing slashes in URLs

4. **Email Not Sending**
   - Verify SendGrid API key is correct
   - Check SendGrid account status
   - Review application logs for email errors

### Debug Commands

```bash
# Check environment variables
env | grep -E "(DATABASE_URL|SECRET_KEY|ALLOWED_ORIGIN)"

# Test database connection
python -c "from app import create_app; app = create_app(); app.app_context().push(); from models import db; db.session.execute('SELECT 1')"

# Run health check
curl https://your-api-url.com/health

# Check logs (platform-specific)
# Render: View in dashboard
# Railway: railway logs
# Heroku: heroku logs --tail
```

## Scaling Considerations

### Horizontal Scaling
- Increase WEB_CONCURRENCY for more Gunicorn workers
- Use load balancer for multiple instances
- Consider Redis for session storage if scaling beyond single instance

### Database Scaling
- Connection pooling (already configured)
- Read replicas for high-traffic sites
- Database indexing for frequently queried fields

### Caching
- Add Redis for API response caching
- CDN for static assets (project images)
- Browser caching headers (already implemented)

## Backup and Recovery

### Database Backups
- Enable automatic backups on your hosting platform
- Test restore procedures regularly
- Consider cross-region backups for critical data

### Application Backups
- Code is backed up in Git repository
- Environment variables should be documented securely
- Media files (uploaded images) should be backed up separately

## Cost Optimization

### Free Tier Options
- **Render**: Free tier with limitations
- **Railway**: $5/month starter plan
- **Heroku**: Free tier discontinued, paid plans start at $7/month

### Database Costs
- Start with smallest PostgreSQL instance
- Monitor connection usage
- Consider connection pooling for cost efficiency

### Monitoring Costs
- Use platform-provided monitoring first
- Add third-party monitoring as traffic grows
- Set up billing alerts