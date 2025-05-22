export interface Item {
  id: string;
  number: string;
  name: {
    en: string;
  };
  description: {
    en: string;
  };
  contentSummary: string;
  storageDetails: {
    en: string;
  };
  storageLocation: string;
  quantity: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Alias for backward compatibility
export type DBItem = Item;

export interface CreateItemInput {
  name: {
    en: string;
  };
  description: {
    en: string;
  };
  contentSummary: string;
  storageDetails: {
    en: string;
  };
  storageLocation: string;
  quantity: number;
  category: string;
  tags: string[];
  imageUrl?: string;
}

export interface UpdateItemInput {
  id: string;
  name?: {
    en: string;
  };
  description?: {
    en: string;
  };
  contentSummary?: string;
  storageDetails?: {
    en: string;
  };
  storageLocation?: string;
  quantity?: number;
  category?: string;
  tags?: string[];
  imageUrl?: string;
}

export interface ItemFilters {
  search?: string;
  category?: string;
  storageLocation?: string;
  tags?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  inStock?: boolean;
} 