import { MongoClient } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const options = {};
let clientPromise: Promise<MongoClient> | undefined;

function getMongoUri() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please add your MongoDB URI to .env.local');
  }
  return process.env.DATABASE_URL;
}

function createClientPromise() {
  const uri = getMongoUri();
  const client = new MongoClient(uri, options);

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  return client.connect();
}

export function getClientPromise() {
  if (!clientPromise) {
    clientPromise = createClientPromise();
  }
  return clientPromise;
}

export async function connectToDatabase() {
  const client = await getClientPromise();
  return client.db();
}
