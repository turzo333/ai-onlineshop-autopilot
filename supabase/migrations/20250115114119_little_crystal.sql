/*
  # Fix Reviews User Relationship
  
  1. Changes
    - Drop and recreate review_details view with proper user relationship
    - Add proper grants for the view
    - Ensure foreign key constraints are correct
  
  2. Security
    - Maintain existing RLS policies
    - Add proper view permissions
*/

-- Drop existing view if it exists
DROP VIEW IF EXISTS review_details;

-- Create view for PostgREST to properly handle auth.users relationship
CREATE OR REPLACE VIEW review_details AS
SELECT 
  r.id,
  r.product_id,
  r.user_id,
  r.rating,
  r.comment,
  r.created_at,
  u.email as user_email
FROM reviews r
JOIN auth.users u ON r.user_id = u.id;

-- Grant access to the view
GRANT SELECT ON review_details TO authenticated;
GRANT SELECT ON review_details TO anon;

-- Update the reviews table to ensure proper foreign key relationship
ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS reviews_user_id_fkey,
  ADD CONSTRAINT reviews_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Add index for the user_id column if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);