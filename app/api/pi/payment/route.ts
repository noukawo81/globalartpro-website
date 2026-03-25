import { NextRequest, NextResponse } from 'next/server';

// Types pour les paiements Pi
interface PiPaymentData {
  paymentId: string;
  txid?: string;
  amount: number;
  memo: string;
  user_uid: string;
  timestamp: number;
}

// Stockage temporaire (en production, utiliser une base de données)
let pendingPayments = new Map<string, PiPaymentData>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, paymentId, txid, amount, memo, user_uid } = body;

    switch (action) {
      case 'approve':
        // Stocker le paiement en attente d'approbation
        const paymentData: PiPaymentData = {
          paymentId,
          amount,
          memo,
          user_uid,
          timestamp: Date.now(),
        };
        pendingPayments.set(paymentId, paymentData);

        console.log(`[PI PAYMENT] Payment ${paymentId} ready for approval:`, paymentData);

        // Ici, vous pouvez ajouter une logique métier pour valider le paiement
        // Par exemple, vérifier si l'utilisateur a assez de fonds, etc.

        return NextResponse.json({
          success: true,
          message: 'Payment approved and stored for completion',
        });

      case 'complete':
        // Marquer le paiement comme terminé
        const pendingPayment = pendingPayments.get(paymentId);
        if (!pendingPayment) {
          return NextResponse.json(
            { error: 'Payment not found' },
            { status: 404 }
          );
        }

        // Mettre à jour avec la transaction ID
        pendingPayment.txid = txid;
        pendingPayments.set(paymentId, pendingPayment);

        console.log(`[PI PAYMENT] Payment ${paymentId} completed with txid: ${txid}`);

        // Ici, créditer le compte utilisateur, envoyer des notifications, etc.
        // Par exemple:
        // - Créditer ARTC à l'utilisateur
        // - Envoyer email de confirmation
        // - Mettre à jour l'historique des transactions

        return NextResponse.json({
          success: true,
          message: 'Payment completed successfully',
          transaction: {
            id: txid,
            amount: pendingPayment.amount,
            memo: pendingPayment.memo,
            timestamp: pendingPayment.timestamp,
          },
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[PI PAYMENT] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Endpoint pour vérifier le statut des paiements
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');

  if (!paymentId) {
    return NextResponse.json(
      { error: 'Payment ID required' },
      { status: 400 }
    );
  }

  const payment = pendingPayments.get(paymentId);
  if (!payment) {
    return NextResponse.json(
      { error: 'Payment not found' },
      { status: 404 }
    );
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