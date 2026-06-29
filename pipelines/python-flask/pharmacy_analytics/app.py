"""
app.py — Application factory for the Pharmacy Analytics Flask service.
"""

from flask import Flask
from .routes.health import health_bp
from .routes.medicines import medicines_bp
from .routes.prescriptions import prescriptions_bp
from .routes.orders import orders_bp


def create_app(config_name: str = "default") -> Flask:
    app = Flask(__name__)

    # Load configuration
    from .config import config
    app.config.from_object(config[config_name])

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(medicines_bp, url_prefix="/api/v1/analytics/medicines")
    app.register_blueprint(prescriptions_bp, url_prefix="/api/v1/analytics/prescriptions")
    app.register_blueprint(orders_bp, url_prefix="/api/v1/analytics/orders")

    return app
