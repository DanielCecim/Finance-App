# Finance App - Deployment Documentation

**Deployment Method:** Railway (Backend) + Vercel (Frontend)

---

## 🚀 Ready to Deploy?

### **→ [Start Here: DEPLOY NOW Guide](./DEPLOY_NOW.md)** ⭐

This is your main guide! It includes:
- ✅ Step-by-step instructions with screenshots descriptions
- ✅ All commands you need
- ✅ Environment variable setup
- ✅ Troubleshooting common issues
- ✅ Cost breakdown
- ✅ Testing checklist

**Time:** 30 minutes  
**Cost:** Free tier available ($0-10/month)

---

## 📚 Additional Documentation

### For Deploying

1. **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** ⭐ **START HERE**
   - Complete deployment walkthrough
   - Railway + Vercel setup
   - Troubleshooting guide

2. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**
   - Verify everything before going live
   - Post-deployment tasks

### For Configuration

3. **[ENV_VARIABLES.md](./ENV_VARIABLES.md)**
   - All environment variables explained
   - Security best practices
   - Platform-specific configuration

### For Reference

4. **[DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)**
   - Overview of deployment
   - Cost analysis
   - Quick commands reference

---

## 🎯 Deployment Path

```
1. Read DEPLOY_NOW.md
   ↓
2. Deploy Backend to Railway (15 min)
   ↓
3. Deploy Frontend to Vercel (10 min)
   ↓
4. Connect them (5 min)
   ↓
5. Test & Verify
   ↓
6. ✅ Your app is LIVE!
```

---

## ⚡ Quick Start Commands

### Local Development
```bash
# Backend
cd FinanceApp
npm run backend

# Frontend (new terminal)
cd FinanceApp
npm run dev
```

### Deploy to Railway + Vercel
Follow the [DEPLOY_NOW.md](./DEPLOY_NOW.md) guide - it's all there!

---

## 💡 What You Need

Before starting:
- [ ] OpenAI API key ([Get one](https://platform.openai.com/api-keys))
- [ ] GitHub account
- [ ] Your code pushed to GitHub
- [ ] 30 minutes of time

---

## 💰 Cost Estimate

| Service | Free Tier | Typical Cost |
|---------|-----------|--------------|
| Railway | 500 hrs/month | $0-10/month |
| Vercel | 100GB bandwidth | $0/month |
| OpenAI | Pay per use | $5-20/month |
| **Total** | **Available** | **$5-30/month** |

---

## 🆘 Need Help?

### Common Issues

**"ERR_CONNECTION_REFUSED"**
→ Check backend URL in Vercel environment variables

**CORS Errors**
→ Update Railway CORS_ORIGINS with your Vercel URL

**AI not responding**
→ Verify OpenAI API key in Railway

### Full Troubleshooting
See the [DEPLOY_NOW.md - Common Issues](./DEPLOY_NOW.md#-common-issues--solutions) section

---

## 📖 Document Overview

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [DEPLOY_NOW.md](./DEPLOY_NOW.md) | Step-by-step deployment | 5 min + 30 min doing |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Verification checklist | 10 min |
| [ENV_VARIABLES.md](./ENV_VARIABLES.md) | Configuration reference | 15 min |
| [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) | Overview & costs | 5 min |

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ You can visit your Vercel URL
- ✅ Landing page loads
- ✅ Stock search works
- ✅ AI chat responds
- ✅ No errors in browser console

---

## 🎉 Let's Deploy!

**Start here:** [DEPLOY_NOW.md](./DEPLOY_NOW.md)

Good luck! 🚀
