# Portfolio Website Design Document

## Overview

The Portfolio System is a full-stack web application consisting of an Angular 17+ single-page application (SPA) frontend and a Flask REST API backend. The architecture follows a clean separation of concerns with the frontend handling presentation and user interaction, while the backend manages data persistence, business logic, and content delivery through a RESTful API.

The system is designed for optimal performance (Lighthouse ≥ 95), accessibility (WCAG AA), and maintainability. Content is managed through Flask-Admin, allowing non-technical updates without code changes.

### Key Design Principles

1. **Separation of Concerns**: Frontend and backend are independently deployable
2. **API-First**: All data flows through well-defined REST endpoints
3. **Accessibility by Default**: WCAG AA compliance built into every component
4. **Performance-Focused**: Lazy loading, image optimization, and minimal bundle size
5. **Content-Driven**: Easy content updates through admin interface without deployments

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Visitor                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Angular Frontend (Netlify/Vercel)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Components: Sidebar, Hero, About, Experience,       │   │
│  │              Projects, Contact, Footer               │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Services: API, ScrollSpy, Theme                     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Guards, Interceptors, Directives                    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Flask Backend (Render/Railway)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes: /api/projects, /api/experience,            │   │
│  │          /api/contact, /api/meta                     │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Flask-Admin: /admin (CRUD interface)               │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Models: Project, Experience, ContactMessage,       │   │
│  │          SiteMeta                                    │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Middleware: CORS, Rate Limiting, Auth              │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         Database (SQLite dev / PostgreSQL prod)              │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- Angular 17+ with standalone components
- TypeScript 5+
- Tailwind CSS 3+ with Typography plugin
- Angular animations for subtle transitions
- Vite for fast builds
- PNPM for package management

**Backend:**
- Python 3.11+
- Flask 3+ with Blueprints
- SQLAlchemy 2+ ORM
- Alembic for migrations
- Marshmallow 3+ for serialization
- Flask-Admin for content management
- Flask-CORS for cross-origin requests
- Flask-Limiter for rate limiting
- SendGrid or SMTP for email

**Database:**
- SQLite (development)
- PostgreSQL (production)

**Deployment:**
- Frontend: Netlify or Vercel (static hosting)
- Backend: Render or Railway (container hosting)
- Media: Local filesystem with CDN option

## Components and Interfaces

### Frontend Components

#### 1. Core Layout Components

**SidebarComponent**
- Sticky positioning on desktop (position: sticky)
- Contains: avatar, name, role, bio, navigation links, social icons
- Responsive: transforms to top nav on mobile (<768px)
- Navigation items with scroll-spy highlighting
- Smooth scroll behavior to anchor sections

```typescript
interface SidebarConfig {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLink[];
  navItems: NavItem[];
}

interface NavItem {
  label: string;
  anchor: string;
  active: boolean;
}
```

**HomePageComponent**
- Container for all sections
- Implements scroll-spy logic
- Manages section visibility tracking
- Handles hash-based navigation

#### 2. Section Components

**HeroComponent**
- Large heading with name and tagline
- Animated entrance (fade + slide up)
- CTA button to scroll to projects or contact

**AboutComponent**
- Markdown-rendered bio content
- Skills/technologies list
- Profile image with optimization

**ExperienceComponent**
- Vertical timeline layout
- Experience cards with expand/collapse
- Date formatting and duration calculation
- Technology tags

```typescript
interface Experience {
  id: number;
  company: string;
  role: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  bullets: string[];
  tech: string[];
  orderIndex: number;
}
```

**ProjectsComponent**
- Grid layout (CSS Grid)
- Featured projects in larger cards
- Project cards with hover effects
- Filter toggle for featured/all
- Lazy-loaded images

```typescript
interface Project {
  id: number;
  title: string;
  slug: string;
  shortDesc: string;
  longMd: string;
  tech: string[];
  githubUrl: string;
  demoUrl: string;
  coverImage: string;
  featured: boolean;
  orderIndex: number;
  createdAt: Date;
}
```

**ContactComponent**
- Reactive form with validation
- Error messages for invalid inputs
- Success/error feedback after submission
- Rate limit handling

```typescript
interface ContactForm {
  name: string;
  email: string;
  message: string;
}
```

**FooterComponent**
- Copyright notice
- Built with attribution
- Social links (duplicate from sidebar)

#### 3. Shared Components

**SectionHeadingComponent**
- Consistent heading style across sections
- Intersection observer for reveal animation
- Numbered headings (01. About, 02. Experience, etc.)

**ProjectCardComponent**
- Reusable card for project display
- Image with aspect ratio preservation
- Tech tag pills
- External link icons
- Hover state with subtle lift

