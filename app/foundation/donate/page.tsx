'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePi } from '@/context/PiContext';
import { useAuth } from '@/context/AuthContext';

export default function FoundationDonatePage() {
  const router = useRouter();
  const { waitForPiSDK, isAuthenticated: piAuthenticated, login } = usePi();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientUsername, setRecipientUsername] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [donationError, setDonationError] = useState('');

  const handlePiDonation = async () => {
    console.log('[DONATION] 🥧 Initiating Pi donation...');
    setDonationError('');
    setIsDonating(true);

    try {
      // Vérifier que le SDK Pi est disponible
      console.log('[DONATION] ⏳ Waiting for Pi SDK...');
      const sdkAvailable = await waitForPiSDK();

      if (!sdkAvailable) {
        console.warn('[DONATION] ⚠️ Pi SDK not available after waiting');
        setDonationError('⚠️ Pi SDK non disponible. Assurez-vous d\'utiliser le Pi Browser.');
        setIsDonating(false);
        return;
      }

      // Vérifier window.Pi
      const pi = (window as any).Pi;
      if (!pi) {
        console.error('[DONATION] ❌ Pi SDK not available');
        setDonationError('❌ Erreur: SDK Pi non disponible. Veuillez rafraîchir la page.');
        setIsDonating(false);
        return;
      }

      // Authentifier si nécessaire
      if (!piAuthenticated) {
        console.log('[DONATION] 🔐 Authenticating with Pi...');
        try {
          await login();
        } catch (authError) {
          console.error('[DONATION] ❌ Authentication failed:', authError);
          setDonationError('❌ Authentification Pi échouée. Veuillez réessayer.');
          setIsDonating(false);
          return;
        }
      }

      console.log('[DONATION] 🚀 Creating Pi payment...');

      // Créer le paiement
      const payment = await pi.createPayment(
        {
          amount: 1,
          memo: 'Don à la Fondation GlobalArtPro',
          metadata: {
            type: 'foundation-donation',
            timestamp: new Date().toISOString(),
          },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            console.log('[DONATION] 📲 Payment ready for approval:', paymentId);
            try {
              const res = await fetch('/api/pi/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'approve',
                  paymentId,
                  amount: 1,
                  memo: 'Don à la Fondation GlobalArtPro',
                }),
              });

              if (!res.ok) {
                const errData = await res.text();
                console.error('[DONATION] ❌ Server approval failed:', errData);
                throw new Error(`Erreur d'approbation serveur: ${res.status}`);
              }

              const result = await res.json();
              console.log('[DONATION] ✅ Server approval confirmed:', result);

              if (result.signature && pi.completeServerApproval) {
                console.log('[DONATION] 🔐 Sending server signature to Pi SDK...');
                pi.completeServerApproval(paymentId, result.signature);
              }
            } catch (approvalError) {
              console.error('[DONATION] ❌ Approval error:', approvalError);
              setDonationError(`Erreur d'approbation: ${approvalError instanceof Error ? approvalError.message : 'Erreur inconnue'}`);
            }
          },

          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log('[DONATION] ✨ Payment ready for completion:', { paymentId, txid });
            try {
              const res = await fetch('/api/pi/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'complete',
                  paymentId,
                  txid,
                  amount: 1,
                  memo: 'Don à la Fondation GlobalArtPro',
                }),
              });

              if (!res.ok) {
                const errData = await res.json();
                console.error('[DONATION] ❌ Server completion failed:', errData);
                throw new Error(errData.error || `Erreur serveur: ${res.status}`);
              }

              console.log('[DONATION] ✅ Donation completed successfully!');
              alert('✅ Merci pour votre soutien! Votre don a été reçu avec succès.');
              router.push('/foundation?donated=true');
            } catch (completionError) {
              console.error('[DONATION] ❌ Completion error:', completionError);
              setDonationError(`Erreur de finalisation: ${completionError instanceof Error ? completionError.message : 'Erreur inconnue'}`);
            } finally {
              setIsDonating(false);
            }
          },

          onCancel: (paymentId: string) => {
            console.log('[DONATION] ⚠️ Payment cancelled by user:', paymentId);
            setDonationError('Don annulé par l\'utilisateur');
            setIsDonating(false);
          },

          onError: (error: any, paymentId?: string) => {
            console.error('[DONATION] ❌ Payment error:', error, paymentId);
            const errorMsg = error?.message || 'Erreur inconnue';
            setDonationError(`❌ Erreur de paiement: ${errorMsg}`);
            setIsDonating(false);
          },
        }
      );

      console.log('[DONATION] 🎯 Payment object created:', payment);
    } catch (error) {
      console.error('[DONATION] ❌ Error initiating donation:', error);
      const errorMsg = error instanceof Error ? error.message : 'Erreur lors de l\'initiation du don Pi';
      setDonationError(`❌ ${errorMsg}`);
      setIsDonating(false);
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
            disabled={isDonating}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDonating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Donation en cours...</span>
              </>
            ) : (
              <span>Soutenir en Pi</span>
            )}
          </button>

          <button
            onClick={handleARTCDonation}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-full hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Offrir des ARTC
          </button>
        </motion.div>

        {donationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-300"
          >
            {donationError}
          </motion.div>
        )}
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
