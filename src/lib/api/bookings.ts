import { supabase } from '@/integrations/supabase/client';
import { Booking, BookingStatus } from '@/types';
import { sendEmail, emailTemplates } from '@/lib/email';

export interface CreateBookingInput {
  itemId: string;
  startDate: Date;
  endDate: Date;
  specialRequests?: string;
}

export interface UpdateBookingInput {
  bookingId: string;
  status?: BookingStatus;
  startDate?: Date;
  endDate?: Date;
  specialRequests?: string;
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        item_id: input.itemId,
        start_date: input.startDate.toISOString(),
        end_date: input.endDate.toISOString(),
        special_requests: input.specialRequests,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Send email notification
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user?.email) {
      await sendEmail({
        to: userData.user.email,
        subject: 'Booking Request Submitted',
        html: emailTemplates.bookingCreated(data),
      });
    }
  } catch (emailError) {
    console.error('Failed to send booking confirmation email:', emailError);
  }

  return data;
}

export async function updateBooking(input: UpdateBookingInput): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: input.status,
      start_date: input.startDate?.toISOString(),
      end_date: input.endDate?.toISOString(),
      special_requests: input.specialRequests,
    })
    .eq('id', input.bookingId)
    .select()
    .single();

  if (error) throw error;

  // Send email notification if status changed
  if (input.status) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.email) {
        await sendEmail({
          to: userData.user.email,
          subject: 'Booking Status Updated',
          html: emailTemplates.bookingStatusChanged(data),
        });
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
    }
  }

  return data;
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;

  // Send email notification
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user?.email) {
      await sendEmail({
        to: userData.user.email,
        subject: 'Booking Cancelled',
        html: emailTemplates.bookingCancelled(data),
      });
    }
  } catch (emailError) {
    console.error('Failed to send cancellation email:', emailError);
  }

  return data;
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      item:items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getItemBookings(itemId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      user:users(*)
    `)
    .eq('item_id', itemId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
} 