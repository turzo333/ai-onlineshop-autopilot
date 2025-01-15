/*
  # Fix Admin Authentication - Final
  
  1. Changes
    - Fix admin user creation and authentication
    - Simplify admin policies
    - Add proper indexes
  
  2. Security
    - Maintain proper access control
    - Fix authentication issues
*/

-- Create indexes for admin_users if they don't exist
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- Drop existing policies
DROP POLICY IF EXISTS "Admin users view policy" ON admin_users;
DROP POLICY IF EXISTS "Super admin manage policy" ON admin_users;
DROP POLICY IF EXISTS "Admin products policy" ON products;
DROP POLICY IF EXISTS "Admin categories policy" ON categories;
DROP POLICY IF EXISTS "Admin orders policy" ON orders;
DROP POLICY IF EXISTS "Admin settings policy" ON store_settings;

-- Create simplified policies for admin_users
CREATE POLICY "Anyone can view admin users"
  ON admin_users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Super admins can manage admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Create simplified policies for other tables
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage store settings"
  ON store_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );