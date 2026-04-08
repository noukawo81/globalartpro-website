'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import ReferralCard from '@/components/referral/ReferralCard';
import { Share2, TrendingUp, Users, Zap, Award, Clipboard } from 'lucide-react';

export default function ReferralsPage() {
  const { isAuthenticated } = useAuth();
  const { user } = useAuth();
  const router = useRouter();
  const [referredUsers, setReferredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      // Simulate loading referred users
      setLoading(false);
      // In a real app, this would fetch from the API
      setReferredUsers([
        {
          id: '1',
          name: 'Alice Martin',
          email: 'alice@example.com',
          avatar: '/api/placeholder/40/40',
          referredAt: '2024-03-20',
          artcReward: 10,
          status: 'active'
        },
        {
          id: '2',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          avatar: '/api/placeholder/40/40',
          referredAt: '2024-03-18',
          artcReward: 10,
          status: 'active'
        },
        {
          id: '3',
          name: 'Clara Wilson',
          email: 'clara@example.com',
          avatar: '/api/placeholder/40/40',
          referredAt: '2024-03-15',
          artcReward: 10,
          status: 'pending'
        }
      ]);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Header */}
      <section className="border-b border-blue-500/10 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">← Dashboard</Link>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">Programme de Parrainage 👥</h1>
            <p className="text-gray-400 text-lg">Gagne des ARTC en invitant tes amis sur GlobalArtpro</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <ReferralCard />
        </div>
      </section>

      {/* Referred Users Section */}
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-b from-transparent to-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <h2 className="text-3xl font-bold text-white">Tes Amis Parrainés</h2>
                <p className="text-gray-400 text-sm">Suivi de tous tes parrainages et récompenses</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">⚡</div>
                <p className="text-gray-400 mt-2">Chargement...</p>
              </div>
            ) : referredUsers.length > 0 ? (
              <div className="space-y-4">
                {referredUsers.map((referredUser, index) => (
                  <motion.div
                    key={referredUser.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Image
                          src={referredUser.avatar}
                          alt={referredUser.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-white">{referredUser.name}</h3>
                          <p className="text-sm text-gray-400">{referredUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="text-sm text-gray-400">Inscrit le</div>
                          <div className="text-white font-semibold">{referredUser.referredAt}</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-end text-green-400 font-bold">
                            <Zap size={16} />
                            +{referredUser.artcReward}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            referredUser.status === 'active'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {referredUser.status === 'active' ? '✓ Actif' : '⏳ Vérification'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/30 border border-dashed border-blue-500/20 rounded-lg p-12 text-center">
                <Users className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Tu n'as pas encore parrainé d'amis</p>
                <p className="text-sm text-gray-500">Partage ton lien de parrainage pour commencer à gagner des ARTC!</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-blue-300 mb-8">Questions Fréquentes</h2>

            <div className="space-y-4">
              {[
                {
                  question: 'Combien d\'ARTC je gagne par parrainage?',
                  answer: 'Tu gagnes 10 ARTC chaque fois qu\'un ami s\'inscrit via ton lien. Lui il gagne 2 ARTC de bonus d\'inscription.',
                },
                {
                  question: 'Y a-t-il une limite du nombre de parrainages?',
                  answer: 'Non! Tu peux inviter autant de gens que tu veux. Plus tu invites, plus tu gagnes!',
                },
                {
                  question: 'Comment je reçois mes ARTC?',
                  answer: 'Les ARTC s\'ajoutent automatiquement à ton wallet dès que ton ami s\'inscrit avec ton lien.',
                },
                {
                  question: 'Puis-je me parrainer moi-même?',
                  answer: 'Non, c\'est impossible. Le système empêche l\'auto-parrainage et chaque parrainage ne fonctionne qu\'une seule fois.',
                },
                {
                  question: 'Où je vois mes ARTC gagnés?',
                  answer: 'Dans ton wallet! Tu verras le montant total et le détail de tes gâins de parrainage.',
                },
                {
                  question: 'Je peux utiliser mes ARTC comment?',
                  answer: 'Tes ARTC peuvent être utilisés pour acheter des NFTs, supporter des artistes, ou être retirés à tout moment.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-slate-900/50 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/40 transition-all"
                >
                  <h3 className="font-bold text-blue-300 mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-blue-300 mb-8">Tes Statistiques de Parrainage</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: 'Total Invitations',
                  value: user?.totalReferrals || 0,
                  icon: '👥',
                  color: 'from-blue-600/20 to-blue-600/5',
                  borderColor: 'border-blue-500/30',
                },
                {
                  label: 'ARTC Gagnés',
                  value: `${user?.artcFromReferrals || 0}`,
                  icon: '💰',
                  color: 'from-green-600/20 to-green-600/5',
                  borderColor: 'border-green-500/30',
                },
                {
                  label: 'Taux de Conversion',
                  value: `${user?.totalReferrals ? Math.round((user?.totalReferrals / 10) * 100) : 0}%`,
                  icon: '📊',
                  color: 'from-purple-600/20 to-purple-600/5',
                  borderColor: 'border-purple-500/30',
                },
                {
                  label: 'ARTC Totaux',
                  value: `${user?.artcBalance || 0}`,
                  icon: '💳',
                  color: 'from-yellow-600/20 to-yellow-600/5',
                  borderColor: 'border-yellow-500/30',
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${stat.color} border ${stat.borderColor} rounded-lg p-6 hover:border-opacity-50 transition-all`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-3xl">{stat.icon}</div>
                    <TrendingUp className="w-5 h-5 text-blue-400/50" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
