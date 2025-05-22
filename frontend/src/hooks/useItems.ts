import { useState, useEffect, useCallback } from 'react';
import { Item, ItemFilters } from '@/types/item';
import { getItems } from '@/lib/api/items';
import { toast } from 'sonner';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async (filters?: ItemFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const itemsData = await getItems(filters);
      setItems(itemsData);
      setFilteredItems(itemsData);
    } catch (err) {
      console.error('Failed to load items:', err);
      setError('Failed to load items');
      toast.error('Failed to load items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleFilterChange = useCallback((filters: ItemFilters) => {
    loadItems(filters);
  }, [loadItems]);

  return {
    items: filteredItems,
    isLoading,
    error,
    handleFilterChange,
    refreshItems: () => loadItems()
  };
};
