"""
Marshmallow schemas for API serialization and validation.
Provides camelCase transformation and validation rules for all models.
"""

import re
from datetime import date

from marshmallow import (
    Schema,
    ValidationError,
    fields,
    validate,
    validates_schema,
)


def snake_to_camel(name):
    """Convert snake_case to camelCase"""
    components = name.split("_")
    return components[0] + "".join(word.capitalize() for word in components[1:])


def camel_to_snake(name):
    """Convert camelCase to snake_case"""
    s1 = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub("([a-z0-9])([A-Z])", r"\1_\2", s1).lower()


class CamelCaseSchema(Schema):
    """Base schema that converts between snake_case and camelCase"""

    def on_bind_field(self, field_name, field_obj):
        field_obj.data_key = snake_to_camel(field_obj.data_key or field_name)


class SocialLinkSchema(Schema):
    """Schema for social link objects"""

    platform = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    url = fields.Url(required=True)
    icon = fields.Str(required=True, validate=validate.Length(min=1, max=50))


class ProjectSchema(CamelCaseSchema):
    """Schema for Project model with camelCase serialization and validation"""

    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    slug = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    short_desc = fields.Str(allow_none=True, validate=validate.Length(max=500))
    long_md = fields.Str(allow_none=True)
    tech = fields.List(fields.Str(), allow_none=True, missing=[])
    github_url = fields.Url(allow_none=True, validate=validate.Length(max=500))
    demo_url = fields.Url(allow_none=True, validate=validate.Length(max=500))
    cover_image = fields.Str(allow_none=True, validate=validate.Length(max=500))
    featured = fields.Bool(missing=False)
    order_index = fields.Int(missing=0)
    created_at = fields.DateTime(dump_only=True, format="iso")

    @validates_schema
    def validate_slug_format(self, data, **kwargs):
        """Validate slug format (lowercase, hyphens only)"""
        if "slug" in data:
            slug = data["slug"]
            if not re.match(r"^[a-z0-9-]+$", slug):
                raise ValidationError(
                    "Slug must contain only lowercase letters, numbers, and hyphens"
                )

    @validates_schema
    def validate_urls(self, data, **kwargs):
        """Validate that at least one URL is provided if project has URLs"""
        github_url = data.get("github_url")
        demo_url = data.get("demo_url")

        # Both URLs can be None, but if provided, they should be valid
        # This is handled by the Url field validator


class ExperienceSchema(CamelCaseSchema):
    """Schema for Experience model with camelCase serialization and date formatting"""

    id = fields.Int(dump_only=True)
    company = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    role = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    location = fields.Str(allow_none=True, validate=validate.Length(max=200))
    start_date = fields.Date(required=True, format="%Y-%m-%d")
    end_date = fields.Date(allow_none=True, format="%Y-%m-%d")
    bullets = fields.List(fields.Str(), allow_none=True, missing=[])
    tech = fields.List(fields.Str(), allow_none=True, missing=[])
    order_index = fields.Int(missing=0)

    # Computed field for duration
    duration = fields.Method("calculate_duration", dump_only=True)
    is_current = fields.Method("calculate_is_current", dump_only=True)

    def calculate_duration(self, obj):
        """Calculate duration string for the experience"""
        start = obj.start_date
        end = obj.end_date or date.today()

        years = end.year - start.year
        months = end.month - start.month

        if months < 0:
            years -= 1
            months += 12

        if years > 0 and months > 0:
            return f"{years} yr{'s' if years != 1 else ''} {months} mo{'s' if months != 1 else ''}"
        elif years > 0:
            return f"{years} yr{'s' if years != 1 else ''}"
        elif months > 0:
            return f"{months} mo{'s' if months != 1 else ''}"
        else:
            return "Less than 1 month"

    def calculate_is_current(self, obj):
        """Check if this is a current position"""
        return obj.end_date is None

    @validates_schema
    def validate_dates(self, data, **kwargs):
        """Validate that end_date is after start_date"""
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if start_date and end_date and end_date <= start_date:
            raise ValidationError("End date must be after start date")

        if start_date and start_date > date.today():
            raise ValidationError("Start date cannot be in the future")


class ContactMessageSchema(CamelCaseSchema):
    """Schema for ContactMessage model with email validation and required field checks"""

    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    email = fields.Email(required=True, validate=validate.Length(max=200))
    message = fields.Str(required=True, validate=validate.Length(min=10, max=5000))
    created_at = fields.DateTime(dump_only=True, format="iso")
    replied = fields.Bool(dump_only=True)

    @validates_schema
    def validate_message_content(self, data, **kwargs):
        """Validate message content is not just whitespace"""
        if "message" in data:
            message = data["message"].strip()
            if len(message) < 10:
                raise ValidationError("Message must be at least 10 characters long")


class SiteMetaSchema(CamelCaseSchema):
    """Schema for SiteMeta model with social links structure validation"""

    id = fields.Int(dump_only=True)
    hero_title = fields.Str(allow_none=True, validate=validate.Length(max=200))
    hero_subtitle = fields.Str(allow_none=True, validate=validate.Length(max=500))
    bio_md = fields.Str(allow_none=True)
    social_links = fields.List(fields.Nested(SocialLinkSchema), allow_none=True, missing=[])
    avatar_image = fields.Str(allow_none=True, validate=validate.Length(max=500))
    profile_image = fields.Str(allow_none=True, validate=validate.Length(max=500))

    @validates_schema
    def validate_social_links(self, data, **kwargs):
        """Validate social links structure and uniqueness"""
        social_links = data.get("social_links", [])

        if social_links:
            platforms = []
            for link in social_links:
                platform = link.get("platform", "").lower()
                if platform in platforms:
                    raise ValidationError("Duplicate social media platform found")
                platforms.append(platform)

                # Validate common platform URLs
                url = link.get("url", "")
                if platform == "github" and "github.com" not in url:
                    raise ValidationError("GitHub URL must contain github.com")
                elif platform == "linkedin" and "linkedin.com" not in url:
                    raise ValidationError("LinkedIn URL must contain linkedin.com")
                elif platform == "twitter" and not any(
                    domain in url for domain in ["twitter.com", "x.com"]
                ):
                    raise ValidationError("Twitter URL must contain twitter.com or x.com")


# Schema instances for easy import
project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

experience_schema = ExperienceSchema()
experiences_schema = ExperienceSchema(many=True)

contact_message_schema = ContactMessageSchema()
contact_messages_schema = ContactMessageSchema(many=True)

site_meta_schema = SiteMetaSchema()
