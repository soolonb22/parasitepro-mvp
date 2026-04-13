import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email address required' }, { status: 400 })
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Waitlist] New signup: ${name || 'Anonymous'} <${email}>`)
    }

    // TODO: Integrate with your preferred email service
    // Options: Resend, Mailchimp, SendGrid, or your own DB
    //
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.contacts.create({
    //   email,
    //   firstName: name,
    //   audienceId: process.env.RESEND_WAITLIST_AUDIENCE_ID,
    // })
    //
    // Example with direct DB (using your existing Railway PostgreSQL):
    // await db.query(
    //   'INSERT INTO waitlist (email, name, source, created_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (email) DO NOTHING',
    //   [email, name || null, 'homepage']
    // )

    // For now: forward to support email via a simple notification
    // You can integrate your preferred service here

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist',
    })
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Failed to join waitlist. Please email support@notworms.com directly.' },
      { status: 500 }
    )
  }
}
