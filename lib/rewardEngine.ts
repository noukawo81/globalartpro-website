/**
 * ARTC Reward Engine
 * Système anti-abus et équilibré de récompenses basé sur l'activité réelle
 */

export type RewardAction =
  | 'create-nft'
  | 'certify-nft'
  | 'nft-sold'
  | 'support-received'
  | 'community-engagement'
  | 'like-received'
  | 'comment-received'
  | 'view-milestone';

export interface QualityScore {
  likes: number;
  comments: number;
  saves: number;
  avgViewDurationSeconds: number;
  completionRate: number; // 0-1
}

export interface RewardContext {
  action: RewardAction;
  quality?: QualityScore;
  baseAmount?: number;
  isNFTCertified?: boolean;
  userReputation?: number; // 0-1
  dayGainsSoFar?: number;
}

export interface RewardResult {
  amount: number;
  action: RewardAction;
  multiplier: number;
  reason: string;
  blocked?: boolean;
  blockReason?: string;
}

// Configuration limits
const DAILY_LIMIT = 1000; // ARTC max par jour
const COOLDOWN_SECONDS = {
  'create-nft': 300, // 5 min entre créations
  'support-received': 60, // 1 min entre soutiens
  'community-engagement': 30, // limitless
};

const BASE_REWARDS = {
  'create-nft': 50,
  'certify-nft': 150,
  'nft-sold': 500, // + pourcentage du prix
  'support-received': 100, // + % du montant
  'community-engagement': 10,
  'like-received': 2,
  'comment-received': 5,
  'view-milestone': 20,
};

/**
 * Calcule le score de qualité basé sur l'engagement
 */
export function calculateQualityScore(quality: QualityScore): number {
  let score = 0;

  // Likes : 0-30 points
  score += Math.min(quality.likes * 0.3, 30);

  // Commentaires : 0-20 points
  score += Math.min(quality.comments * 2, 20);

  // Sauvegardes : 0-25 points
  score += Math.min(quality.saves * 0.5, 25);

  // Temps de visualisation : 0-15 points
  // Si moyenne > 30 sec = bonne engagement
  const viewScore = Math.min(quality.avgViewDurationSeconds / 2, 15);
  score += viewScore;

  // Taux de complétion : 0-10 points
  score += quality.completionRate * 10;

  // Total : 0-100
  return Math.min(score, 100);
}

/**
 * Applique les multiplicateurs basés sur la qualité et la réputation
 */
function applyMultipliers(
  baseAmount: number,
  qualityMultiplier: number = 1,
  reputationMultiplier: number = 1,
  isCertified: boolean = false
): number {
  let amount = baseAmount;

  // Bonus certification (2x)
  if (isCertified) {
    amount *= 2;
  }

  // Multiplicateur de qualité
  amount *= 1 + qualityMultiplier * 0.5; // max +50%

  // Multiplicateur de réputation
  amount *= 1 + reputationMultiplier * 0.3; // max +30%

  return Math.floor(amount);
}

/**
 * Détecte les comportements suspects
 */
export function detectAbusePattern(
  recentActions: { action: RewardAction; timestamp: number }[],
  currentTime: number
): { isAbuseDetected: boolean; reason?: string } {
  // Vérifier si trop d'actions similaires en peu de temps
  const lastMinuteActions = recentActions.filter(
    (a) => currentTime - a.timestamp < 60000
  );

  const actionCounts = lastMinuteActions.reduce(
    (acc, a) => {
      acc[a.action] = (acc[a.action] || 0) + 1;
      return acc;
    },
    {} as Record<RewardAction, number>
  );

  // Si plus de 3 actions similaires en 1 min = comportement suspect
  for (const [action, count] of Object.entries(actionCounts)) {
    if (count > 3) {
      return {
        isAbuseDetected: true,
        reason: `Trop de "${action}" répétées (${count} en 1 minute)`,
      };
    }
  }

  return { isAbuseDetected: false };
}

/**
 * MOTEUR PRINCIPAL : Calcule la récompense ARTC
 */
