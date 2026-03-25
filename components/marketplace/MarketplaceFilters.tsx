'use client';

import { motion } from 'framer-motion';

export interface FilterState {
  category: string;
  certified: 'all' | 'certified' | 'uncertified';
  sort: 'newest' | 'popular' | 'pricelow' | 'pricehigh';
}

interface MarketplaceFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const categories = [
  'Tous',
  'Art',
  'Culture',
  'Tradition',
  'Performance',
  'Digital',
  'Sculpture',
];

const certifiedOptions = [
  { value: 'all', label: 'Tous' },
  { value: 'certified', label: 'Certifiés' },
  { value: 'uncertified', label: 'Non certifiés' },
];

const sortOptions = [
  { value: 'newest', label: 'Les plus récents' },
  { value: 'popular', label: 'Les plus populaires' },
  { value: 'pricelow', label: 'Prix: bas à haut' },
  { value: 'pricehigh', label: 'Prix: haut à bas' },
];

export default function MarketplaceFilters({
  filters,
  onFilterChange,
}: MarketplaceFiltersProps) {
  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: category === 'Tous' ? '' : category,
    });
  };

  const handleCertifiedChange = (
    value: 'all' | 'certified' | 'uncertified'
  ) => {
    onFilterChange({
      ...filters,
      certified: value,
    });
  };

  const handleSortChange = (
    value: 'newest' | 'popular' | 'pricelow' | 'pricehigh'
  ) => {
    onFilterChange({
      ...filters,
      sort: value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 mb-8"
    >
      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Catégorie
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                (filters.category === '' && cat === 'Tous') ||
                filters.category === cat
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-lg shadow-yellow-500/30'
                  : 'bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:border-yellow-500/50 hover:text-white'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Certified Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Certification
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {certifiedOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                handleCertifiedChange(
                  option.value as 'all' | 'certified' | 'uncertified'
                )
              }
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                filters.certified === option.value
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-lg shadow-yellow-500/30'
                  : 'bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:border-yellow-500/50 hover:text-white'
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Tri
        </h3>
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) =>
              handleSortChange(
                e.target
                  .value as 'newest' | 'popular' | 'pricelow' | 'pricehigh'
              )
            }
            className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 appearance-none cursor-pointer transition-all duration-200"
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-900 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
