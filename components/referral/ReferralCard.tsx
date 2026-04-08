'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Clipboard, Share2, MessageCircle, Mail, CheckCircle, Users, Zap, Trophy } from 'lucide-react';

export default function ReferralCard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<string | null>(null);

  if (!user?.referralCode) return null;

  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://globalartpro.com'}/auth/register?ref=${user.referralCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const shareOnTwitter = () => {
    const text = `🎨 Rejoins-moi sur GlobalArtpro! Une plateforme pour les artistes du monde. 🌍\n\n💎 Bonus +2 ARTC pour toi\n➕ +10 ARTC pour moi\n\nC'est du win-win! 🚀\n\n${referralUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setShareMethod('twitter');
    setTimeout(() => setShareMethod(null), 3000);
  };

  const shareOnWhatsApp = () => {
    const text = `🎨 *Rejoins-moi sur GlobalArtpro!*\n\nUne plateforme incroyable pour les artistes du monde.\n\n💎 Tu gagnes: +2 ARTC\n➕ Je gagne: +10 ARTC\n\n${referralUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setShareMethod('whatsapp');
    setTimeout(() => setShareMethod(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-2xl p-8 space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-blue-300 flex items-center gap-2">
          👉 Invite Tes Amis et Gagne des ARTC
        </h2>
        <p className="text-gray-400">Chaque ami qui s'inscrit via ton lien te donne +10 ARTC directement!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900/50 rounded-lg p-4 text-center border border-blue-500/20">
          <div className="text-2xl font-bold text-blue-300">{user.totalReferrals || 0}</div>
          <div className="text-xs text-gray-400">Parrainages</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center border border-blue-500/20">
          <div className="text-2xl font-bold text-green-400">+{user.artcFromReferrals || 0}</div>
          <div className="text-xs text-gray-400">ARTC Gagnés</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center border border-blue-500/20">
          <div className="text-2xl font-bold text-yellow-400">{user.referralCode}</div>
          <div className="text-xs text-gray-400">Ton Code</div>
        </div>
      </div>

      {/* Lien de parrainage */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">Ton lien de parrainage:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralUrl}
            readOnly
            className="flex-1 px-4 py-3 rounded-lg bg-slate-900/80 border border-blue-500/30 text-sm text-gray-300 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className={`px-6 py-3 font-semibold rounded-lg transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {copied ? '✓ Copié' : '📋 Copier'}
          </motion.button>
        </div>
      </div>

      {/* Boutons de partage */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300">Partage sur les réseaux:</label>
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareOnTwitter}
            className="px-4 py-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold transition-all border border-blue-500/30"
          >
            𝕏 Twitter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareOnWhatsApp}
            className="px-4 py-3 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-300 font-semibold transition-all border border-green-500/30"
          >
            💬 WhatsApp
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const subject = 'Rejoins GlobalArtpro!';
              const body = `Gagne +2 ARTC en te inscrivant avec mon code!\n\n${referralUrl}`;
              window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }}
            className="px-4 py-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold transition-all border border-purple-500/30"
          >
            📧 Email
          </motion.button>
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="space-y-3 pt-4 border-t border-blue-500/20">
        <h3 className="font-semibold text-gray-300">Comment ça marche?</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-300 text-xs font-bold">1</span>
            <span>Partage ton lien unique avec tes amis</span>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-300 text-xs font-bold">2</span>
            <span>Ils s'inscrivent et gagnent +2 ARTC</span>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-300 text-xs font-bold">3</span>
            <span>Tu reçois +10 ARTC automatiquement</span>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-300 text-xs font-bold">4</span>
            <span>Tes ARTC s'ajoutent à ton wallet</span>
          </div>
        </div>
      </div>

      {/* Notice de sécurité */}
      <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 text-sm text-amber-200">
        <p className="font-semibold mb-1">🔒 Sécurité:</p>
        <p>Chaque parrainage ne fonctionne qu'une seule fois. Il est impossible de tricher ou de se parrainer soi-même.</p>
      </div>
    </motion.div>
  );
}
