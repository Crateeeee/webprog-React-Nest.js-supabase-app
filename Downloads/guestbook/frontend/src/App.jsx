import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// ── Supabase client (replace with your actual values) ──
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function App() {
  const [posts, setPosts] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError('Failed to load posts: ' + error.message)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)
    setError(null)
    const { error } = await supabase
      .from('guestbook')
      .insert([{ name: name.trim(), message: message.trim() }])
    if (error) {
      setError('Failed to post: ' + error.message)
    } else {
      setSuccess(true)
      setName('')
      setMessage('')
      await fetchPosts()
      setTimeout(() => setSuccess(false), 3000)
    }
    setSubmitting(false)
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const avatarColor = (name) => {
    const colors = ['#e63946','#457b9d','#2a9d8f','#e9c46a','#f4a261','#6d6875','#b5838d','#4361ee']
    let hash = 0
    for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="app">
      <header>
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">✦</span>
            <span>Guestbook</span>
          </div>
          <p className="header-sub">Leave a note. Let the world know you were here.</p>
        </div>
        <div className="header-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f4ff"/>
          </svg>
        </div>
      </header>

      <main>
        {/* ── FORM ── */}
        <section className="card form-card">
          <h2>Sign the Guestbook</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Ada Lovelace"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={80}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                placeholder="Say something nice..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={500}
                rows={4}
                required
              />
              <span className="char-count">{message.length}/500</span>
            </div>
            {error && <div className="alert alert-error">⚠ {error}</div>}
            {success && <div className="alert alert-success">✓ Your message was posted!</div>}
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? <span className="spinner" /> : '✦ Sign Guestbook'}
            </button>
          </form>
        </section>

        {/* ── POSTS ── */}
        <section className="posts-section">
          <div className="posts-header">
            <h2>Messages</h2>
            <span className="badge">{posts.length}</span>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="empty">
              <p>No messages yet. Be the first!</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post, i) => (
                <article key={post.id} className="post-card" style={{'--delay': `${i * 0.05}s`}}>
                  <div className="post-avatar" style={{background: avatarColor(post.name)}}>
                    {post.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="post-body">
                    <div className="post-meta">
                      <strong className="post-name">{post.name}</strong>
                      <time className="post-time">{formatDate(post.created_at)}</time>
                    </div>
                    <p className="post-message">{post.message}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>Built with React · Nest.js · Supabase · Vercel</p>
      </footer>
    </div>
  )
}
