#!/usr/bin/env python3
"""
Database Seed Script for Portfolio Website

This script populates the database with sample data including:
- 3 featured projects
- 6 regular projects
- 3-5 experience entries
- Initial site metadata with hero content and bio
- Sample social links

Usage:
    python seed.py

Requirements:
    - Flask app must be configured with database connection
    - All models must be imported and available
    - Database tables must exist (run migrations first if needed)

Note: This script will clear existing data before seeding.
Use with caution in production environments.
"""

import os
import sys
from datetime import UTC, date, datetime

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import ContactMessage, Experience, Project, SiteMeta, db


def clear_existing_data():
    """Clear all existing data from tables"""
    print("Clearing existing data...")

    # Clear in reverse order of dependencies
    ContactMessage.query.delete()
    SiteMeta.query.delete()
    Experience.query.delete()
    Project.query.delete()

    db.session.commit()
    print("✓ Existing data cleared")


def seed_projects():
    """Create sample projects (3 featured + 6 regular)"""
    print("Seeding projects...")

    # Featured Projects
    featured_projects = [
        {
            "title": "E-Commerce Platform",
            "slug": "ecommerce-platform",
            "short_desc": "Full-stack e-commerce solution with React, Node.js, and PostgreSQL featuring real-time inventory management and payment processing.",
            "long_md": """# E-Commerce Platform

A comprehensive e-commerce solution built with modern web technologies. This platform provides a complete shopping experience with advanced features for both customers and administrators.

## Key Features

- **Real-time Inventory Management**: Live stock updates across all product pages
- **Secure Payment Processing**: Integration with Stripe and PayPal
- **Advanced Search & Filtering**: Elasticsearch-powered product discovery
- **Admin Dashboard**: Comprehensive analytics and order management
- **Mobile-First Design**: Responsive design optimized for all devices

## Technical Highlights

- Built with React 18 and TypeScript for type-safe frontend development
- Node.js and Express backend with PostgreSQL database
- Redis for session management and caching
- Docker containerization for consistent deployment
- Comprehensive test suite with Jest and Cypress

## Challenges Solved

- Implemented optimistic UI updates for better user experience
- Designed scalable database schema handling complex product variations
- Built real-time notification system using WebSockets
- Optimized performance with lazy loading and code splitting""",
            "tech": [
                "React",
                "TypeScript",
                "Node.js",
                "PostgreSQL",
                "Redis",
                "Stripe API",
                "Docker",
                "Elasticsearch",
            ],
            "github_url": "https://github.com/username/ecommerce-platform",
            "demo_url": "https://ecommerce-demo.example.com",
            "cover_image": "ecommerce-platform.jpg",
            "featured": True,
            "order_index": 1,
        },
        {
            "title": "Task Management Dashboard",
            "slug": "task-management-dashboard",
            "short_desc": "Collaborative project management tool with real-time updates, built using Vue.js, Python Flask, and WebSocket integration.",
            "long_md": """# Task Management Dashboard

A modern project management application designed for teams to collaborate effectively. Features real-time updates, intuitive drag-and-drop interfaces, and comprehensive project tracking.

## Core Features

- **Real-time Collaboration**: Live updates using WebSocket connections
- **Drag & Drop Interface**: Intuitive Kanban-style task management
- **Team Management**: Role-based access control and permissions
- **Time Tracking**: Built-in time logging and reporting
- **File Attachments**: Secure file upload and sharing

## Architecture

- Vue.js 3 with Composition API for reactive frontend
- Python Flask backend with SQLAlchemy ORM
- WebSocket integration using Socket.IO
- PostgreSQL for data persistence
- JWT authentication with refresh tokens

## Performance Optimizations

- Implemented virtual scrolling for large task lists
- Optimized database queries with eager loading
- Client-side caching with Vuex for offline capability
- Lazy loading of non-critical components""",
            "tech": [
                "Vue.js",
                "Python",
                "Flask",
                "PostgreSQL",
                "Socket.IO",
                "JWT",
                "Vuex",
                "Tailwind CSS",
            ],
            "github_url": "https://github.com/username/task-dashboard",
            "demo_url": "https://tasks-demo.example.com",
            "cover_image": "task-dashboard.jpg",
            "featured": True,
            "order_index": 2,
        },
        {
            "title": "Real-time Analytics Platform",
            "slug": "analytics-platform",
            "short_desc": "Data visualization platform processing millions of events daily, built with Angular, Python microservices, and Apache Kafka.",
            "long_md": """# Real-time Analytics Platform

A high-performance analytics platform capable of processing and visualizing millions of events in real-time. Built for enterprise-scale data processing with modern microservices architecture.

## System Capabilities

- **Real-time Processing**: Handle 1M+ events per minute
- **Interactive Dashboards**: Custom chart builder with D3.js
- **Data Pipeline**: ETL processes with Apache Kafka and Apache Spark
- **Multi-tenant Architecture**: Isolated data and customizable dashboards
- **API-First Design**: RESTful APIs with comprehensive documentation

## Technical Stack

- Angular 15+ with RxJS for reactive programming
- Python microservices using FastAPI
- Apache Kafka for event streaming
- ClickHouse for analytical queries
- Redis for real-time caching
- Kubernetes for container orchestration

## Scalability Features

- Horizontal scaling with load balancers
- Database sharding for improved query performance
- Caching strategies reducing response times by 80%
- Asynchronous processing with Celery workers""",
            "tech": [
                "Angular",
                "Python",
                "FastAPI",
                "Apache Kafka",
                "ClickHouse",
                "Redis",
                "Kubernetes",
                "D3.js",
            ],
            "github_url": "https://github.com/username/analytics-platform",
            "demo_url": "https://analytics-demo.example.com",
            "cover_image": "analytics-platform.jpg",
            "featured": True,
            "order_index": 3,
        },
    ]

    # Regular Projects
    regular_projects = [
        {
            "title": "Weather Forecast App",
            "slug": "weather-forecast-app",
            "short_desc": "Mobile-first weather application with location-based forecasts, interactive maps, and severe weather alerts.",
            "long_md": """# Weather Forecast App

A comprehensive weather application providing accurate forecasts, interactive weather maps, and real-time alerts. Built with a focus on user experience and accessibility.

## Features

- 7-day detailed weather forecasts
- Interactive radar and satellite maps
- Severe weather notifications
- Location-based automatic updates
- Offline data caching

## Implementation

Built using React Native for cross-platform compatibility, with a Node.js backend consuming multiple weather APIs for data accuracy.""",
            "tech": [
                "React Native",
                "Node.js",
                "Express",
                "MongoDB",
                "Weather APIs",
                "Push Notifications",
            ],
            "github_url": "https://github.com/username/weather-app",
            "demo_url": "https://weather-demo.example.com",
            "cover_image": "weather-app.jpg",
            "featured": False,
            "order_index": 4,
        },
        {
            "title": "Recipe Sharing Platform",
            "slug": "recipe-sharing-platform",
            "short_desc": "Social platform for sharing and discovering recipes with ingredient-based search and meal planning features.",
            "long_md": """# Recipe Sharing Platform

A social cooking platform where users can share recipes, plan meals, and discover new dishes. Features advanced search capabilities and community interaction.

## Key Features

- Recipe creation with step-by-step photos
- Ingredient-based search and filtering
- Meal planning calendar
- Shopping list generation
- User ratings and reviews

## Technology

Built with Next.js for server-side rendering, Prisma for database management, and Cloudinary for image optimization.""",
            "tech": [
                "Next.js",
                "Prisma",
                "PostgreSQL",
                "Cloudinary",
                "Tailwind CSS",
                "NextAuth.js",
            ],
            "github_url": "https://github.com/username/recipe-platform",
            "demo_url": "https://recipes-demo.example.com",
            "cover_image": "recipe-platform.jpg",
            "featured": False,
            "order_index": 5,
        },
        {
            "title": "Fitness Tracker API",
            "slug": "fitness-tracker-api",
            "short_desc": "RESTful API for fitness tracking applications with workout logging, progress analytics, and social features.",
            "long_md": """# Fitness Tracker API

A comprehensive REST API designed for fitness applications, providing endpoints for workout tracking, progress monitoring, and social fitness features.

## API Features

- Workout and exercise logging
- Progress tracking and analytics
- Social features (friends, challenges)
- Nutrition tracking integration
- Wearable device data sync

## Architecture

Built with Django REST Framework, featuring JWT authentication, rate limiting, and comprehensive API documentation with Swagger.""",
            "tech": [
                "Django",
                "Django REST Framework",
                "PostgreSQL",
                "Redis",
                "Celery",
                "JWT",
                "Swagger",
            ],
            "github_url": "https://github.com/username/fitness-api",
            "demo_url": "https://fitness-api-docs.example.com",
            "cover_image": "fitness-api.jpg",
            "featured": False,
            "order_index": 6,
        },
        {
            "title": "Markdown Blog Engine",
            "slug": "markdown-blog-engine",
            "short_desc": "Static site generator for blogs with Markdown support, syntax highlighting, and SEO optimization.",
            "long_md": """# Markdown Blog Engine

A fast and flexible static site generator specifically designed for technical blogs. Supports Markdown with extensions, syntax highlighting, and automatic SEO optimization.

## Features

- Markdown with code syntax highlighting
- Automatic SEO meta tag generation
- RSS feed generation
- Tag-based categorization
- Fast static site generation

## Technical Details

Built with Gatsby.js and GraphQL, featuring automatic image optimization, lazy loading, and progressive web app capabilities.""",
            "tech": ["Gatsby.js", "GraphQL", "Markdown", "Prism.js", "Netlify CMS", "PWA"],
            "github_url": "https://github.com/username/blog-engine",
            "demo_url": "https://blog-demo.example.com",
            "cover_image": "blog-engine.jpg",
            "featured": False,
            "order_index": 7,
        },
        {
            "title": "Expense Tracker Mobile App",
            "slug": "expense-tracker-app",
            "short_desc": "Cross-platform mobile app for personal finance management with budget tracking and spending analytics.",
            "long_md": """# Expense Tracker Mobile App

A comprehensive personal finance management app helping users track expenses, set budgets, and analyze spending patterns with intuitive visualizations.

## Core Features

- Expense categorization and tagging
- Budget setting and monitoring
- Spending analytics and reports
- Receipt photo capture and OCR
- Multi-currency support

## Development

Created using Flutter for cross-platform development, with Firebase backend for real-time data synchronization and offline support.""",
            "tech": ["Flutter", "Dart", "Firebase", "SQLite", "Chart.js", "OCR API"],
            "github_url": "https://github.com/username/expense-tracker",
            "demo_url": "https://expense-demo.example.com",
            "cover_image": "expense-tracker.jpg",
            "featured": False,
            "order_index": 8,
        },
        {
            "title": "Code Snippet Manager",
            "slug": "code-snippet-manager",
            "short_desc": "Developer tool for organizing and sharing code snippets with syntax highlighting and team collaboration features.",
            "long_md": """# Code Snippet Manager

A productivity tool for developers to organize, search, and share code snippets efficiently. Features advanced search capabilities and team collaboration tools.

## Features

- Syntax highlighting for 100+ languages
- Advanced search with tags and filters
- Team workspaces and sharing
- Version control for snippets
- Browser extension integration

## Implementation

Built with Svelte for the frontend and Supabase for backend services, featuring real-time collaboration and offline-first architecture.""",
            "tech": ["Svelte", "Supabase", "PostgreSQL", "Prism.js", "Browser Extension API"],
            "github_url": "https://github.com/username/snippet-manager",
            "demo_url": "https://snippets-demo.example.com",
            "cover_image": "snippet-manager.jpg",
            "featured": False,
            "order_index": 9,
        },
    ]

    # Create all projects
    all_projects = featured_projects + regular_projects

    for project_data in all_projects:
        project = Project(
            title=project_data["title"],
            slug=project_data["slug"],
            short_desc=project_data["short_desc"],
            long_md=project_data["long_md"],
            tech=project_data["tech"],
            github_url=project_data["github_url"],
            demo_url=project_data["demo_url"],
            cover_image=project_data["cover_image"],
            featured=project_data["featured"],
            order_index=project_data["order_index"],
            created_at=datetime.now(UTC),
        )
        db.session.add(project)

    db.session.commit()
    print(f"✓ Created {len(all_projects)} projects (3 featured, 6 regular)")


