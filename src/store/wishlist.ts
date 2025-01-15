import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/types';

interface WishlistStore {
  items: Product[];
  loading: boolean;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  loadItems: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  loading: true,
  addItem: async (product) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .insert([{ product_id: product.id }]);

      if (error) throw error;

      set({ items: [...get().items, product] });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  },
  removeItem: async (productId) => {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('product_id', productId);

      if (error) throw error;

      set({ items: get().items.filter(item => item.id !== productId) });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  },
  loadItems: async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id, products (*)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const products = data.map(item => item.products);
      set({ items: products, loading: false });
    } catch (error) {
      console.error('Error loading wishlist:', error);
      set({ loading: false });
    }
  },
  isInWishlist: (productId) => {
    return get().items.some(item => item.id === productId);
  },
}));