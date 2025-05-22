import { supabase } from "@/integrations/supabase/client";

// Type for one item (translation fields are JSON)
export interface DBItem {
  id: string;
  name: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  category: string;
  tags: string[];
  quantity: number;
  image_url?: string;
  storage_details?: {
    [key: string]: string;
  };
  location?: string;
  price?: number;
  created_at?: string;
  updated_at?: string;
}

export async function fetchItems(): Promise<DBItem[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("name");

  if (error) throw error;
  return data as DBItem[];
}

// Add a new category
export const createCategory = async (categoryName: string) => {
  const { data, error } = await supabase.from('categories').insert([{ name: categoryName }]);
  if (error) throw error;
  return data;
};

// Add a new tag
export const createTag = async (tagName: string) => {
  const { data, error } = await supabase.from('tags').insert([{ name: tagName }]);
  if (error) throw error;
  return data;
};

// Delete a category
export const deleteCategory = async (categoryId: string) => {
  const { data, error } = await supabase.from('categories').delete().eq('id', categoryId);
  if (error) throw error;
  return data;
};

// Delete a tag
export const deleteTag = async (tagId: string) => {
  const { data, error } = await supabase.from('tags').delete().eq('id', tagId);
  if (error) throw error;
  return data;
};

// Fetch system logs
export const fetchSystemLogs = async () => {
  const { data, error } = await supabase.from('system_logs').select('*').order('timestamp', { ascending: false });
  if (error) throw error;
  return data;
};
