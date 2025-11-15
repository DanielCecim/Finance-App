#!/bin/bash

# Environment Validation Script
# Checks if all required environment variables are set correctly

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   🔍 Environment Variables Validation                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

ERRORS=0
WARNINGS=0

# Function to check if a variable is set
check_required() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo "❌ REQUIRED: $var_name is NOT set"
        ((ERRORS++))
    else
        echo "✅ $var_name is set"
    fi
}

# Function to check optional variable
check_optional() {
    local var_name=$1
    local var_value=${!var_name}
    local default=$2
    
    if [ -z "$var_value" ]; then
        echo "⚠️  OPTIONAL: $var_name is not set (will use default: $default)"
        ((WARNINGS++))
    else
        echo "✅ $var_name is set to: $var_value"
    fi
}

# Function to validate URL format
validate_url() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        return
    fi
    
    # Check if it starts with http:// or https://
    if [[ ! "$var_value" =~ ^https?:// ]]; then
        echo "   ⚠️  Warning: $var_name should start with http:// or https://"
        ((WARNINGS++))
    fi
    
    # Check if it ends with a slash (shouldn't)
    if [[ "$var_value" =~ /$ ]]; then
        echo "   ⚠️  Warning: $var_name should not end with a trailing slash"
        ((WARNINGS++))
    fi
}

# Function to validate CORS origins
validate_cors() {
    local var_value=${CORS_ORIGINS}
    
    if [ -z "$var_value" ]; then
        return
    fi
    
    # Split by comma and check each origin
    IFS=',' read -ra ORIGINS <<< "$var_value"
    for origin in "${ORIGINS[@]}"; do
        origin=$(echo "$origin" | xargs) # trim whitespace
        
        if [[ ! "$origin" =~ ^https?:// ]]; then
            echo "   ⚠️  Warning: CORS origin '$origin' should start with http:// or https://"
            ((WARNINGS++))
        fi
        
        if [[ "$origin" =~ /$ ]]; then
            echo "   ⚠️  Warning: CORS origin '$origin' should not end with a trailing slash"
            ((WARNINGS++))
        fi
    done
}

echo "═══════════════════════════════════════════════════════════════"
echo "🔧 Backend Environment (Railway)"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Backend required
check_required OPENAI_API_KEY

# Backend optional
check_optional CORS_ORIGINS "http://localhost:3000,http://127.0.0.1:3000"
validate_cors

check_optional ENVIRONMENT "development"
check_optional DATABASE_PATH "./tmp/agent.db"
check_optional LOG_LEVEL "INFO"
check_optional PORT "8000"
check_optional HOST "0.0.0.0"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🎨 Frontend Environment (Vercel)"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Frontend required
if [ -z "$VITE_API_URL" ]; then
    echo "⚠️  VITE_API_URL is not set (will use default: /v1)"
    echo "   In production, this MUST be set to your Railway backend URL"
    ((WARNINGS++))
else
    echo "✅ VITE_API_URL is set to: $VITE_API_URL"
    validate_url VITE_API_URL
fi

# Frontend optional
check_optional VITE_APP_NAME "Finance Dashboard"
check_optional VITE_ENABLE_ANALYTICS "false"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🔍 Additional Validation"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check for production-specific requirements
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🏭 Production environment detected"
    
    # CORS should be set to actual domain, not localhost
    if [[ "$CORS_ORIGINS" =~ localhost ]] || [[ "$CORS_ORIGINS" =~ 127\.0\.0\.1 ]]; then
        echo "   ⚠️  Warning: CORS_ORIGINS includes localhost in production"
        ((WARNINGS++))
    fi
    
    # API URL should not be relative in production
    if [[ "$VITE_API_URL" = "/v1" ]] || [[ -z "$VITE_API_URL" ]]; then
        echo "   ❌ ERROR: VITE_API_URL must be set to your Railway URL in production"
        ((ERRORS++))
    fi
    
    # Should use HTTPS in production
    if [[ "$VITE_API_URL" =~ ^http:// ]]; then
        echo "   ⚠️  Warning: Consider using HTTPS in production"
        ((WARNINGS++))
    fi
    
    if [[ "$CORS_ORIGINS" =~ ^http:// ]]; then
        echo "   ⚠️  Warning: Consider using HTTPS for CORS origins in production"
        ((WARNINGS++))
    fi
else
    echo "💻 Development environment detected"
fi

# Check if backend directory exists
if [ -d "backend" ]; then
    echo "✅ Backend directory found"
    
    # Check for .env file
    if [ -f "backend/.env" ]; then
        echo "✅ Backend .env file found"
    else
        echo "⚠️  Backend .env file not found (using environment variables)"
        ((WARNINGS++))
    fi
else
    echo "⚠️  Backend directory not found"
fi

# Check if frontend has .env
if [ -f ".env" ] || [ -f ".env.local" ]; then
    echo "✅ Frontend .env file found"
else
    echo "⚠️  Frontend .env file not found (using environment variables)"
    ((WARNINGS++))
fi

# Summary
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "📊 Validation Summary"
echo "═══════════════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed! Your environment is properly configured."
    echo ""
    echo "Next steps:"
    echo "  1. Deploy backend to Railway"
    echo "  2. Deploy frontend to Vercel"
    echo "  3. Test your application"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  $WARNINGS warning(s) found, but no critical errors."
    echo "   Your app may work, but review warnings above for best practices."
    echo ""
    echo "Next steps:"
    echo "  1. Review warnings above"
    echo "  2. Fix any production-related issues"
    echo "  3. Deploy and test"
    exit 0
else
    echo "❌ $ERRORS error(s) and $WARNINGS warning(s) found."
    echo "   Please fix the errors above before deploying."
    echo ""
    echo "Common fixes:"
    echo "  • Set OPENAI_API_KEY in backend/.env or environment"
    echo "  • Set VITE_API_URL in Vercel environment variables"
    echo "  • Set CORS_ORIGINS in Railway environment variables"
    echo ""
    echo "See docs/ENV_VARIABLES.md for detailed configuration guide."
    exit 1
fi

