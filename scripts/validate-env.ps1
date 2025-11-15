# Environment Validation Script (PowerShell)
# Checks if all required environment variables are set correctly

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🔍 Environment Variables Validation                        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$ERRORS = 0
$WARNINGS = 0

# Function to check if a variable is set
function Check-Required {
    param($VarName)
    $VarValue = [Environment]::GetEnvironmentVariable($VarName)
    
    if ([string]::IsNullOrEmpty($VarValue)) {
        Write-Host "❌ REQUIRED: $VarName is NOT set" -ForegroundColor Red
        $script:ERRORS++
    } else {
        Write-Host "✅ $VarName is set" -ForegroundColor Green
    }
}

# Function to check optional variable
function Check-Optional {
    param($VarName, $Default)
    $VarValue = [Environment]::GetEnvironmentVariable($VarName)
    
    if ([string]::IsNullOrEmpty($VarValue)) {
        Write-Host "⚠️  OPTIONAL: $VarName is not set (will use default: $Default)" -ForegroundColor Yellow
        $script:WARNINGS++
    } else {
        Write-Host "✅ $VarName is set to: $VarValue" -ForegroundColor Green
    }
    return $VarValue
}

# Function to validate URL format
function Validate-URL {
    param($VarName)
    $VarValue = [Environment]::GetEnvironmentVariable($VarName)
    
    if ([string]::IsNullOrEmpty($VarValue)) {
        return
    }
    
    # Check if it starts with http:// or https://
    if (-not ($VarValue -match '^https?://')) {
        Write-Host "   ⚠️  Warning: $VarName should start with http:// or https://" -ForegroundColor Yellow
        $script:WARNINGS++
    }
    
    # Check if it ends with a slash (shouldn't)
    if ($VarValue -match '/$') {
        Write-Host "   ⚠️  Warning: $VarName should not end with a trailing slash" -ForegroundColor Yellow
        $script:WARNINGS++
    }
}

# Function to validate CORS origins
function Validate-CORS {
    $VarValue = [Environment]::GetEnvironmentVariable("CORS_ORIGINS")
    
    if ([string]::IsNullOrEmpty($VarValue)) {
        return
    }
    
    # Split by comma and check each origin
    $Origins = $VarValue -split ','
    foreach ($origin in $Origins) {
        $origin = $origin.Trim()
        
        if (-not ($origin -match '^https?://')) {
            Write-Host "   ⚠️  Warning: CORS origin '$origin' should start with http:// or https://" -ForegroundColor Yellow
            $script:WARNINGS++
        }
        
        if ($origin -match '/$') {
            Write-Host "   ⚠️  Warning: CORS origin '$origin' should not end with a trailing slash" -ForegroundColor Yellow
            $script:WARNINGS++
        }
    }
}

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔧 Backend Environment (Railway)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Backend required
Check-Required "OPENAI_API_KEY"

# Backend optional
Check-Optional "CORS_ORIGINS" "http://localhost:3000,http://127.0.0.1:3000" | Out-Null
Validate-CORS

Check-Optional "ENVIRONMENT" "development" | Out-Null
Check-Optional "DATABASE_PATH" "./tmp/agent.db" | Out-Null
Check-Optional "LOG_LEVEL" "INFO" | Out-Null
Check-Optional "PORT" "8000" | Out-Null
Check-Optional "HOST" "0.0.0.0" | Out-Null

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎨 Frontend Environment (Vercel)" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Frontend required
$VITE_API_URL = [Environment]::GetEnvironmentVariable("VITE_API_URL")
if ([string]::IsNullOrEmpty($VITE_API_URL)) {
    Write-Host "⚠️  VITE_API_URL is not set (will use default: /v1)" -ForegroundColor Yellow
    Write-Host "   In production, this MUST be set to your Railway backend URL" -ForegroundColor Yellow
    $WARNINGS++
} else {
    Write-Host "✅ VITE_API_URL is set to: $VITE_API_URL" -ForegroundColor Green
    Validate-URL "VITE_API_URL"
}

