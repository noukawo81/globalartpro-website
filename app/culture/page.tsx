'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

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
  spiritualElement?: string; // Élément spirituel ajouté
}

interface CulturalSpace {
  id: string;
  name: string;
  description: string;
  spiritualSymbol: string;
  publications: Publication[];
  meditationQuote: string;
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
    timestamp: '2024-01-15',
    spiritualElement: 'Connexion aux ancêtres'
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
    timestamp: '2024-01-14',
    spiritualElement: 'Harmonie avec l\'impermanence'
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
    timestamp: '2024-01-13',
    spiritualElement: 'Foi et transcendance'
  }
];

const culturalSpaces: CulturalSpace[] = [
  {
    id: 'afrique',
    name: 'Afrique',
    description: 'Continent des origines, berceau de l\'humanité',
    spiritualSymbol: '🦁',
    publications: mockPublications.filter(p => p.culture === 'Afrique'),
    meditationQuote: '"L\'Afrique est le berceau de l\'humanité, où chaque grain de sable murmure des histoires ancestrales."'
  },
  {
    id: 'asie',
    name: 'Asie',
    description: 'Terre des philosophies millénaires et des arts traditionnels',
    spiritualSymbol: '☯️',
    publications: mockPublications.filter(p => p.culture === 'Asie'),
    meditationQuote: '"Dans le silence de l\'esprit, l\'Asie révèle les secrets de l\'harmonie universelle."'
  },
  {
    id: 'europe',
    name: 'Europe',
    description: 'Patrimoine artistique et intellectuel européen',
    spiritualSymbol: '⛪',
    publications: mockPublications.filter(p => p.culture === 'Europe'),
    meditationQuote: '"L\'Europe, gardienne des cathédrales de lumière, où l\'art touche le divin."'
  },
  {
    id: 'ameriques',
    name: 'Amériques',
    description: 'Fusion des cultures indigènes et modernes',
    spiritualSymbol: '🦅',
    publications: mockPublications.filter(p => p.culture === 'Amériques'),
    meditationQuote: '"Les Amériques, pont entre les mondes anciens et nouveaux, où les esprits dansent avec le vent."'
  }
];

// Components
const HeroCulture = () => {
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2 }}
    className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-purple-900/20 to-black overflow-hidden"
  >
    {/* Sacred ambient lighting */}
    <div className="absolute inset-0 bg-gradient-radial from-gold-500/10 via-purple-500/5 to-transparent" />
    <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-transparent to-transparent" />

    {/* Floating spiritual particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold-400/30 rounded-full"
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
            opacity: 0
          }}
          animate={{
            y: [null, -20, null],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>

    <div className="relative z-10 text-center px-6 max-w-4xl">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 1, type: "spring" }}
        className="mb-8"
      >
        <div className="text-8xl mb-4">🌟</div>
        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-gold-400/20 via-purple-500/20 to-blue-500/20 blur-xl animate-pulse" />
      </motion.div>

      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gold-400 via-white to-purple-400 bg-clip-text text-transparent mb-6 tracking-wide"
      >
        Centre Culturel Mondial
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-xl md:text-2xl text-gold-300 leading-relaxed max-w-3xl mx-auto mb-8"
      >
        Un sanctuaire spirituel où les cultures du monde s'entrelacent dans une danse sacrée d'unité et de sagesse
      </motion.p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="flex justify-center space-x-8 text-4xl"
      >
        <span className="animate-bounce delay-100">🕉️</span>
        <span className="animate-bounce delay-200">☯️</span>
        <span className="animate-bounce delay-300">✡️</span>
        <span className="animate-bounce delay-400">☪️</span>
        <span className="animate-bounce delay-500">✝️</span>
      </motion.div>

      {/* Sacred geometry effect */}
      <motion.div
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ delay: 2, duration: 3, repeat: Infinity, ease: "linear" }}
        className="mt-12 w-48 h-48 mx-auto border border-gold-400/30 rounded-full relative"
      >
        <div className="absolute inset-4 border border-purple-400/30 rounded-full" />
        <div className="absolute inset-8 border border-blue-400/30 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </div>
  </motion.section>
  );
};

