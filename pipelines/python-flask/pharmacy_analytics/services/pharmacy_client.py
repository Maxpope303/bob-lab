"""
services/pharmacy_client.py — HTTP client that fetches data from the
Java pharmacy backend and returns plain Python dicts/lists.
"""

import os
from typing import Any, Dict, List

import requests


class PharmacyClient:
    """Thin wrapper around the Java pharmacy REST API."""

    def __init__(self, base_url: str | None = None):
        self.base_url = base_url or os.environ.get(
            "PHARMACY_API_BASE", "http://localhost:9080/simple-pharmacy"
        )
        self.session = requests.Session()
        self.session.headers["Accept"] = "application/json"

    def _get(self, path: str) -> Any:
        resp = self.session.get(f"{self.base_url}{path}", timeout=10)
        resp.raise_for_status()
        return resp.json()

    def get_medicines(self) -> List[Dict]:
        return self._get("/medicine-list.action")

    def search_medicines(self, name: str) -> List[Dict]:
        return self._get(f"/medicine-search.action?name={name}")

    def get_prescriptions(self) -> List[Dict]:
        return self._get("/prescription-list.action")

    def get_orders(self) -> List[Dict]:
        return self._get("/order-list.action")
