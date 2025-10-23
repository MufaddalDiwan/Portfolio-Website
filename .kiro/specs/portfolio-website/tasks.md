# Implementation Plan

- [x] 1. Initialize project structure and tooling
  - Create root directory structure with /frontend and /backend folders
  - Initialize Angular 17+ project with standalone components using Angular CLI
  - Initialize Flask project with virtual environment and requirements.txt
  - Configure PNPM workspace or separate package management
  - Set up Git repository with .gitignore for both frontend and backend
  - Create /content/images/projects directory for media assets
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 14.5_

- [x] 2. Configure frontend build tooling and styling
  - Configure Vite as the Angular build tool in angular.json
  - Install and configure Tailwind CSS with Typography plugin
  - Create CSS variables file for theme management (dark/light)
  - Set up Tailwind configuration with custom colors and spacing
  - Create global styles file with base typography and reset
  - Configure PostCSS for Tailwind processing
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 4.1_

- [x] 3. Set up backend database and models
  - Install SQLAlchemy, Alembic, and database dependencies
  - Configure Flask app with SQLAlchemy database connection
  - Initialize Alembic for database migrations
  - Create Project model with all required fields (id, title, slug, short_desc, long_md, tech, github_url, demo_url, cover_image, featured, order_index, created_at)
  - Create Experience model with all required fields (id, company, role, location, start_date, end_date, bullets, tech, order_index)
  - Create ContactMessage model with all required fields (id, name, email, message, created_at, replied)
  - Create SiteMeta model with all required fields (id, hero_title, hero_subtitle, bio_md, social_links)
  - Generate initial Alembic migration for all models
  - _Requirements: 2.2, 2.3, 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 4. Implement backend schemas and serialization
  - Install Marshmallow for schema validation
  - Create ProjectSchema with camelCase serialization and validation rules
  - Create ExperienceSchema with camelCase serialization and date formatting
  - Create ContactMessageSchema with email validation and required field checks
  - Create SiteMetaSchema with social links structure validation
  - Implement snake_case to camelCase transformation utility
  - _Requirements: 2.4, 8.6, 13.1, 13.2, 13.3, 13.4_

- [x] 5. Build Flask REST API routes
  - Create Flask Blueprint for projects routes
  - Implement GET /api/projects endpoint with optional featured query parameter
  - Implement GET /api/projects/:slug endpoint for single project retrieval
  - Create Flask Blueprint for experience routes
  - Implement GET /api/experience endpoint returning ordered timeline entries
  - Create Flask Blueprint for meta routes
  - Implement GET /api/meta endpoint for site metadata
  - Add proper error handling and JSON responses for all endpoints
  - _Requirements: 8.1, 8.2, 8.3, 8.5, 8.6_

- [x] 6. Implement contact form backend
  - Create Flask Blueprint for contact routes
  - Implement POST /api/contact endpoint with request validation
  - Install and configure Flask-Limiter for rate limiting
  - Add rate limiting to contact endpoint (5 requests per hour per IP)
  - Install SendGrid or configure SMTP for email sending
  - Implement email sending functionality on contact form submission
  - Store contact message in database after validation
  - Return appropriate success/error responses
  - _Requirements: 7.2, 7.3, 7.4, 7.5, 8.4_

- [x] 7. Configure CORS and backend middleware
  - Install Flask-CORS
  - Configure CORS to allow only frontend origin from environment variable
  - Add request logging middleware
  - Add error handling middleware for consistent error responses
  - Configure JSON response formatting
  - _Requirements: 8.7_

- [x] 8. Set up Flask-Admin for content management
  - Install Flask-Admin
  - Configure Flask-Admin with custom templates
  - Implement basic authentication for admin panel using environment variables
  - Create ProjectAdmin view with CRUD operations
  - Create ExperienceAdmin view with CRUD operations
  - Create ContactMessageAdmin view (read-only with replied checkbox)
  - Create SiteMetaAdmin view for editing site metadata
  - Implement image upload functionality for project cover images with validation
  - Add file type and size validation for uploads
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 9. Create database seed script
  - Write seed.py script to populate initial data
  - Create 3 featured projects with sample data and images
  - Create 6 regular projects with sample data and images
  - Create 3-5 experience entries with realistic data
  - Create initial SiteMeta record with hero content and bio
  - Add sample social links (GitHub, LinkedIn, Twitter)
  - Include instructions for running seed script in comments
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [x] 10. Build Angular core services
  - Create ApiService with methods for all backend endpoints
  - Implement environment-based API URL configuration
  - Add HTTP error handling and retry logic in ApiService
  - Create ThemeService for dark/light theme management
  - Implement localStorage persistence for theme preference
  - Add system preference detection (prefers-color-scheme)
  - Create ScrollSpyService using IntersectionObserver
  - Implement section tracking and active section emission
  - Add hash URL update functionality to ScrollSpyService
  - _Requirements: 3.4, 4.1, 4.2, 4.3_

