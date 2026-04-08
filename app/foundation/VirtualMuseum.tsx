'use client';

import React, { useState, Suspense, useRef, useEffect, FormEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, Environment, ContactShadows, PerspectiveCamera, Plane } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface Artwork {
  id: number;
  title: string;
  culture: string;
  description: string;
  color: string;
  accentColor?: string;
  type: 'globe' | 'pedestal';
  position: [number, number, number];
  year: string;
  materials: string;
}

interface ArtGlobeProps {
  position: [number, number, number];
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

interface FloatingPedestalProps {
  position: [number, number, number];
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
}

interface MuseumSceneProps {
  selectedArtwork: Artwork | null;
  onArtworkClick: (artwork: Artwork) => void;
}

interface MuseumUIProps {
  selectedArtwork: Artwork | null;
  onClose: () => void;
  comments: string[];
  onAddComment: (comment: string) => void;
}

// Enhanced Glass Globe Component with Pedestal
function ArtGlobe({ position, artwork, onClick }: ArtGlobeProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (hovered && globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Marble Pedestal Base */}
      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.3, 0.4, 32]} />
        <meshPhysicalMaterial
          color="#f5f5f5"
          metalness={0.05}
          roughness={0.15}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Pedestal Support Ring */}
      <mesh position={[0, -0.8, 0]} castShadow>
        <ringGeometry args={[0.95, 1.25, 32]} />
        <meshPhysicalMaterial
          color="#e8e8e8"
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {/* Premium Glass Globe */}
      <mesh
        ref={globeRef}
        position={[0, 0.2, 0]}
        onClick={() => onClick(artwork)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.08 : 1}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshPhysicalMaterial
          transmission={0.95}
          ior={1.52}
          thickness={0.3}
          roughness={0.02}
          metalness={0.05}
          envMapIntensity={1.2}
          opacity={0.85}
        />
      </mesh>

      {/* Internal Artifact - Enhanced Design */}
      <group position={[0, 0.1, 0]}>
        {/* Base of artifact */}
        <mesh castShadow>
          <octahedronGeometry args={[0.4, 2]} />
          <meshPhysicalMaterial
            color={artwork.color}
            metalness={0.5}
            roughness={0.3}
            envMapIntensity={0.8}
          />
        </mesh>

        {/* Artifact highlight */}
        <mesh position={[0, 0.05, 0.35]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshPhysicalMaterial
            color={artwork.accentColor || '#ffd700'}
            metalness={0.8}
            roughness={0.2}
            emissive={artwork.accentColor || '#ffd700'}
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Spotlight focused on artwork */}
      <spotLight
        position={[position[0] + 1.5, position[1] + 2.5, position[2] + 1]}
        angle={0.25}
        penumbra={0.8}
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Secondary warm accent light */}
      <pointLight
        position={[position[0] - 0.8, position[1] + 1.5, position[2] - 0.8]}
        intensity={0.6}
        color="#ffe4b5"
        distance={5}
      />

      {/* Artwork Title and Info - Floating Label */}
      <Html
        position={[0, -2.0, 0]}
        distanceFactor={1.5}
        style={{
          transform: 'translate(-50%, 0)',
          pointerEvents: 'none',
          textAlign: 'center'
        }}
      >
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
            {artwork.culture}
          </p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {artwork.title}
          </p>
        </div>
      </Html>
    </group>
  );
}

