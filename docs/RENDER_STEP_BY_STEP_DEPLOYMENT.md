# 🚀 Complete Render Deployment Guide - Step by Step

## Complete Step-by-Step Instructions for Deploying Both Frontend and Backend

This guide walks you through deploying **both services** to Render from scratch.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] GitHub account
- [ ] Code pushed to GitHub (repository: `Saiteja02806/classroom`)
- [ ] Render account (free at https://render.com)
- [ ] Supabase account and project
- [ ] Supabase storage bucket created: `audio-uploads`
- [ ] All environment variables ready

---

## 🎯 Overview: Two Separate Services

You'll create **2 separate services** on Render:

1. **Backend Service** (Python FastAPI) - Processes audio
2. **Frontend Service** (React Static Site) - User interface

---

# PART 1: Backend Deployment (Python FastAPI)

## Step 1: Log in to Render

1. Go to **https://dashboard.render.com**
2. Sign in (or create account with GitHub)
3. You'll see the Render dashboard

---

## Step 2: Create Backend Service

1. Click the **"New +"** button (top right corner)
2. Select **"Web Service"** from the dropdown

   *You'll see a form to configure your service*

---

## Step 3: Connect GitHub Repository

1. In the **"Connect Repository"** section:
   - If not connected, click **"Connect GitHub"** or **"Connect GitLab"**
   - Authorize Render to access your repositories

2. **Select Repository:**
   - Repository dropdown → Select: `Saiteja02806/classroom`
   - Branch: `main` (should auto-select)

3. **Auto-Deploy:** 
   - Keep **"Auto-Deploy"** enabled (green toggle)
   - This redeploys when you push to GitHub

---

## Step 4: Configure Basic Settings

Fill in the basic service information:

### **Name:**
```
classroom-backend
```
*(Or any name you prefer - this will be part of your URL)*

### **Region:**
- Select the **closest region** to your users
- Options: Oregon (US West), Frankfurt (EU), Singapore (Asia), etc.

### **Branch:**
```
main
```
*(Should already be selected)*

### **Root Directory:**
**⚠️ IMPORTANT:** Scroll down and find **"Root Directory"** field

Type:
```
backend
```

**This tells Render your Python app is in the `backend/` folder!**

---

## Step 5: Set Environment

1. Find **"Environment"** dropdown
2. Select: **"Python 3"**

---

## Step 6: Configure Build Command

1. Scroll to **"Build Command"** section
2. You'll see a text field

**Clear any existing text** and paste this EXACT command:

```bash
apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
```

**Why this command?**
- `apt-get update` - Updates package list
- `apt-get install -y ffmpeg` - Installs FFmpeg (required for audio processing)
- `pip install -r requirements.txt` - Installs Python dependencies

**⚠️ Copy the ENTIRE line above - it's all one command!**

---

## Step 7: Configure Start Command

1. Find **"Start Command"** section
2. Clear any existing text
3. Paste this command:

```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

**What this does:**
- Starts the FastAPI server
- Listens on all interfaces (`0.0.0.0`)
- Uses Render's assigned port (`$PORT`)

---

## Step 8: Add Environment Variables

**This is CRITICAL - your app won't work without these!**

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Environment Variable"** button
3. Add each variable one by one:

### Variable 1: SUPABASE_URL
- **Key:** `SUPABASE_URL`
- **Value:** `https://dyphuthrtmgvaeoferbm.supabase.co`
- Click **"Save"**

### Variable 2: SUPABASE_SERVICE_ROLE_KEY
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `[Get this from Supabase Dashboard → Settings → API → service_role key]`
- **⚠️ This is SECRET - don't share it!**
- Click **"Save"**

### Variable 3: SUPABASE_ANON_KEY
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cGh1dGhydG1ndmFlb2ZlcmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzUxODcsImV4cCI6MjA3NzY1MTE4N30.nyJEhIcGcJiGvACogsZmdzMM3_c1LKqiVMsbTuFa22I`
- Click **"Save"**

### Variable 4: WHISPER_MODEL
- **Key:** `WHISPER_MODEL`
- **Value:** `tiny`
- *(Start with `tiny` - faster, less memory. Can upgrade to `small` later)*
- Click **"Save"**

### Variable 5: SUMMARIZER_MODEL
- **Key:** `SUMMARIZER_MODEL`
- **Value:** `ai4bharat/IndicBARTSS`
- Click **"Save"**

### Variable 6: BUCKET_NAME
- **Key:** `BUCKET_NAME`
- **Value:** `audio-uploads`
- Click **"Save"**

### Variable 7: PORT (Optional)
- **Key:** `PORT`
- **Value:** `8000`
- *(Render sets this automatically, but good to have)*
- Click **"Save"**

---

## Step 9: Choose Plan

1. Scroll to **"Plan"** section
2. Select: **"Free"** (or upgrade if needed)

**Free Plan Notes:**
- Limited resources
- May have memory issues with large models
- Good for testing
- Consider upgrading for production

---

## Step 10: Review and Create

1. **Review all settings:**
   - ✅ Name: `classroom-backend`
   - ✅ Environment: Python 3
   - ✅ Root Directory: `backend`
   - ✅ Build Command: Includes FFmpeg
   - ✅ Start Command: `uvicorn app:app...`
   - ✅ All environment variables added

2. **Click "Create Web Service"** button (bottom)

---

## Step 11: Wait for Backend Deployment

**First deployment takes 15-20 minutes!**

1. You'll see deployment progress
2. Click on **"Logs"** tab to watch progress
3. Look for:
   - ✅ "Installing FFmpeg"
   - ✅ "Installing dependencies"
   - ✅ "Loading Whisper model..."
   - ✅ "✅ Whisper model loaded successfully"
   - ✅ "✅ Summarizer model loaded successfully"

**⚠️ Be Patient!** First deployment downloads AI models (~2GB)

---

## Step 12: Get Backend URL

After successful deployment:

1. You'll see a **green "Live"** status
2. Find your service URL at the top:
   ```
   https://classroom-backend-xxxx.onrender.com
   ```
3. **Copy this URL** - you'll need it for frontend!

---

## Step 13: Test Backend

1. **Click the URL** or visit it in browser
2. You should see:
   ```json
   {
     "status": "ok",
     "service": "AI Telugu Summarization",
     ...
   }
   ```

**✅ Backend is live!** Now let's deploy the frontend.

---

# PART 2: Frontend Deployment (React Static Site)

## Step 14: Create Frontend Service

1. In Render Dashboard, click **"New +"** again
2. This time, select **"Static Site"**

   *Static Site is for frontend apps (React, Vue, etc.)*

---

## Step 15: Connect Repository (Again)

1. **Repository:** Select `Saiteja02806/classroom` (same repo)
2. **Branch:** `main`
3. **Auto-Deploy:** Enabled ✅

---

## Step 16: Configure Frontend Settings

### **Name:**
```
classroom-frontend
```

### **Region:**
Choose same region as backend (or closest)

---

## Step 17: Frontend Root Directory

**Root Directory:** 
```
. 
```
*(Leave empty or put `.` - this means project root)*

**For Static Site, root is the project root where `package.json` is located.**

---

## Step 18: Frontend Build Command

1. Find **"Build Command"** section
2. Paste:
```bash
npm install && npm run build
```

**What this does:**
- `npm install` - Installs dependencies
- `npm run build` - Builds React app for production

---

## Step 19: Frontend Publish Directory

1. Find **"Publish Directory"** field
2. Enter:
```
dist
```

**This is where Vite builds your React app.**

---

## Step 20: Frontend Environment Variables

Add these environment variables:

**⚠️ IMPORTANT:** Frontend variables MUST start with `VITE_`!

### Variable 1: VITE_SUPABASE_URL
- **Key:** `VITE_SUPABASE_URL`
- **Value:** `https://dyphuthrtmgvaeoferbm.supabase.co`
- Click **"Save"**

### Variable 2: VITE_SUPABASE_KEY
- **Key:** `VITE_SUPABASE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cGh1dGhydG1ndmFlb2ZlcmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzUxODcsImV4cCI6MjA3NzY1MTE4N30.nyJEhIcGcJiGvACogsZmdzMM3_c1LKqiVMsbTuFa22I`
- Click **"Save"**

### Variable 3: VITE_BACKEND_URL
- **Key:** `VITE_BACKEND_URL`
- **Value:** `https://classroom-backend-xxxx.onrender.com`
  *(Use the backend URL from Step 12!)*
- Click **"Save"**

---

## Step 21: Create Frontend Service

1. **Review settings:**
   - ✅ Name: `classroom-frontend`
   - ✅ Root Directory: `.` (project root)
   - ✅ Build Command: `npm install && npm run build`
   - ✅ Publish Directory: `dist`
   - ✅ All environment variables added (with `VITE_` prefix)
   - ✅ Backend URL is correct

2. **Click "Create Static Site"**

---

## Step 22: Wait for Frontend Deployment

Frontend deployment is faster:
- Usually takes **2-5 minutes**
- Watch the **"Logs"** tab
- Look for: ✅ "Build successful"

---

## Step 23: Get Frontend URL

After deployment:

1. You'll see **green "Live"** status
2. Frontend URL:
   ```
   https://classroom-frontend.onrender.com
   ```
3. **This is your app URL!** Share this with users.

---

## Step 24: Test Frontend

1. **Visit the frontend URL** in your browser
2. You should see:
   - ✅ Login/Signup page
   - ✅ No console errors
   - ✅ Can sign up and login

---

# PART 3: Final Steps & Testing

## Step 25: Test Complete Flow

1. **Go to frontend URL**
2. **Sign up** a new account
3. **Login** with credentials
4. **Record or upload audio**
5. **Verify:**
   - ✅ Audio uploads successfully
   - ✅ Processing starts
   - ✅ Transcript appears
   - ✅ Summary appears

---

## Step 26: Monitor Services

### Check Both Services:

1. **Backend Health:**
   - Visit: `https://classroom-backend-xxxx.onrender.com/`
   - Should return JSON with status

2. **Frontend:**
   - Visit: `https://classroom-frontend.onrender.com`
   - Should load the app

### Check Logs:

- **Backend Logs:** Service → Logs tab
- **Frontend Logs:** Service → Logs tab
- Look for errors or warnings

---

## Step 27: Update CORS (If Needed)

If frontend can't connect to backend:

1. Go to **Backend service** → **Settings**
2. Find CORS configuration (might be in code)
3. Update `backend/app.py` line 25:
   ```python
   allow_origins=[
       "https://classroom-frontend.onrender.com",
       "http://localhost:3000"  # For local dev
   ]
   ```
4. Push changes to GitHub
5. Render will auto-redeploy

---

## 📊 Summary: What You Created

### Service 1: Backend
- **Type:** Web Service
- **URL:** `https://classroom-backend-xxxx.onrender.com`
- **Root:** `backend`
- **Build:** FFmpeg + pip install
- **Start:** uvicorn

### Service 2: Frontend
- **Type:** Static Site
- **URL:** `https://classroom-frontend.onrender.com`
- **Root:** `.` (project root)
- **Build:** npm install && npm run build
- **Publish:** `dist` folder

---

## ✅ Deployment Checklist

After deployment, verify:

### Backend:
- [ ] Service shows "Live" status
- [ ] Health check works: `GET /`
- [ ] Models loaded (check logs)
- [ ] Environment variables set
- [ ] Can process audio: `POST /process`

### Frontend:
- [ ] Service shows "Live" status
- [ ] App loads without errors
- [ ] Environment variables set (VITE_*)
- [ ] Can connect to backend
- [ ] Authentication works
- [ ] Audio upload works

---

## 🐛 Troubleshooting

### Backend Issues:

**"ffmpeg not found"**
- ✅ Build command must include: `apt-get install -y ffmpeg`

**"Missing environment variables"**
- ✅ Add all required env vars in Render dashboard

**"Model loading failed"**
- ✅ Check logs for specific error
- ✅ Use `WHISPER_MODEL=tiny` for faster builds
- ✅ Verify sufficient disk space

### Frontend Issues:

**"Environment variables not working"**
- ✅ Must start with `VITE_` prefix
- ✅ Rebuild after changing variables

**"Can't connect to backend"**
- ✅ Check `VITE_BACKEND_URL` is correct
- ✅ Verify backend is running
- ✅ Check CORS configuration

---

## 🔄 Updating Your App

When you make changes:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Render Auto-Deploys:**
   - Both services detect changes
   - Automatically start new deployments
   - Monitor in Render dashboard

---

## 📝 Quick Reference

### Backend Settings:
```
Type: Web Service
Environment: Python 3
Root Directory: backend
Build Command: apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Frontend Settings:
```
Type: Static Site
Root Directory: . (or leave blank)
Build Command: npm install && npm run build
Publish Directory: dist
```

---

## 🎉 Congratulations!

You've successfully deployed both frontend and backend to Render!

- ✅ Backend: Processing audio with AI
- ✅ Frontend: User interface live
- ✅ Both services: Connected and working

**Your app is now live and accessible to users!** 🚀

---

## 📞 Need Help?

- Check logs in Render dashboard
- Review error guides in `docs/` folder
- Visit: https://render.com/docs
- Check service status in Render dashboard

---

**Your complete deployment is done! Enjoy your live app!** 🎊

