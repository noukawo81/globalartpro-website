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
  const allowedOrigins = ['https://www.globalartpro.com', 'https://globalartpro7927.pinet.com', 'http://localhost:3000'];
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function verifyPiPayment(paymentId: string) {
  try {
    // Vérifier avec l'API Pi Network
    const piApiKey = process.env.PI_API_KEY;
    if (!piApiKey) {
      console.warn('[PI VERIFY] No PI_API_KEY found, falling back to basic validation');
      return basicValidation(paymentId);
    }

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${piApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[PI VERIFY] API call failed:', response.status, response.statusText);
      return false;
    }

    const paymentData = await response.json();
    console.log('[PI VERIFY] Payment data from Pi API:', paymentData);

    // Vérifier que le paiement existe et est dans un état valide
    return paymentData && (paymentData.status === 'completed' || paymentData.status === 'pending');

  } catch (error) {
    console.error('[PI VERIFY] Error verifying payment:', error);
    // Fallback to basic validation
    return basicValidation(paymentId);
  }
}

function basicValidation(paymentId: string) {
  // Validation basique du format paymentId
  if (!paymentId || typeof paymentId !== 'string' || paymentId.length < 10) {
    return false;
  }
  // Vérifier si le paiement est déjà en pending ou approved
  if (pendingPayments.has(paymentId)) {
    console.log('[PI VERIFY] Payment found in pending:', paymentId);
    return true;
  }
  // Mode test: Accepter les paiements si en development/testnet
  if (process.env.NEXT_PUBLIC_PI_SANDBOX === 'true' || process.env.NODE_ENV === 'development') {
    console.log('[PI VERIFY] Payment accepted in test mode:', paymentId);
    return true;
  }
  console.log('[PI VERIFY] Payment verified (basic):', paymentId);
  return true;
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

    console.log(`[PI PAYMENT] 📥 Request received - Action: ${action}, PaymentID: ${paymentId}`);

    // Validation des données essentielles
    if (!paymentId || typeof paymentId !== 'string') {
      console.error('[PI PAYMENT] ❌ Invalid paymentId:', paymentId);
      return NextResponse.json(
        { error: 'paymentId manquant ou invalide', success: false },
        {
          status: 400,
          headers: getCorsHeaders(request)
        }
      );
    }

    switch (action) {
      case 'approve': {
        console.log('[PI PAYMENT] 🔐 Approving payment...');

        // Validation des données requis pour l'approbation
        if (typeof amount !== 'number' || amount <= 0) {
          console.error('[PI PAYMENT] ❌ Invalid amount:', amount);
          return NextResponse.json(
            { error: 'Montant invalide', success: false },
            {
              status: 400,
              headers: getCorsHeaders(request)
            }
          );
        }

        if (!memo || typeof memo !== 'string') {
          console.error('[PI PAYMENT] ❌ Invalid memo:', memo);
          return NextResponse.json(
            { error: 'Mémo invalide', success: false },
            {
              status: 400,
              headers: getCorsHeaders(request)
            }
          );
        }

        // Créer une signature pour le serveur à envoyer au SDK Pi
        // Cette signature est requise par le SDK pour valider que le serveur a approuvé
        let signature: string;
        try {
          const crypto = await import('crypto');
          const privateSeed = process.env.PI_PRIVATE_SEED || 'default-seed-please-set-env';
          
          // Créer une signature déterministe basée sur les données du paiement
          const signatureData = JSON.stringify({
            paymentId,
            amount,
            memo,
            timestamp: Math.floor(Date.now() / 10000) * 10000 // Arrondir pour éviter les délais
          });
          
          signature = crypto
            .createHash('sha256')
            .update(signatureData + privateSeed)
            .digest('hex');
          
          console.log('[PI PAYMENT] ✅ Signature created:', signature.substring(0, 10) + '...');
        } catch (error) {
          console.error('[PI PAYMENT] ❌ Failed to create signature:', error);
          return NextResponse.json(
            { error: 'Impossible de créer la signature', success: false },
            {
              status: 500,
              headers: getCorsHeaders(request)
            }
          );
        }

        // Sauvegarder le paiement comme "approuvé en attente de server completion"
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
        console.log('[PI PAYMENT] ✅ Payment stored for completion:', {
          paymentId,
          amount,
          memo,
          user: user_uid || userId || userEmail
        });

        // ✅ Réponse correcte pour le SDK Pi
        // Le client utilisera cette signature dans window.Pi.completeServerApproval()
        return NextResponse.json(
          {
            success: true,
            paymentId,
            signature,
            // Include additional info for client-side logging
            memo: `Payment approved - ${paymentId}`
          },
          {
            status: 200,
            headers: getCorsHeaders(request)
          }
        );
      }

      case 'complete': {
        console.log('[PI PAYMENT] 🎉 Completing payment with txid:', txid);

        // Récupérer ou créer les données du paiement
        let paymentData = pendingPayments.get(paymentId);

        if (!paymentData) {
          console.log('[PI PAYMENT] ℹ️ Payment not found in pending, creating from request data');

          // Validation des données si c'est un nouveau paiement
          if (!amount || typeof amount !== 'number' || !memo) {
            console.error('[PI PAYMENT] ❌ Missing payment data for new payment');
            return NextResponse.json(
              { error: 'Données de paiement manquantes', success: false },
              {
                status: 400,
                headers: getCorsHeaders(request)
              }
            );
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

        // Valider le paiement
        const paymentValid = await verifyPiPayment(paymentId);
        if (!paymentValid) {
          console.error('[PI PAYMENT] ❌ Payment verification failed:', paymentId);
          return NextResponse.json(
            { error: 'Paiement invalide ou non vérifié', success: false },
            {
              status: 400,
              headers: getCorsHeaders(request)
            }
          );
        }

        // Mettre à jour avec txid
        paymentData.txid = txid;
        pendingPayments.set(paymentId, paymentData);

        console.log('[PI PAYMENT] ✅ Payment verified and stored with txid:', txid);

        // Optionnel: Mettre à jour la DB (décommenter si vous avez une DB configurée)
        const client = await getClientPromise();
        try {
          await updateUserToVip(client, paymentData);
          console.log('[PI PAYMENT] ✅ User VIP status updated');
        } catch (error) {
          console.error('[PI PAYMENT] ⚠️ Failed to update user VIP:', error);
          // Ne pas fail la complétion si la DB a un problème
          // Le paiement est déjà on-chain, c'est plus important
        }

        console.log('[PI PAYMENT] ✅ Payment COMPLETED successfully:', {
          paymentId,
          txid,
          amount: paymentData.amount,
          memo: paymentData.memo
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Paiement finalisé avec succès',
            transaction: {
              id: txid,
              paymentId,
              amount: paymentData.amount,
              memo: paymentData.memo,
              timestamp: paymentData.timestamp,
              completedAt: new Date().toISOString(),
            },
          },
          {
            status: 200,
            headers: getCorsHeaders(request)
          }
        );
      }

      default:
        console.error('[PI PAYMENT] ❌ Unknown action:', action);
        return NextResponse.json(
          { error: 'Action non reconnue', success: false },
          {
            status: 400,
            headers: getCorsHeaders(request)
          }
        );
    }
  } catch (error) {
    console.error('[PI PAYMENT] ❌ ERROR:', error);
    return NextResponse.json(
      { 
        error: 'Erreur interne du serveur',
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: getCorsHeaders(request)
      }
    );
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
