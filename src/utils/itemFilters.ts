
import { DBItem } from '@/integrations/supabase/items';
import { FilterState } from '../models/Item';

export const filterBySearch = (items: DBItem[], searchTerm: string): DBItem[] => {
  if (!searchTerm) return items;
  
  const searchLower = searchTerm.toLowerCase();
  return items.filter(item => 
    Object.values(item.name).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(searchLower)
    ) ||
    Object.values(item.description).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(searchLower)
    ) ||
    (item.location && item.location.toLowerCase().includes(searchLower))
  );
};

export const filterByCategory = (items: DBItem[], category: string): DBItem[] => {
  if (!category) return items;
  return items.filter(item => 
    item.category.toLowerCase() === category.toLowerCase()
  );
};

export const filterByTags = (items: DBItem[], tags: string[]): DBItem[] => {
  if (!tags.length) return items;
  return items.filter(item => 
    tags.some(tag => 
      item.tags.some(itemTag => itemTag.toLowerCase() === tag.toLowerCase())
    )
  );
};

export const filterByAvailability = (
  items: DBItem[],
  availability: 'all' | 'available' | 'unavailable'
): DBItem[] => {
  if (availability === 'all') return items;
  return items.filter(item => {
    if (availability === 'available') {
      return item.quantity > 0;
    }
    return item.quantity <= 0;
  });
};
