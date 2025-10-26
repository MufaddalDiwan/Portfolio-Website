# Environment Configuration Guide

This document explains how to configure environment variables for both the frontend and backend components of the portfolio website.

## Frontend Environment Configuration

The Angular frontend uses environment files located in `frontend/src/environments/`:

### Development Environment (`environment.ts`)
Used when running `ng serve` or building with `--configuration=development`

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5001/api',
};
```

### Production Environment (`environment.prod.ts`)
Used when building with `--configuration=production` (default for `ng build`)

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.example.com/api', // UPDATE THIS
};
```

**Important**: Update the `apiBaseUrl` in `environment.prod.ts` to match your production backend URL.

## Backend Environment Configuration

The Flask backend uses environment variables loaded from a `.env` file in the `backend/` directory.

### Setup Instructions

1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env` with your actual values (see variable descriptions below)

### Required Environment Variables

#### DATABASE_URL
- **Description**: Database connection string
- **Development**: `sqlite:///portfolio.db` (relative to backend directory)
- **Production**: PostgreSQL URL from your hosting provider
- **Example**: `postgresql://user:password@hostname:5432/database_name`

#### SENDGRID_API_KEY
- **Description**: SendGrid API key for sending contact form emails
- **Required**: Yes (for contact form functionality)
- **How to get**: 
  1. Create account at [SendGrid](https://sendgrid.com)
  2. Go to Settings > API Keys
  3. Create a new API key with "Mail Send" permissions
- **Example**: `SG.abc123...`

#### ADMIN_USER
- **Description**: Username for Flask-Admin panel access
- **Default**: `admin`
- **Security**: Use a unique username in production

#### ADMIN_PASS
- **Description**: Password for Flask-Admin panel access
- **Security**: Use a strong password in production
- **Example**: `MySecurePassword123!`

#### ALLOWED_ORIGIN
- **Description**: Frontend URL allowed to make CORS requests
- **Development**: `http://localhost:4200`
- **Production**: Your frontend domain (e.g., `https://yourdomain.com`)
- **Important**: Must match exactly (no trailing slash)

#### SECRET_KEY
- **Description**: Flask secret key for sessions and security
- **Security**: Must be random and secure in production
- **Generate**: `python -c "import secrets; print(secrets.token_hex(32))"`
- **Example**: `a1b2c3d4e5f6...` (64 characters)

#### Optional Variables

#### ADMIN_EMAIL
- **Description**: Email address to receive contact form submissions
- **Default**: Uses the same email configured in SendGrid
- **Example**: `contact@yourdomain.com`

#### PORT
- **Description**: Port for Flask development server
- **Default**: `5001`
- **Production**: Usually set by hosting provider

#### FLASK_ENV
- **Description**: Flask environment mode
- **Development**: `development`
- **Production**: `production`

## Environment File Security

### Important Security Notes

1. **Never commit `.env` files** to version control
2. The `.env` file is already in `.gitignore`
3. Use strong, unique passwords and secret keys in production
4. Rotate secrets regularly
5. Use your hosting provider's secret management when possible

### Hosting Provider Setup

#### Frontend (Netlify/Vercel)
- Set `API_BASE_URL` environment variable to your backend URL
- Example: `https://your-backend.railway.app/api`

#### Backend (Render/Railway)
- Set all environment variables in your hosting provider's dashboard
- Use PostgreSQL database URL provided by the hosting service
- Enable automatic deployments on git push

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure `ALLOWED_ORIGIN` exactly matches your frontend URL
2. **Database connection errors**: Check `DATABASE_URL` format and credentials
3. **Email not sending**: Verify `SENDGRID_API_KEY` is valid and has correct permissions
4. **Admin login fails**: Check `ADMIN_USER` and `ADMIN_PASS` values
5. **Frontend can't reach API**: Verify `apiBaseUrl` in environment files

### Testing Configuration

1. **Backend**: Run `python app.py` and check console for any environment variable errors
2. **Frontend**: Check browser network tab to see if API calls use correct URLs
3. **Email**: Test contact form submission and check SendGrid activity dashboard

## Development Workflow

1. **Initial Setup**:
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your values
   
   # Frontend - no setup needed, uses environment.ts by default
   ```

2. **Running Locally**:
   ```bash
   # Backend (from backend directory)
   python app.py
   
   # Frontend (from frontend directory)
   ng serve
   ```

3. **Production Build**:
   ```bash
   # Frontend
   ng build --configuration=production
   ```

The production build will automatically use `environment.prod.ts` values.