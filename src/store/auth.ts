import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  checkAdminStatus: (userId: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  checkAdminStatus: async (userId: string) => {
    try {
      const { data } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId);
      
      const isAdmin = Array.isArray(data) && data.length > 0;
      set({ isAdmin });
      return isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // Check admin status
    const isAdmin = await get().checkAdminStatus(data.user.id);

    set({ 
      user: data.user, 
      session: data.session,
      isAdmin
    });
  },
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user, session: data.session, isAdmin: false });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isAdmin: false });
  },
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    let isAdmin = false;
    if (session?.user) {
      isAdmin = await get().checkAdminStatus(session.user.id);
    }

    set({ 
      user: session?.user ?? null,
      session,
      loading: false,
      isAdmin
    });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const isAdmin = session?.user ? await get().checkAdminStatus(session.user.id) : false;
      set({ 
        user: session?.user ?? null,
        session,
        isAdmin
      });
    });
  },
}));