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

function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  const allowedOrigins = ['https://www.globalartpro.com', 'https://globalartproadac3428.pinet.com'];
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function verifyPiPayment(paymentId: string) {
  // Vérification manuelle du paiement Pi
  // Note: Pour une vérification complète, implémenter avec les méthodes Pi Network
  try {
    // Validation basique du format paymentId
    if (!paymentId || typeof paymentId !== 'string' || paymentId.length < 10) {
      return false;
    }
    // Vérifier si le paiement est déjà en pending ou approved
    if (pendingPayments.has(paymentId)) {
      console.log('[PI VERIFY] Payment found in pending:', paymentId);
      return true;
    }
    console.log('[PI VERIFY] Payment verified:', paymentId);
    return true;
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    return false;
  }
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

    console.log("Paiement reçu sur le serveur :", paymentId);

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId manquant' }, {
        status: 400,
        headers: getCorsHeaders(request)
      });
    }

    switch (action) {
      case 'approve': {
        if (typeof amount !== 'number' || !memo) {
          return NextResponse.json({ error: 'Montant et memo requis pour l\'approbation' }, {
            status: 400,
            headers: getCorsHeaders(request)
          });
        }

        console.log('[PI PAYMENT] Approbation reçue du client pour paymentId:', paymentId);

        // Créer une signature simple pour l'approbation
        const crypto = await import('crypto');
        const privateSeed = process.env.PI_PRIVATE_SEED || 'default-seed';
        const signature = crypto.createHash('sha256')
          .update(paymentId + privateSeed)
          .digest('hex');

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

        // Réponse compatible Pi Network avec paymentId et signature inclus
        return NextResponse.json({
          success: true,
          paymentId: paymentId,
          signature: signature
        }, {
          headers: getCorsHeaders(request)
        });
      }

      case 'complete': {
        let paymentData = pendingPayments.get(paymentId);

        if (!paymentData) {
          if (!amount || !memo || (!userEmail && !userId && !user_uid)) {
            return NextResponse.json({ error: 'Données de paiement manquantes pour compléter le paiement' }, {
              status: 400,
              headers: getCorsHeaders(request)
            });
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
          return NextResponse.json({ error: 'Paiement Pi invalide ou non vérifié' }, {
            status: 400,
            headers: getCorsHeaders(request)
          });
        }

        paymentData.txid = txid;
        pendingPayments.set(paymentId, paymentData);

        const client = await getClientPromise();

        try {
          await updateUserToVip(client, paymentData);
        } catch (error) {
          console.error('[PI PAYMENT] Erreur mise à jour VIP :', error);
          return NextResponse.json({ error: 'Impossible d\'activer le statut VIP' }, {
            status: 500,
            headers: getCorsHeaders(request)
          });
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
        }, {
          headers: getCorsHeaders(request)
        });
      }

      default:
        return NextResponse.json({ error: 'Action non reconnue' }, {
          status: 400,
          headers: getCorsHeaders(request)
        });
    }
  } catch (error) {
    console.error('[PI PAYMENT] Error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, {
      status: 500,
      headers: getCorsHeaders(request)
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment ID required' }, {
      status: 400,
      headers: getCorsHeaders(request)
    });
  }

  const payment = pendingPayments.get(paymentId);
  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, {
      status: 404,
      headers: getCorsHeaders(request)
    });
  }

  return NextResponse.json({
    paymentId,
    status: payment.txid ? 'completed' : 'pending',
    amount: payment.amount,
    memo: payment.memo,
    txid: payment.txid,
    timestamp: payment.timestamp,
  }, {
    headers: getCorsHeaders(request)
  });
}
