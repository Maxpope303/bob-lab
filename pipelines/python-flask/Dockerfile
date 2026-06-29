FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY pharmacy_analytics/ ./pharmacy_analytics/
COPY run.py .

EXPOSE 5000

# Use gunicorn in production
ENV FLASK_ENV=production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "60", "pharmacy_analytics.app:create_app()"]
