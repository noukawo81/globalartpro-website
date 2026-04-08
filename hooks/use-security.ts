'use client';

import { useState, useCallback, useEffect } from 'react';

interface SecurityCheck {
  isSafe: boolean;
  riskScore: number;
  requiresVerification: boolean;
  blocked: boolean;
  message?: string;
}

interface EmailVerificationState {
  isVerified: boolean;
  isVerifying: boolean;
  error: string;
  attemptsLeft: number;
}

interface FraudDetection {
  ip: string;
  email: string;
  deviceFingerprint: string;
  registrationAttempts: number;
  lastAttempt: string;
  blockedUntil?: string;
  riskScore: number;
}

export function useSecurity() {
  const [securityCheck, setSecurityCheck] = useState<SecurityCheck | null>(null);
  const [emailVerification, setEmailVerification] = useState<EmailVerificationState>({
    isVerified: false,
    isVerifying: false,
    error: '',
    attemptsLeft: 3
  });
  const [isLoading, setIsLoading] = useState(false);

  // Générer un fingerprint de device côté client
  const generateDeviceFingerprint = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('fingerprint', 10, 10);

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      !!window.indexedDB,
      canvas.toDataURL()
    ].join('|');

    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }, []);

  // Vérifier la sécurité avant une action sensible
  const checkSecurity = useCallback(async (email: string): Promise<SecurityCheck> => {
    setIsLoading(true);
    try {
      const deviceFingerprint = generateDeviceFingerprint();

      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_security',
          email,
          deviceFingerprint
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de vérification de sécurité');
      }

      const result: SecurityCheck = {
        isSafe: !data.blocked && data.riskScore < 75,
        riskScore: data.riskScore,
        requiresVerification: data.requiresVerification,
        blocked: data.blocked,
        message: data.error
      };

      setSecurityCheck(result);
      return result;
    } catch (error) {
      console.error('Erreur vérification sécurité:', error);
      const errorResult: SecurityCheck = {
        isSafe: false,
        riskScore: 100,
        requiresVerification: true,
        blocked: false,
        message: 'Erreur de vérification de sécurité'
      };
      setSecurityCheck(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  }, [generateDeviceFingerprint]);

  // Envoyer un code de vérification email
  const sendVerificationEmail = useCallback(async (email: string): Promise<boolean> => {
    setEmailVerification(prev => ({ ...prev, isVerifying: true, error: '' }));

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
        setEmailVerification(prev => ({
          ...prev,
          isVerifying: false,
          error: '',
          attemptsLeft: 3
        }));
        return true;
      } else {
        setEmailVerification(prev => ({
          ...prev,
          isVerifying: false,
          error: data.error || 'Erreur lors de l\'envoi du code',
          attemptsLeft: data.attemptsLeft || prev.attemptsLeft
        }));
        return false;
      }
    } catch (error) {
      setEmailVerification(prev => ({
        ...prev,
        isVerifying: false,
        error: 'Erreur de connexion'
      }));
      return false;
    }
  }, []);

  // Vérifier le code email
  const verifyEmailCode = useCallback(async (email: string, code: string): Promise<boolean> => {
    setEmailVerification(prev => ({ ...prev, isVerifying: true, error: '' }));

    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_email',
          email,
          verificationCode: code
        })
      });

      const data = await response.json();

      if (response.ok) {
        setEmailVerification({
          isVerified: true,
          isVerifying: false,
          error: '',
          attemptsLeft: 3
        });
        return true;
      } else {
        setEmailVerification(prev => ({
          ...prev,
          isVerified: false,
          isVerifying: false,
          error: data.error || 'Code incorrect',
          attemptsLeft: data.attemptsLeft || prev.attemptsLeft - 1
        }));
        return false;
      }
    } catch (error) {
      setEmailVerification(prev => ({
        ...prev,
        isVerified: false,
        isVerifying: false,
        error: 'Erreur de vérification'
      }));
      return false;
    }
  }, []);

  // Signaler une tentative d'inscription pour analyse de fraude
  const reportRegistrationAttempt = useCallback(async (email: string): Promise<void> => {
    try {
      const deviceFingerprint = generateDeviceFingerprint();

      await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'report_registration_attempt',
          email,
          deviceFingerprint
        })
      });
    } catch (error) {
      console.error('Erreur signalement tentative:', error);
      // Ne pas bloquer le processus d'inscription pour cette erreur
    }
  }, [generateDeviceFingerprint]);

  // Réinitialiser l'état de vérification email
  const resetEmailVerification = useCallback(() => {
    setEmailVerification({
      isVerified: false,
      isVerifying: false,
      error: '',
      attemptsLeft: 3
    });
  }, []);

  // Hook pour surveiller les changements de focus (détection d'onglets multiples)
  useEffect(() => {
    let focusCount = 0;
    const handleFocus = () => {
      focusCount++;
      if (focusCount > 1) {
        // Potentielle activité suspecte - plusieurs onglets
        console.warn('Multiple tabs detected - potential suspicious activity');
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Hook pour détecter les changements de visibilité de page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page masquée - pourrait indiquer un comportement suspect
        console.log('Page hidden - monitoring for suspicious activity');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return {
    // État
    securityCheck,
    emailVerification,
    isLoading,

    // Actions
    checkSecurity,
    sendVerificationEmail,
    verifyEmailCode,
    reportRegistrationAttempt,
    resetEmailVerification,

    // Utilitaires
    generateDeviceFingerprint
  };
}

// Hook pour la surveillance en temps réel des menaces
export function useThreatMonitoring() {
  const [threats, setThreats] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);

    // Surveiller les événements de sécurité toutes les 30 secondes
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/security?action=fraud_stats');
        const data = await response.json();

        if (data.fraudAttempts > threats.length) {
          // Nouvelles menaces détectées
          setThreats(prev => [...prev, {
            timestamp: new Date().toISOString(),
            type: 'new_fraud_attempt',
            count: data.fraudAttempts - prev.length
          }]);
        }
      } catch (error) {
        console.error('Erreur surveillance menaces:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [threats.length]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      const cleanup = startMonitoring();
      return cleanup;
    }
  }, [isMonitoring, startMonitoring]);

  return {
    threats,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearThreats: () => setThreats([])
  };
}

// Hook pour la validation de sécurité des formulaires
export function useSecureForm() {
  const [securityValidated, setSecurityValidated] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateFormSecurity = useCallback(async (formData: {
    email: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<boolean> => {
    const errors: string[] = [];

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push('Format d\'email invalide');
    }

    // Validation mot de passe (si fourni)
    if (formData.password) {
      if (formData.password.length < 8) {
        errors.push('Le mot de passe doit contenir au moins 8 caractères');
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        errors.push('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre');
      }
      if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errors.push('Les mots de passe ne correspondent pas');
      }
    }

    // Vérification de sécurité côté serveur
    try {
      const securityCheck = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_security',
          email: formData.email
        })
      });

      const securityData = await securityCheck.json();

      if (securityData.blocked) {
        errors.push('Accès temporairement bloqué pour des raisons de sécurité');
      }

      if (securityData.riskScore > 75) {
        errors.push('Activité suspecte détectée. Vérification supplémentaire requise.');
      }
    } catch (error) {
      errors.push('Erreur de validation de sécurité');
    }

    setValidationErrors(errors);
    const isValid = errors.length === 0;
    setSecurityValidated(isValid);

    return isValid;
  }, []);

  return {
    securityValidated,
    validationErrors,
    validateFormSecurity,
    clearErrors: () => setValidationErrors([])
  };
}
