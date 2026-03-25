'use client';

import { motion } from 'framer-motion';
import { CreateNFTFormData } from '@/types/studio';

interface NFTFormProps {
  formData: CreateNFTFormData;
  onChange: (data: Partial<CreateNFTFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const categories = [
  'Art',
  'Culture',
  'Tradition',
  'Performance',
  'Digital',
  'Sculpture',
] as const;

export default function NFTForm({
  formData,
  onChange,
  onSubmit,
  isLoading = false,
}: NFTFormProps) {
  const isComplete =
    formData.title &&
    formData.description &&
    formData.category &&
    formData.price &&
    formData.image;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">
          Titre de l'œuvre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Ex: Masque Baoulé Contemporain"
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition-all disabled:opacity-50"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Décrivez votre œuvre, son contexte culturel, sa signification..."
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          disabled={isLoading}
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition-all resize-none disabled:opacity-50"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-white">
          Catégorie <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange({ category: cat })}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.category === cat
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-lg shadow-yellow-500/30'
                  : 'bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:border-yellow-500/50 hover:text-white'
              } disabled:opacity-50`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-white">
            Prix <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => onChange({ price: e.target.value })}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition-all disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-white">
            Type monétaire
          </label>
          <div className="flex gap-2 h-full">
            {['ARTC', 'Pi'].map((type) => (
              <motion.button
                key={type}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  onChange({ priceType: type as 'ARTC' | 'Pi' })
                }
                disabled={isLoading}
                className={`flex-1 px-3 py-3 rounded-lg text-sm font-bold transition-all ${
                  formData.priceType === type
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-lg shadow-yellow-500/30'
                    : 'bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:border-yellow-500/50'
                } disabled:opacity-50`}
              >
                {type}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Certification */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-white">
          Type d'NFT
        </label>
        <div className="space-y-2">
          {[
            {
              value: true,
              label: 'NFT Certifié GlobalArtpro',
              desc: 'Accès récompenses, génération de revenus',
            },
            {
              value: false,
              label: 'NFT Non Certifié',
              desc: '2/jour gratuits - À certifier plus tard',
            },
          ].map((option) => (
            <motion.button
              key={String(option.value)}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange({ certified: option.value })}
              disabled={isLoading}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                formData.certified === option.value
                  ? 'border-yellow-500/50 bg-yellow-500/10'
                  : 'border-gray-700/50 bg-gray-800/30 hover:border-yellow-500/30'
              } disabled:opacity-50`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      formData.certified === option.value
                        ? 'border-yellow-400 bg-yellow-500/20'
                        : 'border-gray-600'
                    }`}
                  >
                    {formData.certified === option.value && (
                      <span className="text-yellow-300 text-xs font-bold">✓</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{option.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{option.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        whileHover={isComplete && !isLoading ? { scale: 1.05 } : {}}
        whileTap={isComplete && !isLoading ? { scale: 0.95 } : {}}
        disabled={!isComplete || isLoading}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
          isComplete && !isLoading
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-lg shadow-yellow-500/30 hover:from-yellow-300 hover:to-yellow-200'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin" />
            Création en cours...
          </span>
        ) : (
          '✨ Créer mon NFT'
        )}
      </motion.button>
    </motion.form>
  );
}
