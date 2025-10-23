"""
Flask-Admin configuration and custom admin views for portfolio content management.
"""

import os
from flask import session, redirect, url_for, request, flash
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from flask_admin.form.upload import ImageUploadField
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from wtforms import TextAreaField, SelectField, BooleanField
from wtforms.widgets import TextArea
from wtforms.validators import DataRequired, Email, Length, URL, Optional
from models import db, Project, Experience, ContactMessage, SiteMeta
import json


class CKTextAreaWidget(TextArea):
    """Custom widget for rich text editing"""
    def __call__(self, field, **kwargs):
        if kwargs.get('class'):
            kwargs['class'] += ' ckeditor'
        else:
            kwargs.setdefault('class', 'ckeditor')
        return super(CKTextAreaWidget, self).__call__(field, **kwargs)


class CKTextAreaField(TextAreaField):
    """Custom field for rich text editing"""
    widget = CKTextAreaWidget()


def is_authenticated():
    """Check if user is authenticated for admin access"""
    return session.get('admin_authenticated', False)


def authenticate(username, password):
    """Authenticate admin user using environment variables"""
    admin_user = os.getenv('ADMIN_USER', 'admin')
    admin_pass = os.getenv('ADMIN_PASS', 'admin')
    
    # In production, you should hash the password in the environment variable
    # For now, we'll do a simple comparison but log a warning
    if username == admin_user and password == admin_pass:
        return True
    return False


class MyAdminIndexView(AdminIndexView):
    """Custom admin index view with authentication"""
    
    @expose('/')
    def index(self):
        if not is_authenticated():
            return redirect(url_for('.login_view'))
        return super(MyAdminIndexView, self).index()
    
    @expose('/login/', methods=('GET', 'POST'))
    def login_view(self):
        if request.method == 'POST':
            username = request.form.get('username')
            password = request.form.get('password')
            
            if authenticate(username, password):
                session['admin_authenticated'] = True
                return redirect(url_for('.index'))
            else:
                flash('Invalid credentials', 'error')
        
        return self.render('admin/login.html')
    
    @expose('/logout/')
    def logout_view(self):
        session.pop('admin_authenticated', None)
        return redirect(url_for('.login_view'))


class AuthenticatedModelView(ModelView):
    """Base model view that requires authentication"""
    
    def is_accessible(self):
        return is_authenticated()
    
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin.login_view'))


