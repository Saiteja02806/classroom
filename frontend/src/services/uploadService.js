import { supabase, supabaseUrl } from '../lib/supabase'

// Backend API URL - adjust based on environment
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

/**
 * Upload audio file to Supabase Storage
 * @param {File} file - The audio file to upload
 * @param {string} userId - The authenticated user's UUID
 * @returns {Promise<string|null>} File name/key if successful, null if failed
 */
export async function uploadAudio(file, userId) {
  try {
    if (!file || !userId) {
      throw new Error('File and userId are required')
    }

    // Generate unique file name
    const fileName = `${userId}_${Date.now()}.${file.name.split('.').pop() || 'webm'}`

    const { data, error } = await supabase.storage
      .from('audio-uploads')
      .upload(fileName, file)

    if (error) {
      console.error('Upload failed:', error)
      return null
    }

    console.log('Uploaded file:', data)
    return fileName
  } catch (err) {
    console.error('Error uploading audio:', err)
    return null
  }
}

/**
 * Generate a signed URL for an uploaded file
 * This URL lets your backend download the file securely
 * @param {string} fileName - The file name/key in Supabase Storage
 * @param {number} expiresIn - Expiration time in seconds (default: 10 minutes)
 * @returns {Promise<string|null>} Signed URL if successful, null if failed
 */
export async function getSignedUrl(fileName, expiresIn = 60 * 10) {
  try {
    if (!fileName) {
      throw new Error('FileName is required')
    }

    const { data, error } = await supabase.storage
      .from('audio-uploads')
      .createSignedUrl(fileName, expiresIn)

    if (error) {
      console.error('Error creating signed URL:', error)
      return null
    }

    console.log('Signed URL:', data.signedUrl)
    return data.signedUrl
  } catch (err) {
    console.error('Error generating signed URL:', err)
    return null
  }
}

/**
 * Process audio using signed URL
 * Sends signed URL to backend for processing
 * @param {string} fileName - The file name/key in Supabase Storage
 * @param {string} userId - The authenticated user's UUID
 * @param {Object} options - Processing options
 * @param {string} options.forceOutputLanguage - Force language ('te', 'en', or 'auto')
 * @param {number} options.maxLength - Maximum summary length
 * @param {number} options.minLength - Minimum summary length
 * @returns {Promise<Object>} Processing result with transcript and summary
 */
export async function processAudio(fileName, userId, options = {}) {
  try {
    if (!fileName || !userId) {
      throw new Error('FileName and userId are required')
    }

    // Step 1: Generate signed URL
    const signedUrl = await getSignedUrl(fileName)
    if (!signedUrl) {
      throw new Error('Failed to generate signed URL')
    }

    console.log('✅ Signed URL generated, sending to backend...')

    // Step 2: Send signed URL to backend
    const response = await fetch(`${BACKEND_URL}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        audioUrl: signedUrl,
        file_key: fileName, // Also send file_key for backend reference
        force_output_language: options.forceOutputLanguage || 'auto',
        max_length: options.maxLength || 120,
        min_length: options.minLength || 20,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Processing error:', errorText)
      throw new Error(`Backend processing failed: ${errorText}`)
    }

    const result = await response.json()
    console.log('✅ Processing completed:', result)

    return {
      success: true,
      fileKey: fileName,
      transcriptId: result.transcript_id,
      summaryId: result.summary_id,
      transcript: result.transcript,
      summary: result.summary,
      language: result.language,
      message: result.message,
    }
  } catch (error) {
    console.error('Error in processAudio:', error)
    throw error
  }
}

/**
 * Upload audio file to Supabase Storage and trigger processing
 * Complete flow: Upload → Generate Signed URL → Process
 * @param {File} file - The audio file to upload
 * @param {string} userId - The authenticated user's UUID
 * @param {Object} options - Processing options
 * @param {string} options.forceOutputLanguage - Force language ('te', 'en', or 'auto')
 * @param {number} options.maxLength - Maximum summary length
 * @param {number} options.minLength - Minimum summary length
 * @returns {Promise<Object>} Processing result with transcript and summary
 */
export async function uploadAudioAndProcess(file, userId, options = {}) {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided')
    }

    // Step 1: Upload file to Supabase Storage
    const fileName = await uploadAudio(file, userId)
    if (!fileName) {
      throw new Error('Failed to upload file to Supabase Storage')
    }

    console.log('✅ File uploaded successfully:', fileName)

    // Step 2: Process audio using signed URL
    return await processAudio(fileName, userId, options)
  } catch (error) {
    console.error('Error in uploadAudioAndProcess:', error)
    throw error
  }
}

/**
 * Get processing status (can be extended for async processing)
 * @param {string} transcriptId - The transcript ID to check
 * @returns {Promise<Object>} Status information
 */
export async function getProcessingStatus(transcriptId) {
  try {
    const { data, error } = await supabase
      .from('transcripts')
      .select('*, summaries(*)')
      .eq('id', transcriptId)
      .single()

    if (error) throw error

    return {
      transcript: data,
      summary: data.summaries?.[0] || null,
    }
  } catch (error) {
    console.error('Error fetching status:', error)
    throw error
  }
}

/**
 * List user's transcripts and summaries
 * @param {string} userId - The authenticated user's UUID
 * @returns {Promise<Array>} List of transcripts with summaries
 */
export async function getUserTranscripts(userId) {
  try {
    const { data, error } = await supabase
      .from('transcripts')
      .select('*, summaries(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching user transcripts:', error)
    throw error
  }
}

/**
 * Delete a transcript and its associated summary
 * @param {string} transcriptId - The transcript ID to delete
 * @param {string} userId - The authenticated user's UUID (for authorization)
 * @returns {Promise<boolean>} Success status
 */
export async function deleteTranscript(transcriptId, userId) {
  try {
    // First, get the transcript to verify ownership
    const { data: transcript, error: fetchError } = await supabase
      .from('transcripts')
      .select('user_id, summaries(*)')
      .eq('id', transcriptId)
      .single()

    if (fetchError) throw fetchError

    // Verify ownership
    if (transcript.user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own transcripts')
    }

    // Delete summary first (foreign key constraint)
    if (transcript.summaries && transcript.summaries.length > 0) {
      const summaryIds = transcript.summaries.map((s) => s.id)
      const { error: summaryError } = await supabase
        .from('summaries')
        .delete()
        .in('id', summaryIds)

      if (summaryError) throw summaryError
    }

    // Delete transcript
    const { error: transcriptError } = await supabase
      .from('transcripts')
      .delete()
      .eq('id', transcriptId)

    if (transcriptError) throw transcriptError

    return true
  } catch (error) {
    console.error('Error deleting transcript:', error)
    throw error
  }
}

