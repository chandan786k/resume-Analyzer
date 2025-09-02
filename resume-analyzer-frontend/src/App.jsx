import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'


  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
      const allowedExtensions = ['pdf', 'doc', 'docx']
      
      if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
        setError('Please upload a PDF, DOC, or DOCX file.')
        return
      }
      
      setFile(selectedFile)
      setError(null)
      setResult(null)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred while uploading the file.')
    } finally {
      setUploading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="app">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1>📄 Resume Analyzer</h1>
            <p>Upload your resume file to extract and analyze its content</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="upload-section">
            <div
              className={`upload-area ${dragActive ? 'dragover' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📁</div>
              <h3>Drop your resume here or click to browse</h3>
              <p>Supports PDF, DOC, and DOCX files</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>

            {file && (
              <div className="file-info">
                <div className="file-info-item">
                  <span className="file-info-label">File Name</span>
                  <span className="file-info-value">{file.name}</span>
                </div>
                <div className="file-info-item">
                  <span className="file-info-label">File Size</span>
                  <span className="file-info-value">{formatFileSize(file.size)}</span>
                </div>
                <div className="file-info-item">
                  <span className="file-info-label">File Type</span>
                  <span className="file-info-value">{file.type || 'Unknown'}</span>
                </div>
              </div>
            )}

            <div className="actions">
              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    📤 Upload & Analyze
                  </>
                )}
              </button>
              
              {file && (
                <button
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={uploading}
                >
                  🔄 Reset
                </button>
              )}
            </div>
          </div>

          {result && (
            <div className="results-container">
              <h2>Analysis Results</h2>
              
              <div className="alert alert-success">
                <strong>Success!</strong> {result.message}
              </div>

              <div className="file-info">
                <div className="file-info-item">
                  <span className="file-info-label">File Type</span>
                  <span className="file-info-value">{result.file_type}</span>
                </div>
                <div className="file-info-item">
                  <span className="file-info-label">Text Length</span>
                  <span className="file-info-value">{result.file_size} characters</span>
                </div>
              </div>

              <h3>Extracted Text Preview</h3>
              <div className="text-preview">
                {result.text || 'No text could be extracted from this file type.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
