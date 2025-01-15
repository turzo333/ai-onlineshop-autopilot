import { User } from '@supabase/supabase-js';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  category_id: string | null;
  stock: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  shipping_address: string;
  customer: User;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'super_admin' | 'manager' | 'staff';
  created_at: string;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address: string;
  notes: string;
  segment: string;
  created_at: string;
  last_login: string;
  total_orders: number;
  total_spent: number;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  contact_email: string | null;
  currency: string;
  timezone: string;
  order_prefix: string;
  notification_email: string | null;
  enable_inventory_alerts: boolean;
  low_stock_threshold: number;
  enable_order_notifications: boolean;
  enable_customer_reviews: boolean;
  maintenance_mode: boolean;
  updated_at: string;
}