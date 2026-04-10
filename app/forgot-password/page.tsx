'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertTriangle, Shield, Mail, Lock, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'verify' | 'reset' | 'success'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const router = useRouter();

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // D'abord vérifier si l'utilisateur existe
    const users = JSON.parse(localStorage.getItem('gap_users') || '[]');
    const userExists = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!userExists) {
      setError('Aucun compte trouvé avec cet email.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_password_reset_email',
          email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('verify');
        setCanResend(false);
        setResendTimer(60);
        // Timer pour permettre le renvoi
        const interval = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.error || 'Erreur lors de l\'envoi du code');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_password_reset_code',
          email,
          verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('reset');
      } else {
        setError(data.error || 'Code incorrect');
      }
    } catch (error) {
      setError('Erreur de vérification. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_password_reset_code',
          email,
          verificationCode
        })
      });

      const verifyData = await response.json();

      if (!response.ok) {
        setError(verifyData.error || 'Code de vérification invalide');
        setIsLoading(false);
        return;
      }

      // Code vérifié, maintenant mettre à jour le mot de passe localement
      const users = JSON.parse(localStorage.getItem('gap_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (userIndex === -1) {
        setError('Utilisateur non trouvé');
        setIsLoading(false);
        return;
      }

      users[userIndex].password = newPassword;
      localStorage.setItem('gap_users', JSON.stringify(users));

      // Supprimer le code de reset côté serveur
      await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password_complete',
          email,
          verificationCode
        })
      });

      setStep('success');
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error) {
      setError('Erreur de réinitialisation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    handleSendResetCode({ preventDefault: () => {} } as any);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mot de passe réinitialisé !
          </h1>
          <p className="text-gray-600 mb-6">
            Votre mot de passe a été changé avec succès. Vous allez être redirigé vers la page de connexion.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aller à la connexion
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'email' && 'Réinitialiser le mot de passe'}
            {step === 'verify' && 'Vérifier le code'}
            {step === 'reset' && 'Nouveau mot de passe'}
          </h1>
          <p className="text-gray-600">
            {step === 'email' && 'Entrez votre email pour recevoir un code de réinitialisation'}
            {step === 'verify' && 'Entrez le code reçu par email'}
            {step === 'reset' && 'Choisissez un nouveau mot de passe sécurisé'}
          </p>
        </div>

        {/* Forms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {step === 'email' && (
            <form onSubmit={handleSendResetCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                    required
                  />
                  <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le code'}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  Code envoyé à <strong>{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code de vérification
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-center text-2xl font-mono tracking-widest bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:bg-white transition-colors"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </motion.div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  {isLoading ? 'Vérification...' : 'Vérifier'}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {canResend ? 'Renvoyer le code' : `Renvoyer dans ${resendTimer}s`}
                </button>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Retour à la connexion
            </Link>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            Réinitialisation sécurisée et protégée
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}