#!/bin/bash

# Railway Deployment Script for Finance App
# This script helps deploy the backend to Railway

set -e

echo "🚀 Finance App - Railway Deployment"
echo "===================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found"
    echo "Install it with: npm i -g @railway/cli"
    echo "Then run: railway login"
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway"
    echo "Run: railway login"
    exit 1
fi

echo "✅ Logged in to Railway"
echo ""

# Prompt for environment variables
echo "📝 Environment Configuration"
echo "----------------------------"
echo ""

read -p "Enter your OpenAI API key: " OPENAI_KEY
if [ -z "$OPENAI_KEY" ]; then
    echo "❌ OpenAI API key is required"
    exit 1
fi

read -p "Enter your frontend URL (e.g., https://yourapp.vercel.app): " FRONTEND_URL
if [ -z "$FRONTEND_URL" ]; then
    FRONTEND_URL="http://localhost:3000"
    echo "⚠️  Using default: $FRONTEND_URL"
fi

echo ""
echo "🔧 Deploying to Railway..."
echo ""

# Navigate to backend directory
cd FinanceApp/backend

# Initialize Railway project if not exists
if [ ! -f "railway.json" ]; then
    echo "📦 Initializing Railway project..."
    railway init
fi

# Set environment variables
echo "🔐 Setting environment variables..."
railway variables set OPENAI_API_KEY="$OPENAI_KEY"
railway variables set CORS_ORIGINS="$FRONTEND_URL"
railway variables set ENVIRONMENT="production"
railway variables set DATABASE_PATH="/app/tmp/agent.db"
railway variables set LOG_LEVEL="INFO"

echo ""
echo "🚢 Deploying application..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Get your backend URL from Railway dashboard"
echo "2. Update your frontend VITE_API_URL with the backend URL"
echo "3. Redeploy your frontend"
echo ""
echo "🔗 Railway Dashboard: https://railway.app/dashboard"
echo ""

