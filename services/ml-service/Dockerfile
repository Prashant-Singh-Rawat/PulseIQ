FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Explicitly train the model once during build or on start
# For this demo, we assume the pkl is already there or we train on start
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000"]
