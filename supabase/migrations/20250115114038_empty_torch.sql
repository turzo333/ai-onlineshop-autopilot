/*
  # Fix Reviews Schema and Relationships
  
  1. Changes
    - Create a proper view for reviews with user details
    - Add missing indexes
    - Ensure proper cascading behavior
  
  2. Security
    - Maintain existing RLS policies
    - Add proper foreign key constraints
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

-- Add missing indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_reviews_user_product ON reviews(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Update foreign key constraints if needed
DO $$ 
BEGIN
  -- Ensure proper cascade behavior
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'reviews_user_id_fkey'
  ) THEN
    ALTER TABLE reviews 
      DROP CONSTRAINT reviews_user_id_fkey,
      ADD CONSTRAINT reviews_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE;
  END IF;

  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'reviews_product_id_fkey'
  ) THEN
    ALTER TABLE reviews 
      DROP CONSTRAINT reviews_product_id_fkey,
      ADD CONSTRAINT reviews_product_id_fkey 
        FOREIGN KEY (product_id) 
        REFERENCES products(id) 
        ON DELETE CASCADE;
  END IF;
END $$;