#!/bin/bash

# Vercel Deployment Script for Finance App Frontend
# This script helps deploy the frontend to Vercel

set -e

echo "🚀 Finance App - Vercel Deployment"
echo "===================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found"
    echo "Install it with: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Prompt for backend URL
echo "📝 Configuration"
echo "----------------"
echo ""

read -p "Enter your backend API URL (e.g., https://your-app.railway.app): " BACKEND_URL
if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL is required"
    exit 1
fi

echo ""
echo "🔧 Deploying to Vercel..."
echo ""

# Navigate to frontend directory
cd FinanceApp

# Set environment variable
echo "🔐 Setting environment variables..."
vercel env add VITE_API_URL production <<EOF
$BACKEND_URL
EOF

echo ""
echo "🚢 Deploying application..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your Vercel URL from the output above"
echo "2. Update your backend CORS_ORIGINS with the Vercel URL"
echo "3. Redeploy your backend"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo ""

