'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const Sparkles = ({ className = '' }: { className?: string }) => <span className={className}>✨</span>
const Palette = ({ className = '' }: { className?: string }) => <span className={className}>🎨</span>
const Wand2 = ({ className = '' }: { className?: string }) => <span className={className}>🪄</span>
const Download = ({ className = '' }: { className?: string }) => <span className={className}>⬇️</span>
const Share2 = ({ className = '' }: { className?: string }) => <span className={className}>📤</span>
const Zap = ({ className = '' }: { className?: string }) => <span className={className}>⚡</span>
const Heart = ({ className = '' }: { className?: string }) => <span className={className}>❤️</span>
const Star = ({ className = '' }: { className?: string }) => <span className={className}>⭐</span>
const Settings = ({ className = '' }: { className?: string }) => <span className={className}>⚙️</span>
const Layers = ({ className = '' }: { className?: string }) => <span className={className}>🗂️</span>
const ImageIcon = ({ className = '' }: { className?: string }) => <span className={className}>🖼️</span>
const Video = ({ className = '' }: { className?: string }) => <span className={className}>🎬</span>
const Music = ({ className = '' }: { className?: string }) => <span className={className}>🎵</span>
const Code = ({ className = '' }: { className?: string }) => <span className={className}>💻</span>
const Users = ({ className = '' }: { className?: string }) => <span className={className}>👥</span>
const Trophy = ({ className = '' }: { className?: string }) => <span className={className}>🏆</span>
const Clock = ({ className = '' }: { className?: string }) => <span className={className}>⏱️</span>
const TrendingUp = ({ className = '' }: { className?: string }) => <span className={className}>📈</span>

const AI_MODELS = [
  { id: 'dalle3', name: 'DALL·E 3', desc: 'Haute qualité, créativité maximale' },
  { id: 'midjourney', name: 'Midjourney', desc: 'Style artistique unique' },
  { id: 'stable', name: 'Stable Diffusion', desc: 'Open-source, personnalisable' },
  { id: 'firefly', name: 'Adobe Firefly', desc: 'Créativité commerciale' },
]

