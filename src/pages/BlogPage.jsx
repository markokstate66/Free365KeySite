import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'

const blogPosts = [
  {
    id: 1,
    slug: 'microsoft-365-vs-office-2021',
    title: 'Microsoft 365 vs Office 2021: Which Should You Choose?',
    excerpt: 'Understanding the key differences between subscription-based Microsoft 365 and the one-time purchase Office 2021 to help you make the right choice.',
    date: 'December 10, 2024',
    readTime: '5 min read',
    category: 'Guides'
  },
  {
    id: 2,
    slug: 'top-excel-features',
    title: '10 Excel Features That Will Transform Your Productivity',
    excerpt: 'Discover powerful Excel features like XLOOKUP, dynamic arrays, and Power Query that most users don\'t know about.',
    date: 'December 5, 2024',
    readTime: '7 min read',
    category: 'Tips'
  },
  {
    id: 3,
    slug: 'microsoft-teams-tips',
    title: 'Microsoft Teams: Essential Tips for Remote Work',
    excerpt: 'Master Microsoft Teams with these productivity tips for meetings, chat, file sharing, and collaboration.',
    date: 'November 28, 2024',
    readTime: '6 min read',
    category: 'Tips'
  },
  {
    id: 4,
    slug: 'onedrive-backup-guide',
    title: 'Complete Guide to OneDrive Backup and Sync',
    excerpt: 'Learn how to properly set up OneDrive to automatically backup your important files and sync across all devices.',
    date: 'November 20, 2024',
    readTime: '8 min read',
    category: 'Guides'
  },
  {
    id: 5,
    slug: 'word-formatting-secrets',
    title: 'Word Formatting Secrets: Create Professional Documents',
    excerpt: 'Stop fighting with Word formatting. Learn professional document design with styles, sections, and templates.',
    date: 'November 15, 2024',
    readTime: '6 min read',
    category: 'Tips'
  },
  {
    id: 6,
    slug: 'microsoft-365-security',
    title: 'Securing Your Microsoft 365 Account: A Complete Guide',
    excerpt: 'Protect your Microsoft 365 account with two-factor authentication, recovery options, and security best practices.',
    date: 'November 8, 2024',
    readTime: '5 min read',
    category: 'Security'
  }
]

function BlogPage() {
  return (
    <div>
      <Header />

      <section className="hero" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h1>Microsoft 365 Blog</h1>
          <p>Tips, guides, and news to help you get the most out of Microsoft 365</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-card-header">
                  <span className="blog-category">{post.category}</span>
                  <span className="blog-date">{post.date}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <div className="blog-card-footer">
                  <span className="read-time">{post.readTime}</span>
                  <Link to={`/blog/${post.slug}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <Newsletter variant="inline" />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BlogPage
