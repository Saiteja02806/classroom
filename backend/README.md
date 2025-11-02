# AI Telugu Summarization Backend

FastAPI backend service for transcribing audio files with faster-whisper and generating Telugu summaries using IndicBARTSS.

## Features

- 🎤 **Audio Transcription**: Uses faster-whisper for accurate speech-to-text
- 📝 **AI Summarization**: IndicBARTSS model for Telugu/English summaries
- ☁️ **Supabase Integration**: Stores transcripts and summaries in PostgreSQL
- 🔐 **Secure Storage**: Uses Supabase Storage with signed URLs

## Setup

### 1. Prerequisites

- Python 3.8+
- ffmpeg installed (for audio processing)
- Supabase project with:
  - Storage bucket: `audio-uploads` (private)
  - Tables: `transcripts`, `summaries`

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Note**: First-time installation may take 10-15 minutes as it downloads:
- Whisper model (~500MB for 'small')
- IndicBARTSS model (~1.5GB)

### 3. Environment Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Get from Supabase Dashboard → Settings → API
- `SUPABASE_ANON_KEY`: Your anon key (for reference)
- `PORT`: Backend server port (default: 8000)
- `BUCKET_NAME`: Storage bucket name (default: audio-uploads)
- `WHISPER_MODEL`: Whisper model size (`tiny`, `base`, `small`, `medium`, `large`)
- `SUMMARIZER_MODEL`: Model identifier (default: `ai4bharat/IndicBARTSS`)

### 4. Create Supabase Storage Bucket

In Supabase Dashboard:
1. Go to **Storage**
2. Click **New Bucket**
3. Name: `audio-uploads`
4. Make it **Private**
5. Enable RLS (Row Level Security)

### 5. Run the Server

**Development mode (with auto-reload):**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**Production mode:**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### `GET /`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "AI Telugu Summarization",
  "whisper_model": "small",
  "summarizer_model": "ai4bharat/IndicBARTSS",
  "models_loaded": {
    "whisper": true,
    "summarizer": true
  }
}
```

### `GET /health`
Detailed health check.

### `POST /process`
Process an audio file: transcribe → summarize → save to database.

**Request Body:**
```json
{
  "file_key": "user-uuid/1234567890-audio.webm",
  "user_id": "user-uuid-string",  // Optional
  "force_output_language": "auto",  // "auto", "te", or "en"
  "max_length": 120,
  "min_length": 20
}
```

**Response:**
```json
{
  "transcript_id": "uuid",
  "summary_id": "uuid",
  "transcript": "Full transcribed text...",
  "summary": "Generated summary...",
  "language": "te",
  "message": "Processing completed successfully"
}
```

## Database Schema

### `transcripts` Table
- `id` (text, PK): Unique transcript ID
- `user_id` (uuid, FK → auth.users): User who uploaded
- `transcript_text` (text): Full transcription
- `language` (text): Detected language (default: 'te')
- `confidence` (real): Language detection confidence
- `duration` (real): Audio duration (if available)
- `created_at` (timestamptz): Creation timestamp
- `updated_at` (timestamptz): Last update

### `summaries` Table
- `id` (text, PK): Unique summary ID
- `user_id` (uuid, FK → auth.users): User who owns this
- `transcript_id` (text, FK → transcripts.id): Linked transcript
- `summary_text` (text): Generated summary
- `key_points` (text[]): Extracted key points (future)
- `action_items` (text[]): Extracted action items (future)
- `method` (text): Summarization method used
- `created_at` (timestamptz): Creation timestamp
- `updated_at` (timestamptz): Last update

## Processing Flow

1. **Frontend uploads** audio file → Supabase Storage (`audio-uploads` bucket)
2. **Frontend calls** `/process` with `file_key`
3. **Backend downloads** file using signed URL from Supabase
4. **faster-whisper** transcribes audio → text
5. **Backend saves** transcript to `transcripts` table
6. **IndicBARTSS** generates summary from transcript
7. **Backend saves** summary to `summaries` table (linked to transcript)
8. **Response returned** to frontend with transcript + summary

## Model Sizes

### Whisper Models
- `tiny`: Fastest, ~39M params, lower accuracy
- `base`: ~74M params, good balance
- `small`: **Recommended**, ~244M params, good accuracy/speed
- `medium`: ~769M params, better accuracy
- `large`: ~1550M params, best accuracy, slowest

### IndicBARTSS
- Supports multiple Indian languages
- Good for Telugu, Hindi, English, etc.
- ~600M parameters

## Troubleshooting

### Model Loading Errors
- Ensure you have sufficient disk space (models are large)
- Check internet connection for model downloads
- For CPU-only environments, use `WHISPER_MODEL=tiny`

### Supabase Connection Errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check that storage bucket exists and is accessible
- Ensure RLS policies allow service_role access

### Memory Issues
- Use smaller Whisper model (`tiny` or `base`)
- Consider chunking long audio files
- Increase server RAM if possible

## Deployment to Render

1. **Push code to GitHub** (ensure `.env` is NOT committed)
2. **Create Web Service** on Render
3. **Connect GitHub repo** and set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. **Add Environment Variables**:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY`
   - `WHISPER_MODEL=small`
   - `SUMMARIZER_MODEL=ai4bharat/IndicBARTSS`
   - `BUCKET_NAME=audio-uploads`
   - `PORT=8000` (auto-set by Render)

5. **First deployment** will take 15-20 minutes (model downloads)

## Local Testing

```bash
# Start server
uvicorn app:app --reload

# Test health endpoint
curl http://localhost:8000/

# Test processing (after uploading file manually)
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d '{
    "file_key": "user-id/1234567890-audio.webm",
    "user_id": "user-uuid",
    "force_output_language": "auto"
  }'
```

## License

MIT

