-- Créer la table visitors pour compter les visiteurs
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    visit_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes par date
CREATE INDEX IF NOT EXISTS idx_visitors_date ON visitors(visit_date);
CREATE INDEX IF NOT EXISTS idx_visitors_ip_date ON visitors(ip_address, visit_date);

-- Pas de RLS pour éviter les complications
ALTER TABLE visitors DISABLE ROW LEVEL SECURITY;