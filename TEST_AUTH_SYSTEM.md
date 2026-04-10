/**
 * GUIDE DE TEST - SYSTÈME D'AUTHENTIFICATION GLOBAL ARTPRO
 * =========================================================
 */

const TEST_GUIDE = `
## ✅ SYSTÈME D'AUTHENTIFICATION - FLUX COMPLET

### 1. INSCRIPTION (Register)
- URL: /register
- Validation: Email, Username (min 3), Password (8 car, 1 maj, 1 min, 1 chiffre)
- Actions:
  1. Remplir le formulaire
  2. Clic "S'inscrire"
  3. ➡️ Revenir à "Vérifier l'email"
  4. Attendre 📧 EMAIL avec code 6 chiffres
  5. Entrer le code
  6. ✅ Redirection vers login

### 2. VÉRIFICATION D'EMAIL
- Code: 6 chiffres
- Expiration: 15 minutes
- Tentatives: 3 essais
- Renvoi: Possible après 60 secondes
- Stockage: En mémoire (serveur)
- 📧 Email envoyé via /api/email

### 3. CONNEXION (Login)
- URL: /login
- Sortie: Email + mot de passe
- Si email non vérifié:
  ➡️ Voir écran de vérification d'email
  ➡️ Après vérification: Connexion auto
- Sécurité: 5 tentatives max, puis 30 min de blocage

### 4. MOT DE PASSE OUBLIÉ
- URL: /forgot-password
- Flux en 3 étapes:
  1️⃣  Email → Recevoir code
  2️⃣  Code → Vérifier
  3️⃣  Nouveau mot de passe → Réinitialiser
- 📧 Email envoyé via /api/email
- Code: Expire après 15 min
- Renvoi: Possible après 60 secondes

---

## 📧 SYSTÈME D'EMAIL

### Fichiers importants:
- /lib/emailService.ts - Templates HTML
- /app/api/email/route.ts - Endpoint d'envoi
- /app/api/security/route.ts - Génération et envoi de codes

### EN DÉVELOPPEMENT:
- Les emails sont loggés dans la console serveur
- Format: "📧 Code de vérification pour user@email.com: 123456"

### EN PRODUCTION:
1. Installer: npm install nodemailer
2. Variables env:
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_USER
   - SMTP_PASS
3. Utiliser un service: SendGrid, Resend, AWS SES

---

## 🔐 SÉCURITÉ IMPLÉMENTÉE

✅ Détection de fraude (IP, Device, Email)
✅ Rate limiting pour:
  - Tentatives d'inscription
  - Tentatives de vérification
  - Tentatives de connexion
✅ Codes stockés en mémoire avec expiration
✅ Fingerprint device pour fraude détection
✅ Événements de sécurité loggés
✅ Tentatives limitées par action

---

## 🧪 TESTS À FAIRE

### Test 1: Flux complet d'inscription
[ ] Accéder à /register
[ ] Remplir le formulaire valide
[ ] Clik "S'inscrire"
[ ] Voir message "Vérifiez votre email"
[ ] Vérifier console serveur pour le code
[ ] Entrer le code
[ ] Voir succès et redirection
[ ] Vérifier dans localStorage que l'utilisateur est sauvegardé

### Test 2: Vérification échouée
[ ] Entrer un mauvais code (3 fois)
[ ] Voir erreur: "Trop d'erreurs"
[ ] Vérifier "Renvoyer le code"
[ ] Recevoir nouveau code

### Test 3: Connexion après vérification
[ ] Aller à /login
[ ] Entrer email et mot de passe
[ ] Vérifier que la connexion réussit
[ ] Vérifier que l'utilisateur est dans localStorage

### Test 4: Mot de passe oublié
[ ] Aller à /forgot-password
[ ] Entrer email
[ ] Vérifier console pour le code
[ ] Entrer le code
[ ] Entrer nouveau mot de passe
[ ] Vérifier succès
[ ] Tester connexion avec nouveau mot de passe

### Test 5: Sécurité
[ ] Faire 5 connexions échouées
[ ] Vérifier le blocage 30 min
[ ] Attendre ou recharger la page
[ ] Vérifier le déblocage

---

## 📝 VARIABLES D'ENVIRONNEMENT

Créer .env.local:
\`\`\`
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

---

## 🚀 LANCEMENT

\`\`\`bash
cd site-web
npm install
npm run dev
# Serveur: http://localhost:3000
# Console: Voir les logs des emails ✉️
\`\`\`

---

## 📋 PROBLÈMES RÉSOLUS ✅

1. ❌ Les emails n'étaient pas envoyés
   ✅ FIXÉ: Ajouté appels à /api/email

2. ❌ Pas de page "Mot de passe oublié"
   ✅ FIXÉ: Page créée + lien ajouté dans login

3. ❌ Codes de vérification juste loggés
   ✅ FIXÉ: Maintenant envoyés via email HTML

4. ❌ Pas de service d'email
   ✅ FIXÉ: /api/email créée avec templates HTML

---

## 📞 SUPPORT

### Erreurs couantes:

1. "Code expiré"
   → Faire renvoi du code (attend 60 sec)

2. "Veuillez attendre avant redemander"
   → Attendre 60 secondes

3. "Trop de tentatives"
   → Refaire une nouvelle inscription
   → Attendre 1 heure (pour la sécurité)

4. Pas de console log du code
   → Vérifier console.log du serveur
   → Format: "📧 Code de vérification..."

`;

console.log(TEST_GUIDE);
export default TEST_GUIDE;
