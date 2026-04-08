'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Copy, Share2, Trophy, Zap, TrendingUp } from 'lucide-react';

export default function ReferralStatsWidget() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    nextMilestoneEarnings: 0,
    milestoneReached: 0,
  });

  useEffect(() => {
    // Calculate milestone (every 5 referrals grants 10 bonus ARTC)
    const referrals = user?.totalReferrals || 0;
    const earnings = referrals * 10;
    const bonusEarnings = Math.floor(referrals / 5) * 10;
    const totalMilestoneEarnings = earnings + bonusEarnings;
    const nextMilestone = ((Math.floor(referrals / 5) + 1) * 5) * 10 + (((Math.floor(referrals / 5) + 1) * 5) / 5) * 10;

    setStats({
      totalReferrals: referrals,
      totalEarnings: earnings,
      nextMilestoneEarnings: nextMilestone,
      milestoneReached: Math.floor(referrals / 5),
    });
  }, [user]);

  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://globalartpro.com'}/auth/register?ref=${user?.referralCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      // Show toast or notification
      alert('Lien copié! 🎉');
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress to Next Milestone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Prochaine Récompense</h3>
          </div>
          <div className="text-sm text-gray-400">Milestone {stats.milestoneReached}</div>
        </div>

        <div className="space-y-3">
          <div className="relative h-3 bg-slate-900/50 rounded-full overflow-hidden border border-purple-500/30">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(stats.totalReferrals % 5) * 20}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{stats.totalReferrals % 5} / 5 parrainages</span>
            <span>+10 ARTC bonus à 5!</span>
          </div>
        </div>
      </motion.div>

      {/* Earnings Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Directs</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalEarnings}</div>
          <span className="text-xs text-gray-500">{stats.totalReferrals} × 10 ARTC</span>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Bonus Milestone</span>
          </div>
          <div className="text-2xl font-bold text-green-400">+{stats.milestoneReached * 10}</div>
          <span className="text-xs text-gray-500">{stats.milestoneReached}×  bonus</span>
        </div>
      </motion.div>

      {/* Quick Share Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex gap-3"
      >
        <button
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-all text-blue-300 font-semibold"
        >
          <Copy size={16} />
          <span>Copier le lien</span>
        </button>

        <button
          onClick={() => {
            const text = `🎨 Join GlobalArtpro! Earn +2 ARTC and help me earn +10 ARTC! ${referralUrl}`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all text-blue-300 font-semibold"
        >
          <Share2 size={16} />
          <span>Partager</span>
        </button>
      </motion.div>
    </div>
  );
}