# Frontend optional
Check-Optional "VITE_APP_NAME" "Finance Dashboard" | Out-Null
Check-Optional "VITE_ENABLE_ANALYTICS" "false" | Out-Null

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔍 Additional Validation" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$ENVIRONMENT = [Environment]::GetEnvironmentVariable("ENVIRONMENT")
$CORS_ORIGINS = [Environment]::GetEnvironmentVariable("CORS_ORIGINS")

# Check for production-specific requirements
if ($ENVIRONMENT -eq "production") {
    Write-Host "🏭 Production environment detected" -ForegroundColor Yellow
    
    # CORS should be set to actual domain, not localhost
    if (($CORS_ORIGINS -match 'localhost') -or ($CORS_ORIGINS -match '127\.0\.0\.1')) {
        Write-Host "   ⚠️  Warning: CORS_ORIGINS includes localhost in production" -ForegroundColor Yellow
        $WARNINGS++
    }
    
    # API URL should not be relative in production
    if (($VITE_API_URL -eq "/v1") -or ([string]::IsNullOrEmpty($VITE_API_URL))) {
        Write-Host "   ❌ ERROR: VITE_API_URL must be set to your Railway URL in production" -ForegroundColor Red
        $ERRORS++
    }
    
    # Should use HTTPS in production
    if ($VITE_API_URL -match '^http://') {
        Write-Host "   ⚠️  Warning: Consider using HTTPS in production" -ForegroundColor Yellow
        $WARNINGS++
    }
    
    if ($CORS_ORIGINS -match '^http://') {
        Write-Host "   ⚠️  Warning: Consider using HTTPS for CORS origins in production" -ForegroundColor Yellow
        $WARNINGS++
    }
} else {
    Write-Host "💻 Development environment detected" -ForegroundColor Cyan
}

# Check if backend directory exists
if (Test-Path "backend") {
    Write-Host "✅ Backend directory found" -ForegroundColor Green
    
    # Check for .env file
    if (Test-Path "backend/.env") {
        Write-Host "✅ Backend .env file found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Backend .env file not found (using environment variables)" -ForegroundColor Yellow
        $WARNINGS++
    }
} else {
    Write-Host "⚠️  Backend directory not found" -ForegroundColor Yellow
}

# Check if frontend has .env
if ((Test-Path ".env") -or (Test-Path ".env.local")) {
    Write-Host "✅ Frontend .env file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend .env file not found (using environment variables)" -ForegroundColor Yellow
    $WARNINGS++
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 Validation Summary" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($ERRORS -eq 0 -and $WARNINGS -eq 0) {
    Write-Host "✅ All checks passed! Your environment is properly configured." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "  1. Deploy backend to Railway"
    Write-Host "  2. Deploy frontend to Vercel"
    Write-Host "  3. Test your application"
    exit 0
} elseif ($ERRORS -eq 0) {
    Write-Host "⚠️  $WARNINGS warning(s) found, but no critical errors." -ForegroundColor Yellow
    Write-Host "   Your app may work, but review warnings above for best practices."
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "  1. Review warnings above"
    Write-Host "  2. Fix any production-related issues"
    Write-Host "  3. Deploy and test"
    exit 0
} else {
    Write-Host "❌ $ERRORS error(s) and $WARNINGS warning(s) found." -ForegroundColor Red
    Write-Host "   Please fix the errors above before deploying."
    Write-Host ""
    Write-Host "Common fixes:"
    Write-Host "  • Set OPENAI_API_KEY in backend/.env or environment"
    Write-Host "  • Set VITE_API_URL in Vercel environment variables"
    Write-Host "  • Set CORS_ORIGINS in Railway environment variables"
    Write-Host ""
    Write-Host "See docs/ENV_VARIABLES.md for detailed configuration guide."
    exit 1
}

