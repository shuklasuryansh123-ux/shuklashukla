import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -16 }
}

const pageTransition = { duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
        <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>Services</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
      </nav>
      <main className="main">{children}</main>
      <footer className="footer">© {new Date().getFullYear()} Shukla & Shukla Associates</footer>
    </div>
  )
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}

function HomePage() {
  return (
    <Page>
      <h1>Welcome to Shukla & Shukla Associates</h1>
      <p>Professional legal services with a client-first approach.</p>
    </Page>
  )
}

function AboutPage() {
  return (
    <Page>
      <h1>About Us</h1>
      <p>We are an experienced law firm providing comprehensive legal solutions.</p>
    </Page>
  )
}

function ServicesPage() {
  return (
    <Page>
      <h1>Services</h1>
      <ul>
        <li>Civil Litigation</li>
        <li>Criminal Defense</li>
        <li>Corporate Advisory</li>
        <li>Family Law</li>
      </ul>
    </Page>
  )
}

function ContactPage() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = React.useState<string | null>(null)
  const formRef = React.useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    setError(null)

    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      message: String(form.get('message') || '').trim()
    }

    if (!payload.name || !payload.email || !payload.message) {
      setError('Please fill in name, email, and message.')
      setStatus('error')
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send message.')
      }
      setStatus('success')
      formRef.current?.reset()
    } catch (err: any) {
      setStatus('error')
      setError(err?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <Page>
      <h1>Contact</h1>
      <p>We would love to hear from you. Send us a message and we’ll get back to you.</p>
      <form ref={formRef} onSubmit={handleSubmit} className="form">
        <div className="grid">
          <label>
            <span>Name</span>
            <input name="name" type="text" placeholder="Your full name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
        </div>
        <label>
          <span>Phone</span>
          <input name="phone" type="tel" placeholder="Optional" />
        </label>
        <label>
          <span>Message</span>
          <textarea name="message" rows={5} placeholder="How can we help?" required />
        </label>
        <div className="actions">
          <button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </button>
        </div>
        {status === 'success' && <p className="success">Thank you! We’ll get back to you soon.</p>}
        {status === 'error' && error && <p className="error">{error}</p>}
      </form>
    </Page>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}
