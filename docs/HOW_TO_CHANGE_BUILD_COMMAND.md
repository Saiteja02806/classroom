# 🔧 How to Change Build Command in Render

## ⚠️ Important: You Need TWO Separate Services!

You currently have:
- **Frontend Service** → `npm install; npm run build` ✅ **Keep this!**

You need to CREATE:
- **Backend Service** → `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt` ✅ **New service!**

---

## 🎯 Option 1: Create NEW Backend Service (Recommended)

**Don't change your existing frontend service!**

Instead, create a **SECOND service** for the backend:

### Steps:

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Click "New +"** (top right)

3. **Select "Web Service"**

4. **Connect same repository:**
   - Repository: `Saiteja02806/classroom`
   - Branch: `main`

5. **Configure as BACKEND:**
   ```
   Name: classroom-backend
   Environment: Python 3
   Root Directory: backend
   Build Command: apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
   Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
   ```

6. **Add Environment Variables** (see other guide)

7. **Click "Create Web Service"**

**Result:** You'll have 2 services:
- `classroom-frontend` → Frontend (React)
- `classroom-backend` → Backend (Python)

---

## 🎯 Option 2: If You Only Have ONE Service

If you only created ONE service and it has `npm install; npm run build`:

### You have TWO choices:

#### Choice A: Keep it as Frontend, Create New Backend
- Keep current service as frontend
- Create new service for backend (follow Option 1 above)

#### Choice B: Convert to Backend (NOT Recommended)
- You'll lose frontend deployment
- Better to have both services

---

## 🔍 How to Check Your Current Service

1. **Go to Render Dashboard**
2. **Click on your service**
3. **Check "Build & Deploy" tab:**

**If you see:**
- `npm install; npm run build` → This is **FRONTEND** ✅ Keep it!
- `uvicorn` or Python → This is **BACKEND**

---

## 📝 How to Edit Build Command (If Needed)

If you need to **edit** an existing service:

1. **Click on your service** in Render Dashboard

2. **Go to "Settings" tab**

3. **Scroll to "Build & Deploy" section**

4. **Find "Build Command" field**

5. **Edit the command:**
   ```
   For Frontend: npm install && npm run build
   For Backend: apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
   ```

6. **Click "Save Changes"**

7. **Render will auto-redeploy**

---

## ✅ Recommended Setup: TWO Services

### Service 1: Frontend (Static Site)
```
Name: classroom-frontend
Type: Static Site
Build Command: npm install && npm run build
Publish Directory: dist
```

### Service 2: Backend (Web Service)
```
Name: classroom-backend
Type: Web Service
Environment: Python 3
Root Directory: backend
Build Command: apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
```

---

## 🚀 Quick Action Steps

### If you have Frontend service already:

1. ✅ **Keep it as-is** (don't change `npm install; npm run build`)

2. ✅ **Create NEW service:**
   - Click "New +" → "Web Service"
   - Use settings from Option 1 above

3. ✅ **Result:** Two working services!

### If you want to change existing service:

1. ❌ **DON'T change frontend to backend** (you'll break frontend)

2. ✅ **CREATE a new backend service instead**

---

## 📊 Service Type Comparison

| Field | Frontend Service | Backend Service |
|-------|------------------|-----------------|
| **Type** | Static Site | Web Service |
| **Environment** | Node.js | Python 3 |
| **Build Command** | `npm install && npm run build` | `apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt` |
| **Start Command** | (Auto) | `uvicorn app:app --host 0.0.0.0 --port $PORT` |
| **Root Directory** | `.` (root) | `backend` |
| **Output** | `dist` folder | Running server |

---

## ⚠️ Common Mistakes to Avoid

### ❌ WRONG:
```
One service with: npm install && apt-get update...
```
→ This won't work! They're different languages.

### ❌ WRONG:
```
Change frontend service to use pip install
```
→ This will break your frontend!

### ✅ CORRECT:
```
Service 1: Frontend → npm install && npm run build
Service 2: Backend → apt-get update && apt-get install -y ffmpeg && pip install -r requirements.txt
```

---

## 🎯 Your Action Plan

1. **Check what you have:**
   - How many services do you have?
   - What build commands are set?

2. **If you have frontend service:**
   - ✅ Keep it unchanged
   - ✅ Create NEW backend service

3. **If you only want backend:**
   - ❌ Don't convert frontend
   - ✅ Delete frontend service (if not needed)
   - ✅ Create backend service

4. **Deploy both:**
   - Frontend URL → For users
   - Backend URL → Update `VITE_BACKEND_URL` in frontend

---

## 📞 Still Confused?

**Answer these questions:**

1. **Do you want to deploy the frontend (React app)?**
   - YES → Keep frontend service with `npm install; npm run build`
   - NO → You can skip frontend service

2. **Do you want to deploy the backend (Python API)?**
   - YES → Create backend service with FFmpeg command
   - NO → Skip backend

**Most likely:** You want BOTH, so you need TWO services!

---

## ✅ Summary

**The service with `npm install; npm run build` is your FRONTEND - don't change it!**

**Create a NEW service for the BACKEND with the FFmpeg command.**

You'll end up with 2 separate services, each with their own build commands.

Good luck! 🚀

