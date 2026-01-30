-- Script pour nettoyer complètement la base de données

-- Supprimer tous les produits existants
DELETE FROM product_images;
DELETE FROM products;

-- Vérifier que les tables sont vides
SELECT COUNT(*) as products_count FROM products;
SELECT COUNT(*) as images_count FROM product_images;