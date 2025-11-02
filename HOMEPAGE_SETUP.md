# Homepage Audio Recorder Setup Guide

## ✅ What's Been Created

1. **`src/components/HomepageRecorder.jsx`** - Complete homepage component with:
   - Audio recording functionality
   - File upload support
   - Processing status display
   - Results display (transcript + summary)
   - History of previous recordings
   - Delete functionality

2. **Updated `src/App.jsx`** - Added homepage route (`/`) that shows the recorder

## 📋 Environment Variables Setup

Create a `.env` file in the root directory (if not exists) or update existing one:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://dyphuthrtmgvaeoferbm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cGh1dGhydG1ndmFlb2ZlcmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzUxODcsImV4cCI6MjA3NzY1MTE4N30.nyJEhIcGcJiGvACogsZmdzMM3_c1LKqiVMsbTuFa22I

# Backend API URL (Replace with your Render deployment URL)
VITE_BACKEND_URL=https://your-backend.onrender.com
```

**Important:** Replace `VITE_BACKEND_URL` with your actual Render backend URL once deployed.

## 🔧 Dependencies

All required dependencies are already installed:
- ✅ `@supabase/supabase-js` - Already in package.json
- ✅ `react-router-dom` - Already installed
- ✅ `lucide-react` - Already installed for icons

No additional npm install needed!

## 🚀 Testing Steps

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Authentication Flow

1. Navigate to `http://localhost:3000`
2. If not logged in, you'll see a message to sign in
3. Sign up or log in with existing account
4. You should see the homepage recorder interface

### 3. Test Audio Recording

1. Click "Start Recording"
2. Grant microphone permissions if prompted
3. Speak into your microphone
4. Click "Stop Recording"
5. Click "Play" to review recording
6. Click "Process Recording" to transcribe and summarize

### 4. Test File Upload

1. Click "Select Audio File"
2. Choose an audio file (webm, mp3, wav, ogg, m4a)
3. File will automatically upload and process
4. Wait for transcript and summary to appear

### 5. Test History

1. After processing, check the History sidebar
2. Click on any history item to view its results
3. Click delete icon to remove items

## 🐛 Debugging Tips

### Issue: "Failed to access microphone"

**Solution:**
- Check browser permissions for microphone access
- Ensure HTTPS in production (required for getUserMedia)
- Try different browser (Chrome recommended)
- Check if microphone is working in other apps

### Issue: "Failed to upload file"

**Possible Causes:**
1. **Supabase bucket doesn't exist:**
   - Go to Supabase Dashboard → Storage
   - Create bucket named `audio-uploads` (private)
   - Set up RLS policies (see SUPABASE_SETUP.md)

2. **RLS policies blocking upload:**
   - Check Supabase Storage policies
   - Ensure authenticated users can upload

3. **User not logged in:**
   - Check if user object exists
   - Verify authentication is working

### Issue: "Backend processing failed"

**Possible Causes:**
1. **Backend URL incorrect:**
   - Check `VITE_BACKEND_URL` in `.env`
   - Ensure URL doesn't have trailing slash
   - Verify backend is deployed and running

2. **Backend not responding:**
   - Check backend health: `curl https://your-backend.onrender.com/`
   - Check backend logs on Render
   - Verify backend environment variables are set

3. **CORS errors:**
   - Backend should allow frontend origin
   - Check backend CORS configuration in `backend/app.py`

### Issue: "Processing stuck"

**Check:**
1. Browser console for errors
2. Backend logs on Render
3. Network tab in DevTools - verify API call completes
4. Supabase database - check if transcript/summary records are created

### Issue: History not loading

**Check:**
1. User is logged in (check user.id exists)
2. Supabase tables exist (`transcripts`, `summaries`)
3. RLS policies allow reading user's own data
4. Browser console for errors

## 📊 Component Features

### HomepageRecorder Component

**Features:**
- ✅ Real-time audio recording with timer
- ✅ File upload with drag & drop support
- ✅ Language selection (Auto, Telugu, English)
- ✅ Processing status with progress messages
- ✅ Results display (Transcript + AI Summary)
- ✅ History sidebar with previous recordings
- ✅ Delete functionality
- ✅ Audio playback for recorded audio
- ✅ Error handling with user-friendly messages
- ✅ Responsive design (mobile-friendly)

**User Flow:**
1. User records or uploads audio
2. File uploads to Supabase Storage
3. Backend processes audio (Whisper → IndicBARTSS)
4. Results saved to Supabase database
5. Transcript and summary displayed
6. Added to history sidebar

## 🔒 Security Notes

- ✅ Uses Supabase anon key (safe for frontend)
- ✅ RLS policies protect user data
- ✅ Service role key stays in backend (never in frontend)
- ✅ File validation on frontend and backend
- ✅ User authentication required

## 🎨 UI/UX Features

- ✅ Beautiful gradient background
- ✅ Card-based layout
- ✅ Loading states with spinners
- ✅ Error messages with icons
- ✅ Success indicators
- ✅ Responsive grid layout
- ✅ Sticky history sidebar
- ✅ Smooth transitions
- ✅ Accessible (keyboard navigation, ARIA labels)

## 📝 Next Steps

1. **Deploy Backend to Render:**
   - Follow `backend/README.md` instructions
   - Get Render URL
   - Update `VITE_BACKEND_URL` in `.env`

2. **Verify Supabase Setup:**
   - Storage bucket `audio-uploads` exists
   - RLS policies configured
   - Tables `transcripts` and `summaries` exist

3. **Test Complete Flow:**
   - Record audio → Process → View results
   - Upload file → Process → View results
   - Check history functionality
   - Test delete functionality

4. **Production Deployment:**
   - Build: `npm run build`
   - Deploy `dist` folder to hosting (Vercel, Netlify, etc.)
   - Set environment variables in hosting platform

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify all environment variables are set
4. Check Supabase Dashboard for storage/database issues
5. Check Render logs for backend errors

## ✅ Checklist

- [ ] `.env` file created with correct variables
- [ ] `VITE_BACKEND_URL` set to Render deployment URL
- [ ] Supabase bucket `audio-uploads` created
- [ ] Backend deployed and accessible
- [ ] Tested recording functionality
- [ ] Tested file upload functionality
- [ ] Tested processing flow
- [ ] Verified results display correctly
- [ ] Tested history functionality
- [ ] Verified delete functionality

Happy recording! 🎤✨

