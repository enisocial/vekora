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

-- RLS pour whatsapp_config
ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;

-- Policies pour whatsapp_config
CREATE POLICY "WhatsApp config is viewable by everyone" 
    ON whatsapp_config FOR SELECT USING (true);

CREATE POLICY "WhatsApp config is insertable by admins only" 
    ON whatsapp_config FOR INSERT 
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "WhatsApp config is updatable by admins only" 
    ON whatsapp_config FOR UPDATE 
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "WhatsApp config is deletable by admins only" 
    ON whatsapp_config FOR DELETE 
    USING (auth.jwt() ->> 'role' = 'admin');