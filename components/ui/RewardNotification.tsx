'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { RewardAction } from '@/lib/rewardEngine';
import { getActionEmoji } from '@/lib/rewardEngine';

interface RewardNotificationProps {
  amount: number;
  action: RewardAction;
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

export default function RewardNotification({
  amount,
  action,
  message,
  duration = 4000,
  onComplete,
}: RewardNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed bottom-8 right-8 z-50"
    >
      <div className="bg-gradient-to-r from-gold-500 to-yellow-400 text-black rounded-2xl px-6 py-4 shadow-2xl shadow-gold-500/50 border border-gold-300 max-w-sm">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-3xl"
          >
            {getActionEmoji(action)}
          </motion.div>

          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-bold text-lg"
            >
              +{amount} ARTC
            </motion.p>
            <p className="text-sm text-black/80">{message || `Récompense ${action}`}</p>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-2xl"
          >
            ✨
          </motion.div>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className="h-1 bg-black/20 rounded-full mt-3 origin-left"
        />
      </div>
    </motion.div>
  );
}
