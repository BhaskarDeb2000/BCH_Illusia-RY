import { supabase } from './client';

// Create a new booking
interface IBookingData {
id: string;
user_id: string;
created_at:string;
booking_date_start: string;
booking_date_end: string;
status: string;
notes: string;
}
export const createBooking = async (bookingData: IBookingData) => {
  const { data, error } = await supabase.from('bookings').insert([bookingData]);
console.log('Booking data:', data);

  if (error) throw error;
  return data;
};

// Fetch all bookings
export const fetchBookings = async () => {
  const { data, error } = await supabase.from('bookings').select('*');
  if (error) throw error;
  return data;
};

// Approve a booking
export const approveBooking = async (bookingId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'approved' })
    .eq('id', bookingId);
  if (error) throw error;
  return data;
};

// Reject a booking
export const rejectBooking = async (bookingId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'rejected' })
    .eq('id', bookingId);
  if (error) throw error;
  return data;
};