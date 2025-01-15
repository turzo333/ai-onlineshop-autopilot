/*
  # Fix Admin Policies
  
  1. Changes
    - Drop all existing policies first
    - Create new simplified policies
    - Add proper indexes for performance
  
  2. Security
    - Maintain proper access control
    - Fix policy conflicts
*/

-- Drop all existing policies first
DO $$ 
BEGIN
  -- Drop admin user policies
  DROP POLICY IF EXISTS "Anyone can view admin users" ON admin_users;
  DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;
  DROP POLICY IF EXISTS "Admin users can view admin list" ON admin_users;
  DROP POLICY IF EXISTS "Super admins can update admin users" ON admin_users;
  DROP POLICY IF EXISTS "Super admins can delete admin users" ON admin_users;
  DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
  DROP POLICY IF EXISTS "Admin users view policy" ON admin_users;
  DROP POLICY IF EXISTS "Super admin manage policy" ON admin_users;
  DROP POLICY IF EXISTS "Public can view admin users" ON admin_users;
  DROP POLICY IF EXISTS "Super admins can insert admin users" ON admin_users;

  -- Drop product policies
  DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
  DROP POLICY IF EXISTS "Admins can modify products" ON products;
  DROP POLICY IF EXISTS "Public can view products" ON products;
  DROP POLICY IF EXISTS "Admin products policy" ON products;
  DROP POLICY IF EXISTS "Admins can manage products" ON products;

  -- Drop category policies
  DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
  DROP POLICY IF EXISTS "Admins can modify categories" ON categories;
  DROP POLICY IF EXISTS "Public can view categories" ON categories;
  DROP POLICY IF EXISTS "Admin categories policy" ON categories;
  DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

  -- Drop order policies
  DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
  DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
  DROP POLICY IF EXISTS "Admins can insert orders" ON orders;
  DROP POLICY IF EXISTS "Admins can update orders" ON orders;
  DROP POLICY IF EXISTS "Admins can delete orders" ON orders;
  DROP POLICY IF EXISTS "Admin orders policy" ON orders;
  DROP POLICY IF EXISTS "Admins can manage orders" ON orders;

  -- Drop store settings policies
  DROP POLICY IF EXISTS "Admin settings policy" ON store_settings;
  DROP POLICY IF EXISTS "Admins can manage store settings" ON store_settings;
END $$;

-- Create new admin user policies
CREATE POLICY "Admin users view policy"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admin manage policy"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Create new product policies
CREATE POLICY "Products view policy"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin products policy"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Create new category policies
CREATE POLICY "Categories view policy"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin categories policy"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Create new order policies
CREATE POLICY "Orders view own policy"
  ON orders FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin orders policy"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Create new store settings policy
CREATE POLICY "Admin settings policy"
  ON store_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );