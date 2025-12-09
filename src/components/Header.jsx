import { Link } from 'react-router-dom'

function Header() {
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
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
