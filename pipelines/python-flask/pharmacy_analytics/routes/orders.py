"""
routes/orders.py — Order analytics endpoints.
"""

from flask import Blueprint, current_app, jsonify
from ..services.pharmacy_client import PharmacyClient
from ..services.analytics import order_revenue_summary

orders_bp = Blueprint("orders", __name__)


@orders_bp.get("/summary")
def orders_summary():
    client = PharmacyClient(current_app.config["PHARMACY_API_BASE"])
    orders = client.get_orders()
    return jsonify(order_revenue_summary(orders))
