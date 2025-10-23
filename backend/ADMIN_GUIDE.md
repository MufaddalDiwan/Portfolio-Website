# Flask-Admin Guide

## Overview

The Portfolio Admin interface provides a web-based content management system for your portfolio website. It allows you to manage projects, experience entries, contact messages, and site metadata without writing code.

## Accessing the Admin Panel

1. Start the Flask backend server:
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```

2. Open your browser and navigate to: `http://localhost:5001/admin/`

3. Log in using the credentials from your `.env` file:
   - Username: Value of `ADMIN_USER` (default: admin)
   - Password: Value of `ADMIN_PASS` (default: admin)

## Admin Sections

### Projects
- **Create/Edit Projects**: Add new portfolio projects or edit existing ones
- **Fields**:
  - Title: Project name (auto-generates slug)
  - Slug: URL-friendly identifier (auto-generated from title)
  - Short Description: Brief summary for project cards
  - Long Description: Detailed markdown description
  - Technologies: Comma-separated list (e.g., "React, TypeScript, Node.js")
  - GitHub URL: Link to source code repository
  - Demo URL: Link to live demo
  - Cover Image: Upload project screenshot/image (max 5MB)
  - Featured: Check to highlight as featured project
  - Order Index: Number for sorting (lower = higher priority)

### Experience
- **Manage Work History**: Add/edit professional experience entries
- **Fields**:
  - Company: Organization name
  - Role: Job title/position
  - Location: Work location
  - Start Date: Employment start date
  - End Date: Employment end date (leave blank for current position)
  - Bullet Points: One achievement/responsibility per line
  - Technologies: Comma-separated list of technologies used
  - Order Index: Number for sorting (lower = higher priority)

### Contact Messages
- **View Inquiries**: Read-only view of contact form submissions
- **Features**:
  - View all submitted messages
  - Mark messages as "Replied" when handled
  - Search by name or email
  - Filter by replied status
  - Sort by submission date

### Site Metadata
- **Configure Site Content**: Edit hero section and bio content
- **Fields**:
  - Hero Title: Main heading on homepage
  - Hero Subtitle: Tagline/subtitle text
  - Bio Markdown: About section content (supports Markdown)
  - Social Links: JSON array of social media links

## Image Upload

### Supported Formats
- JPG/JPEG
- PNG
- WebP
- GIF

### File Size Limit
- Maximum: 5MB per image

### Upload Process
1. In the Projects section, click "Create" or edit an existing project
2. Use the "Cover Image" field to upload a new image
3. Images are automatically saved to `content/images/projects/`
4. The image path is stored in the database and served via `/content/images/projects/<filename>`

## Social Links Format

The Social Links field in Site Metadata expects JSON format:

```json
[
  {
    "platform": "GitHub",
    "url": "https://github.com/yourusername",
    "icon": "github"
  },
  {
    "platform": "LinkedIn", 
    "url": "https://linkedin.com/in/yourusername",
    "icon": "linkedin"
  },
  {
    "platform": "Twitter",
    "url": "https://twitter.com/yourusername", 
    "icon": "twitter"
  }
]
```

## Tips

### Auto-Generated Slugs
- Project slugs are automatically generated from titles
- Slugs must be unique across all projects
- Manual slug editing is supported

### Technology Tags
- Enter technologies as comma-separated values
- Example: "React, TypeScript, Node.js, PostgreSQL"
- Tags are automatically converted to arrays for the API

### Markdown Support
- Bio content and project long descriptions support Markdown
- Use the rich text editor for formatting
- Preview changes before saving

### Order Management
- Use Order Index to control display order
- Lower numbers appear first
- Featured projects are displayed prominently regardless of order

## Security

### Authentication
- Admin access requires username/password authentication
- Credentials are configured via environment variables
- Sessions expire after 24 hours of inactivity

### File Upload Security
- File type validation prevents malicious uploads
- File size limits prevent abuse
- Uploaded files are served from a controlled directory

## Troubleshooting

### Login Issues
- Verify `ADMIN_USER` and `ADMIN_PASS` in `.env` file
- Check that Flask app is running on correct port
- Clear browser cookies if experiencing session issues

### Image Upload Issues
- Ensure file is under 5MB
- Check file format is supported (JPG, PNG, WebP, GIF)
- Verify `content/images/projects/` directory exists and is writable

### Slug Conflicts
- Each project must have a unique slug
- Edit the title or manually set a unique slug
- Slugs are case-insensitive and URL-friendly

## Environment Variables

Required variables in `.env`:

```bash
# Admin credentials
ADMIN_USER=admin
ADMIN_PASS=your_secure_password_here

# Database
DATABASE_URL=sqlite:///portfolio.db

# Flask
SECRET_KEY=your_secret_key_here
```