'use client';

import { useAuth } from '@/context/AuthContext';
import LandingPage from '@/components/home/LandingPage';
import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
  const { isAuthenticated } = useAuth();

  // Afficher landing pour les visiteurs, dashboard pour les connectés
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}