- [x] 11. Implement sidebar component
  - Create SidebarComponent with sticky positioning
  - Add avatar image with ngOptimizedImage
  - Display name, role, and bio from API
  - Implement navigation list with anchor links to sections
  - Add social links with icons
  - Integrate ScrollSpyService to highlight active nav item
  - Implement smooth scroll behavior on nav item click
  - Add aria-current attribute to active nav item
  - _Requirements: 3.1, 3.4, 10.3_

- [x] 12. Create responsive mobile navigation
  - Add mobile menu toggle button to SidebarComponent
  - Implement mobile menu overlay with animation
  - Transform sidebar to top navigation on mobile (<768px)
  - Add hamburger icon with open/close animation
  - Implement focus trap in mobile menu
  - Close mobile menu on navigation or outside click
  - Add keyboard support (Escape to close)
  - _Requirements: 3.2, 10.1_

- [x] 13. Build hero and about sections
  - Create HeroComponent with animated entrance
  - Display hero title and subtitle from API meta data
  - Add CTA button with scroll-to-section functionality
  - Create AboutComponent with bio content
  - Implement Markdown rendering for bio with sanitization
  - Add profile image with optimization
  - Implement section reveal animation using IntersectionObserver
  - _Requirements: 3.3, 4.5_

- [x] 14. Implement experience timeline component
  - Create ExperienceComponent with vertical timeline layout
  - Fetch experience data from API on component init
  - Display experience cards with company, role, location, and dates
  - Implement date formatting and duration calculation
  - Add bullet points list for each experience
  - Display technology tags for each entry
  - Implement expand/collapse functionality for experience details
  - Add timeline connector line styling
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 15. Build projects grid and cards
  - Create ProjectsComponent with CSS Grid layout
  - Fetch projects from API with featured filter option
  - Create ProjectCardComponent as reusable component
  - Display project cover image with ngOptimizedImage and lazy loading
  - Show project title, short description, and tech tags
  - Add GitHub and demo link buttons with icons
  - Implement featured project styling with larger cards
  - Add hover effects with subtle lift animation
  - Implement filter toggle for featured/all projects
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 16. Create contact form component
  - Create ContactComponent with reactive form
  - Add form fields for name, email, and message
  - Implement real-time validation (email format, required fields)
  - Display validation error messages below fields
  - Disable submit button when form is invalid
  - Implement form submission to API
  - Show success message after successful submission
  - Handle and display rate limit errors (429 status)
  - Handle and display server errors with user-friendly messages
  - Clear form after successful submission
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 17. Implement shared components
  - Create SectionHeadingComponent with numbered headings
  - Add IntersectionObserver for reveal animation
  - Create TechTagComponent for technology badges
  - Style tech tags as pills with consistent design
  - Create FooterComponent with copyright and social links
  - Add "Built with" attribution in footer
  - _Requirements: 4.5_

- [x] 18. Configure routing and page structure
  - Set up Angular routing with single HomePageComponent
  - Configure hash-based navigation for sections
  - Implement HomePageComponent assembling all sections
  - Add scroll restoration on navigation
  - Preserve hash fragments in URL
  - Set up route guards if needed for future admin features
  - _Requirements: 3.3, 3.5_

- [x] 19. Implement theme toggle functionality
  - Add theme toggle button to sidebar
  - Connect toggle to ThemeService
  - Update CSS variables on theme change
  - Add smooth transition for theme switching
  - Display appropriate icon (sun/moon) based on current theme
  - Ensure theme persists across page reloads
  - _Requirements: 4.1, 4.2_

- [x] 20. Add accessibility features
  - Ensure all interactive elements have visible focus indicators
  - Implement keyboard navigation for all components
  - Add skip-to-main-content link
  - Verify proper heading hierarchy (h1 → h2 → h3)
  - Add ARIA labels to icon-only buttons
  - Implement aria-live regions for form feedback
  - Use semantic HTML (nav, main, article) throughout
  - Test color contrast ratios meet WCAG AA standards
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 21. Implement reduced motion support
  - Add prefers-reduced-motion media query detection
  - Disable animations when reduced motion is preferred
  - Provide static alternatives for animated content
  - Test with system reduced motion setting enabled
  - _Requirements: 4.3, 4.5, 10.4_

- [x] 22. Configure SEO meta tags
  - Add meta title and description tags in index.html
  - Implement OpenGraph meta tags for social sharing
  - Add Twitter Card meta tags
  - Include canonical URL tag
  - Create sitemap.xml file
  - Create robots.txt file
  - Add JSON-LD structured data for Person schema
  - Add JSON-LD structured data for WebSite schema
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [x] 23. Optimize images and assets
  - Configure ngOptimizedImage for all images
  - Add responsive image srcsets where applicable
  - Implement lazy loading for below-fold images
  - Add blur placeholders for loading states
  - Compress all sample project images
  - Convert images to WebP format with fallbacks
  - Preload critical assets (sidebar avatar)
  - _Requirements: 1.4, 11.5, 11.6_

