import { useState, useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
}

function NewsletterEditor({ newsletter, onSave, onCancel, onSend }) {
  const [subject, setSubject] = useState(newsletter?.subject || '')
  const [htmlContent, setHtmlContent] = useState(newsletter?.htmlContent || '')
  const [editorMode, setEditorMode] = useState('visual')
  const [rawHtml, setRawHtml] = useState(newsletter?.htmlContent || '')
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [scheduledAt, setScheduledAt] = useState(newsletter?.scheduledAt || '')
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (newsletter) {
      setSubject(newsletter.subject || '')
      setHtmlContent(newsletter.htmlContent || '')
      setRawHtml(newsletter.htmlContent || '')
      setScheduledAt(newsletter.scheduledAt || '')
    }
  }, [newsletter])

  const handleVisualChange = (content) => {
    setHtmlContent(content)
    setRawHtml(content)
  }

  const handleRawHtmlChange = (e) => {
    setRawHtml(e.target.value)
    setHtmlContent(e.target.value)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      alert('Please upload an HTML file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target.result
      setHtmlContent(content)
      setRawHtml(content)
      setEditorMode('html')
    }
    reader.readAsText(file)
  }

  const handleSave = async (status = 'draft') => {
    if (!subject.trim()) {
      alert('Please enter a subject')
      return
    }

    setSaving(true)
    try {
      await onSave({
        id: newsletter?.id,
        subject,
        htmlContent,
        status,
        scheduledAt: status === 'scheduled' ? scheduledAt : null
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSchedule = async () => {
    if (!subject.trim()) {
      alert('Please enter a subject')
      return
    }

    if (!htmlContent.trim()) {
      alert('Please add some content to the newsletter')
      return
    }

    if (!scheduledAt) {
      alert('Please select a date and time')
      return
    }

    const scheduleDate = new Date(scheduledAt)
    if (scheduleDate <= new Date()) {
      alert('Please select a future date and time')
      return
    }

    setSaving(true)
    try {
      await onSave({
        id: newsletter?.id,
        subject,
        htmlContent,
        status: 'scheduled',
        scheduledAt
      })
      setShowScheduleModal(false)
      alert(`Newsletter scheduled for ${scheduleDate.toLocaleString()}`)
    } finally {
      setSaving(false)
    }
  }

  const handleSend = async () => {
    if (!subject.trim()) {
      alert('Please enter a subject')
      return
    }

    if (!htmlContent.trim()) {
      alert('Please add some content to the newsletter')
      return
    }

    if (!confirm('Are you sure you want to send this newsletter to all subscribers NOW? This cannot be undone.')) {
      return
    }

    setSending(true)
    try {
      await onSave({
        id: newsletter?.id,
        subject,
        htmlContent,
        status: 'draft'
      })
      await onSend(newsletter?.id)
    } finally {
      setSending(false)
    }
  }

  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5)
    return now.toISOString().slice(0, 16)
  }

  const isSent = newsletter?.status === 'sent'
  const isScheduled = newsletter?.status === 'scheduled'

  return (
    <div className="newsletter-editor">
      <div className="editor-header">
        <h2>
          {newsletter?.id ? (isSent ? 'View Newsletter' : 'Edit Newsletter') : 'New Newsletter'}
          {isScheduled && <span className="scheduled-tag">Scheduled</span>}
        </h2>
        <div className="editor-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={saving || sending}>
            {isSent ? 'Back' : 'Cancel'}
          </button>
          {!isSent && (
            <>
              <button className="btn btn-primary" onClick={() => handleSave('draft')} disabled={saving || sending}>
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                className="btn btn-warning"
                onClick={() => setShowScheduleModal(true)}
                disabled={saving || sending}
              >
                Schedule
              </button>
              {newsletter?.id && (
                <button className="btn btn-success" onClick={handleSend} disabled={saving || sending}>
                  {sending ? 'Sending...' : 'Send Now'}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="editor-form">
        <div className="form-group">
          <label htmlFor="subject">Subject Line</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject..."
            disabled={isSent}
          />
        </div>

        {isScheduled && (
          <div className="schedule-info">
            <span className="schedule-icon">📅</span>
            Scheduled for: <strong>{new Date(newsletter.scheduledAt).toLocaleString()}</strong>
            <button
              className="btn-link"
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              Cancel Schedule
            </button>
          </div>
        )}

        <div className="editor-mode-tabs">
          <button
            className={`tab ${editorMode === 'visual' ? 'active' : ''}`}
            onClick={() => setEditorMode('visual')}
          >
            Visual Editor
          </button>
          <button
            className={`tab ${editorMode === 'html' ? 'active' : ''}`}
            onClick={() => setEditorMode('html')}
          >
            HTML Code
          </button>
          <button
            className={`tab ${editorMode === 'upload' ? 'active' : ''}`}
            onClick={() => setEditorMode('upload')}
          >
            Upload HTML
          </button>
          <button
            className={`tab ${editorMode === 'preview' ? 'active' : ''}`}
            onClick={() => setEditorMode('preview')}
          >
            Preview
          </button>
        </div>

        <div className="editor-content">
          {editorMode === 'visual' && (
            <ReactQuill
              theme="snow"
              value={htmlContent}
              onChange={handleVisualChange}
              modules={quillModules}
              placeholder="Write your newsletter content..."
              readOnly={isSent}
            />
          )}

          {editorMode === 'html' && (
            <textarea
              className="html-editor"
              value={rawHtml}
              onChange={handleRawHtmlChange}
              placeholder="Paste your HTML code here..."
              disabled={isSent}
            />
          )}

          {editorMode === 'upload' && (
            <div className="upload-zone">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".html,.htm"
                style={{ display: 'none' }}
                disabled={isSent}
              />
              <div
                className={`upload-area ${isSent ? 'disabled' : ''}`}
                onClick={() => !isSent && fileInputRef.current?.click()}
                onDragOver={(e) => !isSent && e.preventDefault()}
                onDrop={(e) => {
                  if (isSent) return
                  e.preventDefault()
                  const file = e.dataTransfer.files[0]
                  if (file) {
                    const event = { target: { files: [file] } }
                    handleFileUpload(event)
                  }
                }}
              >
                <div className="upload-icon">📄</div>
                <p>Click to upload or drag and drop</p>
                <p className="upload-hint">HTML files only (.html, .htm)</p>
              </div>
              {htmlContent && (
                <p className="upload-success">HTML content loaded! Switch to Preview to see it.</p>
              )}
            </div>
          )}

          {editorMode === 'preview' && (
            <div className="preview-container">
              <div className="preview-header">
                <strong>Subject:</strong> {subject || '(No subject)'}
              </div>
              <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: htmlContent || '<p>No content yet</p>' }}
              />
            </div>
          )}
        </div>

        {isSent && (
          <div className="sent-notice">
            This newsletter was sent on {new Date(newsletter.sentAt).toLocaleString()} to {newsletter.recipientCount} subscribers.
          </div>
        )}
      </div>

      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal schedule-modal" onClick={e => e.stopPropagation()}>
            <h3>Schedule Newsletter</h3>
            <p>Choose when to send "{subject || 'this newsletter'}"</p>

            <div className="form-group">
              <label htmlFor="scheduleDate">Send Date & Time</label>
              <input
                type="datetime-local"
                id="scheduleDate"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={getMinDateTime()}
              />
            </div>

            <div className="quick-schedule">
              <p>Quick options:</p>
              <div className="quick-buttons">
                <button onClick={() => {
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  tomorrow.setHours(9, 0, 0, 0)
                  setScheduledAt(tomorrow.toISOString().slice(0, 16))
                }}>Tomorrow 9 AM</button>
                <button onClick={() => {
                  const nextWeek = new Date()
                  nextWeek.setDate(nextWeek.getDate() + 7)
                  nextWeek.setHours(9, 0, 0, 0)
                  setScheduledAt(nextWeek.toISOString().slice(0, 16))
                }}>Next Week</button>
                <button onClick={() => {
                  const nextMonth = new Date()
                  nextMonth.setMonth(nextMonth.getMonth() + 1)
                  nextMonth.setHours(9, 0, 0, 0)
                  setScheduledAt(nextMonth.toISOString().slice(0, 16))
                }}>Next Month</button>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </button>
              <button className="btn btn-warning" onClick={handleSchedule} disabled={saving}>
                {saving ? 'Scheduling...' : 'Schedule Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsletterEditor
