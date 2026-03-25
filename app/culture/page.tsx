'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Types
interface Publication {
  id: string;
  type: 'image' | 'text';
  title: string;
  description: string;
  author: string;
  role: 'User' | 'VIP' | 'Expert';
  country: string;
  culture: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  saves: number;
  timestamp: string;
}

interface CulturalSpace {
  id: string;
  name: string;
  description: string;
  publications: Publication[];
}

// Mock data
const mockPublications: Publication[] = [
  {
    id: '1',
    type: 'image',
    title: 'Masques Rituals du Bénin',
    description: 'Les masques Egungun représentent les ancêtres et sont utilisés lors des cérémonies funéraires. Chaque masque raconte une histoire unique de la communauté.',
    author: 'Dr. Amara Kofi',
    role: 'Expert',
    country: 'Bénin',
    culture: 'Afrique',
    imageUrl: '/api/placeholder/400/300',
    likes: 245,
    comments: 32,
    saves: 89,
    timestamp: '2024-01-15'
  },
  {
    id: '2',
    type: 'text',
    title: 'La Philosophie du Wabi-Sabi',
    description: 'Le wabi-sabi est une vision esthétique japonaise qui trouve la beauté dans l\'imperfection et l\'impermanence. C\'est une invitation à accepter le changement.',
    author: 'Sakura Tanaka',
    role: 'VIP',
    country: 'Japon',
    culture: 'Asie',
    likes: 189,
    comments: 45,
    saves: 67,
    timestamp: '2024-01-14'
  },
  {
    id: '3',
    type: 'image',
    title: 'Cathédrale Notre-Dame de Paris',
    description: 'Symbole de l\'architecture gothique française, cette cathédrale incarne des siècles d\'histoire chrétienne et artistique européenne.',
    author: 'Pierre Dubois',
    role: 'User',
    country: 'France',
    culture: 'Europe',
    imageUrl: '/api/placeholder/400/300',
    likes: 156,
    comments: 28,
    saves: 43,
    timestamp: '2024-01-13'
  }
];

const culturalSpaces: CulturalSpace[] = [
  {
    id: 'afrique',
    name: 'Afrique',
    description: 'Continent des origines, berceau de l\'humanité',
    publications: mockPublications.filter(p => p.culture === 'Afrique')
  },
  {
    id: 'asie',
    name: 'Asie',
    description: 'Terre des philosophies millénaires et des arts traditionnels',
    publications: mockPublications.filter(p => p.culture === 'Asie')
  },
  {
    id: 'europe',
    name: 'Europe',
    description: 'Patrimoine artistique et intellectuel européen',
    publications: mockPublications.filter(p => p.culture === 'Europe')
  },
  {
    id: 'ameriques',
    name: 'Amériques',
    description: 'Fusion des cultures indigènes et modernes',
    publications: mockPublications.filter(p => p.culture === 'Amériques')
  }
];

// Components
const HeroCulture = () => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2 }}
    className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
  >
    {/* Ambient lighting effect */}
    <div className="absolute inset-0 bg-gradient-radial from-gold-500/10 via-transparent to-transparent" />
    
    <div className="relative z-10 text-center px-6 max-w-4xl">
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-wide"
      >
        Centre Culturel Mondial
      </motion.h1>
      
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-xl md:text-2xl text-gold-400 leading-relaxed max-w-3xl mx-auto"
      >
        Un espace où les cultures, les savoirs et les traditions du monde sont partagés, préservés et honorés
      </motion.p>
      
      {/* Sacred ambiance effect */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, duration: 2 }}
        className="mt-12 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-gold-400/20 to-gold-600/20 blur-xl"
      />
    </div>
  </motion.section>
);

