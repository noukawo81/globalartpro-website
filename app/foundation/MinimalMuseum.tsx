'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function MinimalMuseumScene() {
  return (
    <>
      {/* Caméra */}
      <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={60} />

      {/* Contrôles orbitaux */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />

      {/* Background color and lights instead of remote HDR environment */}
      <color attach="background" args={["#f8f8f8"]} />

      {/* Sol réfléchissant */}
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4.5}
      />

      {/* Sol blanc réfléchissant */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Murs minimalistes blancs */}
      {/* Mur arrière */}
      <mesh position={[0, 2.5, -5]}>
        <boxGeometry args={[20, 5, 0.1]} />
        <meshStandardMaterial
          color="#f8f8f8"
          metalness={0.0}
          roughness={0.2}
        />
      </mesh>

      {/* Murs latéraux */}
      <mesh position={[-5, 2.5, 0]}>
        <boxGeometry args={[0.1, 5, 20]} />
        <meshStandardMaterial
          color="#f8f8f8"
          metalness={0.0}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[5, 2.5, 0]}>
        <boxGeometry args={[0.1, 5, 20]} />
        <meshStandardMaterial
          color="#f8f8f8"
          metalness={0.0}
          roughness={0.2}
        />
      </mesh>

      {/* Éclairage subtil */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Quelques éléments minimalistes */}
      {/* Piédestal central */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1, 16]} />
        <meshStandardMaterial
          color="#e8e8e8"
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>

      {/* Sphère sur le piédestal */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.0}
          transmission={0.9}
          thickness={0.1}
        />
      </mesh>
    </>
  );
}

export default function MinimalMuseum() {
  return (
    <div className="w-full h-screen bg-white">
      <Canvas shadows>
        <Suspense fallback={null}>
          <MinimalMuseumScene />
        </Suspense>
      </Canvas>
    </div>
  );
}