'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Certificate {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'artist' | 'expert' | 'contributor' | 'supporter';
  title: string;
  description: string;
  issuedDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'revoked';
  metadata: {
    achievements: string[];
    score?: number;
    level?: string;
  };
}

export default function CertificatesAdminPage() {
  const { user, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Redirection si pas admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <span className="text-red-600 text-2xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  // Données simulées de certificats
  const certificates: Certificate[] = [
    {
      id: 'cert_001',
      userId: 'user_123',
      userName: 'Alice Dupont',
      userEmail: 'alice@example.com',
      type: 'artist',
      title: 'Artiste Certifié GlobalArtPro',
      description: 'Certification pour artiste professionnel avec portfolio validé',
      issuedDate: '2024-03-15',
      status: 'active',
      metadata: {
        achievements: ['Portfolio validé', 'Plus de 50 œuvres', 'Évaluation IA positive'],
        score: 95,
        level: 'Expert'
      }
    },
    {
      id: 'cert_002',
      userId: 'user_456',
      userName: 'Bob Martin',
      userEmail: 'bob@example.com',
      type: 'expert',
      title: 'Expert Culturel GlobalArtPro',
      description: 'Certification d\'expert en hiérarchie culturelle',
      issuedDate: '2024-03-10',
      expiryDate: '2025-03-10',
      status: 'active',
      metadata: {
        achievements: ['Formation complétée', 'Évaluation passée', 'Contributions validées'],
        score: 88,
        level: 'Avancé'
      }
    },
    {
      id: 'cert_003',
      userId: 'user_789',
      userName: 'Claire Bernard',
      userEmail: 'claire@example.com',
      type: 'supporter',
      title: 'Supporter Premium GlobalArtPro',
      description: 'Certification pour soutien exceptionnel à la plateforme',
      issuedDate: '2024-02-28',
      status: 'active',
      metadata: {
        achievements: ['1000 ARTC donnés', 'Membre depuis 1 an', 'Contributions régulières'],
        score: 92,
        level: 'Premium'
      }
    }
  ];

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || cert.type === filterType;
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'artist': return 'bg-blue-100 text-blue-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      case 'contributor': return 'bg-green-100 text-green-800';
      case 'supporter': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'revoked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <span className="text-green-600">✓</span>;
      case 'expired': return <span className="text-red-600">✗</span>;
      case 'revoked': return <span className="text-gray-600">✗</span>;
      default: return <span className="text-gray-600">○</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-gray-400 hover:text-gray-600">
                ← Retour au panel
              </Link>
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestion des Certificats
                </h1>
                <p className="text-sm text-gray-600">
                  Délivrer et gérer les certifications GlobalArtPro
                </p>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors">
              Nouveau certificat
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total certificats</p>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">C</span>
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
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {certificates.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">✓</span>
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
                <p className="text-sm font-medium text-gray-600">Expirés</p>
                <p className="text-2xl font-bold text-red-600">
                  {certificates.filter(c => c.status === 'expired').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">✗</span>
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
                <p className="text-sm font-medium text-gray-600">Ce mois</p>
                <p className="text-2xl font-bold text-purple-600">3</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">📅</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou titre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous types</option>
                <option value="artist">Artiste</option>
                <option value="expert">Expert</option>
                <option value="contributor">Contributeur</option>
                <option value="supporter">Supporter</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous statuts</option>
                <option value="active">Actif</option>
                <option value="expired">Expiré</option>
                <option value="revoked">Révoqué</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Certificates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cert.userName}</div>
                        <div className="text-sm text-gray-500">{cert.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(cert.type)}`}>
                        {cert.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cert.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{cert.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cert.status)}`}>
                        {getStatusIcon(cert.status)}
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(cert.issuedDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          👁
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          ✗
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {filteredCertificates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <span className="text-4xl">🏆</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun certificat trouvé</h3>
            <p className="text-gray-600">Aucun certificat ne correspond à vos critères de recherche.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
