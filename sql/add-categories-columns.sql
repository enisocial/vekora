-- Script à exécuter dans le SQL Editor de Supabase
-- pour ajouter les colonnes manquantes à la table categories

-- 1. Ajouter les colonnes slug et image_url
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS slug VARCHAR(100),
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Créer un index unique sur slug (après avoir généré les slugs)
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 3. Fonction pour générer un slug à partir du nom
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                input_text, 
                '[^a-zA-Z0-9\s]', '', 'g'
            ), 
            '\s+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- 4. Mettre à jour les slugs existants
UPDATE categories 
SET slug = generate_slug(name) 
WHERE slug IS NULL;

-- 5. Maintenant créer l'index unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 6. Trigger pour générer automatiquement le slug
CREATE OR REPLACE FUNCTION set_category_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug = generate_slug(NEW.name);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER category_slug_trigger
    BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION set_category_slug();

-- 7. Vérifier le résultat
SELECT id, name, slug, image_url FROM categories;