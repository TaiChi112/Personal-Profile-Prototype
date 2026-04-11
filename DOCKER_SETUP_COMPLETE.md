---
title: Professional Docker & GCP Deployment Setup
date: 2024-04-11
---

# Docker & GCP Cloud Run Deployment Guide

✅ **Your project is now production-ready for GCP Cloud Run deployment!**

## What's Been Configured

### 📦 Docker Files Created
- **Dockerfile** - Multi-stage production build with optimizations
- **docker-compose.yml** - Local development environment
- **docker-compose.prod.yml** - Production environment configuration
- **.dockerignore** - Optimized layer caching
- **.gcloudignore** - GCP Cloud Build optimization

### 🔧 Environment Files
- **.env.example** - Development environment template
- **.env.production** - Production secrets template
- **.env.staging** - Staging secrets template

### 📜 Automation Scripts
- **scripts/setup-docker-dev.sh** - Quick local setup
- **scripts/deploy-gcp.sh** - One-command GCP deployment
- **scripts/setup-gcp-secrets.sh** - GCP secrets management
- **.github/workflows/deploy-gcp.yml** - GitHub Actions CI/CD

### 📚 Documentation
- **DOCKER_DEPLOYMENT.md** - Complete deployment guide
- **DOCKER_QUICK_START.sh** - Quick reference commands

---

## 🚀 Quick Start (Local Development)

### WSL Setup (Windows)
```bash
# In WSL terminal
cd /mnt/d/RepositoryVS/Project/personal-profile-prototype
./scripts/setup-docker-dev.sh
```

### Linux/macOS Setup
```bash
chmod +x scripts/setup-docker-dev.sh
./scripts/setup-docker-dev.sh
```

**What this does:**
1. Creates `.env` from `.env.example`
2. Pulls latest Docker images
3. Builds the app image
4. Starts PostgreSQL and Next.js containers
5. Runs database migrations
6. 🎉 App is ready at `http://localhost:3000`

---

## 🌐 GCP Deployment (Production)

### Prerequisites
1. **GCP Project** - Create one at https://console.cloud.google.com
2. **Cloud Run** - Enabled in your GCP project
3. **Cloud SQL** - PostgreSQL 16 instance created
4. **Google Cloud SDK** - Install gcloud CLI
5. **GitHub Repository** - Push your code (for CI/CD)

### Step 1: Prepare Environment Files

```bash
# Copy templates
cp .env.production.template .env.production
cp .env.staging.template .env.staging
```

Edit `.env.production` with your values:
```bash
# Get Cloud SQL connection string from GCP Console
DATABASE_URL=postgresql://user:password@cloudsqlproxy:5432/dbname
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate-new-secret-with-`openssl rand -base64 32`
```

### Step 2: Setup GCP Secrets

```bash
# Authenticate with GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Create secrets
./scripts/setup-gcp-secrets.sh production
./scripts/setup-gcp-secrets.sh staging
```

### Step 3: Deploy via Script (Manual)

```bash
./scripts/deploy-gcp.sh production
# or
./scripts/deploy-gcp.sh staging
```

### Step 4: Deploy via GitHub Actions (Auto)

**First time setup:**
```bash
# In GitHub repository settings:
# 1. Go to Settings > Secrets and variables > Actions
# 2. Add these secrets:
#    - GCP_PROJECT_ID
#    - GCP_SERVICE_ACCOUNT
#    - GCP_WORKLOAD_IDENTITY_PROVIDER
```

**Then:**
```bash
# Just push to main or staging branch - deployment happens automatically!
git push origin main
```

---

## 📋 Common Docker Commands

### Development
```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f app
docker compose logs -f postgres

# Database access
docker compose exec postgres psql -U postgres -d personal_profile_prototype

# Access app container
docker compose exec app bash

# Stop services
docker compose down

# Rebuild images
docker compose up -d --build
```

### Migrations
```bash
# Create new migration
docker compose exec app npm run prisma:migrate:dev

# Check status
docker compose exec app npm run prisma:migrate:status

# Generate Prisma client
docker compose exec app npm run prisma:generate
```

---

## 🔒 Security Features Implemented

✅ Non-root user execution (nextjs user)
✅ Multi-stage builds (dev dependencies not in production)
✅ Alpine Linux (minimal image size)
✅ Health checks enabled
✅ Resource limits configured
✅ Secret management via environment variables
✅ Network isolation (app-network)
✅ PII protection (no-new-privileges)

---

## 📊 Project Structure

```
project-root/
├── Dockerfile                 # Production build
├── docker-compose.yml         # Development setup
├── docker-compose.prod.yml    # Production setup
├── .dockerignore              # Build optimization
├── .gcloudignore              # GCP optimization
├── .env.example               # Development template
├── .env.production            # Production secrets
├── .env.staging               # Staging secrets
├── DOCKER_DEPLOYMENT.md       # Full guide
├── DOCKER_QUICK_START.sh      # Quick commands
├── scripts/
│   ├── setup-docker-dev.sh    # Local setup
│   ├── deploy-gcp.sh          # GCP deployment
│   └── setup-gcp-secrets.sh   # Secrets setup
├── .github/
│   └── workflows/
│       └── deploy-gcp.yml     # GitHub Actions CI/CD
├── prisma/
│   └── schema.prisma
└── app/
    └── (your Next.js app)
```

---

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check if database is healthy
docker compose ps

# Check database logs
docker compose logs postgres

# Manually test connection
docker compose exec app psql -c "SELECT version();"
```

### Port Already in Use
```bash
# Edit .env and change:
APP_PORT=3001
DB_PORT=5433
```

### Build Failures
```bash
# Clean rebuild
docker compose down -v
docker compose up -d --build
```

### Migrations Not Running
```bash
# Manually apply migrations
docker compose exec app npm run prisma:migrate:deploy
```

### GCP Deployment Fails
```bash
# Check Cloud Build logs
gcloud builds log -f

# Check Cloud Run logs
gcloud run logs read personal-profile-app-prod --limit=50
```

---

## 📈 Performance Tips

### Local Development
- Use WSL 2 with Docker for Windows (better performance)
- Keep volumes mounted for code hot-reload
- Use `docker compose logs app` instead of rebuilding

### Production (GCP)
- Enable Cloud SQL Proxy for secure database access
- Use Cloud CDN for static assets
- Set up Cloud Load Balancing for high availability
- Enable Cloud Armor for DDoS protection
- Monitor with Cloud Trace and Cloud Profiler

---

## 🔄 CI/CD Workflow

### Automatic Deployment (GitHub Actions)
```
main branch push → Build Docker image → Push to GCR → Deploy to Cloud Run
staging branch push → Same as above (staging environment)
```

### Manual Deployment
```bash
# Production
./scripts/deploy-gcp.sh production

# Staging
./scripts/deploy-gcp.sh staging
```

---

## 📞 Support & Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Next.js Production Tips](https://nextjs.org/docs/going-to-production)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

---

## 🎯 Next Steps

1. ✅ **Local Testing** - Run `./scripts/setup-docker-dev.sh` and test locally
2. ⚙️ **GCP Setup** - Create Cloud SQL instance and project
3. 🔐 **Secrets** - Configure `.env.production` and run `setup-gcp-secrets.sh`
4. 🚀 **Deploy** - Run `./scripts/deploy-gcp.sh production`
5. 📊 **Monitor** - Set up Cloud Logging and alerting
6. 🔄 **CI/CD** - Configure GitHub Actions secrets (optional)

---

**Happy Deploying! 🚀**
