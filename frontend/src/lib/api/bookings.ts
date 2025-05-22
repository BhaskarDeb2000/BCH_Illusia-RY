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

export async function checkAvailability(itemId: string, startDate: Date, endDate: Date): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('item_id', itemId)
    .eq('status', 'approved')
    .or(`start_date.lte.${endDate.toISOString()},end_date.gte.${startDate.toISOString()}`);

  if (error) throw error;
  return data.length === 0;
}

async function acquireLock(itemId: string, startDate: Date, endDate: Date): Promise<boolean> {
  const lockKey = `booking_lock:${itemId}:${startDate.toISOString()}:${endDate.toISOString()}`;
  const { data, error } = await supabase
    .from('booking_locks')
    .insert([{ key: lockKey, expires_at: new Date(Date.now() + 30000) }])
    .select()
    .single();

  if (error) {
    // Lock already exists
    return false;
  }
  return true;
}

async function releaseLock(itemId: string, startDate: Date, endDate: Date): Promise<void> {
  const lockKey = `booking_lock:${itemId}:${startDate.toISOString()}:${endDate.toISOString()}`;
  await supabase
    .from('booking_locks')
    .delete()
    .eq('key', lockKey);
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  // Try to acquire lock
  const lockAcquired = await acquireLock(input.itemId, input.startDate, input.endDate);
  if (!lockAcquired) {
    throw new Error('Another booking request is being processed. Please try again in a few seconds.');
  }

  try {
    // Check availability first
    const isAvailable = await checkAvailability(input.itemId, input.startDate, input.endDate);
    if (!isAvailable) {
      throw new Error('Item is not available for the selected dates');
    }

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
  } finally {
    // Always release the lock
    await releaseLock(input.itemId, input.startDate, input.endDate);
  }
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

export async function getUserBookings(
  userId: string,
  page: number = 1,
  pageSize: number = 10,
  searchQuery: string = ""
): Promise<{ data: Booking[]; total: number }> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from('bookings')
    .select(`
      *,
      item:items(*)
    `, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(`
      item.name.ilike.%${searchQuery}%,
      status.ilike.%${searchQuery}%,
      special_requests.ilike.%${searchQuery}%
    `);
  }

  const { data, error, count } = await query
    .range(start, end);

  if (error) throw error;
  return { data, total: count || 0 };
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