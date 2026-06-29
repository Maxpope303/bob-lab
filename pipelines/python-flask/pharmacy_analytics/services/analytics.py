"""
services/analytics.py — Aggregation and analytics logic over pharmacy data.
"""

from collections import Counter
from typing import Any, Dict, List


def medicine_stock_summary(medicines: List[Dict]) -> Dict[str, Any]:
    """Return low-stock alerts and value totals."""
    low_stock = [m for m in medicines if m.get("stockQuantity", 0) < 20]
    total_value = sum(
        float(m.get("price", 0)) * m.get("stockQuantity", 0) for m in medicines
    )
    return {
        "total_medicines": len(medicines),
        "low_stock_count": len(low_stock),
        "low_stock_items": [{"id": m["id"], "name": m["name"], "stock": m["stockQuantity"]} for m in low_stock],
        "total_inventory_value": round(total_value, 2),
    }


def prescription_status_breakdown(prescriptions: List[Dict]) -> Dict[str, Any]:
    """Return a count of prescriptions by status."""
    counts = Counter(p.get("status", "UNKNOWN") for p in prescriptions)
    return {
        "total": len(prescriptions),
        "by_status": dict(counts),
    }


def order_revenue_summary(orders: List[Dict]) -> Dict[str, Any]:
    """Return total revenue, revenue by payment method, and status counts."""
    revenue_by_method: Dict[str, float] = {}
    for order in orders:
        method = order.get("paymentMethod", "UNKNOWN")
        amount = float(order.get("totalAmount", 0))
        revenue_by_method[method] = revenue_by_method.get(method, 0.0) + amount

    status_counts = Counter(o.get("status", "UNKNOWN") for o in orders)
    total_revenue = sum(
        float(o.get("totalAmount", 0))
        for o in orders
        if o.get("status") in {"PAID", "COLLECTED"}
    )

    return {
        "total_orders": len(orders),
        "total_revenue": round(total_revenue, 2),
        "revenue_by_payment_method": {k: round(v, 2) for k, v in revenue_by_method.items()},
        "orders_by_status": dict(status_counts),
    }


def top_prescribed_medicines(prescriptions: List[Dict], limit: int = 5) -> List[Dict]:
    """Return the top N most prescribed medicines by quantity."""
    totals: Dict[str, Dict] = {}
    for p in prescriptions:
        mid = p.get("medicineId", "UNKNOWN")
        name = p.get("medicineName", "Unknown")
        qty = p.get("quantity", 0)
        if mid not in totals:
            totals[mid] = {"id": mid, "name": name, "total_quantity": 0, "prescription_count": 0}
        totals[mid]["total_quantity"] += qty
        totals[mid]["prescription_count"] += 1

    return sorted(totals.values(), key=lambda x: x["total_quantity"], reverse=True)[:limit]
