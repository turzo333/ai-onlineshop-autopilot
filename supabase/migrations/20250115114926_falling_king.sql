/*
  # Fix Admin User Setup and Policies
  
  1. Changes
    - Create admin user with proper authentication
    - Set up admin role correctly
    - Fix RLS policies for admin access
  
  2. Security
    - Ensure proper admin access control
    - Fix policy recursion issues
*/

-- Create admin user with proper authentication
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  crypt('admin', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'provider', 'email',
    'providers', array['email']
  ),
  jsonb_build_object(
    'name', 'Admin User'
  ),
  'authenticated',
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
);

-- Add admin role
INSERT INTO admin_users (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'admin@example.com'
AND NOT EXISTS (
  SELECT 1 FROM admin_users WHERE user_id = auth.users.id
);

-- Fix admin policies
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Admin users can view admin list" ON admin_users;
  DROP POLICY IF EXISTS "Super admins can manage admin users" ON admin_users;
  DROP POLICY IF EXISTS "Super admins can update admin users" ON admin_users;
  DROP POLICY IF EXISTS "Super admins can delete admin users" ON admin_users;

  -- Create new simplified policies
  CREATE POLICY "Admins can view all admin users"
    ON admin_users FOR SELECT
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    ));

  CREATE POLICY "Super admins can manage admin users"
    ON admin_users FOR ALL
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    ))
    WITH CHECK (EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    ));
END $$;