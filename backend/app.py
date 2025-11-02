import os
import tempfile
import requests
import logging
import uuid
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client
from faster_whisper import WhisperModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from langdetect import detect

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Telugu Summarization Service", version="1.0.0")

# CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "small")
SUMMARIZER_MODEL = os.getenv("SUMMARIZER_MODEL", "ai4bharat/IndicBARTSS")
BUCKET_NAME = os.getenv("BUCKET_NAME", "audio-uploads")

# Validate required environment variables
if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError(
        "Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    )

# Initialize Supabase client (server-side with service_role for admin access)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
logger.info(f"Initialized Supabase client for {SUPABASE_URL}")

# Load faster-whisper model (CPU mode for compatibility)
logger.info(f"Loading faster-whisper model: {WHISPER_MODEL}")
try:
    whisper_model = WhisperModel(
        WHISPER_MODEL,
        device="cpu",
        compute_type="int8_float32"
    )
    logger.info("✅ Whisper model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load Whisper model: {e}", exc_info=True)
    whisper_model = None
    # Don't raise error here - allow app to start, check in endpoints

# Load summarizer model (IndicBARTSS)
logger.info(f"Loading summarizer model: {SUMMARIZER_MODEL}")
try:
    tokenizer = AutoTokenizer.from_pretrained(SUMMARIZER_MODEL, use_fast=False)
    model = AutoModelForSeq2SeqLM.from_pretrained(SUMMARIZER_MODEL)
    summarizer = pipeline(
        "summarization",
        model=model,
        tokenizer=tokenizer,
        device=-1  # CPU mode
    )
    logger.info("✅ Summarizer model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load summarizer model: {e}", exc_info=True)
    summarizer = None
    # Don't raise error here - allow app to start, check in endpoints


# Request/Response models
class ProcessRequest(BaseModel):
    file_key: Optional[str] = None  # File key in Supabase Storage (for backwards compatibility)
    audioUrl: Optional[str] = None  # Signed URL from frontend (preferred method)
    userId: Optional[str] = None  # UUID string from auth.users
    user_id: Optional[str] = None  # UUID string from auth.users (alternative name)
    force_output_language: Optional[str] = "auto"  # "auto", "te", "en"
    max_length: int = 120
    min_length: int = 20


class ProcessResponse(BaseModel):
    transcript_id: str
    summary_id: str
    transcript: str
    summary: str
    language: str
    message: str


def download_from_url(audio_url: str, file_ext: str = ".webm") -> str:
    """Download file from a signed URL (provided by frontend)."""
    try:
        logger.info(f"Downloading file from signed URL: {audio_url[:50]}...")
        
        # Download the file
        r = requests.get(audio_url, stream=True, timeout=120)
        r.raise_for_status()
        
        # Save to temporary file
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=file_ext)
        
        with open(tmp.name, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        logger.info(f"Downloaded file to: {tmp.name}")
        return tmp.name
        
    except Exception as e:
        logger.error(f"Error downloading file: {e}")
        raise


def download_signed_url(file_key: str) -> str:
    """Download file from Supabase Storage using signed URL (backwards compatibility)."""
    try:
        # Create signed URL (valid for 60 seconds)
        res = supabase.storage.from_(BUCKET_NAME).create_signed_url(file_key, 60)
        
        if "error" in res or not res.get("data"):
            error_msg = res.get("error", {}).get("message", "Unknown error")
            logger.error(f"Failed to create signed URL: {error_msg}")
            raise RuntimeError(f"Failed to create signed URL: {error_msg}")
        
        url = res["data"]["signedUrl"]
        file_ext = os.path.splitext(file_key)[1] or ".webm"
        return download_from_url(url, file_ext)
        
    except Exception as e:
        logger.error(f"Error downloading file: {e}")
        raise


def detect_language(text: str) -> str:
    """Detect language from text, with special handling for Telugu."""
    try:
        lang = detect(text)
        # If Telugu unicode characters present, prefer 'te'
        if any("\u0C00" <= ch <= "\u0C7F" for ch in text):
            return "te"
        # Map common language codes
        lang_map = {"en": "en", "te": "te", "hi": "hi", "ta": "ta"}
        return lang_map.get(lang, "te")  # Default to Telugu
    except Exception:
        # If detection fails, check for Telugu characters
        if any("\u0C00" <= ch <= "\u0C7F" for ch in text):
            return "te"
        return "en"  # Fallback to English


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "AI Telugu Summarization",
        "whisper_model": WHISPER_MODEL,
        "summarizer_model": SUMMARIZER_MODEL,
        "models_loaded": {
            "whisper": whisper_model is not None,
            "summarizer": summarizer is not None
        }
    }