class ProjectAdmin(AuthenticatedModelView):
    """Admin view for Project model with image upload and custom fields"""
    
    column_list = ['title', 'slug', 'featured', 'order_index', 'created_at']
    column_searchable_list = ['title', 'slug', 'short_desc']
    column_filters = ['featured', 'created_at']
    column_sortable_list = ['title', 'order_index', 'created_at', 'featured']
    column_default_sort = ('order_index', False)
    
    form_columns = [
        'title', 'slug', 'short_desc', 'long_md', 'tech', 
        'github_url', 'demo_url', 'cover_image', 'featured', 'order_index'
    ]
    
    form_overrides = {
        'long_md': CKTextAreaField,
        'short_desc': TextAreaField,
    }
    
    form_widget_args = {
        'title': {'class': 'form-control'},
        'slug': {'class': 'form-control', 'placeholder': 'auto-generated-from-title'},
        'short_desc': {'class': 'form-control', 'rows': 3},
        'long_md': {'class': 'form-control', 'rows': 10},
        'tech': {'class': 'form-control', 'placeholder': 'React, TypeScript, Node.js (comma-separated)'},
        'github_url': {'class': 'form-control', 'placeholder': 'https://github.com/username/repo'},
        'demo_url': {'class': 'form-control', 'placeholder': 'https://demo.example.com'},
        'order_index': {'class': 'form-control', 'min': 0},
    }
    
    form_args = {
        'title': {'validators': [DataRequired(), Length(max=200)]},
        'slug': {'validators': [Length(max=200)]},
        'short_desc': {'validators': [Length(max=500)]},
        'github_url': {'validators': [Optional(), URL()]},
        'demo_url': {'validators': [Optional(), URL()]},
        'order_index': {'default': 0},
    }
    
    # Configure image upload
    form_extra_fields = {
        'cover_image_upload': ImageUploadField(
            'Cover Image',
            base_path=os.path.join(os.path.dirname(__file__), '..', 'content', 'images', 'projects'),
            url_relative_path='content/images/projects/',
            allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'gif'],
            max_size=(5 * 1024 * 1024, True, 'File must be less than 5MB'),
            namegen=lambda obj, file_data: secure_filename(file_data.filename)
        )
    }
    
    def on_model_change(self, form, model, is_created):
        """Handle model changes, including slug generation and image upload"""
        # Auto-generate slug from title if not provided
        if not model.slug and model.title:
            model.slug = self.generate_slug(model.title)
        
        # Validate slug uniqueness
        if model.slug:
            existing = Project.query.filter(Project.slug == model.slug, Project.id != model.id).first()
            if existing:
                raise ValueError(f"Slug '{model.slug}' already exists. Please choose a different title or slug.")
        
        # Handle tech field - convert comma-separated string to JSON array
        if hasattr(form, 'tech') and form.tech.data:
            if isinstance(form.tech.data, str):
                model.tech = [tech.strip() for tech in form.tech.data.split(',') if tech.strip()]
        
        # Handle image upload
        if hasattr(form, 'cover_image_upload') and form.cover_image_upload.data:
            filename = secure_filename(form.cover_image_upload.data.filename)
            # Validate file extension
            allowed_extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
            file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
            if file_ext not in allowed_extensions:
                raise ValueError(f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}")
            model.cover_image = f'content/images/projects/{filename}'
    
    def on_form_prefill(self, form, id):
        """Pre-fill form with existing data"""
        if id:
            project = self.get_one(id)
            if project and project.tech:
                # Convert JSON array back to comma-separated string for editing
                if isinstance(project.tech, list):
                    form.tech.data = ', '.join(project.tech)
    
    @staticmethod
    def generate_slug(title):
        """Generate URL-friendly slug from title"""
        import re
        slug = title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')


class ExperienceAdmin(AuthenticatedModelView):
    """Admin view for Experience model"""
    
    column_list = ['company', 'role', 'start_date', 'end_date', 'order_index']
    column_searchable_list = ['company', 'role', 'location']
    column_filters = ['company', 'start_date', 'end_date']
    column_sortable_list = ['company', 'role', 'start_date', 'end_date', 'order_index']
    column_default_sort = ('order_index', False)
    
    form_columns = [
        'company', 'role', 'location', 'start_date', 'end_date', 
        'bullets', 'tech', 'order_index'
    ]
    
    form_overrides = {
        'bullets': TextAreaField,
        'tech': TextAreaField,
    }
    
    form_widget_args = {
        'company': {'class': 'form-control'},
        'role': {'class': 'form-control'},
        'location': {'class': 'form-control'},
        'bullets': {'class': 'form-control', 'rows': 5, 'placeholder': 'One bullet point per line'},
        'tech': {'class': 'form-control', 'placeholder': 'React, TypeScript, Node.js (comma-separated)'},
        'order_index': {'class': 'form-control', 'min': 0},
    }
    
    form_args = {
        'company': {'validators': [DataRequired(), Length(max=200)]},
        'role': {'validators': [DataRequired(), Length(max=200)]},
        'location': {'validators': [Length(max=200)]},
        'start_date': {'validators': [DataRequired()]},
        'order_index': {'default': 0},
    }
    
    def on_model_change(self, form, model, is_created):
        """Handle model changes for bullets and tech fields"""
        # Handle bullets field - convert line-separated string to JSON array
        if hasattr(form, 'bullets') and form.bullets.data:
            if isinstance(form.bullets.data, str):
                model.bullets = [bullet.strip() for bullet in form.bullets.data.split('\n') if bullet.strip()]
        
        # Handle tech field - convert comma-separated string to JSON array
        if hasattr(form, 'tech') and form.tech.data:
            if isinstance(form.tech.data, str):
                model.tech = [tech.strip() for tech in form.tech.data.split(',') if tech.strip()]
    
    def on_form_prefill(self, form, id):
        """Pre-fill form with existing data"""
        if id:
            experience = self.get_one(id)
            if experience:
                # Convert JSON arrays back to strings for editing
                if experience.bullets and isinstance(experience.bullets, list):
                    form.bullets.data = '\n'.join(experience.bullets)
                if experience.tech and isinstance(experience.tech, list):
                    form.tech.data = ', '.join(experience.tech)


