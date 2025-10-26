"""
Projects API routes
Handles project-related endpoints for the portfolio API
"""

from flask import Blueprint, jsonify, request
from sqlalchemy import desc

from models import Project
from schemas import project_schema, projects_schema

projects_bp = Blueprint("projects", __name__, url_prefix="/api/projects")


@projects_bp.route("", methods=["GET"])
def get_projects():
    """
    GET /api/projects
    Returns list of projects with optional featured filter
    Query parameters:
    - featured: boolean (optional) - filter by featured status
    """
    try:
        # Get featured query parameter
        featured_param = request.args.get("featured")
        featured_filter = None

        if featured_param is not None:
            # Convert string to boolean
            if featured_param.lower() in ("true", "1", "yes"):
                featured_filter = True
            elif featured_param.lower() in ("false", "0", "no"):
                featured_filter = False
            else:
                return (
                    jsonify(
                        {
                            "error": {
                                "code": "VALIDATION_ERROR",
                                "message": "Invalid featured parameter. Use true or false.",
                                "details": {"featured": ["Must be true or false"]},
                            }
                        }
                    ),
                    400,
                )

        # Build query
        query = Project.query

        if featured_filter is not None:
            query = query.filter(Project.featured == featured_filter)

        # Order by order_index (ascending), then created_at (descending)
        projects = query.order_by(Project.order_index.asc(), desc(Project.created_at)).all()

        # Serialize projects
        result = projects_schema.dump(projects)

        return jsonify(result), 200

    except Exception as e:
        return (
            jsonify(
                {
                    "error": {
                        "code": "SERVER_ERROR",
                        "message": "An error occurred while fetching projects",
                        "details": str(e) if request.args.get("debug") else None,
                    }
                }
            ),
            500,
        )


@projects_bp.route("/<slug>", methods=["GET"])
def get_project_by_slug(slug):
    """
    GET /api/projects/<slug>
    Returns single project by slug
    """
    try:
        # Find project by slug
        project = Project.query.filter_by(slug=slug).first()

        if not project:
            return (
                jsonify(
                    {
                        "error": {
                            "code": "NOT_FOUND",
                            "message": f'Project with slug "{slug}" not found',
                            "details": None,
                        }
                    }
                ),
                404,
            )

        # Serialize project
        result = project_schema.dump(project)

        return jsonify(result), 200

    except Exception as e:
        return (
            jsonify(
                {
                    "error": {
                        "code": "SERVER_ERROR",
                        "message": "An error occurred while fetching the project",
                        "details": str(e) if request.args.get("debug") else None,
                    }
                }
            ),
            500,
        )


@projects_bp.errorhandler(404)
def handle_not_found(e):
    """Handle 404 errors for projects routes"""
    return (
        jsonify({"error": {"code": "NOT_FOUND", "message": "Project not found", "details": None}}),
        404,
    )


@projects_bp.errorhandler(500)
def handle_server_error(e):
    """Handle 500 errors for projects routes"""
    return (
        jsonify(
            {"error": {"code": "SERVER_ERROR", "message": "Internal server error", "details": None}}
        ),
        500,
    )
