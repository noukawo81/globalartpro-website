# 🗄️ ÉTAPE 3: CONFIGURATION BASE DE DONNÉES

## Schéma MongoDB pour les Paiements Pi

### 1. **Collection: `payments`**
```javascript
// Créer cette collection dans MongoDB Atlas
{
  _id: ObjectId,
  paymentId: String,        // ID du paiement Pi Network
  txid: String,            // Transaction ID blockchain
  amount: Number,          // Montant en Pi
  memo: String,            // Description du paiement
  userId: String,          // ID utilisateur GlobalArtPro
  userEmail: String,       // Email utilisateur
  user_uid: String,        // UID Pi Network
  status: String,          // 'pending', 'approved', 'completed', 'failed'
  currency: String,        // 'Pi' ou 'ARTC'
  metadata: Object,        // Données supplémentaires
  createdAt: Date,
  approvedAt: Date,
  completedAt: Date,
  errorMessage: String      // Si échec
}
```

### 2. **Collection: `wallets`** (pour ARTC)
```javascript
{
  _id: ObjectId,
  userId: String,
  artcBalance: Number,
  piBalance: Number,       // Balance Pi synchronisée
  lastUpdated: Date,
  transactions: [{
    type: String,          // 'credit', 'debit', 'conversion'
    amount: Number,
    currency: String,
    paymentId: String,
    timestamp: Date
  }]
}
```

### 3. **Mise à Jour du Code API**

Modifier `app/api/pi/payment/route.ts`:

```typescript
// ... existing imports
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  // ... existing code

  switch (action) {
    case 'approve': {
      // ... existing approval code

      // ✅ ENREGISTRER DANS DB
      const client = await getClientPromise();
      const db = client.db('globalartpro');

      await db.collection('payments').insertOne({
        paymentId,
        amount,
        memo,
        userId: userId || user_uid,
        userEmail,
        user_uid,
        status: 'approved',
        currency: 'Pi',
        metadata: {
          itemId: 'from-metadata-if-needed',
          timestamp: Date.now()
        },
        createdAt: new Date(),
        approvedAt: new Date()
      });

      console.log('[DB] ✅ Payment approved and saved to database');

      // ... rest of approval code
    }

    case 'complete': {
      // ... existing completion code

      // ✅ METTRE À JOUR DANS DB
      const client = await getClientPromise();
      const db = client.db('globalartpro');

      await db.collection('payments').updateOne(
        { paymentId },
        {
          $set: {
            txid,
            status: 'completed',
            completedAt: new Date()
          }
        }
      );

      // ✅ CRÉDITER ARTC AU WALLET UTILISATEUR
      // Conversion Pi → ARTC (1 Pi = 1000 ARTC par exemple)
      const artcAmount = amount * 1000;

      await db.collection('wallets').updateOne(
        {
          $or: [
            { userId: userId || user_uid },
            { userEmail }
          ]
        },
        {
          $inc: { artcBalance: artcAmount },
          $push: {
            transactions: {
              type: 'credit',
              amount: artcAmount,
              currency: 'ARTC',
              paymentId,
              timestamp: new Date()
            }
          },
          $set: { lastUpdated: new Date() }
        },
        { upsert: true } // Créer wallet si inexistant
      );

      console.log('[DB] ✅ Payment completed, ARTC credited:', artcAmount);

      // ... rest of completion code
    }
  }
}
```

### 4. **API pour Récupérer l'Historique**

Créer `app/api/wallet/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getClientPromise } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    const client = await getClientPromise();
    const db = client.db('globalartpro');

    const wallet = await db.collection('wallets').findOne({ userId });
    const payments = await db.collection('payments')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      wallet: wallet || { artcBalance: 0, piBalance: 0 },
      payments
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
```

### 5. **Migration des Données Existantes**

Si vous avez des données existantes dans le Map en mémoire:

```typescript
// Script de migration (exécuter une fois)
import { getClientPromise } from '@/lib/mongodb';

async function migrateExistingPayments() {
  const client = await getClientPromise();
  const db = client.db('globalartpro');

  // Migrer les paiements du Map vers MongoDB
  // ... code de migration
}
```

### 6. **Index MongoDB** (Performance)

```javascript
// Créer ces index dans MongoDB Atlas
db.payments.createIndex({ paymentId: 1 }, { unique: true });
db.payments.createIndex({ userId: 1 });
db.payments.createIndex({ status: 1 });
db.wallets.createIndex({ userId: 1 }, { unique: true });
```

---

## 🔍 Vérification de la Configuration DB

### Test de Connexion
```javascript
// Dans la console Node.js
const { getClientPromise } = require('./lib/mongodb');
const client = await getClientPromise();
console.log('✅ MongoDB connected');
```

### Test d'Insertion
```javascript
// Tester l'insertion d'un paiement
const db = client.db('globalartpro');
await db.collection('payments').insertOne({
  paymentId: 'test_' + Date.now(),
  amount: 0.001,
  memo: 'Test payment',
  status: 'completed',
  createdAt: new Date()
});
console.log('✅ Test payment inserted');
```

---

**Status**: ⏳ Configuration requise  
**Temps estimé**: 30-45 minutes  
**Impact**: Historique persistant + crédits ARTC automatiques