'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSecurity } from '@/hooks/use-security';

interface User {
  username: string;
  email: string;
  isSupporter?: boolean;
  isAdmin?: boolean;
  referralCode?: string;
  referredBy?: string;
  artcBalance?: number;
  totalReferrals?: number;
  artcFromReferrals?: number;
  emailVerified?: boolean;
  securityFlags?: {
    highRisk: boolean;
    blockedUntil?: string;
    lastLoginAttempt?: string;
    failedLoginAttempts?: number;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isAdmin: boolean;
  securityStatus: {
    isChecking: boolean;
    isBlocked: boolean;
    requiresVerification: boolean;
    riskScore: number;
  };
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string, referredByCode?: string) => Promise<{ success: boolean; message: string; requiresEmailVerification?: boolean }>;
  logout: () => void;
  getCurrentUser: () => User | null;
  setSupporterStatus: (status: boolean) => void;
  updateArtcBalance: (username: string, amount: number) => void;
  verifyEmail: (code: string) => Promise<{ success: boolean; message: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; message: string }>;
  checkSecurityStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'gap_users';
const CURRENT_USER_KEY = 'gap_current_user';

// Générer un code de parrainage unique
function generateReferralCode(username: string): string {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const userPart = username.substring(0, 2).toUpperCase();
  return `${userPart}${randomPart}`;
}

// Vérifier que le code de parrainage est unique
function isReferralCodeUnique(code: string, users: any[]): boolean {
  return !users.some((u) => u.referralCode === code);
}

function getUsersFromStorage(): Array<any> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setUsersToStorage(users: Array<any>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const {
    checkSecurity,
    sendVerificationEmail,
    verifyEmailCode,
    reportRegistrationAttempt,
    emailVerification
  } = useSecurity();

  const [securityStatus, setSecurityStatus] = useState({
    isChecking: false,
    isBlocked: false,
    requiresVerification: false,
    riskScore: 0
  });

  const setSupporterStatus = (status: boolean) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, isSupporter: status };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Vérifier le statut de sécurité
  const checkSecurityStatus = async () => {
    if (!user?.email) return;

    setSecurityStatus(prev => ({ ...prev, isChecking: true }));

    try {
      const securityCheck = await checkSecurity(user.email);
      setSecurityStatus({
        isChecking: false,
        isBlocked: securityCheck.blocked,
        requiresVerification: securityCheck.requiresVerification,
        riskScore: securityCheck.riskScore
      });
    } catch (error) {
      console.error('Erreur vérification sécurité:', error);
      setSecurityStatus(prev => ({ ...prev, isChecking: false }));
    }
  };

  useEffect(() => {
    const stored = getCurrentUserFromStorage();
    if (stored) {
      setUser(stored);
    }
  }, []);

  // Vérifier la sécurité quand l'utilisateur change
  useEffect(() => {
    if (user?.email) {
      checkSecurityStatus();
    }
  }, [user?.email]);

  const login = async (email: string, password: string) => {
    // Vérifier la sécurité avant la connexion
    const securityCheck = await checkSecurity(email);
    if (securityCheck.blocked) {
      return { success: false, message: 'Accès temporairement bloqué pour des raisons de sécurité.' };
    }

    const users = getUsersFromStorage();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (found) {
      // Vérifier si l'email est vérifié (requis pour la connexion)
      if (!found.emailVerified) {
        return { success: false, message: 'Veuillez vérifier votre email avant de vous connecter.' };
      }

      // Vérifier les flags de sécurité
      if (found.securityFlags?.blockedUntil) {
        const blockedUntil = new Date(found.securityFlags.blockedUntil);
        if (blockedUntil > new Date()) {
          return { success: false, message: 'Compte temporairement suspendu pour des raisons de sécurité.' };
        }
      }

      const loggedUser: User = {
        username: found.username,
        email: found.email,
        isAdmin: found.isAdmin || found.email === 'admin@globalartpro.com', // Admin par email ou flag
        referralCode: found.referralCode,
        artcBalance: found.artcBalance || 0,
        artcFromReferrals: found.artcFromReferrals || 0,
        totalReferrals: found.totalReferrals || 0,
        emailVerified: found.emailVerified,
        securityFlags: found.securityFlags
      };

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedUser));
      setUser(loggedUser);

      // Réinitialiser les tentatives de connexion échouées
      if (found.securityFlags?.failedLoginAttempts) {
        found.securityFlags.failedLoginAttempts = 0;
        found.securityFlags.lastLoginAttempt = new Date().toISOString();
        setUsersToStorage(users.map(u => u.email === email ? found : u));
      }

