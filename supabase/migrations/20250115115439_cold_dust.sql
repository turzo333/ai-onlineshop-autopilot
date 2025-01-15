/*
  # Fix Admin Policies
  
  1. Changes
    - Drop all existing policies
    - Create new non-recursive policies
    - Simplify policy structure
  
  2. Security
    - Maintain proper access control
    - Prevent policy recursion
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Admin users view policy" ON admin_users;
DROP POLICY IF EXISTS "Super admin manage policy" ON admin_users;
DROP POLICY IF EXISTS "Products view policy" ON products;
DROP POLICY IF EXISTS "Admin products policy" ON products;
DROP POLICY IF EXISTS "Categories view policy" ON categories;
DROP POLICY IF EXISTS "Admin categories policy" ON categories;
DROP POLICY IF EXISTS "Orders view own policy" ON orders;
DROP POLICY IF EXISTS "Admin orders policy" ON orders;
DROP POLICY IF EXISTS "Admin settings policy" ON store_settings;

-- Create new non-recursive policies
CREATE POLICY "Public admin users view"
  ON admin_users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Super admin insert"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admin update"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admin delete"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Create non-recursive policies for other tables
CREATE POLICY "Public products view"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin products manage"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public categories view"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin categories manage"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "User orders view"
  ON orders FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin orders manage"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin settings manage"
  ON store_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );