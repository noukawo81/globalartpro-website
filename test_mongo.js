import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

// Charger les variables d'environnement
config();

async function testMongoConnection() {
  const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ Aucune URI MongoDB trouvée dans les variables d\'environnement');
    console.log('Variables d\'environnement disponibles:');
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '✅ Défini' : '❌ Non défini');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '✅ Défini' : '❌ Non défini');
    return;
  }

  console.log('🔄 Test de connexion à MongoDB...');
  console.log('URI:', uri.replace(/:([^:@]{4})[^:@]*@/, ':$1****@')); // Masquer le mot de passe

  try {
    const client = new MongoClient(uri);
    await client.connect();

    console.log('✅ Connexion réussie à MongoDB');

    // Tester l'accès à la base de données
    const db = client.db('globalartpro');
    const collections = await db.collections();
    console.log('📊 Collections trouvées:', collections.map(c => c.collectionName));

    // Tester une collection spécifique
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log('👥 Nombre d\'utilisateurs:', userCount);

    // Tester les paiements
    const paymentsCollection = db.collection('payments');
    const paymentCount = await paymentsCollection.countDocuments();
    console.log('💰 Nombre de paiements:', paymentCount);

    await client.close();
    console.log('✅ Test terminé avec succès');

  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    console.error('Détails complets:', error);
  }
}

testMongoConnection();