'use client';

import { useState } from 'react';

interface CreatePostProps {
  onCreate: (input: { imageUrl: string; description: string }) => void;
}

export default function CreatePost({ onCreate }: CreatePostProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!description.trim()) {
      setMessage('La description est requise.');
      return;
    }

    onCreate({ imageUrl: imageUrl.trim() || 'https://via.placeholder.com/640x420?text=Art+Placeholder', description: description.trim() });
    setImageUrl('');
    setDescription('');
    setMessage('Votre œuvre a été partagée avec le monde 🌍');

    setTimeout(() => setMessage(''), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-yellow-500/30 bg-slate-900/70 p-5 shadow-lg shadow-yellow-500/10 space-y-4">
      <h3 className="text-xl font-bold text-yellow-300">Publier une nouvelle œuvre</h3>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Image (URL ou vide pour placeholder)</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Racontez votre sensibilité..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
        />
      </div>
      <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold hover:opacity-90 transition">
        Publier
      </button>
      {message && <p className="text-green-300 text-sm text-center">{message}</p>}
    </form>
  );
}
