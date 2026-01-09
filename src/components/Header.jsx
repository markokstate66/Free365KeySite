import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <svg className="logo-icon" viewBox="0 0 100 100">
            <rect width="45" height="45" x="5" y="5" fill="#f25022"/>
            <rect width="45" height="45" x="50" y="5" fill="#7fba00"/>
            <rect width="45" height="45" x="5" y="50" fill="#00a4ef"/>
            <rect width="45" height="45" x="50" y="50" fill="#ffb900"/>
          </svg>
          Free365Key
        </Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/licensing-guides" onClick={() => setMenuOpen(false)}>Licensing Guide</Link>
          <Link to="/plan-finder" onClick={() => setMenuOpen(false)}>Plan Finder</Link>
          <Link to="/compare" onClick={() => setMenuOpen(false)}>Direct vs CSP</Link>
          <Link to="/giveaway/faq" onClick={() => setMenuOpen(false)}>Giveaway FAQ</Link>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '8px 16px', borderRadius: '6px', marginTop: '-8px', marginBottom: '-8px' }}>Free Giveaway</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
