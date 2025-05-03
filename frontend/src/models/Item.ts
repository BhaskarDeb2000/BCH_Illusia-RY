
export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  quantity: number;
  imageUrl: string;
  storageDetails?: string;
  location?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterState {
  search: string;
  category: string;
  tags: string[];
  availability: 'all' | 'available' | 'unavailable';
  sortBy: 'name' | 'newest' | 'quantity';
}
