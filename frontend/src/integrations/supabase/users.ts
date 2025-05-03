import { supabase } from './client';

// Fetch all users
export const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

// Approve a user account
export const approveUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ status: 'approved' })
    .eq('id', userId);
  if (error) throw error;
  return data;
};

// Deactivate a user account
export const deactivateUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ status: 'deactivated' })
    .eq('id', userId);
  if (error) throw error;
  return data;
};