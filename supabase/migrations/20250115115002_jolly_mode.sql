/*
  # Fix Admin Policies
  
  1. Changes
    - Simplify admin policies to prevent recursion
    - Create function to check admin status
    - Update all admin-related policies
  
  2. Security
    - Maintain proper access control
    - Fix infinite recursion issues
*/

-- Create function to check admin status
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check super admin status
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = $1
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies
DO $$
BEGIN
  -- Admin Users
  DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
  DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;
  
  -- Products
  DROP POLICY IF EXISTS "Admins can manage products" ON products;
  
  -- Categories
  DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
  
  -- Orders
  DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
  
  -- Store Settings
  DROP POLICY IF EXISTS "Admins can manage store settings" ON store_settings;
END $$;

-- Create new policies using the helper functions
CREATE POLICY "Admin users view policy"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Super admin manage policy"
  ON admin_users FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Admin products policy"
  ON products FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin categories policy"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin orders policy"
  ON orders FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admin settings policy"
  ON store_settings FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));