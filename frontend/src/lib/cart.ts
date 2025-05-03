import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.id === newItem.id);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          };
        }
        
        return {
          items: [...state.items, newItem],
        };
      }),

      removeItem: (itemId) => set((state) => ({
        items: state.items.filter(item => item.id !== itemId),
      })),

      updateQuantity: (itemId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === itemId
            ? { ...item, quantity }
            : item
        ),
      })),

      clearCart: () => set({ items: [] }),

      getItemQuantity: (itemId) => {
        const item = get().items.find(item => item.id === itemId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
); 