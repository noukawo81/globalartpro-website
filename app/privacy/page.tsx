'use client';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">Politique de Confidentialité</h1>
        <p className="text-base leading-8 text-slate-700 mb-8">
          Chez GlobalArtPro, nous attachons une importance particulière à la protection des données personnelles de nos utilisateurs. Cette politique explique les informations que nous collectons, pourquoi nous les utilisons et comment nous les sécurisons.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Collecte et utilisation des données</h2>
          <p className="text-slate-700 leading-8 mb-4">
            Nous collectons uniquement les informations nécessaires pour fournir nos services d'art numérique et de communauté. Cela inclut les données d'inscription, le profil utilisateur, les préférences, ainsi que les informations de transaction liées aux achats et récompenses.
          </p>
          <p className="text-slate-700 leading-8">
            Les données sont utilisées pour :
          </p>
          <ul className="list-disc list-inside mt-3 text-slate-700 leading-8 space-y-2">
            <li>gérer les comptes utilisateurs,</li>
            <li>authentifier les connexions via le SDK Pi Network,</li>
            <li>assurer le bon fonctionnement des récompenses ARTC,</li>
            <li>envoyer des notifications liées aux activités et collectes artistiques.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Pi Network et authentification</h2>
          <p className="text-slate-700 leading-8 mb-4">
            GlobalArtPro utilise le SDK Pi Network pour l'authentification sécurisée des utilisateurs. Lorsque vous vous connectez via Pi, votre identité est vérifiée par le réseau Pi sans que nous ayons accès à votre mot de passe.
          </p>
          <p className="text-slate-700 leading-8">
            L'utilisation du SDK Pi Network permet de garantir que les paiements et l'accès aux fonctionnalités exclusives sont effectués depuis un environnement sécurisé et conforme aux attentes des utilisateurs de blockchain.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Système de récompense ARTC</h2>
          <p className="text-slate-700 leading-8 mb-4">
            Le système de récompense ARTC de GlobalArtPro est conçu pour valoriser la participation et l'engagement. Les gains ARTC sont attribués selon des règles transparentes et basées sur les actions de la plateforme.
          </p>
          <p className="text-slate-700 leading-8">
            Les informations de solde ARTC et les transactions associées sont stockées de manière sécurisée, afin de garantir la traçabilité et la confiance au sein de l'écosystème GlobalArtPro.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Sécurité et conservation</h2>
          <p className="text-slate-700 leading-8 mb-4">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger les informations contre la perte, l'altération ou l'accès non autorisé.
          </p>
          <p className="text-slate-700 leading-8">
            Les données personnelles sont conservées aussi longtemps que nécessaire pour fournir les services, respecter les obligations légales et protéger nos droits.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Modifications de la politique</h2>
          <p className="text-slate-700 leading-8">
            Nous pouvons modifier cette politique de confidentialité pour l'adapter à l'évolution de nos services ou des réglementations. Les utilisateurs seront informés de toute mise à jour importante via la plateforme.
          </p>
        </section>
      </div>
    </main>
  );
}
