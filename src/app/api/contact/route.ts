import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!process.env.SMTP_USER) {
      console.log('SMTP not configured. Contact form submission:', { name, email, subject, message });
      return NextResponse.json({ success: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true' || parseInt(process.env.SMTP_PORT || '465') === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || '',
      },
    });

    const contactEmail = process.env.CONTACT_EMAIL || process.env.FROM_EMAIL || '';

    await transporter.sendMail({
      from: `"MicTestCam Contact" <${process.env.FROM_EMAIL || 'noreply@mictestcam.com'}>`,
      to: contactEmail,
      replyTo: email,
      subject: `[MicTestCam Contact] ${subject}`,
      html: `<p><strong>From:</strong> ${name} (&lt;${email}&gt;)</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <hr />
             <p>${message.replace(/\n/g, '<br />')}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