// Enhanced Floating Pedestal Component
function FloatingPedestal({ position, artwork, onClick }: FloatingPedestalProps) {
  const [hovered, setHovered] = useState(false);
  const pedestalRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (pedestalRef.current) {
      pedestalRef.current.position.y = position[1] + Math.sin(clock.elapsedTime) * 0.08;
    }
  });

  return (
    <group ref={pedestalRef} position={position}>
      {/* Elegant Stone Pedestal Base */}
      <mesh position={[0, -0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.1, 0.3, 32]} />
        <meshPhysicalMaterial
          color="#e8e8e8"
          metalness={0.08}
          roughness={0.25}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Pedestal Column */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.45, 0.6, 24]} />
        <meshPhysicalMaterial
          color="#f0f0f0"
          metalness={0.05}
          roughness={0.3}
        />
      </mesh>

      {/* Top Display Platform */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.1, 24]} />
        <meshPhysicalMaterial
          color="#e0e0e0"
          metalness={0.1}
          roughness={0.2}
          clearcoat={0.7}
        />
      </mesh>

      {/* Artifact on Pedestal - Premium Display */}
      <mesh
        position={[0, 0.4, 0]}
        onClick={() => onClick(artwork)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
        castShadow
        receiveShadow
      >
        <icosahedronGeometry args={[0.35, 4]} />
        <meshPhysicalMaterial
          color={artwork.color}
          metalness={0.6}
          roughness={0.2}
          envMapIntensity={1}
          clearcoat={0.5}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Glowing Core Detail */}
      <mesh position={[0, 0.4, 0]} scale={0.5}>
        <octahedronGeometry args={[0.2, 1]} />
        <meshPhysicalMaterial
          color={artwork.accentColor || '#fffacd'}
          metalness={0.9}
          roughness={0.1}
          emissive={artwork.accentColor || '#fffacd'}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Primary Spotlight */}
      <spotLight
        position={[position[0] + 2, position[1] + 2.5, position[2] + 1.5]}
        angle={0.35}
        penumbra={0.7}
        intensity={1.6}
        color="#fefce8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Accent Light */}
      <pointLight
        position={[position[0] - 1.2, position[1] + 1.2, position[2] - 1]}
        intensity={0.7}
        color="#e0e0ff"
        distance={6}
      />

      {/* Info Label */}
      <Html
        position={[0, -1.3, 0]}
        distanceFactor={1.3}
        style={{
          transform: 'translate(-50%, 0)',
          pointerEvents: 'none',
          textAlign: 'center'
        }}
      >
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-600 tracking-widest uppercase">
            {artwork.culture}
          </p>
          <p className="text-sm font-bold text-gray-900 mt-1">
            {artwork.title}
          </p>
        </div>
      </Html>
    </group>
  );
}

