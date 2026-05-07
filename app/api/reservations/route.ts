export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const { Resend } = await import('resend')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const resend = new Resend(process.env.RESEND_API_KEY)

    const body = await request.json()
    const { name, email, date, time, party_size, message } = body

    if (!name || !email || !date || !time || !party_size) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    const { error: dbError } = await supabase
      .from('reservations')
      .insert([{ name, email, date, time, party_size, message }])

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json(
        { error: 'Could not save your reservation. Please try again.' },
        { status: 500 }
      )
    }

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your reservation at Ramen House is confirmed!',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #c8922a;">Reservation Confirmed</h2>
          <p>Hi ${name}, we can't wait to see you!</p>
          <div style="background: #f9f5f0; padding: 1.25rem; border-radius: 8px; margin: 1.5rem 0;">
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Party size:</strong> ${party_size} ${Number(party_size) === 1 ? 'guest' : 'guests'}</p>
            ${message ? `<p><strong>Special requests:</strong> ${message}</p>` : ''}
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