def seed_experience():
    """Create sample experience entries"""
    print("Seeding experience entries...")

    experiences = [
        {
            "company": "TechCorp Solutions",
            "role": "Senior Full Stack Developer",
            "location": "San Francisco, CA",
            "start_date": date(2022, 3, 1),
            "end_date": None,  # Current position
            "bullets": [
                "Lead development of microservices architecture serving 1M+ daily active users",
                "Architected and implemented real-time data processing pipeline using Apache Kafka",
                "Mentored team of 5 junior developers and established code review best practices",
                "Reduced application load times by 40% through performance optimization initiatives",
                "Collaborated with product team to define technical requirements for new features",
            ],
            "tech": [
                "React",
                "Node.js",
                "PostgreSQL",
                "Apache Kafka",
                "Docker",
                "Kubernetes",
                "AWS",
            ],
            "order_index": 1,
        },
        {
            "company": "StartupXYZ",
            "role": "Full Stack Developer",
            "location": "Austin, TX",
            "start_date": date(2020, 6, 15),
            "end_date": date(2022, 2, 28),
            "bullets": [
                "Built MVP from scratch using React and Python Flask, achieving product-market fit",
                "Implemented CI/CD pipeline reducing deployment time from hours to minutes",
                "Designed and developed RESTful APIs handling 100K+ requests per day",
                "Integrated third-party services including Stripe, SendGrid, and AWS S3",
                "Participated in agile development process with 2-week sprint cycles",
            ],
            "tech": ["React", "Python", "Flask", "MongoDB", "Redis", "AWS", "Stripe API"],
            "order_index": 2,
        },
        {
            "company": "Digital Agency Pro",
            "role": "Frontend Developer",
            "location": "Remote",
            "start_date": date(2019, 1, 10),
            "end_date": date(2020, 6, 10),
            "bullets": [
                "Developed responsive websites for 20+ clients using modern JavaScript frameworks",
                "Collaborated with design team to implement pixel-perfect UI components",
                "Optimized website performance achieving 95+ Lighthouse scores across all metrics",
                "Implemented accessibility features ensuring WCAG 2.1 AA compliance",
                "Maintained and updated legacy codebases while migrating to modern frameworks",
            ],
            "tech": ["Vue.js", "JavaScript", "SCSS", "Webpack", "WordPress", "PHP"],
            "order_index": 3,
        },
        {
            "company": "University Research Lab",
            "role": "Software Development Intern",
            "location": "Boston, MA",
            "start_date": date(2018, 6, 1),
            "end_date": date(2018, 12, 15),
            "bullets": [
                "Developed data visualization tools for research projects using D3.js and Python",
                "Created automated data processing scripts reducing manual work by 80%",
                "Contributed to open-source research software used by 500+ researchers globally",
                "Presented findings at university symposium and co-authored research paper",
            ],
            "tech": ["Python", "D3.js", "Pandas", "NumPy", "Jupyter", "Git"],
            "order_index": 4,
        },
    ]

    for exp_data in experiences:
        experience = Experience(
            company=exp_data["company"],
            role=exp_data["role"],
            location=exp_data["location"],
            start_date=exp_data["start_date"],
            end_date=exp_data["end_date"],
            bullets=exp_data["bullets"],
            tech=exp_data["tech"],
            order_index=exp_data["order_index"],
        )
        db.session.add(experience)

    db.session.commit()
    print(f"✓ Created {len(experiences)} experience entries")


