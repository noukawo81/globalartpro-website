'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePi } from '@/context/PiContext';
import { useAuth } from '@/context/AuthContext';
import { usePayment } from '@/hooks/usePayment';
import { initiatePiPayment, isPiBrowser, PiPayment } from '@/lib/piPayment';
import OrderSummary, { PurchaseBenefits, DeliveryInfo } from '@/components/checkout/OrderSummary';
import PaymentMethods, {
  ArtcPaymentForm,
  PiPaymentForm,
} from '@/components/checkout/PaymentMethods';
import { config } from '@/lib/config';

// Types
interface CheckoutItem {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: 'ARTC' | 'Pi';
  type: 'nft' | 'service';
}

interface PaymentMethod {
  id: 'artc' | 'pi';
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'artc',
    name: 'ARTC Wallet',
    icon: '🎨',
    description: 'Portefeuille GlobalArtpro',
    available: true,
  },
  {
    id: 'pi',
    name: config.currency.name + ' Network',
    icon: config.currency.symbol,
    description: 'Cryptomonnaie ' + config.currency.name,
    available: true,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: piUser, isAuthenticated: piAuthenticated, waitForPiSDK } = usePi();
  const { user: authUser, setSupporterStatus } = useAuth();
  const { processPayment, isProcessing } = usePayment();

  // Mock item data (in real app, this would come from cart/context)
  const [item] = useState<CheckoutItem>({
    id: searchParams.get('item') || 'demo-nft',
    title: 'Digital Dreams NFT',
    image: '/api/placeholder/400/400',
    price: 50,
    currency: 'ARTC',
    type: 'nft',
  });

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod['id']>('artc');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessingPi, setIsProcessingPi] = useState(false);

  const [donationOption, setDonationOption] = useState<'none' | '1' | '2' | '5' | 'custom'>('none');
  const [customDonation, setCustomDonation] = useState('');
  const [roundUp, setRoundUp] = useState(false);
  const [supporterMessage, setSupporterMessage] = useState('');
  const [isSupporter, setIsSupporter] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('gap_current_user');
      if (currentUser) {
        try {
          const parsed = JSON.parse(currentUser);
          if (parsed?.isSupporter) setIsSupporter(true);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Mock wallet balances
  const [artcBalance] = useState(2500);
  const [piBalance] = useState(piAuthenticated ? 2.5 : 0);

  const computeDonation = () => {
    let donation = 0;

    if (donationOption === '1' || donationOption === '2' || donationOption === '5') {
      donation += item.price * (Number(donationOption) / 100);
    }

    if (donationOption === 'custom') {
      const custom = Number(customDonation);
      if (!Number.isNaN(custom) && custom > 0) donation += custom;
    }

    if (roundUp) {
      const roundedTarget = Math.ceil(item.price);
      if (roundedTarget > item.price) {
        donation += roundedTarget - item.price;
      }
    }

    return Math.max(0, Number(donation.toFixed(2)));
  };

  const finalDonation = computeDonation();
  const totalFinal = Number((item.price + finalDonation).toFixed(2));



  const handlePayment = async () => {
    setValidationErrors([]);
    setPaymentSuccessMessage('');

    console.log('[CHECKOUT] 💳 Starting payment process...', { method: selectedMethod, amount: totalFinal });

    // **SPECIAL HANDLING FOR PI PAYMENT**
    if (selectedMethod === 'pi') {
      console.log('[CHECKOUT] 🥧 Initiating Pi Network payment...');
      
      // Validation Pi - vérifier la connexion
      if (!piAuthenticated) {
        console.error('[CHECKOUT] ✋ User not authenticated with Pi');
        setValidationErrors(['Connexion Pi Network requise']);
        return;
      }

    // **SPECIAL HANDLING FOR PI PAYMENT**
    if (selectedMethod === 'pi') {
      console.log('[CHECKOUT] 🥧 Initiating Pi Network payment...');
      
      // Validation Pi - vérifier la connexion
      if (!piAuthenticated) {
        console.error('[CHECKOUT] ✋ User not authenticated with Pi');
        setValidationErrors(['Connexion Pi Network requise - veuillez vous authentifier']);
        setIsProcessingPi(false);
        return;
      }

      // Attendre que le SDK Pi soit disponible avec timeout
      console.log('[CHECKOUT] ⏳ Waiting for Pi SDK...');
      const sdkAvailable = await waitForPiSDK();
      
      if (!sdkAvailable) {
        console.error('[CHECKOUT] ⚠️ Pi SDK not available after waiting');
        setValidationErrors(['⚠️ Pi SDK non disponible. Assurez-vous d\'utiliser le Pi Browser.']);
        setIsProcessingPi(false);
        return;
      }

      // Vérifier que window.Pi existe vraiment
      const pi = (window as any).Pi;
      if (!pi || typeof pi.createPayment !== 'function') {
        console.error('[CHECKOUT] ❌ Pi SDK not fully initialized');
        setValidationErrors(['❌ Erreur: SDK Pi non complètement initialisé. Veuillez rafraîchir la page.']);
        setIsProcessingPi(false);
        return;
      }

      try {
        console.log('[CHECKOUT] 🚀 Calling Pi SDK createPayment...');
        
        // Préparer les metadata du paiement
        const metadata = {
          itemId: item.id,
          itemTitle: item.title,
          itemPrice: item.price,
          donation: finalDonation,
          totalAmount: totalFinal,
          donationOption,
          roundUp,
          timestamp: new Date().toISOString(),
        };

        console.log('[CHECKOUT] 📦 Payment metadata:', metadata);

        // **APPEL AU SDK PI POUR CRÉER LE PAIEMENT**
        const paymentResult = await pi.createPayment(
          {
            amount: totalFinal,
            memo: `Achat: ${item.title}`,
            metadata,
          },
          {
            // Callbacks pour les états du paiement
            onReadyForServerApproval: async (paymentId: string) => {
              console.log('[CHECKOUT] 📲 Payment ready for approval:', paymentId);
              try {
                const res = await fetch('/api/pi/payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'approve',
                    paymentId,
                    amount: totalFinal,
                    memo: `Achat: ${item.title}`,
                    itemId: item.id,
                  }),
                });
                
                if (!res.ok) {
                  const errData = await res.text();
                  console.error('[CHECKOUT] ❌ Server approval failed:', errData);
                  throw new Error(`Erreur d'approbation serveur: ${res.status}`);
                }
                
                const result = await res.json();
                console.log('[CHECKOUT] ✅ Server approval confirmed:', result);
                
                if (result.signature && pi.completeServerApproval) {
                  console.log('[CHECKOUT] 🔐 Sending server signature to Pi SDK...');
                  await pi.completeServerApproval(paymentId, result.signature);
                }
              } catch (approvalError) {
                console.error('[CHECKOUT] ❌ Approval error:', approvalError);
                setValidationErrors([`Erreur d'approbation: ${approvalError instanceof Error ? approvalError.message : 'Erreur inconnue'}`]);
              }
            },

            onReadyForServerCompletion: async (paymentId: string, txid: string) => {
              console.log('[CHECKOUT] ✨ Payment ready for completion:', { paymentId, txid });
              try {
                const res = await fetch('/api/pi/payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'complete',
                    paymentId,
                    txid,
                    amount: totalFinal,
                    memo: `Achat: ${item.title}`,
                    itemId: item.id,
                  }),
                });
                
                if (!res.ok) {
                  const errData = await res.json();
                  console.error('[CHECKOUT] ❌ Server completion failed:', errData);
                  throw new Error(errData.error || `Erreur serveur: ${res.status}`);
                }
                
                console.log('[CHECKOUT] ✅ Payment completed successfully!');
                setPaymentSuccessMessage('✅ Paiement réussi! Redirection en cours...');
                
                // Traiter les données de donation/supporter
                if (finalDonation > 0) {
                  setSupporterStatus(true);
                  setIsSupporter(true);
                  setSupporterMessage('Merci pour votre contribution! 💛');
                }
                
                // Redirection après un court délai
                setTimeout(() => {
                  router.push(`/checkout/success?method=pi&amount=${totalFinal}&txid=${txid}`);
                }, 1500);
              } catch (completionError) {
                console.error('[CHECKOUT] ❌ Completion error:', completionError);
                setValidationErrors([`Erreur de finalisation: ${completionError instanceof Error ? completionError.message : 'Erreur inconnue'}`]);
              }
            },

            onCancel: (paymentId: string) => {
              console.log('[CHECKOUT] ⚠️ Payment cancelled by user:', paymentId);
              setValidationErrors(['Paiement annulé par l\'utilisateur']);
              setIsProcessingPi(false);
            },

            onError: (error: any, paymentId?: string) => {
              console.error('[CHECKOUT] ❌ Payment error:', error, paymentId);
              const errorMsg = error?.message || 'Erreur inconnue';
              setValidationErrors([`❌ Erreur de paiement: ${errorMsg}`]);
              setIsProcessingPi(false);
            },
          }
        );

        console.log('[CHECKOUT] 🎯 Payment object created:', paymentResult);
        return;
      } catch (error) {
        console.error('[CHECKOUT] ❌ Error initiating Pi payment:', error);
        const errorMsg = error instanceof Error ? error.message : 'Erreur lors de l\'initiation du paiement Pi';
        setValidationErrors([`❌ ${errorMsg}`]);
        setIsProcessingPi(false);
        return;
      }
    }
    }

    // **VALIDATION POUR ARTC**
    if (selectedMethod === 'artc') {
      // Validation ARTC - vérifier le solde utilisateur
      if (!authUser?.artcBalance || authUser.artcBalance < totalFinal) {
        setValidationErrors(['Solde ARTC insuffisant']);
        return;
      }
    }

    // Préparer les données de paiement
    const paymentData = {
      amount: totalFinal,
      donation: finalDonation,
      baseAmount: item.price,
      currency: item.currency,
      method: selectedMethod,
      itemId: item.id,
      itemTitle: item.title,
      userId: authUser?.email || piUser?.uid || 'anonymous',
      authUsername: authUser?.username || piUser?.username || null,
      donationOption,
      roundUp,
    };

    // Traiter le paiement
    const result = await processPayment(paymentData);

    if (result.success) {
      const userId = paymentData.userId || 'anonymous';
      if (finalDonation > 0) {
        setIsSupporter(true);
        setSupporterMessage('Merci pour votre soutien 💛');
        setSupporterStatus(true);
      }

      const storedDonations = typeof window !== 'undefined' ? localStorage.getItem('gap_donations') : null;
      const donations = storedDonations ? JSON.parse(storedDonations) : [];
      donations.push({
        userId,
        username: authUser?.username || 'invité',
        amount: finalDonation,
        date: new Date().toISOString(),
        itemId: item.id,
        itemTitle: item.title,
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('gap_donations', JSON.stringify(donations));
      }

      setPaymentSuccessMessage('Vous avez contribué à un impact réel 🌍');

      if (result.redirectUrl) {
        const redirectUrl = result.redirectUrl || '';
        if (redirectUrl) {
          setTimeout(() => {
            router.push(redirectUrl);
          }, 1200);
        }
      }
    } else {
      alert(result.error || 'Erreur de paiement');
    }
  };

  const canProceed = () => {
    switch (selectedMethod) {
      case 'artc':
        return artcBalance >= item.price;
      case 'pi':
        return piAuthenticated && piBalance >= item.price / 1000;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">
            Paiement sécurisé
          </h1>
          <p className="text-gray-400 mb-4">Finalisez votre achat en toute sécurité</p>
          
          {/* Devises acceptées */}
          <div className="flex justify-center gap-6 items-center flex-wrap">
            <div className="flex items-center gap-2 bg-gray-900/50 border border-blue-500/20 rounded-full px-4 py-2">
              <span className="text-lg">π</span>
              <span className="text-sm font-medium text-gray-300">Pi Network</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-900/50 border border-blue-500/20 rounded-full px-4 py-2">
              <span className="text-lg">🎨</span>
              <span className="text-sm font-medium text-gray-300">ARTC</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <OrderSummary item={item} />

            {/* Donation section */}
            <div className="mt-6 bg-gray-900/80 border border-blue-500/20 rounded-2xl p-5 space-y-4">
              <h2 className="text-lg font-semibold text-blue-300">Soutenir la Fondation GlobalArtpro 💙</h2>
              <p className="text-sm text-gray-300">Chaque contribution aide à préserver les cultures et soutenir les artistes dans le monde.</p>

              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {[
                  { value: 'none', label: 'Aucun don' },
                  { value: '1', label: '+1%' },
                  { value: '2', label: '+2%' },
                  { value: '5', label: '+5%' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDonationOption(option.value as 'none' | '1' | '2' | '5' | 'custom');
                      if (option.value !== 'custom') setCustomDonation('');
                    }}
                    className={`rounded-xl border p-2 text-sm font-medium transition-all ${
                      donationOption === option.value
                        ? 'border-blue-400 bg-blue-400/20 text-blue-100 shadow-lg shadow-blue-500/15'
                        : 'border-blue-300/30 bg-slate-950/40 text-gray-200 hover:border-blue-400 hover:bg-blue-400/10'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}

                <button
                  onClick={() => setDonationOption('custom')}
                  className={`rounded-xl border p-2 text-sm font-medium transition-all ${
                    donationOption === 'custom'
                      ? 'border-blue-400 bg-blue-400/20 text-blue-100 shadow-lg shadow-blue-500/15'
                      : 'border-blue-300/30 bg-slate-950/40 text-gray-200 hover:border-blue-400 hover:bg-blue-400/10'
                  }`}
                >
                  Montant personnalisé
                </button>
              </div>

              {donationOption === 'custom' && (
                <div className="mt-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={customDonation}
                    onChange={(e) => setCustomDonation(e.target.value)}
                    className="w-full rounded-lg border border-blue-300/30 bg-slate-950/50 px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
              )}

              <label className="inline-flex items-center gap-2 text-sm text-gray-300 mt-2">
                <input
                  type="checkbox"
                  checked={roundUp}
                  onChange={(e) => setRoundUp(e.target.checked)}
                  className="h-4 w-4 rounded border-blue-300/30 bg-slate-950/40 accent-blue-400"
                />
                <span>Arrondir le paiement pour soutenir la fondation</span>
              </label>

              <div className="pt-3 border-t border-blue-500/20 text-sm text-gray-100">
                <p>Prix initial: <span className="font-semibold">{item.price.toFixed(2)} {item.currency}</span></p>
                <p>Don ajouté: <span className="font-semibold">{finalDonation.toFixed(2)} {item.currency}</span></p>
                <p className="text-blue-200">Total final: <span className="font-bold">{totalFinal.toFixed(2)} {item.currency}</span></p>
              </div>

              {isSupporter && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg bg-blue-500/15 border border-blue-400/30 p-3 text-sm text-blue-100"
                >
                  Merci pour votre soutien 💙
                </motion.div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Méthode de paiement</h2>
              <PaymentMethods
                methods={paymentMethods}
                selectedMethod={selectedMethod}
                onMethodChange={setSelectedMethod}
              />
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-semibold mb-6 text-blue-300">
              {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </h2>

            {/* Payment Forms */}
            {selectedMethod === 'artc' && (
              <ArtcPaymentForm
                artcBalance={artcBalance}
                itemPrice={item.price}
              />
            )}

            {selectedMethod === 'pi' && (
              <PiPaymentForm
                piAuthenticated={piAuthenticated}
                piBalance={piBalance}
                itemPrice={item.price}
              />
            )}

            {/* Payment Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={(selectedMethod === 'pi' ? isProcessingPi : isProcessing) || !canProceed()}
              className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {(selectedMethod === 'pi' ? isProcessingPi : isProcessing) ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Traitement...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>🔒</span>
                  Payer {totalFinal.toLocaleString()} {item.currency}
                </div>
              )}
            </motion.button>

            {paymentSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 rounded-xl border border-blue-500/40 bg-blue-600/15 p-3 text-center text-sm text-blue-100 shadow-lg shadow-blue-500/30"
              >
                {paymentSuccessMessage}
              </motion.div>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300 px-2 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                💡 <span className="font-semibold text-blue-400">Astuce:</span> Sélectionnez "Pi Network" ci-dessus et cliquez sur "Payer" pour initier le paiement.
              </p>
            </div>

            {false && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="w-full max-w-md rounded-xl border border-blue-500/30 bg-gray-900 p-6 text-left">
                  <h3 className="text-lg font-bold text-blue-300 mb-2">Paiement Pi Network</h3>
                  <p className="text-sm text-gray-300 mb-4">Ce mode est préparatoire. Les paiements réels Pi seront gérés dans l'application App Studio, pas sur le web.</p>
                  <p className="text-xs text-gray-400 mb-6">SDK Pi non activé ici, rien n'est envoyé.</p>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-4">
              🔒 Paiement 100% sécurisé • Support 24/7
            </p>
          </motion.div>
        </div>

        {/* Back to cart link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link
            href="/explorer"
            className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <span>←</span>
            Retour à l'exploration
          </Link>
        </motion.div>
      </div>
    </div>
  );
}