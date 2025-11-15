# 🔧 Fix CORS & Connection Issues

This guide helps you fix the common CORS and connection issues between your Vercel frontend and Railway backend.

## ✅ Issues Fixed

The codebase has been updated to support:
1. ✅ Dynamic CORS origins via environment variable
2. ✅ Explicit preflight (OPTIONS) handling
3. ✅ Better error messages for debugging
4. ✅ Debug endpoint to test CORS
5. ✅ HTTPS support for production

---

## 🚀 Quick Fix Steps

### Step 1: Update Railway Environment Variables

1. Go to your Railway project: https://railway.app
2. Click on your backend service
3. Go to **"Variables"** tab
4. Add or update these variables:

```bash
CORS_ORIGINS=https://your-app.vercel.app
```

**IMPORTANT**: Replace `your-app.vercel.app` with your **actual** Vercel domain.

**Multiple domains?** Separate with commas:
```bash
CORS_ORIGINS=https://your-app.vercel.app,https://www.your-app.com,https://preview-123.vercel.app
```

4. Click **"Redeploy"** to apply changes

---

### Step 2: Update Vercel Environment Variables

1. Go to your Vercel project: https://vercel.com
2. Go to **Settings → Environment Variables**
3. Add or update:

```bash
VITE_API_URL=https://your-backend.railway.app
```

**IMPORTANT**: 
- Use your **actual** Railway backend URL
- Must start with `https://`
- Do NOT include `/v1` at the end
- Example: `https://finance-app-production.up.railway.app`

4. **Redeploy** your Vercel app (trigger new deployment)

---

### Step 3: Test the Connection

#### A. Test Backend CORS Configuration

Open your browser console and run:

```javascript
// Replace with your Railway URL
fetch('https://your-backend.railway.app/v1/debug/cors')
  .then(r => r.json())
  .then(data => console.log('✅ CORS Config:', data))
  .catch(err => console.error('❌ Error:', err))
```

**Expected output:**
```json
{
  "cors_origins": ["https://your-app.vercel.app"],
  "environment": "production",
  "message": "If you can see this from your frontend, CORS is working!"
}
```

#### B. Test Health Endpoint

```javascript
fetch('https://your-backend.railway.app/v1/health')
  .then(r => r.json())
  .then(data => console.log('✅ Health:', data))
  .catch(err => console.error('❌ Error:', err))
```

#### C. Test from Your Vercel App

1. Open your Vercel app in browser: `https://your-app.vercel.app`
2. Open **Developer Tools** (F12)
3. Go to **Console** tab
4. You should see:
   ```
   🔗 API Base URL: https://your-backend.railway.app
   ```
5. Try using the chat feature
6. Check **Network** tab for any errors

---

## 🔍 Debugging Checklist

If you still have issues, go through this checklist:

### ✅ Backend (Railway)

- [ ] `CORS_ORIGINS` is set to your Vercel domain(s)
- [ ] Vercel domain includes `https://` protocol
- [ ] No trailing slashes in CORS_ORIGINS
- [ ] Backend is deployed and running (check Railway logs)
- [ ] Backend responds to health check: `GET /v1/health`

**Check Railway logs:**
```bash
# You should see this line in logs:
🔒 CORS enabled for origins: ['https://your-app.vercel.app']
```

### ✅ Frontend (Vercel)

- [ ] `VITE_API_URL` is set to Railway backend URL
- [ ] Railway URL includes `https://` protocol
- [ ] Railway URL does NOT end with `/v1`
- [ ] App was redeployed after changing env var
- [ ] Browser console shows correct API Base URL

**Check browser console:**
```
🔗 API Base URL: https://your-backend.railway.app
```

### ✅ Browser/Network

- [ ] No mixed content warnings (HTTP/HTTPS)
- [ ] Both URLs use `https://`
- [ ] Network tab shows OPTIONS request succeeds (preflight)
- [ ] Network tab shows CORS headers in response

---

## 🚨 Common Errors & Solutions

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Cause:** Backend CORS not configured for your frontend domain

**Solution:**
1. Check `CORS_ORIGINS` in Railway includes your exact Vercel URL
2. Redeploy Railway backend
3. Test with curl:
```bash
curl -i -X OPTIONS https://your-backend.railway.app/v1/health \
  -H "Origin: https://your-app.vercel.app" \
  -H "Access-Control-Request-Method: GET"
```

