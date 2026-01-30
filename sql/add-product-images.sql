-- Add support for multiple images per product

-- Create product_images table
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary);

-- RLS for product_images
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images are viewable by everyone" ON product_images FOR SELECT USING (true);
CREATE POLICY "Product images are insertable by admins only" ON product_images FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM admins)
);
CREATE POLICY "Product images are updatable by admins only" ON product_images FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM admins)
);
CREATE POLICY "Product images are deletable by admins only" ON product_images FOR DELETE USING (
  auth.uid() IN (SELECT id FROM admins)
);