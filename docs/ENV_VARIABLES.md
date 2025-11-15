# Environment Variables Reference

Complete reference for all environment variables used in the Finance App.

---

## Backend Environment Variables

### Required Variables

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `OPENAI_API_KEY` | OpenAI API key for AI agent | `sk-proj-abc123...` | **Required**. Get from OpenAI dashboard |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` | `https://yourdomain.com,https://www.yourdomain.com` |
| `ENVIRONMENT` | Runtime environment | `development` | `production`, `staging`, `development` |
| `DATABASE_PATH` | Path to SQLite database | `./tmp/agent.db` | `/data/agent.db` |
| `LOG_LEVEL` | Logging level | `INFO` | `DEBUG`, `INFO`, `WARNING`, `ERROR` |
| `PORT` | Server port | `8000` | `8000` (Railway/Render auto-set) |
| `HOST` | Server host | `0.0.0.0` | `0.0.0.0` |

---

## Frontend Environment Variables

### Required Variables

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` | **Required**. Must be set at build time |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_APP_NAME` | Application name | `Finance Dashboard` | Custom branding |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `false` | `true`, `false` |

---

## Environment File Templates

### Local Development

**Backend (`FinanceApp/backend/.env`):**
```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-key-here

# Server Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENVIRONMENT=development
DATABASE_PATH=./tmp/agent.db
LOG_LEVEL=DEBUG

# Optional
HOST=0.0.0.0
PORT=8000
```

**Frontend (`FinanceApp/.env`):**
```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Optional
VITE_APP_NAME=Finance Dashboard
```

---

### Production - Railway (Backend)

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-production-key

# Server Configuration
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ENVIRONMENT=production
DATABASE_PATH=/app/tmp/agent.db
LOG_LEVEL=INFO

# Railway auto-sets PORT and HOST
```

---

### Production - Vercel (Frontend)

```env
# Backend API URL
VITE_API_URL=https://your-backend.railway.app

# Optional
VITE_APP_NAME=Finance Dashboard
VITE_ENABLE_ANALYTICS=true
```

---

### Production - Docker

**docker-compose .env file:**
```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-production-key

# Backend Configuration
CORS_ORIGINS=https://yourdomain.com
ENVIRONMENT=production

# Frontend Configuration
VITE_API_URL=https://api.yourdomain.com

# Database
DATABASE_PATH=/app/tmp/agent.db

# Logging
LOG_LEVEL=INFO
```

---

## Platform-Specific Configuration

### Railway

Railway automatically injects:
- `PORT` - Port your application should listen on
- `RAILWAY_ENVIRONMENT` - Current environment name
- `RAILWAY_GIT_COMMIT_SHA` - Git commit hash

**How to set:**
1. Go to your Railway project
2. Click "Variables" tab
3. Add each variable
4. Redeploy

### Vercel

Vercel environment variables are set per environment:
- **Production** - Used for production deployments
- **Preview** - Used for preview deployments
- **Development** - Used locally with Vercel CLI

**How to set:**
1. Go to Project Settings → Environment Variables
2. Add variable name and value
3. Select environments
4. Redeploy

### Docker

Pass via `.env` file or command line:

```bash
# Using .env file
docker-compose --env-file .env.production up

# Command line
docker run -e OPENAI_API_KEY=sk-... finance-backend
```

---

## Security Best Practices

### ✅ DO:

1. **Use different keys for development and production**
```env
# Development
OPENAI_API_KEY=sk-proj-dev-key...

# Production
OPENAI_API_KEY=sk-proj-prod-key...
```

2. **Never commit `.env` files**
```bash
# Add to .gitignore
.env
.env.local
.env.production
*.env
```

3. **Use environment-specific files**
```
.env.development
.env.staging
.env.production
```

4. **Rotate API keys regularly**
```bash
# Set expiration reminders
# Rotate every 90 days
```

### ❌ DON'T:

1. **Don't hardcode secrets in code**
```python
# BAD
api_key = "sk-proj-abc123..."

# GOOD
api_key = os.getenv("OPENAI_API_KEY")
```

2. **Don't expose secrets in logs**
```python
# BAD
logger.info(f"Using API key: {api_key}")

# GOOD
logger.info("API key configured successfully")
```

3. **Don't commit secrets to Git**
```bash
# If you accidentally committed:
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all
```

---

## Validation & Testing

### Validate Environment Variables

**Backend validation (`FinanceApp/backend/config.py`):**

```python
import os
from pydantic import BaseSettings, validator

class Settings(BaseSettings):
    openai_api_key: str
    cors_origins: str = "http://localhost:3000"
    environment: str = "development"
    database_path: str = "./tmp/agent.db"
    log_level: str = "INFO"
    
    @validator("openai_api_key")
    def validate_openai_key(cls, v):
        if not v.startswith("sk-"):
            raise ValueError("Invalid OpenAI API key format")
        return v
    
    @validator("cors_origins")
    def validate_cors(cls, v):
        origins = v.split(",")
        for origin in origins:
            if not origin.startswith("http"):
                raise ValueError(f"Invalid CORS origin: {origin}")
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Usage in api.py
settings = Settings()
```

### Test Script

Create `scripts/test-env.sh`:

```bash
#!/bin/bash

echo "Testing environment variables..."

# Backend
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ OPENAI_API_KEY not set"
    exit 1
else
    echo "✅ OPENAI_API_KEY configured"
fi

if [ -z "$VITE_API_URL" ]; then
    echo "❌ VITE_API_URL not set"
    exit 1
else
    echo "✅ VITE_API_URL configured"
fi

echo "✅ All required variables set"
```

---

## Troubleshooting

### Common Issues

**Issue: "OpenAI API key not found"**
```bash
# Check if variable is set
echo $OPENAI_API_KEY

# For Docker
docker exec finance-backend env | grep OPENAI

# For Railway
railway run env | grep OPENAI
```

**Issue: CORS errors in browser**
```bash
# Check CORS_ORIGINS matches your frontend URL
echo $CORS_ORIGINS

# Must include protocol (http/https)
# ✅ Good: https://yourdomain.com
# ❌ Bad: yourdomain.com
```

**Issue: Frontend can't connect to backend**
```bash
# Check VITE_API_URL at build time
cat .env | grep VITE_API_URL

# Rebuild frontend after changing
npm run build
```

---

## Migration Guide

### From Hardcoded to Environment Variables

**Before:**
```python
# api.py
OPENAI_API_KEY = "sk-proj-abc123..."
CORS_ORIGINS = ["http://localhost:3000"]
```

**After:**
```python
# api.py
import os
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
```

### Update Existing Deployment

```bash
# 1. Add variables to platform
# 2. Remove hardcoded values from code
# 3. Redeploy application
# 4. Test functionality
```

---

## Additional Resources

- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Docker Secrets](https://docs.docker.com/engine/swarm/secrets/)
- [12-Factor App Config](https://12factor.net/config)

