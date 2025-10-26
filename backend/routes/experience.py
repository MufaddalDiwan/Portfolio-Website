"""
Experience API routes
Handles experience-related endpoints for the portfolio API
"""

from flask import Blueprint, jsonify, request
from sqlalchemy import desc

from models import Experience
from schemas import experiences_schema

experience_bp = Blueprint("experience", __name__, url_prefix="/api/experience")


@experience_bp.route("", methods=["GET"])
def get_experience():
    """
    GET /api/experience
    Returns list of experience entries ordered by start_date descending (most recent first)
    """
    try:
        # Query all experience entries ordered by start_date DESC
        # This shows most recent experience first in the timeline
        experiences = Experience.query.order_by(desc(Experience.start_date)).all()

        # Serialize experiences
        result = experiences_schema.dump(experiences)

        return jsonify(result), 200

    except Exception as e:
        return (
            jsonify(
                {
                    "error": {
                        "code": "SERVER_ERROR",
                        "message": "An error occurred while fetching experience data",
                        "details": str(e) if request.args.get("debug") else None,
                    }
                }
            ),
            500,
        )


@experience_bp.errorhandler(500)
def handle_server_error(e):
    """Handle 500 errors for experience routes"""
    return (
        jsonify(
            {"error": {"code": "SERVER_ERROR", "message": "Internal server error", "details": None}}
        ),
        500,
    )
