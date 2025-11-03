# --- Stage 1: Build frontend (Vue) ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install deps
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy sources
COPY frontend/ /app/frontend/
COPY public/ /app/public/

# Build
RUN npm run build


# --- Stage 2: Runtime (FastAPI) ---
FROM python:3.12-slim AS runtime
WORKDIR /app

# System deps (optional)
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    curl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Python deps
RUN pip install --no-cache-dir fastapi uvicorn[standard]

# Copy backend and built frontend
COPY backend/ /app/backend/
COPY --from=frontend-builder /app/frontend/dist /app/dist

# Health env
ENV PORT=8000

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "${PORT}"]
