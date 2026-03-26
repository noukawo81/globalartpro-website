'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReferralCard from '@/components/referral/ReferralCard';

export default function ReferralsPage() {
  const { isAuthenticated } = useAuth();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
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
            <h2 className="text-3xl font-bold text-blue-300 mb-8">Tes Statistiques</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  label: 'Total Invitations',
                  value: user?.totalReferrals || 0,
                  icon: '👥',
                  color: 'from-blue-600/20 to-blue-600/5',
                },
                {
                  label: 'ARTC Gagnés',
                  value: `${user?.artcFromReferrals || 0}`,
                  icon: '💰',
                  color: 'from-green-600/20 to-green-600/5',
                },
                {
                  label: 'ARTC Totaux',
                  value: `${user?.artcBalance || 0}`,
                  icon: '💳',
                  color: 'from-yellow-600/20 to-yellow-600/5',
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${stat.color} border border-blue-500/20 rounded-lg p-8 text-center`}
                >
                  <div className="text-5xl mb-3">{stat.icon}</div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
