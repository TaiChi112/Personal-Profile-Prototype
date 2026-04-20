#!/bin/bash
# Local Docker development setup script
# Usage: ./scripts/setup-docker-dev.sh

set -e

echo "Setting up local Docker development environment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create .env from example if it doesn't exist
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}Creating .env from .env.example...${NC}"
  cp .env.example .env
  echo -e "${GREEN}✓ .env created (using default local values)${NC}"
else
  echo -e "${GREEN}✓ .env already exists${NC}"
fi

# Pull the latest images
echo -e "\n${YELLOW}Pulling latest images...${NC}"
docker compose pull

# Build the app image
echo -e "\n${YELLOW}Building app image...${NC}"
docker compose build

# Start services
echo -e "\n${YELLOW}Starting services...${NC}"
docker compose up -d

# Wait for database to be ready
echo -e "\n${YELLOW}Waiting for database to be ready...${NC}"
sleep 5

# Run migrations
echo -e "\n${YELLOW}Running Prisma migrations...${NC}"
docker compose exec -T app npm run prisma:migrate:dev -- --name init || true

echo -e "\n${GREEN}✓ Docker development environment is ready!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Access the app at: http://localhost:3000"
echo "2. View logs: docker compose logs -f app"
echo "3. Access database: docker compose exec postgres psql -U postgres -d personal_profile_prototype"
