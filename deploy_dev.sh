#!/bin/bash

set -e

echo "=== ASCENT Development Deployment ==="
echo ""

# Stop and remove containers if they exist
echo "Stopping containers..."
docker compose down --remove-orphans 2>/dev/null || true

# Remove images if they exist
if docker image inspect ascent-frontend >/dev/null 2>&1; then
  echo "Removing ascent-frontend image..."
  docker rmi ascent-frontend
fi

if docker image inspect ascent-backend >/dev/null 2>&1; then
  echo "Removing ascent-backend image..."
  docker rmi ascent-backend
fi

# Build and start services
echo ""
echo "Building and starting services..."
docker compose up --build -d

# Follow logs in real time (last 200 lines)
echo ""
echo "Following logs (last 200 lines)..."
docker compose logs -f --tail 200
