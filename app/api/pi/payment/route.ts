export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getClientPromise } from '@/lib/mongodb';

interface PiPaymentData {
  paymentId: string;
  txid?: string;
  amount: number;
  memo: string;
  userEmail?: string;
  userId?: string;
  user_uid?: string;
  timestamp: number;
}

const pendingPayments = new Map<string, PiPaymentData>();

async function verifyPiPayment(paymentId: string) {
  // TODO: Remplacer par la vérification réelle du SDK serveur Pi.
  // Exemple : const { PiServer } = await import('@pi/sdk');
  // return PiServer.verifyPayment(paymentId);
  return Boolean(paymentId);
}

async function updateUserToVip(client: any, payment: PiPaymentData) {
  const db = client.db('globalartpro'); // Ajustez le nom de la DB si nécessaire
  const identifier = payment.userId || payment.user_uid;

  if (payment.userEmail) {
    return db.collection('users').updateOne(
      { email: payment.userEmail },
      { $set: { isVip: true } }
    );
  }

  if (!identifier) {
    throw new Error('Missing user identifier for VIP update');
  }

  return db.collection('users').updateOne(
    { uid: identifier },
    { $set: { isVip: true } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, paymentId, txid, amount, memo, userEmail, userId, user_uid } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId manquant' }, { status: 400 });
    }

    switch (action) {
      case 'approve': {
        if (typeof amount !== 'number' || !memo) {
          return NextResponse.json({ error: 'Montant et mémo requis pour l’approbation' }, { status: 400 });
        }

        const paymentData: PiPaymentData = {
          paymentId,
          amount,
          memo,
          userEmail,
          userId,
          user_uid,
          timestamp: Date.now(),
        };

        pendingPayments.set(paymentId, paymentData);
        console.log('[PI PAYMENT] Server approval stored for payment:', paymentData);

        return NextResponse.json({ success: true, message: 'Server approval enregistré.' });
      }

      case 'complete': {
        let paymentData = pendingPayments.get(paymentId);

        if (!paymentData) {
          if (!amount || !memo || (!userEmail && !userId && !user_uid)) {
            return NextResponse.json({ error: 'Données de paiement manquantes pour compléter le paiement' }, { status: 400 });
          }

          paymentData = {
            paymentId,
            amount,
            memo,
            userEmail,
            userId,
            user_uid,
            timestamp: Date.now(),
          };
        }

        const paymentValid = await verifyPiPayment(paymentId);
        if (!paymentValid) {
          return NextResponse.json({ error: 'Paiement Pi invalide ou non vérifié' }, { status: 400 });
        }

        paymentData.txid = txid;
        pendingPayments.set(paymentId, paymentData);

        const client = await getClientPromise();

        try {
          await updateUserToVip(client, paymentData);
        } catch (error) {
          console.error('[PI PAYMENT] Erreur mise à jour VIP :', error);
          return NextResponse.json({ error: 'Impossible d’activer le statut VIP' }, { status: 500 });
        }

        console.log(`[PI PAYMENT] Payment ${paymentId} completed, VIP activated.`);
        return NextResponse.json({
          success: true,
          message: 'Paiement finalisé et statut VIP activé.',
          transaction: {
            id: txid,
            amount: paymentData.amount,
            memo: paymentData.memo,
            timestamp: paymentData.timestamp,
          },
        });
      }

      default:
        return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
    }
  } catch (error) {
    console.error('[PI PAYMENT] Error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
  }

  const payment = pendingPayments.get(paymentId);
  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  return NextResponse.json({
    paymentId,
    status: payment.txid ? 'completed' : 'pending',
    amount: payment.amount,
    memo: payment.memo,
    txid: payment.txid,
    timestamp: payment.timestamp,
  });
}
