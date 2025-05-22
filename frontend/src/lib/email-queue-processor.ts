import { supabase } from '@/lib/supabase/client';
import { sendEmail } from './email';

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000 * 60 * 5; // 5 minutes

export async function processEmailQueue() {
  try {
    // Get pending emails that haven't been retried too many times
    const { data: pendingEmails, error: fetchError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .lt('retry_count', MAX_RETRIES)
      .order('created_at', { ascending: true })
      .limit(10);

    if (fetchError) {
      console.error('Error fetching pending emails:', fetchError);
      return;
    }

    for (const email of pendingEmails || []) {
      try {
        // Try to send the email
        await sendEmail({
          to: email.to_email,
          subject: email.subject,
          html: email.html,
        });

        // Update status to sent
        await supabase
          .from('email_queue')
          .update({ status: 'sent' })
          .eq('id', email.id);

      } catch (error) {
        console.error(`Failed to send email ${email.id}:`, error);

        // Update retry count and last retry time
        await supabase
          .from('email_queue')
          .update({
            retry_count: email.retry_count + 1,
            last_retry_at: new Date().toISOString(),
            status: email.retry_count + 1 >= MAX_RETRIES ? 'failed' : 'pending'
          })
          .eq('id', email.id);
      }

      // Add a small delay between processing emails
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Error processing email queue:', error);
  }
}

// Start the queue processor
export function startEmailQueueProcessor() {
  // Process queue immediately
  processEmailQueue();

  // Then process every 5 minutes
  setInterval(processEmailQueue, RETRY_DELAY);
} 