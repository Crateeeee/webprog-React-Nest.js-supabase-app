import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// ── Supabase client ──
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
    const now = new Date()
    const posted = new Date(iso)
    const diffMs = now - posted
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return posted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const avatarColor = (name) => {
    const colors = ['#14b8a6','#f97316','#8b5cf6','#ec4899','#3b82f6','#10b981','#f59e0b','#06b6d4']
    let hash = 0
    for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="app">
      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="19" fill="#14b8a6"/>
              <path d="M25 14h-3c-1.1 0-2 .9-2 2v3h5l-1 5h-4v10h-5V24h-3v-5h3v-3.5C15 12.5 16.5 11 19.5 11H25v3z" fill="white"/>
            </svg>
            <span className="logo-text">guestbook</span>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* ── CREATE POST ── */}
          <div className="card create-post">
            <div className="create-header">
              <div className="user-avatar" style={{background: '#14b8a6'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <button 
                className="create-trigger"
                onClick={() => document.getElementById('message').focus()}
              >
                What's on your mind?
              </button>
            </div>
            
            <div className="divider"></div>
            
            <form onSubmit={handleSubmit} className="create-form">
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={80}
                required
                className="input-name"
              />
              <textarea
                id="message"
                placeholder="Write something..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={500}
                rows={3}
                required
                className="input-message"
              />
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">Posted!</div>}
              <button type="submit" className="btn-post" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>

          {/* ── FEED ── */}
          <div className="feed">
            {loading ? (
              <>
                {[1,2,3].map(i => (
                  <div key={i} className="card skeleton">
                    <div className="skeleton-header">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-info">
                        <div className="skeleton-name"></div>
                        <div className="skeleton-time"></div>
                      </div>
                    </div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                  </div>
                ))}
              </>
            ) : posts.length === 0 ? (
              <div className="card empty-state">
                <p>No posts yet. Be the first to share!</p>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="card post">
                  <div className="post-header">
                    <div className="user-avatar" style={{background: avatarColor(post.name)}}>
                      {post.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="post-info">
                      <div className="post-author">{post.name}</div>
                      <div className="post-time">{formatDate(post.created_at)}</div>
                    </div>
                  </div>
                  <div className="post-content">
                    {post.message}
                  </div>
                  <div className="post-actions">
                    <button className="action-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                      </svg>
                      Like
                    </button>
                    <button className="action-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                      </svg>
                      Comment
                    </button>
                    <button className="action-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                      </svg>
                      Share
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
