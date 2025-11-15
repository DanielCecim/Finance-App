#!/bin/bash

# Health Check Script for Finance App
# Checks if both frontend and backend are running properly

echo "🏥 Finance App - Health Check"
echo "=============================="
echo ""

# Check backend
echo "🔍 Checking backend (http://localhost:8000)..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/v1/health)

if [ "$BACKEND_STATUS" == "200" ]; then
    echo "✅ Backend is healthy"
    BACKEND_RESPONSE=$(curl -s http://localhost:8000/v1/health)
    echo "   Response: $BACKEND_RESPONSE"
else
    echo "❌ Backend is not responding (Status: $BACKEND_STATUS)"
    echo "   Make sure backend is running: cd FinanceApp && npm run backend"
fi

echo ""

# Check frontend
echo "🔍 Checking frontend (http://localhost:3000)..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)

if [ "$FRONTEND_STATUS" == "200" ]; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not responding (Status: $FRONTEND_STATUS)"
    echo "   Make sure frontend is running: cd FinanceApp && npm run dev"
fi

echo ""

# Check ports
echo "🔍 Checking ports..."
BACKEND_PORT=$(lsof -ti:8000 2>/dev/null || netstat -ano 2>/dev/null | grep ":8000 " | grep "LISTENING" || echo "")
FRONTEND_PORT=$(lsof -ti:3000 2>/dev/null || netstat -ano 2>/dev/null | grep ":3000 " | grep "LISTENING" || echo "")

if [ -n "$BACKEND_PORT" ]; then
    echo "✅ Port 8000 is in use (Backend)"
else
    echo "❌ Port 8000 is not in use"
fi

if [ -n "$FRONTEND_PORT" ]; then
    echo "✅ Port 3000 is in use (Frontend)"
else
    echo "❌ Port 3000 is not in use"
fi

echo ""

# Summary
if [ "$BACKEND_STATUS" == "200" ] && [ "$FRONTEND_STATUS" == "200" ]; then
    echo "✅ All systems operational!"
    echo "🌐 Open http://localhost:3000 in your browser"
else
    echo "⚠️  Some services are not running"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure both services are started"
    echo "2. Check for error messages in the terminal"
    echo "3. Verify environment variables are set"
fi

echo ""

