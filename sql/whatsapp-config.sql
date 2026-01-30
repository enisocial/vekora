-- Table pour la configuration WhatsApp Business
CREATE TABLE IF NOT EXISTS whatsapp_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT NOT NULL,
    message_template TEXT DEFAULT 'Bonjour, je suis intéressé par vos produits sur Vekora.',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Désactiver RLS pour simplifier
ALTER TABLE whatsapp_config DISABLE ROW LEVEL SECURITY;