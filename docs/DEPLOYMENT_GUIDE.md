# 🚀 Complete Deployment Guide

## Overview

This project is organized for easy deployment on Render (or similar platforms).

## 📁 Project Structure for Deployment

```
classroom/
├── [Frontend Files]          # Root directory for frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Backend directory
│   ├── app.py
│   ├── requirements.txt
│   └── render.yaml
│
├── docs/                     # Documentation
└── README.md
```

---

## 🌐 Deployment to Render

### Option 1: Manual Setup (Step-by-Step)

#### **Backend Service**

1. **Create Web Service**
   - Go to: https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Repository: `Saiteja02806/classroom`
   - Branch: `main`

3. **Configure Settings:**
   ```
   Name: classroom-backend
   Environment: Python 3
   Root Directory: backend
   Build Command: apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
   Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
   ```

4. **Environment Variables:**
   ```
   SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_ANON_KEY=your_anon_key
   WHISPER_MODEL=tiny
   SUMMARIZER_MODEL=ai4bharat/IndicBARTSS
   BUCKET_NAME=audio-uploads
   ```

5. **Deploy** - Wait 15-20 minutes for first deployment

#### **Frontend Service**

1. **Create Static Site**
   - Go to: https://dashboard.render.com
   - Click "New +" → "Static Site"

2. **Connect Repository**
   - Repository: `Saiteja02806/classroom`
   - Branch: `main`

3. **Configure Settings:**
   ```
   Name: classroom-frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Environment Variables:**
   ```
   VITE_SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
   VITE_SUPABASE_KEY=your_anon_key
   VITE_BACKEND_URL=https://classroom-backend-xxxx.onrender.com
   ```
   *(Use the backend URL from step above)*

5. **Deploy** - Should take 2-5 minutes

### Option 2: Using render.yaml (Automatic)

1. **Push `render.yaml` to GitHub** (already included in repo)

2. **In Render Dashboard:**
   - Click "New +" → "Blueprint"
   - Select repository: `Saiteja02806/classroom`
   - Render will auto-detect `render.yaml`

3. **Review and Deploy:**
   - Render creates both services automatically
   - You'll need to add environment variables manually (they're marked `sync: false`)

---

## ✅ Pre-Deployment Checklist

### Backend:
- [ ] Repository pushed to GitHub
- [ ] Supabase bucket `audio-uploads` created
- [ ] Environment variables ready (service_role_key)
- [ ] `backend/requirements.txt` updated
- [ ] `backend/app.py` configured correctly

### Frontend:
- [ ] Repository pushed to GitHub
- [ ] Environment variables ready
- [ ] Backend URL available (from backend deployment)
- [ ] `package.json` configured

### General:
- [ ] `.env` files NOT committed to git
- [ ] `.gitignore` includes `.env` files
- [ ] Documentation organized in `docs/` folder

---

## 🔧 Environment Variables Reference

### Backend (Render Dashboard)

| Variable | Value | Required |
|----------|-------|----------|
| `SUPABASE_URL` | `https://dyphuthrtmgvaeoferbm.supabase.co` | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | ✅ Yes |
| `SUPABASE_ANON_KEY` | Your anon key | ✅ Yes |
| `WHISPER_MODEL` | `tiny` or `small` | ✅ Yes |
| `SUMMARIZER_MODEL` | `ai4bharat/IndicBARTSS` | ✅ Yes |
| `BUCKET_NAME` | `audio-uploads` | ✅ Yes |
| `PORT` | `8000` | Optional |

### Frontend (Render Dashboard)

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_SUPABASE_URL` | `https://dyphuthrtmgvaeoferbm.supabase.co` | ✅ Yes |
| `VITE_SUPABASE_KEY` | Your anon key | ✅ Yes |
| `VITE_BACKEND_URL` | Backend URL from Render | ✅ Yes |

**Important:** All frontend variables MUST start with `VITE_` prefix!

---

## 📊 Deployment Status

After deployment, check:

### Backend Health:
```bash
curl https://your-backend.onrender.com/
```

Should return:
```json
{
  "status": "ok",
  "service": "AI Telugu Summarization",
  "whisper_model": "tiny",
  "models_loaded": {
    "whisper": true,
    "summarizer": true
  }
}
```

### Frontend:
- Visit your frontend URL
- Should show login/signup page
- Check browser console for errors

---

## 🐛 Troubleshooting

### Backend Issues:

**FFmpeg not found:**
- ✅ Build command must include: `apt-get update && apt-get install -y ffmpeg`

**Models not loading:**
- Check logs for errors
- Use `WHISPER_MODEL=tiny` for faster builds
- Verify sufficient disk space

**Environment variables:**
- Verify all variables are set
- Check for typos
- Ensure service_role_key is correct

### Frontend Issues:

**Environment variables not working:**
- Must start with `VITE_`
- Rebuild after changing variables
- Check build logs

**Backend connection fails:**
- Verify `VITE_BACKEND_URL` is correct
- Check backend is running
- Verify CORS configuration

---

## 📝 Post-Deployment

1. **Test Authentication:**
   - Sign up new user
   - Login
   - Verify session works

2. **Test Audio Processing:**
   - Record or upload audio
   - Verify upload to Supabase Storage
   - Check backend processes audio
   - Verify transcript and summary generated

3. **Monitor Logs:**
   - Check Render logs regularly
   - Watch for errors
   - Monitor resource usage

---

## 🔄 Updating Deployment

When you make changes:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```

2. **Render Auto-Deploys:**
   - Render detects changes automatically
   - Triggers new deployment
   - Check deployment status in dashboard

3. **Manual Deploy (if needed):**
   - Go to service → "Manual Deploy"
   - Select commit to deploy

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

**Your project is now ready for production deployment!** 🚀

