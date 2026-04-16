"use client";

import React, { useState } from 'react';

const PartenariatPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    type: 'Centre Culturel', // Valeur par défaut
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Envoi en cours...');
    
    // Ici, tu pourras connecter ton API d'envoi d'email plus tard
    setTimeout(() => {
      setStatus('Merci ! Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.');
      setFormData({ nom: '', email: '', type: 'Centre Culturel', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl border border-gray-100">
        <div className="p-8">
          {/* En-tête avec rappel du Logo Globe */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 animate-spin-slow bg-red-600 rounded-full flex items-center justify-center text-3xl mb-4">
              🌐
            </div>
            <h1 className="text-3xl font-bold text-midnight-blue text-center">Devenir Partenaire</h1>
            <p className="mt-2 text-gray-600 text-center">
              Rejoignez GlobalArtPro pour promouvoir l'art numérique et la blockchain.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom / Raison Sociale */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom ou Nom de l'Organisation</label>
              <input
                required
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-600 focus:border-red-600 text-black"
                placeholder="Ex: Centre Culturel de Douala ou Jean Dupont"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
            </div>

            {/* Email professionnel */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email de contact</label>
              <input
                required
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-600 focus:border-red-600 text-black"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Type de partenaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Vous êtes :</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-600 focus:border-red-600 text-black bg-white"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>Centre Culturel</option>
                <option>Entreprise / Sponsor</option>
                <option>Musée / Galerie</option>
                <option>Particulier / Investisseur</option>
                <option>Autre</option>
              </select>
            </div>

            {/* Message / Proposition */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Votre vision du partenariat</label>
              <textarea
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-600 focus:border-red-600 text-black"
                placeholder="Comment souhaitez-vous collaborer avec GlobalArtPro ?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            {/* Bouton d'envoi */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#000080] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors"
              >
                Envoyer la demande de partenariat
              </button>
            </div>
          </form>

          {status && (
            <div className="mt-4 p-4 rounded-md bg-green-50 text-green-800 text-center font-medium">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartenariatPage;
