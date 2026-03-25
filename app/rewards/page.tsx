'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  calculateReward,
  calculateQualityScore,
  generateRewardHistory,
  getActionEmoji,
  getActionLabel,
  type QualityScore,
} from '@/lib/rewardEngine';

export default function RewardsPage() {
  const [rewardHistory] = useState(generateRewardHistory(15));
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const totalEarnings = rewardHistory.reduce((sum, r) => sum + r.amount, 0);
  const dailyAverage = Math.floor(totalEarnings / 15);

  // Simulate quality score
  const mockQuality: QualityScore = {
    likes: 450,
    comments: 85,
    saves: 120,
    avgViewDurationSeconds: 45,
    completionRate: 0.92,
  };

  const qualityScore = calculateQualityScore(mockQuality);

  // Example reward scenarios
  const rewardExamples = [
    {
      action: 'create-nft' as const,
      label: 'Créer un NFT certifié',
      base: 50,
      certified: true,
      quality: qualityScore / 100,
    },
    {
      action: 'certify-nft' as const,
      label: 'Certification NFT',
      base: 150,
      certified: true,
      quality: 1,
    },
    {
      action: 'nft-sold' as const,
      label: 'Vente NFT (200 ARTC)',
      base: 200,
      certified: true,
      quality: 0.8,
    },
  ];

  const filteredHistory = selectedFilter === 'all'
    ? rewardHistory
    : rewardHistory.filter((h) => h.source === selectedFilter);

  const uniqueSources = Array.from(new Set(rewardHistory.map((h) => h.source)));

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-12 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-gold-300/20 bg-gradient-to-r from-gray-900/70 to-black/60 p-8 shadow-2xl shadow-gold-600/20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gold-400 to-yellow-400 flex items-center justify-center shadow-lg shadow-gold-400/30">
              <span className="text-3xl">⭐</span>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gradient bg-gradient-to-r from-gold-300 via-yellow-200 to-white bg-clip-text text-transparent">
                Système de Récompenses ARTC
              </h1>
              <p className="text-gray-300 text-lg mt-2">
                Gagnez 0,1-1000 ARTC/jour en contribuant à la communauté artistique
              </p>
            </div>
          </div>
        </motion.section>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <p className="text-gray-400 text-sm mb-2">Gains totaux</p>
            <p className="text-4xl font-bold text-gold-300">{totalEarnings.toLocaleString()}</p>
            <p className="text-gray-400 text-xs mt-2">ARTC</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <p className="text-gray-400 text-sm mb-2">Moyenne/jour</p>
            <p className="text-4xl font-bold text-green-400">{dailyAverage}</p>
            <p className="text-gray-400 text-xs mt-2">ARTC</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <p className="text-gray-400 text-sm mb-2">Score de qualité</p>
            <p className="text-4xl font-bold text-purple-400">{Math.round(qualityScore)}</p>
            <p className="text-gray-400 text-xs mt-2">/100</p>
          </motion.div>
        </div>

        {/* Comment marche */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="rounded-3xl border border-white/10 bg-gray-900/70 p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Comment ça marche ?</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Rules */}
            <div>
              <h3 className="text-xl font-semibold text-gold-300 mb-4">Règles de récompense</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-gold-400 mt-1">✓</span>
                  <span>
                    <strong>NFT certifiés seulement</strong> — Les NFT non certifiés n'accumulent
                    pas de récompenses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold-400 mt-1">✓</span>
                  <span>
                    <strong>Engagement réel</strong> — Les récompenses augmentent avec les likes,
                    commentaires et sauvegardes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold-400 mt-1">✓</span>
                  <span>
                    <strong>Limite 1000 ARTC/jour</strong> — Évite la sur-exploitation du système
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold-400 mt-1">✓</span>
                  <span>
                    <strong>Anti-abus</strong> — Les actions répétitives sont détectées et bloquées
                  </span>
                </li>
              </ul>
            </div>

            {/* Quality metrics */}
            <div>
              <h3 className="text-xl font-semibold text-gold-300 mb-4">
                Facteurs de qualité (Score: {Math.round(qualityScore)}/100)
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>❤️ Likes</span>
                    <span className="text-gold-300">{mockQuality.likes}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${Math.min(mockQuality.likes, 500) / 5}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>💬 Commentaires</span>
                    <span className="text-gold-300">{mockQuality.comments}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${Math.min(mockQuality.comments, 100) / 1}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>📌 Sauvegardes</span>
                    <span className="text-gold-300">{mockQuality.saves}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${Math.min(mockQuality.saves, 200) / 2}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Exemples de récompenses */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="rounded-3xl border border-white/10 bg-gray-900/70 p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Exemples de récompenses</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {rewardExamples.map((example) => {
              const result = calculateReward({
                action: example.action,
                isNFTCertified: example.certified,
                quality: {
                  likes: Math.floor(mockQuality.likes * example.quality),
                  comments: Math.floor(mockQuality.comments * example.quality),
                  saves: Math.floor(mockQuality.saves * example.quality),
                  avgViewDurationSeconds: mockQuality.avgViewDurationSeconds * example.quality,
                  completionRate: mockQuality.completionRate * example.quality,
                },
                userReputation: 0.7,
                dayGainsSoFar: 0,
              });

              return (
                <div
                  key={example.action}
                  className="bg-black/40 border border-gold-300/20 rounded-xl p-4"
                >
                  <p className="text-gold-300 font-semibold mb-2">{example.label}</p>
                  <p className="text-2xl font-bold text-white mb-2">{getActionEmoji(example.action)}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gold-400">{result.amount}</span>
                    <span className="text-gray-400">ARTC</span>
                  </div>
                  {result.multiplier > 1 && (
                    <p className="text-sm text-green-400 mt-2">x{result.multiplier} (Certifié)</p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Historique */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="rounded-3xl border border-white/10 bg-gray-900/70 p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Historique des récompenses</h2>

          {/* Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-gold-500 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Tous
            </button>
            {uniqueSources.map((source) => (
              <button
                key={source}
                onClick={() => setSelectedFilter(source)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === source
                    ? 'bg-gold-500 text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {source}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredHistory.map((record, idx) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10 hover:border-gold-300/30 transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{getActionEmoji(record.action)}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{record.source}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(record.date).toLocaleDateString('fr-FR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gold-300">+{record.amount}</p>
                  <p className="text-xs text-gray-400">ARTC</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-center space-y-4"
        >
          <h3 className="text-2xl font-bold text-white">Prêt à commencer ?</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/create"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-gold-500 to-yellow-400 text-black font-bold hover:from-gold-400 hover:to-yellow-300 transition-all"
            >
              Créer un NFT certifié
            </Link>
            <Link
              href="/community"
              className="px-8 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
            >
              Engager la communauté
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
