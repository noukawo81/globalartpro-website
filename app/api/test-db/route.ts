import { NextResponse } from 'next/server';
import { getClientPromise } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🔄 Test de connexion MongoDB via API...');

    const client = await getClientPromise();
    const db = client.db('globalartpro');

    // Tester les collections
    const collections = await db.collections();
    const collectionNames = collections.map(c => c.collectionName);

    const results = {};

    // Tester quelques collections importantes
    for (const collectionName of ['users', 'payments', 'artworks']) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        results[collectionName] = {
          count,
          status: 'success'
        };

        if (count > 0) {
          const sample = await collection.findOne({});
          results[collectionName].sample = sample;
        }
      } catch (error) {
        results[collectionName] = {
          status: 'error',
          error: error.message
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Connexion MongoDB réussie',
      collections: collectionNames,
      details: results
    });

  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}