# Render Start Command Guide

## 📁 File Location

Your `app.py` is located at: **`/backend/app.py`** (inside the `backend` folder)

## ✅ Correct Render Configuration

### **Option 1: Root Directory = `backend` (RECOMMENDED)**

**Render Settings:**
```
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
```

**Why this works:**
- Render changes directory to `backend` first
- Then runs commands relative to `backend/`
- `app.py` is directly in `backend/`, so `uvicorn app:app` works

---

### **Option 2: Root Directory = `.` (root of repository)**

**Render Settings:**
```
Root Directory: .  (or leave blank)
Build Command: cd backend && pip install -r requirements.txt
Start Command: cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT
```

**OR using Python directly:**
```
Root Directory: .  (or leave blank)
Build Command: cd backend && pip install -r requirements.txt
Start Command: cd backend && python app.py
```

**Why this works:**
- Commands run from repository root
- `cd backend` navigates to backend folder first
- Then runs the command from `backend/` directory

---

## 🎯 Recommended Setup (Option 1)

**This is the simplest and cleanest:**

```
Service Name: classroom-backend
Environment: Python 3
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
```

---

## 🔍 Why `uvicorn app:app` works

- `app` (first) = file name `app.py` (without `.py`)
- `app` (second) = FastAPI instance variable (`app = FastAPI(...)`)
- This is the standard FastAPI production command

---

## 📝 Alternative: Using Python Directly

Since your `app.py` has:
```python
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

You CAN also use:

**Root Directory = `backend`:**
```
Start Command: python app.py
```

**Root Directory = `.`:**
```
Start Command: cd backend && python app.py
```

---

## ✅ Final Recommendation

**Use Option 1 with uvicorn directly:**

```
Root Directory: backend
Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
```

This is:
- ✅ Standard FastAPI practice
- ✅ More explicit and clear
- ✅ Better for production
- ✅ Easier to configure

---

## 🚨 Important Notes

1. **Root Directory matters!** Make sure it matches your file structure
2. **$PORT** is required - Render provides this automatically
3. **Host must be 0.0.0.0** - Allows external connections
4. **First deployment** takes 15-20 minutes (AI models download)

---

## 🔄 Quick Reference

| Root Directory | Start Command |
|----------------|---------------|
| `backend` | `uvicorn app:app --host 0.0.0.0 --port $PORT` |
| `.` | `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT` |
| `backend` | `python app.py` (also works) |
| `.` | `cd backend && python app.py` (also works) |

**Best choice:** Root Directory = `backend`, Start Command = `uvicorn app:app --host 0.0.0.0 --port $PORT`

