"""
run.py — Entry point for running the Flask dev server.
"""

from pharmacy_analytics.app import create_app

if __name__ == "__main__":
    app = create_app("development")
    app.run(host="0.0.0.0", port=5000, debug=True)
