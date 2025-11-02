# Supabase Setup Instructions

## Required Setup Steps

### 1. Create Storage Bucket: `audio-uploads`

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/dyphuthrtmgvaeoferbm
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"** or **"Create bucket"**
4. Configure the bucket:
   - **Name**: `audio-uploads`
   - **Public bucket**: ❌ **Unchecked** (Make it PRIVATE)
   - **File size limit**: Adjust as needed (e.g., 100MB)
   - **Allowed MIME types**: Leave empty or add: `audio/*, video/*`
5. Click **"Create bucket"**

### 2. Set Up Storage Policies (RLS)

After creating the bucket, set up Row Level Security policies:

1. In the Storage section, click on `audio-uploads` bucket
2. Go to **Policies** tab
3. Create policies:

#### Policy 1: Allow authenticated users to upload
```sql
CREATE POLICY "Users can upload audio files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio-uploads');
```

#### Policy 2: Allow users to read their own files
```sql
CREATE POLICY "Users can read their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'audio-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
```

#### Policy 3: Allow service_role to manage files (for backend)
```sql
-- This is usually handled automatically with service_role key
-- But you can verify service_role has access
```

**Or use the Supabase UI:**
1. Click **"New Policy"**
2. Select **"For full customization"**
3. Policy name: `Users can upload audio files`
4. Allowed operation: `INSERT`
5. Target roles: `authenticated`
6. USING expression: `bucket_id = 'audio-uploads'`
7. WITH CHECK expression: `bucket_id = 'audio-uploads'`

### 3. Verify Tables Exist

Your tables should already exist based on the connection test:

✅ **transcripts** table - Already exists
✅ **summaries** table - Already exists

### 4. Get Service Role Key

**Important**: The service role key has admin access. Keep it secret!

1. Go to **Settings** → **API** in Supabase Dashboard
2. Copy the **service_role key** (not the anon key)
3. Update `backend/.env` with:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### 5. Verify Database Structure

Run this SQL in Supabase SQL Editor to verify structure:

```sql
-- Check transcripts table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'transcripts'
ORDER BY ordinal_position;

-- Check summaries table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'summaries'
ORDER BY ordinal_position;
```

Expected structure:

**transcripts:**
- id (text, NOT NULL)
- user_id (uuid, nullable)
- transcript_text (text, NOT NULL)
- language (text, default 'te')
- confidence (real, nullable)
- duration (real, nullable)
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

**summaries:**
- id (text, NOT NULL)
- user_id (uuid, nullable)
- transcript_id (text, nullable)
- summary_text (text, NOT NULL)
- key_points (text[], nullable)
- action_items (text[], nullable)
- method (text, default 'unknown')
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

## Quick Verification Checklist

- [ ] Storage bucket `audio-uploads` created (PRIVATE)
- [ ] RLS policies configured for authenticated users
- [ ] Service role key copied to `backend/.env`
- [ ] Tables `transcripts` and `summaries` exist with correct structure
- [ ] Backend can connect to Supabase (test with health endpoint)

## Testing Storage Upload

You can test the storage bucket manually:

```javascript
// In browser console or frontend code
const { data, error } = await supabase.storage
  .from('audio-uploads')
  .upload('test/test-file.webm', file)

if (error) {
  console.error('Upload failed:', error)
} else {
  console.log('Upload successful:', data)
}
```

## Security Notes

1. **Service Role Key**: Never commit this to git. Always use `.env` file.
2. **Storage Bucket**: Keep it private. Only authenticated users should access.
3. **RLS Policies**: Ensure users can only access their own files.
4. **File Validation**: Consider adding file type and size validation in frontend.

## Troubleshooting

### "Bucket not found" error
- Verify bucket name is exactly `audio-uploads`
- Check bucket exists in Supabase Dashboard

### "Permission denied" error
- Verify RLS policies are set correctly
- Check service_role key is correct
- Ensure user is authenticated (for user uploads)

### "Storage API not available"
- Check Supabase project is active
- Verify project URL is correct
- Check if storage is enabled in your plan

