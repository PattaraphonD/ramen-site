export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Strip HTML tags and trim whitespace to prevent injection */
function sanitize(value: unknown): string {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .trim()
}

/** Escape characters that are special in HTML — used in the email template */
function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/** Simple in-memory rate limiter — max 5 requests per IP per 60 seconds */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT) return true

  entry.count++
  return false
}

// Clean up stale entries every 5 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(ip)
  }
}, 5 * 60 * 1000)

// Valid time slots — must match the list in reservations/page.tsx
const VALID_TIMES = new Set([
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM',  '1:30 PM',  '5:00 PM',  '5:30 PM',
  '6:00 PM',  '6:30 PM',  '7:00 PM',  '7:30 PM',
  '8:00 PM',  '8:30 PM',  '9:00 PM',
])

// ─── Route handler ───────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {

    // ── 1. CSRF: only allow requests from your own domain ──────────────────
    const origin = request.headers.get('origin') ?? ''
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
    if (siteUrl && origin !== siteUrl) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ── 2. Rate limiting per IP ────────────────────────────────────────────
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 }
      )
    }

    // ── 3. Parse body safely ───────────────────────────────────────────────
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const { name, email, date, time, party_size, message } = body

    // ── 4. Presence check ─────────────────────────────────────────────────
    if (!name || !email || !date || !time || !party_size) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    // ── 5. Sanitize all string inputs ─────────────────────────────────────
    const safeName    = sanitize(name)
    const safeEmail   = sanitize(email)
    const safeDate    = sanitize(date)
    const safeTime    = sanitize(time)
    const safeMessage = sanitize(message)
    const safeSize    = Number(party_size)

    // ── 6. Validate field formats and lengths ─────────────────────────────
    if (safeName.length === 0 || safeName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 1 and 100 characters.' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail) || safeEmail.length > 200) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(safeDate)) {
      return NextResponse.json(
        { error: 'Invalid date format.' },
        { status: 400 }
      )
    }

    // Prevent bookings in the past
    const bookingDate = new Date(safeDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (bookingDate < today) {
      return NextResponse.json(
        { error: 'Reservation date cannot be in the past.' },
        { status: 400 }
      )
    }

    if (!VALID_TIMES.has(safeTime)) {
      return NextResponse.json(
        { error: 'Invalid time selected.' },
        { status: 400 }
      )
    }

    if (!Number.isInteger(safeSize) || safeSize < 1 || safeSize > 8) {
      return NextResponse.json(
        { error: 'Party size must be between 1 and 8.' },
        { status: 400 }
      )
    }

    if (safeMessage.length > 600) {
      return NextResponse.json(
        { error: 'Special requests must be under 600 characters.' },
        { status: 400 }
      )
    }

    // ── 7. Save to Supabase ───────────────────────────────────────────────
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error: dbError } = await supabase
      .from('reservations')
      .insert([{
        name:       safeName,
        email:      safeEmail,
        date:       safeDate,
        time:       safeTime,
        party_size: safeSize,
        message:    safeMessage,
      }])

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json(
        { error: 'Could not save your reservation. Please try again.' },
        { status: 500 }
      )
    }

    // ── 8. Send confirmation email with HTML-escaped values ───────────────
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: safeEmail,
      subject: 'Your reservation at Ramen House is confirmed!',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #c8922a;">Reservation Confirmed</h2>
          <p>Hi ${escHtml(safeName)}, we can't wait to see you!</p>
          <div style="background: #f9f5f0; padding: 1.25rem; border-radius: 8px; margin: 1.5rem 0;">
            <p><strong>Date:</strong> ${escHtml(safeDate)}</p>
            <p><strong>Time:</strong> ${escHtml(safeTime)}</p>
            <p><strong>Party size:</strong> ${safeSize} ${safeSize === 1 ? 'guest' : 'guests'}</p>
            ${safeMessage ? `<p><strong>Special requests:</strong> ${escHtml(safeMessage)}</p>` : ''}
          </div>
          <p style="color: #666; font-size: 0.9rem;">
            Need to change or cancel? Call us or reply to this email.
          </p>
          <p style="color: #c8922a; font-weight: bold;">麺 Ramen House</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}