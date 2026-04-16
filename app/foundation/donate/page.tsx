'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePi } from '@/context/PiContext';
import { useAuth } from '@/context/AuthContext';

export default function FoundationDonatePage() {
  const router = useRouter();
  const { createPayment, login, isAuthenticated } = usePi();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientUsername, setRecipientUsername] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const handlePiDonation = async () => {
    if (typeof window === 'undefined' || !window.Pi) {
      alert('Le SDK Pi Network n\'est pas disponible. Veuillez ouvrir l\'application Pi ou recharger la page.');
      return;
    }

    if (!isAuthenticated) {
      try {
        await login();
      } catch (error) {
        console.error('Échec de l\'authentification Pi:', error);
        alert('Connexion Pi annulée ou échouée. Veuillez réessayer.');
        return;
      }
    }

    try {
      const payment = await createPayment(1, 'Don à la Fondation GlobalArtPro');
      console.log('Paiement Pi créé:', payment);
      alert('Paiement Pi initié avec succès. Suivez les instructions de l\'interface Pi.');
      // Ici, vous pouvez ajouter la logique pour finaliser le paiement
    } catch (error) {
      console.error('Erreur lors du paiement Pi:', error);
      alert('Impossible de lancer le paiement Pi. Vérifiez votre connexion Pi et réessayez.');
    }
  };

  const handleARTCDonation = () => {
    setIsModalOpen(true);
  };

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount);
    if (!recipientUsername || isNaN(amount) || amount <= 0) {
      alert('Veuillez entrer un nom d\'utilisateur et un montant valide.');
      return;
    }

    if ((user?.artcBalance || 0) < amount) {
      alert('Solde insuffisant.');
      return;
    }

    setIsTransferring(true);
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail: user?.email, recipientUsername, amount }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Transfert réussi !');
        setIsModalOpen(false);
        setTransferAmount('');
        setRecipientUsername('');
        // Mettre à jour le solde localement si nécessaire
      } else {
        alert(data.error || 'Erreur lors du transfert.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du transfert.');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gold-400"
        >
          Soutenez la Fondation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-300 leading-relaxed"
        >
          Soutenez les artistes de GlobalArtPro pour bâtir ensemble le futur de l'art numérique.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button
            onClick={handlePiDonation}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Soutenir en Pi
          </button>

          <button
            onClick={handleARTCDonation}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-full hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Offrir des ARTC
          </button>
        </motion.div>
      </div>

      {/* Modale de transfert ARTC */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gold-400 mb-4 text-center">Offrir des ARTC</h2>
              <p className="text-gray-300 mb-4 text-center">
                Votre solde actuel : <span className="text-gold-400 font-bold">{user?.artcBalance || 0} ARTC</span>
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom d'utilisateur du destinataire"
                  value={recipientUsername}
                  onChange={(e) => setRecipientUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                <input
                  type="number"
                  placeholder="Montant à transférer"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-2xl hover:bg-slate-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={isTransferring}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-2xl hover:from-purple-700 hover:to-purple-600 transition-all disabled:opacity-50"
                >
                  {isTransferring ? 'Transfert...' : 'Transférer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
