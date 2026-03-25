'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import UploadZone from '@/components/studio/UploadZone';
import NFTForm from '@/components/studio/NFTForm';
import InfoSection from '@/components/studio/InfoSection';
import RewardNotification from '@/components/ui/RewardNotification';
import { calculateReward } from '@/lib/rewardEngine';
import { CreateNFTFormData } from '@/types/studio';

const initialFormData: CreateNFTFormData = {
  title: '',
  description: '',
  category: 'Art',
  price: '',
  priceType: 'ARTC',
  certified: false,
  image: null,
};

export default function CreatePage() {
  const [formData, setFormData] = useState<CreateNFTFormData>(initialFormData);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [certificationStatus, setCertificationStatus] = useState<'non certifié' | 'en attente' | 'validé' | 'refusé'>('non certifié');
  const [createdNFT, setCreatedNFT] = useState<{
    id: string;
    status: 'non certifié' | 'en attente' | 'validé' | 'refusé';
    issuedAt: string;
    issuer: string;
    signature: string;
  } | null>(null);
  const [rewardNotification, setRewardNotification] = useState<{
    amount: number;
    action: 'create-nft' | 'certify-nft';
  } | null>(null);

  const generateId = () => `GAP-NFT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const generateSignature = (payload: string) => btoa(payload).slice(0, 64);

  const handleImageSelect = useCallback((file: File) => {
    setFormData((prev) => ({ ...prev, image: file }));

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFormChange = useCallback(
    (data: Partial<CreateNFTFormData>) => {
      setFormData((prev) => ({ ...prev, ...data }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Step 2: Vérification automatique des champs
    const isValidForm =
      formData.title.trim().length > 3 &&
      formData.description.trim().length > 10 &&
      formData.category &&
      formData.price.trim().length > 0 &&
      !Number.isNaN(Number(formData.price)) &&
      Number(formData.price) >= 0 &&
      formData.image;

    if (!isValidForm) {
      setSuccessMessage('⚠️ Certains champs sont manquants ou invalides. Merci de vérifier.');
      setIsLoading(false);
      return;
    }

    const nftId = generateId();
    const timestamp = new Date().toISOString();
    const payload = `${nftId}|${formData.title}|${formData.category}|${formData.price}|${timestamp}`;
    const signature = generateSignature(payload);

    const initialStatus = formData.certified ? 'en attente' : 'non certifié';
    setCertificationStatus(initialStatus);
    setCreatedNFT({
      id: nftId,
      status: initialStatus,
      issuedAt: timestamp,
      issuer: 'GlobalArtpro-Engine',
      signature,
    });

    try {
      // Appel serveur simulation
      const response = await fetch('/api/nft/certify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: Number(formData.price),
          priceType: formData.priceType,
          certified: formData.certified,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setCertificationStatus('refusé');
        setSuccessMessage(`❌ Erreur de certification : ${errorData.error || 'Réessayez'}`);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setCreatedNFT((prev) => prev ? { ...prev, status: data.status } : prev);
      setCertificationStatus(data.status);

      // Simuler validation finale ou fail
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (data.status === 'en attente' && formData.certified) {
        const isIntegrityOk = !formData.title.toLowerCase().includes('spam') && formData.price !== '0';
        if (!isIntegrityOk) {
          setCertificationStatus('refusé');
          setCreatedNFT((prev) => prev ? { ...prev, status: 'refusé' } : prev);
          setSuccessMessage('❌ Certification refusée : vérification automatique échouée.');
          setIsLoading(false);
          return;
        }

        setCertificationStatus('validé');
        setCreatedNFT((prev) => prev ? { ...prev, status: 'validé' } : prev);
        setSuccessMessage('✨ Certification validée ! Votre NFT est désormais certifié GlobalArtpro.');

        // Récompense pour création certifiée
        const createReward = calculateReward({
          action: 'create-nft',
          isNFTCertified: true,
          userReputation: 0.8,
          dayGainsSoFar: 0,
        });
        setRewardNotification({ amount: createReward.amount, action: 'create-nft' });

        // Puis récompense pour certification
        setTimeout(() => {
          const certifyReward = calculateReward({
            action: 'certify-nft',
            isNFTCertified: true,
            userReputation: 0.8,
            dayGainsSoFar: createReward.amount,
          });
          setRewardNotification({ amount: certifyReward.amount, action: 'certify-nft' });
        }, 2000);
      } else if (data.status === 'non certifié') {
        setSuccessMessage('🎉 Votre NFT a été créé ! Ce NFT reste non certifié (2 créations gratuites/jour).');

        // Récompense pour création non certifiée (si applicable)
        if (formData.certified) {
          const createReward = calculateReward({
            action: 'create-nft',
            isNFTCertified: false,
            userReputation: 0.5,
            dayGainsSoFar: 0,
          });
          setRewardNotification({ amount: createReward.amount, action: 'create-nft' });
        }
      }

      // Reset form after 3 seconds for nouvelle création
      setTimeout(() => {
        setFormData(initialFormData);
        setPreviewUrl(null);
        setSuccessMessage(null);
        setCertificationStatus('non certifié');
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setSuccessMessage('❌ Une erreur est survenue. Réessayez.');
      setCertificationStatus('refusé');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Header */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative py-12 sm:py-16 border-b border-gray-800/50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 bg-clip-text text-transparent">
              GAP Studio
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Créez votre œuvre numérique
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl">
              Transformez votre art en NFT et entrez dans l'écosystème GlobalArtpro. 
              Une plateforme pensée pour les artistes, by artists.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-green-400/10 border border-green-500/30 text-green-200 text-center font-semibold"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left: Upload & Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Upload Zone */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Étape 1: Importez votre œuvre
                </h3>
                <UploadZone
                  onImageSelect={handleImageSelect}
                  previewUrl={previewUrl}
                  isLoading={isLoading}
                />
              </div>

              {/* Form */}
              {previewUrl && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">
                    Étape 2: Décrivez votre création
                  </h3>
                  <NFTForm
                    formData={formData}
                    onChange={handleFormChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </motion.div>

            {/* Right: Preview & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Preview Card */}
              {previewUrl && (
                <div className="sticky top-24 space-y-4">
                  <h3 className="text-lg font-bold text-white">Aperçu</h3>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-2xl overflow-hidden border border-yellow-500/30 bg-gradient-to-br from-gray-900 to-black p-4"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-950 mb-4">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 300px, 400px"
                      />
                    </div>

                    {/* Preview Info */}
                    <div className="space-y-3">
                      {formData.title && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Titre
                          </p>
                          <p className="text-white font-semibold">
                            {formData.title}
                          </p>
                        </div>
                      )}

                      {formData.category && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Catégorie
                          </p>
                          <p className="text-yellow-300 font-semibold">
                            {formData.category}
                          </p>
                        </div>
                      )}

                      {formData.price && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Prix
                          </p>
                          <p className="text-white font-bold text-lg">
                            {formData.price} {formData.priceType}
                          </p>
                        </div>
                      )}

                      {formData.certified !== undefined && (
                        <div className="pt-3 border-t border-gray-700/50">
                          <p className="text-xs text-gray-400 flex items-center gap-2">
                            {formData.certified ? (
                              <>
                                <span className="text-lg">✅</span>
                                NFT Certifié - Accès complet aux récompenses
                              </>
                            ) : (
                              <>
                                <span className="text-lg">🔓</span>
                                NFT Non Certifié - Test gratuit
                              </>
                            )}
                          </p>

                          {createdNFT && (
                            <div className="mt-3 text-xs text-gray-400 space-y-1">
                              <p>
                                <span className="font-semibold text-gray-300">ID :</span>{' '}
                                {createdNFT.id}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-300">Statut :</span>{' '}
                                <span className={`font-bold ${
                                  createdNFT.status === 'validé'
                                    ? 'text-green-400'
                                    : createdNFT.status === 'en attente'
                                    ? 'text-yellow-300'
                                    : 'text-red-400'
                                }`}>
                                  {createdNFT.status}
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold text-gray-300">Horodatage :</span>{' '}
                                {new Date(createdNFT.issuedAt).toLocaleString()}
                              </p>
                              <p className="truncate">
                                <span className="font-semibold text-gray-300">Signature :</span>{' '}
                                {createdNFT.signature}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Info Section */}
              {!previewUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Prêt à commencer ? 🚀
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">✓</span>
                        <span>Importez une image haute qualité (PNG, JPG, GIF)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">✓</span>
                        <span>Remplissez les informations de votre œuvre</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">✓</span>
                        <span>Choisissez si vous voulez une certification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-300 mt-1">✓</span>
                        <span>Créez et partagez avec le monde</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Info Section */}
          <InfoSection />
        </div>
      </section>

      {/* Reward Notification */}
      {rewardNotification && (
        <RewardNotification
          amount={rewardNotification.amount}
          action={rewardNotification.action}
          message={`Récompense pour ${rewardNotification.action === 'create-nft' ? 'création NFT' : 'certification'}`}
          onComplete={() => setRewardNotification(null)}
        />
      )}
    </main>
  );
}