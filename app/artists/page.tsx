'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Award, Users, TrendingUp, Clock, Zap, Crown, Palette, Globe, Heart, Eye, MessageCircle, Share2 } from 'lucide-react'

// Types
interface Artist {
  id: string
  name: string
  avatar: string
  country: string
  culture: string
  role: 'USER' | 'VIP' | 'EXPERT'
  domain?: string
  bio: string
  artworks: Artwork[]
  stats: {
    followers: number
    following: number
    artworks: number
    totalLikes: number
    totalViews: number
    artcEarned: number
    miningStreak: number
  }
  badges: string[]
  isOnline: boolean
  lastActive: string
  featured: boolean
}

interface Artwork {
  id: string
  title: string
  image: string
  description: string
  likes: number
  views: number
  price?: number
  currency?: 'ARTC' | 'USD'
  certified: boolean
  createdAt: string
}

// Mock data
const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Amara Kofi',
    avatar: '/api/placeholder/150/150',
    country: 'Bénin',
    culture: 'Afrique',
    role: 'EXPERT',
    domain: 'art',
    bio: 'Artiste et conservateur spécialisé dans l\'art traditionnel africain. Gardien des masques rituels et des sculptures ancestrales.',
    artworks: [
      {
        id: '1',
        title: 'Masque Egungun',
        image: '/api/placeholder/400/300',
        description: 'Masque rituel représentant les ancêtres lors des cérémonies funéraires.',
        likes: 245,
        views: 1200,
        price: 150,
        currency: 'ARTC',
        certified: true,
        createdAt: '2024-01-15'
      }
    ],
    stats: {
      followers: 1250,
      following: 89,
      artworks: 45,
      totalLikes: 8900,
      totalViews: 45000,
      artcEarned: 1250,
      miningStreak: 15
    },
    badges: ['expert', 'art'],
    isOnline: true,
    lastActive: 'Maintenant',
    featured: true
  },
  {
    id: '2',
    name: 'Sakura Tanaka',
    avatar: '/api/placeholder/150/150',
    country: 'Japon',
    culture: 'Asie',
    role: 'VIP',
    bio: 'Calligraphe et artiste digitale fusionnant tradition et modernité. Maître du wabi-sabi dans l\'ère numérique.',
    artworks: [
      {
        id: '2',
        title: 'Harmonie Numérique',
        image: '/api/placeholder/400/300',
        description: 'Fusion de calligraphie traditionnelle et art génératif.',
        likes: 189,
        views: 890,
        price: 200,
        currency: 'ARTC',
        certified: true,
        createdAt: '2024-01-14'
      }
    ],
    stats: {
      followers: 890,
      following: 67,
      artworks: 32,
      totalLikes: 5600,
      totalViews: 28000,
      artcEarned: 890,
      miningStreak: 8
    },
    badges: ['vip'],
    isOnline: false,
    lastActive: '2h ago',
    featured: false
  },
  {
    id: '3',
    name: 'Pierre Dubois',
    avatar: '/api/placeholder/150/150',
    country: 'France',
    culture: 'Europe',
    role: 'USER',
    bio: 'Photographe spécialisé dans l\'architecture sacrée. Capturant l\'âme des cathédrales gothiques.',
    artworks: [
      {
        id: '3',
        title: 'Lumières de Notre-Dame',
        image: '/api/placeholder/400/300',
        description: 'Moment de contemplation dans la cathédrale illuminée.',
        likes: 156,
        views: 720,
        price: 100,
        currency: 'ARTC',
        certified: false,
        createdAt: '2024-01-13'
      }
    ],
    stats: {
      followers: 450,
      following: 123,
      artworks: 28,
      totalLikes: 3200,
      totalViews: 15000,
      artcEarned: 450,
      miningStreak: 5
    },
    badges: [],
    isOnline: true,
    lastActive: 'Maintenant',
    featured: false
  }
]

// Badge definitions
const BADGE_CONFIG = {
  expert: { symbol: '🏛️', color: 'gold', label: 'Expert' },
  art: { symbol: '🎨', color: 'purple', label: 'Art' },
  vip: { symbol: '⭐', color: 'purple', label: 'VIP' }
}

