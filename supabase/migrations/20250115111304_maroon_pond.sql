/*
  # Fix order items RLS policy

  1. Security Changes
    - Add INSERT policy for order_items table to allow authenticated users to create order items
    - Policy ensures users can only insert items for their own orders
*/

CREATE POLICY "Users can insert their own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );