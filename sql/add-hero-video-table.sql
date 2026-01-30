-- Création de la table hero_video
CREATE TABLE IF NOT EXISTS hero_video (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Politique RLS pour permettre la lecture publique
ALTER TABLE hero_video ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'hero_video' 
        AND policyname = 'Allow public read access on hero_video'
    ) THEN
        CREATE POLICY "Allow public read access on hero_video" ON hero_video
            FOR SELECT USING (true);
    END IF;
END $$;

-- Politique pour permettre l'écriture aux admins seulement
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'hero_video' 
        AND policyname = 'Allow admin write access on hero_video'
    ) THEN
        CREATE POLICY "Allow admin write access on hero_video" ON hero_video
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM admins 
                    WHERE admins.id = auth.uid()
                )
            );
    END IF;
END $$;

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_hero_video_updated_at ON hero_video;
CREATE TRIGGER update_hero_video_updated_at 
    BEFORE UPDATE ON hero_video 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();