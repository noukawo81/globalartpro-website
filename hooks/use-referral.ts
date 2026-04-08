import { useState, useCallback } from 'react';

export interface ReferralData {
  referrerCode: string;
  newUserId: string;
  newUserName: string;
  newUserEmail: string;
}

export interface ReferralStats {
  referrerCode: string;
  totalReferrals: number;
  totalEarnings: number;
  referrals: Array<{
    id: string;
    referrerCode: string;
    newUserId: string;
    newUserName: string;
    newUserEmail: string;
    createdAt: string;
    status: string;
    artcAmount: number;
  }>;
}

export function useReferral() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);

  // Process a referral
  const processReferral = useCallback(async (data: ReferralData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du traitement du parrainage');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch referral stats
  const fetchStats = useCallback(async (referrerCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/referrals?referrerCode=${referrerCode}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des statistiques');
      }

      const result = await response.json();
      setStats(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    stats,
    processReferral,
    fetchStats,
  };
}
