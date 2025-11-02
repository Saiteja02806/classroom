# 📁 Project Structure

## Directory Organization

```
classroom/
│
├── 📱 FRONTEND (React + Vite)
│   ├── src/                    # Frontend source code
│   │   ├── components/          # React components
│   │   ├── contexts/           # React contexts (Auth)
│   │   ├── lib/                 # Utilities (Supabase client)
│   │   ├── services/           # API services
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   │
│   ├── public/                  # Static assets (if any)
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── postcss.config.js       # PostCSS config
│
├── ⚙️ BACKEND (Python FastAPI)
│   └── backend/
│       ├── app.py              # FastAPI application
│       ├── requirements.txt    # Python dependencies
│       ├── render.yaml         # Render deployment config
│       ├── .env.example        # Environment variables template
│       └── README.md           # Backend documentation
│
├── 📚 DOCUMENTATION
│   └── docs/
│       ├── APPLICATION_FLOW.md
│       ├── AUTH_IMPROVEMENTS.md
│       ├── CRITICAL_FIXES.md
│       ├── GITHUB_SETUP.md
│       ├── HOMEPAGE_SETUP.md
│       ├── HOW_TO_CHANGE_BUILD_COMMAND.md
│       ├── QUICK_START.md
│       ├── RENDER_BACKEND_SETUP_GUIDE.md
│       ├── RENDER_BUILD_COMMANDS.md
│       ├── RENDER_DEPLOYMENT.md
│       ├── RENDER_ERROR_ANALYSIS.md
│       ├── RENDER_ERROR_REPORT.md
│       ├── RENDER_START_COMMANDS.md
│       ├── SIGNED_URL_EXPLANATION.md
│       ├── SUPABASE_CONNECTION_PROOF.md
│       └── SUPABASE_SETUP.md
│
├── 📄 ROOT FILES
│   ├── README.md               # Main project README
│   ├── PROJECT_STRUCTURE.md   # This file
│   ├── .gitignore             # Git ignore rules
│   └── package.json           # Frontend package.json
│
└── 🔒 IGNORED (Not in Git)
    ├── node_modules/          # Frontend dependencies
    ├── dist/                  # Frontend build output
    ├── .env                   # Environment variables
    ├── backend/.env           # Backend env vars
    └── __pycache__/          # Python cache
```

## 🎯 Frontend Structure

**Root Directory:** `.` (project root)

**Purpose:** React + Vite application

**Key Files:**
- `package.json` - Dependencies and scripts
- `vite.config.js` - Vite configuration
- `index.html` - HTML entry point
- `src/` - Source code

**For Render (Static Site):**
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

---

## ⚙️ Backend Structure

**Root Directory:** `backend/`

**Purpose:** Python FastAPI application

**Key Files:**
- `app.py` - Main FastAPI app
- `requirements.txt` - Python dependencies
- `render.yaml` - Render deployment config (optional)

**For Render (Web Service):**
- Root Directory: `backend`
- Build Command: `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt`
- Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

---

## 📚 Documentation Structure

All documentation files are in `docs/` folder:

**Setup Guides:**
- `SUPABASE_SETUP.md` - Supabase configuration
- `QUICK_START.md` - Quick start guide
- `GITHUB_SETUP.md` - GitHub repository setup

**Deployment:**
- `RENDER_DEPLOYMENT.md` - Complete deployment guide
- `RENDER_BACKEND_SETUP_GUIDE.md` - Backend setup steps
- `RENDER_BUILD_COMMANDS.md` - Build commands explained
- `RENDER_START_COMMANDS.md` - Start commands guide
- `HOW_TO_CHANGE_BUILD_COMMAND.md` - How to change commands

**Application:**
- `APPLICATION_FLOW.md` - App flow explanation
- `HOMEPAGE_SETUP.md` - Homepage component setup
- `AUTH_IMPROVEMENTS.md` - Authentication features

**Troubleshooting:**
- `RENDER_ERROR_ANALYSIS.md` - Complete error analysis
- `RENDER_ERROR_REPORT.md` - Error report summary
- `CRITICAL_FIXES.md` - Critical fixes needed
- `SIGNED_URL_EXPLANATION.md` - Signed URLs explained
- `SUPABASE_CONNECTION_PROOF.md` - Connection verification

---

## 🔄 Deployment Flow

### GitHub → Render (Frontend)
```
1. Push code to GitHub
2. Render detects changes
3. Runs: npm install && npm run build
4. Publishes dist/ folder
5. Frontend live!
```

### GitHub → Render (Backend)
```
1. Push code to GitHub
2. Render detects changes
3. Runs: apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
4. Starts: uvicorn app:app --host 0.0.0.0 --port $PORT
5. Backend live!
```

---

## 📋 File Locations for Render

### Frontend Service (Static Site)
- **Root Directory:** `.` (project root)
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Config Files:** `vite.config.js`, `package.json`

### Backend Service (Web Service)
- **Root Directory:** `backend`
- **Build Command:** `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt`
- **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
- **Config Files:** `backend/requirements.txt`, `backend/app.py`

---

## ✅ This Structure Is Optimized For:

1. **GitHub:** Clear separation of frontend/backend
2. **Render:** Easy to configure separate services
3. **Development:** Organized and maintainable
4. **Documentation:** All docs in one place
5. **Deployment:** Each service has its own config

---

## 🚀 Quick Commands

### Development
```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

### Production Build
```bash
# Frontend
npm run build

# Backend (handled by Render)
# No manual build needed
```

---

This structure ensures:
- ✅ Clear separation of concerns
- ✅ Easy deployment configuration
- ✅ Organized documentation
- ✅ Maintainable codebase
- ✅ GitHub-friendly structure

