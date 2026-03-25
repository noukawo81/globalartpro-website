'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  email: string;
  isSupporter?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  getCurrentUser: () => User | null;
  setSupporterStatus: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'gap_users';
const CURRENT_USER_KEY = 'gap_current_user';

function getUsersFromStorage(): Array<{ username: string; email: string; password: string }> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setUsersToStorage(users: Array<{ username: string; email: string; password: string }>) {
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
      const loggedUser = { username: found.username, email: found.email };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loggedUser));
      setUser(loggedUser);
      return { success: true, message: 'Connexion réussie.' };
    }
    return { success: false, message: 'E-mail ou mot de passe incorrect.' };
  };

  const register = async (username: string, email: string, password: string) => {
    const users = getUsersFromStorage();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "Cet e-mail est déjà utilisé." };
    }

    const newUser = { username, email, password };
    const nextUsers = [...users, newUser];
    setUsersToStorage(nextUsers);

    const savedUser = { username, email };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(savedUser));
    setUser(savedUser);

    return { success: true, message: 'Inscription réussie.' };
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  const getCurrentUser = () => user;

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    getCurrentUser,
    setSupporterStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider');
  return context;
}