class ContactMessageAdmin(AuthenticatedModelView):
    """Admin view for ContactMessage model (read-only with replied checkbox)"""
    
    can_create = False
    can_delete = False
    can_edit = True
    
    column_list = ['name', 'email', 'created_at', 'replied']
    column_searchable_list = ['name', 'email']
    column_filters = ['replied', 'created_at']
    column_sortable_list = ['name', 'email', 'created_at', 'replied']
    column_default_sort = ('created_at', True)  # Newest first
    
    # Only allow editing the replied field
    form_columns = ['replied']
    
    column_formatters = {
        'message': lambda v, c, m, p: m.message[:100] + '...' if len(m.message) > 100 else m.message
    }
    
    column_descriptions = {
        'replied': 'Check this box when you have responded to the message'
    }
    
    def get_query(self):
        """Override to show newest messages first"""
        return super().get_query().order_by(ContactMessage.created_at.desc())


class SiteMetaAdmin(AuthenticatedModelView):
    """Admin view for SiteMeta model (single record for site metadata)"""
    
    can_create = True
    can_delete = False
    
    column_list = ['hero_title', 'hero_subtitle']
    
    form_columns = ['hero_title', 'hero_subtitle', 'bio_md', 'social_links']
    
    form_overrides = {
        'bio_md': CKTextAreaField,
        'hero_subtitle': TextAreaField,
        'social_links': TextAreaField,
    }
    
    form_widget_args = {
        'hero_title': {'class': 'form-control'},
        'hero_subtitle': {'class': 'form-control', 'rows': 2},
        'bio_md': {'class': 'form-control', 'rows': 10},
        'social_links': {
            'class': 'form-control', 
            'rows': 8,
            'placeholder': '''[
  {"platform": "GitHub", "url": "https://github.com/username", "icon": "github"},
  {"platform": "LinkedIn", "url": "https://linkedin.com/in/username", "icon": "linkedin"},
  {"platform": "Twitter", "url": "https://twitter.com/username", "icon": "twitter"}
]'''
        },
    }
    
    form_args = {
        'hero_title': {'validators': [Length(max=200)]},
        'hero_subtitle': {'validators': [Length(max=500)]},
    }
    
    def on_model_change(self, form, model, is_created):
        """Handle social_links JSON field"""
        if hasattr(form, 'social_links') and form.social_links.data:
            try:
                # Parse JSON string to validate format
                social_links = json.loads(form.social_links.data)
                model.social_links = social_links
            except json.JSONDecodeError:
                raise ValueError("Social links must be valid JSON format")
    
    def on_form_prefill(self, form, id):
        """Pre-fill form with existing data"""
        if id:
            site_meta = self.get_one(id)
            if site_meta and site_meta.social_links:
                # Convert JSON back to formatted string for editing
                form.social_links.data = json.dumps(site_meta.social_links, indent=2)
    
    def get_query(self):
        """Limit to single record"""
        return super().get_query().limit(1)


def init_admin(app):
    """Initialize Flask-Admin with the Flask app"""
    # Create admin instance with custom index view
    admin = Admin(
        app, 
        name='Portfolio Admin',
        template_mode='bootstrap3',
        index_view=MyAdminIndexView(),
        base_template='admin/my_master.html'
    )
    
    # Add model views with unique endpoint names to avoid conflicts
    admin.add_view(ProjectAdmin(Project, db.session, name='Projects', endpoint='admin_projects'))
    admin.add_view(ExperienceAdmin(Experience, db.session, name='Experience', endpoint='admin_experience'))
    admin.add_view(ContactMessageAdmin(ContactMessage, db.session, name='Contact Messages', endpoint='admin_contact'))
    admin.add_view(SiteMetaAdmin(SiteMeta, db.session, name='Site Metadata', endpoint='admin_meta'))
    
    return admin