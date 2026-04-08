'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('Votre Nom');
  const [role, setRole] = useState("Collectionneur & Amateur d'art");
  const [image, setImage] = useState('/placeholder.svg?height=150&width=150');
  const [bio, setBio] = useState('Passionné d\'art africain et de culture mondiale.');
  const [location, setLocation] = useState('Paris, France');
  const [website, setWebsite] = useState('');
  const [followers, setFollowers] = useState(342);
  const [following, setFollowing] = useState(512);
  const [favorites, setFavorites] = useState(0);
  const [joinDate] = useState('Janvier 2024');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const saved = localStorage.getItem('gap_profile');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setName(p.name || user.username || name);
        setRole(p.role || role);
        setBio(p.bio || bio);
        setLocation(p.location || location);
        setWebsite(p.website || website);
        if (p.image) setImage(p.image);
      } catch (e) {}
    } else {
      setName(user.username || name);
    }

    const favRaw = localStorage.getItem('gap_favorites');
    if (favRaw) {
      try { setFavorites(JSON.parse(favRaw).length) } catch (e) {}
    }
  }, [user, router]);

  const handleClickUpload = () => fileRef.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setImage(data);
      const existing = localStorage.getItem('gap_profile');
      const profile = existing ? JSON.parse(existing) : {};
      profile.image = data;
      localStorage.setItem('gap_profile', JSON.stringify(profile));
    };
    reader.readAsDataURL(f);
  };

  const saveProfile = () => {
    const profile = {
      name,
      role,
      bio,
      location,
      website,
      image
    };
    localStorage.setItem('gap_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Premium */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">Mon Profil</h1>
              <p className="text-white/80 text-lg mt-2 font-medium">Gérez votre identité numérique</p>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              {isAdmin && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg text-white px-5 py-3 rounded-2xl hover:bg-white/30 transition-all shadow-lg font-bold border border-white/30"
                  >
                    🛡️ Admin Panel
                  </Link>
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-5 py-3 rounded-2xl hover:bg-gray-100 transition-all shadow-lg font-bold"
              >
                ✏️ {isEditing ? 'Annuler' : 'Modifier Profil'}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl shadow-xl p-8 backdrop-blur-xl">
                <div className="text-center">
                  <motion.div 
                    className="relative inline-block mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75"></div>
                    <img
                      src={image}
                      alt="Profile"
                      className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={handleClickUpload}
                        className="absolute bottom-0 right-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-3 rounded-full hover:shadow-lg transition-all shadow-lg"
                      >
                        📷
                      </motion.button>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="hidden"
                    />
                  </motion.div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-center text-2xl font-black border-2 border-purple-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Votre nom"
                      />
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full text-center text-sm text-gray-600 border-2 border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Votre rôle"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{name}</h2>
                      <p className="text-sm text-gray-600 font-medium mt-2">{role}</p>
                    </>
                  )}

                  <div className="grid grid-cols-3 gap-4 text-center my-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                    <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                      <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{followers}</div>
                      <div className="text-xs text-gray-600 font-semibold">Abonnés</div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                      <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{following}</div>
                      <div className="text-xs text-gray-600 font-semibold">Abonnements</div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                      <div className="font-bold text-xl bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">{favorites}</div>
                      <div className="text-xs text-gray-600 font-semibold">Favoris</div>
                    </motion.div>
                  </div>

                  <div className="space-y-3">
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Link
                        href="/favorites"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all font-bold"
                      >
                        ❤️ Mes Favoris
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Link
                        href="/settings"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all font-bold"
                      >
                        ⚙️ Paramètres
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <button
                        onClick={handleLogout}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all font-bold"
                      >
                        🚪 Déconnexion
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Details Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Main Info Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl shadow-xl p-8 backdrop-blur-xl">
                <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">Informations personnelles</h3>

                <div className="space-y-6">
                  {/* Bio */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      ✍️ Biographie
                    </label>
                    {isEditing ? (
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        className="w-full border-2 border-purple-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30"
                        placeholder="Parlez de vous..."
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{bio}</p>
                    )}
                  </motion.div>

                  {/* Location */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      📍 Localisation
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border-2 border-purple-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30"
                        placeholder="Votre localisation"
                      />
                    ) : (
                      <p className="text-gray-700">{location}</p>
                    )}
                  </motion.div>

                  {/* Website */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      🌐 Site web
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full border-2 border-purple-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30"
                        placeholder="https://votresite.com"
                      />
                    ) : (
                      website ? (
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 font-semibold"
                        >
                          {website}
                        </a>
                      ) : (
                        <p className="text-gray-400">Aucun site web</p>
                      )
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                    <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      ✉️ Email
                    </label>
                    <p className="text-gray-700">{user?.email || 'N/A'}</p>
                  </motion.div>

                  {/* Join Date */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                    <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      📅 Membre depuis
                    </label>
                    <p className="text-gray-700">{joinDate}</p>
                  </motion.div>
                </div>

                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex gap-3"
                  >
                    <button
                      onClick={saveProfile}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-bold"
                    >
                      ✅ Enregistrer
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-bold"
                    >
                      ❌ Annuler
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Statistics Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-3xl shadow-xl p-8 backdrop-blur-xl">
                <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">Statistiques</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center cursor-pointer"
                  >
                    <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{followers}</div>
                    <div className="text-sm text-gray-700 font-semibold mt-2">Abonnés</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center cursor-pointer"
                  >
                    <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{following}</div>
                    <div className="text-sm text-gray-700 font-semibold mt-2">Suivis</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 text-center cursor-pointer"
                  >
                    <div className="text-3xl font-black bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">{favorites}</div>
                    <div className="text-sm text-gray-700 font-semibold mt-2">Favoris</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}