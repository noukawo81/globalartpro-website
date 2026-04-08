'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import EmailVerification from '@/components/security/EmailVerification';

interface SecureRegistrationProps {
  username: string;
  email: string;
  password: string;
  referredByCode?: string;
  onComplete: (success: boolean, message: string) => void;
  onCancel: () => void;
}

export default function SecureRegistration({
  username,
  email,
  password,
  referredByCode,
  onComplete,
  onCancel
}: SecureRegistrationProps) {
  const { register, verifyEmail, resendVerificationEmail, isEmailVerified } = useAuth();
  const [step, setStep] = useState<'registering' | 'verifying' | 'completed'>('registering');
  const [error, setError] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  React.useEffect(() => {
    handleRegistration();
  }, []);

  const handleRegistration = async () => {
    try {
      const result = await register(username, email, password, referredByCode);

      if (result.success) {
        if (result.requiresEmailVerification) {
          setStep('verifying');
          setShowEmailVerification(true);
        } else {
          setStep('completed');
          onComplete(true, result.message);
        }
      } else {
        onComplete(false, result.message);
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      onComplete(false, 'Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const handleEmailVerified = async (verified: boolean) => {
    if (verified) {
      setShowEmailVerification(false);
      setStep('completed');
      onComplete(true, 'Inscription et vérification email réussies!');
    } else {
      setError('Vérification email échouée. Veuillez réessayer.');
    }
  };

  const handleResendVerification = async () => {
    const result = await resendVerificationEmail();
    if (!result.success) {
      setError(result.message);
    }
  };

  if (step === 'registering') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </motion.div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Création de votre compte sécurisé
        </h3>
        <p className="text-gray-600">
          Vérification de sécurité en cours...
        </p>
      </motion.div>
    );
  }

  if (step === 'verifying' && showEmailVerification) {
    return (
      <EmailVerification
        email={email}
        onVerified={handleEmailVerified}
        onClose={onCancel}
        isRequired={true}
      />
    );
  }

  if (step === 'completed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Inscription réussie !
        </h3>
        <p className="text-gray-600 mb-4">
          Votre compte est maintenant sécurisé et prêt à être utilisé.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Bonus de bienvenue</h4>
          <p className="text-sm text-blue-700">
            Vous avez reçu 2 ARTC pour vous aider à démarrer sur GlobalArtPro !
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
}
