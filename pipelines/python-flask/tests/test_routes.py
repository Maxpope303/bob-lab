"""
tests/test_routes.py — Integration tests for Flask routes using
the `responses` library to mock the Java backend.
"""

import pytest
import responses as rsps_lib
from pharmacy_analytics.app import create_app

MOCK_MEDICINES = [
    {"id": "MED001", "name": "Amoxicillin 500mg", "price": 15.99, "stockQuantity": 100, "description": "", "manufacturer": "PharmaCorp"},
    {"id": "MED002", "name": "Lisinopril 10mg",   "price": 12.50, "stockQuantity": 5,   "description": "", "manufacturer": "HealthMeds"},
]
MOCK_ORDERS = [
    {"id": "ORD001", "totalAmount": 47.97,  "paymentMethod": "CASH",      "status": "COLLECTED"},
    {"id": "ORD002", "totalAmount": 125.00, "paymentMethod": "INSURANCE", "status": "PAID"},
]
MOCK_PRESCRIPTIONS = [
    {"id": "RX001", "medicineId": "MED001", "medicineName": "Amoxicillin 500mg", "quantity": 14, "status": "PENDING"},
]


@pytest.fixture
def app():
    app = create_app("testing")
    app.config["PHARMACY_API_BASE"] = "http://mock-pharmacy/simple-pharmacy"
    return app


@pytest.fixture
def client(app):
    return app.test_client()


def test_health_check(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["status"] == "ok"
    assert data["service"] == "pharmacy-analytics"


@rsps_lib.activate
def test_medicines_summary(client):
    rsps_lib.add(rsps_lib.GET, "http://mock-pharmacy/simple-pharmacy/medicine-list.action", json=MOCK_MEDICINES)
    resp = client.get("/api/v1/analytics/medicines/summary")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total_medicines"] == 2
    assert data["low_stock_count"] == 1


@rsps_lib.activate
def test_medicines_list(client):
    rsps_lib.add(rsps_lib.GET, "http://mock-pharmacy/simple-pharmacy/medicine-list.action", json=MOCK_MEDICINES)
    resp = client.get("/api/v1/analytics/medicines/")
    assert resp.status_code == 200
    assert len(resp.get_json()) == 2


@rsps_lib.activate
def test_orders_summary(client):
    rsps_lib.add(rsps_lib.GET, "http://mock-pharmacy/simple-pharmacy/order-list.action", json=MOCK_ORDERS)
    resp = client.get("/api/v1/analytics/orders/summary")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total_orders"] == 2
    assert data["total_revenue"] == 172.97


@rsps_lib.activate
def test_prescriptions_summary(client):
    rsps_lib.add(rsps_lib.GET, "http://mock-pharmacy/simple-pharmacy/prescription-list.action", json=MOCK_PRESCRIPTIONS)
    resp = client.get("/api/v1/analytics/prescriptions/summary")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["total"] == 1
    assert data["by_status"]["PENDING"] == 1


@rsps_lib.activate
def test_top_medicines(client):
    rsps_lib.add(rsps_lib.GET, "http://mock-pharmacy/simple-pharmacy/prescription-list.action", json=MOCK_PRESCRIPTIONS)
    resp = client.get("/api/v1/analytics/prescriptions/top-medicines")
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, list)
    assert data[0]["id"] == "MED001"
