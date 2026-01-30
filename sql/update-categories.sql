-- Mise à jour de la table categories pour ajouter slug et image_url
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Fonction pour générer un slug à partir du nom
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                unaccent(input_text), 
                '[^a-zA-Z0-9\s]', '', 'g'
            ), 
            '\s+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Mettre à jour les slugs existants si des catégories existent déjà
UPDATE categories 
SET slug = generate_slug(name) 
WHERE slug IS NULL;

-- Trigger pour générer automatiquement le slug lors de l'insertion/mise à jour
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

-- Index pour les performances sur le slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);