- [ ] 24. Set up linting and formatting
  - Install and configure ESLint for TypeScript
  - Install and configure Prettier for frontend
  - Install and configure Ruff for Python linting
  - Install and configure Black for Python formatting
  - Create .eslintrc and .prettierrc configuration files
  - Create pyproject.toml or setup.cfg for Python tools
  - Add lint and format scripts to package.json
  - _Requirements: 14.1, 14.2_

- [ ] 25. Configure pre-commit hooks
  - Install Husky for Git hooks
  - Configure pre-commit hook to run linters
  - Add frontend format check to pre-commit
  - Add backend format check to pre-commit
  - Prevent commits with linting errors
  - _Requirements: 14.3, 14.4_

- [ ] 26. Create environment configuration
  - Create environment files for Angular (environment.ts, environment.prod.ts)
  - Add API_BASE_URL to environment configuration
  - Create .env.example for backend with all required variables
  - Document all environment variables (DATABASE_URL, SENDGRID_API_KEY, ADMIN_USER, ADMIN_PASS, ALLOWED_ORIGIN, SECRET_KEY)
  - Add .env to .gitignore
  - _Requirements: 15.3_

- [ ] 27. Set up frontend deployment configuration
  - Create netlify.toml or vercel.json for deployment
  - Configure build command and publish directory
  - Add redirect rules for SPA routing
  - Configure environment variables in hosting platform
  - Set up production API URL
  - Enable Brotli compression and HTTP/2
  - _Requirements: 15.1, 15.5_

- [ ] 28. Set up backend deployment configuration
  - Create Procfile or equivalent for hosting platform
  - Configure Gunicorn as WSGI server
  - Create requirements.txt with all dependencies
  - Set up database migration command for deployment
  - Configure health check endpoint (GET /health)
  - Document environment variable setup for production
  - _Requirements: 15.2, 15.3, 15.4_

- [ ] 29. Implement error handling and logging
  - Add global error handler in Angular
  - Implement HTTP interceptor for error handling
  - Add console logging for development errors
  - Implement backend error logging with timestamps
  - Create consistent error response format
  - Add rate limit violation logging
  - Log contact form submissions (excluding message content)
  - _Requirements: 7.5_

- [ ] 30. Create development scripts
  - Add npm script to run frontend dev server
  - Add npm script to run backend dev server
  - Create concurrently script to run both apps simultaneously
  - Add database migration scripts
  - Add seed data script
  - Document all scripts in package.json
  - _Requirements: 14.5, 17.4_

- [ ] 31. Write comprehensive README
  - Document project overview and features
  - Add setup instructions for both frontend and backend
  - List all required environment variables with descriptions
  - Document database seeding process
  - Explain local development workflow
  - Add deployment instructions for frontend and backend
  - Include content editing guide for Flask-Admin
  - Add troubleshooting section
  - Include screenshots or demo GIF
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_

- [ ] 32. Write frontend unit tests
  - Write Jest tests for SidebarComponent (nav highlighting, mobile toggle, navigation)
  - Write Jest tests for ProjectCardComponent (display, featured badge, click events)
  - Write Jest tests for ContactComponent (validation, submit button state, success/error messages)
  - Write Jest tests for ApiService (HTTP calls, error handling, response transformation)
  - Write Jest tests for ScrollSpyService (section tracking, hash updates)
  - Write Jest tests for ThemeService (toggle, persistence, system preference)
  - _Requirements: 16.1_

- [ ] 33. Write frontend E2E tests
  - Write Playwright test for navigation via sidebar clicks
  - Write Playwright test for scroll spy active item updates
  - Write Playwright test for contact form valid submission
  - Write Playwright test for contact form validation errors
  - Write Playwright test for theme toggle functionality
  - Write Playwright test for mobile menu open/close
  - Write Playwright test for project filtering
  - _Requirements: 16.2_

- [ ] 34. Write backend unit tests
  - Write Pytest tests for Project model CRUD operations
  - Write Pytest tests for slug uniqueness validation
  - Write Pytest tests for GET /api/projects with featured filter
  - Write Pytest tests for GET /api/projects/:slug endpoint
  - Write Pytest tests for GET /api/experience endpoint
  - Write Pytest tests for POST /api/contact with validation
  - Write Pytest tests for contact endpoint rate limiting
  - Write Pytest tests for CORS headers on API responses
  - Write Pytest tests for schema serialization and validation
  - _Requirements: 16.3_

- [ ] 35. Run Lighthouse audits and optimize
  - Build production frontend bundle
  - Run Lighthouse audit on desktop
  - Run Lighthouse audit on mobile
  - Verify Performance score ≥ 95
  - Verify Accessibility score ≥ 95
  - Verify Best Practices score ≥ 95
  - Verify SEO score ≥ 95
  - Address any issues found in audits
  - Take screenshots of final scores
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 36. Create demo content and documentation
  - Record screen capture showing scroll-spy functionality
  - Record timeline expand/collapse interaction
  - Record featured projects hover effects
  - Record contact form submission flow
  - Record theme toggle demonstration
  - Create GIF or short video clip from recordings
  - Add demo link to README
  - _Requirements: 17.1_
