# Configuration WhatsApp - Instructions Supabase

## 1. Créer la table dans Supabase

1. **Aller sur https://supabase.com/dashboard**
2. **Sélectionner votre projet** (tpynfipijskhhinlmlco)
3. **Aller dans "SQL Editor"**
4. **Exécuter ce script SQL :**

```sql
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

-- Désactiver RLS pour cette table (pour simplifier)
ALTER TABLE whatsapp_config DISABLE ROW LEVEL SECURITY;
```

## 2. Après avoir exécuté le script

1. **Le panel admin WhatsApp** fonctionnera sans erreur 500
2. **Configurer votre numéro** (ex: +237123456789)
3. **Activer** en cochant "Actif"
4. **Le bouton flottant** apparaîtra automatiquement sur le site

## 3. Test

- **Admin** : https://vekora.netlify.app/admin (section WhatsApp)
- **Site client** : https://vekora.netlify.app/ (bouton flottant en bas à droite)