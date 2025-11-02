# Render Deployment Guide

## ✅ Git Repository Setup Complete

Your repository has been initialized and is ready for deployment to Render!

## 📋 Current Status

- ✅ Git repository initialized
- ✅ All files committed
- ✅ Branch set to `main`
- ✅ `.gitignore` configured (env files excluded)

## 🚀 Next Steps for Render Deployment

### 1. Create GitHub Repository (Optional but Recommended)

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 2. Deploy Backend to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Create New Web Service**
3. **Connect Repository**: 
   - Connect your GitHub account
   - Select your repository
   - Or use "Public Git repository" and paste your repo URL

4. **Configure Backend Service:**
   - **Name**: `ai-telugu-summarization-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT`

5. **Set Environment Variables** (in Render Dashboard):
   ```
   SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   SUPABASE_ANON_KEY=your_anon_key_here
   PORT=8000
   BUCKET_NAME=audio-uploads
   WHISPER_MODEL=small
   SUMMARIZER_MODEL=ai4bharat/IndicBARTSS
   ```

6. **Deploy** - First deployment takes 15-20 minutes (model downloads)

7. **Get Backend URL**: Copy the service URL (e.g., `https://your-backend.onrender.com`)

### 3. Update Frontend Environment Variables

Update your `.env` file (or create new one) with Render backend URL:

```env
VITE_SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
VITE_SUPABASE_KEY=your_anon_key_here
VITE_BACKEND_URL=https://your-backend.onrender.com
```

### 4. Deploy Frontend to Render (or Vercel/Netlify)

**Option A: Render (Static Site)**

1. **Create New Static Site** on Render
2. **Connect Repository**
3. **Configure:**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
     VITE_SUPABASE_KEY=your_anon_key_here
     VITE_BACKEND_URL=https://your-backend.onrender.com
     ```

**Option B: Vercel (Recommended for Frontend)**

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: Same as above

**Option C: Netlify**

1. Go to https://netlify.com
2. Import from Git
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment Variables: Same as above

## 📝 Important Notes

### Backend Deployment

- ⚠️ First deployment takes 15-20 minutes (AI models download)
- ✅ Models are cached after first download
- ✅ Check logs if deployment fails
- ✅ Ensure all environment variables are set

### Frontend Deployment

- ✅ Build command: `npm run build`
- ✅ Output: `dist` folder
- ✅ Environment variables must start with `VITE_` (Vite requirement)
- ✅ Update `VITE_BACKEND_URL` with your Render backend URL

### Security Checklist

- ✅ `.env` files are in `.gitignore`
- ✅ Never commit API keys or secrets
- ✅ Set environment variables in Render/Vercel dashboard
- ✅ Use service_role key only in backend (never in frontend)

## 🔍 Testing After Deployment

### Test Backend:
```bash
curl https://your-backend.onrender.com/
# Should return: {"status": "ok", ...}
```

### Test Frontend:
1. Visit your frontend URL
2. Sign up/Login
3. Record or upload audio
4. Verify processing works

## 📊 Deployment Checklist

### Backend (Render):
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Build command: `cd backend && pip install -r requirements.txt`
- [ ] Start command: `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT`
- [ ] Deployment successful
- [ ] Health check works: `curl https://your-backend.onrender.com/`

### Frontend (Render/Vercel/Netlify):
- [ ] Repository connected
- [ ] Environment variables set (VITE_*)
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Deployment successful
- [ ] Can access homepage
- [ ] Authentication works
- [ ] Can connect to backend API

## 🐛 Troubleshooting

### Backend Issues:

**Models not loading:**
- Check Render logs
- Verify disk space (models are large)
- Check internet connectivity during build

**CORS errors:**
- Update backend `app.py` CORS origins to include frontend URL
- Add: `allow_origins=["https://your-frontend.vercel.app"]`

**Connection errors:**
- Verify Supabase credentials
- Check backend logs for specific errors
- Ensure service_role key is correct

### Frontend Issues:

**Environment variables not working:**
- Variables must start with `VITE_`
- Rebuild after changing variables
- Check build logs

**Backend connection fails:**
- Verify `VITE_BACKEND_URL` is set correctly
- Check backend is running
- Check CORS configuration

## 📚 Additional Resources

- Render Docs: https://render.com/docs
- Vite Environment Variables: https://vitejs.dev/guide/env-and-mode.html
- Supabase Storage: https://supabase.com/docs/guides/storage

## ✅ You're Ready!

Your code is committed and ready for deployment. Follow the steps above to deploy to Render!

Good luck! 🚀

