-- Fix RLS policies to check admin table instead of JWT role

-- Drop existing policies
DROP POLICY IF EXISTS "Categories are insertable by admins only" ON categories;
DROP POLICY IF EXISTS "Categories are updatable by admins only" ON categories;
DROP POLICY IF EXISTS "Categories are deletable by admins only" ON categories;

DROP POLICY IF EXISTS "Products are insertable by admins only" ON products;
DROP POLICY IF EXISTS "Products are updatable by admins only" ON products;
DROP POLICY IF EXISTS "Products are deletable by admins only" ON products;

DROP POLICY IF EXISTS "Orders are viewable by admins only" ON orders;
DROP POLICY IF EXISTS "Orders are updatable by admins only" ON orders;

DROP POLICY IF EXISTS "Order items are viewable by admins only" ON order_items;

DROP POLICY IF EXISTS "Product media is uploadable by admins only" ON storage.objects;
DROP POLICY IF EXISTS "Product media is updatable by admins only" ON storage.objects;
DROP POLICY IF EXISTS "Product media is deletable by admins only" ON storage.objects;

-- Create new policies that check the admins table
CREATE POLICY "Categories are insertable by admins only" ON categories 
FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Categories are updatable by admins only" ON categories 
FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Categories are deletable by admins only" ON categories 
FOR DELETE USING (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Products are insertable by admins only" ON products 
FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Products are updatable by admins only" ON products 
FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Products are deletable by admins only" ON products 
FOR DELETE USING (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Orders are viewable by admins only" ON orders 
FOR SELECT USING (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Orders are updatable by admins only" ON orders 
FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Order items are viewable by admins only" ON order_items 
FOR SELECT USING (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Product media is uploadable by admins only" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'products-media' AND auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Product media is updatable by admins only" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'products-media' AND auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Product media is deletable by admins only" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'products-media' AND auth.uid() IN (SELECT id FROM admins)
);