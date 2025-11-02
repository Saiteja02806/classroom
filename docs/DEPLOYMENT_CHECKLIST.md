# ✅ Pre-Deployment Checklist

Use this checklist before deploying to Render.

## 📋 Backend Deployment Checklist

### Configuration
- [ ] `backend/app.py` exists and is configured
- [ ] `backend/requirements.txt` has all dependencies
- [ ] `backend/requirements.txt` includes `uvicorn[standard]`
- [ ] FFmpeg installation included in build command
- [ ] Root Directory set to `backend` in Render

### Build & Start Commands
- [ ] Build Command: `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt`
- [ ] Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- [ ] Port uses `$PORT` variable (not hardcoded)

### Environment Variables
- [ ] `SUPABASE_URL` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set (get from Supabase Dashboard)
- [ ] `SUPABASE_ANON_KEY` set
- [ ] `WHISPER_MODEL` set (recommended: `tiny` for first deploy)
- [ ] `SUMMARIZER_MODEL` set (`ai4bharat/IndicBARTSS`)
- [ ] `BUCKET_NAME` set (`audio-uploads`)

### Supabase Setup
- [ ] Storage bucket `audio-uploads` created
- [ ] Bucket is private
- [ ] RLS policies configured
- [ ] Service role key copied correctly

### Code
- [ ] No hardcoded secrets in code
- [ ] Environment variables used for all secrets
- [ ] `.env` files in `.gitignore`
- [ ] Error handling in place

---

## 📋 Frontend Deployment Checklist

### Configuration
- [ ] `package.json` exists and configured
- [ ] `vite.config.js` configured
- [ ] Build script exists: `npm run build`
- [ ] Root Directory set to `.` (project root) in Render

### Build & Deploy
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] Static site type selected (not web service)

### Environment Variables
- [ ] `VITE_SUPABASE_URL` set (starts with `VITE_`)
- [ ] `VITE_SUPABASE_KEY` set (starts with `VITE_`)
- [ ] `VITE_BACKEND_URL` set (starts with `VITE_`)
- [ ] Backend URL points to deployed backend service

### Code
- [ ] No hardcoded API keys
- [ ] Uses `import.meta.env.VITE_*` for env vars
- [ ] `.env` files in `.gitignore`

---

## 📋 GitHub Repository Checklist

### Repository Setup
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Main branch set to `main`
- [ ] Remote origin configured

### Files Not Committed
- [ ] `.env` files NOT in git
- [ ] `node_modules/` NOT in git
- [ ] `dist/` NOT in git
- [ ] `__pycache__/` NOT in git
- [ ] `.env.local` NOT in git

### Files Committed
- [ ] `backend/app.py` committed
- [ ] `backend/requirements.txt` committed
- [ ] `package.json` committed
- [ ] `src/` folder committed
- [ ] Configuration files committed
- [ ] Documentation in `docs/` committed

### .gitignore
- [ ] `.gitignore` includes `.env*`
- [ ] `.gitignore` includes `node_modules/`
- [ ] `.gitignore` includes `dist/`
- [ ] `.gitignore` includes `__pycache__/`

---

## 📋 Documentation Checklist

- [ ] `README.md` updated with project info
- [ ] `PROJECT_STRUCTURE.md` explains structure
- [ ] `docs/DEPLOYMENT_GUIDE.md` has deployment steps
- [ ] `docs/` folder organized
- [ ] Setup instructions clear

---

## 📋 Testing Checklist

### Local Testing
- [ ] Backend runs locally: `uvicorn app:app --reload`
- [ ] Frontend runs locally: `npm run dev`
- [ ] Authentication works locally
- [ ] Audio upload works locally
- [ ] Processing works locally

### Production Testing (After Deploy)
- [ ] Backend health check works: `GET /`
- [ ] Backend processes requests: `POST /process`
- [ ] Frontend loads without errors
- [ ] Frontend connects to backend
- [ ] Authentication works in production
- [ ] Audio upload works in production
- [ ] Transcript generation works
- [ ] Summary generation works

---

## 📋 Security Checklist

- [ ] No secrets in code
- [ ] Service role key only in backend env vars (not frontend)
- [ ] Anon key only (no service role) in frontend
- [ ] `.env` files not committed
- [ ] RLS policies enabled in Supabase
- [ ] CORS configured correctly

---

## 📋 Performance Checklist

- [ ] Using appropriate model sizes (`tiny` for testing)
- [ ] Error handling for long operations
- [ ] Timeout configurations set
- [ ] Resource limits understood (free tier limits)

---

## 🚨 Critical Items (Must Fix Before Deploy)

### ❌ WILL FAIL:
1. [ ] Missing FFmpeg in build command
2. [ ] Missing environment variables
3. [ ] Supabase bucket not created
4. [ ] Wrong root directory
5. [ ] Secrets in code/committed

### ⚠️ SHOULD FIX:
1. [ ] Using `uvicorn` instead of `uvicorn[standard]`
2. [ ] CORS allows all origins (`["*"]`)
3. [ ] No error handling for model loading
4. [ ] Large models on free tier

---

## 📊 Deployment Readiness Score

**Count your checkmarks:**

- **All Critical Items:** ✅ Required (0 unchecked)
- **Most Items:** ✅ Recommended (90%+ checked)
- **Some Items:** ⚠️ Review needed (70-90% checked)
- **Few Items:** ❌ Not ready (<70% checked)

---

## 🎯 Quick Reference

### Backend Commands:
```bash
# Local
cd backend && pip install -r requirements.txt
uvicorn app:app --reload

# Render
Root: backend
Build: apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
Start: uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Frontend Commands:
```bash
# Local
npm install
npm run dev

# Render
Root: . (project root)
Build: npm install && npm run build
Publish: dist
```

---

## ✅ When All Checks Pass

You're ready to deploy! 🚀

1. Create services in Render
2. Configure settings
3. Set environment variables
4. Deploy and monitor logs
5. Test production endpoints

---

**Print this checklist and check off items as you complete them!**