const RoleBadges = () => {
  const roles = [
    { name: 'User', icon: '⭐', color: 'text-gray-400', bg: 'bg-gray-800' },
    { name: 'VIP', icon: '👑', color: 'text-gold-400', bg: 'bg-gold-900' },
    { name: 'Expert', icon: '🏆', color: 'text-gold-300', bg: 'bg-gold-800' }
  ];

  return (
    <section className="py-16 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Système de Rôles</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`${role.bg} p-8 rounded-lg border border-gold-800/30 text-center`}
            >
              <div className={`text-6xl mb-4 ${role.color}`}>{role.icon}</div>
              <h3 className="text-2xl font-semibold text-white mb-2">{role.name}</h3>
              <p className="text-gray-300">
                {role.name === 'User' && 'Membre actif de la communauté'}
                {role.name === 'VIP' && 'Accès privilégié aux espaces premium'}
                {role.name === 'Expert' && 'Gardien du savoir culturel'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PublicationRules = () => (
  <section className="py-16 bg-gray-900">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-3xl font-bold text-white mb-8">Règles de Publication</h2>
      
      <div className="bg-black/50 p-8 rounded-lg border border-gold-800/30">
        <div className="text-2xl text-gold-400 font-semibold mb-4">
          Minimum 2 publications par semaine
        </div>
        <p className="text-gray-300 text-lg">
          Contenu culturel, inspirant et éducatif uniquement
        </p>
      </div>
    </div>
  </section>
);

const CulturalFeed = () => {
  const [publications] = useState<Publication[]>(mockPublications);

  return (
    <section className="py-16 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Fil d'Actualité Culturel</h2>
        
        <div className="space-y-8">
          {publications.map((pub, index) => (
            <motion.article
              key={pub.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 p-6 rounded-lg border border-gold-800/30"
            >
              {pub.imageUrl && (
                <img
                  src={pub.imageUrl}
                  alt={pub.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pub.role === 'Expert' ? 'bg-gold-800 text-gold-300' :
                    pub.role === 'VIP' ? 'bg-gold-900 text-gold-400' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    {pub.role}
                  </span>
                  <span className="text-gray-400">{pub.author}</span>
                </div>
                <div className="text-gray-500 text-sm">
                  {pub.country} • {pub.culture}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{pub.title}</h3>
              <p className="text-gray-300 mb-4">{pub.description}</p>
              
              <div className="flex items-center space-x-6 text-gray-400">
                <button className="flex items-center space-x-2 hover:text-red-400 transition-colors">
                  <span>❤️</span>
                  <span>{pub.likes}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                  <span>💬</span>
                  <span>{pub.comments}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                  <span>🔖</span>
                  <span>{pub.saves}</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

const VipSalon = () => (
  <section className="py-16 bg-gradient-to-b from-gold-900/20 to-black">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Salon VIP</h2>
      
      <div className="bg-gradient-to-r from-gold-900/30 to-gold-800/30 p-8 rounded-lg border border-gold-600/50">
        <div className="text-center mb-6">
          <div className="text-6xl text-gold-400 mx-auto mb-4">👑</div>
          <h3 className="text-2xl font-semibold text-white">Espace Privé</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gold-400 mb-2">Accès Lecture</h4>
            <p className="text-gray-300">Réservé aux membres VIP</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gold-400 mb-2">Publication</h4>
            <p className="text-gray-300">Uniquement par les Experts</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ExpertSystem = () => (
  <section className="py-16 bg-gray-900">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-3xl font-bold text-white mb-8">Système Expert</h2>
      
      <div className="bg-black/50 p-8 rounded-lg border border-gold-800/30">
        <div className="text-6xl text-gold-400 mx-auto mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-white mb-4">Devenir Expert</h3>
        
        <div className="text-left space-y-4">
          <div>
            <h4 className="text-gold-400 font-medium">Critères :</h4>
            <ul className="text-gray-300 ml-4 mt-2">
              <li>• Minimum 5 à 10 publications de qualité</li>
              <li>• Engagement communautaire élevé</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gold-400 font-medium">Métriques d'engagement :</h4>
            <ul className="text-gray-300 ml-4 mt-2">
              <li>• Likes reçus</li>
              <li>• Commentaires</li>
              <li>• Sauvegardes</li>
            </ul>
          </div>
        </div>
        
        <p className="text-gold-300 mt-6 font-medium">
          Badge Expert attribué automatiquement
        </p>
      </div>
    </div>
  </section>
);

const CulturalSpaces = () => {
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  return (
    <section className="py-16 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Espaces Culturels</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {culturalSpaces.map((space, index) => (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 p-6 rounded-lg border border-gold-800/30 cursor-pointer hover:border-gold-600/50 transition-colors"
              onClick={() => setSelectedSpace(selectedSpace === space.id ? null : space.id)}
            >
              <h3 className="text-xl font-semibold text-white mb-2">{space.name}</h3>
              <p className="text-gray-300 text-sm">{space.description}</p>
              
              {selectedSpace === space.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 pt-4 border-t border-gold-800/30"
                >
                  <p className="text-gold-400 text-sm">
                    {space.publications.length} publication{space.publications.length > 1 ? 's' : ''}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function CulturePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HeroCulture />
      <RoleBadges />
      <PublicationRules />
      <CulturalFeed />
      <VipSalon />
      <ExpertSystem />
      <CulturalSpaces />
    </div>
  );
}