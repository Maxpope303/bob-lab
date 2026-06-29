"""
tests/test_analytics.py — Unit tests for analytics aggregation logic.
Pure Python, no Flask context needed.
"""

import pytest
from pharmacy_analytics.services.analytics import (
    medicine_stock_summary,
    prescription_status_breakdown,
    order_revenue_summary,
    top_prescribed_medicines,
)

MEDICINES = [
    {"id": "MED001", "name": "Amoxicillin 500mg", "price": "15.99", "stockQuantity": 100},
    {"id": "MED002", "name": "Lisinopril 10mg",   "price": "12.50", "stockQuantity": 5},
    {"id": "MED003", "name": "Metformin 850mg",   "price": "18.75", "stockQuantity": 200},
]

PRESCRIPTIONS = [
    {"id": "RX001", "medicineId": "MED001", "medicineName": "Amoxicillin 500mg", "quantity": 14, "status": "PENDING"},
    {"id": "RX002", "medicineId": "MED001", "medicineName": "Amoxicillin 500mg", "quantity": 7,  "status": "VALIDATED"},
    {"id": "RX003", "medicineId": "MED002", "medicineName": "Lisinopril 10mg",   "quantity": 30, "status": "PENDING"},
    {"id": "RX004", "medicineId": "MED003", "medicineName": "Metformin 850mg",   "quantity": 28, "status": "FULFILLED"},
]

ORDERS = [
    {"id": "ORD001", "totalAmount": "47.97",  "paymentMethod": "CASH",        "status": "COLLECTED"},
    {"id": "ORD002", "totalAmount": "125.00", "paymentMethod": "INSURANCE",   "status": "PAID"},
    {"id": "ORD003", "totalAmount": "22.00",  "paymentMethod": "CREDIT_CARD", "status": "PENDING"},
]


class TestMedicineStockSummary:
    def test_total_count(self):
        result = medicine_stock_summary(MEDICINES)
        assert result["total_medicines"] == 3

    def test_low_stock_detection(self):
        result = medicine_stock_summary(MEDICINES)
        assert result["low_stock_count"] == 1
        assert result["low_stock_items"][0]["id"] == "MED002"

    def test_inventory_value(self):
        result = medicine_stock_summary(MEDICINES)
        # 15.99*100 + 12.50*5 + 18.75*200 = 1599 + 62.50 + 3750 = 5411.50
        assert result["total_inventory_value"] == 5411.50

    def test_empty_list(self):
        result = medicine_stock_summary([])
        assert result["total_medicines"] == 0
        assert result["low_stock_count"] == 0
        assert result["total_inventory_value"] == 0


class TestPrescriptionStatusBreakdown:
    def test_total(self):
        result = prescription_status_breakdown(PRESCRIPTIONS)
        assert result["total"] == 4

    def test_status_counts(self):
        result = prescription_status_breakdown(PRESCRIPTIONS)
        assert result["by_status"]["PENDING"] == 2
        assert result["by_status"]["VALIDATED"] == 1
        assert result["by_status"]["FULFILLED"] == 1

    def test_empty(self):
        result = prescription_status_breakdown([])
        assert result["total"] == 0
        assert result["by_status"] == {}


class TestOrderRevenueSummary:
    def test_total_orders(self):
        result = order_revenue_summary(ORDERS)
        assert result["total_orders"] == 3

    def test_revenue_excludes_pending(self):
        result = order_revenue_summary(ORDERS)
        # Only PAID and COLLECTED count: 47.97 + 125.00 = 172.97
        assert result["total_revenue"] == 172.97

    def test_revenue_by_payment_method(self):
        result = order_revenue_summary(ORDERS)
        assert result["revenue_by_payment_method"]["CASH"] == 47.97
        assert result["revenue_by_payment_method"]["INSURANCE"] == 125.00

    def test_orders_by_status(self):
        result = order_revenue_summary(ORDERS)
        assert result["orders_by_status"]["COLLECTED"] == 1
        assert result["orders_by_status"]["PAID"] == 1
        assert result["orders_by_status"]["PENDING"] == 1


class TestTopPrescribedMedicines:
    def test_correct_order(self):
        result = top_prescribed_medicines(PRESCRIPTIONS, limit=3)
        # MED002 has qty 30, MED003 has qty 28, MED001 has qty 21
        assert result[0]["id"] == "MED002"
        assert result[1]["id"] == "MED003"
        assert result[2]["id"] == "MED001"

    def test_limit_respected(self):
        result = top_prescribed_medicines(PRESCRIPTIONS, limit=2)
        assert len(result) == 2

    def test_empty(self):
        assert top_prescribed_medicines([]) == []
