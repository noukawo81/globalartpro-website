'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  // Récupérer le code de parrainage de l'URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(username.trim(), email.trim(), password, referralCode || undefined);
    setLoading(false);

    if (result.success) {
      router.replace('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-black to-slate-900 text-white flex items-center justify-center p-4">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-black/70 border border-blue-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl"
      >
        <h1 className="text-3xl font-bold text-blue-300 text-center mb-2">Inscription</h1>
        <p className="text-sm text-gray-300 text-center mb-6">Rejoignez la communauté artistique GlobalArtpro</p>

        {referralCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm text-center"
          >
            ✨ Bonus: +2 ARTC + votre parrain reçoit +10 ARTC
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-gray-600 focus:border-yellow-300 outline-none"
              placeholder="VotrePseudo"
              minLength={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-gray-600 focus:border-yellow-300 outline-none"
              placeholder="exemple@artpro.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-gray-600 focus:border-yellow-300 outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 transition-all"
          >
            {loading ? 'Inscription...' : 'S’inscrire'}
          </button>
        </form>

        <div className="mt-5 text-sm text-gray-300 text-center">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300">
            Connectez-vous
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
