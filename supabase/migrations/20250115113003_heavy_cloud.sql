/*
  # Create store settings table

  1. New Tables
    - `store_settings`
      - `id` (uuid, primary key)
      - `store_name` (text)
      - `contact_email` (text)
      - `currency` (text)
      - `timezone` (text)
      - `order_prefix` (text)
      - `notification_email` (text)
      - `enable_inventory_alerts` (boolean)
      - `low_stock_threshold` (integer)
      - `enable_order_notifications` (boolean)
      - `enable_customer_reviews` (boolean)
      - `maintenance_mode` (boolean)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `store_settings` table
    - Add policy for admin users to manage settings
*/

-- Create store settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text NOT NULL DEFAULT 'EcoShop',
  contact_email text,
  currency text NOT NULL DEFAULT 'USD',
  timezone text NOT NULL DEFAULT 'UTC',
  order_prefix text NOT NULL DEFAULT 'ECO-',
  notification_email text,
  enable_inventory_alerts boolean NOT NULL DEFAULT true,
  low_stock_threshold integer NOT NULL DEFAULT 5,
  enable_order_notifications boolean NOT NULL DEFAULT true,
  enable_customer_reviews boolean NOT NULL DEFAULT true,
  maintenance_mode boolean NOT NULL DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin users can manage store settings"
  ON store_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Insert default settings
INSERT INTO store_settings (
  store_name,
  contact_email,
  currency,
  timezone,
  order_prefix,
  notification_email,
  enable_inventory_alerts,
  low_stock_threshold,
  enable_order_notifications,
  enable_customer_reviews,
  maintenance_mode
) VALUES (
  'EcoShop',
  NULL,
  'USD',
  'UTC',
  'ECO-',
  NULL,
  true,
  5,
  true,
  true,
  false
) ON CONFLICT DO NOTHING;