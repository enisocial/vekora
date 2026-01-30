-- Créer la table whatsapp_config
CREATE TABLE IF NOT EXISTS whatsapp_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone VARCHAR(20) NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT 'Bonjour, je suis intéressé par vos produits',
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer une configuration par défaut
INSERT INTO whatsapp_config (phone, message, is_active) 
VALUES ('', 'Bonjour, je suis intéressé par vos produits', false)
ON CONFLICT DO NOTHING;