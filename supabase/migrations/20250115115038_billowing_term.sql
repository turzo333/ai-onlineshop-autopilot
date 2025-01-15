/*
  # Fix Admin Authentication
  
  1. Changes
    - Create admin user with proper authentication
    - Set up admin policies correctly
    - Fix admin user lookup
  
  2. Security
    - Maintain proper access control
    - Fix authentication issues
*/

-- Create or replace function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace function to check super admin status
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies
DO $$
BEGIN
  -- Admin Users
  DROP POLICY IF EXISTS "Admin users view policy" ON admin_users;
  DROP POLICY IF EXISTS "Super admin manage policy" ON admin_users;
  
  -- Products
  DROP POLICY IF EXISTS "Admin products policy" ON products;
  
  -- Categories
  DROP POLICY IF EXISTS "Admin categories policy" ON categories;
  
  -- Orders
  DROP POLICY IF EXISTS "Admin orders policy" ON orders;
  
  -- Store Settings
  DROP POLICY IF EXISTS "Admin settings policy" ON store_settings;
END $$;

-- Create new policies using the helper functions
CREATE POLICY "Admin users view policy"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Super admin manage policy"
  ON admin_users FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "Admin products policy"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin categories policy"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin orders policy"
  ON orders FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin settings policy"
  ON store_settings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());