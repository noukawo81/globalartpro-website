'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email.trim(), password);
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
        <h1 className="text-3xl font-bold text-blue-300 text-center mb-2">Connexion</h1>
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10 px-3 py-2 rounded-lg bg-slate-900 border border-gray-600 focus:border-yellow-300 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 transition-all"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-5 text-sm text-gray-300 text-center space-y-3">
          <div>
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-blue-400 hover:text-blue-300">
              Inscrivez-vous
            </Link>
          </div>
          <div>
            <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
