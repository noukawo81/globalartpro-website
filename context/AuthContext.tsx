'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  email: string;
  isSupporter?: boolean;
  referralCode?: string;
  referredBy?: string;
  artcBalance?: number;
  totalReferrals?: number;
  artcFromReferrals?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string, referredByCode?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  getCurrentUser: () => User | null;
  setSupporterStatus: (status: boolean) => void;
  updateArtcBalance: (username: string, amount: number) => void;
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

  const setSupporterStatus = (status: boolean) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, isSupporter: status };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const stored = getCurrentUserFromStorage();
    if (stored) setUser(stored);
  }, []);

  const login = async (email: string, password: string) => {
    const users = getUsersFromStorage();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      const loggedUser = {
        username: found.username,
        email: found.email,
        referralCode: found.referralCode,
        artcBalance: found.artcBalance || 0,
        artcFromReferrals: found.artcFromReferrals || 0,
        totalReferrals: found.totalReferrals || 0,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedUser));
      setUser(loggedUser);
      return { success: true, message: 'Connexion réussie.' };
    }
    return { success: false, message: 'E-mail ou mot de passe incorrect.' };
  };

  const register = async (username: string, email: string, password: string, referredByCode?: string) => {
    const users = getUsersFromStorage();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Cet e-mail est déjà utilisé." };
    }

    // Générer code de parrainage unique
    let referralCode = generateReferralCode(username);
    while (!isReferralCodeUnique(referralCode, users)) {
      referralCode = generateReferralCode(username);
    }

    // Créer le nouveau utilisateur
    const newUser: any = {
      username,
      email,
      password,
      referralCode,
      artcBalance: 2, // 2 ARTC de bonus pour le nouveau
      artcFromReferrals: 0,
      totalReferrals: 0,
    };

    // Si parrainage valide
    if (referredByCode) {
      const referrer = users.find((u) => u.referralCode === referredByCode);
      if (referrer && referrer.email !== email) {
        // Ajouter le parrain
        newUser.referredBy = referredByCode;

        // Récompenser le parrain
        referrer.artcBalance = (referrer.artcBalance || 0) + 10;
        referrer.artcFromReferrals = (referrer.artcFromReferrals || 0) + 10;
        referrer.totalReferrals = (referrer.totalReferrals || 0) + 1;

        // Sauvegarder le parrain modifié
        const updatedUsers = users.map((u) =>
          u.email === referrer.email ? referrer : u
        );
        setUsersToStorage([...updatedUsers, newUser]);
      } else {
        return { success: false, message: 'Code de parrainage invalide.' };
      }
    } else {
      setUsersToStorage([...users, newUser]);
    }

    // Connecter automatiquement le nouvel utilisateur
    const savedUser = {
      username,
      email,
      referralCode,
      artcBalance: 2,
      artcFromReferrals: 0,
      totalReferrals: 0,
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(savedUser));
    setUser(savedUser);

    return { success: true, message: 'Inscription réussie.' };
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
    login,
    register,
    logout,
    getCurrentUser,
    setSupporterStatus,
    updateArtcBalance,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider');
  return context;
}
