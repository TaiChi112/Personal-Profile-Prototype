# Docker Deployment Guide

## Overview
This project is configured with professional Docker setup ready for GCP deployment with:
- Multi-stage Dockerfile for optimized production builds
- Docker Compose for local development
- Separate production configuration (docker-compose.prod.yml)
- Security best practices (non-root user, health checks, etc.)

## Prerequisites
- Docker & Docker Compose v2.20+
- WSL (Windows Subsystem for Linux) for Windows users
- Environment variables configured (see `.env.example`)

## Local Development

### Setup
```bash
# Copy environment template
cp .env.example .env

# Update .env with your local configuration if needed
# (defaults are provided for local development)

# Start services
docker compose up -d

# Run migrations
docker compose exec app npm run prisma:migrate:dev

# View logs
docker compose logs -f app
docker compose logs -f postgres
```

### Common Commands
```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Access database
docker compose exec postgres psql -U postgres -d personal_profile_prototype

# Rebuild image
docker compose up -d --build
```

## Production Deployment (GCP)

### Prerequisites on GCP
1. Create a Cloud Run project
2. Set up Cloud SQL (PostgreSQL 16)
3. Create a service account with appropriate permissions
4. Configure secrets in Google Cloud Secret Manager

### Deployment Steps

#### 1. Build and Push to Container Registry
```bash
# Authenticate with GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Set variables
PROJECT_ID=$(gcloud config get-value project)
IMAGE_NAME=personal-profile-app
IMAGE_TAG=latest
REGION=us-central1

# Build Docker image
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME:$IMAGE_TAG .

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME:$IMAGE_TAG
```

#### 2. Deploy to Cloud Run
```bash
gcloud run deploy personal-profile-app \
  --image gcr.io/$PROJECT_ID/$IMAGE_NAME:$IMAGE_TAG \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="YOUR_CLOUD_SQL_CONNECTION_STRING" \
  --set-env-vars NEXTAUTH_URL="https://YOUR_DOMAIN.com" \
  --set-secrets NEXTAUTH_SECRET=nextauth-secret:latest \
  --set-secrets GITHUB_ID=github-id:latest \
  --set-secrets GITHUB_SECRET=github-secret:latest
```

#### 3. Configure Cloud SQL
- Create PostgreSQL 16 instance in Cloud SQL
- Run migrations:
```bash
gcloud sql connect YOUR_INSTANCE \
  --user=postgres \
  && npm run prisma:migrate:prod
```

#### 4. Setup Custom Domain
```bash
# Map custom domain in Cloud Run service settings
# Update NEXTAUTH_URL environment variable to your domain
```

### Environment Variables for Production
Set these in Google Cloud Console or Secret Manager:
- `DATABASE_URL` - Cloud SQL connection string
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Secure random secret
- `GITHUB_ID`, `GITHUB_SECRET` - If using GitHub OAuth
- `GOOGLE_ID`, `GOOGLE_SECRET` - If using Google OAuth
- `NEXT_PUBLIC_API_URL` - Your API endpoint

### Monitoring

#### Cloud Run Logs
```bash
gcloud run logs read personal-profile-app --region=$REGION --limit 50
```

#### Cloud SQL Logs
```bash
gcloud sql operations list --instance=YOUR_INSTANCE
```

## Docker Compose Structure

### Services
1. **postgres** - PostgreSQL 16 database
2. **app** - Next.js application

### Networks
- `app-network` - Internal network for service communication

### Volumes
- `pgdata` - Persistent PostgreSQL data

## Security Considerations

✓ Non-root user execution
✓ Health checks enabled
✓ Minimal Alpine base images
✓ Multi-stage builds (no dev tools in production)
✓ Secrets management via environment variables
✓ Resource limits configured
✓ Logging configured

## Troubleshooting

### Database connection issues
```bash
# Check database health
docker compose ps
docker compose logs postgres

# Test connection
docker compose exec app psql -c "SELECT version();"
```

### Application health check failures
```bash
# Check application logs
docker compose logs app

# Verify migrations ran
docker compose exec app npm run prisma:migrate:status
```

### Port conflicts
Update `.env` file:
```bash
APP_PORT=3001  # Change if 3000 is in use
DB_PORT=5433   # Change if 5432 is in use
```

## Performance Optimization for GCP

1. **Use Cloud SQL Proxy** for secure database connections
2. **Enable Cloud CDN** for static assets
3. **Configure Cloud Armor** for DDoS protection
4. **Use Cloud Load Balancing** for high availability
5. **Enable Cloud Trace** for performance monitoring

## Cleanup

### Local Development
```bash
# Remove all containers and volumes
docker compose down -v

# Remove images
docker-compose down --rmi all
```

### GCP
```bash
# Delete Cloud Run service
gcloud run services delete personal-profile-app --region=$REGION

# Delete Container Registry images
gcloud container images delete gcr.io/$PROJECT_ID/personal-profile-app
```

## References
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
