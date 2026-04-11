'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const bottomNavItems: NavItem[] = [
  { name: 'Accueil', href: '/', icon: <Home className="w-5 h-5" /> },
  { name: 'Explorer', href: '/explorer', icon: <Compass className="w-5 h-5" /> },
  { name: 'Créer', href: '/create', icon: <Plus className="w-5 h-5" /> },
  { name: 'Profil', href: '/profile', icon: <User className="w-5 h-5" /> },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-t border-slate-800/50 h-16">
      <div className="flex items-center justify-around h-full px-2">
        {bottomNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all ${
                  active
                    ? 'text-blue-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.name}</span>
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 h-0.5 w-6 bg-blue-400 rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
