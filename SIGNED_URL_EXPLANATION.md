# Signed URLs Explained

## 🔐 What is a Signed URL?

A **signed URL** is a temporary, secure URL that provides time-limited access to a private file stored in cloud storage (like Supabase Storage). 

### Key Characteristics:
- ✅ **Temporary** - Expires after a set time (e.g., 10 minutes)
- ✅ **Secure** - Contains a cryptographic signature
- ✅ **No Authentication Required** - Anyone with the URL can access it (until expiry)
- ✅ **Time-Limited** - Cannot be used after expiration

---

## 🎯 Why Use Signed URLs?

### Problem:
- Files in Supabase Storage are **private** by default
- Your backend needs to download the file to process it
- But your backend doesn't have direct access to user's storage
- You can't make storage public (security risk)

### Solution:
**Signed URLs!** The frontend generates a temporary URL that:
1. Only works for a limited time
2. Allows the backend to download the file securely
3. Doesn't expose your storage credentials
4. Expires automatically

---

## 🔧 How Signed URLs Are Generated

### In Supabase Storage:

```javascript
const { data, error } = await supabase.storage
  .from('audio-uploads')           // Bucket name
  .createSignedUrl(fileName, 600)  // fileName + expiration (seconds)
```

### What Happens Behind the Scenes:

1. **Frontend sends request** to Supabase:
   - File name: `userId_timestamp.webm`
   - Expiration: 600 seconds (10 minutes)
   - Uses your **anon key** for authentication

2. **Supabase generates the URL**:
   ```
   https://[project].supabase.co/storage/v1/object/sign/audio-uploads/userId_timestamp.webm?token=CRYPTOGRAPHIC_SIGNATURE&expires=1234567890
   ```

3. **The URL contains**:
   - File path
   - Cryptographic token (signature)
   - Expiration timestamp
   - Access permissions

4. **URL is returned** to frontend

---

## 🔍 Anatomy of a Signed URL

### Example Signed URL:
```
https://dyphuthrtmgvaeoferbm.supabase.co/storage/v1/object/sign/audio-uploads/user123_1704123456789.webm?
  token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5cGh1dGhydG1ndmFlb2ZlcmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzUxODcsImV4cCI6MjA3NzY1MTE4N30...
  &expires=1704124056
```

### Breaking It Down:

1. **Base URL**: `https://[project].supabase.co/storage/v1/object/sign/`
2. **Bucket**: `audio-uploads`
3. **File Path**: `user123_1704123456789.webm`
4. **Token**: JWT token with signature
5. **Expires**: Unix timestamp when URL expires

---

## 🔐 How Security Works

### 1. **Cryptographic Signature**
- Supabase uses your **anon key** to create a JWT token
- The token includes:
  - File path
  - Expiration time
  - Permissions
  - Cryptographic signature

### 2. **Server Validation**
When someone tries to access the URL:
1. Supabase server receives the request
2. Extracts the token from URL
3. Validates the signature (using anon key)
4. Checks expiration time
5. Verifies file exists
6. If all valid → Returns file
7. If invalid/expired → Returns 403 Forbidden

### 3. **Time-Based Expiration**
- URL expires after set time (e.g., 10 minutes)
- Even if someone intercepts the URL, it becomes useless after expiry
- You control the expiration time

---

## 💻 Code Implementation

### In Your Project (`src/services/uploadService.js`):

```javascript
/**
 * Generate a signed URL for an uploaded file
 * @param {string} fileName - The file name/key in Supabase Storage
 * @param {number} expiresIn - Expiration time in seconds (default: 10 minutes)
 * @returns {Promise<string|null>} Signed URL if successful
 */
export async function getSignedUrl(fileName, expiresIn = 60 * 10) {
  try {
    if (!fileName) {
      throw new Error('FileName is required')
    }

    // Generate signed URL with Supabase
    const { data, error } = await supabase.storage
      .from('audio-uploads')           // Your bucket name
      .createSignedUrl(fileName, expiresIn)  // 600 seconds = 10 minutes

    if (error) {
      console.error('Error creating signed URL:', error)
      return null
    }

    console.log('Signed URL:', data.signedUrl)
    return data.signedUrl  // Returns the temporary URL
  } catch (err) {
    console.error('Error generating signed URL:', err)
    return null
  }
}
```

### How It's Used:

