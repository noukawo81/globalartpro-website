'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import GAPFoundationATM from '@/components/foundation/GAPFoundationATM';

const FOUNDATION_WALLET = 'ARTC1XyZ8..9pQvWz7G21T';

export default function FoundationDonatePage() {
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(FOUNDATION_WALLET);
      setCopied(true);
      setFeedback('Adresse copiée avec succès.');
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setFeedback('Impossible de copier. Veuillez copier manuellement.');
    }
  };

  const handleSimulate = () => {
    setSimulated(true);
    setFeedback('Simulation de paiement effectuée. L’énergie du don est ressentie.');
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setFeedback('Merci pour votre contribution à l’humanité');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#03040c] via-[#070b1f] to-[#02050f] text-white py-12 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.section
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-black text-yellow-300">Distributeur Automatique Fondation</h1>
          <p className="text-xl md:text-2xl text-blue-100">Un don noble devient un geste sacré.</p>
          <p className="max-w-3xl mx-auto text-gray-300">Chaque support compte. Cette interface symbolique consacre votre contribution, dans un style musée futuriste.</p>
          <div className="flex justify-center gap-2">
            <Link href="/foundation" className="px-5 py-2 rounded-full border border-blue-300/40 text-blue-100 hover:bg-blue-500/20">Retour Fondation</Link>
          </div>
        </motion.section>

        <motion.section
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-blue-300/20 bg-black/40 backdrop-blur-md p-8"
        >
          <GAPFoundationATM
            walletAddress={FOUNDATION_WALLET}
            onCopy={handleCopy}
            onSimulate={handleSimulate}
            onConfirm={handleConfirm}
            feedback={feedback}
            setFeedback={setFeedback}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-900/70 border border-blue-300/20 p-4 text-sm">
              <h4 className="font-semibold text-blue-100">État</h4>
              <p className="text-gray-300 mt-2">Copié : {copied ? 'Oui' : 'Non'}</p>
            </div>
            <div className="rounded-xl bg-slate-900/70 border border-blue-300/20 p-4 text-sm">
              <h4 className="font-semibold text-blue-100">Simulation</h4>
              <p className="text-gray-300 mt-2">Etat : {simulated ? 'Réalisée' : 'En attente'}</p>
            </div>
            <div className="rounded-xl bg-slate-900/70 border border-blue-300/20 p-4 text-sm">
              <h4 className="font-semibold text-blue-100">Don confirmé</h4>
              <p className="text-gray-300 mt-2">Etat : {confirmed ? 'Confirmé' : 'En attente'}</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-blue-900/50 via-black/30 to-blue-900/40 border border-blue-300/25 p-6"
        >
          <h3 className="text-xl font-semibold text-yellow-300">Feedback</h3>
          <p className="mt-2 text-gray-200">{feedback || "Appuyez sur 'Confirmer don' pour finaliser l'acte noble."}</p>
          <div className="mt-4 relative h-24 overflow-hidden">
            {!prefersReducedMotion && (
              <div className="absolute inset-0 animate-[pulse_2s_infinite] rounded-2xl bg-gradient-to-r from-yellow-400/30 via-cyan-400/20 to-blue-500/30" />
            )}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
