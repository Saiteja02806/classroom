# Quick Start Guide - AI Telugu Summarization

This guide will help you get the full application running locally.

## Prerequisites

- ✅ Node.js 16+ and npm/yarn
- ✅ Python 3.8+
- ✅ ffmpeg installed (for audio processing)
- ✅ Supabase account with project set up

## Step 1: Supabase Setup

1. **Create Storage Bucket**
   - Follow instructions in `SUPABASE_SETUP.md`
   - Create bucket: `audio-uploads` (private)

2. **Get Service Role Key**
   - Supabase Dashboard → Settings → API
   - Copy `service_role` key (keep it secret!)

3. **Verify Tables**
   - Tables `transcripts` and `summaries` should exist
   - Check `SUPABASE_SETUP.md` for schema details

## Step 2: Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment template (optional - values already in code)
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run at: `http://localhost:3000`

## Step 3: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install Python dependencies (takes 10-15 min first time)
pip install -r requirements.txt

# Copy and edit environment file
# Windows PowerShell:
Copy-Item .env.example .env

# Edit .env and add your SUPABASE_SERVICE_ROLE_KEY
# The file should have:
# SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
# SUPABASE_ANON_KEY=your_anon_key
# PORT=8000
# BUCKET_NAME=audio-uploads
# WHISPER_MODEL=small
# SUMMARIZER_MODEL=ai4bharat/IndicBARTSS

# Start backend server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Backend will run at: `http://localhost:8000`

**First startup notes:**
- Models download automatically (15-20 minutes first time)
- Whisper model: ~500MB
- IndicBARTSS model: ~1.5GB
- You'll see loading messages in console

## Step 4: Verify Setup

### Test Backend
```bash
# Health check
curl http://localhost:8000/

# Should return:
# {
#   "status": "ok",
#   "service": "AI Telugu Summarization",
#   "models_loaded": { "whisper": true, "summarizer": true }
# }
```

### Test Frontend
1. Open `http://localhost:3000`
2. Sign up for a new account
3. Login
4. Check Dashboard shows "Supabase Connection Status: ✅ Connected"

## Step 5: Test Audio Upload (After Both Servers Running)

### Option 1: Use Frontend (when upload UI is built)
1. Navigate to upload page
2. Select audio file
3. Upload and process

### Option 2: Manual Test via API

1. **Upload file to Supabase Storage** (via Supabase Dashboard or code)
2. **Call processing endpoint:**
```bash
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d '{
    "file_key": "user-id/1234567890-audio.webm",
    "user_id": "your-user-uuid",
    "force_output_language": "auto"
  }'
```

## Project Structure

```
classroom/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── services/           # API services (uploadService.js)
│   ├── contexts/           # React contexts (Auth)
│   └── lib/                # Utilities (supabase.js)
├── backend/               # Python FastAPI backend
│   ├── app.py             # Main application
│   ├── requirements.txt   # Python dependencies
│   ├── .env               # Backend env vars (not in git)
│   └── README.md          # Backend documentation
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
└── SUPABASE_SETUP.md      # Supabase setup guide
```

## Common Issues

### Backend won't start
- ✅ Check Python version: `python --version` (need 3.8+)
- ✅ Check ffmpeg installed: `ffmpeg -version`
- ✅ Verify `.env` file exists and has correct values
- ✅ Check service_role key is correct

### Models not loading
- ✅ Check internet connection (models download first time)
- ✅ Verify disk space (need ~3GB for models)
- ✅ Check console for specific error messages
- ✅ Try smaller model: `WHISPER_MODEL=tiny` in `.env`

### Storage upload fails
- ✅ Verify bucket `audio-uploads` exists in Supabase
- ✅ Check bucket is accessible (not public, but with proper RLS)
- ✅ Verify user is authenticated
- ✅ Check RLS policies in Supabase Dashboard

### CORS errors
- ✅ Backend has CORS enabled for all origins (development)
- ✅ Verify backend URL matches in frontend
- ✅ Check both servers are running

## Next Steps

1. **Build Upload UI** in frontend to use `uploadService.js`
2. **Add Transcript Display** component
3. **Add Summary Display** component
4. **Add History View** to show past transcripts
5. **Deploy to Render** (see `backend/README.md`)

## Environment Variables Summary

### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:8000
VITE_SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (backend/.env)
```
SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
PORT=8000
BUCKET_NAME=audio-uploads
WHISPER_MODEL=small
SUMMARIZER_MODEL=ai4bharat/IndicBARTSS
```

## Support

- 📖 Backend docs: `backend/README.md`
- 📖 Supabase setup: `SUPABASE_SETUP.md`
- 📖 Frontend docs: `README.md`

