FROM python:3.12-slim

WORKDIR /app

# System dependencies required by Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV BASE_URL=http://host.docker.internal:5173

CMD ["pytest", "-v"]