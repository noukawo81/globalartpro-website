'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePi } from '@/context/PiContext';
import { useAuth } from '@/context/AuthContext';

// Navigation pour VISITEURS (non connectés)
const publicNavLinks = [
  { name: 'Accueil', href: '/' },
  { name: 'Explorer', href: '/explorer' },
];

// Navigation pour UTILISATEURS CONNECTÉS
const authenticatedNavLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Explorer', href: '/explorer' },
  { name: 'Créer', href: '/create' },
  { name: 'Communauté', href: '/community' },
  { name: 'Fondation', href: '/foundation' },
  { name: 'Wallet', href: '/wallet' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user: authUser, isAuthenticated, logout: authLogout } = useAuth();
  const { user: piUser, isLoading, login } = usePi();

  // Détect scroll pour effect glassmorphism amélioré
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer menu mobile quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith('#')) return false;
    return pathname === href || pathname.startsWith(href);
  };

  const handleLogout = () => {
    authLogout();
    router.push('/');
  };

  // Sélectionner les liens appropriés selon l'authentification
  const navLinks = isAuthenticated ? authenticatedNavLinks : publicNavLinks;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-md border-b border-blue-500/10'
            : 'bg-slate-950/80 backdrop-blur-sm border-b border-blue-500/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className="flex items-center gap-2"
              >
                <Image
                  src="/logos/globalartpro.jpeg"
                  alt="GlobalArtpro"
                  width={40}
                  height={40}
                  className="object-contain w-8 h-8 md:w-10 md:h-10"
                  priority
                />
                <span className="text-lg md:text-xl font-bold text-white hidden sm:inline">
                  GlobalArtpro
                </span>
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                        active
                          ? 'text-blue-300 bg-blue-500/10 border border-blue-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-blue-500/5'
                      }`}
                    >
                      {link.name}
                    </motion.button>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                // VISITEUR: Connexion + Inscription uniquement
                <>
                  <Link
                    href="/auth/login"
                    aria-current={isActive('/auth/login') ? 'page' : undefined}
                    className={`hidden md:inline-block text-sm font-semibold px-3 py-2 rounded-md border transition-all ${
                      isActive('/auth/login')
                        ? 'text-white bg-blue-600/30 border-blue-500/50'
                        : 'text-gray-200 hover:text-white border border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-600/10'
                    }`}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    aria-current={isActive('/auth/register') ? 'page' : undefined}
                    className={`hidden md:inline-block text-sm font-semibold px-3 py-2 rounded-md border transition-all ${
                      isActive('/auth/register')
                        ? 'text-white bg-blue-600/40 border-blue-500/50'
                        : 'text-gray-200 hover:text-white border border-blue-500/30 hover:border-blue-500/60 hover:bg-blue-600/15'
                    }`}
                  >
                    Inscription
                  </Link>
                </>
              ) : (
                // CONNECTÉ: Username + Don + Déconnexion
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-600/15 border border-blue-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-blue-200 text-sm font-medium">{authUser?.username}</span>
                  </div>
                  <Link href="/foundation/donate">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-white text-sm font-bold rounded-lg bg-blue-600 hover:bg-blue-500 transition-all shadow-lg"
                    >
                      💙 Don
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-300 text-sm font-medium rounded-lg hover:text-white hover:bg-blue-500/10 transition-colors"
                  >
                    Déconnexion
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile Auth Buttons - Always visible */}
            <div className="md:hidden flex items-center gap-2">
              {!isAuthenticated ? (
                // VISITEUR: Connexion + Inscription seulement
                <>
                  <Link href="/auth/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1 text-xs font-semibold text-white border border-blue-500/30 rounded hover:border-blue-500/60 hover:bg-blue-600/10 transition-colors"
                    >
                      Connexion
                    </motion.button>
                  </Link>
                  <Link href="/auth/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1 text-xs font-semibold text-gray-200 border border-blue-500/30 rounded bg-blue-600/10 hover:border-blue-500/60 hover:text-white transition-colors"
                    >
                      Inscription
                    </motion.button>
                  </Link>
                </>
              ) : (
                // CONNECTÉ: Username + Déconnexion
                <div className="flex items-center gap-2">
                  <span className="text-blue-200 text-xs font-medium">{authUser?.username}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-2 py-1 text-xs text-gray-300 border border-slate-700/50 rounded hover:bg-blue-500/10 transition-colors"
                  >
                    Déco
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-white rounded-full origin-right"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-white rounded-full"
                />
                <motion.span
                  animate={
                    isOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }
                  }
                  className="w-full h-0.5 bg-white rounded-full origin-right"
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Auth / Pi shortcut bar - Masqué pour visiteurs */}
        {isAuthenticated && (
          <div className="md:hidden bg-slate-900/95 border-t border-blue-500/10 py-2">
            <div className="flex items-center gap-1 px-3 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500/40 scrollbar-track-slate-900">
              <span className="flex-shrink-0 rounded-lg bg-blue-600/20 border border-blue-500/20 px-2.5 py-1.5 text-xs font-medium text-blue-200">{authUser?.username}</span>
              <button
                onClick={handleLogout}
                className="flex-shrink-0 rounded-lg border border-slate-700/50 px-2.5 py-1.5 text-xs font-semibold text-gray-200 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 z-40"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <motion.button
                    whileHover={{ x: 10 }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                      isActive(link.href)
                        ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                        : 'text-gray-300 hover:bg-blue-500/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </motion.button>
                </Link>
              ))}

              <div className="pt-4 border-t border-blue-500/10 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Link href="/auth/login" aria-current={isActive('/auth/login') ? 'page' : undefined}>
                      <motion.button
                        whileHover={{ x: 10 }}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          isActive('/auth/login')
                            ? 'text-white bg-blue-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                            : 'text-white hover:text-blue-200 hover:bg-blue-500/5 border border-blue-500/20'
                        }`}
                      >
                        Connexion
                      </motion.button>
                    </Link>
                    <Link href="/auth/register" aria-current={isActive('/auth/register') ? 'page' : undefined}>
                      <motion.button
                        whileHover={{ x: 10 }}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          isActive('/auth/register')
                            ? 'text-blue-200 bg-blue-600/25 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                            : 'text-gray-200 hover:text-blue-200 border border-blue-500/20 hover:bg-blue-500/5'
                        }`}
                      >
                        Inscription
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={login}
                      disabled={isLoading}
                      className="w-full px-4 py-3 text-white font-bold bg-blue-600/80 border border-blue-500/50 rounded-lg hover:bg-blue-500/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Connexion...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">π</span>
                          Pi
                        </div>
                      )}
                    </motion.button>

                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-200 text-sm font-medium">
                        {authUser?.username}
                      </span>
                    </div>
                    <Link href="/checkout" className="w-full">
                      <motion.button
                        whileHover={{ x: 10 }}
                        className="w-full text-left px-4 py-3 text-white font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-lg transition-all"
                      >
                        💙 Faire un Don
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-gray-300 font-medium rounded-lg hover:bg-blue-500/10 transition-colors"
                    >
                      Déconnexion
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}