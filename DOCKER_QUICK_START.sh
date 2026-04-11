#!/bin/bash
# Docker Utilities - Common commands for development and deployment

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "=== Docker Utilities ==="
echo ""
echo "Development Commands:"
echo "  ./scripts/setup-docker-dev.sh          - Setup local Docker environment"
echo "  docker compose up -d                   - Start containers"
echo "  docker compose down                    - Stop containers"
echo "  docker compose logs -f app             - View app logs"
echo "  docker compose logs -f postgres        - View database logs"
echo "  docker compose exec app bash           - Access app container"
echo "  docker compose exec postgres psql      - Access database"
echo ""
echo "Database Commands:"
echo "  docker compose exec app npm run prisma:migrate:dev    - Create migration"
echo "  docker compose exec app npm run prisma:migrate:status - Check migration status"
echo "  docker compose exec app npm run prisma:generate       - Generate Prisma client"
echo ""
echo "Production/GCP Commands:"
echo "  ./scripts/setup-gcp-secrets.sh production    - Setup GCP secrets (requires .env.production)"
echo "  ./scripts/deploy-gcp.sh production           - Deploy to GCP Cloud Run (auto from GitHub)"
echo ""
echo "Build/Testing:"
echo "  docker compose up -d --build                 - Rebuild and start containers"
echo "  docker compose exec app npm run lint         - Run linter"
echo "  docker compose exec app npm run build        - Build production"
echo ""
echo "Cleanup:"
echo "  docker compose down -v                       - Remove containers and volumes"
echo "  docker system prune                          - Remove unused images/containers"
echo ""
echo "=== Quick Start ==="
echo "1. Run: ./scripts/setup-docker-dev.sh"
echo "2. Wait for database to be ready (10 seconds)"
echo "3. Open: http://localhost:3000"
echo ""
