'use client'

import { useState } from 'react'
import Link from 'next/link'

const times = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM'
]

export default function ReservationsPage() {
  const [form, setForm] = useState({
    name: '', email: '', date: '', time: '', party_size: '2', message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.')
        setStatus('error')
        return
      }

      setStatus('success')
      setForm({ name: '', email: '', date: '', time: '', party_size: '2', message: '' })

    } catch {
      setErrorMsg('Could not connect. Please check your internet and try again.')
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#1a1815',
    border: '1px solid rgba(200,146,42,0.25)',
    borderRadius: '4px',
    color: '#f0ece4',
    fontSize: '0.95rem',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    color: '#8a8070',
    marginBottom: '0.5rem',
  }

  return (
    <main style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingTop: '5rem' }}>

      {/* Navigation */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        padding: '1.25rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(15,14,12,0.85)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(200,146,42,0.15)'
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
          富裕 Fuyou Ramen House
        </Link>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <Link href="/menu" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Menu</Link>
          <Link href="/blog" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Our Story</Link>
          <Link href="/reservations" style={{
            color: 'var(--color-bg)', background: 'var(--color-primary)',
            padding: '0.4rem 1.1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 500
          }}>Reserve</Link>
        </div>
      </nav>

      {/* Header */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem 3rem' }}>
        <p style={{ color: 'var(--color-primary)', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: '1rem' }}>
          BOOK A TABLE
        </p>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Reservations</h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '420px', margin: '0 auto' }}>
          We hold your table for 15 minutes. For parties over 8, please call us directly.
        </p>
      </section>

      {/* Form */}
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 2rem 6rem' }}>

        {status === 'success' ? (
          <div style={{
            background: 'var(--color-surface)', border: '1px solid rgba(200,146,42,0.3)',
            borderRadius: '8px', padding: '3rem', textAlign: 'center'
          }}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍜</p>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>You're booked!</h2>
            <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
              Check your email for a confirmation. We look forward to seeing you!
            </p>
            <button
              onClick={() => setStatus('idle')}
              style={{
                background: 'var(--color-primary)', color: 'var(--color-bg)',
                border: 'none', padding: '0.85rem 2rem', borderRadius: '4px',
                fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer'
              }}
            >
              Make another reservation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Name */}
            <div>
              <label style={labelStyle}>YOUR NAME *</label>
              <input
                name="name" value={form.name} onChange={handleChange}
                placeholder="Hiroshi Tanaka" required style={inputStyle}
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>EMAIL ADDRESS *</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="hiroshi@example.com" required style={inputStyle}
              />
            </div>

            {/* Date and party size side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>DATE *</label>
                <input
                  type="date" name="date" value={form.date} onChange={handleChange}
                  required style={inputStyle}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label style={labelStyle}>GUESTS *</label>
                <select name="party_size" value={form.party_size} onChange={handleChange} style={inputStyle}>
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time */}
            <div>
              <label style={labelStyle}>TIME *</label>
              <select name="time" value={form.time} onChange={handleChange} required style={inputStyle}>
                <option value="">Select a time</option>
                {times.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Special requests */}
            <div>
              <label style={labelStyle}>SPECIAL REQUESTS</label>
              <textarea
                name="message" value={form.message} onChange={handleChange}
                placeholder="Allergies, dietary requirements, celebrating something special?"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* Error message */}
            {status === 'error' && (
              <p style={{ color: '#e05c5c', fontSize: '0.9rem', padding: '0.75rem 1rem', background: 'rgba(224,92,92,0.1)', borderRadius: '4px' }}>
                {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                background: status === 'loading' ? 'var(--color-muted)' : 'var(--color-primary)',
                color: 'var(--color-bg)', border: 'none',
                padding: '1rem 2rem', borderRadius: '4px',
                fontWeight: 600, fontSize: '1rem', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {status === 'loading' ? 'Confirming your table...' : 'Reserve My Table'}
            </button>

          </form>
        )}
      </div>

    </main>
  )
}