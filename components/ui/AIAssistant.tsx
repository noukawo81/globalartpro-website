'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WandSparkles } from 'lucide-react';
import { GlobalArtProKnowledge } from '@/lib/ai-brain';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { role: 'bot', text: "Bonjour ! Je suis l'IA de GlobalArtPro. Comment puis-je vous aider ?" },
  ]);
  const [isSending, setIsSending] = useState(false);

  const createResponse = (question: string) => {
    const normalized = question
      .toLowerCase()
      .replace(/[’'`]/g, " ")
      .replace(/[^a-z0-9àâçéèêëîïôûùüÿñæœ ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (normalized.includes("fondation")) {
      return GlobalArtProKnowledge.vision;
    }
    if (normalized.includes("créé") || normalized.includes("fondateur")) {
      return `Le fondateur est ${GlobalArtProKnowledge.founder}.`;
    }
    if (normalized.includes("pi") || normalized.includes("blockchain")) {
      return "GlobalArtPro utilise la blockchain Pi pour sécuriser et authentifier les œuvres numériques.";
    }
    if (
      normalized.includes("inscrit") ||
      normalized.includes("inscription") ||
      normalized.includes("s inscrit") ||
      normalized.includes("comment s inscrit") ||
      normalized.includes("comment sinscrit") ||
      normalized.includes("comment s inscrire") ||
      normalized.includes("comment s inscrire") ||
      normalized.includes("creer un compte") ||
      normalized.includes("ouvrir un compte")
    ) {
      return "Pour vous inscrire sur GlobalArtPro, allez sur /register puis remplissez les informations demandées. Vous pouvez aussi cliquer sur 'Créer un compte' si vous êtes invité. Si vous avez besoin d'aide, je suis là pour vous guider.";
    }
    return "Je travaille sur votre demande... Je reviens vers vous avec une réponse précise.";
  };

  const handleAsk = () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setChat((prev) => [...prev, { role: 'user', text: trimmed }, { role: 'bot', text: '...' }]);
    setMessage("");
    setIsSending(true);

    const response = createResponse(trimmed);
    setTimeout(() => {
      setChat((prev) => {
        const updated = [...prev];
        const lastLoadingIndex = updated.map((item) => item.text).lastIndexOf('...');
        if (lastLoadingIndex !== -1) {
          updated[lastLoadingIndex] = { role: 'bot', text: response };
        }
        return updated;
      });
      setIsSending(false);
    }, 900);
  };


  return (
    <div className="fixed bottom-28 right-6 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, x: 10, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mb-4 w-80 h-96 bg-black/90 border border-gold-500/30 rounded-3xl backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-gold-500/20 bg-gold-500/10 text-gold-400 font-bold text-xs tracking-widest uppercase">
              Assistant Intelligent GAP
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm font-light">
              {chat.map((m, i) => (
                <div key={i} className={`p-3 rounded-2xl ${m.role === 'bot' ? 'bg-white/5 text-gray-300' : 'bg-gold-500/20 text-white ml-8'}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10 flex gap-2 items-center bg-white/5">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
                placeholder="Écrivez votre message..."
                className="bg-transparent border border-white/10 rounded-2xl px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 flex-1"
              />
              <button
                onClick={handleAsk}
                disabled={!message.trim() || isSending}
                className="w-12 h-12 rounded-2xl bg-gold-500 text-white flex items-center justify-center transition hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Envoyer le message"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    fill="currentColor"
                    d="M2.01 6.88 12 13.12 21.99 6.88 12 0 2.01 6.88ZM20 8.47 12 14.83 4 8.47V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.47Z"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.96 }}
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-sky-500 shadow-[0_20px_60px_-30px_rgba(99,102,241,0.9)] text-white ring-1 ring-white/20 transition-all hover:shadow-[0_0_0_20px_rgba(56,189,248,0.18)] focus:outline-none focus:ring-2 focus:ring-sky-300"
        style={{ animation: 'fabPulse 2.8s ease-in-out infinite' }}
        aria-label={isOpen ? 'Fermer l’assistante IA' : 'Ouvrir l’assistante IA'}
      >
        <WandSparkles className="w-5 h-5" />
        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-white/90 ring-1 ring-white/80" />
        {isOpen && (
          <span className="absolute inset-0 rounded-full bg-white/10" />
        )}
      </motion.button>
      <style jsx>{`
        @keyframes fabPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
}