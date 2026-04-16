import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { join } from 'path';

// Fonction pour charger les variables d'environnement depuis .env
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          envVars[key.trim()] = value.slice(1, -1);
        } else {
          envVars[key.trim()] = value;
        }
      }
    });

    return envVars;
  } catch (error) {
    console.error('Erreur lors du chargement du .env:', error.message);
    return {};
  }
}

async function testMongoConnection() {
  // Charger les variables d'environnement
  const envVars = loadEnv();
  const uri = envVars.DATABASE_URL || envVars.MONGODB_URI;

  console.log('🔍 Variables d\'environnement chargées:');
  console.log('- DATABASE_URL:', envVars.DATABASE_URL ? '✅ Présent' : '❌ Absent');
  console.log('- MONGODB_URI:', envVars.MONGODB_URI ? '✅ Présent' : '❌ Absent');

  if (!uri) {
    console.error('❌ Aucune URI MongoDB trouvée');
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

    // Tester quelques collections importantes
    const collectionsToTest = ['users', 'payments', 'artworks'];
    for (const collectionName of collectionsToTest) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        console.log(`📄 Collection '${collectionName}': ${count} documents`);
      } catch (error) {
        console.log(`📄 Collection '${collectionName}': Erreur - ${error.message}`);
      }
    }

    await client.close();
    console.log('✅ Test terminé avec succès');

  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testMongoConnection();