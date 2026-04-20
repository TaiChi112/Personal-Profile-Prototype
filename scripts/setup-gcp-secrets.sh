#!/bin/bash
# Setup GCP Secrets
# Usage: ./scripts/setup-gcp-secrets.sh [environment]

set -e

ENVIRONMENT=${1:-production}

echo "Setting up GCP Secrets for $ENVIRONMENT..."

# Check if secrets exist
create_or_update_secret() {
  local secret_name=$1
  local secret_value=$2
  
  if gcloud secrets describe $secret_name &>/dev/null; then
    echo "Updating secret: $secret_name"
    echo -n "$secret_value" | gcloud secrets versions add $secret_name --data-file=-
  else
    echo "Creating secret: $secret_name"
    echo -n "$secret_value" | gcloud secrets create $secret_name --data-file=-
  fi
}

# Read environment file
if [ ! -f ".env.${ENVIRONMENT}" ]; then
  echo "Error: .env.${ENVIRONMENT} not found"
  exit 1
fi

# Load environment variables
export $(cat .env.${ENVIRONMENT} | grep -v '^#' | xargs)

# Create/Update secrets
create_or_update_secret "database-url-${ENVIRONMENT}" "$DATABASE_URL"
create_or_update_secret "nextauth-secret-${ENVIRONMENT}" "$NEXTAUTH_SECRET"
create_or_update_secret "github-id" "$GITHUB_ID"
create_or_update_secret "github-secret" "$GITHUB_SECRET"
create_or_update_secret "google-id" "$GOOGLE_ID"
create_or_update_secret "google-secret" "$GOOGLE_SECRET"

echo "✓ All secrets created/updated successfully"