const ART_STYLES = [
  { id: 'realistic', name: 'Réaliste', color: 'bg-blue-500' },
  { id: 'abstract', name: 'Abstrait', color: 'bg-purple-500' },
  { id: 'surreal', name: 'Surréaliste', color: 'bg-pink-500' },
  { id: 'minimalist', name: 'Minimaliste', color: 'bg-green-500' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-cyan-500' },
  { id: 'vintage', name: 'Vintage', color: 'bg-yellow-500' },
]

const TOOLS = [
  { id: 'generate', name: 'Générer Art IA', icon: Sparkles, desc: 'Créez des œuvres uniques avec l\'IA' },
  { id: 'edit', name: 'Éditer Image', icon: Palette, desc: 'Modifiez et améliorez vos créations' },
  { id: 'text', name: 'Art Textuel', icon: Wand2, desc: 'Transformez vos idées en visuels' },
  { id: 'video', name: 'Génération Vidéo', icon: Video, desc: 'Animez vos créations' },
  { id: 'music', name: 'Composition Audio', icon: Music, desc: 'Générez des bandes sonores' },
  { id: 'code', name: 'Art Génératif', icon: Code, desc: 'Créez avec du code IA' },
]

const EXAMPLES = [
  { src: 'https://via.placeholder.com/400x400/6366f1/ffffff?text=Art+IA+1', title: 'Abstraction Cosmique', style: 'abstract', likes: 1247 },
  { src: 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Art+IA+2', title: 'Portrait Futuriste', style: 'cyberpunk', likes: 892 },
  { src: 'https://via.placeholder.com/400x400/ec4899/ffffff?text=Art+IA+3', title: 'Paysage Onirique', style: 'surreal', likes: 2156 },
  { src: 'https://via.placeholder.com/400x400/10b981/ffffff?text=Art+IA+4', title: 'Nature Minimaliste', style: 'minimalist', likes: 743 },
  { src: 'https://via.placeholder.com/400x400/06b6d4/ffffff?text=Art+IA+5', title: 'Ville Néon', style: 'cyberpunk', likes: 1893 },
  { src: 'https://via.placeholder.com/400x400/f59e0b/ffffff?text=Art+IA+6', title: 'Portrait Vintage', style: 'vintage', likes: 567 },
]

export default function GapStudioPage() {
  const [activeTool, setActiveTool] = useState('generate')
  const [selectedModel, setSelectedModel] = useState('dalle3')
  const [selectedStyle, setSelectedStyle] = useState('realistic')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationHistory, setGenerationHistory] = useState<string[]>([])
  const [notification, setNotification] = useState('')
  const [userStats, setUserStats] = useState({ creations: 42, likes: 1289, rewards: 156 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Simulate loading user stats
    const timer = setTimeout(() => {
      setUserStats({ creations: 42, likes: 1289, rewards: 156 })
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    // Enhanced simulation with model and style
    setTimeout(() => {
      const colorMap = {
        realistic: '6366f1',
        abstract: '8b5cf6',
        surreal: 'ec4899',
        minimalist: '10b981',
        cyberpunk: '06b6d4',
        vintage: 'f59e0b'
      }
      const newImage = `https://via.placeholder.com/512x512/${colorMap[selectedStyle as keyof typeof colorMap]}/ffffff?text=${encodeURIComponent(prompt.slice(0, 20))}+${selectedModel}`
      setGeneratedImage(newImage)
      setGenerationHistory(prev => [newImage, ...prev.slice(0, 4)])
      setIsGenerating(false)
      showNotification(`Art généré avec ${AI_MODELS.find(m => m.id === selectedModel)?.name} ! 🎨`)
    }, 3000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setGeneratedImage(reader.result as string)
        showNotification('Image chargée. Prêt à créer ! ✨')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `gap-artwork-${Date.now()}.png`
    link.click()
    showNotification('Téléchargement lancé ! 📥')
  }

  const handleShare = async () => {
    if (!generatedImage) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon Art IA - GAP Studio',
          text: 'Découvrez cette œuvre créée avec GAP Studio IA de GlobalArtpro',
          url: window.location.href,
        })
        showNotification('Partagé avec succès ! 📤')
      } catch (err) {
        navigator.clipboard.writeText(window.location.href)
        showNotification('Lien copié ! 📋')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      showNotification('Lien copié ! 📋')
    }
  }

  const handleNFTize = () => {
    if (!generatedImage) return
    localStorage.setItem('pendingArtwork', JSON.stringify({
      image: generatedImage,
      prompt: prompt,
      model: selectedModel,
      style: selectedStyle,
      timestamp: Date.now(),
    }))
    window.location.href = '/explorer'
    showNotification('Redirection vers le marketplace NFT... 🏷️')
  }

  const handleStartCreating = () => {
    setActiveTool('generate')
    setPrompt('')
    setGeneratedImage(null)
    showNotification('Prêt à créer ? Décrivez votre vision ! 🚀')
  }

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 4000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Enhanced Background Animation */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-6 right-6 z-50 p-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 backdrop-blur-sm border border-purple-400/50 text-white text-center shadow-2xl"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-10 border-b border-purple-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-purple-300 hover:text-purple-200 transition flex items-center gap-2">
            <motion.div whileHover={{ x: -5 }} className="text-lg">←</motion.div>
            Retour à l'accueil
          </Link>
          <div className="flex items-center gap-6">
            {/* User Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-blue-300">
                <ImageIcon className="w-4 h-4" />
                <span>{userStats.creations}</span>
              </div>
              <div className="flex items-center gap-1 text-pink-300">
                <Heart className="w-4 h-4" />
                <span>{userStats.likes}</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-300">
                <Trophy className="w-4 h-4" />
                <span>{userStats.rewards}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-300">
              <Star className="w-4 h-4" />
              <span>Studio IA Exceptionnel</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6"
          >
            GAP Studio IA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed"
          >
            Le studio créatif ultime où l'intelligence artificielle rencontre l'art humain.
            Créez, innovez et monétisez vos œuvres avec une facilité déconcertante.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full border border-purple-400/30">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium">IA Avancée</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-400/30">
              <Palette className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">Créativité Illimitée</span>
            </div>
            <div className="flex items-center gap-2 bg-pink-500/20 px-4 py-2 rounded-full border border-pink-400/30">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-medium">Art Accessible</span>
            </div>
            <div className="flex items-center gap-2 bg-cyan-500/20 px-4 py-2 rounded-full border border-cyan-400/30">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium">Monétisation</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center mb-12 text-slate-100"
          >
            Outils de Création Révolutionnaires
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {TOOLS.map((tool, index) => (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTool(tool.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                  activeTool === tool.id
                    ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                    : 'border-slate-600/50 bg-slate-800/50 hover:border-purple-400/50 hover:bg-purple-500/10'
                }`}
              >
                <tool.icon className={`w-8 h-8 mb-4 transition-colors ${
                  activeTool === tool.id ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'
                }`} />
                <h3 className="text-lg font-semibold mb-2 text-slate-100">{tool.name}</h3>
                <p className="text-sm text-slate-400">{tool.desc}</p>
              </motion.button>
            ))}
          </div>

          {/* Advanced Creation Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-600/50 p-8"
          >
            {activeTool === 'generate' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-100">Générez votre Art IA</h3>

                {/* AI Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Modèle IA</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {AI_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedModel === model.id
                            ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                            : 'border-slate-600 text-slate-400 hover:border-purple-400/50'
                        }`}
                      >
                        <div className="font-medium text-sm">{model.name}</div>
                        <div className="text-xs opacity-75">{model.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Art Style Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Style Artistique</label>
                  <div className="flex flex-wrap gap-3">
                    {ART_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                          selectedStyle === style.id
                            ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                            : 'border-slate-600 text-slate-400 hover:border-purple-400/50'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${style.color}`} />
                        <span className="text-sm">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Inputs */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Prompt Positif</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Décrivez votre vision artistique..."
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none resize-none"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Prompt Négatif (optionnel)</label>
                    <textarea
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="Éléments à éviter..."
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed rounded-xl font-bold transition flex items-center justify-center gap-3 text-lg shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Générer l'Art IA
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {activeTool === 'edit' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-100">Éditez votre Image</h3>
                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition inline-flex items-center gap-2"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Choisir une image
                  </motion.button>
                  <p className="text-slate-400 mt-2">ou glissez-déposez votre fichier ici</p>
                </div>
              </div>
            )}

            {/* Other tools placeholder */}
            {(activeTool === 'text' || activeTool === 'video' || activeTool === 'music' || activeTool === 'code') && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">Fonctionnalité en Développement</h3>
                <p className="text-slate-400">Cette fonctionnalité révolutionnaire arrive bientôt !</p>
              </div>
            )}

            {/* Preview */}
            <AnimatePresence>
              {generatedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-8 space-y-4"
                >
                  <h4 className="text-xl font-semibold text-slate-100">Votre Création</h4>
                  <div className="bg-slate-700/50 rounded-xl p-4 max-w-md mx-auto">
                    <img src={generatedImage} alt="Generated Art" className="w-full rounded-lg shadow-lg" />
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Partager
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNFTize}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      NFT-iser
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generation History */}
            {generationHistory.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-slate-100 mb-4">Historique des Générations</h4>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {generationHistory.map((img, index) => (
                    <motion.img
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      src={img}
                      alt={`Generation ${index + 1}`}
                      className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:scale-105 transition"
                      onClick={() => setGeneratedImage(img)}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Examples Gallery */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center mb-12 text-slate-100"
          >
            Galerie d'Inspiration IA
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXAMPLES.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-600/50 hover:border-purple-400/50 transition-all duration-300">
                  <img
                    src={example.src}
                    alt={example.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{example.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="text-sm">{example.likes}</span>
                      </div>
                      <div className="text-xs bg-purple-500/50 px-2 py-1 rounded-full capitalize">
                        {example.style}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                    >
                      <Heart className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-3xl border border-purple-400/30 p-8"
          >
            <h2 className="text-3xl font-bold mb-4 text-slate-100">Prêt à Révolutionner l'Art ?</h2>
            <p className="text-slate-300 mb-6">
              Rejoignez des milliers d'artistes qui utilisent GAP Studio IA pour créer des œuvres extraordinaires.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTool('generate')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-bold transition shadow-lg"
              >
                Commencer à Créer
              </motion.button>
              <Link href="/foundation">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition"
                >
                  En Savoir Plus
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}