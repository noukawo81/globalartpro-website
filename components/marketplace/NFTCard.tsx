'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NFTItem } from '@/lib/mockNFTs';
import { config } from '@/lib/config';
import { usePi } from '@/context/PiContext';

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
  const { waitForPiSDK } = usePi();

  const handleArtistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/artists`);
  };

  const handleBuy = async (paymentMethod: typeof PAYMENT_OPTIONS[number]['method']) => {
    setIsDropdownOpen(false);

    try {
      if (paymentMethod === 'Pi') {
        console.log('[NFT] 🥧 Initiating Pi payment for:', nft.title);

        // Vérifier que le SDK Pi est disponible
        const sdkAvailable = await waitForPiSDK();
        if (!sdkAvailable) {
          console.warn('[NFT] ⚠️ Pi SDK not available, continuing with limited support');
          alert('⚠️ Pi SDK not fully available. Payment may not work. Make sure you are in Pi Browser.');
        }

        const pi = (window as any).Pi;
        if (!pi) {
          console.error('[NFT] ❌ Pi SDK not available after waiting');
          alert('❌ Erreur: SDK Pi non disponible. Veuillez vérifier que vous utilisez le Pi Browser.');
          return;
        }

        console.log('[NFT] ✅ Pi SDK is ready, creating payment...');

        // Créer le paiement via le SDK Pi directement
        const payment = await pi.createPayment(
          {
            amount: nft.price,
            memo: `Achat NFT: ${nft.title}`,
            metadata: { nftId: nft.id, title: nft.title },
          },
          {
            onReadyForServerApproval: async (paymentId: string) => {
              console.log('[NFT] 📲 Payment ready for approval:', paymentId);
              try {
                const res = await fetch('/api/pi/payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'approve',
                    paymentId,
                    amount: nft.price,
                    memo: `Achat NFT: ${nft.title}`,
                  }),
                });
                if (!res.ok) {
                  const errData = await res.text();
                  throw new Error(`Erreur serveur (${res.status}): ${errData}`);
                }
                const result = await res.json();
                console.log('[NFT] ✅ Server approval confirmed:', result);
                
                // Compléter l'approbation avec la signature du serveur
                if (result.signature && pi.completeServerApproval) {
                  console.log('[NFT] 🔐 Sending server signature to Pi SDK...');
                  pi.completeServerApproval(paymentId, result.signature);
                } else {
                  console.warn('[NFT] ⚠️ No signature returned from server');
                }
              } catch (err) {
                console.error('[NFT] ❌ Error in approval:', err);
                alert(`❌ Erreur lors de l'approbation: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
              }
            },
            onReadyForServerCompletion: async (paymentId: string, txid: string) => {
              console.log('[NFT] ✨ Payment ready for completion:', { paymentId, txid });
              try {
                const res = await fetch('/api/pi/payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'complete',
                    paymentId,
                    txid,
                    amount: nft.price,
                    memo: `Achat NFT: ${nft.title}`,
                  }),
                });
                if (!res.ok) {
                  const err = await res.json();
                  throw new Error(err.error || `Erreur serveur: ${res.status}`);
                }
                const result = await res.json();
                console.log('[NFT] ✅ Payment completed successfully!', result);
                alert(`✅ Paiement réussi!\nPayment ID: ${paymentId}\nTransaction: ${txid}`);
                router.push(`/explorer/${nft.id}?purchased=true`);
              } catch (err) {
                console.error('[NFT] ❌ Error completing payment:', err);
                alert(`❌ Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
              }
            },
            onCancel: (paymentId: string) => {
              console.log('[NFT] ⚠️ Payment cancelled by user:', paymentId);
              alert('⚠️ Achat annulé.');
            },
            onError: (error: any) => {
              console.error('[NFT] ❌ Payment error:', error);
              alert(`❌ Erreur de paiement: ${error?.message || 'Erreur inconnue'}`);
            },
          }
        );

        console.log('[NFT] 🎯 Payment object created:', payment);
        return;
      }

      if (paymentMethod === 'ARTC') {
        alert(`Achat de ${nft.title} via ARTC. Prix: ${nft.price} ARTC. (À implémenter)`);
      }
    } catch (error) {
      console.error('[NFT] ❌ handleBuy error:', error);
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
