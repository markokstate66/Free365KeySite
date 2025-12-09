import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <a href="mailto:contact@free365key.com">Contact</a>
      </div>
      <p className="footer-copy">
        &copy; {currentYear} Free365Key. All rights reserved.
        <br />
        Microsoft 365 is a trademark of Microsoft Corporation.
      </p>
    </footer>
  )
}

export default Footer
