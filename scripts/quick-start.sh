#!/bin/bash

# Quick Start Script for Finance App
# Sets up the application for local development

set -e

echo "🚀 Finance App - Quick Start"
echo "============================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.10+ from https://python.org"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✅ Python $PYTHON_VERSION found"

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd FinanceApp
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt
cd ../..

echo ""
echo "🔐 Setting up environment variables..."
echo ""

# Create backend .env if it doesn't exist
if [ ! -f "FinanceApp/backend/.env" ]; then
    read -p "Enter your OpenAI API key: " OPENAI_KEY
    if [ -z "$OPENAI_KEY" ]; then
        echo "⚠️  Warning: OpenAI API key not provided"
        echo "You can add it later to FinanceApp/backend/.env"
        OPENAI_KEY="your_api_key_here"
    fi
    
    cat > FinanceApp/backend/.env <<EOF
# OpenAI Configuration
OPENAI_API_KEY=$OPENAI_KEY

# Server Configuration
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENVIRONMENT=development
DATABASE_PATH=./tmp/agent.db
LOG_LEVEL=DEBUG
EOF
    echo "✅ Created FinanceApp/backend/.env"
else
    echo "✅ FinanceApp/backend/.env already exists"
fi

# Create frontend .env if it doesn't exist
if [ ! -f "FinanceApp/.env" ]; then
    cat > FinanceApp/.env <<EOF
# Backend API URL
VITE_API_URL=http://localhost:8000
EOF
    echo "✅ Created FinanceApp/.env"
else
    echo "✅ FinanceApp/.env already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd FinanceApp"
echo "  npm run backend"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd FinanceApp"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""