export default function ArtistsPage() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [filter, setFilter] = useState<'all' | 'featured' | 'online' | 'expert'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredArtists = mockArtists.filter(artist => {
    const matchesFilter = filter === 'all' ||
      (filter === 'featured' && artist.featured) ||
      (filter === 'online' && artist.isOnline) ||
      (filter === 'expert' && artist.role === 'EXPERT')

    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.culture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.country.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const featuredArtist = mockArtists.find(a => a.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold text-white mb-6">
              Artistes <span className="text-purple-400">GlobalArtPro</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Découvrez les créateurs visionnaires qui donnent vie à la culture mondiale.
              Chaque artiste est un pont entre traditions ancestrales et innovation digitale.
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                Devenir Artiste
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border border-purple-400 text-purple-400 rounded-full font-semibold hover:bg-purple-400 hover:text-white transition-colors"
              >
                Explorer la Galerie
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Artist */}
      {featuredArtist && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Image
                    src={featuredArtist.avatar}
                    alt={featuredArtist.name}
                    width={150}
                    height={150}
                    className="rounded-full border-4 border-purple-400"
                  />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                </motion.div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Crown className="text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Artiste en Vedette</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{featuredArtist.name}</h2>
                  <p className="text-purple-300 mb-4">{featuredArtist.country} • {featuredArtist.culture}</p>
                  <p className="text-gray-300 mb-6 max-w-2xl">{featuredArtist.bio}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                    {featuredArtist.badges.map(badge => (
                      <span
                        key={badge}
                        className="px-3 py-1 bg-purple-600/50 text-purple-200 rounded-full text-sm font-medium"
                      >
                        {BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG]?.symbol} {BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG]?.label}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedArtist(featuredArtist)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Voir le Profil
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters and Search */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'Tous' },
                { key: 'featured', label: 'Vedettes' },
                { key: 'online', label: 'En ligne' },
                { key: 'expert', label: 'Experts' }
              ].map(({ key, label }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    filter === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {label}
                </motion.button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un artiste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
              <Globe className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredArtists.map((artist) => (
                <motion.div
                  key={artist.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -10 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedArtist(artist)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <Image
                        src={artist.avatar}
                        alt={artist.name}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      {artist.isOnline && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{artist.name}</h3>
                      <p className="text-sm text-gray-400">{artist.country} • {artist.culture}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {artist.badges.map(badge => (
                      <span
                        key={badge}
                        className="px-2 py-1 bg-purple-600/30 text-purple-200 rounded text-xs"
                      >
                        {BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG]?.symbol}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{artist.stats.followers}</div>
                      <div className="text-xs text-gray-400">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{artist.stats.artworks}</div>
                      <div className="text-xs text-gray-400">Œuvres</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Zap size={14} />
                      {artist.stats.artcEarned} ARTC
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={14} />
                      {artist.stats.miningStreak} jours
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Artist Detail Modal */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedArtist(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">Profil Artiste</h2>
                  <button
                    onClick={() => setSelectedArtist(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/3">
                    <div className="text-center">
                      <Image
                        src={selectedArtist.avatar}
                        alt={selectedArtist.name}
                        width={150}
                        height={150}
                        className="rounded-full mx-auto mb-4"
                      />
                      <h3 className="text-2xl font-bold text-white mb-2">{selectedArtist.name}</h3>
                      <p className="text-purple-300 mb-4">{selectedArtist.country} • {selectedArtist.culture}</p>
                      <div className="flex justify-center gap-2 mb-6">
                        {selectedArtist.badges.map(badge => (
                          <span
                            key={badge}
                            className="px-3 py-1 bg-purple-600/50 text-purple-200 rounded-full text-sm"
                          >
                            {BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG]?.symbol} {BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG]?.label}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedArtist.stats.followers}</div>
                          <div className="text-sm text-gray-400">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedArtist.stats.following}</div>
                          <div className="text-sm text-gray-400">Following</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedArtist.stats.artworks}</div>
                          <div className="text-sm text-gray-400">Œuvres</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedArtist.stats.artcEarned}</div>
                          <div className="text-sm text-gray-400">ARTC gagnés</div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors mb-4"
                      >
                        Suivre
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-6 py-3 border border-purple-400 text-purple-400 rounded-full font-semibold hover:bg-purple-400 hover:text-white transition-colors"
                      >
                        Contacter
                      </motion.button>
                    </div>
                  </div>

                  <div className="lg:w-2/3">
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold text-white mb-2">À propos</h4>
                      <p className="text-gray-300">{selectedArtist.bio}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xl font-semibold text-white mb-4">Œuvres Récentes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedArtist.artworks.map((artwork) => (
                          <motion.div
                            key={artwork.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/5 rounded-lg p-4 border border-white/10"
                          >
                            <Image
                              src={artwork.image}
                              alt={artwork.title}
                              width={300}
                              height={200}
                              className="rounded-lg mb-3 w-full"
                            />
                            <h5 className="text-lg font-semibold text-white mb-1">{artwork.title}</h5>
                            <p className="text-gray-400 text-sm mb-3">{artwork.description}</p>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Heart size={14} />
                                {artwork.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {artwork.views}
                              </span>
                              {artwork.price && (
                                <span className="text-purple-400 font-semibold">
                                  {artwork.price} {artwork.currency}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-white mb-4">Statistiques de Minage</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <Zap className="mx-auto mb-2 text-yellow-400" size={24} />
                          <div className="text-lg font-bold text-white">{selectedArtist.stats.artcEarned}</div>
                          <div className="text-sm text-gray-400">ARTC Total</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <TrendingUp className="mx-auto mb-2 text-green-400" size={24} />
                          <div className="text-lg font-bold text-white">{selectedArtist.stats.miningStreak}</div>
                          <div className="text-sm text-gray-400">Jours consécutifs</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <Heart className="mx-auto mb-2 text-red-400" size={24} />
                          <div className="text-lg font-bold text-white">{selectedArtist.stats.totalLikes}</div>
                          <div className="text-sm text-gray-400">Likes totaux</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 text-center">
                          <Eye className="mx-auto mb-2 text-blue-400" size={24} />
                          <div className="text-lg font-bold text-white">{selectedArtist.stats.totalViews}</div>
                          <div className="text-sm text-gray-400">Vues totales</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}