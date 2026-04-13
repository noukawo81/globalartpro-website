'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PaymentMethod {
  id: 'artc' | 'pi';
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  selectedMethod: PaymentMethod['id'];
  onMethodChange: (method: PaymentMethod['id']) => void;
}

export default function PaymentMethods({ methods, selectedMethod, onMethodChange }: PaymentMethodsProps) {
  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <motion.button
          key={method.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onMethodChange(method.id)}
          disabled={!method.available}
          className={`w-full p-4 rounded-xl border transition-all ${
            selectedMethod === method.id
              ? 'border-yellow-400 bg-yellow-400/10'
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{method.icon}</span>
            <div className="text-left">
              <div className="font-semibold">{method.name}</div>
              <div className="text-sm text-gray-400">{method.description}</div>
            </div>
            {selectedMethod === method.id && (
              <div className="ml-auto">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              </div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// Composant pour le formulaire de paiement ARTC
interface ArtcPaymentFormProps {
  artcBalance: number;
  itemPrice: number;
}

export function ArtcPaymentForm({ artcBalance, itemPrice }: ArtcPaymentFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-green-400 font-medium">Solde ARTC</span>
          <span className="text-green-400 font-bold">{artcBalance.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Montant requis</span>
          <span className="text-white font-bold">{itemPrice.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-green-500/20">
          <span className="text-gray-300">Solde restant</span>
          <span className={`font-bold ${(artcBalance - itemPrice) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {(artcBalance - itemPrice).toLocaleString()}
          </span>
        </div>
      </div>

      {artcBalance < itemPrice && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <span>⚠️</span>
            <span className="font-medium">Solde insuffisant</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            Vous n'avez pas assez d'ARTC. Convertissez des Pi ou achetez des ARTC.
          </p>
        </div>
      )}
    </motion.div>
  );
}

// Composant pour le formulaire de paiement Pi
interface PiPaymentFormProps {
  piAuthenticated: boolean;
  piBalance: number;
  itemPrice: number;
}

export function PiPaymentForm({ piAuthenticated, piBalance, itemPrice }: PiPaymentFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {!piAuthenticated ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <span>🔐</span>
            <span className="font-medium">Connexion requise</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            Vous devez être connecté avec Pi Network pour utiliser cette méthode.
          </p>
        </div>
      ) : (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-400 font-medium">Solde Pi</span>
            <span className="text-orange-400 font-bold">{piBalance.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Montant requis</span>
            <span className="text-white font-bold">{(itemPrice / 1000).toFixed(2)} π</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-orange-500/20">
            <span className="text-gray-300">Solde restant</span>
            <span className={`font-bold ${(piBalance - itemPrice / 1000) >= 0 ? 'text-orange-400' : 'text-red-400'}`}>
              {(piBalance - itemPrice / 1000).toFixed(2)} π
            </span>
          </div>
        </div>
      )}

      {piAuthenticated && piBalance < itemPrice / 1000 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <span>⚠️</span>
            <span className="font-medium">Solde insuffisant</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            Vous n'avez pas assez de Pi. Minez plus de Pi ou convertissez des ARTC.
          </p>
        </div>
      )}
    </motion.div>
  );
}