# Application Flow & Pages Guide

## 🔄 Complete User Journey

### **Flow Overview:**

```
1. Landing/Homepage (/) 
   ↓
2. Login Page (/login) - If not authenticated
   ↓
3. Signup Page (/signup) - If new user
   ↓
4. Homepage Recorder (/) - Main Application (Protected)
   ↓
5. Dashboard (/dashboard) - User Profile & Info (Protected)
```

---

## 📄 Pages & Components Created

### **1. Authentication Pages (Public)**

#### **A. Login Page** (`/login`)
**File:** `src/components/Login.jsx`

**Purpose:**
- Authenticate existing users
- Redirect to dashboard/homepage after successful login

**Features:**
- ✅ Email and password input fields
- ✅ Real-time email validation
- ✅ Password visibility toggle (show/hide)
- ✅ "Remember me" checkbox (UI only, can be implemented)
- ✅ "Forgot password?" link → `/forgot-password`
- ✅ Error handling with user-friendly messages
- ✅ Auto-redirect if already logged in
- ✅ Preserves intended destination (if redirected from protected route)

**User Flow:**
1. User enters email and password
2. Form validates inputs
3. Submits to Supabase Auth
4. If successful → Redirects to `/` (homepage) or intended destination
5. If error → Shows error message

**Key Features:**
- Email validation (regex pattern)
- Password strength checked by Supabase
- Email verification status checked
- Smart redirects preserve navigation history

---

#### **B. Signup Page** (`/signup`)
**File:** `src/components/Signup.jsx`

**Purpose:**
- Register new users
- Collect user information
- Send email verification

**Features:**
- ✅ Full name input
- ✅ Email input with validation
- ✅ Password input with strength requirements
- ✅ Password confirmation field
- ✅ Password visibility toggles for both fields
- ✅ Real-time validation feedback
- ✅ Success message after signup
- ✅ Auto-redirect to login after 3 seconds

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**User Flow:**
1. User fills all form fields
2. Real-time validation as user types
3. On submit, validates all fields
4. Creates account in Supabase
5. Shows success message with email verification reminder
6. Redirects to login page with success message

**Key Features:**
- Comprehensive field validation
- Field-level error messages
- Visual feedback (red borders on invalid fields)
- Prevents duplicate email signups

---

#### **C. Forgot Password Page** (`/forgot-password`)
**File:** `src/components/ForgotPassword.jsx`

**Purpose:**
- Reset password for users who forgot their password
- Send password reset email

**Features:**
- ✅ Email input field
- ✅ Submit button
- ✅ Success message after email sent
- ✅ Link back to login page
- ✅ Error handling

**User Flow:**
1. User enters email address
2. Clicks "Send Reset Link"
3. Supabase sends password reset email
4. Success message displayed
5. User clicks email link (opens reset password page)
6. User sets new password

**Note:** The actual password reset form is handled by Supabase (via email link redirect).

---

### **2. Protected Pages (Require Authentication)**

#### **A. Homepage/Recorder** (`/`) ⭐ **MAIN PAGE**
**File:** `src/components/HomepageRecorder.jsx`

**Purpose:**
- Main application interface
- Record audio, upload files, and get AI summaries
- **This is the core feature of your app**

**Features:**

**🔴 Audio Recording:**
- Start/Stop recording with microphone
- Real-time recording timer (MM:SS format)
- Visual recording indicator (pulsing red dot)
- Audio playback of recorded audio
- Clear recording option

**📤 File Upload:**
- Drag & drop file upload area
- Supports: webm, mp3, wav, ogg, m4a
- Language selection (Auto-detect, Telugu, English)
- Automatic upload and processing

**⚙️ Processing:**
- Shows processing status ("Uploading...", "Processing...")
- Progress indicators with spinner
- Error handling with clear messages

**📊 Results Display:**
- **Transcript Section:** Full transcription of audio
- **AI Summary Section:** AI-generated summary in colored box
- Language detection display
- Clean, organized layout

**📜 History Sidebar:**
- Shows all previous recordings/transcripts
- Click to view past results
- Delete functionality (with confirmation)
- Shows date and language
- Scrollable list

**User Flow:**
1. User logs in → Lands on this page
2. **Option A:** Records audio
   - Click "Start Recording"
   - Speak into microphone
   - Click "Stop Recording"
   - Review recording (optional)
   - Click "Process Recording"
3. **Option B:** Uploads file
   - Click file upload area
   - Select audio file
   - File automatically uploads and processes
4. **Processing:**
   - File uploads to Supabase Storage (`audio-uploads` bucket)
   - Backend API called (POST `/process`)
   - Whisper transcribes audio
   - IndicBARTSS generates summary
   - Results saved to Supabase database
5. **Results:**
   - Transcript displayed
   - Summary displayed
   - Added to history sidebar
6. **History:**
   - Click any history item to view its results
   - Delete unwanted items

