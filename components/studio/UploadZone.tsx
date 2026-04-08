'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]?.type.startsWith('image/')) {
      onImageSelect(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]?.type.startsWith('image/')) {
      onImageSelect(files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {previewUrl ? (
          /* --- MODE PRÉVISUALISATION (L'ŒUVRE ANALYSÉE) --- */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-[2.5rem] overflow-hidden border border-gold-500/30 bg-black p-4 shadow-2xl shadow-gold-500/10"
          >
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-zinc-950 group">
              <Image
                src={previewUrl}
                alt="Production Preview"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Effet Scanner Laser IA */}
              {isLoading && (
                <motion.div 
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.8)] z-10"
                />
              )}

              {/* Overlay de protection "Vitre de Musée" */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            </div>

            <div className="mt-6 flex justify-between items-center px-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-bold">Statut</span>
                <span className="text-white text-sm font-light italic">
                  {isLoading ? "Analyse du patrimoine..." : "Œuvre prête pour signature"}
                </span>
              </div>
              
              <button
                onClick={() => inputRef.current?.click()}
                disabled={isLoading}
                className="px-6 py-2 bg-white/5 border border-white/10 text-white text-xs rounded-full hover:bg-white hover:text-black transition-all duration-500"
              >
                Remplacer
              </button>
            </div>
          </motion.div>
        ) : (
          /* --- MODE IMPORTATION (LE SCANNER VIDE) --- */
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onDragEnter={handleDrag}
            onDragLeave={() => setIsDragActive(false)}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative h-80 rounded-[2.5rem] border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center overflow-hidden ${
              isDragActive
                ? 'border-gold-400 bg-gold-500/5'
                : 'border-white/10 bg-zinc-950 hover:border-gold-500/40'
            }`}
          >
            {/* Décoration d'arrière-plan futuriste */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gold-500/20 blur-[80px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
              <motion.div
                animate={isDragActive ? { scale: 1.2, rotate: 5 } : { scale: 1 }}
                className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
              >
                <span className="text-3xl">{isDragActive ? '✨' : '💎'}</span>
              </motion.div>

              <div>
                <h3 className="text-2xl font-serif italic text-white mb-2">
                  Déposer une Signature
                </h3>
                <p className="text-gray-500 text-sm font-light max-w-xs leading-relaxed">
                  Importez l'image que vous souhaitez transformer en œuvre d'art sacrée et certifiée.
                </p>
              </div>

              <span className="text-[10px] uppercase tracking-[0.4em] text-gold-500/60 font-bold">
                Studio Haute Définition
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}