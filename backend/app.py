import logging
import os
import time
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, g, jsonify, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from admin import init_admin
from models import db

# Load environment variables
load_dotenv()


def create_app():
    app = Flask(__name__)

    # Configuration
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///portfolio.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # File upload configuration
    app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024  # 5MB max file size
    app.config["UPLOAD_FOLDER"] = os.path.join(
        os.path.dirname(__file__), "..", "content", "images", "projects"
    )

    # Ensure upload directory exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Configure logging with more detailed format
    log_level = logging.DEBUG if os.getenv("FLASK_ENV") == "development" else logging.INFO
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Initialize SQLAlchemy
    db.init_app(app)

    # CORS configuration - only allow frontend origin from environment variable
    allowed_origin = os.getenv("ALLOWED_ORIGIN", "http://localhost:4200")
    CORS(app, origins=[allowed_origin], supports_credentials=True)

    # Initialize Flask-Limiter for rate limiting
    limiter = Limiter(
        key_func=get_remote_address,
        default_limits=["100 per minute"],  # Global rate limit
        storage_uri="memory://",  # Use in-memory storage for development
        strategy="fixed-window",
    )
    limiter.init_app(app)

    # Register blueprints
    from routes.contact import contact_bp
    from routes.experience import experience_bp
    from routes.meta import meta_bp
    from routes.projects import projects_bp

    app.register_blueprint(projects_bp)
    app.register_blueprint(experience_bp)
    app.register_blueprint(meta_bp)
    app.register_blueprint(contact_bp)

    # Request logging middleware
    @app.before_request
    def log_request_info():
        """Log incoming request details"""
        g.start_time = time.time()
        app.logger.info(
            f"Request: {request.method} {request.path} - "
            f"IP: {request.remote_addr} - "
            f"User-Agent: {request.headers.get('User-Agent', 'Unknown')}"
        )

    @app.after_request
    def process_response(response):
        """Log response details, format JSON, and ensure consistent headers"""
        # Log response details and request duration
        duration = time.time() - g.start_time if hasattr(g, "start_time") else 0
        app.logger.info(
            f"Response: {response.status_code} - "
            f"Duration: {duration:.3f}s - "
            f"Size: {response.content_length or 0} bytes"
        )

        # Ensure consistent JSON response formatting
        if response.content_type and "application/json" in response.content_type:
            response.headers["Content-Type"] = "application/json; charset=utf-8"

        return response

    # Apply rate limiting to contact endpoint
    with app.app_context():
        # Get the contact endpoint and apply rate limiting
        contact_endpoint = app.view_functions.get("contact.submit_contact")
        if contact_endpoint:
            # Apply the rate limit decorator
            app.view_functions["contact.submit_contact"] = limiter.limit("5 per hour")(
                contact_endpoint
            )

    @app.route("/health")
    def health_check():
        """Health check endpoint for monitoring"""
        try:
            # Test database connection
            db.session.execute("SELECT 1")
            db_status = "connected"
        except Exception as e:
            app.logger.error(f"Database health check failed: {e}")
            db_status = "disconnected"

        status = "healthy" if db_status == "connected" else "unhealthy"

        return jsonify(
            {
                "status": status,
                "message": "Portfolio API is running",
                "timestamp": datetime.utcnow().isoformat(),
                "database": db_status,
                "version": "1.0.0",
            }
        ), (200 if status == "healthy" else 503)

    @app.route("/content/images/projects/<filename>")
    def uploaded_file(filename):
        """Serve uploaded project images"""
        from flask import send_from_directory

        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # Global error handlers for consistent JSON responses
    @app.errorhandler(400)
    def handle_bad_request(e):
        """Handle bad request errors"""
        app.logger.warning(f"Bad Request: {request.path} - {str(e)}")
        return (
            jsonify(
                {
                    "error": {
                        "code": "BAD_REQUEST",
                        "message": "Invalid request data",
                        "details": str(e.description) if hasattr(e, "description") else None,
                    }
                }
            ),
            400,
        )

    @app.errorhandler(404)
    def handle_not_found(e):
        """Handle not found errors"""
        app.logger.warning(f"Not Found: {request.path}")
        return (
            jsonify(
                {"error": {"code": "NOT_FOUND", "message": "Endpoint not found", "details": None}}
            ),
            404,
        )

    @app.errorhandler(405)
    def handle_method_not_allowed(e):
        """Handle method not allowed errors"""
        app.logger.warning(f"Method Not Allowed: {request.method} {request.path}")
        return (
            jsonify(
                {
                    "error": {
                        "code": "METHOD_NOT_ALLOWED",
                        "message": "Method not allowed for this endpoint",
                        "details": None,
                    }
                }
            ),
            405,
        )

    @app.errorhandler(429)
    def handle_rate_limit_exceeded(e):
        """Handle rate limit exceeded errors"""
        # Enhanced rate limit logging
        app.logger.warning(
            f"Rate Limit Exceeded - IP: {request.remote_addr} - "
            f"Path: {request.path} - Method: {request.method} - "
            f"User-Agent: {request.headers.get('User-Agent', 'Unknown')} - "
            f"Timestamp: {datetime.utcnow().isoformat()}"
        )
        return (
            jsonify(
                {
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": "Too many requests. Please try again later.",
                        "details": str(e.description) if hasattr(e, "description") else None,
                    }
                }
            ),
            429,
        )

    @app.errorhandler(500)
    def handle_server_error(e):
        """Handle internal server errors"""
        # Enhanced server error logging with more context
        app.logger.error(
            f"Internal Server Error - Path: {request.path} - Method: {request.method} - "
            f"IP: {request.remote_addr} - Error: {str(e)} - "
            f"Timestamp: {datetime.utcnow().isoformat()}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "error": {
                        "code": "SERVER_ERROR",
                        "message": "Internal server error",
                        "details": None,
                    }
                }
            ),
            500,
        )

    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        """Handle any unhandled exceptions"""
        # Enhanced exception logging with full context
        app.logger.error(
            f"Unhandled Exception - Path: {request.path} - Method: {request.method} - "
            f"IP: {request.remote_addr} - Exception: {type(e).__name__}: {str(e)} - "
            f"Timestamp: {datetime.utcnow().isoformat()}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "error": {
                        "code": "SERVER_ERROR",
                        "message": "An unexpected error occurred",
                        "details": None,
                    }
                }
            ),
            500,
        )

    # Initialize Flask-Admin
    init_admin(app)

    # Create tables if they don't exist
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", 5001))  # Use port 5001 to avoid AirPlay conflict
    app.run(debug=True, host="0.0.0.0", port=port)
