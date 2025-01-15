/*
  # Add Reviews System

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `user_id` (uuid, references auth.users)
      - `rating` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on reviews table
    - Add policies for:
      - Anyone can read reviews
      - Authenticated users can create reviews
      - Users can only edit/delete their own reviews

  3. Functions
    - Add function to calculate average rating
    - Add function to update product rating stats
*/

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Add rating stats to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS average_rating numeric,
ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create function to update product rating stats
CREATE OR REPLACE FUNCTION update_product_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update product stats for new review
    UPDATE products
    SET 
      average_rating = (
        SELECT AVG(rating)::numeric(3,2)
        FROM reviews
        WHERE product_id = NEW.product_id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = NEW.product_id
      )
    WHERE id = NEW.product_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update product stats after review deletion
    UPDATE products
    SET 
      average_rating = (
        SELECT AVG(rating)::numeric(3,2)
        FROM reviews
        WHERE product_id = OLD.product_id
      ),
      review_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE product_id = OLD.product_id
      )
    WHERE id = OLD.product_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update product rating stats
CREATE TRIGGER update_product_rating_on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating_stats();

CREATE TRIGGER update_product_rating_on_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating_stats();