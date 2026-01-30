-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Allow public read access on hero_video" ON hero_video;
DROP POLICY IF EXISTS "Allow admin write access on hero_video" ON hero_video;

-- Politique pour permettre la lecture à tous
CREATE POLICY "Allow public read access on hero_video" ON hero_video
    FOR SELECT USING (true);

-- Politique temporaire pour permettre l'écriture à tous (à sécuriser plus tard)
CREATE POLICY "Allow public write access on hero_video" ON hero_video
    FOR ALL USING (true);