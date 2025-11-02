# Render Build Commands Guide

## 📋 You Have TWO Separate Deployments

Your application has **TWO parts** that need separate Render services:

1. **Frontend** (React + Vite) → Static Site or Web Service
2. **Backend** (Python FastAPI) → Web Service

Each has **different build commands**!

---

## 🎨 FRONTEND Deployment (React/Vite)

### Service Type: **Static Site** (Recommended)

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
dist
```

**Environment Variables:**
```
VITE_SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
VITE_SUPABASE_KEY=your_anon_key
VITE_BACKEND_URL=https://your-backend.onrender.com
```

**✅ This is CORRECT - Don't Change!**

---

## ⚙️ BACKEND Deployment (Python/FastAPI)

### Service Type: **Web Service**

**Root Directory:**
```
backend
```

**Build Command:**
```bash
apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

**Environment Variables:**
```
SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
WHISPER_MODEL=tiny
SUMMARIZER_MODEL=ai4bharat/IndicBARTSS
BUCKET_NAME=audio-uploads
PORT=8000
```

**✅ This is what you need to fix!**

---

## 📊 Summary Table

| Service | Type | Build Command | Start Command |
|---------|------|---------------|---------------|
| **Frontend** | Static Site | `npm install && npm run build` | (Auto) |
| **Backend** | Web Service | `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt` | `uvicorn app:app --host 0.0.0.0 --port $PORT` |

---

## 🎯 What You Need to Do

### For FRONTEND (if deploying separately):
- ✅ Keep: `npm install && npm run build`
- ✅ Publish Directory: `dist`
- ✅ Set VITE_* environment variables

### For BACKEND:
- ✅ Change Build Command to: `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt`
- ✅ Set Python environment variables
- ✅ Root Directory: `backend`

---

## 🔍 How to Identify Which Service

**If you see:**
- `npm install` → **Frontend**
- `pip install` → **Backend**

**If you see:**
- `npm run build` → **Frontend**
- `uvicorn` → **Backend**

---

## ⚠️ Common Mistake

**WRONG:** Putting frontend build commands in backend service
```
Backend Service:
Build: npm install && npm run build  ❌ WRONG!
```

**CORRECT:**
```
Backend Service:
Build: apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt  ✅
```

---

## 🚀 Complete Deployment Setup

### Backend Service on Render:
```
Name: classroom-backend
Type: Web Service
Environment: Python 3
Root Directory: backend
Build Command: apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Frontend Service on Render (or Vercel/Netlify):
```
Name: classroom-frontend
Type: Static Site
Build Command: npm install && npm run build
Publish Directory: dist
```

---

## ✅ Answer to Your Question

**Q: Should I change `npm install; npm run build` to `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt`?**

**A:** **NO!** These are for **different services**:

- `npm install; npm run build` → **Frontend** (keep this)
- `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt` → **Backend** (use this for backend service)

You need **TWO separate Render services** (or deploy frontend to Vercel/Netlify).

---

## 📝 Quick Checklist

- [ ] Backend: Build command has FFmpeg installation
- [ ] Backend: Root Directory = `backend`
- [ ] Frontend: Build command = `npm install && npm run build`
- [ ] Frontend: Publish Directory = `dist`
- [ ] Both: Environment variables set correctly

---

**In Summary:** Don't change the frontend build command. The FFmpeg command is ONLY for the backend service!

