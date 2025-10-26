from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import JSON, Boolean, Column, Date, DateTime, Integer, String, Text

db = SQLAlchemy()


class Project(db.Model):
    """Project model for portfolio projects"""

    __tablename__ = "projects"

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

    def __repr__(self):
        return f"<Project {self.title}>"


class Experience(db.Model):
    """Experience model for work history"""

    __tablename__ = "experience"

    id = Column(Integer, primary_key=True)
    company = Column(String(200), nullable=False)
    role = Column(String(200), nullable=False)
    location = Column(String(200))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)  # Null for current position
    bullets = Column(JSON)  # List of strings
    tech = Column(JSON)  # List of strings
    order_index = Column(Integer, default=0)

    def __repr__(self):
        return f"<Experience {self.role} at {self.company}>"


class ContactMessage(db.Model):
    """Contact message model for form submissions"""

    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    replied = Column(Boolean, default=False)

    def __repr__(self):
        return f"<ContactMessage from {self.name}>"


class SiteMeta(db.Model):
    """Site metadata model for hero content and bio"""

    __tablename__ = "site_meta"

    id = Column(Integer, primary_key=True)
    hero_title = Column(String(200))
    hero_subtitle = Column(String(500))
    bio_md = Column(Text)
    social_links = Column(JSON)  # List of {platform, url, icon}
    avatar_image = Column(String(500))  # Avatar image filename
    profile_image = Column(String(500))  # Profile image filename

    def __repr__(self):
        return f"<SiteMeta {self.hero_title}>"
