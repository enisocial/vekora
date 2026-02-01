-- Ajouter les colonnes pour produits en avant et prix promotionnel
ALTER TABLE products 
ADD COLUMN is_featured BOOLEAN DEFAULT false,
ADD COLUMN promotional_price DECIMAL(10,2) DEFAULT NULL;