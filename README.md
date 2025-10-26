# Portfolio Website

A modern, responsive personal portfolio website built with Angular 17+ frontend and Flask backend. Features a clean two-column layout with sticky navigation, dark/light theme toggle, project showcase, experience timeline, and contact form with admin content management.

## ✨ Features

### Frontend Features
- **Modern Angular 17+** with standalone components and Vite build system
- **Responsive Design** with mobile-first approach using Tailwind CSS
- **Dark/Light Theme** with system preference detection and localStorage persistence
- **Smooth Scroll Navigation** with scroll-spy highlighting active sections
- **Optimized Images** using Angular's ngOptimizedImage with lazy loading
- **Accessibility First** with WCAG AA compliance and keyboard navigation
- **Performance Optimized** targeting Lighthouse scores ≥ 95
- **SEO Ready** with meta tags, OpenGraph, Twitter Cards, and structured data

### Backend Features
- **RESTful API** built with Flask 3+ and SQLAlchemy ORM
- **Admin Panel** using Flask-Admin for easy content management
- **Contact Form** with rate limiting and email notifications
- **Database Migrations** using Alembic for schema versioning
- **Image Upload** with validation and automatic processing
- **CORS Configuration** for secure cross-origin requests

### Content Management
- **Projects Showcase** with featured project highlighting and technology tags
- **Experience Timeline** with expandable details and duration calculation
- **Contact Messages** with admin interface for managing inquiries
- **Site Metadata** for hero content, bio, and social links

## 🏗️ Project Structure

```
portfolio-website/
├── frontend/                    # Angular 17+ application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # UI components
│   │   │   │   ├── sidebar/     # Navigation sidebar
│   │   │   │   ├── hero/        # Hero section
│   │   │   │   ├── about/       # About section
│   │   │   │   ├── experience/  # Experience timeline
│   │   │   │   ├── projects/    # Projects grid
│   │   │   │   ├── contact/     # Contact form
│   │   │   │   └── shared/      # Reusable components
│   │   │   ├── services/        # Angular services
│   │   │   └── guards/          # Route guards
│   │   ├── assets/              # Static assets
│   │   └── styles/              # Global styles
│   ├── angular.json             # Angular CLI configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── package.json             # Frontend dependencies
├── backend/                     # Flask REST API
│   ├── routes/                  # API route blueprints
│   ├── models.py                # SQLAlchemy models
│   ├── schemas.py               # Marshmallow schemas
│   ├── admin.py                 # Flask-Admin configuration
│   ├── app.py                   # Flask application factory
│   ├── seed.py                  # Database seeding script
│   ├── requirements.txt         # Python dependencies
│   └── migrations/              # Alembic database migrations
├── content/                     # Static content and media
│   └── images/
│       └── projects/            # Project cover images
├── .kiro/                       # Kiro specs and configuration
│   └── specs/portfolio-website/ # Feature specifications
├── .husky/                      # Git hooks configuration
└── package.json                 # Root package.json with scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm/pnpm
- **Python 3.11+** with pip
- **Git** for version control

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd portfolio-website

# Install all dependencies (frontend + backend)
npm install
npm run install:all
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# (See Environment Variables section below)

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Set up database with sample data
cd ..
npm run db:reset
```

### 3. Start Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately in different terminals:
npm run dev:frontend  # Angular dev server on http://localhost:4200
npm run dev:backend   # Flask API on http://localhost:5001
```

### 4. Access the Application

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:5001
- **Admin Panel:** http://localhost:5001/admin (use credentials from .env)

## 🔧 Environment Variables

Create `backend/.env` from `backend/.env.example` and configure the following variables:

### Required Variables

```env
# Database Configuration
DATABASE_URL=sqlite:///portfolio.db
# For production: postgresql://user:password@host:port/database

# Email Configuration (for contact form)
SENDGRID_API_KEY=your_sendgrid_api_key_here
# Alternative: Use SMTP settings instead of SendGrid

# Admin Panel Authentication
ADMIN_USER=admin
ADMIN_PASS=your_secure_admin_password

# CORS Configuration
ALLOWED_ORIGIN=http://localhost:4200
# For production: https://yourdomain.com

# Flask Security
SECRET_KEY=your_very_secure_secret_key_here
# Generate with: python -c "import secrets; print(secrets.token_hex(32))"

# Environment
FLASK_ENV=development
# For production: FLASK_ENV=production
```

### Optional Variables

```env
# SMTP Configuration (alternative to SendGrid)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Rate Limiting
CONTACT_RATE_LIMIT=5 per hour
API_RATE_LIMIT=100 per minute

