# 🚀 Render Backend Setup - Step-by-Step Guide

## Complete Instructions for Deploying Backend to Render

---

## 📋 Step 1: Create New Web Service

1. **Log in to Render Dashboard**
   - Go to: https://dashboard.render.com
   - Sign in with your GitHub account

2. **Create New Service**
   - Click the **"New +"** button (top right)
   - Select **"Web Service"**

---

## 📋 Step 2: Connect Your Repository

1. **Connect Repository**
   - Click **"Connect GitHub"** or **"Connect GitLab"**
   - Authorize Render to access your repositories
   - Select your repository: `Saiteja02806/classroom`

2. **Configure Repository**
   - Repository: `Saiteja02806/classroom` (should auto-populate)
   - Branch: `main` (or your default branch)

---

## 📋 Step 3: Configure Basic Settings

Fill in the basic information:

### **Name:**
```
classroom-backend
```
*(or any name you prefer)*

### **Environment:**
```
Python 3
```
*(Select from dropdown)*

### **Region:**
Choose the closest region to your users
*(e.g., Oregon (US West), Frankfurt (EU), etc.)*

---

## 📋 Step 4: Set Root Directory

**Scroll down to "Advanced" section** or look for "Root Directory" field:

### **Root Directory:**
```
backend
```

**Important:** This tells Render that your Python app is in the `backend/` folder, not the root.

---

## 📋 Step 5: Configure Build Command

Look for **"Build Command"** field:

### **Build Command:**
```bash
apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
```

**Copy and paste this EXACT command** (includes FFmpeg installation).

**OR** if Render shows separate fields:
- **Install System Packages:** `apt-get update && apt-get install -y ffmpeg`
- **Build Command:** `pip install -r requirements.txt`

---

## 📋 Step 6: Configure Start Command

Look for **"Start Command"** field:

### **Start Command:**
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

**Note:** `$PORT` is automatically set by Render - don't change it!

---

## 📋 Step 7: Add Environment Variables

Click on **"Environment"** or **"Environment Variables"** section/tab.

Click **"Add Environment Variable"** for each:

### Required Variables:

| Key | Value | Description |
|-----|-------|-------------|
| `SUPABASE_URL` | `https://dyphuthrtmgvaeoferbm.supabase.co` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key_here` | Get from Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cGh1dGhydG1ndmFlb2ZlcmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzUxODcsImV4cCI6MjA3NzY1MTE4N30.nyJEhIcGcJiGvACogsZmdzMM3_c1LKqiVMsbTuFa22I` | Your anon key |
| `WHISPER_MODEL` | `tiny` | Start small, can upgrade later |
| `SUMMARIZER_MODEL` | `ai4bharat/IndicBARTSS` | IndicBARTSS model |
| `BUCKET_NAME` | `audio-uploads` | Supabase storage bucket name |
| `PORT` | `8000` | Port (Render sets $PORT automatically, but this is fallback) |

**Important Notes:**
- Click "Add" after each variable
- **Never commit** your `SUPABASE_SERVICE_ROLE_KEY` to git!
- Keep `WHISPER_MODEL=tiny` for first deployment (faster, less memory)

---

## 📋 Step 8: Choose Plan

- **Free Plan:** Limited resources, may have memory issues with models
- **Starter Plan ($7/month):** More reliable for AI models

**Recommendation:** Start with Free, upgrade if you hit memory limits.

---

## 📋 Step 9: Review and Deploy

1. **Review Settings:**
   - ✅ Root Directory: `backend`
   - ✅ Build Command: `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt`
   - ✅ Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - ✅ Environment variables: All set

2. **Click "Create Web Service"**

3. **Wait for Deployment:**
   - First deployment: **15-20 minutes** (models download)
   - Subsequent: 2-5 minutes

---

## 📋 Step 10: Monitor Deployment

### Watch the Logs:

1. Click on your service name
2. Go to **"Logs"** tab
3. Watch for:

**✅ Success Indicators:**
```
✅ Whisper model loaded successfully
✅ Summarizer model loaded successfully
✅ Application startup complete
```

**❌ Error Indicators:**
```
❌ ffmpeg not found → FFmpeg not installed (check build command)
❌ Missing environment variables → Set env vars
❌ Out of memory → Upgrade plan or use smaller model
```

---

## 📋 Step 11: Get Your Backend URL

After successful deployment:

1. Render will show your service URL:
   ```
   https://classroom-backend-xxxx.onrender.com
   ```

2. **Copy this URL** - you'll need it for:
   - Frontend `VITE_BACKEND_URL` environment variable
   - Testing the API
   - CORS configuration

3. **Test Your Backend:**
   ```bash
   curl https://classroom-backend-xxxx.onrender.com/
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "service": "AI Telugu Summarization",
     ...
   }
   ```

---

## 🔧 Troubleshooting

### Error: "ffmpeg not found"
**Fix:** Make sure build command includes:
```bash
apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
```

### Error: "Missing environment variables"
**Fix:** Go to Environment tab and add all required variables

### Error: "Out of memory"
**Fix:** 
- Change `WHISPER_MODEL` to `tiny`
- Or upgrade Render plan

### Error: "Build timeout"
**Fix:** 
- First build takes 15-20 minutes (models download)
- Use `WHISPER_MODEL=tiny` for faster builds
- Be patient!

### Error: "Module not found"
**Fix:** 
- Check `requirements.txt` has all dependencies
- Verify Root Directory is `backend`

---

## 📊 Complete Configuration Summary

```
Service Name: classroom-backend
Type: Web Service
Environment: Python 3
Root Directory: backend
Build Command: apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT

Environment Variables:
  SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=your_key
  SUPABASE_ANON_KEY=your_anon_key
  WHISPER_MODEL=tiny
  SUMMARIZER_MODEL=ai4bharat/IndicBARTSS
  BUCKET_NAME=audio-uploads
  PORT=8000
```

---

## ✅ Checklist Before Deploying

- [ ] Repository connected to Render
- [ ] Root Directory set to `backend`
- [ ] Build Command includes FFmpeg installation
- [ ] Start Command is `uvicorn app:app --host 0.0.0.0 --port $PORT`
- [ ] All environment variables added
- [ ] `SUPABASE_SERVICE_ROLE_KEY` copied correctly (no spaces)
- [ ] Supabase storage bucket `audio-uploads` exists
- [ ] Ready to wait 15-20 minutes for first deployment

---

## 🎯 Quick Navigation in Render Dashboard

After clicking "New +" → "Web Service":

1. **Basic Settings Tab:**
   - Name, Environment, Region

2. **Build & Deploy Tab:**
   - Root Directory
   - Build Command
   - Start Command

3. **Environment Tab:**
   - All environment variables

4. **Settings Tab (Advanced):**
   - Plan selection
   - Auto-deploy settings

---

## 🚀 You're Ready!

Follow these steps and your backend will be deployed successfully. 

**Remember:** 
- First deployment takes 15-20 minutes
- Monitor the logs
- Test the `/` endpoint after deployment
- Copy the backend URL for frontend configuration

Good luck! 🎉

