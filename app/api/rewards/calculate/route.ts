import { NextResponse } from 'next/server';
import { calculateReward, detectAbusePattern, type RewardContext } from '@/lib/rewardEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const context: RewardContext = body;

    // Validation côté serveur
    if (!context.action) {
      return NextResponse.json({ error: 'Action manquante' }, { status: 400 });
    }

    // Détection anti-abus (simulation : check basique)
    const recentActions = JSON.parse(
      localStorage?.getItem('recentActions') || '[]'
    );
    const abuse = detectAbusePattern(recentActions, Date.now());

    if (abuse.isAbuseDetected) {
      return NextResponse.json(
        { error: 'Comportement suspect détecté', reason: abuse.reason },
        { status: 403 }
      );
    }

    // Calcul de la récompense
    const result = calculateReward(context);

    // Si bloquée, retourner erreur
    if (result.blocked) {
      return NextResponse.json(
        { error: result.blockReason || 'Récompense bloquée' },
        { status: 403 }
      );
    }

    // Logging (pour audit futur)
    console.log(`[REWARD] ${context.action} : +${result.amount} ARTC (multiplier: ${result.multiplier})`);

    return NextResponse.json({
      success: true,
      reward: {
        amount: result.amount,
        action: result.action,
        multiplier: result.multiplier,
        message: result.reason,
      },
    });
  } catch (error) {
    console.error('[REWARD_ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du calcul de récompense' },
      { status: 500 }
    );
  }
}