# File Upload
MAX_CONTENT_LENGTH=5242880  # 5MB in bytes
UPLOAD_FOLDER=content/images/projects

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/portfolio.log
```

## 🗄️ Database Setup and Seeding

### Initial Database Setup

```bash
# Create database and run all migrations
npm run db:migrate

# Populate with sample data
npm run db:seed

# Or do both in one command
npm run db:reset
```

### Database Seeding Process

The seeding script (`backend/seed.py`) populates the database with:

1. **Sample Projects** (9 total):
   - 3 featured projects with enhanced styling
   - 6 regular projects
   - Each with title, description, tech stack, GitHub/demo links, and cover images

2. **Experience Entries** (3-5 entries):
   - Company, role, location, dates
   - Bullet points describing responsibilities
   - Technology tags for each role

3. **Site Metadata**:
   - Hero title and subtitle
   - Bio content in Markdown format
   - Social media links (GitHub, LinkedIn, Twitter)

4. **Sample Images**:
   - Project cover images in WebP format
   - Profile/avatar images
   - Optimized for web delivery

### Managing Database Changes

```bash
# Create a new migration after model changes
cd backend
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
npm run db:migrate

# Reset database completely (useful for development)
npm run db:reset
```

## 💻 Local Development Workflow

### Daily Development Process

1. **Start Development Environment:**
   ```bash
   # Start both servers with hot reload
   npm run dev
   ```

2. **Make Changes:**
   - Frontend changes auto-reload in browser
   - Backend changes auto-reload Flask server
   - Database changes require running migrations

3. **Code Quality Checks:**
   ```bash
   # Format code (runs automatically on commit)
   npm run format
   
   # Lint code
   npm run lint
   
   # Fix linting issues automatically
   npm run lint:fix
   ```

4. **Database Updates:**
   ```bash
   # After changing models, create migration
   npm run db:migrate:create "description"
   
   # Apply migrations
   npm run db:migrate
   
   # Add new sample data
   npm run db:seed
   ```

### Available Development Scripts

#### Core Development
```bash
npm run dev                    # Run both frontend and backend
npm run dev:frontend          # Angular dev server (port 4200)
npm run dev:backend           # Flask dev server (port 5001)
```

#### Installation
```bash
npm run install:all           # Install all dependencies
npm run install:frontend      # Install frontend dependencies only
npm run install:backend       # Install backend dependencies only
```

#### Database Management
```bash
npm run db:migrate            # Apply database migrations
npm run db:migrate:create     # Create new migration
npm run db:seed               # Populate with sample data
npm run db:reset              # Fresh database with sample data
```

#### Code Quality
```bash
npm run lint                  # Lint both frontend and backend
npm run lint:fix              # Auto-fix linting issues
npm run format                # Format all code
npm run format:check          # Check formatting without changes
npm run precommit             # Run pre-commit checks
```

#### Building
```bash
npm run build:frontend        # Build Angular for production
npm run build:backend         # Prepare backend for deployment
```

### Git Workflow

The project uses Husky for pre-commit hooks that automatically:
- Format code with Prettier (frontend) and Black (backend)
- Lint code with ESLint (frontend) and Ruff (backend)
- Prevent commits with formatting or linting errors

```bash
# Hooks run automatically on commit
git add .
git commit -m "Your commit message"

# Or run checks manually
npm run precommit
```

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

#### Netlify Deployment

1. **Build Configuration** (`netlify.toml`):
   ```toml
   [build]
     command = "cd frontend && npm run build"
     publish = "frontend/dist/portfolio/browser"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Environment Variables** (in Netlify dashboard):
   ```
   API_BASE_URL=https://your-backend-url.com
   NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   # Build locally to test
   cd frontend
   npm run build
   
   # Deploy via Git integration or CLI
   netlify deploy --prod --dir=dist/portfolio/browser
   ```

#### Vercel Deployment

1. **Configuration** (`vercel.json`):
   ```json
   {
     "buildCommand": "cd frontend && npm run build",
     "outputDirectory": "frontend/dist/portfolio/browser",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

2. **Deploy:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

### Backend Deployment (Render/Railway)

#### Render Deployment

1. **Configuration** (`render.yaml`):
   ```yaml
   services:
     - type: web
       name: portfolio-backend
       env: python
       buildCommand: "pip install -r requirements.txt"
       startCommand: "gunicorn --bind 0.0.0.0:$PORT app:app"
       envVars:
         - key: PYTHON_VERSION
           value: 3.11.0
   ```

2. **Environment Variables** (in Render dashboard):
   ```
   DATABASE_URL=postgresql://...
   SENDGRID_API_KEY=your_key
   ADMIN_USER=admin
   ADMIN_PASS=secure_password
   ALLOWED_ORIGIN=https://your-frontend-domain.com
   SECRET_KEY=your_secret_key
   FLASK_ENV=production
   ```

3. **Deploy:**
   - Connect GitHub repository
   - Set build and start commands
   - Configure environment variables
   - Deploy automatically on push to main

#### Railway Deployment

1. **Configuration** (`railway.toml`):
   ```toml
   [build]
   builder = "NIXPACKS"
   
   [deploy]
   startCommand = "gunicorn --bind 0.0.0.0:$PORT app:app"
   ```

2. **Deploy:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway link
   railway up
   ```

