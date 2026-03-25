'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RewardNotification from '@/components/ui/RewardNotification';
import { calculateReward } from '@/lib/rewardEngine';

// Types
interface ArtistPost {
  id: string;
  type: 'image' | 'video';
  title: string;
  description: string;
  artist: string;
  country: string;
  culture: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  saves: number;
  supports: number;
  timestamp: string;
  isSupported: boolean;
}

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ArtistPost | null;
  onSupport: (amount: number, currency: 'ARTC' | 'Pi') => void;
}

// Mock data
const mockPosts: ArtistPost[] = [
  {
    id: '1',
    type: 'image',
    title: 'Symphonie Africaine',
    description: 'Une peinture qui capture l\'essence rythmique des tambours traditionnels africains, mêlant couleurs vives et mouvements dynamiques.',
    artist: 'Amina Diallo',
    country: 'Sénégal',
    culture: 'Afrique',
    imageUrl: '/api/placeholder/600/400',
    likes: 234,
    comments: 18,
    saves: 67,
    supports: 12,
    timestamp: '2024-01-15',
    isSupported: false
  },
  {
    id: '2',
    type: 'image',
    title: 'Mandala de la Paix',
    description: 'Création digitale inspirée des mandalas tibétains, symbolisant l\'harmonie entre tradition et modernité.',
    artist: 'Tenzin Norbu',
    country: 'Bhoutan',
    culture: 'Asie',
    imageUrl: '/api/placeholder/600/400',
    likes: 189,
    comments: 23,
    saves: 45,
    supports: 8,
    timestamp: '2024-01-14',
    isSupported: true
  },
  {
    id: '3',
    type: 'image',
    title: 'Cathédrale Vivante',
    description: 'Installation artistique représentant l\'âme gothique à travers des éléments naturels et architecturaux.',
    artist: 'Marie Dubois',
    country: 'France',
    culture: 'Europe',
    imageUrl: '/api/placeholder/600/400',
    likes: 156,
    comments: 31,
    saves: 89,
    supports: 15,
    timestamp: '2024-01-13',
    isSupported: false
  }
];

