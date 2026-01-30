-- Supabase PostgreSQL Schema for DeliverShop

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins table (for Supabase Auth)
CREATE TABLE admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_location TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for categories (admin only for modifications, public read)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are insertable by admins only" ON categories FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Categories are updatable by admins only" ON categories FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Categories are deletable by admins only" ON categories FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for products (admin only for modifications, public read)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by admins only" ON products FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Products are updatable by admins only" ON products FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Products are deletable by admins only" ON products FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for orders (admin can view all, customers can't see orders directly through API)
CREATE POLICY "Orders are viewable by admins only" ON orders FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Orders are insertable by everyone" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders are updatable by admins only" ON orders FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Policies for order_items (admin can view all, customers can't see order items directly through API)
CREATE POLICY "Order items are viewable by admins only" ON order_items FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Order items are insertable by everyone" ON order_items FOR INSERT WITH CHECK (true);

-- Storage bucket for products media
INSERT INTO storage.buckets (id, name, public)
VALUES ('products-media', 'products-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for products-media bucket
CREATE POLICY "Product media is viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'products-media');
CREATE POLICY "Product media is uploadable by admins only" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products-media' AND auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Product media is updatable by admins only" ON storage.objects FOR UPDATE USING (bucket_id = 'products-media' AND auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Product media is deletable by admins only" ON storage.objects FOR DELETE USING (bucket_id = 'products-media' AND auth.jwt() ->> 'role' = 'admin');