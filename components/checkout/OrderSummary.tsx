'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface OrderItem {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: 'ARTC' | 'Pi' | 'USD';
  type: 'nft' | 'service';
}

interface OrderSummaryProps {
  item: OrderItem;
  showDetails?: boolean;
}

export default function OrderSummary({ item, showDetails = true }: OrderSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl"
    >
      <h2 className="text-xl font-semibold mb-4 text-yellow-400">Récapitulatif</h2>

      <div className="flex gap-4 mb-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{item.title}</h3>
          <p className="text-gray-400 text-sm capitalize">{item.type}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold text-yellow-400">
              {item.price.toLocaleString()}
            </span>
            <span className="text-gray-400">{item.currency}</span>
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Détails supplémentaires */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Sous-total</span>
              <span>{item.price.toLocaleString()} {item.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Frais de transaction</span>
              <span className="text-green-400">Gratuit</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Protection acheteur</span>
              <span className="text-green-400">Incluse</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span className="text-yellow-400">
                {item.price.toLocaleString()} {item.currency}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Informations de sécurité */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="text-green-400">🔒</span>
          <span>Paiement 100% sécurisé</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="text-blue-400">✨</span>
          <span>Certificat GlobalArtpro inclus</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="text-purple-400">🎨</span>
          <span>Récompenses ARTC automatiques</span>
        </div>
      </div>
    </motion.div>
  );
}

// Composant pour afficher les avantages de l'achat
export function PurchaseBenefits() {
  const benefits = [
    {
      icon: '🎨',
      title: 'NFT Certifié',
      description: 'Authenticité garantie par GlobalArtpro',
    },
    {
      icon: '💰',
      title: 'Récompenses ARTC',
      description: '+50 ARTC pour création, +150 pour certification',
    },
    {
      icon: '🔄',
      title: 'Revente possible',
      description: 'Place de marché intégrée',
    },
    {
      icon: '📱',
      title: 'Support mobile',
      description: 'Compatible Pi Network et Mobile Money',
    },
    {
      icon: '🛡️',
      title: 'Protection acheteur',
      description: 'Remboursement garanti 30 jours',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
    >
      <h3 className="text-lg font-semibold mb-4 text-yellow-400">Avantages de votre achat</h3>

      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-start gap-3"
          >
            <span className="text-2xl mt-1">{benefit.icon}</span>
            <div>
              <div className="font-medium text-white">{benefit.title}</div>
              <div className="text-sm text-gray-400">{benefit.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Composant pour les informations de livraison/reception
export function DeliveryInfo({ type }: { type: 'nft' | 'service' }) {
  if (type === 'nft') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <span>📦</span>
          <span className="font-medium">Livraison instantanée</span>
        </div>
        <p className="text-sm text-gray-300">
          Votre NFT sera ajouté à votre wallet immédiatement après le paiement.
          Vous recevrez également un certificat numérique par email.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
    >
      <div className="flex items-center gap-2 text-green-400 mb-2">
        <span>⚡</span>
        <span className="font-medium">Activation immédiate</span>
      </div>
      <p className="text-sm text-gray-300">
        Votre service sera activé immédiatement après confirmation du paiement.
      </p>
    </motion.div>
  );
}