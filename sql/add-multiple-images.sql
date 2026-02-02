-- Ajouter la colonne pour stocker plusieurs images
ALTER TABLE products 
ADD COLUMN additional_images TEXT[] DEFAULT '{}';