**TechTagComponent**
- Pill-style technology badges
- Consistent styling across experience and projects

### Frontend Services

**ApiService**
- Centralized HTTP client
- Environment-based API URL configuration
- Error handling and retry logic
- Response transformation (snake_case → camelCase)

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  getProjects(featured?: boolean): Observable<Project[]>
  getProjectBySlug(slug: string): Observable<Project>
  getExperience(): Observable<Experience[]>
  getMeta(): Observable<SiteMeta>
  submitContact(form: ContactForm): Observable<void>
}
```

**ScrollSpyService**
- IntersectionObserver-based section tracking
- Emits active section changes
- Configurable threshold and root margin
- Handles hash updates in URL

```typescript
@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  activeSection$: Observable<string>
  observeSections(sectionIds: string[]): void
  scrollToSection(sectionId: string): void
}
```

**ThemeService**
- Dark/light theme toggle
- LocalStorage persistence
- CSS variable updates
- System preference detection (prefers-color-scheme)

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentTheme$: Observable<'dark' | 'light'>
  toggleTheme(): void
  setTheme(theme: 'dark' | 'light'): void
}
```

### Backend Components

#### 1. Models (SQLAlchemy)

**Project Model**
```python
class Project(db.Model):
    __tablename__ = 'projects'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    short_desc = Column(String(500))
    long_md = Column(Text)
    tech = Column(JSON)  # List of strings
    github_url = Column(String(500))
    demo_url = Column(String(500))
    cover_image = Column(String(500))
    featured = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
```

**Experience Model**
```python
class Experience(db.Model):
    __tablename__ = 'experience'
    
    id = Column(Integer, primary_key=True)
    company = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    location = Column(String(200))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    bullets = Column(JSON)  # List of strings
    tech = Column(JSON)  # List of strings
    order_index = Column(Integer, default=0)
```

**ContactMessage Model**
```python
class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    replied = Column(Boolean, default=False)
```

**SiteMeta Model**
```python
class SiteMeta(db.Model):
    __tablename__ = 'site_meta'
    
    id = Column(Integer, primary_key=True)
    hero_title = Column(String(200))
    hero_subtitle = Column(String(500))
    bio_md = Column(Text)
    social_links = Column(JSON)  # List of {platform, url, icon}
```

#### 2. Schemas (Marshmallow)

**ProjectSchema**
- Serializes Project model to camelCase JSON
- Validates input for create/update operations
- Excludes internal fields from public API

**ExperienceSchema**
- Serializes Experience model to camelCase JSON
- Calculates duration field (derived)
- Formats dates as ISO strings

**ContactMessageSchema**
- Validates contact form input
- Email format validation
- Required field validation
- Max length constraints

**SiteMetaSchema**
- Serializes site metadata
- Validates social links structure

#### 3. Routes (Flask Blueprints)

**Projects Blueprint** (`/api/projects`)
- `GET /api/projects` - List projects with optional ?featured=true filter
- `GET /api/projects/<slug>` - Get single project by slug
- Ordered by order_index, then created_at DESC

**Experience Blueprint** (`/api/experience`)
- `GET /api/experience` - List all experience entries
- Ordered by start_date DESC

**Contact Blueprint** (`/api/contact`)
- `POST /api/contact` - Submit contact form
- Rate limited: 5 requests per hour per IP
- Sends email via SendGrid/SMTP
- Stores message in database

**Meta Blueprint** (`/api/meta`)
- `GET /api/meta` - Get site metadata (hero, bio, social links)

#### 4. Admin Interface (Flask-Admin)

**Admin Views**
- ProjectAdmin: CRUD for projects with image upload
- ExperienceAdmin: CRUD for experience entries
- ContactMessageAdmin: Read-only view with reply checkbox
- SiteMetaAdmin: Edit site metadata (single record)

**Authentication**
- Simple username/password from environment variables
- Session-based authentication
- No public registration

**File Upload**
- Image upload to `/content/images/projects/`
- File type validation (jpg, png, webp)
- File size limit (5MB)
- Automatic filename sanitization

## Data Models

### Entity Relationship Diagram