export function calculateReward(context: RewardContext): RewardResult {
  const {
    action,
    quality,
    baseAmount,
    isNFTCertified = false,
    userReputation = 0.5,
    dayGainsSoFar = 0,
  } = context;

  // Étape 1 : Vérifier que NFT est certifié (except community engagement)
  if (
    action !== 'community-engagement' &&
    action !== 'like-received' &&
    action !== 'comment-received' &&
    action !== 'view-milestone' &&
    !isNFTCertified
  ) {
    return {
      amount: 0,
      action,
      multiplier: 0,
      reason: 'NFT non certifié : aucune récompense',
      blocked: true,
      blockReason: 'Only certified NFTs earn rewards',
    };
  }

  // Étape 2 : Vérifier limite journalière
  const base = baseAmount || BASE_REWARDS[action] || 0;
  let finalAmount = base;

  if (action === 'certify-nft') {
    finalAmount = BASE_REWARDS['certify-nft'];
  } else if (action === 'nft-sold') {
    finalAmount = base > 0 ? base : BASE_REWARDS['nft-sold'];
  } else if (action === 'support-received') {
    // % du montant du soutien
    finalAmount = Math.floor((base * 0.1) || BASE_REWARDS['support-received']);
  }

  // Appliquer multiplicateurs de qualité et réputation
  if (quality) {
    const qualityScore = calculateQualityScore(quality);
    const qualityMultiplier = qualityScore / 100;
    finalAmount = applyMultipliers(
      finalAmount,
      qualityMultiplier,
      userReputation,
      isNFTCertified
    );
  } else {
    finalAmount = applyMultipliers(finalAmount, 0.5, userReputation, isNFTCertified);
  }

  // Vérifier limite journalière
  if (dayGainsSoFar + finalAmount > DAILY_LIMIT) {
    const remaining = Math.max(0, DAILY_LIMIT - dayGainsSoFar);
    return {
      amount: Math.min(finalAmount, remaining),
      action,
      multiplier: 1,
      reason: `Limite journalière atteinte (${DAILY_LIMIT} ARTC/jour)`,
      blocked: remaining === 0,
      blockReason:
        remaining === 0 ? 'Daily limit reached' : `Partial reward (${remaining} ARTC remaining)`,
    };
  }

  return {
    amount: Math.floor(finalAmount),
    action,
    multiplier: isNFTCertified ? 2 : 1,
    reason: `+${Math.floor(finalAmount)} ARTC pour ${action}`,
  };
}

/**
 * Génère un historique de gain avec simulation
 */
export interface RewardHistory {
  id: string;
  action: RewardAction;
  amount: number;
  date: string;
  source: string;
  details?: string;
}

export function generateRewardHistory(count: number = 10): RewardHistory[] {
  const history: RewardHistory[] = [];
  const actions: RewardAction[] = [
    'create-nft',
    'certify-nft',
    'nft-sold',
    'support-received',
    'community-engagement',
  ];

  for (let i = 0; i < count; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const context: RewardContext = {
      action,
      isNFTCertified: true,
      userReputation: 0.7,
      dayGainsSoFar: 0,
      quality: {
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        saves: Math.floor(Math.random() * 30),
        avgViewDurationSeconds: Math.random() * 60,
        completionRate: Math.random(),
      },
    };

    const reward = calculateReward(context);
    history.push({
      id: `reward-${Date.now()}-${i}`,
      action,
      amount: reward.amount,
      date: new Date(Date.now() - i * 3600000).toISOString(),
      source: getActionLabel(action),
      details: reward.reason,
    });
  }

  return history;
}

/**
 * Helper : translate action to label
 */
export function getActionLabel(action: RewardAction): string {
  const labels: Record<RewardAction, string> = {
    'create-nft': 'Création NFT',
    'certify-nft': 'Certification NFT',
    'nft-sold': 'Vente NFT',
    'support-received': 'Soutien reçu',
    'community-engagement': 'Engagement communauté',
    'like-received': 'Like reçu',
    'comment-received': 'Commentaire reçu',
    'view-milestone': 'Jalon visualisation',
  };
  return labels[action] || action;
}

/**
 * Helper : getActionEmoji
 */
export function getActionEmoji(action: RewardAction): string {
  const emojis: Record<RewardAction, string> = {
    'create-nft': '🎨',
    'certify-nft': '✅',
    'nft-sold': '💰',
    'support-received': '🎁',
    'community-engagement': '👥',
    'like-received': '❤️',
    'comment-received': '💬',
    'view-milestone': '👀',
  };
  return emojis[action] || '⭐';
}