// Enhanced Museum Environment and Lighting
function MuseumScene({ selectedArtwork, onArtworkClick }: MuseumSceneProps) {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  // Comprehensive artworks collection
  const artworks: Artwork[] = [
    {
      id: 1,
      title: "Masque Akan Royal",
      culture: "Akan, Ghana",
      description: "Masque cérémoniel utilisé lors des rites royaux, symbolisant le pouvoir spirituel et l'autorité ancestrale. Sculptée à partir de bois dur, cette pièce représente la connexion entre le monde des vivants et celui des esprits.",
      color: "#8b4513",
      accentColor: "#cd853f",
      type: "globe" as const,
      position: [-6, 0, -4] as [number, number, number],
      year: "XVeme siècle",
      materials: "Bois, pigments naturels"
    },
    {
      id: 2,
      title: "Vase Ming Dynasty",
      culture: "Chine Impériale",
      description: "Porcelaine bleue et blanche de qualité exceptionnelle, représentant l'harmonie cosmique. Les motifs racontent l'histoire des empereurs et de la nature.",
      color: "#e8f4f8",
      accentColor: "#4169e1",
      type: "pedestal" as const,
      position: [0, 0, -6] as [number, number, number],
      year: "1450-1470",
      materials: "Porcelaine, glaçure bleue"
    },
    {
      id: 3,
      title: "Totem Haida Majestic",
      culture: "Haida, Colombie-Britannique",
      description: "Sculpture totémique représentant les esprits gardiens et l'histoire ancestrale. Chaque animal symbolise des qualités spirituelles protectrices pour la communauté.",
      color: "#654321",
      accentColor: "#daa520",
      type: "globe" as const,
      position: [6, 0, -4] as [number, number, number],
      year: "1880-1920",
      materials: "Bois de cèdre"
    },
    {
      id: 4,
      title: "Masque Dogon Sacré",
      culture: "Dogon, Mali",
      description: "Masque rituel utilisé dans les cérémonies de passage et les rites funéraires. Représente la transition entre les mondes et guide les esprits des défunts.",
      color: "#daa520",
      accentColor: "#ffd700",
      type: "pedestal",
      position: [-3, 0, 4],
      year: "1920-1960",
      materials: "Bois de teck"
    },
    {
      id: 5,
      title: "Couronne Edo Royal",
      culture: "Edo, Bénin",
      description: "Couronne ornementale en ivoire et corail, symbolisant le pouvoir royal et la richesse du royaume du Bénin. Témoignage du raffinement artistique précolonial africain.",
      color: "#fffacd",
      accentColor: "#ffd700",
      type: "globe",
      position: [3, 0, 4],
      year: "1800-1890",
      materials: "Ivoire, corail, or"
    },
    {
      id: 6,
      title: "Calice Inca Ceremonial",
      culture: "Inca, Pérou",
      description: "Calice cérémoniel utilisé lors des rituels religieux. Chaque détail gravé raconte une histoire cosmique du peuple inca.",
      color: "#b8860b",
      accentColor: "#ffd700",
      type: "pedestal",
      position: [0, 0, 6],
      year: "1400-1540",
      materials: "Or, argent"
    }
  ];

  return (
    <>
      {/* Floor - High Definition Glossy Ceramic */}
      <Plane
        args={[28, 28]}
        position={[0, -1.95, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.15}
          roughness={0.08}
          clearcoat={0.95}
          clearcoatRoughness={0.05}
          envMapIntensity={1.3}
          toneMapped={true}
        />
      </Plane>

      {/* Back Wall - Minimalist White */}
      <Plane
        args={[28, 10]}
        position={[0, 2.5, -14]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#fafafa"
          metalness={0}
          roughness={0.4}
          envMapIntensity={0.8}
        />
      </Plane>

      {/* Left Wall */}
      <Plane
        args={[28, 10]}
        position={[-14, 2.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#fafafa"
          metalness={0}
          roughness={0.4}
          envMapIntensity={0.8}
        />
      </Plane>

      {/* Right Wall */}
      <Plane
        args={[28, 10]}
        position={[14, 2.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#fafafa"
          metalness={0}
          roughness={0.4}
          envMapIntensity={0.8}
        />
      </Plane>

      {/* Ceiling - Soft Ambient Reflect */}
      <Plane
        args={[28, 28]}
        position={[0, 7, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#f5f5f5"
          metalness={0}
          roughness={0.5}
          emissive="#ffffff"
          emissiveIntensity={0.1}
        />
      </Plane>

      {/* ===== ADVANCED LIGHTING SETUP ===== */}

      {/* Soft Global Illumination */}
      <ambientLight intensity={0.35} color="#ffffff" />

      {/* Primary Directional Light - Warm */}
      <directionalLight
        ref={lightRef}
        position={[8, 8, 5]}
        intensity={0.85}
        color="#fef3c7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={40}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      {/* Secondary Directional Light - Cool Balance */}
      <directionalLight
        position={[-6, 6, -4]}
        intensity={0.45}
        color="#e0e8ff"
        castShadow
      />

      {/* Fill Light for Depth */}
      <pointLight
        position={[0, 4, 8]}
        intensity={0.6}
        color="#ffffff"
        distance={30}
      />

      {/* Rim Light Enhancement */}
      <pointLight
        position={[10, 5, -10]}
        intensity={0.4}
        color="#f0e8d8"
        distance={20}
      />

      {/* Contact Shadows for Ground Realism */}
      <ContactShadows
        position={[0, -1.94, 0]}
        opacity={0.3}
        scale={24}
        blur={3}
        far={8}
        resolution={512}
      />

      {/* ===== ARTWORK PLACEMENT ===== */}
      {artworks.map((artwork) => (
        artwork.type === 'globe' ? (
          <ArtGlobe
            key={artwork.id}
            position={artwork.position}
            artwork={artwork}
            onClick={onArtworkClick}
          />
        ) : (
          <FloatingPedestal
            key={artwork.id}
            position={artwork.position}
            artwork={artwork}
            onClick={onArtworkClick}
          />
        )
      ))}
    </>
  );
}

// Premium Side Panel UI
function MuseumUI({ selectedArtwork, onClose, comments, onAddComment }: MuseumUIProps) {
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(selectedArtwork?.id || 0);
  const [liked, setLiked] = useState(false);

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  return (
    <AnimatePresence>
      {selectedArtwork && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: "spring", damping: 28, stiffness: 250 }}
          className="fixed right-0 top-0 h-full w-96 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl border-l border-gray-200/40 shadow-2xl z-50 overflow-hidden"
        >
          <div className="p-6 h-full flex flex-col">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Art History</h2>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Cultural Heritage</p>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-200/50 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Artwork Information */}
            <div className="mb-8 pb-6 border-b border-gray-200/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedArtwork.title}
              </h3>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
                {selectedArtwork.culture}
              </p>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Era</p>
                  <p className="text-gray-800">{selectedArtwork.year}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Materials</p>
                  <p className="text-gray-800">{selectedArtwork.materials}</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-200/30">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {selectedArtwork.description}
                </p>
              </div>
            </div>

            {/* Engagement Section */}
            <div className="mb-6">
              <motion.button
                onClick={handleLike}
                disabled={liked}
                whileHover={{ scale: liked ? 1 : 1.05 }}
                whileTap={{ scale: liked ? 1 : 0.95 }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  liked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100'
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-transform ${liked ? 'scale-110' : ''}`}
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{liked ? 'Liked' : 'Like This Artwork'} ({likes})</span>
              </motion.button>
            </div>

            {/* Comments Section */}
            <div className="flex-1 flex flex-col">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Comments ({comments.length})</h4>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-1">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No comments yet. Be the first to share!</p>
                  </div>
                ) : (
                  comments.map((comment: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg p-3 border border-gray-200/30 hover:border-gray-300/50 transition-colors"
                    >
                      <p className="text-sm text-gray-800 leading-relaxed">{comment}</p>
                      <p className="text-xs text-gray-400 mt-2">Just now</p>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="border-t border-gray-200/50 pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    maxLength={200}
                    className="flex-1 px-4 py-2 border border-gray-300/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm text-gray-900 placeholder:text-gray-500"
                  />
                  <motion.button
                    type="submit"
                    disabled={!newComment.trim()}
                    whileHover={{ scale: newComment.trim() ? 1.05 : 1 }}
                    whileTap={{ scale: newComment.trim() ? 0.95 : 1 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Post
                  </motion.button>
                </div>
                <p className="text-xs text-gray-400 mt-2">{newComment.length}/200</p>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface VirtualMuseumProps {
  onLoadingComplete?: () => void;
}

// Main Virtual Museum Component
export default function VirtualMuseum({ onLoadingComplete }: VirtualMuseumProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [comments, setComments] = useState<string[]>([]);

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    // Initialize comments for artwork
    setComments([
      "Absolutely breathtaking craftsmanship and cultural significance.",
      "This piece truly captures the spiritual essence of its culture.",
      "The attention to detail is remarkable - a masterpiece of heritage."
    ]);
  };

  const handleClosePanel = () => {
    setSelectedArtwork(null);
  };

  const handleAddComment = (comment: string) => {
    setComments(prev => [...prev, comment]);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Main Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 2.5, 10], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMappingExposure: 1.2,
          outputColorSpace: 'srgb'
        }}
        dpr={[1, 2]}
        onCreated={() => {
          onLoadingComplete?.();
        }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2.5, 10]} fov={50} />
          <MuseumScene
            selectedArtwork={selectedArtwork}
            onArtworkClick={handleArtworkClick}
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={4}
            maxDistance={18}
            maxPolarAngle={Math.PI * 0.65}
            minPolarAngle={Math.PI * 0.25}
            autoRotate={!selectedArtwork}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <MuseumUI
        selectedArtwork={selectedArtwork}
        onClose={handleClosePanel}
        comments={comments}
        onAddComment={handleAddComment}
      />

      {/* Instructions Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-xl border border-gray-200/50 max-w-sm"
      >
        <p className="text-sm font-medium text-gray-800 mb-2">🎨 Sacred Gallery Guide</p>
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="block">🖱️ Click & drag to explore • 🔍 Scroll to zoom</span>
          <span className="block mt-1">✨ Click any artwork to learn more & engage</span>
        </p>
      </motion.div>

      {/* Back Button */}
      <motion.button
        onClick={() => window.history.back()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-6 px-6 py-2 bg-white/80 backdrop-blur-md rounded-lg font-medium text-gray-900 hover:bg-white shadow-lg border border-gray-200/50 transition-all"
      >
        ← Back to Foundation
      </motion.button>

      {/* Gallery Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-6 right-6 text-right"
      >
        <h1 className="text-3xl font-bold text-gray-900">Sacred Gallery</h1>
        <p className="text-sm text-gray-600 mt-1">Cultural Heritage in 3D</p>
      </motion.div>
    </div>
  );
}