### Production Environment Setup

1. **Database Migration:**
   ```bash
   # Run migrations on production database
   flask db upgrade
   
   # Seed production data (optional)
   python seed.py
   ```

2. **SSL/HTTPS:**
   - Frontend: Automatic with Netlify/Vercel
   - Backend: Configure through hosting platform

3. **Domain Configuration:**
   - Update CORS settings with production domain
   - Configure DNS records
   - Update environment variables

## 📝 Content Management Guide

### Accessing the Admin Panel

1. Navigate to `http://localhost:5001/admin` (or your production URL)
2. Login with credentials from your `.env` file
3. Use the navigation menu to manage different content types

### Managing Projects

#### Adding a New Project

1. **Navigate to Projects** in the admin sidebar
2. **Click "Create"** to add a new project
3. **Fill in the form:**
   - **Title:** Project name (slug auto-generated)
   - **Short Description:** Brief summary for project cards (max 500 chars)
   - **Long Description:** Detailed Markdown description
   - **Tech Stack:** Comma-separated list (e.g., "React, Node.js, MongoDB")
   - **GitHub URL:** Link to source code repository
   - **Demo URL:** Link to live demo/deployment
   - **Cover Image:** Upload project screenshot/logo
   - **Featured:** Check to highlight in featured section
   - **Order Index:** Number for custom sorting (lower = higher priority)

4. **Click "Save"** - changes appear immediately on the website

#### Project Image Guidelines

- **Format:** JPG, PNG, or WebP
- **Size:** Recommended 800x600px or 16:9 aspect ratio
- **File Size:** Maximum 5MB
- **Content:** Screenshots, logos, or representative images

### Managing Experience

#### Adding Work Experience

1. **Navigate to Experience** in the admin sidebar
2. **Click "Create"** to add a new entry
3. **Fill in the details:**
   - **Company:** Organization name
   - **Role:** Job title/position
   - **Location:** City, State/Country or "Remote"
   - **Start Date:** Employment start date
   - **End Date:** Leave blank for current position
   - **Responsibilities:** One bullet point per line
   - **Technologies:** Comma-separated tech stack
   - **Order Index:** For custom sorting

4. **Click "Save"** to publish

#### Experience Content Tips

- **Bullet Points:** Start with action verbs (Built, Developed, Managed)
- **Quantify Results:** Include metrics when possible (increased by 30%)
- **Tech Stack:** List relevant technologies used in the role
- **Chronological Order:** Use order index to control timeline sequence

### Managing Site Metadata

#### Updating Hero Section

1. **Navigate to Site Meta** in the admin sidebar
2. **Edit the single record:**
   - **Hero Title:** Main heading (your name)
   - **Hero Subtitle:** Tagline or role description
   - **Bio:** About section content in Markdown format
   - **Social Links:** JSON array of social media profiles

3. **Social Links Format:**
   ```json
   [
     {
       "platform": "GitHub",
       "url": "https://github.com/username",
       "icon": "github"
     },
     {
       "platform": "LinkedIn", 
       "url": "https://linkedin.com/in/username",
       "icon": "linkedin"
     }
   ]
   ```

### Managing Contact Messages

#### Viewing Inquiries

1. **Navigate to Contact Messages** in the admin sidebar
2. **View all submissions** with name, email, message, and date
3. **Mark as "Replied"** when you've responded to an inquiry
4. **Export to CSV** for backup or external processing

#### Contact Form Features

- **Rate Limited:** 5 submissions per hour per IP address
- **Email Notifications:** Automatic emails sent to admin
- **Spam Protection:** Basic validation and rate limiting
- **Message Storage:** All submissions stored in database

### Content Best Practices

#### Writing Effective Project Descriptions

- **Short Description:** Focus on the problem solved and key technologies
- **Long Description:** Include project goals, challenges, solutions, and results
- **Use Markdown:** Format with headers, lists, and links for better readability
- **Include Links:** Always provide GitHub and demo links when available

