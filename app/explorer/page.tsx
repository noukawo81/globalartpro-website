'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import MarketplaceFilters, { FilterState } from '@/components/marketplace/MarketplaceFilters';
import NFTCard from '@/components/marketplace/NFTCard';
import { mockNFTs, NFTItem } from '@/lib/mockNFTs';

export default function ExplorerPage() {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    certified: 'all',
    sort: 'newest',
  });

  // Filtrer et trier les NFTs
  const filteredNFTs = useMemo(() => {
    let result = [...mockNFTs];

    // Filtre catégorie
    if (filters.category) {
      result = result.filter((nft) => nft.category === filters.category);
    }

    // Filtre certification
    if (filters.certified === 'certified') {
      result = result.filter((nft) => nft.certified);
    } else if (filters.certified === 'uncertified') {
      result = result.filter((nft) => !nft.certified);
    }

    // Tri
    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'pricelow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'pricehigh':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [filters]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative py-12 sm:py-16 border-b border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 bg-clip-text text-transparent">
              Explorer les œuvres
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              Découvrez une collection curatée d'œuvres d'art numériques du monde entier. 
              Des créations certifiées aux artistes émergents de notre communauté globale.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-800/50"
          >
            {[
              { label: 'Œuvres', value: mockNFTs.length },
              { label: 'Créateurs', value: new Set(mockNFTs.map(n => n.creator)).size },
              { label: 'Certifiées', value: mockNFTs.filter(n => n.certified).length },
              { label: 'Vues totales', value: Math.floor(mockNFTs.reduce((sum, n) => sum + n.views, 0) / 1000) + 'K' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-blue-300">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop */}
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="sticky top-24 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 p-6">
                <h2 className="text-lg font-bold text-white mb-6">Filtrer</h2>
                <MarketplaceFilters
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </motion.aside>

            {/* NFT Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3 space-y-8"
            >
              {/* Mobile Filters */}
              <div className="lg:hidden">
                <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 p-4 sm:p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Filtrer</h2>
                  <MarketplaceFilters
                    filters={filters}
                    onFilterChange={setFilters}
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  <span className="font-semibold text-white">
                    {filteredNFTs.length}
                  </span>{' '}
                  résultats
                </p>
              </div>

              {/* NFT Grid */}
              {filteredNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNFTs.map((nft, idx) => (
                    <motion.div
                      key={nft.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: idx * 0.05,
                      }}
                    >
                      <NFTCard nft={nft} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="text-center space-y-4">
                    <div className="text-5xl">🎨</div>
                    <h3 className="text-xl font-bold text-white">
                      Aucune œuvre trouvée
                    </h3>
                    <p className="text-gray-400">
                      Essayez d'ajuster vos filtres
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}