/*
  # Create Admin User and Permissions
  
  1. Changes
    - Create admin user with email admin@example.com
    - Set up admin role and permissions
    - Add RLS policies for admin access
  
  2. Security
    - Proper role-based access control
    - Secure admin permissions
*/

-- Create admin user if not exists
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Insert admin user into auth.users if not exists
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User"}',
    'authenticated',
    'authenticated'
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO admin_id;

  -- Add admin role if user was created
  IF admin_id IS NOT NULL THEN
    INSERT INTO admin_users (user_id, role)
    VALUES (admin_id, 'super_admin')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Ensure proper RLS policies for admin access
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
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
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
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
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
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
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
        SELECT 1 FROM admin_users
        WHERE user_id = auth.uid()
      )
    );
END $$;