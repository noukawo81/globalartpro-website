import { MongoClient } from 'mongodb';

async function testMongoConnection() {
  // URI directement depuis le .env
  const uri = 'mongodb+srv://tekeu_user:Gapmoctar_81@cluster0.nwisa7h.mongodb.net/';

  console.log('🔄 Test de connexion à MongoDB...');
  console.log('URI: mongodb+srv://tekeu_user:****@cluster0.nwisa7h.mongodb.net/');

  try {
    const client = new MongoClient(uri);
    await client.connect();

    console.log('✅ Connexion réussie à MongoDB');

    // Tester l'accès à la base de données
    const db = client.db('globalartpro');
    console.log('📊 Base de données: globalartpro');

    const collections = await db.collections();
    console.log('📋 Collections trouvées:', collections.map(c => c.collectionName));

    // Tester quelques collections importantes
    const testCollections = async (collectionName) => {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        console.log(`📄 ${collectionName}: ${count} documents`);

        // Afficher un exemple de document si disponible
        if (count > 0) {
          const sample = await collection.findOne({});
          console.log(`   Exemple: ${JSON.stringify(sample, null, 2).substring(0, 200)}...`);
        }
      } catch (error) {
        console.log(`📄 ${collectionName}: Erreur - ${error.message}`);
      }
    };

    await testCollections('users');
    await testCollections('payments');
    await testCollections('artworks');

    await client.close();
    console.log('✅ Test terminé avec succès');

  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testMongoConnection();