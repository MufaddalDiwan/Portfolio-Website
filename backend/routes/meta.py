"""
Meta API routes
Handles site metadata endpoints for the portfolio API
"""

from flask import Blueprint, request, jsonify
from models import db, SiteMeta
from schemas import site_meta_schema

meta_bp = Blueprint('meta', __name__, url_prefix='/api/meta')

@meta_bp.route('', methods=['GET'])
def get_meta():
    """
    GET /api/meta
    Returns site metadata including hero content, bio, and social links
    Returns the first (and typically only) SiteMeta record
    """
    try:
        # Get the first site meta record (there should typically be only one)
        site_meta = SiteMeta.query.first()
        meta = SiteMeta.query.order_by(SiteMeta.id.desc()).first()
        
        if not site_meta:
            # Return default empty structure if no meta data exists
            return jsonify({
                'id': None,
                'heroTitle': None,
                'heroSubtitle': None,
                'bioMd': None,
                'socialLinks': []
            }), 200
        
        # Serialize site meta
        result = site_meta_schema.dump(site_meta)

        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'error': {
                'code': 'SERVER_ERROR',
                'message': 'An error occurred while fetching site metadata',
                'details': str(e) if request.args.get('debug') else None
            }
        }), 500


@meta_bp.errorhandler(500)
def handle_server_error(e):
    """Handle 500 errors for meta routes"""
    return jsonify({
        'error': {
            'code': 'SERVER_ERROR',
            'message': 'Internal server error',
            'details': None
        }
    }), 500