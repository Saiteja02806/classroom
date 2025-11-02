import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { uploadAudioAndProcess, getUserTranscripts, deleteTranscript } from '../services/uploadService'
import {
  Mic,
  Square,
  Upload,
  Loader,
  Play,
  Pause,
  Trash2,
  FileAudio,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Sparkles,
} from 'lucide-react'

export const HomepageRecorder = () => {
  const { user, loading: authLoading } = useAuth()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState('auto')
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const audioPlayerRef = useRef(null)

  // Load user's history on mount
  useEffect(() => {
    if (user?.id && !authLoading) {
      loadHistory()
    }
  }, [user, authLoading])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [audioUrl])

  const loadHistory = async () => {
    try {
      const transcripts = await getUserTranscripts(user.id)
      setHistory(transcripts)
    } catch (err) {
      console.error('Failed to load history:', err)
    }
  }

  const startRecording = async () => {
    try {
      setError(null)
      setResult(null)
      setAudioBlob(null)
      setAudioUrl(null)

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleFileUpload = async (file) => {
    if (!user?.id) {
      setError('Please log in to upload audio')
      return
    }

    if (!file) {
      setError('Please select a file')
      return
    }

    // Validate file type
    const validTypes = ['audio/webm', 'audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(webm|mp3|wav|ogg|m4a)$/i)) {
      setError('Please upload a valid audio file (webm, mp3, wav, ogg, m4a)')
      return
    }

    setError(null)
    setResult(null)
    setIsProcessing(true)
    setProcessingProgress('Uploading audio file...')

    try {
      const result = await uploadAudioAndProcess(file, user.id, {
        forceOutputLanguage: selectedLanguage === 'auto' ? undefined : selectedLanguage,
        maxLength: 120,
        minLength: 20,
      })

      setResult(result)
      setProcessingProgress('')
      setIsProcessing(false)
      
      // Reload history
      await loadHistory()
      
      // Clear audio blob if we had one
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
        setAudioBlob(null)
      }
    } catch (err) {
      console.error('Processing error:', err)
      setError(err.message || 'Failed to process audio. Please try again.')
      setIsProcessing(false)
      setProcessingProgress('')
    }
  }

  const handleProcessRecording = () => {
    if (!audioBlob) {
      setError('No recording to process')
      return
    }

    const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
      type: 'audio/webm',
    })
    handleFileUpload(file)
  }

  const handleDelete = async (transcriptId) => {
    if (!confirm('Are you sure you want to delete this transcript?')) {
      return
    }

    try {
      await deleteTranscript(transcriptId, user.id)
      await loadHistory()
      // Clear result if it's the deleted one
      if (result?.transcriptId === transcriptId) {
        setResult(null)
      }
    } catch (err) {
      setError(err.message || 'Failed to delete transcript')
    }
  }

  const togglePlayback = () => {
    if (!audioUrl || !audioPlayerRef.current) return

    if (isPlaying) {
      audioPlayerRef.current.pause()
    } else {
      audioPlayerRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to use the audio recorder and summarization feature.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Telugu Summarization
          </h1>
          <p className="text-gray-600">
            Record or upload audio to get instant transcriptions and AI-powered summaries
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recorder & Upload */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recording Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary-600" />
                Record Audio
              </h2>

              <div className="space-y-4">
                {/* Recording Controls */}
                <div className="flex items-center justify-center gap-4">
                  {!isRecording && !audioBlob && (
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
                    >
                      <Mic className="w-5 h-5" />
                      Start Recording
                    </button>
                  )}

                  {isRecording && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-red-500 animate-pulse"></div>
                          </div>
                          <Square className="w-8 h-8 text-white absolute inset-0 m-auto" />
                        </div>
                        <div className="text-3xl font-mono font-bold text-gray-900">
                          {formatTime(recordingTime)}
                        </div>
                      </div>
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors font-medium"
                      >
                        <Square className="w-5 h-5" />
                        Stop Recording
                      </button>
                    </div>
                  )}

                  {audioBlob && !isRecording && (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="flex items-center gap-4 w-full">
                        <audio
                          ref={audioPlayerRef}
                          src={audioUrl}
                          onEnded={() => setIsPlaying(false)}
                          className="hidden"
                        />
                        <button
                          onClick={togglePlayback}
                          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                          {isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <button
                          onClick={() => {
                            setAudioBlob(null)
                            setAudioUrl(null)
                            if (audioUrl) URL.revokeObjectURL(audioUrl)
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <button
                        onClick={handleProcessRecording}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Process Recording
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-600" />
                Upload Audio File
              </h2>

              <div className="space-y-4">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Output Language (Optional)
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="auto">Auto-detect</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Audio File
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file)
                        }}
                        className="hidden"
                        disabled={isProcessing}
                      />
                      <div className="px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-gray-600">Click to select audio file</span>
                        <p className="text-xs text-gray-500 mt-1">
                          Supports: webm, mp3, wav, ogg, m4a
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <Loader className="w-8 h-8 animate-spin text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Processing Audio</h3>
                    <p className="text-sm text-gray-600">{processingProgress}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-900">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Display */}
            {result && (
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Results
                  </h2>
                  <span className="text-sm text-gray-500">
                    Language: <span className="font-medium">{result.language}</span>
                  </span>
                </div>

                {/* Transcript */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Transcript
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <p className="text-gray-800 whitespace-pre-wrap">{result.transcript}</p>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Summary
                  </h3>
                  <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{result.summary}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-600" />
                History
              </h2>

              {history.length === 0 ? (
                <div className="text-center py-8">
                  <FileAudio className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No recordings yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
                      onClick={() => {
                        setResult({
                          transcriptId: item.id,
                          summaryId: item.summaries?.[0]?.id,
                          transcript: item.transcript_text,
                          summary: item.summaries?.[0]?.summary_text || 'No summary available',
                          language: item.language || 'unknown',
                        })
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.transcript_text?.substring(0, 50)}...
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500 capitalize">
                              {item.language || 'unknown'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                          }}
                          className="text-red-600 hover:text-red-700 p-1"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

