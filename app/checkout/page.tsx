'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePi } from '@/context/PiContext';
import { useAuth } from '@/context/AuthContext';
import { usePayment, usePaymentValidation } from '@/hooks/usePayment';
import { initiatePiPayment, isPiBrowser, PiPayment } from '@/lib/piPayment';
import OrderSummary, { PurchaseBenefits, DeliveryInfo } from '@/components/checkout/OrderSummary';
import PaymentMethods, {
  CardPaymentForm,
  MobilePaymentForm,
  ArtcPaymentForm,
  PiPaymentForm,
} from '@/components/checkout/PaymentMethods';

// Types
interface CheckoutItem {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: 'ARTC' | 'Pi' | 'USD';
  type: 'nft' | 'service';
}

interface PaymentMethod {
  id: 'card' | 'mobile' | 'artc' | 'pi';
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Carte bancaire',
    icon: '💳',
    description: 'Visa, Mastercard, American Express',
    available: true,
  },
  {
    id: 'mobile',
    name: 'Mobile Money',
    icon: '📱',
    description: 'Orange Money, MTN, Wave',
    available: true,
  },
  {
    id: 'artc',
    name: 'ARTC Wallet',
    icon: '🎨',
    description: 'Portefeuille GlobalArtpro',
    available: true,
  },
  {
    id: 'pi',
    name: 'Pi Network',
    icon: 'π',
    description: 'Cryptomonnaie Pi',
    available: true,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: piUser, isAuthenticated: piAuthenticated } = usePi();
  const { user: authUser, setSupporterStatus } = useAuth();
  const { processPayment, isProcessing } = usePayment();
  const { validateCardDetails, validateMobileNumber } = usePaymentValidation();

  // Mock item data (in real app, this would come from cart/context)
  const [item] = useState<CheckoutItem>({
    id: searchParams.get('item') || 'demo-nft',
    title: 'Digital Dreams NFT',
    image: '/api/placeholder/400/400',
    price: 50,
    currency: 'ARTC',
    type: 'nft',
  });

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod['id']>('card');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [donationOption, setDonationOption] = useState<'none' | '1' | '2' | '5' | 'custom'>('none');
  const [customDonation, setCustomDonation] = useState('');
  const [roundUp, setRoundUp] = useState(false);
  const [supporterMessage, setSupporterMessage] = useState('');
  const [isSupporter, setIsSupporter] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState('');
  const [showPiModal, setShowPiModal] = useState(false);

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

  const handlePiButton = () => {
    if (isPiBrowser()) {
      // future: open Pi in-app checkout (App Studio)
      setShowPiModal(true);
    } else {
      // fallback web-friendly UX
      setShowPiModal(true);
    }
    initiatePiPayment();
  };

  const handlePayment = async () => {
    setValidationErrors([]);
    setPaymentSuccessMessage('');

    // Validation selon la méthode
    if (selectedMethod === 'card') {
      const validation = validateCardDetails(cardDetails);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        return;
      }
    } else if (selectedMethod === 'mobile') {
      const validation = validateMobileNumber(mobileNumber);
      if (!validation.isValid) {
        setValidationErrors([validation.error!]);
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
      userId: selectedMethod === 'mobile' ? mobileNumber : authUser?.email || piUser?.uid || 'anonymous',
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
      case 'card':
        return cardDetails.number && cardDetails.expiry && cardDetails.cvc && cardDetails.name;
      case 'mobile':
        return mobileNumber.length >= 8;
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-2">
            Paiement sécurisé
          </h1>
          <p className="text-gray-400">Finalisez votre achat en toute sécurité</p>
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
            <div className="mt-6 bg-gray-900/80 border border-yellow-500/20 rounded-2xl p-5 space-y-4">
              <h2 className="text-lg font-semibold text-yellow-300">Soutenir la Fondation GlobalArtpro 💛</h2>
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
                        ? 'border-yellow-400 bg-yellow-400/20 text-yellow-100 shadow-lg shadow-yellow-500/15'
                        : 'border-yellow-300/30 bg-black/40 text-gray-200 hover:border-yellow-400 hover:bg-yellow-400/10'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}

                <button
                  onClick={() => setDonationOption('custom')}
                  className={`rounded-xl border p-2 text-sm font-medium transition-all ${
                    donationOption === 'custom'
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-100 shadow-lg shadow-yellow-500/15'
                      : 'border-yellow-300/30 bg-black/40 text-gray-200 hover:border-yellow-400 hover:bg-yellow-400/10'
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
                    className="w-full rounded-lg border border-yellow-300/30 bg-black/50 px-3 py-2 text-white focus:border-yellow-400 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
              )}

              <label className="inline-flex items-center gap-2 text-sm text-gray-300 mt-2">
                <input
                  type="checkbox"
                  checked={roundUp}
                  onChange={(e) => setRoundUp(e.target.checked)}
                  className="h-4 w-4 rounded border-yellow-300/30 bg-black/40 accent-yellow-400"
                />
                <span>Arrondir le paiement pour soutenir la fondation</span>
              </label>

              <div className="pt-3 border-t border-yellow-500/20 text-sm text-gray-100">
                <p>Prix initial: <span className="font-semibold">{item.price.toFixed(2)} {item.currency}</span></p>
                <p>Don ajouté: <span className="font-semibold">{finalDonation.toFixed(2)} {item.currency}</span></p>
                <p className="text-yellow-200">Total final: <span className="font-bold">{totalFinal.toFixed(2)} {item.currency}</span></p>
              </div>

              {isSupporter && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg bg-yellow-500/15 border border-yellow-400/30 p-3 text-sm text-yellow-100"
                >
                  Merci pour votre soutien 💛
                </motion.div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">Méthode de paiement</h2>
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
            <h2 className="text-xl font-semibold mb-6 text-yellow-400">
              {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </h2>

            {/* Payment Forms */}
            {selectedMethod === 'card' && (
              <CardPaymentForm
                cardDetails={cardDetails}
                onCardDetailsChange={setCardDetails}
                errors={validationErrors}
              />
            )}

            {selectedMethod === 'mobile' && (
              <MobilePaymentForm
                mobileNumber={mobileNumber}
                onMobileNumberChange={setMobileNumber}
                error={validationErrors.length > 0 ? validationErrors[0] : undefined}
              />
            )}

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
              disabled={isProcessing || !canProceed()}
              className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
            >
              {isProcessing ? (
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
                className="mt-4 rounded-xl border border-yellow-400/40 bg-yellow-500/15 p-3 text-center text-sm text-yellow-100 shadow-lg shadow-yellow-500/30"
              >
                {paymentSuccessMessage}
              </motion.div>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300 mb-2">Paiement sécurisé via Pi Network disponible dans l’application officielle</p>
              <button
                onClick={handlePiButton}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-500/40 bg-blue-600/60 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              >
                π Payer avec Pi
              </button>
            </div>

            {showPiModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="w-full max-w-md rounded-xl border border-yellow-300/30 bg-gray-900 p-6 text-left">
                  <h3 className="text-lg font-bold text-yellow-300 mb-2">Paiement Pi Network</h3>
                  <p className="text-sm text-gray-300 mb-4">Ce mode est préparatoire. Les paiements réels Pi seront gérés dans l’application App Studio, pas sur le web.</p>
                  <p className="text-xs text-gray-400 mb-6">SDK Pi non activé ici, rien n’est envoyé.</p>
                  <button
                    onClick={() => setShowPiModal(false)}
                    className="rounded-lg bg-yellow-400/20 px-4 py-2 text-sm font-semibold text-yellow-100 hover:bg-yellow-400/30"
                  >
                    Fermer
                  </button>
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