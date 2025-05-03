export interface Item {
  id: string;
  number: string;
  description: string;
  contentSummary: string;
  storageDetails: string;
  storageLocation: string;
  quantity: number;
  category: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemInput {
  description: string;
  contentSummary: string;
  storageDetails: string;
  storageLocation: string;
  quantity: number;
  category: string;
  tags: string[];
  imageUrl?: string;
}

export interface UpdateItemInput {
  id: string;
  description?: string;
  contentSummary?: string;
  storageDetails?: string;
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
} 