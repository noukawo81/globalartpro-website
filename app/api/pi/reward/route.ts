import { NextRequest, NextResponse } from 'next/server';
import { getClientPromise } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, piUsername } = await request.json();

    if (!email || !piUsername) {
      return NextResponse.json({ error: 'Email and Pi username required' }, { status: 400 });
    }

    const client = await getClientPromise();
    const db = client.db('globalartpro'); // Remplacez par le nom de votre DB

    // Vérifier si l'utilisateur a déjà été récompensé pour ce Pi username
    const existingReward = await db.collection('pi_rewards').findOne({ email, piUsername });

    if (existingReward) {
      return NextResponse.json({ message: 'Already rewarded' });
    }

    // Créditer 10 ARTC
    await db.collection('users').updateOne(
      { email },
      { $inc: { artcBalance: 10 }, $set: { piUsername } },
      { upsert: true }
    );

    // Marquer comme récompensé
    await db.collection('pi_rewards').insertOne({ email, piUsername, rewardedAt: new Date() });

    return NextResponse.json({ message: 'Rewarded 10 ARTC' });
  } catch (error) {
    console.error('Error rewarding Pi user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}