# 🔧 CRITICAL FIXES REQUIRED FOR RENDER

## ⚠️ IMMEDIATE ACTION REQUIRED

These issues **WILL** cause deployment failures. Fix them before deploying.

---

## 1. 🔴 FFmpeg System Binary Missing

### Problem:
`faster-whisper` requires the **FFmpeg system binary**, not just the Python package.

### Error You'll See:
```
RuntimeError: ffmpeg not found
OSError: [Errno 2] No such file or directory: 'ffmpeg'
```

### ✅ FIX: Update Render Build Command

**Current (WRONG):**
```
pip install -r requirements.txt
```

**Fixed (CORRECT):**
```
apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
```

**OR** use the `render.yaml` file I created.

---

## 2. 🔴 Missing uvicorn[standard]

### Problem:
`uvicorn` without `[standard]` may lack performance features.

### ✅ FIX: Update requirements.txt

**Current:**
```txt
uvicorn
```

**Should be:**
```txt
uvicorn[standard]
```

---

## 3. 🔴 Environment Variables Not Set

### Problem:
App will crash on startup if env vars are missing.

### ✅ FIX: Set in Render Dashboard

Go to: Render Dashboard → Your Service → Environment

**Required Variables:**
```
SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
WHISPER_MODEL=tiny
SUMMARIZER_MODEL=ai4bharat/IndicBARTSS
BUCKET_NAME=audio-uploads
PORT=8000
```

---

## 4. 🔴 Model Loading on Startup (Memory Issue)

### Problem:
Loading models at startup may cause:
- Out of memory errors
- Build timeout
- Slow startup

### ✅ FIX: Better Error Handling

Add to `app.py` after model loading:

```python
# After line 75, add:
if not whisper_model:
    logger.error("CRITICAL: Whisper model failed to load. Check disk space and logs.")
    raise RuntimeError("Whisper model loading failed - cannot start server")

if not summarizer:
    logger.error("CRITICAL: Summarizer model failed to load. Check disk space and logs.")
    raise RuntimeError("Summarizer model loading failed - cannot start server")
```

---

## 5. 🟡 Improve CORS for Production

### Problem:
Allowing all origins (`["*"]`) is insecure.

### ✅ FIX: Specify Frontend URL

Update `app.py` line 25:

```python
allow_origins=[
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "https://your-frontend.vercel.app",  # Add your frontend URL
]
```

---

## 📋 QUICK FIX CHECKLIST

Copy and paste this checklist:

- [ ] **Update Build Command** to install FFmpeg
- [ ] **Update requirements.txt**: Change `uvicorn` to `uvicorn[standard]`
- [ ] **Set all environment variables** in Render dashboard
- [ ] **Create Supabase bucket**: `audio-uploads`
- [ ] **Test locally first** with smaller model (`tiny`)
- [ ] **Update CORS** with production frontend URL
- [ ] **Monitor first deployment** (takes 15-20 minutes)

---

## 🚀 DEPLOYMENT COMMANDS TO USE

### Render Build Command:
```bash
apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
```

### Render Start Command:
```bash
uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Root Directory:
```
backend
```

---

**FIX THESE BEFORE DEPLOYING OR YOUR APP WILL FAIL!** ⚠️

