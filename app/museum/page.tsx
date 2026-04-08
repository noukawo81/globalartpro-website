'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MinimalMuseum from '../foundation/MinimalMuseum';

const VirtualMuseum = lazy(() => import('../foundation/VirtualMuseum'));

export default function MuseumPage() {
  const [useMinimal, setUseMinimal] = useState(false);
  const [is3DReady, setIs3DReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!is3DReady) {
        console.warn("Bascule sur le mode Minimal pour optimiser l'expérience.");
        setUseMinimal(true);
      }
    }, 6000);

    return () => clearTimeout(timeout);
  }, [is3DReady]);

  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        {useMinimal ? (
          <motion.div
            key="minimal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MinimalMuseum />
          </motion.div>
        ) : (
          <Suspense fallback={<MinimalMuseum />}>
            <motion.div
              key="virtual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-screen w-full relative"
            >
              <VirtualMuseum onLoadingComplete={() => setIs3DReady(true)} />

              {!is3DReady && (
                <div
                  aria-live="polite"
                  role="status"
                  className="absolute top-0 left-0 w-full h-1 bg-gold-500/20 z-[100]"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5 }}
                    className="h-full bg-gold-500 shadow-[0_0_10px_#d4af37]"
                  />
                </div>
              )}
            </motion.div>
          </Suspense>
        )}
      </AnimatePresence>
    </main>
  );
}
