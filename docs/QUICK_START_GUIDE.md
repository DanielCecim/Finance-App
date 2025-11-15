# Quick Start Guide

Get your Finance App running in minutes!

---

## For Local Development (5 minutes)

### Prerequisites
- ✅ Node.js 18+ installed
- ✅ Python 3.10+ installed
- ✅ OpenAI API key

### Steps

1. **Clone and navigate to the project:**
```bash
cd FinanceApp
```

2. **Install dependencies:**
```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
cd ..
```

3. **Create environment files:**

**Backend** (`backend/.env`):
```env
OPENAI_API_KEY=your_openai_api_key_here
CORS_ORIGINS=http://localhost:3000
ENVIRONMENT=development
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:8000
```

4. **Start the servers:**

**Terminal 1 - Backend:**
```bash
cd FinanceApp
npm run backend
```

**Terminal 2 - Frontend:**
```bash
cd FinanceApp
npm run dev
```

5. **Open your browser:**
```
http://localhost:3000
```

✅ Done! You should see the landing page.

---

## For Production Deployment (30 minutes)

Choose one of these options:

### Option A: Railway + Vercel (Recommended - Easiest)

**1. Deploy Backend to Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli
railway login

# Deploy
cd FinanceApp/backend
railway init
railway up

# Set environment variables in Railway dashboard:
# - OPENAI_API_KEY
# - CORS_ORIGINS (your frontend URL)
```

**2. Deploy Frontend to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd FinanceApp
vercel --prod

# Set environment variable:
# VITE_API_URL = your Railway backend URL
```

**3. Update CORS:**
- Go back to Railway
- Update `CORS_ORIGINS` with your Vercel URL
- Redeploy

✅ Done! Your app is live!

---

### Option B: Docker (For Full Control)

**1. Install Docker:**
- Download from docker.com

**2. Create .env file:**
```env
OPENAI_API_KEY=your_key
CORS_ORIGINS=http://localhost:3000
VITE_API_URL=http://localhost:8000
```

**3. Run with Docker Compose:**
```bash
docker-compose up -d
```

**4. Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

✅ Done! Containers are running.

---

### Option C: Traditional VPS (Advanced)

**1. Get a VPS:**
- DigitalOcean Droplet ($5/month)
- Linode
- AWS EC2

**2. SSH into server:**
```bash
ssh root@your-server-ip
```

**3. Install dependencies:**
```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Python
apt-get install -y python3 python3-pip

# Nginx
apt-get install -y nginx
```

**4. Clone and setup:**
```bash
git clone <your-repo>
cd FinanceApp

# Backend
cd backend
pip3 install -r requirements.txt
# Create .env file

# Frontend
cd ..
npm install
npm run build
```

**5. Configure Nginx:**
```nginx
# /etc/nginx/sites-available/finance-app
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /path/to/FinanceApp/dist;
        try_files $uri /index.html;
    }
    
    location /v1 {
        proxy_pass http://localhost:8000;
    }
}
```

**6. Start services:**
```bash
# Backend (with PM2)
npm install -g pm2
pm2 start "uvicorn api:app --host 0.0.0.0 --port 8000" --name backend

# Enable Nginx
systemctl enable nginx
systemctl start nginx
```

✅ Done! Your app is hosted on your VPS.

---

## Troubleshooting

### Backend won't start
```bash
# Check Python version
python3 --version  # Should be 3.10+

# Check if port is in use
lsof -i:8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Check environment variables
cat backend/.env
```

### Frontend won't start
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if port is in use
lsof -i:3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows
```

### CORS errors in browser
```bash
# Make sure CORS_ORIGINS in backend matches your frontend URL
# Include the protocol (http:// or https://)
```

### OpenAI API errors
```bash
# Verify your API key is valid
# Check you have credits in your OpenAI account
# Make sure the key starts with "sk-"
```

---

## Next Steps

- 📖 Read the [Full Deployment Plan](./DEPLOYMENT_PLAN.md)
- 🐳 Try [Docker Deployment](./DOCKER_DEPLOYMENT.md)
- 🔐 Review [Environment Variables](./ENV_VARIABLES.md)
- 🛡️ Implement security best practices
- 📊 Set up monitoring and analytics

---

## Need Help?

- Check the [Troubleshooting section](./DEPLOYMENT_PLAN.md#troubleshooting)
- Review error logs
- Check environment variables
- Ensure all dependencies are installed

---

## Estimated Costs

| Deployment | Monthly Cost |
|------------|--------------|
| Local Dev | $0 |
| Railway + Vercel (Free tier) | ~$5-10 |
| Docker on VPS | ~$5-20 |
| Production (Medium traffic) | ~$45-50 |

---

**Remember:** Start with the free tier to test, then scale up based on usage!

