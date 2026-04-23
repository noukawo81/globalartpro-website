'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const footerLinks = [
  {
    title: 'Plateform',
    links: [
      { name: 'Accueil', href: '/' },
      { name: 'Explorer', href: '/explorer' },
      { name: 'Créer', href: '/create' },
      { name: 'Community', href: '/community' },
      { name: 'Devenir Partenaire', href: '/partenariat' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { name: 'Documentation', href: '#' },
      { name: 'Support', href: '/support' },
      { name: 'Blog', href: '#' },
      { name: 'Tutoriels', href: '#' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { name: 'Conditions', href: '/terms' },
      { name: 'Confidentialité', href: '/privacy' },
      { name: 'Cookies', href: '#' },
      { name: 'Contact', href: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-blue-500/10 text-gray-300">
      {/* Main Footer */}
      <div className="px-6 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            {/* Logo Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2"
            >
              <Link href="/" className="flex items-center gap-2 mb-3">
                <Image
                  src="/logos/globalartpro.png"
                  alt="GlobalArtpro"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-white font-semibold text-base">GlobalArtpro</span>
              </Link>
              <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
                La plateforme mondiale de l'art et des cultures. Créez, valorisez et vendez vos œuvres en NFT avec une communauté mondiale d'artistes.
              </p>
            </motion.div>

            {/* Links Columns */}
            <div className="grid grid-cols-3 gap-3">
              {footerLinks.map((column, index) => (
                <motion.div
                  key={column.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                  className="space-y-3"
                >
                  <h3 className="text-white font-semibold text-[10px] uppercase tracking-wider truncate leading-tight">
                    {column.title}
                  </h3>
                  <ul className="space-y-2">
                    {column.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="block text-gray-400 hover:text-blue-400 transition-colors text-[10px] leading-tight truncate"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-blue-500/10 pt-6">
            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-gray-500 text-sm text-center md:text-left"
              >
                © {new Date().getFullYear()} GlobalArtpro. Tous droits réservés.
              </motion.p>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex gap-6"
              >
                {[
                  { name: 'Twitter', href: '#', icon: '𝕏' },
                  { name: 'Instagram', href: '#', icon: '📷' },
                  { name: 'Discord', href: '#', icon: '💬' },
                  { name: 'LinkedIn', href: '#', icon: '🔗' },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-lg"
                    title={social.name}
                  >
                    {social.icon}
                  </Link>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
