'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Eye,
  Users,
  Clock,
  Ban,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Lock,
  Mail
} from 'lucide-react';

interface SecurityStats {
  totalEvents: number;
  fraudAttempts: number;
  multipleAccounts: number;
  blockedIPs: number;
  highRiskRecords: number;
}

interface SecurityEvent {
  id: string;
  type: 'fraud_attempt' | 'multiple_accounts' | 'suspicious_activity' | 'email_verification';
  userId?: string;
  email?: string;
  ip: string;
  userAgent: string;
  deviceFingerprint: string;
  timestamp: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'fraud'>('overview');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Charger les statistiques
      const statsResponse = await fetch('/api/security?action=fraud_stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Charger les événements récents
      const eventsResponse = await fetch('/api/security?action=security_logs');
      const eventsData = await eventsResponse.json();
      setEvents(eventsData.events || []);

    } catch (error) {
      console.error('Erreur chargement données sécurité:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud_attempt': return <AlertTriangle className="w-4 h-4" />;
      case 'multiple_accounts': return <Users className="w-4 h-4" />;
      case 'suspicious_activity': return <Eye className="w-4 h-4" />;
      case 'email_verification': return <Mail className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-6 h-6 text-blue-600" />
            </motion.div>
          </div>
          <p className="text-gray-600">Chargement du tableau de bord sécurité...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Tableau de Bord Sécurité
                </h1>
                <p className="text-sm text-gray-600">
                  Surveillance et protection contre les fraudes
                </p>
              </div>
            </div>
            <button
              onClick={loadSecurityData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-8 bg-white p-1 rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Aperçu', icon: TrendingUp },
            { id: 'events', label: 'Événements', icon: Activity },
            { id: 'fraud', label: 'Fraudes', icon: AlertTriangle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Événements</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tentatives Fraude</p>
                  <p className="text-2xl font-bold text-red-600">{stats.fraudAttempts}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Comptes Multiples</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.multipleAccounts}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">IPs Bloquées</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.blockedIPs}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Ban className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Événements de Sécurité Récents</h2>
              <p className="text-sm text-gray-600">Les 100 derniers événements détectés</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sévérité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email/IP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Détails
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getEventTypeIcon(event.type)}
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {event.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {event.email && <div>{event.email}</div>}
                          <div className="text-gray-500 font-mono text-xs">{event.ip}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(event.timestamp)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {Object.keys(event.details).length > 0
                            ? JSON.stringify(event.details)
                            : 'Aucun détail'
                          }
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fraud Tab */}
        {activeTab === 'fraud' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Analyse des Risques</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats?.highRiskRecords || 0}</div>
                  <div className="text-sm text-red-700">Enregistrements à haut risque</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats ? Math.round((stats.fraudAttempts / Math.max(stats.totalEvents, 1)) * 100) : 0}%
                  </div>
                  <div className="text-sm text-yellow-700">Taux de fraude</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats ? Math.round((stats.blockedIPs / Math.max(stats.totalEvents, 1)) * 100) : 0}%
                  </div>
                  <div className="text-sm text-blue-700">Taux de blocage</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Recommandées</h2>
              <div className="space-y-3">
                {stats && stats.fraudAttempts > 10 && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-800">Activité frauduleuse élevée détectée</p>
                      <p className="text-sm text-red-700">Considérez renforcer les mesures de sécurité</p>
                    </div>
                  </div>
                )}

                {stats && stats.blockedIPs > 5 && (
                  <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <Ban className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-orange-800">Plusieurs IPs bloquées</p>
                      <p className="text-sm text-orange-700">Vérifiez les règles de blocage automatique</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">Système de sécurité actif</p>
                    <p className="text-sm text-green-700">Surveillance continue des menaces</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
