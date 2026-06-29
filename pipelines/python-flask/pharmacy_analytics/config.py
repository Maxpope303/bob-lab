"""
config.py — Configuration classes for different environments.
"""

import os


class Config:
    DEBUG = False
    TESTING = False
    # Base URL of the Java pharmacy backend
    PHARMACY_API_BASE = os.environ.get("PHARMACY_API_BASE", "http://localhost:9080/simple-pharmacy")
    # Cache TTL in seconds for aggregated stats
    CACHE_TTL = int(os.environ.get("CACHE_TTL", "60"))


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    PHARMACY_API_BASE = "http://mock-pharmacy/simple-pharmacy"


class ProductionConfig(Config):
    pass


config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
