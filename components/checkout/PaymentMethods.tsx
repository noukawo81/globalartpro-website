'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PaymentMethod {
  id: 'card' | 'mobile' | 'artc' | 'pi';
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

// Composant pour le formulaire de paiement par carte
interface CardPaymentFormProps {
  cardDetails: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
  onCardDetailsChange: (details: { number: string; expiry: string; cvc: string; name: string }) => void;
  errors?: string[];
}

export function CardPaymentForm({ cardDetails, onCardDetailsChange, errors = [] }: CardPaymentFormProps) {
  const handleChange = (field: string, value: string) => {
    onCardDetailsChange({
      ...cardDetails,
      [field]: value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-2">Numéro de carte</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardDetails.number}
          onChange={(e) => handleChange('number', e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Expiration</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={cardDetails.expiry}
            onChange={(e) => handleChange('expiry', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">CVC</label>
          <input
            type="text"
            placeholder="123"
            value={cardDetails.cvc}
            onChange={(e) => handleChange('cvc', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Nom du titulaire</label>
        <input
          type="text"
          placeholder="John Doe"
          value={cardDetails.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
        />
      </div>

      {errors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <span>⚠️</span>
            <span className="font-medium">Erreurs de validation</span>
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-xs text-gray-400 mt-2">
        🔒 Paiement sécurisé par Stripe
      </div>
    </motion.div>
  );
}

// Composant pour le formulaire de paiement mobile
interface MobilePaymentFormProps {
  mobileNumber: string;
  onMobileNumberChange: (number: string) => void;
  error?: string;
}

export function MobilePaymentForm({ mobileNumber, onMobileNumberChange, error }: MobilePaymentFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
        <input
          type="tel"
          placeholder="+225 XX XX XX XX XX"
          value={mobileNumber}
          onChange={(e) => onMobileNumberChange(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-yellow-400 focus:outline-none transition-colors"
        />
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <span>ℹ️</span>
          <span className="font-medium">Information</span>
        </div>
        <p className="text-sm text-gray-300">
          Vous recevrez un SMS de confirmation pour valider le paiement.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <span>⚠️</span>
            <span className="font-medium">Erreur</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">{error}</p>
        </div>
      )}
    </motion.div>
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