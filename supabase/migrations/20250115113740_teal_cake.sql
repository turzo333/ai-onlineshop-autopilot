/*
  # Fix Reviews Schema and Relationships
  
  1. Changes
    - Fix foreign key relationship between reviews and auth.users
    - Add proper indexes for performance
    - Ensure proper cascading behavior
    - Add proper user reference for PostgREST
  
  2. Security
    - Maintain existing RLS policies
    - Add proper foreign key constraints
*/

-- Drop existing view if it exists
DROP VIEW IF EXISTS review_details;

-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Add foreign key reference to auth.users
ALTER TABLE reviews
  DROP CONSTRAINT IF EXISTS reviews_user_id_fkey,
  ADD CONSTRAINT reviews_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Add rating stats to products if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE products ADD COLUMN average_rating numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE products ADD COLUMN review_count integer DEFAULT 0;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
  DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;

  -- Create new policies
  CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Authenticated users can create reviews"
    ON reviews FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own reviews"
    ON reviews FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own reviews"
    ON reviews FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
END $$;

-- Create or replace function to update product rating stats
CREATE OR REPLACE FUNCTION update_product_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
    UPDATE products
    SET 
      average_rating = (
        SELECT COALESCE(AVG(rating)::numeric(3,2), 0)
        FROM reviews
        WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
      )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_product_rating_on_review_insert ON reviews;
DROP TRIGGER IF EXISTS update_product_rating_on_review_delete ON reviews;

-- Create triggers to update product rating stats
CREATE TRIGGER update_product_rating_on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating_stats();

CREATE TRIGGER update_product_rating_on_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating_stats();

-- Create view for PostgREST to properly handle auth.users relationship
CREATE VIEW review_details AS
SELECT 
  r.*,
  u.email as user_email,
  u.id as user_id
FROM reviews r
JOIN auth.users u ON r.user_id = u.id;