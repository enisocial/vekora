-- Script SQL complet pour ajouter toutes les colonnes manquantes
-- Exécuter dans Supabase SQL Editor

-- Ajouter la colonne pour les images multiples
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS additional_images TEXT[] DEFAULT '{}';

-- Ajouter les colonnes pour produits vedettes et prix promotionnel
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS promotional_price DECIMAL(10,2) DEFAULT NULL;

-- Mettre à jour les produits existants avec des valeurs par défaut
UPDATE products 
SET additional_images = '{}' 
WHERE additional_images IS NULL;

UPDATE products 
SET is_featured = false 
WHERE is_featured IS NULL;

-- Vérifier les colonnes ajoutées
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('additional_images', 'is_featured', 'promotional_price');