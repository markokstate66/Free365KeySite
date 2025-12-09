import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [winner, setWinner] = useState(null)

  // Check for existing session
  useEffect(() => {
    const session = sessionStorage.getItem('adminLoggedIn')
    if (session === 'true') {
      setIsLoggedIn(true)
      fetchRegistrations()
    }
  }, [])

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
        fetchRegistrations() // Refresh the list
      }
    } catch (err) {
      console.error('Failed to mark winner:', err)
      // Still show the winner locally even if API fails
      setWinner(selectedWinner)
      setShowWinnerModal(true)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn')
    setIsLoggedIn(false)
    setRegistrations([])
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

  return (
    <div>
      <Header />

      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-actions">
            <button className="btn btn-primary" onClick={fetchRegistrations}>
              Refresh
            </button>
            <button className="btn btn-success" onClick={selectRandomWinner}>
              Draw Winner
            </button>
            <button className="btn btn-secondary" onClick={exportToCSV}>
              Export CSV
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
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
