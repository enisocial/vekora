-- Fix RLS policies for orders to allow public order creation

-- Drop existing order policies
DROP POLICY IF EXISTS "Orders are viewable by admins only" ON orders;
DROP POLICY IF EXISTS "Orders are insertable by everyone" ON orders;
DROP POLICY IF EXISTS "Orders are updatable by admins only" ON orders;

DROP POLICY IF EXISTS "Order items are viewable by admins only" ON order_items;
DROP POLICY IF EXISTS "Order items are insertable by everyone" ON order_items;

-- Create new policies for orders
CREATE POLICY "Orders are viewable by admins only" ON orders 
FOR SELECT USING (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Orders are insertable by everyone" ON orders 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders are updatable by admins only" ON orders 
FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM admins)
);

-- Create new policies for order_items
CREATE POLICY "Order items are viewable by admins only" ON order_items 
FOR SELECT USING (
  auth.uid() IN (SELECT id FROM admins)
);

CREATE POLICY "Order items are insertable by everyone" ON order_items 
FOR INSERT WITH CHECK (true);