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
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link to="/compare" onClick={() => setMenuOpen(false)}>Direct vs CSP</Link>
          <Link to="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
