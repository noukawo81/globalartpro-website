'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePi } from '@/context/PiContext';

const navLinks = [
  { name: 'Explorer', href: '/explorer' },
  { name: 'Créer', href: '/create' },
  { name: 'Musée', href: '/museum' },
  { name: 'Culture', href: '/culture' },
  { name: 'Communauté', href: '/community' },
  { name: 'Fondation', href: '/foundation' },
  { name: 'Récompenses', href: '/rewards' },
  { name: 'Wallet', href: '/wallet' },
  { name: 'Certification', href: '/certification' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, isLoading, login, logout } = usePi();

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
    // Ne vérifier que les routes commençant par /
    if (href.startsWith('#')) return false;
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/40 backdrop-blur-xl border-b border-white/5'
            : 'bg-black/20 backdrop-blur-md border-b border-white/0'
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
                className="flex items-center gap-2 group"
              >
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 bg-clip-text text-transparent">
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
                      className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium relative focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                        active
                          ? 'text-yellow-300 shadow-lg shadow-yellow-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.name}
                      {active && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-yellow-500/15 border border-yellow-500/30 rounded-lg -z-10"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div className="flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/auth/login"
                    aria-current={isActive('/auth/login') ? 'page' : undefined}
                    className={`hidden md:inline-block text-sm font-semibold px-3 py-2 rounded-md border transition-colors ${
                      isActive('/auth/login')
                        ? 'text-white bg-yellow-400/15 border-yellow-400/50 shadow-lg shadow-yellow-500/20'
                        : 'text-white hover:text-yellow-300 border border-yellow-300/20 hover:border-yellow-400/40'
                    }`}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    aria-current={isActive('/auth/register') ? 'page' : undefined}
                    className={`hidden md:inline-block text-sm font-semibold px-3 py-2 rounded-md border transition-colors ${
                      isActive('/auth/register')
                        ? 'text-yellow-300 bg-gradient-to-r from-yellow-500/20 to-yellow-300/15 border-yellow-400/50 shadow-lg shadow-yellow-500/20'
                        : 'text-yellow-300 hover:text-white border border-yellow-300/30 hover:border-yellow-400/60 bg-black/40'
                    }`}
                  >
                    Inscription
                  </Link>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={login}
                    disabled={isLoading}
                    className="px-4 py-2 text-white text-sm font-bold bg-gradient-to-r from-green-500 to-green-400 rounded-lg hover:from-green-400 hover:to-green-300 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Connexion...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">π</span>
                        Se connecter avec Pi
                      </div>
                    )}
                  </motion.button>
                  <Link href="/checkout">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2 text-xs font-semibold text-white bg-blue-600/60 border border-blue-500/40 rounded-lg hover:bg-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    >
                      π Payer avec Pi
                    </motion.button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-300 text-sm font-medium">{user?.username}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="px-4 py-2 text-gray-300 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Déconnexion
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile Auth Buttons - Always visible */}
            <div className="md:hidden flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1 text-xs font-semibold text-white border border-yellow-300/20 rounded hover:border-yellow-400/40 transition-colors"
                    >
                      Connexion
                    </motion.button>
                  </Link>
                  <Link href="/auth/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1 text-xs font-semibold text-yellow-300 border border-yellow-300/30 rounded bg-black/40 hover:border-yellow-400/60 transition-colors"
                    >
                      Inscription
                    </motion.button>
                  </Link>
                  <Link href="/checkout">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1 text-xs font-semibold text-white bg-blue-600/60 border border-blue-500/40 rounded hover:bg-blue-500/70 transition-all"
                    >
                      π Pi
                    </motion.button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-green-300 text-xs font-medium">{user?.username}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="px-2 py-1 text-xs text-gray-300 border border-gray-600/30 rounded hover:bg-white/10 transition-colors"
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

        {/* Mobile Auth / Pi shortcut bar */}
        <div className="md:hidden bg-black/80 border-t border-white/10 py-2">
          <div className="flex items-center gap-1 px-3 overflow-x-auto scrollbar-thin scrollbar-thumb-yellow-400/50 scrollbar-track-black/20">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/auth/login"
                  aria-current={isActive('/auth/login') ? 'page' : undefined}
                  className="flex-1 text-center rounded-lg border border-yellow-300/20 px-2 py-1 text-xs font-semibold text-white hover:text-yellow-300 hover:border-yellow-400/40"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  aria-current={isActive('/auth/register') ? 'page' : undefined}
                  className="flex-1 text-center rounded-lg border border-yellow-300/20 px-2 py-1 text-xs font-semibold text-yellow-300 hover:text-white hover:border-yellow-400/40"
                >
                  Inscription
                </Link>
                <Link
                  href="/checkout"
                  className="flex-1 text-center rounded-lg border border-blue-500/50 bg-blue-600/70 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-500/80"
                >
                  π Payer Pi
                </Link>
              </>
            ) : (
              <>
                <span className="flex-1 text-center text-xs font-medium text-green-300">{user?.username}</span>
                <button
                  onClick={logout}
                  className="flex-1 rounded-lg border border-gray-600/40 px-2 py-1 text-xs font-semibold text-gray-200 hover:bg-white/10"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
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
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </motion.button>
                </Link>
              ))}

              <div className="pt-4 border-t border-white/10 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Link href="/auth/login" aria-current={isActive('/auth/login') ? 'page' : undefined}>
                      <motion.button
                        whileHover={{ x: 10 }}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          isActive('/auth/login')
                            ? 'text-white bg-yellow-400/15 border border-yellow-400/50 shadow-lg shadow-yellow-500/20'
                            : 'text-white hover:text-yellow-300 hover:bg-white/5 border border-yellow-300/20'
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
                            ? 'text-yellow-300 bg-gradient-to-r from-yellow-500/20 to-yellow-300/15 border border-yellow-400/50 shadow-lg shadow-yellow-500/20'
                            : 'text-yellow-300 hover:text-white border border-yellow-300/20 hover:bg-white/5'
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
                      className="w-full px-4 py-3 text-white font-bold bg-gradient-to-r from-green-500 to-green-400 rounded-lg hover:from-green-400 hover:to-green-300 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Connexion...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">π</span>
                          Se connecter avec Pi
                        </div>
                      )}
                    </motion.button>
                    <Link href="/checkout">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 text-white font-semibold bg-blue-600/60 border border-blue-500/40 rounded-lg hover:bg-blue-500/70 transition-all"
                      >
                        π Payer avec Pi
                      </motion.button>
                    </Link>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 text-sm font-medium">
                        {user?.username}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={logout}
                      className="w-full px-4 py-3 text-gray-300 font-medium rounded-lg hover:bg-white/10 transition-colors"
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