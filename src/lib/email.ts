import sgMail from '@sendgrid/mail';
import { Booking } from '@/types';

const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = import.meta.env.VITE_SENDGRID_FROM_EMAIL;

if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
  throw new Error('Missing SendGrid environment variables');
}

sgMail.setApiKey(SENDGRID_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await sgMail.send({
      to,
      from: SENDGRID_FROM_EMAIL,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export const emailTemplates = {
  bookingCreated: (booking: Booking) => `
    <h1>Booking Request Submitted</h1>
    <p>Your booking request has been submitted successfully.</p>
    <p>Details:</p>
    <ul>
      <li>Item: ${booking.item?.name}</li>
      <li>Start Date: ${new Date(booking.start_date).toLocaleDateString()}</li>
      <li>End Date: ${new Date(booking.end_date).toLocaleDateString()}</li>
      <li>Status: ${booking.status}</li>
    </ul>
  `,
  
  bookingStatusChanged: (booking: Booking) => `
    <h1>Booking Status Updated</h1>
    <p>Your booking status has been updated to: ${booking.status}</p>
    <p>Details:</p>
    <ul>
      <li>Item: ${booking.item?.name}</li>
      <li>Start Date: ${new Date(booking.start_date).toLocaleDateString()}</li>
      <li>End Date: ${new Date(booking.end_date).toLocaleDateString()}</li>
    </ul>
  `,
  
  bookingCancelled: (booking: Booking) => `
    <h1>Booking Cancelled</h1>
    <p>Your booking has been cancelled.</p>
    <p>Details:</p>
    <ul>
      <li>Item: ${booking.item?.name}</li>
      <li>Start Date: ${new Date(booking.start_date).toLocaleDateString()}</li>
      <li>End Date: ${new Date(booking.end_date).toLocaleDateString()}</li>
    </ul>
  `,
}; 