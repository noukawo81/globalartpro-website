'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/community');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      router.replace('/community');
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
        className="w-full max-w-md bg-black/70 border border-yellow-400/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl"
      >
        <h1 className="text-3xl font-bold text-yellow-300 text-center mb-2">Connexion</h1>
        <p className="text-sm text-gray-300 text-center mb-6">Bienvenue à nouveau dans la communauté GlobalArtpro</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-gray-600 focus:border-yellow-300 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-black font-semibold rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-300 disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-5 text-sm text-gray-300 text-center">
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="text-yellow-300 hover:text-yellow-200">
            Inscrivez-vous
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
