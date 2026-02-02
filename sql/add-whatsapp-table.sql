-- Créer la table whatsapp_config
CREATE TABLE IF NOT EXISTS whatsapp_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) NOT NULL,
    message TEXT DEFAULT 'Bonjour, je suis intéressé par vos produits',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger pour updated_at
CREATE TRIGGER update_whatsapp_config_updated_at 
    BEFORE UPDATE ON whatsapp_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS activé mais avec politiques permissives
ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;

-- Politique permissive pour lecture (tout le monde)
CREATE POLICY "whatsapp_config_select" ON whatsapp_config FOR SELECT USING (true);

-- Politique permissive pour écriture (service role)
CREATE POLICY "whatsapp_config_insert" ON whatsapp_config FOR INSERT WITH CHECK (true);
CREATE POLICY "whatsapp_config_update" ON whatsapp_config FOR UPDATE USING (true);
CREATE POLICY "whatsapp_config_delete" ON whatsapp_config FOR DELETE USING (true);