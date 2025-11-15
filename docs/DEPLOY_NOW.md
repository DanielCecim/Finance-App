# Deploy Your Finance App Now! 🚀

**Deployment Method:** Railway (Backend) + Vercel (Frontend)  
**Estimated Time:** 30 minutes  
**Cost:** Free tier available ($0-10/month with OpenAI usage)

---

## ✅ Prerequisites Checklist

Before starting, make sure you have:

- [ ] OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- [ ] GitHub account (for connecting repositories)
- [ ] Git installed on your computer
- [ ] Your code pushed to GitHub

---

## 🎯 Deployment Overview

We'll deploy in this order:
1. **Backend → Railway** (gets you an API URL)
2. **Frontend → Vercel** (gets you a website URL)
3. **Connect them** (update environment variables)

---

## 📝 Step-by-Step Instructions

### Part 1: Deploy Backend to Railway (15 minutes)

#### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Login"**
3. Sign in with GitHub
4. Authorize Railway to access your repositories

#### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your Finance App repository
4. Railway will start deploying automatically

#### Step 3: Configure Backend Settings

1. Click on your deployed service
2. Go to **"Settings"** tab
3. Scroll to **"Root Directory"**
4. Set it to: `FinanceApp/backend`
5. Click **"Save"**

#### Step 4: Set Environment Variables

1. Go to **"Variables"** tab
2. Click **"New Variable"**
3. Add these variables one by one:

```
OPENAI_API_KEY = your_openai_api_key_here
CORS_ORIGINS = http://localhost:3000
ENVIRONMENT = production
LOG_LEVEL = INFO
```

**Important:** Replace `your_openai_api_key_here` with your actual OpenAI API key!

#### Step 5: Get Your Backend URL

1. Go to **"Settings"** tab
2. Find the **"Domains"** section
3. Copy your Railway URL (looks like: `https://your-app.up.railway.app`)
4. **Save this URL** - you'll need it for the frontend!

✅ **Backend is now deployed!** Test it by visiting: `https://your-app.up.railway.app/v1/health`

You should see:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "..."
}
```

---

### Part 2: Deploy Frontend to Vercel (10 minutes)

#### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign in with GitHub
4. Authorize Vercel

#### Step 2: Create New Project

1. Click **"Add New"** → **"Project"**
2. Import your Finance App repository
3. Click **"Import"**

#### Step 3: Configure Build Settings

Vercel should auto-detect Vite. Verify these settings:

- **Framework Preset:** Vite
- **Root Directory:** `FinanceApp`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

#### Step 4: Set Environment Variable

1. Expand **"Environment Variables"**
2. Add this variable:

```
Name: VITE_API_URL
Value: https://your-app.up.railway.app
```

**Important:** Use your Railway URL from Part 1, Step 5!

3. Click **"Deploy"**

#### Step 5: Wait for Deployment

Vercel will:
- Install dependencies
- Build your app
- Deploy it

This takes 2-3 minutes. ☕

#### Step 6: Get Your Frontend URL

Once deployed:
1. Copy your Vercel URL (shown on the screen)
2. **Save this URL** - you'll need it next!

---

### Part 3: Connect Backend & Frontend (5 minutes)

Now we need to update the backend to allow requests from your frontend.

#### Step 1: Update Railway CORS

1. Go back to **Railway dashboard**
2. Click on your backend service
3. Go to **"Variables"** tab
4. Find `CORS_ORIGINS`
5. Update it to your Vercel URL:

```
CORS_ORIGINS = https://your-app.vercel.app
```

**Important:** Use your actual Vercel URL (no trailing slash)!

6. Save (Railway will automatically redeploy)

#### Step 2: Test Your App

1. Open your Vercel URL in a browser
2. You should see the landing page: **"STOCK ANALYZER"**
3. Enter a stock symbol (e.g., `AAPL`)
4. Click **"Get Started"**
5. Try the AI chat: *"What's the current price of Apple?"*

---

## 🎉 Congratulations!

Your Finance App is now **LIVE** and accessible to anyone on the internet! 🌍

### Your URLs:
- **Frontend (Share this!):** `https://your-app.vercel.app`
- **Backend API:** `https://your-app.up.railway.app`

---

## 🔧 Common Issues & Solutions

### Issue: "ERR_CONNECTION_REFUSED" in browser

