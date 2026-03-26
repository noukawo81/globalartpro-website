'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Rediriger vers accueil si pas connecté
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Afficher dashboard seulement si connecté
  if (!isAuthenticated) {
    return null;
  }

  return <Dashboard />;
}
