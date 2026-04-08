'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Users,
  Award,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();

  // Redirection si pas admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const adminActions = [
    {
      title: 'Sécurité',
      description: 'Gérer la sécurité et surveiller les menaces',
      icon: Shield,
      href: '/admin/security',
      color: 'from-red-500 to-orange-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      title: 'Certificats',
      description: 'Gérer et délivrer des certificats aux utilisateurs',
      icon: Award,
      href: '/admin/certificates',
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Utilisateurs',
      description: 'Gérer les comptes utilisateurs et permissions',
      icon: Users,
      href: '/admin/users',
      color: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Analytics',
      description: 'Voir les statistiques et métriques de la plateforme',
      icon: TrendingUp,
      href: '/admin/analytics',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Contenu',
      description: 'Gérer le contenu et les publications',
      icon: Eye,
      href: '/admin/content',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Paramètres',
      description: 'Configuration générale de la plateforme',
      icon: Lock,
      href: '/admin/settings',
      color: 'from-gray-500 to-slate-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header Premium */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-2xl shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                  Panel Administrateur
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Bienvenue, {user?.username} - Gestion de GlobalArtPro
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-full shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-sm" />
                <span className="text-sm font-bold text-white tracking-wide">Admin</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{user?.username?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Premium */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Utilisateurs actifs</p>
                <p className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">1,247</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">+12% ce mois</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Certificats délivrés</p>
                <p className="text-4xl font-black text-gray-900 group-hover:text-green-600 transition-colors">89</p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Validés</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Alertes sécurité</p>
                <p className="text-4xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">3</p>
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-orange-600 font-medium">Sous contrôle</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Taux de croissance</p>
                <p className="text-4xl font-black text-gray-900 group-hover:text-purple-600 transition-colors">+12%</p>
                <div className="flex items-center gap-2 mt-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-purple-600 font-medium">En progression</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Admin Actions Grid Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={action.href}>
                <div className={`relative overflow-hidden rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 cursor-pointer group backdrop-blur-xl ${action.bgColor} hover:scale-[1.02] transform`}>
                  <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity ${action.color}" />
                  <div className="relative p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <div className="w-8 h-8 border-2 border-current rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 bg-current rounded-full transform translate-x-0.5 translate-y-0.5" />
                        </div>
                      </div>
                    </div>

                    <h3 className={`text-2xl font-black mb-3 ${action.textColor} group-hover:scale-105 transition-transform`}>
                      {action.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed font-medium group-hover:text-gray-900 transition-colors">
                      {action.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        Accéder →
                      </div>
                      <div className={`w-2 h-2 rounded-full ${action.color.replace('from-', 'bg-').split(' ')[0]} animate-pulse`} />
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-br ${action.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Activité récente</h2>
                <p className="text-sm text-gray-600 font-medium">Surveillance en temps réel</p>
              </div>
            </div>
            <Link href="/admin/activity" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-sm hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Voir tout
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </Link>
          </div>

          <div className="space-y-6">
            {[
              { action: 'Certificat délivré', user: 'Alice Dupont', time: '2 min', type: 'success', icon: Award },
              { action: 'Nouvel utilisateur', user: 'Bob Martin', time: '15 min', type: 'info', icon: Users },
              { action: 'Alerte sécurité', user: 'Tentative de connexion suspecte', time: '1h', type: 'warning', icon: AlertTriangle },
              { action: 'Mise à jour contenu', user: 'Page Artistes modifiée', time: '2h', type: 'info', icon: Eye }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-6 p-6 bg-gradient-to-r from-white/50 to-gray-50/50 rounded-2xl border border-white/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                  activity.type === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                  activity.type === 'warning' ? 'bg-gradient-to-br from-orange-500 to-red-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                  <activity.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-lg">{activity.action}</h4>
                    <span className="text-sm text-gray-500 font-medium">{activity.time}</span>
                  </div>
                  <p className="text-gray-600 font-medium mt-1">{activity.user}</p>
                </div>
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