def seed_site_meta():
    """Create initial site metadata"""
    print("Seeding site metadata...")

    site_meta = SiteMeta(
        hero_title="Mufaddal Diwan",
        hero_subtitle="Full Stack Developer & Software Engineer",
        bio_md="""# About Me

I'm a passionate full stack developer with over 5 years of experience building scalable web applications and leading development teams. I specialize in modern JavaScript frameworks, Python backend development, and cloud architecture.

## What I Do

I love creating efficient, user-friendly applications that solve real-world problems. My experience spans from early-stage startups to enterprise-level systems, giving me a unique perspective on both rapid prototyping and scalable architecture design.

## My Approach

I believe in writing clean, maintainable code and following best practices. I'm passionate about performance optimization, accessibility, and creating inclusive digital experiences. When I'm not coding, you'll find me contributing to open-source projects or mentoring aspiring developers.

## Technical Expertise

- **Frontend**: React, Vue.js, Angular, TypeScript, Modern CSS
- **Backend**: Node.js, Python, Flask, Django, RESTful APIs
- **Database**: PostgreSQL, MongoDB, Redis
- **Cloud & DevOps**: AWS, Docker, Kubernetes, CI/CD
- **Tools**: Git, Webpack, Jest, Cypress

I'm always excited to take on new challenges and collaborate with talented teams to build amazing products.""",
        social_links=[
            {"platform": "GitHub", "url": "https://github.com/MufaddalDiwan", "icon": "github"},
            {
                "platform": "LinkedIn",
                "url": "www.linkedin.com/in/mufaddal-diwan",
                "icon": "linkedin",
            },
            {
                "platform": "Twitter",
                "url": "https://twitter.com/alexjohnson_dev",
                "icon": "twitter",
            },
            {"platform": "Email", "url": "mailto:mufaddaldiwan21@gmail.com", "icon": "email"},
        ],
    )

    db.session.add(site_meta)
    db.session.commit()
    print("✓ Created site metadata with hero content and social links")


