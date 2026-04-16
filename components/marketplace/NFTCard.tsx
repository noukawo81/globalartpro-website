'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NFTItem } from '@/lib/mockNFTs';
import { config } from '@/lib/config';

const PAYMENT_OPTIONS = [
  { label: `Payer en ${config.currency.name}`, method: 'Pi' },
  { label: 'Offrir en ARTC', method: 'ARTC' },
] as const;

interface NFTCardProps {
  nft: NFTItem;
}

export default function NFTCard({ nft }: NFTCardProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleArtistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/artists`);
  };

  const handleBuy = async (paymentMethod: typeof PAYMENT_OPTIONS[number]['method']) => {
    setIsDropdownOpen(false);
    
    try {
      if (paymentMethod === 'Pi') {
        const pi = (window as any).Pi;
        const isPiBrowser = /PiBrowser/i.test(navigator.userAgent);
        
        // Check if in Pi Browser
        if (!isPiBrowser || !pi) {
          console.warn('Not in Pi Browser, using test mode payment');
          
          // Mode test: Simulate payment for development
          if (config.pi.sandbox) {
            alert('🧪 Mode Test - Simulation de paiement Pi en cours...');
            
            // Generate test payment ID
            const testPaymentId = `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const testTxId = `test_tx_${Date.now()}`;
            
            try {
              // Call approval endpoint
              const approveRes = await fetch('/api/pi/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'approve',
                  paymentId: testPaymentId,
                  amount: nft.price,
                  memo: `Achat de ${nft.title}`,
                })
              });
              
              if (!approveRes.ok) {
                throw new Error(`Erreur lors de l'approbation: ${approveRes.status}`);
              }
              
              console.log('✅ Approval accepted in test mode');
              
              // Call completion endpoint
              const completeRes = await fetch('/api/pi/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'complete',
                  paymentId: testPaymentId,
                  txid: testTxId,
                  amount: nft.price,
                  memo: `Achat de ${nft.title}`,
                })
              });
              
              if (!completeRes.ok) {
                const err = await completeRes.json();
                throw new Error(err.error || `Erreur serveur: ${completeRes.status}`);
              }
              
              const result = await completeRes.json();
              console.log('✅ Payment completed in test mode:', result);
              alert(`✅ Paiement test réussi!\n\nID Paiement: ${testPaymentId}\nTx ID: ${testTxId}\n\nMontant: ${nft.price} ${config.currency.symbol}`);
              router.push('/marketplace');
              return;
            } catch (err) {
              console.error('Test payment error:', err);
              alert(`❌ Erreur paiement test: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
              return;
            }
          } else {
            alert('⚠️ Paiement Pi requiert le Pi Browser officiel.\n\n1. Téléchargez l\'application Pi Network\n2. Ouvrez cette page dans le Pi Browser intégré\n3. Cliquez de nouveau sur "Payer"');
            return;
          }
        }

        console.log('Initiating Pi payment for:', nft.title, nft.price);
        
        // Ensure Pi is initialized with correct scopes
        try {
          await pi.init({
            version: '2.0',
            sandbox: config.pi.sandbox,
            appId: config.pi.appId,
          });
          console.log('Pi initialized');
        } catch (initErr) {
          console.warn('Pi init warning (may be already initialized):', initErr);
        }

        // Authenticate with payments scope
        try {
          console.log('Authenticating with payments scope...');
          const auth = await pi.authenticate(['payments']);
          console.log('Authentication successful:', auth);
        } catch (authErr) {
          console.error('Pi authentication error:', authErr);
          alert('Erreur d\'authentification Pi. Assurez-vous d\'être dans le Pi Browser.');
          return;
        }

        // Alert for debugging
        alert('Tentative de paiement Pi lancée !');

        // Create payment
        const payment = await pi.createPayment(
          {
            amount: nft.price,
            memo: `Achat de ${nft.title}`,
            metadata: { nftId: nft.id, title: nft.title },
          },
          {
            onReadyForServerApproval: async (paymentId: string) => {
              console.log('Payment ready for approval:', paymentId);
              try {
                const res = await fetch('/api/pi/payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'approve',
                    paymentId,
                    amount: nft.price,
                    memo: `Achat de ${nft.title}`,
                  })
                });
                if (!res.ok) {
                  throw new Error(`Erreur serveur: ${res.status}`);
                }
                console.log('Server approval confirmed');
              } catch (err) {
                console.error('Error sending approval:', err);
              }
            },
            onReadyForServerCompletion: async (paymentId: string, txid: string) => {
              console.log('Payment ready for completion:', paymentId, txid);
              try {
                const res = await fetch('/api/pi/payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'complete',
                    paymentId,
                    txid,
                    amount: nft.price,
                    memo: `Achat de ${nft.title}`,
                  })
                });
                if (!res.ok) {
                  const err = await res.json();
                  throw new Error(err.error || `Erreur serveur: ${res.status}`);
                }
                alert(`Paiement complété! ID: ${paymentId}`);
              } catch (err) {
                console.error('Error completing payment:', err);
                alert(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
              }
            },
            onCancel: (paymentId: string) => {
              console.log('Payment cancelled:', paymentId);
              alert('Achat annulé.');
            },
            onError: (error: any) => {
              console.error('Payment error:', error);
              alert(`Erreur de paiement: ${error?.message || 'Erreur inconnue'}`);
            },
          }
        );
        
        console.log('Payment created:', payment);
      } else if (paymentMethod === 'ARTC') {
        // TODO: Implement ARTC transfer logic
        alert(`Achat de ${nft.title} via ARTC. Prix: ${nft.price} ARTC. (À implémenter)`);
      }
    } catch (error) {
      console.error('handleBuy error:', error);
      alert(`Erreur lors de l'achat: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative h-full group">
      <Link href={`/explorer/${nft.id}`}>
        <motion.div
          whileHover={{ scale: 1.05, translateY: -8 }}
          whileTap={{ scale: 0.98 }}
          className="group cursor-pointer h-full"
        >
          <div className="relative rounded-2xl overflow-visible bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/50 h-full flex flex-col">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 group-hover:from-blue-500/10 group-hover:to-blue-500/5" />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl" />
          </div>

          {/* Image container */}
          <div className="relative w-full aspect-square overflow-hidden bg-gray-950">
            <Image
              src={nft.image}
              alt={nft.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Category badge */}
            <div className="absolute top-3 left-3 z-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold text-white"
              >
                {nft.category}
              </motion.div>
            </div>

            {/* Certified badge */}
            {nft.certified && (
              <div className="absolute top-3 right-3 z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/50"
                >
                  <span className="text-sm font-bold">✓</span>
                </motion.div>
              </div>
            )}

            {/* View count overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
              <div className="text-xs text-gray-300">
                👁️ {(nft.views / 1000).toFixed(1)}K views
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between relative z-10">
            {/* Title & Creator */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                {nft.title}
              </h3>
              <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                par{' '}
                <button
                  onClick={handleArtistClick}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline"
                >
                  {nft.creator}
                </button>
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-gray-800/50 pt-3 flex flex-col gap-3">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Prix</p>
                <p className="text-lg font-bold text-blue-300">
                  {config.formatPrice(nft.price)}
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-blue-400 transition"
                >
                  Acheter avec {config.currency.name}
                </button>
              </div>
            </div>

              {/* Certified indicator */}
              {!nft.certified && (
                <div className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-400 font-medium">
                  Non certifié
                </div>
              )}
            </div>

          {/* Hover button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2 rounded-lg pointer-events-auto hover:from-blue-500 hover:to-blue-400"
            >
              Voir détails
            </motion.div>
          </div>
        </div>
        </motion.div>
      </Link>

      {/* Dropdown positioned relative to parent wrapper */}
      {isDropdownOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-950 border border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50" style={{ top: '100%' }}>
          {PAYMENT_OPTIONS.map((option) => (
            <button
              key={option.method}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                handleBuy(option.method);
              }}
              className="w-full text-left px-4 py-3 text-sm text-white hover:bg-slate-900 transition"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