      return { success: true, message: 'Connexion réussie.' };
    }

    // Échec de connexion - enregistrer la tentative
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex !== -1) {
      const targetUser = users[userIndex];
      if (!targetUser.securityFlags) targetUser.securityFlags = {};

      targetUser.securityFlags.failedLoginAttempts = (targetUser.securityFlags.failedLoginAttempts || 0) + 1;
      targetUser.securityFlags.lastLoginAttempt = new Date().toISOString();

      // Bloquer après 5 tentatives échouées
      if (targetUser.securityFlags.failedLoginAttempts >= 5) {
        targetUser.securityFlags.blockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
      }

      setUsersToStorage(users);
    }

    return { success: false, message: 'E-mail ou mot de passe incorrect.' };
  };

  const register = async (username: string, email: string, password: string, referredByCode?: string) => {
    // Vérifier la sécurité avant l'inscription
    const securityCheck = await checkSecurity(email);
    if (securityCheck.blocked) {
      return { success: false, message: 'Accès temporairement bloqué pour des raisons de sécurité.' };
    }

    // Signaler la tentative d'inscription pour analyse de fraude
    await reportRegistrationAttempt(email);

    const users = getUsersFromStorage();

    // Vérifier les comptes multiples par email
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Cet e-mail est déjà utilisé." };
    }

    // Générer code de parrainage unique
    let referralCode = generateReferralCode(username);
    while (!isReferralCodeUnique(referralCode, users)) {
      referralCode = generateReferralCode(username);
    }

    // Créer le nouveau utilisateur (sans l'activer immédiatement)
    const newUser: any = {
      username,
      email,
      password,
      referralCode,
      artcBalance: 0, // Pas de bonus tant que l'email n'est pas vérifié
      artcFromReferrals: 0,
      totalReferrals: 0,
      emailVerified: false,
      securityFlags: {
        highRisk: securityCheck.riskScore > 50,
        failedLoginAttempts: 0
      }
    };

    // Si parrainage valide
    if (referredByCode) {
      const referrer = users.find((u) => u.referralCode === referredByCode);
      if (referrer && referrer.email !== email) {
        // Stocker temporairement le parrainage (sera appliqué après vérification email)
        newUser.pendingReferralBy = referredByCode;
      } else {
        return { success: false, message: 'Code de parrainage invalide.' };
      }
    }

    // Sauvegarder l'utilisateur non vérifié
    setUsersToStorage([...users, newUser]);

    // Envoyer l'email de vérification
    const emailSent = await sendVerificationEmail(email);
    if (!emailSent) {
      // Supprimer l'utilisateur si l'email n'a pas pu être envoyé
      setUsersToStorage(users);
      return { success: false, message: 'Erreur lors de l\'envoi de l\'email de vérification.' };
    }

    return {
      success: true,
      message: 'Inscription réussie. Vérifiez votre email pour activer votre compte.',
      requiresEmailVerification: true
    };
  };

  // Vérifier l'email avec le code
  const verifyEmail = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!user?.email) {
      return { success: false, message: 'Aucun utilisateur connecté.' };
    }

    const verified = await verifyEmailCode(user.email, code);
    if (!verified) {
      return { success: false, message: emailVerification.error || 'Code de vérification incorrect.' };
    }

    // Activer le compte utilisateur
    const users = getUsersFromStorage();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());

    if (userIndex !== -1) {
      const targetUser = users[userIndex];
      targetUser.emailVerified = true;
      targetUser.artcBalance = 2; // Bonus de bienvenue

      // Appliquer le parrainage en attente
      if (targetUser.pendingReferralBy) {
        const referrer = users.find((u) => u.referralCode === targetUser.pendingReferralBy);
        if (referrer) {
          targetUser.referredBy = targetUser.pendingReferralBy;
          delete targetUser.pendingReferralBy;

          // Récompenser le parrain
          referrer.artcBalance = (referrer.artcBalance || 0) + 10;
          referrer.artcFromReferrals = (referrer.artcFromReferrals || 0) + 10;
          referrer.totalReferrals = (referrer.totalReferrals || 0) + 1;
        }
      }

      setUsersToStorage(users);

      // Mettre à jour l'utilisateur en session
      const updatedUser = {
        ...user,
        emailVerified: true,
        artcBalance: targetUser.artcBalance,
        referredBy: targetUser.referredBy
      };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }

    return { success: true, message: 'Email vérifié avec succès! Bienvenue sur GlobalArtPro.' };
  };

  // Renvoyer l'email de vérification
  const resendVerificationEmail = async (): Promise<{ success: boolean; message: string }> => {
    if (!user?.email) {
      return { success: false, message: 'Aucun utilisateur connecté.' };
    }

    const sent = await sendVerificationEmail(user.email);
    if (!sent) {
      return { success: false, message: 'Erreur lors de l\'envoi de l\'email.' };
    }

    return { success: true, message: 'Email de vérification renvoyé.' };
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  const getCurrentUser = () => user;

  const updateArtcBalance = (username: string, amount: number) => {
    const users = getUsersFromStorage();
    const updatedUsers = users.map((u) => {
      if (u.username === username) {
        return {
          ...u,
          artcBalance: (u.artcBalance || 0) + amount,
        };
      }
      return u;
    });
    setUsersToStorage(updatedUsers);

    // Mettre à jour le user en session
    if (user?.username === username) {
      const updated = { ...user, artcBalance: (user.artcBalance || 0) + amount };
      setUser(updated);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified || false,
    isAdmin: user?.isAdmin || false,
    securityStatus,
    login,
    register,
    logout,
    getCurrentUser,
    setSupporterStatus,
    updateArtcBalance,
    verifyEmail,
    resendVerificationEmail,
    checkSecurityStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider');
  return context;
}
