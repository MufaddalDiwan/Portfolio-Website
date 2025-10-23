# Requirements Document

## Introduction

This document specifies the requirements for a personal portfolio website built with Angular and Flask. The system enables a developer to showcase their work through a modern, accessible, and performant single-page application with a content management backend. The design draws inspiration from brittanychiang.com's layout patterns while maintaining high accessibility and performance standards.

## Glossary

- **Portfolio System**: The complete web application comprising the Angular frontend and Flask backend
- **Admin Panel**: The Flask-Admin interface for content management
- **Visitor**: An end user browsing the portfolio website
- **Content Manager**: The portfolio owner managing content through the Admin Panel
- **Scroll Spy**: A mechanism that highlights navigation items based on the currently visible section
- **Featured Project**: A project marked for prominent display with enhanced visual treatment
- **Timeline Entry**: An experience record displayed in chronological order
- **Contact Message**: A visitor inquiry submitted through the contact form
- **Lighthouse Score**: Google's web performance, accessibility, SEO, and best practices metric
- **API Service**: The Angular service handling HTTP communication with the backend
- **Rate Limiter**: A mechanism preventing excessive API requests from a single source

## Requirements

### Requirement 1: Frontend Architecture

**User Story:** As a Content Manager, I want a modern Angular-based frontend, so that visitors experience a fast and responsive portfolio interface.

#### Acceptance Criteria

1. THE Portfolio System SHALL use Angular version 17 or higher with TypeScript
2. THE Portfolio System SHALL use Tailwind CSS for styling with the Typography plugin enabled
3. THE Portfolio System SHALL use PNPM or npm as the package manager with Vite as the build tool
4. THE Portfolio System SHALL implement ngOptimizedImage for image optimization
5. THE Portfolio System SHALL use CSS variables for theme management

### Requirement 2: Backend Architecture

**User Story:** As a Content Manager, I want a Flask-based REST API, so that I can manage portfolio content through a structured backend.

#### Acceptance Criteria

1. THE Portfolio System SHALL use Python version 3.11 or higher with Flask framework
2. THE Portfolio System SHALL use SQLAlchemy with Alembic for database migrations
3. THE Portfolio System SHALL use Marshmallow for request and response schema validation
4. THE Portfolio System SHALL use Flask-Admin for the administrative interface
5. THE Portfolio System SHALL support SQLite for development and PostgreSQL for production environments

### Requirement 3: Layout and Navigation

**User Story:** As a Visitor, I want a clean two-column layout with sticky navigation, so that I can easily navigate between portfolio sections.

#### Acceptance Criteria

1. WHEN viewing on desktop, THE Portfolio System SHALL display a left sticky sidebar containing name, role, bio, social links, and section navigation
2. WHEN viewing on mobile, THE Portfolio System SHALL collapse to a single column with a top navigation menu
3. THE Portfolio System SHALL implement four main sections with anchor links: about, experience, projects, and contact
4. WHEN a Visitor scrolls, THE Portfolio System SHALL highlight the active section in the navigation using Scroll Spy
5. THE Portfolio System SHALL maintain hash fragments in the URL when navigating between sections

### Requirement 4: Theme and Visual Design

**User Story:** As a Visitor, I want a dark-themed interface with accessibility options, so that I can view the portfolio comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Portfolio System SHALL display a dark theme by default with a light theme toggle option
2. THE Portfolio System SHALL respect the user's prefers-color-scheme system preference
3. THE Portfolio System SHALL respect the user's prefers-reduced-motion system preference
4. THE Portfolio System SHALL use high contrast colors meeting WCAG AA standards
5. THE Portfolio System SHALL implement subtle reveal animations for section headings and cards

### Requirement 5: Project Display

**User Story:** As a Visitor, I want to view projects in an organized grid, so that I can explore the Content Manager's work effectively.

#### Acceptance Criteria

1. THE Portfolio System SHALL display projects in a responsive grid layout
2. WHEN a project is marked as featured, THE Portfolio System SHALL display it with enhanced visual prominence
3. THE Portfolio System SHALL display for each project: cover image, title, description, technology tags, and links to GitHub and live demo
4. THE Portfolio System SHALL lazy load project images using ngOptimizedImage
5. THE Portfolio System SHALL support filtering projects by featured status through the API