const RoleBadges = () => {
  const roles = [
    {
      name: 'User',
      icon: '⭐',
      color: 'text-gray-400',
      bg: 'bg-gray-800',
      spiritual: 'Chercheur de lumière',
      description: 'Membre actif de la communauté culturelle'
    },
    {
      name: 'VIP',
      icon: '👑',
      color: 'text-gold-400',
      bg: 'bg-gradient-to-br from-gold-900 to-gold-800',
      spiritual: 'Gardien des sagesses',
      description: 'Accès privilégié aux espaces sacrés et aux rituels exclusifs'
    },
    {
      name: 'Expert',
      icon: '🏆',
      color: 'text-gold-300',
      bg: 'bg-gradient-to-br from-purple-900 to-gold-800',
      spiritual: 'Maître spirituel',
      description: 'Gardien du savoir ancestral et guide des âmes'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center bg-gradient-to-r from-gold-400 to-purple-400 bg-clip-text text-transparent mb-4"
        >
          Cercle Spirituel des Rôles
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gold-300 mb-12"
        >
          Chaque rôle est une étape dans le voyage spirituel de la connaissance culturelle
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: index * 0.2, type: "spring" }}
              className={`${role.bg} p-8 rounded-xl border border-gold-800/30 text-center relative overflow-hidden group`}
            >
              {/* Spiritual glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <motion.div
                className={`text-7xl mb-4 ${role.color} relative z-10`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {role.icon}
              </motion.div>

              <h3 className="text-2xl font-semibold text-white mb-2 relative z-10">{role.name}</h3>
              <p className="text-gold-400 font-medium mb-3 italic relative z-10">{role.spiritual}</p>
              <p className="text-gray-300 relative z-10">{role.description}</p>

              {/* Sacred particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-gold-400/50 rounded-full animate-ping" />
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse" />
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
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center bg-gradient-to-r from-gold-400 to-purple-400 bg-clip-text text-transparent mb-4"
        >
          Rivière Spirituelle des Cultures
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gold-300 mb-12"
        >
          Chaque partage est une goutte d'éternité dans le fleuve de la sagesse collective
        </motion.p>

        <div className="space-y-8">
          {publications.map((pub, index) => (
            <motion.article
              key={pub.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 p-8 rounded-2xl border border-gold-800/30 relative overflow-hidden group"
            >
              {/* Spiritual glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {pub.imageUrl && (
                <motion.div
                  className="relative mb-6 overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={pub.imageUrl}
                    alt={pub.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {pub.spiritualElement && (
                    <div className="absolute bottom-4 left-4 bg-black/70 text-gold-400 px-3 py-1 rounded-full text-sm font-medium">
                      {pub.spiritualElement}
                    </div>
                  )}
                </motion.div>
              )}

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center space-x-3">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      pub.role === 'Expert' ? 'bg-gradient-to-r from-purple-900 to-gold-800 text-gold-300' :
                      pub.role === 'VIP' ? 'bg-gradient-to-r from-gold-900 to-gold-800 text-gold-400' :
                      'bg-gray-800 text-gray-400'
                    } border border-gold-800/30`}
                  >
                    {pub.role}
                  </motion.span>
                  <span className="text-gray-400 font-medium">{pub.author}</span>
                </div>
                <div className="text-gray-500 text-sm flex items-center space-x-2">
                  <span>🌍</span>
                  <span>{pub.country} • {pub.culture}</span>
                </div>
              </div>

              <motion.h3
                className="text-2xl font-semibold text-white mb-3 relative z-10"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {pub.title}
              </motion.h3>
              <p className="text-gray-300 mb-6 leading-relaxed relative z-10">{pub.description}</p>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-8 text-gray-400">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                  >
                    <span className="text-lg">❤️</span>
                    <span>{pub.likes}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                  >
                    <span className="text-lg">💬</span>
                    <span>{pub.comments}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center space-x-2 hover:text-green-400 transition-colors"
                  >
                    <span className="text-lg">🔖</span>
                    <span>{pub.saves}</span>
                  </motion.button>
                </div>

                <div className="text-xs text-gold-400/70">
                  {pub.timestamp}
                </div>
              </div>

              {/* Spiritual essence indicator */}
              {pub.spiritualElement && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="absolute top-4 right-4 w-3 h-3 bg-gold-400 rounded-full animate-pulse"
                  title={pub.spiritualElement}
                />
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

const VipSalon = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isAccessing, setIsAccessing] = useState(false);
  const [isPiBrowser, setIsPiBrowser] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<'PI'|'ARTC'>('PI');

  const paymentRates = {
    PI: 0.0005,
    ARTC: 0.4
  };

  const conversionRates = {
    PI: 1,
    ARTC: 2.5
  };

  const costInSelected = paymentRates[selectedCurrency];
  const piCost = paymentRates.PI;
  const convertedAmount = piCost * conversionRates[selectedCurrency];

  const getCurrentOrigin = () => {
    if (typeof window === 'undefined') return '';
    return window.location.origin;
  };

  const isPiBrowserAvailable = () => {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).Pi) && /PiBrowser/i.test(navigator.userAgent);
  };

  const authenticateWithPi = async () => {
    const pi = (window as any).Pi;
    if (!pi) {
      throw new Error('Pi SDK non chargé.');
    }

    try {
      await pi.init({
        version: '2.0',
        sandbox: false,
        appId: process.env.NEXT_PUBLIC_PI_APP_ID || 'globalartproadac3428',
        appOrigins: ['https://www.globalartpro.com', 'https://globalartproadac3428.pinet.com']
      });
    } catch (initError) {
      console.warn('Pi init failed:', initError);
    }

    const authResult = await pi.authenticate(['username', 'payments']);
    if (!authResult || !authResult.user) {
      throw new Error('Authentification Pi non validée.');
    }

    return authResult;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsPiBrowser(isPiBrowserAvailable());
    }
  }, []);

  const handleVipAccess = async () => {
    console.log('Clic Sanctuaire détecté');
    setPaymentError('');
    setIsAccessing(true);

    try {
      if (typeof window === 'undefined' || !isPiBrowserAvailable()) {
        throw new Error('Le paiement Pi nécessite le Pi Browser. Veuillez utiliser le Pi Browser pour accéder au Sanctuaire VIP.');
      }

      const currentOrigin = getCurrentOrigin();
      const expectedOrigin = process.env.NEXT_PUBLIC_PI_APP_URL;
      if (expectedOrigin && expectedOrigin !== currentOrigin) {
        throw new Error(`URL incorrecte. Domaine actuel: ${currentOrigin}, attendu: ${expectedOrigin}`);
      }

      if (selectedCurrency !== 'PI') {
        throw new Error('Le paiement du sanctuaire VIP est actuellement disponible uniquement en Pi.');
      }

      console.log('[VIP] Authenticating with Pi...');
      await authenticateWithPi();
      console.log('[VIP] Authentication successful, initiating payment...');

      const pi = (window as any).Pi;
      await pi.createPayment({
        amount: piCost,
        memo: 'Offrande pour le Sanctuaire VIP',
        onReadyForServerApproval: async ({ paymentId }: { paymentId: string }) => {
          console.log('[VIP] Payment approved, sending to server:', paymentId);

          try {
            const response = await fetch('/api/pi/payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'approve',
                paymentId,
                amount: piCost,
                memo: 'Offrande pour le Sanctuaire VIP',
                userEmail: user?.email
              })
            });

            if (!response.ok) {
              const errorResult = await response.json();
              console.error('[VIP] Server approval failed:', errorResult);
              throw new Error(errorResult.error || 'Server approval failed');
            }

            const result = await response.json();
            console.log('[VIP] Server approval response:', result);

            if (result.signature && window.Pi?.completeServerApproval) {
              console.log('[VIP] Sending completion signature to Pi SDK...');
              window.Pi.completeServerApproval(paymentId, result.signature);
              console.log('[VIP] Signature sent to Pi SDK');
            } else {
              console.error('[VIP] Missing signature or completeServerApproval unavailable');
              throw new Error('Signature serveur manquante ou SDK Pi non disponible.');
            }
          } catch (serverError) {
            console.error('[VIP] Server approval error:', serverError);
            setPaymentError('Erreur durant l’approbation du paiement.');
            setIsAccessing(false);
          }
        },
        onReadyForServerCompletion: async ({ paymentId, txid }: { paymentId: string; txid: string }) => {
          try {
            const response = await fetch('/api/pi/payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'complete',
                paymentId,
                txid,
                userEmail: user?.email
              })
            });

            if (response.ok) {
              router.push('/sanctuaire-vip');
            } else {
              const errorData = await response.json();
              setPaymentError(errorData.error || 'Erreur lors de la validation du paiement.');
            }
          } catch (completeError) {
            console.error('[VIP] Server completion error:', completeError);
            setPaymentError('Impossible de finaliser le paiement Pi.');
          } finally {
            setIsAccessing(false);
          }
        },
        onCancel: () => {
          setPaymentError('Paiement annulé.');
          setIsAccessing(false);
        },
        onError: (err: any) => {
          console.error('Pi payment error:', err);
          setPaymentError('Erreur du paiement Pi. Veuillez réessayer.');
          setIsAccessing(false);
        }
      });
    } catch (error) {
      console.error('Erreur création paiement Pi:', error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : 'Impossible d’initier le paiement.'
      );
      setIsAccessing(false);
    }
  };

  const handleCurrencyChange = (currency: 'PI'|'ARTC') => {
    setSelectedCurrency(currency);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gold-900/20 via-purple-900/10 to-black relative overflow-hidden">
      {/* Sacred geometry background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-gold-400/20 rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-32 h-32 border border-purple-400/20 rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-blue-400/20 rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center bg-gradient-to-r from-gold-400 via-white to-purple-400 bg-clip-text text-transparent mb-4"
        >
          Sanctuaire VIP
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gold-300 mb-12"
        >
          Un espace sacré réservé aux âmes éclairées, où les sagesses ancestrales se dévoilent
        </motion.p>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gold-900/40 via-purple-900/30 to-black p-8 rounded-2xl border border-gold-600/50 relative overflow-hidden"
          >
            {/* Animated border */}
            <div className="absolute inset-0 border border-gold-400/30 rounded-2xl animate-pulse" />

            <div className="text-center mb-8 relative z-10">
              <motion.div
                className="text-8xl text-gold-400 mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                👑
              </motion.div>
              <h3 className="text-3xl font-semibold bg-gradient-to-r from-gold-400 to-purple-400 bg-clip-text text-transparent">
                Temple des Initiés
              </h3>
              <p className="text-gold-300 mt-2">Espace spirituel exclusif</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-black/30 p-6 rounded-lg border border-gold-800/30"
              >
                <h4 className="text-xl font-semibold text-gold-400 mb-3 flex items-center">
                  <span className="mr-2">📖</span>
                  Lecture Sacrée
                </h4>
                <p className="text-gray-300 mb-4">Accès aux textes anciens et aux rituels oubliés</p>
                <div className="text-sm text-gold-300">Réservé aux membres VIP</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-black/30 p-6 rounded-lg border border-gold-800/30"
              >
                <h4 className="text-xl font-semibold text-gold-400 mb-3 flex items-center">
                  <span className="mr-2">✍️</span>
                  Publication Divine
                </h4>
                <p className="text-gray-300 mb-4">Partagez les révélations spirituelles</p>
                <div className="text-sm text-gold-300">Uniquement par les Maîtres Experts</div>
              </motion.div>
            </div>

            {/* Access section with PI cost */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-gold-900/50 to-purple-900/50 p-6 rounded-lg border border-gold-500/50 mb-6">
                <h4 className="text-xl font-semibold text-white mb-2">Accès Spirituel</h4>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {(['PI','ARTC'] as const).map(currency => (
                      <button
                        key={currency}
                        onClick={() => handleCurrencyChange(currency)}
                        className={`py-2 px-3 rounded-lg border ${selectedCurrency===currency ? 'border-gold-400 bg-gold-500/20 text-gold-200' : 'border-gray-600 text-gray-300'} transition`}
                      >
                        {currency}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="text-gray-300 text-sm mb-2">Prix d'accès actuel:</div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-gold-400">{costInSelected}</span>
                      <span className="text-xl text-white">{selectedCurrency}</span>
                    </div>
                    <div className="text-gray-300 text-xs mb-2">
                      Équivalent: {convertedAmount.toFixed(3)} {selectedCurrency}
                    </div>
                    <p className="text-gray-300 text-sm">Offrande pour l'entrée dans le sanctuaire</p>
                    <p className="mt-4 text-xs text-gray-400">Les transactions en Pi sont définitives sur la blockchain.</p>
                  </div>
                </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVipAccess}
                disabled={isAccessing}
                className="bg-gradient-to-r from-gold-600 to-purple-600 hover:from-gold-500 hover:to-purple-500 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  {isAccessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Connexion spirituelle...</span>
                    </>
                  ) : (
                    <>
                      <span>🔓</span>
                      <span>Accéder au Sanctuaire VIP</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              {paymentError && (
                <p className="mt-4 text-sm text-red-300">{paymentError}</p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

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

const CulturalMeditation = () => {
  const [isMeditating, setIsMeditating] = useState(false);
  const [currentMeditation, setCurrentMeditation] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const meditations = [
    {
      title: "Unité Cosmique",
      description: "Sentez l'énergie des cultures s'entrelacer dans votre être",
      symbol: "🕉️",
      duration: 300, // 5 minutes
      mantra: "Om Shanti Om"
    },
    {
      title: "Sagesse Ancestrale",
      description: "Connectez-vous aux voix des anciens gardiens du savoir",
      symbol: "🌙",
      duration: 420, // 7 minutes
      mantra: "Aum"
    },
    {
      title: "Harmonie Universelle",
      description: "Laissez les rythmes culturels résonner dans votre âme",
      symbol: "☯️",
      duration: 360, // 6 minutes
      mantra: "So Hum"
    }
  ];

  const startMeditation = (index: number) => {
    setCurrentMeditation(index);
    setIsMeditating(true);

    if (typeof window === 'undefined') {
      return;
    }

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const track = new Audio('/audio/meditation-guidance.mp3');
    track.loop = true;
    track.volume = 0.7;

    track.play().catch(() => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Démarrage de la méditation: ${meditations[index].title}. Répétez: ${meditations[index].mantra}.`);
        utterance.rate = 0.9;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    });

    setAudio(track);

    setTimeout(() => {
      setIsMeditating(false);
      track.pause();
      track.currentTime = 0;
      setAudio(null);
    }, meditations[index].duration * 1000);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-purple-900/20 via-black to-blue-900/20 relative overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              opacity: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 via-gold-400 to-blue-400 bg-clip-text text-transparent mb-4"
        >
          Méditation Culturelle Spirituelle
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-purple-300 mb-12"
        >
          Voyagez au cœur des cultures à travers la méditation guidée, où chaque tradition devient une porte vers l'unité universelle
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {meditations.map((meditation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gradient-to-br from-purple-900/30 to-black/50 p-6 rounded-2xl border border-purple-600/30 text-center relative overflow-hidden group"
            >
              <motion.div
                className="text-6xl mb-4"
                animate={isMeditating && currentMeditation === index ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {meditation.symbol}
              </motion.div>

              <h3 className="text-xl font-semibold text-white mb-2">{meditation.title}</h3>
              <p className="text-purple-300 text-sm mb-4">{meditation.description}</p>

              <div className="text-xs text-gold-400 mb-4">
                Durée: {Math.floor(meditation.duration / 60)}min • Mantra: {meditation.mantra}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startMeditation(index)}
                disabled={isMeditating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className="relative z-10">
                  {isMeditating && currentMeditation === index ? 'Méditation en cours...' : 'Commencer la méditation'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Active meditation display */}
        <AnimatePresence>
          {isMeditating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-8 rounded-2xl border border-purple-500/50 max-w-2xl mx-auto">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  {meditations[currentMeditation].symbol}
                </motion.div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {meditations[currentMeditation].title}
                </h3>
                <p className="text-purple-300 mb-4">
                  Répétez mentalement: <span className="font-semibold text-gold-400">{meditations[currentMeditation].mantra}</span>
                </p>
                <div className="flex justify-center space-x-4 text-4xl">
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🌟
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    ✨
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    🌙
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const CulturalSpaces = () => {
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-black via-purple-900/10 to-black">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center bg-gradient-to-r from-gold-400 via-white to-purple-400 bg-clip-text text-transparent mb-4"
        >
          Temples Culturels Spirituels
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gold-300 mb-12"
        >
          Chaque continent est un sanctuaire vivant, un autel où l'âme de l'humanité se révèle
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {culturalSpaces.map((space, index) => (
            <motion.div
              key={space.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                z: 50
              }}
              transition={{
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-2xl border border-gold-800/30 cursor-pointer hover:border-gold-600/50 transition-all duration-500 relative overflow-hidden group perspective-1000"
              onClick={() => setSelectedSpace(selectedSpace === space.id ? null : space.id)}
            >
              {/* Spiritual aura effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              {/* Floating symbol */}
              <motion.div
                className="text-6xl text-center mb-4 relative z-10"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {space.spiritualSymbol}
              </motion.div>

              <h3 className="text-xl font-semibold text-white mb-2 text-center relative z-10">{space.name}</h3>
              <p className="text-gray-300 text-sm text-center mb-4 relative z-10">{space.description}</p>

              {/* Meditation quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: selectedSpace === space.id ? 1 : 0 }}
                className="text-xs text-gold-400/80 italic text-center mb-4 relative z-10"
              >
                "{space.meditationQuote}"
              </motion.div>

              <AnimatePresence>
                {selectedSpace === space.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pt-4 border-t border-gold-800/30 relative z-10"
                  >
                    <div className="text-center">
                      <p className="text-gold-400 text-sm mb-2">
                        {space.publications.length} révélation{space.publications.length > 1 ? 's' : ''} spirituelle{space.publications.length > 1 ? 's' : ''}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-gold-600/20 to-purple-600/20 hover:from-gold-600/40 hover:to-purple-600/40 text-gold-400 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-gold-600/30"
                      >
                        Méditer avec {space.name}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sacred particles */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-gold-400/60 rounded-full animate-ping" />
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse" />
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
      <CulturalMeditation />
      <VipSalon />
      <ExpertSystem />
      <CulturalSpaces />
    </div>
  );
}