#!/bin/bash
# GCP Deployment Script for Personal Profile App
# Usage: ./scripts/deploy-gcp.sh [environment]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_ID=$(gcloud config get-value project)
IMAGE_NAME="personal-profile-app"
REGION="us-central1"
SERVICE_NAME="personal-profile-app"

echo -e "${YELLOW}Starting GCP Deployment...${NC}"
echo "Environment: $ENVIRONMENT"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"

# Validate environment
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
  echo -e "${RED}Invalid environment. Use 'production' or 'staging'${NC}"
  exit 1
fi

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
  export $(cat .env.${ENVIRONMENT} | grep -v '^#' | xargs)
  echo -e "${GREEN}✓ Loaded .env.${ENVIRONMENT}${NC}"
else
  echo -e "${RED}✗ .env.${ENVIRONMENT} not found${NC}"
  exit 1
fi

# Step 1: Build Docker image
echo -e "\n${YELLOW}Step 1: Building Docker image...${NC}"
docker build \
  -t gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${ENVIRONMENT}-latest \
  -t gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S) \
  --build-arg NODE_ENV=${ENVIRONMENT} \
  .
echo -e "${GREEN}✓ Docker image built${NC}"

# Step 2: Push to Container Registry
echo -e "\n${YELLOW}Step 2: Pushing to Google Container Registry...${NC}"
docker push gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${ENVIRONMENT}-latest
echo -e "${GREEN}✓ Image pushed to GCR${NC}"

# Step 3: Deploy to Cloud Run
echo -e "\n${YELLOW}Step 3: Deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME}-${ENVIRONMENT} \
  --image gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${ENVIRONMENT}-latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --set-env-vars \
    NODE_ENV=${ENVIRONMENT},\
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL},\
    NEXTAUTH_URL=${NEXTAUTH_URL} \
  --set-secrets \
    DATABASE_URL=database-url-${ENVIRONMENT}:latest,\
    NEXTAUTH_SECRET=nextauth-secret-${ENVIRONMENT}:latest,\
    GITHUB_ID=github-id:latest,\
    GITHUB_SECRET=github-secret:latest,\
    GOOGLE_ID=google-id:latest,\
    GOOGLE_SECRET=google-secret:latest \
  --memory 1Gi \
  --cpu 1 \
  --timeout 3600 \
  --max-instances 10 \
  --min-instances 1

echo -e "${GREEN}✓ Deployment complete${NC}"

# Step 4: Run migrations
echo -e "\n${YELLOW}Step 4: Running database migrations...${NC}"
gcloud run jobs create migrate-${ENVIRONMENT}-$(date +%s) \
  --image=gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${ENVIRONMENT}-latest \
  --region=${REGION} \
  --set-env-vars DATABASE_URL=${DATABASE_URL} \
  --set-env-vars PRISMA_QUERY_ENGINE_LIBRARY=/app/.next/standalone/node_modules/@prisma/engines/libquery_engine-linux-arm64.so.node \
  --execute \
  --command npm \
  --args run,prisma:migrate:prod || true

echo -e "\n${GREEN}✓ All steps completed successfully!${NC}"
echo -e "${YELLOW}Service URL:${NC}"
gcloud run services describe ${SERVICE_NAME}-${ENVIRONMENT} --region=${REGION} --format='value(status.url)'
