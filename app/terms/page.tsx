'use client';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">Conditions Générales d'Utilisation</h1>
        <p className="text-base leading-8 text-slate-700 mb-8">
          Les présentes conditions définissent les règles d'utilisation de la plateforme GlobalArtPro. Elles s'appliquent à tous les utilisateurs, artistes, collectionneurs et participants du réseau.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Accès et inscription</h2>
          <p className="text-slate-700 leading-8 mb-4">
            L'accès à GlobalArtPro requiert un compte utilisateur valide. L'inscription peut se faire via l'authentification standard ou via le SDK Pi Network pour une connexion décentralisée.
          </p>
          <p className="text-slate-700 leading-8">
            En utilisant notre service, vous acceptez de fournir des informations exactes et de respecter les règles de comportement définies par la plateforme.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Utilisation du SDK Pi Network</h2>
          <p className="text-slate-700 leading-8 mb-4">
            GlobalArtPro intègre le SDK Pi Network pour l'authentification et la gestion des paiements en Pi. Cette intégration vise à offrir une expérience sécurisée et transparente pour les transactions blockchain.
          </p>
          <p className="text-slate-700 leading-8">
            L'URL de paiement doit correspondre à celle enregistrée dans le Pi Developer Portal. Toute divergence peut empêcher le bon fonctionnement du paiement et l'accès aux services premium.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Réseau de récompense ARTC</h2>
          <p className="text-slate-700 leading-8 mb-4">
            Le système ARTC récompense les contributions des utilisateurs, la création artistique et l'engagement communautaire. Les récompenses sont attribuées selon les règles internes de la plateforme.
          </p>
          <p className="text-slate-700 leading-8">
            Les points ARTC ne constituent pas une monnaie légale en dehors de GlobalArtPro et sont gérés conformément aux conditions internes de la plateforme.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Propriété intellectuelle</h2>
          <p className="text-slate-700 leading-8 mb-4">
            Tous les contenus publiés sur GlobalArtPro restent la propriété des auteurs respectifs. Les utilisateurs accordent à la plateforme une licence limitée pour afficher, distribuer et promouvoir ces œuvres.
          </p>
          <p className="text-slate-700 leading-8">
            Toute reproduction non autorisée ou utilisation abusive des contenus est strictement interdite.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Modifications des conditions</h2>
          <p className="text-slate-700 leading-8">
            GlobalArtPro se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés des changements importants et l'utilisation continue de la plateforme vaudra acceptation des nouvelles conditions.
          </p>
        </section>
      </div>
    </main>
  );
}