```
┌─────────────────────┐
│      Project        │
├─────────────────────┤
│ id (PK)             │
│ title               │
│ slug (unique)       │
│ short_desc          │
│ long_md             │
│ tech (JSON)         │
│ github_url          │
│ demo_url            │
│ cover_image         │
│ featured            │
│ order_index         │
│ created_at          │
└─────────────────────┘

┌─────────────────────┐
│    Experience       │
├─────────────────────┤
│ id (PK)             │
│ company             │
│ role                │
│ location            │
│ start_date          │
│ end_date (nullable) │
│ bullets (JSON)      │
│ tech (JSON)         │
│ order_index         │
└─────────────────────┘

┌─────────────────────┐
│  ContactMessage     │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email               │
│ message             │
│ created_at          │
│ replied             │
└─────────────────────┘

┌─────────────────────┐
│     SiteMeta        │
├─────────────────────┤
│ id (PK)             │
│ hero_title          │
│ hero_subtitle       │
│ bio_md              │
│ social_links (JSON) │
└─────────────────────┘
```

### Data Validation Rules

**Project:**
- title: required, max 200 chars
- slug: required, unique, lowercase, hyphenated
- tech: array of strings
- github_url, demo_url: valid URL format
- featured: boolean
- order_index: integer, default 0

**Experience:**
- company, role: required, max 200 chars
- start_date: required, valid date
- end_date: optional, must be after start_date if present
- bullets: array of strings, max 10 items
- tech: array of strings

**ContactMessage:**
- name: required, max 200 chars
- email: required, valid email format
- message: required, max 5000 chars

**SiteMeta:**
- social_links: array of objects with {platform, url, icon}

## Error Handling

### Frontend Error Handling

**HTTP Errors**
- 400 Bad Request: Display validation errors to user
- 401 Unauthorized: Redirect to login (admin only)
- 404 Not Found: Show "Content not found" message
- 429 Too Many Requests: Show rate limit message with retry time
- 500 Server Error: Show generic error message, log to console

**Network Errors**
- Offline detection: Show offline banner
- Timeout: Retry with exponential backoff (max 3 attempts)
- CORS errors: Log to console (dev environment only)

**Form Validation**
- Real-time validation on blur
- Display errors below fields
- Disable submit button until valid
- Clear errors on input change

### Backend Error Handling

**API Error Responses**
```python
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Invalid email format"]
    }
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVER_ERROR`: Internal server error

**Logging**
- All errors logged with timestamp, request ID, and stack trace
- Rate limit violations logged with IP address
- Contact form submissions logged (excluding message content)