**Solution:** 
- Check that `VITE_API_URL` in Vercel matches your Railway URL
- Make sure Railway backend is running (check Railway dashboard)

### Issue: CORS errors in browser console

**Solution:**
- Check that `CORS_ORIGINS` in Railway matches your Vercel URL exactly
- Must include `https://` (no trailing slash)
- Example: `https://your-app.vercel.app`

### Issue: AI chat not responding

**Solution:**
- Verify your OpenAI API key is correct in Railway
- Check you have credits in your OpenAI account
- Look at Railway logs for errors

### Issue: "Backend health check failed"

**Solution:**
- Check Railway logs (click service → Deployments → View logs)
- Verify all environment variables are set
- Make sure `OPENAI_API_KEY` is valid

---

## 📊 Monitoring Your App

### Check Backend Status
- Railway Dashboard: See logs, metrics, deployment status
- Health endpoint: `https://your-app.up.railway.app/v1/health`

### Check Frontend Status
- Vercel Dashboard: See analytics, build logs
- Your Vercel URL should load the app

### Monitor Costs

**Railway:**
- Free tier: 500 hours/month
- Check usage in dashboard

**Vercel:**
- Free tier: 100GB bandwidth/month
- Check usage in dashboard

**OpenAI:**
- Set usage limits in [OpenAI dashboard](https://platform.openai.com/usage)
- Recommended: Set monthly limit of $10-20

---

## 🔐 Security Best Practices

✅ **Done automatically:**
- HTTPS enabled on both Railway and Vercel
- CORS configured for your specific domain
- API keys stored securely in environment variables

⚠️ **Recommended next steps:**
- Set spending limits on OpenAI
- Enable billing alerts on Railway and Vercel
- Monitor usage regularly

---

## 🚀 Next Steps

### Want a custom domain?

**For Frontend (Vercel):**
1. Buy a domain (Namecheap, Google Domains, etc.)
2. Go to Vercel → Your Project → Settings → Domains
3. Add your domain and follow DNS instructions

**For Backend (Railway):**
1. Go to Railway → Your Service → Settings → Domains
2. Add custom domain (e.g., api.yourdomain.com)
3. Update CORS and frontend API URL

### Want to update your app?

**Method 1: Push to GitHub (Automatic)**
```bash
git add .
git commit -m "Update app"
git push origin main
```
Both Railway and Vercel will auto-deploy!

**Method 2: Manual Redeploy**
- Railway: Click "Deploy" in dashboard
- Vercel: Click "Redeploy" in dashboard

---

## 📞 Need Help?

### Check Logs

**Railway logs:**
1. Go to Railway dashboard
2. Click your service
3. Click "Deployments"
4. Click latest deployment
5. View logs for errors

**Vercel logs:**
1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. View function logs

### Useful Commands

Test backend health:
```bash
curl https://your-app.up.railway.app/v1/health
```

### Resources
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Environment Variables Guide](./ENV_VARIABLES.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

---

## 💰 Cost Breakdown

### Free Tier (First Month)
- Railway: $0 (500 hrs free)
- Vercel: $0 (100GB bandwidth)
- OpenAI: ~$5-10 (usage-based)
- **Total: ~$5-10/month**

### If You Exceed Free Tier
- Railway: $5-10/month
- Vercel: $0 or $20/month (Pro)
- OpenAI: $10-20/month
- **Total: ~$15-50/month**

---

## ✅ Deployment Checklist

Use this to verify everything is working:

- [ ] Backend deployed to Railway
- [ ] Backend health check returns 200 OK
- [ ] Frontend deployed to Vercel
- [ ] Frontend loads in browser
- [ ] Landing page appears
- [ ] Can enter stock symbol and navigate
- [ ] Dashboard loads stock data
- [ ] AI chat responds to questions
- [ ] No CORS errors in browser console
- [ ] No errors in Railway logs
- [ ] OpenAI usage is showing in dashboard
- [ ] Both URLs bookmarked/saved

---

## 🎊 You Did It!

Your Finance App is now live and anyone can use it!

**Share your app:** Just give people your Vercel URL!

**Example:** "Check out my stock analysis app: https://your-app.vercel.app"

---

**Questions?** Check the [Troubleshooting section](#-common-issues--solutions) above or review the [Environment Variables Guide](./ENV_VARIABLES.md).

**Happy deploying!** 🚀✨