**Key Features:**
- Responsive design (works on mobile)
- Beautiful UI with cards and gradients
- Real-time status updates
- Error handling throughout
- Requires user authentication

---

#### **B. Dashboard Page** (`/dashboard`)
**File:** `src/components/Dashboard.jsx`

**Purpose:**
- User profile information
- Connection status verification
- Sign out functionality

**Features:**
- ✅ User profile display
  - User ID
  - Email address
  - Full name (if available)
- ✅ Supabase connection test
  - Shows connection status
  - Displays project URL
  - Shows auth system status
  - Shows database tables count
- ✅ Sign out button
- ✅ Welcome message

**User Flow:**
1. User navigates to `/dashboard`
2. Sees profile information
3. Can verify Supabase connection
4. Can sign out from here

**Key Features:**
- Connection status indicator
- User information display
- Quick access to sign out

---

## 🛡️ Supporting Components

### **A. ProtectedRoute Component**
**File:** `src/components/ProtectedRoute.jsx`

**Purpose:**
- Protects routes that require authentication
- Redirects unauthenticated users to login
- Shows loading state during auth check

**How it works:**
1. Checks if user is authenticated
2. Shows loading spinner while checking
3. If authenticated → Renders protected component
4. If not authenticated → Redirects to `/login` with return location

**Used by:**
- Homepage (`/`)
- Dashboard (`/dashboard`)

---

### **B. AuthContext**
**File:** `src/contexts/AuthContext.jsx`

**Purpose:**
- Provides authentication state to entire app
- Manages user session
- Provides auth methods (signIn, signUp, signOut, etc.)

**Available throughout app:**
- `user` - Current user object
- `session` - Current session
- `loading` - Auth loading state
- `signIn()` - Login function
- `signUp()` - Signup function
- `signOut()` - Logout function
- `resetPassword()` - Password reset function

---

## 📱 Complete User Journey Example

### **Scenario 1: New User**

```
1. User visits app → Redirected to /login
2. Clicks "Sign up for free" → Goes to /signup
3. Fills signup form → Account created
4. Redirected to /login with success message
5. Logs in → Redirected to / (Homepage Recorder)
6. Uses recorder/upload feature
7. Views results and history
```

### **Scenario 2: Returning User**

```
1. User visits app → Redirected to /login
2. Enters credentials → Logs in
3. Redirected to / (Homepage Recorder)
4. Uses app features
5. Navigates to /dashboard (optional)
6. Signs out when done
```

### **Scenario 3: Protected Route Access**

```
1. User not logged in
2. Tries to access / or /dashboard
3. Redirected to /login with "from" location saved
4. After login → Redirected back to intended page
```

---

## 🔗 Navigation Structure

```
/ (Homepage - Protected)
├── /login (Public)
├── /signup (Public)
├── /forgot-password (Public)
└── /dashboard (Protected)
```

**Navigation Links:**
- Login page → Links to signup and forgot password
- Signup page → Links to login
- Dashboard → Can navigate to homepage (via browser)
- All pages → Sign out available when authenticated

---

## 🎯 Key Features by Page

### **Authentication Pages:**
- ✅ Email validation
- ✅ Password strength requirements
- ✅ Password visibility toggles
- ✅ Error handling
- ✅ Success messages
- ✅ Smart redirects

### **Homepage Recorder:**
- ✅ Audio recording
- ✅ File upload
- ✅ Language selection
- ✅ Processing status
- ✅ Results display
- ✅ History management
- ✅ Delete functionality

### **Dashboard:**
- ✅ User profile
- ✅ Connection status
- ✅ Sign out

---

## 📋 Component Dependencies

**HomepageRecorder depends on:**
- `useAuth()` - For user authentication
- `uploadAudioAndProcess()` - From uploadService.js
- `getUserTranscripts()` - From uploadService.js
- `deleteTranscript()` - From uploadService.js
- Supabase client - For storage and database

**All pages depend on:**
- `AuthContext` - For authentication state
- `supabase` client - For auth and data
- React Router - For navigation

---

## 🚀 Quick Reference

### **Public Routes:**
- `/login` - Login page
- `/signup` - Signup page
- `/forgot-password` - Password reset

### **Protected Routes:**
- `/` - **Homepage Recorder (Main App)** ⭐
- `/dashboard` - User dashboard

### **Default Route:**
- Root (`/`) → Homepage Recorder (protected)

---

## ✅ Summary

**After Authentication, users land on:**

### **Homepage Recorder (`/`)** - **PRIMARY PAGE** ⭐

This is where the main functionality lives:
1. **Record audio** or **upload files**
2. **Process** through backend (Whisper + IndicBARTSS)
3. **View results** (transcript + summary)
4. **Manage history** of previous recordings

**Additional Pages:**
- `/dashboard` - User profile and connection status

The homepage recorder is the **core of your application** - it's where users interact with the AI summarization features after logging in!

