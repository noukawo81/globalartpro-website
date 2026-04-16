import TestnetBanner from '@/components/TestnetBanner';
import { config } from '@/lib/config';

export default function TestPiHelpPage() {
  return (
    <>
      <TestnetBanner />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Guide : Utiliser {config.currency.name}</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Pour les testeurs</h2>
            <ol className="list-decimal pl-5 space-y-3 text-gray-200">
              <li>Téléchargez l'application Pi officielle.</li>
              <li>Activez le mode développeur (Paramètres → Développeur).</li>
              <li>Accédez à l'onglet "Testnet".</li>
              <li>Cliquez sur "Get Test Pi" pour en obtenir gratuitement.</li>
              <li>Utilisez ces Test Pi sur GlobalArtPro.</li>
            </ol>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Pour les développeurs</h2>
            <ul className="space-y-3 text-gray-200">
              <li>✅ Test Pi est gratuit et idéal pour le développement.</li>
              <li>✅ Transactions en mode testnet sans valeur réelle.</li>
              <li>✅ Pas de KYC requis pour les tests.</li>
              <li>✅ Utilisez le SDK Pi en sandbox pour tester les paiements.</li>
              <li>⚠️ N'a aucune valeur réelle et ne peut pas être converti en Pi réel.</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-gray-900">
          <h3 className="text-xl font-bold mb-4">⚠️ Important</h3>
          <p>
            {config.currency.name} est utilisé <strong>uniquement pour les tests</strong>.
            Les transactions n'ont pas de valeur réelle et ne peuvent pas être converties en Pi réel.
          </p>
        </div>
      </div>
    </>
  );
}
