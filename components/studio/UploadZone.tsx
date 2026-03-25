'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
  isLoading?: boolean;
}

export default function UploadZone({
  onImageSelect,
  previewUrl,
  isLoading = false,
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      } else {
        alert('Veuillez sélectionner une image');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      } else {
        alert('Veuillez sélectionner une image');
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  if (previewUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl overflow-hidden border-2 border-yellow-500/30 bg-gradient-to-br from-gray-900 to-black p-6"
      >
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-950">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 400px, 500px"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          disabled={isLoading}
          className="absolute top-4 right-4 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs font-semibold rounded-lg hover:bg-yellow-500/30 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Chargement...' : 'Changer'}
        </motion.button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 cursor-pointer ${
        isDragActive
          ? 'border-yellow-400 bg-yellow-500/10'
          : 'border-gray-700 bg-gradient-to-br from-gray-900/50 to-black hover:border-yellow-500/50 hover:bg-gray-900/80'
      }`}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={isLoading}
      />

      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-5xl"
        >
          {isDragActive ? '🎨' : '📸'}
        </motion.div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white">
            {isDragActive
              ? 'Lâchez votre œuvre'
              : 'Importez votre œuvre'}
          </h3>
          <p className="text-gray-400 text-sm">
            Vous pouvez glisser-déposer une image ou cliquer pour naviguer
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF • Max 10 Mo
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-200 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Chargement...' : 'Importer une œuvre'}
        </motion.button>
      </div>
    </motion.div>
  );
}
