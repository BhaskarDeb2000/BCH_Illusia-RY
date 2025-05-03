export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  item_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  item?: Item;
  user?: User;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price_per_day: number;
  category_id: string;
  category?: Category;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
} 