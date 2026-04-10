'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, CheckCircle, XCircle, AlertTriangle, Clock, Lock } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onVerified: (verified: boolean) => void;
  onClose?: () => void;
  isRequired?: boolean;
}

interface VerificationState {
  status: 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'failed';
  code: string;
  error: string;
  attemptsLeft: number;
  expiresIn: number;
  canResend: boolean;
}

export default function EmailVerification({
  email,
  onVerified,
  onClose,
  isRequired = true
}: EmailVerificationProps) {
  const [state, setState] = useState<VerificationState>({
    status: 'idle',
    code: '',
    error: '',
    attemptsLeft: 3,
    expiresIn: 0,
    canResend: true
  });

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Timer pour le compte à rebours
  useEffect(() => {
    if (state.expiresIn > 0) {
      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          expiresIn: Math.max(0, prev.expiresIn - 1)
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.expiresIn]);

  // Nettoyer le timer
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  const sendVerificationEmail = async () => {
    setState(prev => ({ ...prev, status: 'sending', error: '' }));

    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_verification_email',
          email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setState(prev => ({
          ...prev,
          status: 'sent',
          expiresIn: data.expiresIn,
          canResend: false
        }));

        // Permettre de renvoyer après 60 secondes
        setTimer(setTimeout(() => {
          setState(prev => ({ ...prev, canResend: true }));
        }, 60000));
      } else {
        setState(prev => ({
          ...prev,
          status: 'failed',
          error: data.error || 'Erreur lors de l\'envoi du code'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: 'Erreur de connexion. Veuillez réessayer.'
      }));
    }
  };

  const verifyCode = async () => {
    if (state.code.length !== 6) {
      setState(prev => ({ ...prev, error: 'Le code doit contenir 6 chiffres' }));
      return;
    }

    setState(prev => ({ ...prev, status: 'verifying', error: '' }));

    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_email',
          email,
          verificationCode: state.code
        })
      });

      const data = await response.json();

      if (response.ok) {
        setState(prev => ({ ...prev, status: 'verified' }));
        onVerified(true);

        // Fermer automatiquement après 2 secondes
        setTimeout(() => {
          onClose?.();
        }, 2000);
      } else {
        setState(prev => ({
          ...prev,
          status: 'sent',
          error: data.error || 'Code incorrect',
          attemptsLeft: data.attemptsLeft || prev.attemptsLeft - 1
        }));

        if (data.attemptsLeft === 0) {
          onVerified(false);
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: 'Erreur de vérification. Veuillez réessayer.'
      }));
    }
  };

  const handleCodeChange = (value: string) => {
    // Accepter seulement les chiffres
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setState(prev => ({ ...prev, code: numericValue, error: '' }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-4"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-2">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Vérification de sécurité
            </h2>
            <p className="text-gray-600">
              {isRequired
                ? 'Vérifiez votre email pour continuer'
                : 'Vérification recommandée pour votre sécurité'
              }
            </p>
          </div>

          {/* Email display */}
          <div className="flex items-center justify-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="text-xs font-medium text-gray-700 truncate">{email}</span>
          </div>

          {/* Status-based content */}
          {state.status === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-sm text-gray-600 mb-3">
                Nous allons vous envoyer un code de vérification à 6 chiffres.
              </p>
              <button
                onClick={sendVerificationEmail}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Envoyer le code
              </button>
            </motion.div>
          )}

          {state.status === 'sending' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-5 h-5 text-blue-600" />
                </motion.div>
              </div>
              <p className="text-sm text-gray-600">Envoi du code en cours...</p>
            </motion.div>
          )}

          {(state.status === 'sent' || state.status === 'verifying' || state.status === 'failed') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Code input */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Code de vérification
                </label>
                <input
                  type="text"
                  value={state.code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="000000"
                  className="w-full text-center text-xl font-mono tracking-widest bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500 focus:bg-white transition-colors"
                  maxLength={6}
                  disabled={state.status === 'verifying'}
                />
              </div>

              {/* Timer */}
              {state.expiresIn > 0 && (
                <div className="text-center mb-2">
                  <span className="text-sm text-gray-500">
                    Expire dans: <span className="font-mono font-bold text-red-500">
                      {formatTime(state.expiresIn)}
                    </span>
                  </span>
                </div>
              )}

              {/* Error message */}
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-700">{state.error}</span>
                  </div>
                </motion.div>
              )}

              {/* Attempts left warning */}
              {state.attemptsLeft < 3 && state.attemptsLeft > 0 && (
                <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-yellow-700">
                      {state.attemptsLeft} tentative{state.attemptsLeft > 1 ? 's' : ''} restante{state.attemptsLeft > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  onClick={verifyCode}
                  disabled={state.code.length !== 6 || state.status === 'verifying'}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-blue-700 transition-all duration-200"
                >
                  {state.status === 'verifying' ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Lock className="w-5 h-5" />
                      </motion.div>
                      Vérification...
                    </div>
                  ) : (
                    'Vérifier'
                  )}
                </button>

                <button
                  onClick={sendVerificationEmail}
                  disabled={!state.canResend}
                  className="w-full bg-gray-100 text-gray-700 py-1 px-3 rounded-lg text-xs hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {state.canResend ? 'Renvoyer le code' : `Renvoyer dans ${formatTime(60)}`}
                </button>
              </div>
            </motion.div>
          )}

          {state.status === 'verified' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Email vérifié !
              </h3>
              <p className="text-gray-600">
                Votre compte est maintenant sécurisé.
              </p>
            </motion.div>
          )}

          {/* Close button */}
          {!isRequired && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
