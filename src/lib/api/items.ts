import { supabase } from '@/integrations/supabase/client';
import { Item, CreateItemInput, UpdateItemInput, ItemFilters } from '@/types/item';

export async function createItem(input: CreateItemInput): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .insert([
      {
        name: { en: input.description },
        description: { en: input.contentSummary },
        storage_details: { en: input.storageDetails },
        location: input.storageLocation,
        quantity: input.quantity,
        category: input.category,
        tags: input.tags,
        image_url: input.imageUrl,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    number: data.id,
    description: (data.name as { en: string }).en,
    contentSummary: (data.description as { en: string }).en,
    storageDetails: (data.storage_details as { en: string })?.en || '',
    storageLocation: data.location || '',
    quantity: data.quantity || 0,
    category: data.category || '',
    tags: data.tags || [],
    imageUrl: data.image_url || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateItem(input: UpdateItemInput): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .update({
      name: input.description ? { en: input.description } : undefined,
      description: input.contentSummary ? { en: input.contentSummary } : undefined,
      storage_details: input.storageDetails ? { en: input.storageDetails } : undefined,
      location: input.storageLocation,
      quantity: input.quantity,
      category: input.category,
      tags: input.tags,
      image_url: input.imageUrl,
    })
    .eq('id', input.id)
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    number: data.id,
    description: (data.name as { en: string }).en,
    contentSummary: (data.description as { en: string }).en,
    storageDetails: (data.storage_details as { en: string })?.en || '',
    storageLocation: data.location || '',
    quantity: data.quantity || 0,
    category: data.category || '',
    tags: data.tags || [],
    imageUrl: data.image_url || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function deleteItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

export async function getItem(itemId: string): Promise<Item> {
  const { data, error } = await supabase
    .from('items')
    .select()
    .eq('id', itemId)
    .single();

  if (error) throw error;
  return {
    id: data.id,
    number: data.id,
    description: (data.name as { en: string }).en,
    contentSummary: (data.description as { en: string }).en,
    storageDetails: (data.storage_details as { en: string })?.en || '',
    storageLocation: data.location || '',
    quantity: data.quantity || 0,
    category: data.category || '',
    tags: data.tags || [],
    imageUrl: data.image_url || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getItems(filters?: ItemFilters): Promise<Item[]> {
  let query = supabase.from('items').select();

  if (filters?.search) {
    query = query.or(
      `name->en.ilike.%${filters.search}%,description->en.ilike.%${filters.search}%`
    );
  }

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.storageLocation) {
    query = query.eq('location', filters.storageLocation);
  }

  if (filters?.tags?.length) {
    query = query.contains('tags', filters.tags);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => ({
    id: item.id,
    number: item.id,
    description: (item.name as { en: string }).en,
    contentSummary: (item.description as { en: string }).en,
    storageDetails: (item.storage_details as { en: string })?.en || '',
    storageLocation: item.location || '',
    quantity: item.quantity || 0,
    category: item.category || '',
    tags: item.tags || [],
    imageUrl: item.image_url || '',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('items')
    .select('category')
    .order('category');

  if (error) throw error;
  return [...new Set(data.map((item) => item.category))];
}

export async function getStorageLocations(): Promise<string[]> {
  const { data, error } = await supabase
    .from('items')
    .select('location')
    .order('location');

  if (error) throw error;
  return [...new Set(data.map((item) => item.location))];
}

export async function getTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('items')
    .select('tags');

  if (error) throw error;
  return [...new Set(data.flatMap((item) => item.tags || []))];
} 