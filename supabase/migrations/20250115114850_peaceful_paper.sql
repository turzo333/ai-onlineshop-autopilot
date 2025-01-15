/*
  # Fix Admin User Policies
  
  1. Changes
    - Fix infinite recursion in admin_users policies
    - Add proper RLS policies for admin access
    - Ensure proper access control for admin users
  
  2. Security
    - Prevent infinite recursion
    - Maintain secure access control
*/

-- Drop existing policies to clean up
DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;

-- Create new policies for admin_users
CREATE POLICY "Admin users can view admin list"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid()
      AND au.role = 'super_admin'
    )
  );

-- Ensure proper RLS policies for other tables
DO $$
BEGIN
  -- Products
  DROP POLICY IF EXISTS "Admins can manage products" ON products;
  CREATE POLICY "Admins can manage products"
    ON products
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admin_users au
        WHERE au.user_id = auth.uid()
      )
    );

  -- Categories
  DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
  CREATE POLICY "Admins can manage categories"
    ON categories
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admin_users au
        WHERE au.user_id = auth.uid()
      )
    );

  -- Orders
  DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
  CREATE POLICY "Admins can manage orders"
    ON orders
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admin_users au
        WHERE au.user_id = auth.uid()
      )
    );

  -- Store Settings
  DROP POLICY IF EXISTS "Admins can manage store settings" ON store_settings;
  CREATE POLICY "Admins can manage store settings"
    ON store_settings
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM admin_users au
        WHERE au.user_id = auth.uid()
      )
    );
END $$;