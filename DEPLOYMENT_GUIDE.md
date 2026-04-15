# 🚀 ÉTAPE 2: DÉPLOIEMENT EN PRODUCTION

## Prérequis pour le Déploiement

### 1. **Variables d'Environnement**
Créer un fichier `.env.production` avec:

```bash
# Pi Network Configuration
PI_PRIVATE_SEED=your-production-private-seed-here
NEXT_PUBLIC_PI_SANDBOX=false

# Database
MONGODB_URI=mongodb+srv://your-production-connection-string

# Email Service (optionnel)
EMAIL_SERVICE_API_KEY=your-email-service-key
```

### 2. **Configuration Next.js**
Modifier `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... existing config

  // Pi Network CORS domains
  async headers() {
    return [
      {
        source: '/api/pi/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production'
              ? 'https://www.globalartpro.com'
              : 'http://localhost:3000'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, GET, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type'
          }
        ]
      }
    ]
  }
}

export default nextConfig
```

### 3. **Build et Déploiement**

```bash
# Build pour production
npm run build

# Démarrer en production
npm start
```

### 4. **Vérification Post-Déploiement**

- [ ] ✅ Site accessible sur https://www.globalartpro.com
- [ ] ✅ Pi SDK chargé correctement
- [ ] ✅ Paiements Pi fonctionnels
- [ ] ✅ Logs serveur visibles

---

## 📊 Monitoring en Production

### Logs à Surveiller
```bash
# Dans la console serveur, chercher:
[PI PAYMENT] ✅ Payment COMPLETED successfully
[PI CONTEXT] ✅ Pi SDK initialized successfully
```

### Métriques Clés
- Taux de succès des paiements Pi
- Temps moyen de complétion (< 10 secondes)
- Nombre d'expirations (devrait être 0)

---

**Status**: ⏳ Prêt pour déploiement  
**Temps estimé**: 15-30 minutes