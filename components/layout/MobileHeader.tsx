'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const mobileMenuItems = [
  { label: 'Artistes', href: '/artists' },
  { label: 'Portail culture', href: '/culture' },
  { label: 'Gapstudio IA', href: '/create' },
  { label: 'Musée 3D', href: '/museum' },
  { label: 'Marketplace', href: '/explorer' },
  { label: 'Communauté', href: '/community' },
  { label: 'Minage ARTC', href: '/rewards' },
  { label: 'Fondation', href: '/foundation' },
];

export default function MobileHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explorer?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Fermeture du menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Vérifier si le clic est en dehors du menu ET du bouton
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    // Ajouter l'event listener seulement si le menu est ouvert
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [menuOpen]);

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-b border-slate-800/50 h-16">
      <div className="flex items-center justify-between h-full px-3 gap-2">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="animate-spin-slow">
            <Globe 
              className="w-8 h-8 text-blue-400 drop-shadow-lg"
              strokeWidth={1.5}
            />
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 mx-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Recherche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 pl-9 bg-slate-900/60 border border-slate-700/60 rounded-full text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-slate-800/80 transition-all"
            />
            <Search className="absolute left-3 w-4 h-4 text-slate-500" />
          </div>
        </form>

        {/* Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            aria-expanded={menuOpen}
            aria-label="Menu mobile"
          >
            <Menu className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-950/95 border border-slate-800/70 rounded-2xl shadow-xl backdrop-blur-xl text-xs text-slate-100 z-50 max-h-[80vh] overflow-y-auto">
              <div className="py-2">
                {mobileMenuItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                    <div className="px-4 py-3 hover:bg-slate-900 transition-colors cursor-pointer">
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link href="/auth/login">
          <button className="text-[11px] font-medium px-3 py-1.5 text-slate-200 border border-slate-700/60 rounded-full hover:text-white hover:border-slate-500 transition-all whitespace-nowrap">
            Connecter
          </button>
        </Link>
      </div>
    </header>
  );
}