You should see:
```
access-control-allow-origin: https://your-app.vercel.app
```

---

### Error: "Failed to fetch" or "TypeError: Failed to fetch"

**Cause:** Network/connection issue or wrong URL

**Solution:**
1. Verify `VITE_API_URL` is correct in Vercel
2. Test backend directly: `curl https://your-backend.railway.app/v1/health`
3. Check Railway deployment logs for errors
4. Ensure both use HTTPS

---

### Error: "Mixed content" warning

**Cause:** Mixing HTTP and HTTPS

**Solution:**
1. Ensure **both** frontend and backend use `https://`
2. Never use `http://` in production
3. Railway and Vercel both provide HTTPS by default

---

### Error: "Cannot connect to backend"

**Cause:** Wrong `VITE_API_URL` or backend not running

**Solution:**
1. Check browser console for actual URL being used
2. Verify Railway backend is running (check Railway dashboard)
3. Test backend health: `curl https://your-backend.railway.app/v1/health`
4. Redeploy Vercel after changing `VITE_API_URL`

---

## 📋 Example Working Configuration

### Railway Environment Variables

```bash
OPENAI_API_KEY=sk-proj-abc123...
CORS_ORIGINS=https://finance-app.vercel.app,https://finance-app-preview.vercel.app
ENVIRONMENT=production
```

### Vercel Environment Variables

```bash
VITE_API_URL=https://finance-backend-production.up.railway.app
```

### Browser Console (Expected Output)

```
🔗 API Base URL: https://finance-backend-production.up.railway.app
```

### Network Tab (Expected Headers)

**Request Headers:**
```
Origin: https://finance-app.vercel.app
```

**Response Headers:**
```
access-control-allow-origin: https://finance-app.vercel.app
access-control-allow-credentials: true
access-control-allow-methods: *
access-control-allow-headers: *
```

---

## 🧪 Testing Script

Run this in your browser console (on Vercel app):

```javascript
// Test CORS and connection
async function testBackend() {
  console.log('🧪 Testing backend connection...')
  
  const apiBase = import.meta.env.VITE_API_URL || '/v1'
  console.log('API Base:', apiBase)
  
  try {
    // Test CORS config
    const corsTest = await fetch(`${apiBase}/debug/cors`)
    const corsData = await corsTest.json()
    console.log('✅ CORS Config:', corsData)
    
    // Test health
    const healthTest = await fetch(`${apiBase}/health`)
    const healthData = await healthTest.json()
    console.log('✅ Health Check:', healthData)
    
    console.log('✅ All tests passed! Backend is reachable.')
    return true
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Possible issues:')
    console.error('1. CORS_ORIGINS not set correctly on Railway')
    console.error('2. VITE_API_URL not set correctly on Vercel')
    console.error('3. Backend not running')
    console.error('4. Mixed HTTP/HTTPS')
    return false
  }
}

testBackend()
```

---

## 📞 Still Having Issues?

1. **Check Railway Logs**
   - Go to Railway dashboard
   - Click your service
   - Check "Deployments" → "Logs"
   - Look for the CORS configuration line

2. **Check Vercel Logs**
   - Go to Vercel dashboard
   - Click your deployment
   - Check "Functions" logs
   - Look for fetch errors

3. **Browser DevTools**
   - Open Network tab
   - Filter by "Fetch/XHR"
   - Click failed request
   - Check "Headers" tab for CORS headers

4. **Test with curl**
   ```bash
   # Test preflight
   curl -i -X OPTIONS https://your-backend.railway.app/v1/health \
     -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: GET"
   
   # Test actual request
   curl -i https://your-backend.railway.app/v1/health \
     -H "Origin: https://your-app.vercel.app"
   ```

---

## ✅ Deployment Summary

After following all steps, you should have:

✅ Railway backend with `CORS_ORIGINS` set to your Vercel domain(s)
✅ Vercel frontend with `VITE_API_URL` set to your Railway backend
✅ Both using HTTPS
✅ CORS headers visible in browser Network tab
✅ Chat and dashboard features working

**Time to fix:** ~5 minutes after environment variables are set correctly

---

## 🔗 Related Docs

- [Full Deployment Guide](./DEPLOY_NOW.md)
- [Environment Variables Reference](./ENV_VARIABLES.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

