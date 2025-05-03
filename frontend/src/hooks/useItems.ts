
import { useState, useEffect } from 'react';
import { DBItem, fetchItems } from '@/integrations/supabase/items';
import { FilterOption, FilterState } from '../models/Item';
import { filterBySearch, filterByCategory, filterByTags, filterByAvailability } from '../utils/itemFilters';
import { sortByName, sortByQuantity, sortByNewest } from '../utils/itemSorting';
import { extractFilterOptions } from '../utils/itemFilterOptions';

export const useItems = () => {
  const [items, setItems] = useState<DBItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DBItem[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [tags, setTags] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const itemsData = await fetchItems();
        setItems(itemsData);
        setFilteredItems(itemsData);

        const { categories: extractedCategories, tags: extractedTags } = extractFilterOptions(itemsData);
        setCategories(extractedCategories);
        setTags(extractedTags);
      } catch (err) {
        setError('Failed to load items. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  const handleFilterChange = async (filters: FilterState) => {
    let result = [...items];
    
    // Apply filters
    result = filterBySearch(result, filters.search);
    result = filterByCategory(result, filters.category);
    result = filterByTags(result, filters.tags);
    result = filterByAvailability(result, filters.availability);
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'name':
          result = sortByName(result);
          break;
        case 'newest':
          result = sortByNewest(result);
          break;
        case 'quantity':
          result = sortByQuantity(result);
          break;
      }
    }
    
    setFilteredItems(result);
  };

  return {
    items,
    filteredItems,
    categories,
    tags,
    isLoading,
    error,
    handleFilterChange
  };
};
