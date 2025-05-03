
import { DBItem } from '@/integrations/supabase/items';
import { FilterOption } from '../models/Item';

export const extractFilterOptions = (items: DBItem[]) => {
  const categoriesSet = new Set<string>();
  const tagsSet = new Set<string>();
  
  for (const item of items) {
    categoriesSet.add(item.category);
    item.tags.forEach(t => tagsSet.add(t));
  }
  
  const categories: FilterOption[] = Array.from(categoriesSet).map(category => ({
    value: category,
    label: category
  }));
  
  const tags: FilterOption[] = Array.from(tagsSet).map(tag => ({
    value: tag,
    label: tag
  }));
  
  return { categories, tags };
};