@app.post("/process", response_model=ProcessResponse)
async def process_audio(req: ProcessRequest):
    """
    Main endpoint: Process audio file -> Transcribe -> Summarize -> Save to DB
    
    Flow:
    1. Download audio from Supabase Storage
    2. Transcribe with faster-whisper
    3. Save transcript to 'transcripts' table
    4. Detect language
    5. Summarize with IndicBARTSS
    6. Save summary to 'summaries' table (linked to transcript)
    """
    audio_path = None
    
    try:
        # Validate inputs
        if not req.audioUrl and not req.file_key:
            raise HTTPException(status_code=400, detail="Either audioUrl or file_key is required")
        
        if not whisper_model:
            raise HTTPException(status_code=503, detail="Whisper model not loaded")
        
        if not summarizer:
            raise HTTPException(status_code=503, detail="Summarizer model not loaded")
        
        # Get user_id from either field name
        user_id = req.userId or req.user_id
        
        logger.info(f"Processing request - audioUrl: {bool(req.audioUrl)}, file_key: {req.file_key}, user_id: {user_id}")
        
        # Step 1: Download audio file
        if req.audioUrl:
            # Use signed URL provided by frontend (preferred method)
            file_ext = os.path.splitext(req.file_key or "audio.webm")[1] if req.file_key else ".webm"
            audio_path = download_from_url(req.audioUrl, file_ext)
        else:
            # Fallback to creating signed URL from file_key (backwards compatibility)
            audio_path = download_signed_url(req.file_key)
        
        # Step 2: Transcribe with faster-whisper
        logger.info("Starting transcription...")
        segments, info = whisper_model.transcribe(
            audio_path,
            language=None,  # Auto-detect language
            beam_size=5,
            vad_filter=True  # Voice activity detection
        )
        
        # Combine segments into full transcript
        transcript_text = " ".join([seg.text for seg in segments]).strip()
        
        if not transcript_text:
            raise HTTPException(
                status_code=500,
                detail="Empty transcript - audio may be too short or unclear"
            )
        
        logger.info(f"Transcript generated (length: {len(transcript_text)} chars)")
        
        # Step 3: Detect or set language
        detected_lang = detect_language(transcript_text)
        if req.force_output_language in ("te", "en"):
            lang = req.force_output_language
        else:
            lang = detected_lang
        
        logger.info(f"Detected language: {lang}")
        
        # Step 4: Create transcript record in Supabase
        transcript_id = str(uuid.uuid4())
        user_uuid = None
        
        if user_id:
            try:
                user_uuid = uuid.UUID(user_id)
            except ValueError:
                logger.warning(f"Invalid user_id format: {user_id}")
        
        transcript_data = {
            "id": transcript_id,
            "user_id": str(user_uuid) if user_uuid else None,
            "transcript_text": transcript_text,
            "language": lang,
            "confidence": float(info.language_probability) if hasattr(info, 'language_probability') else None,
        }
        
        try:
            result = supabase.table("transcripts").insert(transcript_data).execute()
            logger.info(f"✅ Transcript saved with id: {transcript_id}")
        except Exception as e:
            logger.error(f"Failed to save transcript: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to save transcript: {str(e)}")
        
        # Step 5: Summarize with IndicBARTSS
        logger.info("Starting summarization...")
        try:
            # For long transcripts, we might want to chunk them, but for now process whole text
            summary_output = summarizer(
                transcript_text,
                max_length=req.max_length,
                min_length=req.min_length,
                do_sample=False
            )
            
            # Extract summary text
            if isinstance(summary_output, list) and len(summary_output) > 0:
                summary_text = summary_output[0].get("summary_text", "")
            else:
                summary_text = str(summary_output)
            
            logger.info(f"Summary generated (length: {len(summary_text)} chars)")
            
        except Exception as e:
            logger.error(f"Summarization failed: {e}")
            # If summarization fails, still return transcript
            summary_text = "Summary generation failed"
        
        # Step 6: Create summary record in Supabase
        summary_id = str(uuid.uuid4())
        summary_data = {
            "id": summary_id,
            "user_id": str(user_uuid) if user_uuid else None,
            "transcript_id": transcript_id,
            "summary_text": summary_text,
            "method": "IndicBARTSS",
            "key_points": None,  # Could be extracted in future
            "action_items": None,  # Could be extracted in future
        }
        
        try:
            result = supabase.table("summaries").insert(summary_data).execute()
            logger.info(f"✅ Summary saved with id: {summary_id}")
        except Exception as e:
            logger.error(f"Failed to save summary: {e}")
            # Transcript is already saved, so don't fail completely
            pass
        
        # Cleanup: Remove temporary audio file
        if audio_path and os.path.exists(audio_path):
            try:
                os.remove(audio_path)
                logger.info("Cleaned up temporary audio file")
            except Exception as e:
                logger.warning(f"Failed to delete temp file: {e}")
        
        return ProcessResponse(
            transcript_id=transcript_id,
            summary_id=summary_id,
            transcript=transcript_text,
            summary=summary_text,
            language=lang,
            message="Processing completed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        # Cleanup on error
        if audio_path and os.path.exists(audio_path):
            try:
                os.remove(audio_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "whisper_loaded": whisper_model is not None,
        "summarizer_loaded": summarizer is not None,
        "supabase_connected": SUPABASE_URL is not None,
    }


# Only for local test; Render uses its own start command
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)

