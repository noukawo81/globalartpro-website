import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { senderEmail, recipientUsername, amount } = await request.json();

    if (!senderEmail || !recipientUsername || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Trouver l'expéditeur
    const sender = await usersCollection.findOne({ email: senderEmail });
    if (!sender) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Vérifier le solde
    if ((sender.artcBalance || 0) < amount) {
      return NextResponse.json({ error: 'Solde insuffisant' }, { status: 400 });
    }

    // Trouver le destinataire
    const recipient = await usersCollection.findOne({ username: recipientUsername });
    if (!recipient) {
      return NextResponse.json({ error: 'Destinataire non trouvé' }, { status: 404 });
    }

    // Mettre à jour les soldes
    await usersCollection.updateOne(
      { _id: sender._id },
      { $inc: { artcBalance: -amount } }
    );

    await usersCollection.updateOne(
      { _id: recipient._id },
      { $inc: { artcBalance: amount } }
    );

    // Enregistrer la transaction (optionnel)
    const transactionsCollection = db.collection('transactions');
    await transactionsCollection.insertOne({
      type: 'transfer',
      from: sender.username,
      to: recipientUsername,
      amount,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, message: 'Transfert réussi' });
  } catch (error) {
    console.error('Erreur lors du transfert:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}