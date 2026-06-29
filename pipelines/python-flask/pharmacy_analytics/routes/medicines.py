"""
routes/medicines.py — Medicine analytics endpoints.
"""

from flask import Blueprint, current_app, jsonify
from ..services.pharmacy_client import PharmacyClient
from ..services.analytics import medicine_stock_summary

medicines_bp = Blueprint("medicines", __name__)


@medicines_bp.get("/summary")
def medicines_summary():
    client = PharmacyClient(current_app.config["PHARMACY_API_BASE"])
    medicines = client.get_medicines()
    return jsonify(medicine_stock_summary(medicines))


@medicines_bp.get("/")
def medicines_list():
    client = PharmacyClient(current_app.config["PHARMACY_API_BASE"])
    return jsonify(client.get_medicines())
