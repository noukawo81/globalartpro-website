'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface GAPFoundationATMProps {
  walletAddress: string;
  onCopy: () => void;
  onSimulate: () => void;
  onConfirm: () => void;
  feedback: string;
  setFeedback: (value: string) => void;
}

export default function GAPFoundationATM({
  walletAddress,
  onCopy,
  onSimulate,
  onConfirm,
  feedback,
  setFeedback,
}: GAPFoundationATMProps) {
  const prefersReducedMotion = useReducedMotion();
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (feedback) {
      setShowParticles(true);
      timer = setTimeout(() => {
        setShowParticles(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [feedback]);

  const orbAnimation = prefersReducedMotion
    ? { rotate: 0 }
    : { rotate: [0, 360] };

  const atmCard = (
    <div className="relative w-full max-w-lg p-6 bg-black/60 border border-blue-300/30 rounded-3xl shadow-2xl shadow-blue-500/20 backdrop-blur-xl">
      <div className="absolute inset-0 rounded-3xl border border-yellow-300/40" />
      <div className="relative z-10 space-y-5">
        <h3 className="text-xl font-bold text-yellow-300">Musée Distributeur 3D</h3>
        <p className="text-sm text-gray-300">Un guichet d’espoir où chaque don devient oeuvre.</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border border-blue-500/30 rounded-xl bg-slate-900/70">
            <p className="text-xs uppercase text-blue-300">QR code Fondation</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(walletAddress)}&size=180x180&color=ffd700&bgcolor=000000`}
              alt="QR Code Fondation GlobalArtpro"
              className="mt-2 w-full h-auto rounded-lg border border-blue-400/40"
            />
          </div>
          <div className="p-3 border border-blue-500/30 rounded-xl bg-slate-900/70">
            <p className="text-xs uppercase text-blue-300">Adresse de réception</p>
            <p className="mt-2 text-xs text-gray-200 break-all">{walletAddress}</p>
            <button
              onClick={() => {
                onCopy();
                setFeedback('Adresse copiée !');
              }}
              className="mt-3 w-full px-3 py-2 text-xs font-semibold text-black uppercase bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-300"
            >
              Copier adresse
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              onSimulate();
              setFeedback('Simulation de paiement réussie.');
            }}
            className="px-4 py-3 font-semibold text-black bg-blue-400/90 rounded-lg hover:bg-blue-300 transition"
          >
            Simuler paiement
          </button>
          <button
            onClick={() => {
              onConfirm();
              setFeedback('Merci pour votre contribution à l’humanité');
            }}
            className="px-4 py-3 font-semibold text-black bg-yellow-300/90 rounded-lg hover:bg-yellow-200 transition"
          >
            Confirmer don
          </button>
        </div>

        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-green-500/20 border border-green-400/30 text-slate-50 text-sm"
          >
            {feedback}
          </motion.div>
        )}
      </div>

      {showParticles && (
        <div className="pointer-events-none absolute inset-0 plastic m-0 z-0">
          <div className="absolute top-1/2 left-1/2 h-1 w-1 rounded-full bg-yellow-300 animate-pulse" />
          <div className="absolute top-1/4 left-3/4 h-1 w-1 rounded-full bg-sky-300 animate-pulse delay-150" />
          <div className="absolute top-3/4 left-1/3 h-1 w-1 rounded-full bg-cyan-300 animate-pulse delay-300" />
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center gap-8">
      <motion.div
        animate={orbAnimation}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="w-40 h-40 rounded-full border border-yellow-300/40 bg-gradient-to-br from-blue-900/60 via-black/30 to-sky-900/60 shadow-[0_0_30px_rgba(255,215,0,0.4)]"
      />

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full border border-blue-200/20 bg-gradient-to-tl from-blue-950/30 via-black/0 to-transparent" />

      {atmCard}

      {prefersReducedMotion && (
        <p className="text-xs text-gray-400">Mode réduction de mouvement activé : animations simplifiées</p>
      )}
    </div>
  );
}
