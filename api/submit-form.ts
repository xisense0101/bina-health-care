import { Resend } from 'resend';
import { error as logError } from '../src/lib/logger';

export const config = {
  runtime: 'edge',
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { type, data } = await req.json();
    const ownerEmail = process.env.OWNER_EMAIL; // Admin email to receive notifications

    if (!ownerEmail) {
      throw new Error('Server configuration error: OWNER_EMAIL is missing');
    }

    let subject = '';
    let htmlContent = '';
    let attachments: any[] = [];

    // Common Email Wrapper (Header/Footer with Branding)
    const emailHeader = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2D3748; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bina Adult Care</h1>
        </div>
        <div style="padding: 20px; background-color: #ffffff;">
    `;

    const emailFooter = `
        </div>
        <div style="background-color: #f7fafc; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
          <p style="color: #718096; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Bina Adult Care. All rights reserved.</p>
        </div>
      </div>
    `;

    switch (type) {
      case 'contact':
        subject = `[New Inquiry] ${data.name} - ${data.service || 'General Inquiry'}`;
        htmlContent = `
          <h2 style="color: #2d3748; margin-bottom: 20px;">New Contact Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.phone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Service:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.service}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Message:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${data.message}</td></tr>
          </table>
        `;
        break;

      case 'job':
        subject = `[Job Application] ${data.position} - ${data.name}`;
        htmlContent = `
          <h2 style="color: #2d3748; margin-bottom: 20px;">New Job Application</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Position:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.position}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Experience:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.experience}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.phone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Note:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${data.message || 'N/A'}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 14px; color: #4a5568;">
            <strong>Resume:</strong> See attachment.
          </p>
        `;
        if (data.resume && data.resume.content) {
          attachments = [{
            content: data.resume.content.split(',')[1], // Remove "data:application/pdf;base64," prefix if present
            filename: data.resume.filename || 'Resume.pdf'
          }];
        }
        break;

      case 'booking':
        subject = `[New Booking] ${data.name} - ${data.serviceType}`;
        htmlContent = `
          <h2 style="color: #2d3748; margin-bottom: 20px;">New Consulatation/Booking Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Service Type:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.serviceType}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Preferred Date:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.date}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Time Slot:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.time}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.phone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Notes:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${data.notes || 'N/A'}</td></tr>
          </table>
        `;
        break;

      default:
        return new Response(JSON.stringify({ success: false, message: 'Invalid submission type' }), { status: 400 });
    }

    // Send email to Owner
    await resend.emails.send({
      from: 'Bina Adult Care <onboarding@resend.dev>', // Update this after domain verification
      to: ownerEmail,
      replyTo: data.email,
      subject: subject,
      html: emailHeader + htmlContent + emailFooter,
      attachments: attachments,
    });

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logError('Email sending error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
