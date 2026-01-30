-- Supprimer la table existante et la recréer
DROP TABLE IF EXISTS hero_video CASCADE;

-- Créer la table hero_video avec la structure correcte
CREATE TABLE hero_video (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Désactiver RLS pour simplifier
ALTER TABLE hero_video DISABLE ROW LEVEL SECURITY;