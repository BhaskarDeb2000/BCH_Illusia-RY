import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  imageUrl?: string;
  maxQuantity: number; // Maximum available quantity
  price?: number;
  category?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.id === newItem.id);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + newItem.quantity;
          if (newQuantity > existingItem.maxQuantity) {
            throw new Error(`Cannot add more than ${existingItem.maxQuantity} items`);
          }
          
          return {
            items: state.items.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          };
        }
        
        return {
          items: [...state.items, { ...newItem, quantity: Math.min(newItem.quantity, newItem.maxQuantity) }],
        };
      }),

      removeItem: (itemId) => set((state) => ({
        items: state.items.filter(item => item.id !== itemId),
      })),

      updateQuantity: (itemId, quantity) => set((state) => {
        const item = state.items.find(item => item.id === itemId);
        if (!item) return state;
        
        if (quantity > item.maxQuantity) {
          throw new Error(`Cannot add more than ${item.maxQuantity} items`);
        }
        
        if (quantity < 1) {
          return {
            items: state.items.filter(item => item.id !== itemId),
          };
        }
        
        return {
          items: state.items.map(item =>
            item.id === itemId
              ? { ...item, quantity }
              : item
          ),
        };
      }),

      clearCart: () => set({ items: [] }),

      getItemQuantity: (itemId) => {
        const item = get().items.find(item => item.id === itemId);
        return item?.quantity || 0;
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
); 