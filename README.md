# Portfolio Website

A modern personal portfolio website built with Angular 17+ frontend and Flask backend.

## Project Structure

```
portfolio-website/
├── frontend/          # Angular 17+ application
├── backend/           # Flask REST API
├── content/           # Static content and media
│   └── images/
│       └── projects/  # Project cover images
├── .kiro/            # Kiro specs and configuration
└── docs/             # Documentation
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

## Quick Start

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd portfolio-website
   npm install
   ```

2. **Install dependencies:**
   ```bash
   # Install all dependencies
   npm run install:all
   
   # Or install separately
   npm run install:frontend
   npm run install:backend
   ```

3. **Set up backend environment:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run development servers:**
   ```bash
   # Run both frontend and backend
   npm run dev
   
   # Or run separately
   npm run dev:frontend  # Angular dev server on http://localhost:4200
   npm run dev:backend   # Flask API on http://localhost:5001
   ```

## Development

### Frontend (Angular)
- **Framework:** Angular 17+ with standalone components
- **Styling:** Tailwind CSS
- **Build Tool:** Vite (via Angular CLI)
- **Package Manager:** npm/pnpm

### Backend (Flask)
- **Framework:** Flask 3+
- **Database:** SQLAlchemy with SQLite (dev) / PostgreSQL (prod)
- **API:** RESTful JSON API
- **Admin:** Flask-Admin interface

### Available Scripts

```bash
npm run dev              # Run both frontend and backend
npm run dev:frontend     # Run Angular dev server
npm run dev:backend      # Run Flask development server
npm run build:frontend   # Build Angular for production
npm run install:all      # Install all dependencies
```

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
DATABASE_URL=sqlite:///portfolio.db
SENDGRID_API_KEY=your_sendgrid_api_key
ADMIN_USER=admin
ADMIN_PASS=your_secure_password
ALLOWED_ORIGIN=http://localhost:4200
SECRET_KEY=your_secret_key
FLASK_ENV=development
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/projects` - List projects
- `GET /api/projects/:slug` - Get project by slug
- `GET /api/experience` - List experience entries
- `GET /api/meta` - Site metadata
- `POST /api/contact` - Submit contact form

## Admin Panel

Access the admin interface at `http://localhost:5001/admin` with the credentials set in your `.env` file.

## Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build:frontend
# Deploy contents of frontend/dist/
```

### Backend (Render/Railway)
```bash
# Set environment variables in hosting platform
# Deploy backend/ directory
```

## Contributing

1. Follow the task-based development workflow in `.kiro/specs/`
2. Run tests before committing
3. Follow the established code style

## License

MIT License - see LICENSE file for details