#### SEO Optimization

- **Project Titles:** Use descriptive, keyword-rich titles
- **Descriptions:** Include relevant technologies and industry terms
- **Images:** Use descriptive filenames and alt text
- **Bio Content:** Include your skills and expertise areas

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**Backend won't start:**
```bash
# Check Python version
python --version  # Should be 3.11+

# Activate virtual environment
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install/update dependencies
pip install -r requirements.txt

# Check for missing environment variables
cat .env  # Ensure all required variables are set
```

**Database connection errors:**
```bash
# Reset database completely
npm run db:reset

# Or step by step:
cd backend
rm portfolio.db  # Remove SQLite database
flask db upgrade  # Run migrations
python seed.py   # Add sample data
```

**Admin panel login issues:**
```bash
# Check admin credentials in .env
grep ADMIN_ backend/.env

# Reset admin password
# Edit ADMIN_PASS in .env and restart backend
```

**Email sending failures:**
```bash
# Check SendGrid API key
grep SENDGRID backend/.env

# Test email configuration
cd backend
python -c "
from app import create_app
app = create_app()
# Check if email service initializes without errors
"
```

#### Frontend Issues

**Frontend build errors:**
```bash
# Clear Angular cache
cd frontend
rm -rf .angular/cache
rm -rf node_modules
npm install

# Check Node.js version
node --version  # Should be 18+

# Rebuild with verbose output
npm run build -- --verbose
```

**API connection issues:**
```bash
# Check API URL in environment
grep API_BASE_URL frontend/src/environments/

# Verify backend is running
curl http://localhost:5001/health

# Check CORS configuration
grep ALLOWED_ORIGIN backend/.env
```

**Styling/CSS issues:**
```bash
# Rebuild Tailwind CSS
cd frontend
npm run build:css

# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

#### Development Environment Issues

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :4200  # Frontend port
lsof -i :5001  # Backend port

# Kill processes if needed
kill -9 <PID>

# Use different ports
# Frontend: Change in angular.json
# Backend: Set PORT in .env
```

**Permission errors (macOS/Linux):**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Fix Python permissions
sudo chown -R $(whoami) backend/venv

# Make scripts executable
chmod +x backend/start.sh
```

**Git hooks not working:**
```bash
# Reinstall Husky hooks
npm run prepare

# Check hook permissions
ls -la .husky/
chmod +x .husky/pre-commit

# Test hooks manually
npm run precommit
```

#### Database Issues

**Migration errors:**
```bash
# Check migration status
cd backend
flask db current
flask db history

# Reset migrations (development only)
rm -rf migrations/
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

**Seed data issues:**
```bash
# Clear and reseed
cd backend
python -c "
from app import create_app, db
app = create_app()
with app.app_context():
    db.drop_all()
    db.create_all()
"
python seed.py
```

### Performance Issues

**Slow loading times:**
```bash
# Check image sizes in content/images/projects/
# Optimize images: convert to WebP, resize to max 800px width

# Analyze bundle size
cd frontend
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/portfolio/browser/stats.json
```

**High memory usage:**
```bash
# Check for memory leaks in development
# Restart development servers periodically
npm run dev

# Monitor backend memory
cd backend
pip install memory-profiler
python -m memory_profiler app.py
```

### Getting Help

#### Debug Information to Collect

When reporting issues, include:

1. **Environment Details:**
   ```bash
   node --version
   python --version
   npm --version
   ```

2. **Error Messages:**
   - Full error output from terminal
   - Browser console errors (F12 → Console)
   - Network tab errors (F12 → Network)

3. **Configuration:**
   - Environment variables (without sensitive values)
   - Package versions from package.json and requirements.txt

4. **Steps to Reproduce:**
   - Exact commands run
   - Expected vs actual behavior
   - Screenshots if applicable

#### Development Tips

- **Use browser dev tools** to debug frontend issues
- **Check terminal output** for backend errors and logs
- **Use the admin panel** to verify data is saved correctly
- **Test API endpoints** directly with curl or Postman
- **Monitor network requests** to identify API issues
- **Clear caches** when experiencing unexpected behavior
- **Restart servers** after environment variable changes

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🎯 Next Steps

After setup, you can:

1. **Customize Content:** Use the admin panel to add your projects and experience
2. **Personalize Design:** Modify colors and styling in Tailwind configuration
3. **Add Features:** Extend the API and components for additional functionality
4. **Deploy:** Follow the deployment guides to publish your portfolio
5. **Monitor:** Set up analytics and performance monitoring

For questions or issues, please check the troubleshooting section above or create an issue in the repository.