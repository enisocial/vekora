-- Supprimer la table si elle existe déjà
DROP TABLE IF EXISTS whatsapp_config CASCADE;

-- Créer la table whatsapp_config
CREATE TABLE whatsapp_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(50),
    message TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pas de RLS pour éviter les complications
ALTER TABLE whatsapp_config DISABLE ROW LEVEL SECURITY;