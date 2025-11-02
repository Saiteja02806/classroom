# AI Telugu Summarization App

A full-stack application for transcribing and summarizing audio in Telugu (and other languages) using AI.

## 📁 Project Structure

```
classroom/
├── frontend/                 # React + Vite frontend (root directory)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Python FastAPI backend
│   ├── app.py
│   ├── requirements.txt
│   └── render.yaml
├── docs/                     # Documentation
└── README.md
```

## 🚀 Quick Start

### Frontend (Local Development)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Backend (Local Development)

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Supabase (Auth & Storage)
- React Router

### Backend
- FastAPI
- faster-whisper (Transcription)
- IndicBARTSS (Summarization)
- Supabase (Database & Storage)

## 📚 Documentation

All documentation is in the `docs/` folder:

- **Setup Guides:**
  - [Supabase Setup](docs/SUPABASE_SETUP.md)
  - [Quick Start Guide](docs/QUICK_START.md)

- **Deployment:**
  - [Render Deployment Guide](docs/RENDER_DEPLOYMENT.md)
  - [Backend Setup on Render](docs/RENDER_BACKEND_SETUP_GUIDE.md)
  - [Build Commands](docs/RENDER_BUILD_COMMANDS.md)

- **Application:**
  - [Application Flow](docs/APPLICATION_FLOW.md)
  - [Homepage Setup](docs/HOMEPAGE_SETUP.md)

- **Troubleshooting:**
  - [Error Analysis](docs/RENDER_ERROR_ANALYSIS.md)
  - [Critical Fixes](docs/CRITICAL_FIXES.md)

## 🌐 Deployment

### Frontend (Render/Vercel/Netlify)

- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:** `VITE_*` prefixed

### Backend (Render)

- **Root Directory:** `backend`
- **Build Command:** `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt`
- **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`

See [docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md) for detailed instructions.

## 🔐 Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your_anon_key
VITE_BACKEND_URL=https://your-backend.onrender.com
```

### Backend (backend/.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
WHISPER_MODEL=tiny
SUMMARIZER_MODEL=ai4bharat/IndicBARTSS
BUCKET_NAME=audio-uploads
PORT=8000
```

## 📝 Features

- ✅ User Authentication (Supabase Auth)
- ✅ Audio Recording & Upload
- ✅ Speech-to-Text (Whisper)
- ✅ AI Summarization (IndicBARTSS)
- ✅ Telugu Language Support
- ✅ Transcript & Summary History
- ✅ Secure File Storage (Supabase Storage)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 🔗 Links

- **GitHub Repository:** https://github.com/Saiteja02806/classroom
- **Supabase Dashboard:** https://supabase.com/dashboard

## 📞 Support

For issues and questions, check the [docs/](docs/) folder or open an issue on GitHub.

---

**Built with ❤️ using React, FastAPI, and Supabase**
