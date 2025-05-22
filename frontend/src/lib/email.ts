import sgMail from '@sendgrid/mail';
import { Booking } from '@/types';
import { supabase } from '@/lib/supabase/client';

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

const MAX_EMAIL_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function sendEmailWithRetry(params: EmailOptions, retries = MAX_EMAIL_RETRIES): Promise<void> {
  try {
    await sendEmail(params);
  } catch (error) {
    if (retries > 0) {
      console.warn(`Failed to send email, retrying... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return sendEmailWithRetry(params, retries - 1);
    }
    // Log the error but don't throw - we don't want to break the booking flow
    console.error('Failed to send email after multiple retries:', error);
    // Add to queue for later retry
    await addToEmailQueue(params);
  }
}

async function addToEmailQueue(params: EmailOptions): Promise<void> {
  const { error } = await supabase
    .from('email_queue')
    .insert([{
      to_email: params.to,
      subject: params.subject,
      html: params.html,
      status: 'pending',
      retry_count: 0
    }]);

  if (error) {
    console.error('Failed to add email to queue:', error);
  }
}

export async function sendEmail(params: EmailOptions) {
  try {
    await sgMail.send({
      to: params.to,
      from: SENDGRID_FROM_EMAIL,
      subject: params.subject,
      html: params.html,
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