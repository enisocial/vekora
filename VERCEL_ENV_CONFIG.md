# Configuration des Variables d'Environnement sur Vercel

## Backend (vekora-b5w4.vercel.app)

Aller sur https://vercel.com/dashboard et sélectionner le projet backend, puis :

1. Aller dans Settings > Environment Variables
2. Ajouter ces variables :

```
SUPABASE_URL=https://tpynfipijskhhinlmlco.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRweW5maXBpanNraGhpbmxtbGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MDI2MjMsImV4cCI6MjA4NTE3ODYyM30.UAf1Zmxn2B_m0SSD_G85a4R2wlBYMwIunlGDAJcHRwM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRweW5maXBpanNraGhpbmxtbGNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTYwMjYyMywiZXhwIjoyMDg1MTc4NjIzfQ.zm-Zh1BUsK9ij3sQDqCEr_A1Thqz2aWM2R334aZecM8
PORT=5000
```

3. Redéployer le projet

## Frontend - IMPORTANT!

**Aller aussi sur le projet frontend sur Vercel et ajouter :**

```
VITE_API_URL=https://vekora-b5w4.vercel.app/api
```

Puis redéployer le frontend.

## Test après configuration

Tester l'API : https://vekora-b5w4.vercel.app/api/products
Tester le site : https://vekora-f8qv-ayyzxhg7a-tivi-ms-projects.vercel.app