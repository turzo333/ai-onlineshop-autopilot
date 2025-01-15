/*
  # Add sample products and categories

  1. Sample Data
    - Add 4 main product categories
    - Add 12 sample products across categories
*/

-- Insert categories
INSERT INTO categories (name, slug) VALUES
  ('Electronics', 'electronics'),
  ('Clothing', 'clothing'),
  ('Home & Garden', 'home-garden'),
  ('Books', 'books');

-- Insert products
INSERT INTO products (name, description, price, image_url, stock, category_id) VALUES
  ('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 50, (SELECT id FROM categories WHERE slug = 'electronics')),
  ('Smart Watch', 'Modern smartwatch with health tracking features', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 30, (SELECT id FROM categories WHERE slug = 'electronics')),
  ('Cotton T-Shirt', 'Comfortable 100% cotton t-shirt', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 100, (SELECT id FROM categories WHERE slug = 'clothing')),
  ('Denim Jacket', 'Classic denim jacket for all seasons', 89.99, 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2', 45, (SELECT id FROM categories WHERE slug = 'clothing')),
  ('Indoor Plant', 'Low-maintenance indoor plant in ceramic pot', 34.99, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411', 25, (SELECT id FROM categories WHERE slug = 'home-garden')),
  ('Garden Tools Set', 'Complete set of essential garden tools', 79.99, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b', 20, (SELECT id FROM categories WHERE slug = 'home-garden')),
  ('Best-Selling Novel', 'Award-winning contemporary fiction novel', 24.99, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', 75, (SELECT id FROM categories WHERE slug = 'books')),
  ('Cookbook', 'Collection of gourmet recipes', 39.99, 'https://images.unsplash.com/photo-1589998059171-988d887df646', 40, (SELECT id FROM categories WHERE slug = 'books')),
  ('Laptop Stand', 'Ergonomic aluminum laptop stand', 49.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', 60, (SELECT id FROM categories WHERE slug = 'electronics')),
  ('Running Shoes', 'Lightweight performance running shoes', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 80, (SELECT id FROM categories WHERE slug = 'clothing')),
  ('Throw Pillows Set', 'Decorative throw pillows set of 2', 44.99, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6', 35, (SELECT id FROM categories WHERE slug = 'home-garden')),
  ('Self-Help Book', 'Bestselling personal development book', 19.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c', 90, (SELECT id FROM categories WHERE slug = 'books'));