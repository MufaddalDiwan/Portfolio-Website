"""
Contact API routes
Handles contact form submission with rate limiting and email notifications
"""

import logging
import os
from datetime import datetime

import sendgrid
from flask import Blueprint, current_app, jsonify, request
from marshmallow import ValidationError
from sendgrid.helpers.mail import Content, Email, Mail, To

from models import ContactMessage, db
from schemas import contact_message_schema

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

contact_bp = Blueprint("contact", __name__, url_prefix="/api/contact")


def send_contact_email(name, email, message):
    """
    Send contact form notification email using SendGrid

    Args:
        name (str): Name from contact form
        email (str): Email from contact form
        message (str): Message from contact form

    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Get SendGrid API key from environment
        sendgrid_api_key = os.getenv("SENDGRID_API_KEY")

        if not sendgrid_api_key:
            logger.error("SENDGRID_API_KEY not configured")
            return False

        # Initialize SendGrid client
        sg = sendgrid.SendGridAPIClient(api_key=sendgrid_api_key)

        # Get recipient email (admin email)
        admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")

        # Create email content
        subject = f"Portfolio Contact Form: Message from {name}"

        html_content = f"""
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
            {message.replace('\n', '<br>')}
        </div>
        <hr>
        <p><small>Sent from your portfolio website contact form at {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}</small></p>
        """

        text_content = f"""
        New Contact Form Submission
        
        Name: {name}
        Email: {email}
        
        Message:
        {message}
        
        ---
        Sent from your portfolio website contact form at {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}
        """

        # Create mail object
        mail = Mail(
            from_email=Email(admin_email, "Portfolio Contact Form"),
            to_emails=To(admin_email),
            subject=subject,
            html_content=Content("text/html", html_content),
            plain_text_content=Content("text/plain", text_content),
        )

        # Set reply-to as the contact form sender
        mail.reply_to = Email(email, name)

        # Send email
        response = sg.send(mail)

        if response.status_code in [200, 201, 202]:
            logger.info(f"Contact email sent successfully for {name} ({email})")
            return True
        else:
            logger.error(f"SendGrid API error: {response.status_code} - {response.body}")
            return False

    except Exception as e:
        logger.error(f"Error sending contact email: {str(e)}")
        return False


@contact_bp.route("", methods=["POST"])
def submit_contact():
    """
    POST /api/contact
    Submit contact form with validation, rate limiting, and email notification

    Expected JSON payload:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Hello, I'd like to get in touch..."
    }
    """

    try:
        # Get JSON data from request
        if not request.is_json:
            return (
                jsonify(
                    {
                        "error": {
                            "code": "VALIDATION_ERROR",
                            "message": "Request must be JSON",
                            "details": {"content-type": ["Must be application/json"]},
                        }
                    }
                ),
                400,
            )

        data = request.get_json()

        if not data:
            return (
                jsonify(
                    {
                        "error": {
                            "code": "VALIDATION_ERROR",
                            "message": "Request body cannot be empty",
                            "details": None,
                        }
                    }
                ),
                400,
            )

        # Validate input using schema
        try:
            validated_data = contact_message_schema.load(data)
        except ValidationError as err:
            return (
                jsonify(
                    {
                        "error": {
                            "code": "VALIDATION_ERROR",
                            "message": "Invalid input data",
                            "details": err.messages,
                        }
                    }
                ),
                400,
            )

        # Create contact message record
        contact_message = ContactMessage(
            name=validated_data["name"],
            email=validated_data["email"],
            message=validated_data["message"],
        )

        # Save to database
        db.session.add(contact_message)
        db.session.commit()

        # Log contact form submission (excluding message content for privacy)
        logger.info(
            f"Contact form submission - Name: {validated_data['name']} - "
            f"Email: {validated_data['email']} - ID: {contact_message.id} - "
            f"IP: {request.remote_addr} - Timestamp: {datetime.utcnow().isoformat()}"
        )

        # Send email notification
        email_sent = send_contact_email(
            validated_data["name"], validated_data["email"], validated_data["message"]
        )

        if not email_sent:
            # Log email failure but don't fail the request
            # The message is still saved in the database
            logger.warning(
                f"Failed to send email notification for contact message ID: {contact_message.id}"
            )

        # Return success response
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Thank you for your message! I'll get back to you soon.",
                    "id": contact_message.id,
                }
            ),
            201,
        )

    except Exception as e:
        # Rollback database transaction on error
        db.session.rollback()

        # Enhanced error logging for contact form
        logger.error(
            f"Error processing contact form submission - IP: {request.remote_addr} - "
            f"Error: {type(e).__name__}: {str(e)} - "
            f"Timestamp: {datetime.utcnow().isoformat()}",
            exc_info=True,
        )

        return (
            jsonify(
                {
                    "error": {
                        "code": "SERVER_ERROR",
                        "message": "An error occurred while processing your message. Please try again later.",
                        "details": str(e) if current_app.debug else None,
                    }
                }
            ),
            500,
        )


@contact_bp.errorhandler(429)
def handle_rate_limit(e):
    """Handle rate limit exceeded errors"""
    # Enhanced rate limit logging for contact form
    logger.warning(
        f"Contact form rate limit exceeded - IP: {request.remote_addr} - "
        f"User-Agent: {request.headers.get('User-Agent', 'Unknown')} - "
        f"Timestamp: {datetime.utcnow().isoformat()}"
    )
    return (
        jsonify(
            {
                "error": {
                    "code": "RATE_LIMIT_EXCEEDED",
                    "message": "Too many contact form submissions. Please wait before trying again.",
                    "details": {
                        "limit": "5 requests per hour",
                        "retry_after": e.retry_after if hasattr(e, "retry_after") else 3600,
                    },
                }
            }
        ),
        429,
    )


@contact_bp.errorhandler(500)
def handle_server_error(e):
    """Handle 500 errors for contact routes"""
    return (
        jsonify(
            {"error": {"code": "SERVER_ERROR", "message": "Internal server error", "details": None}}
        ),
        500,
    )