// Components
const HeroCommunity = () => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5 }}
    className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
  >
    {/* Artistic ambiance effect */}
    <div className="absolute inset-0 bg-gradient-radial from-gold-500/8 via-transparent to-transparent" />

    <div className="relative z-10 text-center px-6 max-w-4xl">
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-wide"
      >
        Communauté Artistique Mondiale
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-xl md:text-2xl text-gold-400 leading-relaxed max-w-3xl mx-auto mb-8"
      >
        Partagez, inspirez, soutenez les talents du monde
      </motion.p>

      {/* Warm artistic effect */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.2, duration: 1.5, type: 'spring' }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-gold-400/20 to-gold-600/20 blur-sm"
      >
        <span className="text-4xl">👥</span>
      </motion.div>
    </div>
  </motion.section>
);

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, post, onSupport }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'ARTC' | 'Pi'>('ARTC');

  const handleSupport = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSupport(numAmount, currency);
      setAmount('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900/95 backdrop-blur-xl border border-gold-800/30 rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              Soutenir l'artiste
            </h3>

            {post && (
              <div className="text-center mb-6">
                <p className="text-gray-300 text-sm mb-2">"{post.title}"</p>
                <p className="text-gold-400 text-sm">par {post.artist}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Montant
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-black/50 border border-gold-800/30 rounded-lg text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Devise
                </label>
                <div className="flex gap-2">
                  {(['ARTC', 'Pi'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                        currency === curr
                          ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                          : 'border-gold-800/30 bg-black/50 text-gray-300 hover:border-gold-600'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4 mb-6">
              Soutenez cet artiste et contribuez à la préservation de l'art
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-300 border border-gold-800/30 rounded-lg hover:bg-white/5 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSupport}
                disabled={!amount || parseFloat(amount) <= 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-medium rounded-lg hover:from-gold-500 hover:to-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Soutenir
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ArtistPostCard: React.FC<{
  post: ArtistPost;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onSave: (id: string) => void;
  onSupport: (post: ArtistPost) => void;
}> = ({ post, onLike, onComment, onSave, onSupport }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-6 overflow-hidden shadow-2xl"
    >
      {post.imageUrl && (
        <div className="relative mb-4 rounded-xl overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {post.supports > 0 && (
              <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-gold-300 flex items-center gap-1">
                <span className="text-sm">🎨</span>
                {post.supports} soutiens
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{post.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="font-medium text-gold-400">{post.artist}</span>
            <span>•</span>
            <span>{post.country}</span>
            <span>•</span>
            <span>{post.culture}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs text-center">
            Créateur Actif
          </span>
          <span className="bg-gold-500/20 text-gold-400 px-2 py-1 rounded text-xs text-center">
            Artiste Certifié
          </span>
        </div>
      </div>

      <p className="text-gray-300 mb-4 leading-relaxed">{post.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsLiked(!isLiked);
              onLike(post.id);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'text-red-400 bg-red-500/10'
                : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
            }`}
          >
            <span className={`text-lg ${isLiked ? '' : ''}`}>❤️</span>
            <span className="text-sm">{post.likes + (isLiked ? 1 : 0)}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onComment(post.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <span className="text-lg">💬</span>
            <span className="text-sm">{post.comments}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsSaved(!isSaved);
              onSave(post.id);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isSaved
                ? 'text-green-400 bg-green-500/10'
                : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
            }`}
          >
            <span className={`text-lg ${isSaved ? '' : ''}`}>🔖</span>
            <span className="text-sm">{post.saves + (isSaved ? 1 : 0)}</span>
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSupport(post)}
          className="px-4 py-2 bg-gradient-to-r from-gold-600/20 to-gold-500/20 border border-gold-500/30 text-gold-300 rounded-lg hover:from-gold-600/30 hover:to-gold-500/30 transition-all text-sm font-medium"
        >
          Soutenir l'artiste
        </motion.button>
      </div>
    </motion.article>
  );
};

const CommunityFeed = () => {
  const [posts, setPosts] = useState<ArtistPost[]>(mockPosts);
  const [supportModal, setSupportModal] = useState<{ isOpen: boolean; post: ArtistPost | null }>({
    isOpen: false,
    post: null
  });
  const [rewardNotification, setRewardNotification] = useState<{
    amount: number;
    action: 'support-received' | 'like-received';
  } | null>(null);

  const handleLike = (id: string) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
    // Simulate reward for like
    const reward = calculateReward({
      action: 'like-received',
      isNFTCertified: true,
      userReputation: 0.7,
      dayGainsSoFar: 0,
    });
    setRewardNotification({ amount: reward.amount, action: 'like-received' });
  };

  const handleComment = (id: string) => {
    // Placeholder for comment functionality
    console.log('Comment on post:', id);
  };

  const handleSave = (id: string) => {
    setPosts(posts.map(post =>
      post.id === id ? { ...post, saves: post.saves + 1 } : post
    ));
  };

  const handleSupport = (post: ArtistPost) => {
    setSupportModal({ isOpen: true, post });
  };

  const handleSupportSubmit = (amount: number, currency: 'ARTC' | 'Pi') => {
    if (supportModal.post) {
      setPosts(posts.map(post =>
        post.id === supportModal.post!.id
          ? { ...post, supports: post.supports + 1, isSupported: true }
          : post
      ));
      
      // Calculate reward for receiving support
      const reward = calculateReward({
        action: 'support-received',
        baseAmount: amount,
        isNFTCertified: true,
        userReputation: 0.7,
        dayGainsSoFar: 0,
      });
      
      setRewardNotification({ amount: reward.amount, action: 'support-received' });
      console.log(`Supported ${supportModal.post.artist} with ${amount} ${currency}`);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Fil d'Actualité Artistique
        </h2>

        <div className="space-y-6">
          {posts.map((post) => (
            <ArtistPostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onSave={handleSave}
              onSupport={handleSupport}
            />
          ))}
        </div>
      </div>

      <SupportModal
        isOpen={supportModal.isOpen}
        onClose={() => setSupportModal({ isOpen: false, post: null })}
        post={supportModal.post}
        onSupport={handleSupportSubmit}
      />

      {rewardNotification && (
        <RewardNotification
          amount={rewardNotification.amount}
          action={rewardNotification.action}
          message={
            rewardNotification.action === 'support-received'
              ? 'Artiste soutenu avec succès !'
              : 'Contribution à la communauté récompensée !'
          }
          onComplete={() => setRewardNotification(null)}
        />
      )}
    </section>
  );
};

const CommunityRules = () => (
  <section className="py-16 bg-gradient-to-br from-gray-900 via-black to-gray-800">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-3xl font-bold text-white mb-8">Règles de la Communauté</h2>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-lg font-semibold text-white mb-2">Qualité d'abord</h3>
            <p className="text-gray-300 text-sm">
              Partagez uniquement des œuvres de qualité qui enrichissent notre communauté
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">Respect mutuel</h3>
            <p className="text-gray-300 text-sm">
              Traitez chaque artiste avec respect et encouragez positivement
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-lg font-semibold text-white mb-2">Soutien naturel</h3>
            <p className="text-gray-300 text-sm">
              Le soutien aux artistes vient naturellement de la valeur de leur travail
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <HeroCommunity />
      <CommunityRules />
      <CommunityFeed />
    </div>
  );
}