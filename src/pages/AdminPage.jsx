import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import NewsletterEditor from '../components/NewsletterEditor'

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('registrations')

  // Registrations state
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [winner, setWinner] = useState(null)

  // Newsletter state
  const [newsletters, setNewsletters] = useState([])
  const [subscribers, setSubscribers] = useState({ subscribers: [], total: 0, active: 0 })
  const [editingNewsletter, setEditingNewsletter] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => {
    const session = sessionStorage.getItem('adminLoggedIn')
    if (session === 'true') {
      setIsLoggedIn(true)
      fetchRegistrations()
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn && activeTab === 'newsletters') {
      fetchNewsletters()
      fetchSubscribers()
    }
  }, [isLoggedIn, activeTab])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (response.ok) {
        sessionStorage.setItem('adminLoggedIn', 'true')
        setIsLoggedIn(true)
        fetchRegistrations()
      } else {
        setLoginError('Invalid password')
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.')
    }
  }

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/registrations')
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchNewsletters = async () => {
    try {
      // First, process any scheduled newsletters that are due
      await fetch('/api/newsletter/process-scheduled', { method: 'POST' }).catch(() => {})

      const response = await fetch('/api/admin/newsletters')
      if (response.ok) {
        const data = await response.json()
        setNewsletters(data.newsletters || [])
      }
    } catch (err) {
      console.error('Failed to fetch newsletters:', err)
    }
  }

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/subscribers')
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data)
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err)
    }
  }

  const handleSaveNewsletter = async (newsletterData) => {
    const method = newsletterData.id ? 'PUT' : 'POST'
    const url = '/api/admin/newsletters' + (newsletterData.id ? `?id=${newsletterData.id}` : '')

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsletterData)
    })

    if (response.ok) {
      const savedNewsletter = await response.json()
      if (newsletterData.id) {
        setEditingNewsletter(savedNewsletter)
      } else {
        setEditingNewsletter(savedNewsletter)
      }
      fetchNewsletters()
      return savedNewsletter
    } else {
      const error = await response.json()
      alert(error.error || 'Failed to save newsletter')
      throw new Error(error.error)
    }
  }

  const handleSendNewsletter = async (id) => {
    const response = await fetch('/api/admin/newsletters/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })

    if (response.ok) {
      const result = await response.json()
      alert(`Newsletter sent successfully!\n\nSent to: ${result.results.successfulSends} subscribers\nFailed: ${result.results.failedSends}`)
      setShowEditor(false)
      setEditingNewsletter(null)
      fetchNewsletters()
    } else {
      const error = await response.json()
      alert(error.error || 'Failed to send newsletter')
      throw new Error(error.error)
    }
  }

  const handleDeleteNewsletter = async (id) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return

    const response = await fetch(`/api/admin/newsletters?id=${id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      fetchNewsletters()
    } else {
      alert('Failed to delete newsletter')
    }
  }

  const exportToCSV = () => {
    if (registrations.length === 0) return

    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Job Title', 'Marketing Consent', 'Registered At', 'Winner']
    const csvContent = [
      headers.join(','),
      ...registrations.map(r => [
        r.id,
        `"${r.firstName}"`,
        `"${r.lastName}"`,
        r.email,
        `"${r.phone}"`,
        `"${r.companyName || ''}"`,
        `"${r.jobTitle || ''}"`,
        r.agreeMarketing ? 'Yes' : 'No',
        r.registeredAt,
        r.isWinner ? 'Yes' : 'No'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const selectRandomWinner = async () => {
    const eligibleEntries = registrations.filter(r => !r.isWinner)
    if (eligibleEntries.length === 0) {
      alert('No eligible entries for drawing')
      return
    }

    const randomIndex = Math.floor(Math.random() * eligibleEntries.length)
    const selectedWinner = eligibleEntries[randomIndex]

    try {
      const response = await fetch('/api/admin/mark-winner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedWinner.id })
      })

      if (response.ok) {
        setWinner(selectedWinner)
        setShowWinnerModal(true)
        fetchRegistrations()
      }
    } catch (err) {
      console.error('Failed to mark winner:', err)
      setWinner(selectedWinner)
      setShowWinnerModal(true)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn')
    setIsLoggedIn(false)
    setRegistrations([])
    setNewsletters([])
  }

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Admin Login</h2>
          {loginError && <div className="error-message">{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
              />
            </div>
            <button type="submit" className="submit-btn">Login</button>
          </form>
        </div>
      </div>
    )
  }

  if (showEditor) {
    return (
      <div>
        <Header />
        <div className="admin-container">
          <NewsletterEditor
            newsletter={editingNewsletter}
            onSave={handleSaveNewsletter}
            onSend={handleSendNewsletter}
            onCancel={() => {
              setShowEditor(false)
              setEditingNewsletter(null)
            }}
          />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />

      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            Registrations
          </button>
          <button
            className={`admin-tab ${activeTab === 'newsletters' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsletters')}
          >
            Newsletters
          </button>
        </div>

        {activeTab === 'registrations' && (
          <>
            <div className="admin-actions-bar">
              <button className="btn btn-primary" onClick={fetchRegistrations}>
                Refresh
              </button>
              <button className="btn btn-success" onClick={selectRandomWinner}>
                Draw Winner
              </button>
              <button className="btn btn-secondary" onClick={exportToCSV}>
                Export CSV
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Registrations</h3>
                <div className="number">{registrations.length}</div>
              </div>
              <div className="stat-card">
                <h3>Marketing Consent</h3>
                <div className="number">
                  {registrations.filter(r => r.agreeMarketing).length}
                </div>
              </div>
              <div className="stat-card">
                <h3>Winners Selected</h3>
                <div className="number">
                  {registrations.filter(r => r.isWinner).length}
                </div>
              </div>
              <div className="stat-card">
                <h3>Today's Signups</h3>
                <div className="number">
                  {registrations.filter(r => {
                    const today = new Date().toISOString().split('T')[0]
                    return r.registeredAt?.startsWith(today)
                  }).length}
                </div>
              </div>
            </div>

            <div className="data-table">
              {loading ? (
                <p style={{ padding: '20px', textAlign: 'center' }}>Loading...</p>
              ) : registrations.length === 0 ? (
                <p style={{ padding: '20px', textAlign: 'center' }}>No registrations yet</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Company</th>
                      <th>Job Title</th>
                      <th>Marketing</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => (
                      <tr key={reg.id}>
                        <td>{reg.firstName} {reg.lastName}</td>
                        <td>{reg.email}</td>
                        <td>{reg.phone}</td>
                        <td>{reg.companyName || '-'}</td>
                        <td>{reg.jobTitle || '-'}</td>
                        <td>{reg.agreeMarketing ? 'Yes' : 'No'}</td>
                        <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                        <td>
                          {reg.isWinner && <span className="winner-badge">Winner</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === 'newsletters' && (
          <>
            <div className="admin-actions-bar">
              <button
                className="btn btn-success"
                onClick={() => {
                  setEditingNewsletter(null)
                  setShowEditor(true)
                }}
              >
                + New Newsletter
              </button>
              <button className="btn btn-primary" onClick={fetchNewsletters}>
                Refresh
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Subscribers</h3>
                <div className="number">{subscribers.total}</div>
              </div>
              <div className="stat-card">
                <h3>Active Subscribers</h3>
                <div className="number">{subscribers.active}</div>
              </div>
              <div className="stat-card">
                <h3>Scheduled</h3>
                <div className="number" style={{ color: '#ffb900' }}>{newsletters.filter(n => n.status === 'scheduled').length}</div>
              </div>
              <div className="stat-card">
                <h3>Sent</h3>
                <div className="number">{newsletters.filter(n => n.status === 'sent').length}</div>
              </div>
            </div>

            {newsletters.filter(n => n.status === 'scheduled').length > 0 && (
              <div className="queue-section">
                <h3>
                  Scheduled Queue
                  <span className="queue-count">{newsletters.filter(n => n.status === 'scheduled').length}</span>
                </h3>
                <div className="queue-timeline">
                  {newsletters
                    .filter(n => n.status === 'scheduled')
                    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
                    .map((nl) => (
                      <div key={nl.id} className="queue-item">
                        <div className="queue-item-header">
                          <h4>{nl.subject}</h4>
                          <span className="queue-item-date">
                            {new Date(nl.scheduledAt).toLocaleDateString()} at {new Date(nl.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="queue-item-meta">
                          Created {new Date(nl.createdAt).toLocaleDateString()}
                        </div>
                        <div className="action-buttons" style={{ marginTop: '10px' }}>
                          <button
                            className="btn-small btn-primary"
                            onClick={() => {
                              setEditingNewsletter(nl)
                              setShowEditor(true)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-small btn-danger"
                            onClick={() => handleDeleteNewsletter(nl.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="data-table">
              {newsletters.length === 0 ? (
                <p style={{ padding: '20px', textAlign: 'center' }}>No newsletters yet. Create your first one!</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Recipients</th>
                      <th>Created</th>
                      <th>Scheduled/Sent</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsletters.map((nl) => (
                      <tr key={nl.id}>
                        <td>{nl.subject}</td>
                        <td>
                          <span className={`status-badge status-${nl.status}`}>
                            {nl.status}
                          </span>
                        </td>
                        <td>{nl.status === 'sent' ? nl.recipientCount : '-'}</td>
                        <td>{new Date(nl.createdAt).toLocaleDateString()}</td>
                        <td>
                          {nl.status === 'scheduled'
                            ? new Date(nl.scheduledAt).toLocaleDateString()
                            : nl.sentAt
                            ? new Date(nl.sentAt).toLocaleDateString()
                            : '-'}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-small btn-primary"
                              onClick={() => {
                                setEditingNewsletter(nl)
                                setShowEditor(true)
                              }}
                            >
                              {nl.status === 'sent' ? 'View' : 'Edit'}
                            </button>
                            {nl.status !== 'sent' && (
                              <button
                                className="btn-small btn-danger"
                                onClick={() => handleDeleteNewsletter(nl.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {subscribers.subscribers.length > 0 && (
              <div className="subscribers-section">
                <h3>Recent Subscribers</h3>
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Subscribed</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.subscribers.slice(0, 10).map((sub) => (
                        <tr key={sub.id}>
                          <td>{sub.email}</td>
                          <td>{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${sub.isActive ? 'status-active' : 'status-inactive'}`}>
                              {sub.isActive ? 'Active' : 'Unsubscribed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showWinnerModal && winner && (
        <div className="modal-overlay" onClick={() => setShowWinnerModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Winner Selected!</h3>
            <div className="winner-display">
              <h4>{winner.firstName} {winner.lastName}</h4>
              <p>{winner.email}</p>
              <p>{winner.phone}</p>
              {winner.companyName && <p>{winner.companyName}</p>}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowWinnerModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default AdminPage