### Requirement 6: Experience Timeline

**User Story:** As a Visitor, I want to view work experience in a timeline format, so that I can understand the Content Manager's professional background.

#### Acceptance Criteria

1. THE Portfolio System SHALL display experience entries in a vertical timeline layout
2. THE Portfolio System SHALL display for each experience: company name, role, location, dates, and bullet points
3. THE Portfolio System SHALL display technology tags for each experience entry
4. THE Portfolio System SHALL order experience entries by start date in descending order
5. THE Portfolio System SHALL support expandable details for experience entries

### Requirement 7: Contact Form

**User Story:** As a Visitor, I want to submit inquiries through a contact form, so that I can communicate with the Content Manager.

#### Acceptance Criteria

1. THE Portfolio System SHALL provide a contact form with fields for name, email, and message
2. WHEN a Visitor submits the contact form, THE Portfolio System SHALL validate all required fields
3. WHEN the contact form is valid, THE Portfolio System SHALL send an email notification to the Content Manager
4. WHEN the contact form is valid, THE Portfolio System SHALL store the message in the database
5. THE Portfolio System SHALL apply rate limiting to contact form submissions by IP address

### Requirement 8: REST API

**User Story:** As a Frontend Developer, I want a well-structured REST API, so that the Angular application can retrieve and submit portfolio data.

#### Acceptance Criteria

1. THE Portfolio System SHALL provide GET /api/projects endpoint with optional featured query parameter
2. THE Portfolio System SHALL provide GET /api/projects/:slug endpoint for individual project details
3. THE Portfolio System SHALL provide GET /api/experience endpoint for timeline entries
4. THE Portfolio System SHALL provide POST /api/contact endpoint for contact form submissions
5. THE Portfolio System SHALL provide GET /api/meta endpoint for sidebar and hero content
6. THE Portfolio System SHALL return all API responses in camelCase JSON format
7. THE Portfolio System SHALL enable CORS only for the configured frontend origin

### Requirement 9: Content Management

**User Story:** As a Content Manager, I want an admin interface, so that I can create, update, and delete portfolio content without writing code.

#### Acceptance Criteria

1. THE Portfolio System SHALL provide a Flask-Admin interface secured with username and password authentication
2. THE Portfolio System SHALL allow CRUD operations for Projects through the Admin Panel
3. THE Portfolio System SHALL allow CRUD operations for Experience entries through the Admin Panel
4. THE Portfolio System SHALL support image upload to the projects directory with file validation
5. THE Portfolio System SHALL provide a publish checkbox to control content visibility in the API

### Requirement 10: Accessibility

**User Story:** As a Visitor with disabilities, I want an accessible website, so that I can navigate and consume content using assistive technologies.

#### Acceptance Criteria

1. THE Portfolio System SHALL make all interactive elements reachable via keyboard navigation
2. THE Portfolio System SHALL display visible focus indicators on all interactive elements
3. THE Portfolio System SHALL use aria-current="true" for the active navigation item
4. THE Portfolio System SHALL disable heavy animations when prefers-reduced-motion is enabled
5. THE Portfolio System SHALL maintain color contrast ratios meeting WCAG AA standards

### Requirement 11: Performance

**User Story:** As a Visitor, I want a fast-loading website, so that I can access portfolio content quickly on any device.

#### Acceptance Criteria

1. THE Portfolio System SHALL achieve a Lighthouse Performance score of 95 or higher
2. THE Portfolio System SHALL achieve a Lighthouse Accessibility score of 95 or higher
3. THE Portfolio System SHALL achieve a Lighthouse Best Practices score of 95 or higher
4. THE Portfolio System SHALL achieve a Lighthouse SEO score of 95 or higher
5. THE Portfolio System SHALL preload critical assets including the sidebar avatar image
6. THE Portfolio System SHALL compress all images before serving
7. THE Portfolio System SHALL defer non-critical JavaScript loading

### Requirement 12: SEO and Metadata

**User Story:** As a Content Manager, I want proper SEO implementation, so that search engines can discover and index my portfolio effectively.

#### Acceptance Criteria

1. THE Portfolio System SHALL include meta title and description tags on all pages
2. THE Portfolio System SHALL include OpenGraph meta tags for social media sharing
3. THE Portfolio System SHALL include Twitter Card meta tags for Twitter sharing
4. THE Portfolio System SHALL generate a sitemap.xml file
5. THE Portfolio System SHALL generate a robots.txt file
6. THE Portfolio System SHALL include JSON-LD structured data for Person and WebSite schemas

### Requirement 13: Data Models

**User Story:** As a Backend Developer, I want well-defined data models, so that portfolio content is stored consistently and can be queried efficiently.

#### Acceptance Criteria

1. THE Portfolio System SHALL define a Project model with fields: id, title, slug, short_desc, long_md, tech, github_url, demo_url, cover_image, featured, order_index, created_at
2. THE Portfolio System SHALL define an Experience model with fields: id, company, role, location, start_date, end_date, bullets, tech, order_index
3. THE Portfolio System SHALL define a ContactMessage model with fields: id, name, email, message, created_at, replied
4. THE Portfolio System SHALL define a SiteMeta model with fields: id, hero_title, hero_subtitle, bio_md, social_links
5. THE Portfolio System SHALL store tech and bullets fields as JSON arrays

### Requirement 14: Development Tooling

**User Story:** As a Developer, I want consistent code quality tools, so that the codebase maintains high standards and consistency.

#### Acceptance Criteria

1. THE Portfolio System SHALL use Ruff and Black for Python code linting and formatting
2. THE Portfolio System SHALL use Prettier and ESLint for TypeScript code linting and formatting
3. THE Portfolio System SHALL use Husky for pre-commit hooks
4. THE Portfolio System SHALL validate code formatting before allowing commits
5. THE Portfolio System SHALL provide npm scripts for running both frontend and backend concurrently

### Requirement 15: Deployment

**User Story:** As a Content Manager, I want the portfolio deployed to production hosting, so that visitors can access it on the public internet.

#### Acceptance Criteria

1. THE Portfolio System SHALL deploy the Angular frontend to Netlify or Vercel as a static site
2. THE Portfolio System SHALL deploy the Flask backend to Render or Railway
3. THE Portfolio System SHALL configure environment variables for database URL, email API key, admin credentials, and allowed CORS origin
4. THE Portfolio System SHALL use Gunicorn as the production WSGI server for Flask
5. THE Portfolio System SHALL configure the frontend to use the production API base URL

### Requirement 16: Testing

**User Story:** As a Developer, I want comprehensive test coverage, so that I can confidently make changes without breaking existing functionality.

#### Acceptance Criteria

1. THE Portfolio System SHALL include Jest unit tests for Angular components including sidebar, scroll-spy, and project cards
2. THE Portfolio System SHALL include Playwright end-to-end tests for navigation, anchor scrolling, and form submission
3. THE Portfolio System SHALL include Pytest tests for Flask models, schemas, and API routes
4. THE Portfolio System SHALL include tests for rate limiting functionality
5. THE Portfolio System SHALL include tests for CORS configuration

### Requirement 17: Documentation

**User Story:** As a Developer or Content Manager, I want clear documentation, so that I can set up, run, and maintain the portfolio system.

#### Acceptance Criteria

1. THE Portfolio System SHALL include a README with setup instructions
2. THE Portfolio System SHALL document all required environment variables
3. THE Portfolio System SHALL document the database seeding process
4. THE Portfolio System SHALL document local development workflow for running both applications
5. THE Portfolio System SHALL document deployment steps for both frontend and backend
6. THE Portfolio System SHALL include a content editing guide for the Admin Panel

### Requirement 18: Sample Content

**User Story:** As a Content Manager, I want the system seeded with sample content, so that I can see the portfolio fully styled and functional immediately after setup.

#### Acceptance Criteria

1. THE Portfolio System SHALL seed the database with 3 featured projects
2. THE Portfolio System SHALL seed the database with 6 regular projects
3. THE Portfolio System SHALL seed the database with 3 to 5 experience entries
4. THE Portfolio System SHALL seed the database with sample site metadata including hero content and bio
5. THE Portfolio System SHALL include sample project images in the content directory