def create_sample_images():
    """Create placeholder image files for projects"""
    print("Creating sample image placeholders...")

    image_names = [
        "ecommerce-platform.jpg",
        "task-dashboard.jpg",
        "analytics-platform.jpg",
        "weather-app.jpg",
        "recipe-platform.jpg",
        "fitness-api.jpg",
        "blog-engine.jpg",
        "expense-tracker.jpg",
        "snippet-manager.jpg",
    ]

    # Create placeholder files (in a real scenario, you'd copy actual images)
    images_dir = os.path.join(os.path.dirname(__file__), "..", "content", "images", "projects")
    os.makedirs(images_dir, exist_ok=True)

    for image_name in image_names:
        image_path = os.path.join(images_dir, image_name)
        if not os.path.exists(image_path):
            # Create a placeholder file
            with open(image_path, "w") as f:
                f.write(f"# Placeholder for {image_name}\n")
                f.write("# Replace this file with actual project screenshot\n")
                f.write("# Recommended size: 800x600px or 16:9 aspect ratio\n")

    print(f"✓ Created {len(image_names)} placeholder image files")


def main():
    """Main seeding function"""
    print("🌱 Starting database seeding process...")
    print("=" * 50)

    # Create Flask app context
    app = create_app()

    with app.app_context():
        try:
            # Clear existing data
            clear_existing_data()

            # Seed all data
            seed_projects()
            seed_experience()
            seed_site_meta()
            create_sample_images()

            print("=" * 50)
            print("🎉 Database seeding completed successfully!")
            print("\nSeeded data summary:")
            print(f"  • {Project.query.count()} projects (3 featured)")
            print(f"  • {Experience.query.count()} experience entries")
            print(f"  • {SiteMeta.query.count()} site metadata record")
            print("  • 9 placeholder images created")

            print("\nNext steps:")
            print(
                "  1. Replace placeholder images in content/images/projects/ with actual screenshots"
            )
            print(
                "  2. Update site metadata in Flask-Admin (/admin) with your personal information"
            )
            print("  3. Customize project and experience data as needed")
            print("  4. Start the development server to view your portfolio")

        except Exception as e:
            print(f"❌ Error during seeding: {str(e)}")
            db.session.rollback()
            raise

        finally:
            db.session.close()


if __name__ == "__main__":
    main()