```javascript
// 1. Upload file
const fileName = await uploadAudio(audioFile, userId)
// Returns: "user123_1704123456789.webm"

// 2. Generate signed URL
const signedUrl = await getSignedUrl(fileName, 600)
// Returns: "https://...supabase.co/.../file.webm?token=...&expires=..."

// 3. Send to backend
const response = await fetch(`${BACKEND_URL}/process`, {
  method: 'POST',
  body: JSON.stringify({
    userId: userId,
    audioUrl: signedUrl,  // Backend downloads from this URL
    file_key: fileName     // For reference
  })
})
```

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  USER RECORDS/UPLOADS AUDIO FILE                        │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Frontend: uploadAudio(file, userId)                    │
│  - Uploads to Supabase Storage                          │
│  - Returns: fileName = "user123_1234567890.webm"        │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Frontend: getSignedUrl(fileName, 600)                  │
│  - Sends request to Supabase API                        │
│  - Supabase generates JWT token with:                   │
│    • File path                                          │
│    • Expiration (10 mins from now)                     │
│    • Cryptographic signature                            │
│  - Returns: signedUrl                                    │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Frontend: Sends signedUrl to Backend                   │
│  POST /process                                           │
│  {                                                       │
│    userId: "user123",                                   │
│    audioUrl: "https://...?token=...&expires=..."        │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Backend: Downloads from signedUrl                       │
│  - Makes GET request to signedUrl                       │
│  - Supabase validates:                                  │
│    ✓ Token signature valid?                             │
│    ✓ Not expired?                                       │
│    ✓ File exists?                                       │
│  - If valid → Returns file content                      │
│  - If invalid → Returns 403 Forbidden                   │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│  Backend: Processes audio (Whisper → IndicBARTSS)       │
│  - Saves transcript and summary                         │
│  - Returns results to frontend                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Benefits

### 1. **Security**
- ✅ Files stay private in storage
- ✅ No permanent public URLs
- ✅ Time-limited access
- ✅ Automatic expiration

### 2. **Flexibility**
- ✅ Backend doesn't need storage credentials
- ✅ Can control expiration time
- ✅ Works with any file type
- ✅ Works across different services

### 3. **Simplicity**
- ✅ One function call to generate
- ✅ Just send URL to backend
- ✅ Backend downloads like normal HTTP request

---

## ⚠️ Important Considerations

### 1. **Expiration Time**
```javascript
// Short expiration (good for quick processing)
createSignedUrl(fileName, 60)      // 1 minute

// Medium expiration (default for processing)
createSignedUrl(fileName, 600)     // 10 minutes

// Long expiration (use carefully)
createSignedUrl(fileName, 3600)    // 1 hour
```

**Best Practice**: Use the shortest time your backend needs to download + process.

### 2. **Security**
- ⚠️ Anyone with the URL can access it (until expiry)
- ⚠️ Don't log signed URLs in production
- ⚠️ Don't share signed URLs publicly
- ✅ URLs expire automatically

### 3. **Error Handling**
```javascript
const signedUrl = await getSignedUrl(fileName)
if (!signedUrl) {
  // Handle error: file might not exist, permissions issue, etc.
  throw new Error('Failed to generate signed URL')
}
```

---

## 🔄 Comparison: Signed URL vs Public URL

### Public URL (❌ Not Recommended):
```
https://project.supabase.co/storage/v1/object/public/audio-uploads/file.webm
```
- ❌ Anyone can access (no expiration)
- ❌ No security
- ❌ Permanent access
- ✅ Simple (no generation needed)

### Signed URL (✅ Recommended):
```
https://project.supabase.co/storage/v1/object/sign/audio-uploads/file.webm?token=...&expires=...
```
- ✅ Temporary access (expires)
- ✅ Secure (cryptographic signature)
- ✅ Time-limited
- ✅ Requires generation

---

## 📝 Summary

**Signed URL** = Temporary, secure URL that allows time-limited access to private files

**How it's generated:**
1. Frontend calls `supabase.storage.from(bucket).createSignedUrl(fileName, expiresIn)`
2. Supabase creates JWT token with file path, expiration, and signature
3. Returns URL with token embedded
4. URL works until expiration, then becomes invalid

**Why use it:**
- Keeps files private
- Allows secure backend access
- Automatic expiration
- No permanent exposure

**In your app:**
- Frontend uploads file → gets `fileName`
- Frontend generates signed URL → gets temporary `signedUrl`
- Frontend sends `signedUrl` to backend
- Backend downloads from `signedUrl` and processes

Perfect for your audio processing flow! 🎤✨

