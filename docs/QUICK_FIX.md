# ⚡ QUICK FIX - Frontend Can't Connect to Backend

**Symptom:** Your Vercel frontend can't reach your Railway backend (CORS errors, "Failed to fetch", etc.)

---

## 🔥 5-Minute Fix

### Step 1: Set Railway Environment Variable

1. Go to https://railway.app → Your Project → Variables
2. Add this variable:

```
CORS_ORIGINS=https://your-app.vercel.app
```

**Replace `your-app.vercel.app` with your ACTUAL Vercel domain!**

Find it at: Vercel Dashboard → Your Project → Domains

3. Click **Redeploy**

---

### Step 2: Set Vercel Environment Variable

1. Go to https://vercel.com → Your Project → Settings → Environment Variables
2. Add this variable:

```
VITE_API_URL=https://your-backend.railway.app
```

**Replace `your-backend.railway.app` with your ACTUAL Railway domain!**

Find it at: Railway Dashboard → Your Service → Settings → Public URL

3. Go to Deployments → Click "..." → **Redeploy**

---

### Step 3: Verify

**Test in browser console** (F12) on your Vercel app:

```javascript
fetch('https://your-backend.railway.app/v1/debug/cors')
  .then(r => r.json())
  .then(console.log)
```

**Expected:** Should return your CORS configuration without errors

**If it works:** ✅ Done! Your app should now work.

**If it fails:** Continue to detailed guide below ⬇️

---

## 🔍 Still Not Working?

### Check Railway Logs

1. Railway Dashboard → Your Service → Deployments → Logs
2. Look for this line:

```
🔒 CORS enabled for origins: ['https://your-app.vercel.app']
```

**Not there?** 
- Make sure you set `CORS_ORIGINS` variable
- Make sure you redeployed after setting it
- Make sure there are no typos

---

### Check Browser Console

1. Open your Vercel app
2. Press F12 → Console tab
3. Look for:

```
🔗 API Base URL: https://your-backend.railway.app
```

**Says something else?**
- `VITE_API_URL` not set correctly on Vercel
- Need to redeploy Vercel after changing env vars

**Says `/v1`?**
- `VITE_API_URL` is not set at all
- Set it on Vercel and redeploy

---

### Check Network Tab

1. Open your Vercel app
2. Press F12 → Network tab
3. Try to use the app (chat or load stock data)
4. Click on the failed request → Headers

**Look for:**
- Request URL: Should be your Railway domain
- Status: 200 = working, 0 = CORS issue
- Response Headers: Should include `access-control-allow-origin`

**Common Issues:**

| Status | Issue | Fix |
|--------|-------|-----|
| 0 | CORS not configured | Set `CORS_ORIGINS` on Railway |
| 404 | Wrong URL | Check `VITE_API_URL` on Vercel |
| 500 | Backend error | Check Railway logs |
| Mixed Content | HTTP/HTTPS mismatch | Use `https://` for both |

---

## ✅ Checklist

Before asking for help, verify:

- [ ] Both services are deployed and running
- [ ] `CORS_ORIGINS` set on Railway to your Vercel domain
- [ ] `VITE_API_URL` set on Vercel to your Railway domain
- [ ] Both URLs use `https://` (not `http://`)
- [ ] No trailing slashes in URLs
- [ ] Both services redeployed after changing env vars
- [ ] Railway logs show correct CORS origins
- [ ] Browser console shows correct API URL
- [ ] Cleared browser cache and did hard refresh (Ctrl+Shift+R)

---

## 🧪 Quick Test Tool

1. Open `test-cors.html` in your browser
2. Enter your Railway backend URL
3. Click "Run All Tests"
4. All tests should pass ✅

---

## 📚 Detailed Guides

Need more help? Check these guides:

1. **[Fix CORS Issues](docs/FIX_CORS_ISSUES.md)** - Complete troubleshooting guide
2. **[CORS Fixes Applied](CORS_FIXES_APPLIED.md)** - What was changed and why
3. **[Deployment Guide](docs/DEPLOY_NOW.md)** - Full deployment walkthrough
4. **[Environment Variables](docs/ENV_VARIABLES.md)** - All env var options

---

## 💡 Common Mistakes

### ❌ Wrong Domain Format

**Wrong:**
```bash
CORS_ORIGINS=your-app.vercel.app           # Missing https://
CORS_ORIGINS=https://your-app.vercel.app/  # Trailing slash
```

**Right:**
```bash
CORS_ORIGINS=https://your-app.vercel.app
```

---

### ❌ Including /v1 in API URL

**Wrong:**
```bash
VITE_API_URL=https://your-backend.railway.app/v1
```

**Right:**
```bash
VITE_API_URL=https://your-backend.railway.app
```

The `/v1` is added automatically by the frontend code.

---

### ❌ Not Redeploying After Env Var Changes

**Important:** Environment variables are only applied during build/deployment!

- Changed Railway vars? → Redeploy Railway
- Changed Vercel vars? → Redeploy Vercel

---

### ❌ Multiple Domains Not Comma-Separated

**Wrong:**
```bash
CORS_ORIGINS=https://app1.vercel.app https://app2.vercel.app
```

**Right:**
```bash
CORS_ORIGINS=https://app1.vercel.app,https://app2.vercel.app
```

---

## 🎯 Expected Result

When everything is working:

1. ✅ Railway logs show: `🔒 CORS enabled for origins: ['https://your-app.vercel.app']`
2. ✅ Browser console shows: `🔗 API Base URL: https://your-backend.railway.app`
3. ✅ Network tab shows successful requests (status 200)
4. ✅ Chat works without errors
5. ✅ Stock data loads correctly
6. ✅ No CORS errors in console

---

## 🆘 Last Resort

If you've tried everything:

1. Delete and redeploy both services from scratch
2. Double-check you're not using a preview URL that changed
3. Try accessing from incognito/private browser window
4. Check Railway and Vercel status pages for outages
5. Create a minimal test - just try the health endpoint first

**Test command:**
```bash
# Should return 200 OK with CORS headers
curl -i -H "Origin: https://your-app.vercel.app" \
  https://your-backend.railway.app/v1/health
```

---

**Time to fix:** 5-10 minutes if you follow these steps exactly  
**Success rate:** 99% of issues are fixed by setting env vars correctly  

Good luck! 🚀

