"""
routes/prescriptions.py — Prescription analytics endpoints.
"""

from flask import Blueprint, current_app, jsonify
from ..services.pharmacy_client import PharmacyClient
from ..services.analytics import prescription_status_breakdown, top_prescribed_medicines

prescriptions_bp = Blueprint("prescriptions", __name__)


@prescriptions_bp.get("/summary")
def prescriptions_summary():
    client = PharmacyClient(current_app.config["PHARMACY_API_BASE"])
    prescriptions = client.get_prescriptions()
    return jsonify(prescription_status_breakdown(prescriptions))


@prescriptions_bp.get("/top-medicines")
def top_medicines():
    client = PharmacyClient(current_app.config["PHARMACY_API_BASE"])
    prescriptions = client.get_prescriptions()
    return jsonify(top_prescribed_medicines(prescriptions))