**Email Failures**
- Contact form: Store message even if email fails
- Log email errors for manual follow-up
- Return success to user (don't expose email failures)

## Testing Strategy

### Frontend Testing

**Unit Tests (Jest)**
- Component tests for all major components
- Service tests for API, ScrollSpy, Theme services
- Directive tests for scroll-spy directive
- Pipe tests for date formatting, markdown rendering

**Component Test Examples:**
```typescript
describe('SidebarComponent', () => {
  it('should highlight active nav item based on scroll position')
  it('should toggle mobile menu on button click')
  it('should navigate to section on nav item click')
})

describe('ProjectCardComponent', () => {
  it('should display project title and description')
  it('should show featured badge when featured is true')
  it('should emit click event on card click')
})

describe('ContactComponent', () => {
  it('should validate email format')
  it('should disable submit button when form is invalid')
  it('should show success message after submission')
  it('should show error message on submission failure')
})
```

**E2E Tests (Playwright)**
- Navigation: Click nav items, verify scroll to section
- Scroll spy: Scroll page, verify active nav item updates
- Contact form: Submit valid form, verify success message
- Contact form: Submit invalid form, verify error messages
- Theme toggle: Click theme button, verify theme changes
- Mobile navigation: Open/close mobile menu
- Project filtering: Toggle featured filter, verify results

**E2E Test Examples:**
```typescript
test('should navigate to sections via sidebar', async ({ page }) => {
  await page.goto('/')
  await page.click('nav a[href="#projects"]')
  await expect(page.locator('#projects')).toBeInViewport()
})

test('should submit contact form successfully', async ({ page }) => {
  await page.goto('/#contact')
  await page.fill('input[name="name"]', 'John Doe')
  await page.fill('input[name="email"]', 'john@example.com')
  await page.fill('textarea[name="message"]', 'Hello!')
  await page.click('button[type="submit"]')
  await expect(page.locator('.success-message')).toBeVisible()
})
```

### Backend Testing

**Unit Tests (Pytest)**
- Model tests: CRUD operations, validation
- Schema tests: Serialization, deserialization, validation
- Route tests: All endpoints with various inputs
- Rate limiting tests: Verify rate limits enforced
- CORS tests: Verify CORS headers present

**Test Examples:**
```python
def test_create_project(db_session):
    """Test creating a project with valid data"""
    
def test_project_slug_uniqueness(db_session):
    """Test that duplicate slugs are rejected"""
    
def test_get_projects_featured_filter(client):
    """Test filtering projects by featured status"""
    
def test_contact_rate_limit(client):
    """Test that rate limit is enforced on contact endpoint"""
    
def test_cors_headers(client):
    """Test that CORS headers are present on API responses"""
```

**Integration Tests**
- Full request/response cycle for each endpoint
- Database transactions and rollbacks
- Email sending (mocked)
- File upload functionality

**Test Coverage Goals**
- Minimum 80% code coverage
- 100% coverage for critical paths (contact form, data retrieval)

### Performance Testing

**Lighthouse Audits**
- Run on production build
- Test on desktop and mobile
- Target scores: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95

**Load Testing**
- API endpoints: 100 concurrent requests
- Contact form: Verify rate limiting under load
- Database queries: Verify N+1 queries avoided

## Deployment Architecture

### Frontend Deployment (Netlify/Vercel)

**Build Configuration**
```json
{
  "build": {
    "command": "pnpm build",
    "publish": "dist/portfolio/browser"
  },
  "redirects": [
    {
      "source": "/*",
      "destination": "/index.html",
      "statusCode": 200
    }
  ]
}
```

**Environment Variables**
- `API_BASE_URL`: Backend API URL (e.g., https://api.example.com)
- `ENVIRONMENT`: production

**Optimizations**
- Brotli compression enabled
- HTTP/2 push for critical assets
- CDN caching for static assets
- Automatic HTTPS

### Backend Deployment (Render/Railway)

**Container Configuration**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD gunicorn --bind 0.0.0.0:$PORT app:app
```

**Environment Variables**
- `DATABASE_URL`: PostgreSQL connection string
- `SENDGRID_API_KEY`: SendGrid API key for emails
- `ADMIN_USER`: Admin username
- `ADMIN_PASS`: Admin password (hashed)
- `ALLOWED_ORIGIN`: Frontend URL for CORS
- `SECRET_KEY`: Flask secret key
- `FLASK_ENV`: production

**Database Migrations**
- Run Alembic migrations on deployment
- Automatic backup before migrations
- Rollback plan for failed migrations

**Health Checks**
- Endpoint: `GET /health`
- Returns: `{"status": "healthy", "timestamp": "..."}`
- Checks: Database connection, disk space

### CI/CD Pipeline

**Frontend Pipeline**
1. Install dependencies (pnpm install)
2. Run linter (eslint)
3. Run unit tests (jest)
4. Run E2E tests (playwright)
5. Build production bundle
6. Deploy to Netlify/Vercel

**Backend Pipeline**
1. Install dependencies (pip install)
2. Run linter (ruff, black)
3. Run unit tests (pytest)
4. Run migrations (alembic upgrade head)
5. Deploy to Render/Railway

**Triggers**
- Push to main branch: Deploy to production
- Pull request: Run tests, preview deployment
- Manual: Rollback to previous version

## Security Considerations

### Frontend Security

**Content Security Policy**
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://api.example.com;
```

**XSS Prevention**
- Angular's built-in sanitization for user content
- No innerHTML usage, use Angular's DomSanitizer when needed
- Markdown rendering with sanitization

### Backend Security

**Authentication**
- Admin panel: Session-based auth with secure cookies
- Password hashing: bcrypt with salt
- Session timeout: 24 hours

**Rate Limiting**
- Contact form: 5 requests/hour per IP
- API endpoints: 100 requests/minute per IP
- Admin login: 5 attempts/15 minutes per IP

**Input Validation**
- All inputs validated with Marshmallow schemas
- SQL injection prevention via SQLAlchemy ORM
- File upload validation: type, size, content

**CORS Configuration**
- Allow only frontend origin
- Credentials: true for admin routes
- Preflight caching: 24 hours

**Environment Variables**
- Never commit secrets to repository
- Use platform-specific secret management
- Rotate secrets regularly

## Accessibility Implementation

### Keyboard Navigation

**Focus Management**
- Visible focus indicators (2px outline)
- Logical tab order
- Skip to main content link
- Focus trap in mobile menu

**Keyboard Shortcuts**
- Tab: Navigate forward
- Shift+Tab: Navigate backward
- Enter/Space: Activate buttons/links
- Escape: Close mobile menu

### Screen Reader Support

**ARIA Attributes**
- `aria-current="page"` on active nav item
- `aria-label` on icon-only buttons
- `aria-live="polite"` for form feedback
- `role="navigation"` on nav elements

**Semantic HTML**
- Proper heading hierarchy (h1 → h2 → h3)
- `<nav>` for navigation
- `<main>` for main content
- `<article>` for projects/experience

### Visual Accessibility

**Color Contrast**
- Text: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

**Motion Preferences**
- Respect `prefers-reduced-motion`
- Disable animations when enabled
- Provide static alternatives

**Text Sizing**
- Base font size: 16px
- Relative units (rem, em)
- Scalable up to 200% without loss of functionality

## Performance Optimization

### Frontend Optimizations

**Code Splitting**
- Lazy load routes (if multi-page)
- Lazy load heavy components (markdown renderer)
- Dynamic imports for non-critical features

**Image Optimization**
- ngOptimizedImage directive
- Responsive images with srcset
- WebP format with fallbacks
- Lazy loading below fold
- Blur placeholder for loading state

**Bundle Optimization**
- Tree shaking enabled
- Minification and uglification
- Gzip/Brotli compression
- Remove unused CSS (PurgeCSS via Tailwind)

**Caching Strategy**
- Static assets: Cache-Control: max-age=31536000
- HTML: Cache-Control: no-cache
- API responses: Cache-Control: max-age=300

### Backend Optimizations

**Database Queries**
- Eager loading for relationships
- Indexing on frequently queried fields (slug, featured, order_index)
- Query result caching (Redis optional)

**Response Optimization**
- Gzip compression for JSON responses
- Pagination for large result sets (future)
- Field selection (future)

**Connection Pooling**
- SQLAlchemy connection pool
- Max connections: 20
- Pool timeout: 30 seconds

## SEO Implementation

### Meta Tags

**Base Template**
```html
<title>{{ name }} - {{ role }}</title>
<meta name="description" content="{{ bio_excerpt }}">
<link rel="canonical" href="https://example.com">

<!-- OpenGraph -->
<meta property="og:type" content="website">
<meta property="og:title" content="{{ name }} - {{ role }}">
<meta property="og:description" content="{{ bio_excerpt }}">
<meta property="og:image" content="{{ og_image_url }}">
<meta property="og:url" content="https://example.com">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ name }} - {{ role }}">
<meta name="twitter:description" content="{{ bio_excerpt }}">
<meta name="twitter:image" content="{{ twitter_image_url }}">
```

### Structured Data

**Person Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "{{ name }}",
  "jobTitle": "{{ role }}",
  "url": "https://example.com",
  "sameAs": [
    "{{ github_url }}",
    "{{ linkedin_url }}",
    "{{ twitter_url }}"
  ]
}
```

**WebSite Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "{{ name }} Portfolio",
  "url": "https://example.com"
}
```

### Sitemap and Robots

**sitemap.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>{{ last_updated }}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**robots.txt**
```
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml
```

## Content Management Workflow

### Admin Panel Workflow

**Adding a New Project**
1. Log in to `/admin`
2. Navigate to Projects
3. Click "Create"
4. Fill in fields:
   - Title (auto-generates slug)
   - Short description (for cards)
   - Long description (Markdown)
   - Tech tags (comma-separated)
   - GitHub URL
   - Demo URL
   - Upload cover image
   - Check "Featured" if applicable
   - Set order index
5. Click "Save"
6. Project appears immediately on frontend (no deployment needed)

**Adding Experience**
1. Navigate to Experience in admin
2. Click "Create"
3. Fill in fields:
   - Company name
   - Role/title
   - Location
   - Start date
   - End date (leave blank for current)
   - Bullet points (one per line)
   - Tech tags (comma-separated)
   - Order index
4. Click "Save"

**Managing Contact Messages**
1. Navigate to Contact Messages
2. View all submissions
3. Mark as "Replied" when handled
4. Export to CSV for backup

### Content Update Frequency

- Projects: Add as completed
- Experience: Update when changing roles
- Bio/Meta: Update quarterly or as needed
- Contact messages: Review daily

## Future Enhancements

### Phase 2 Features (Post-MVP)

1. **Blog System**
   - Markdown-based blog posts
   - Syntax highlighting for code
   - Tags and categories
   - RSS feed

2. **Analytics Dashboard**
   - Page views by section
   - Popular projects
   - Contact form conversion rate
   - Visitor demographics

3. **Advanced Filtering**
   - Filter projects by technology
   - Search functionality
   - Sort options (date, popularity)

4. **Internationalization**
   - Multi-language support
   - Language switcher
   - Translated content in database

5. **Progressive Web App**
   - Service worker for offline support
   - Install prompt
   - Push notifications for new content

6. **Performance Monitoring**
   - Real User Monitoring (RUM)
   - Error tracking (Sentry)
   - Performance budgets

### Scalability Considerations

- **Caching Layer**: Redis for API response caching
- **CDN**: CloudFront or Cloudflare for global distribution
- **Database**: Read replicas for high traffic
- **Search**: Elasticsearch for full-text search
- **Media**: S3 or Cloudinary for image hosting
