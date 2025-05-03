
import { DBItem } from '@/integrations/supabase/items';

export const sortByName = (items: DBItem[]): DBItem[] => {
  return [...items].sort((a, b) => {
    const aName = a.name.en || Object.values(a.name)[0];
    const bName = b.name.en || Object.values(b.name)[0];
    return String(aName).localeCompare(String(bName));
  });
};

export const sortByQuantity = (items: DBItem[]): DBItem[] => {
  return [...items].sort((a, b) => b.quantity - a.quantity);
};

export const sortByNewest = (items: DBItem[]): DBItem[] => {
  return [...items].sort((a, b) => {
    // Using created_at instead of updated_at, and adding fallback for items without a date
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
};
