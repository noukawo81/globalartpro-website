import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
Tu es l'assistant officiel de GlobalArtPro.
Ta personnalité : Amical, professionnel, et passionné par l'art numérique et la blockchain Pi.

Tes missions :
1. Aider à l'inscription sur la plateforme.
2. Expliquer comment acheter une œuvre en Pi :
   - Rappeler systématiquement qu'il faut impérativement utiliser le "Pi Browser".
   - Expliquer que le paiement se fait via le Wallet Pi de manière sécurisée.
3. Garder le focus : Si l'utilisateur pose une question hors sujet (ex: cuisine, météo, politique), réponds poliment :
   "C'est une question intéressante, mais en tant qu'assistant GlobalArtPro, je suis ici pour vous accompagner dans l'univers de l'art numérique. Revenons à nos services..."
4. Promouvoir GlobalArtPro : Rappeler que nous mettons l'humanité d'abord à travers l'art.

Connaissance de GlobalArtPro :
- GlobalArtPro est une maison de production et fondation culturelle basée à Abidjan, Côte d'Ivoire.
- Nous sommes construits pour protéger le patrimoine africain et mondial via la numérisation, l'IA et la blockchain Pi.
- Services principaux : GapStudio IA, Musée virtuel 3D, Fondation humanitaire, certification NFT, marketplace et soutien aux artistes.
- Blockchains : Intégration native avec le SDK Pi Network.
- Le token interne est ARTC, utilisé comme récompense et crédit utilitaire sur la plateforme.
- La plateforme met l'humain au centre, avec un accent sur la culture, l'inclusion et la solidarité.

FAQ de GlobalArtPro :

1) Comment s'inscrire ?
- L'inscription se fait sur /register.
- Remplissez les informations demandées, puis vérifiez votre email.
- L'email de confirmation est obligatoire pour activer votre compte.
- L'inscription peut être standard ou via Pi Network si vous utilisez le Pi Browser.

2) Comment acheter une œuvre en Pi ?
- Sélectionnez une œuvre et passez par le checkout.
- Choisissez le paiement en Pi.
- Ouvrez le Pi Browser pour valider la transaction.
- Le paiement s'effectue via votre Wallet Pi de manière sécurisée.
- Après approbation, la transaction est complétée par le réseau Pi.

3) Pourquoi utiliser le Pi Browser ?
- Le paiement Pi dépend du SDK Pi, disponible uniquement dans Pi Browser.
- Le Pi Browser permet de signer et sécuriser les transactions en toute confiance.
- Sans Pi Browser, le paiement Pi ne fonctionnera pas correctement.

4) Qu'est-ce que l'ARTC ?
- ARTC est le token utilitaire interne de GlobalArtPro.
- Il permet de récompenser les membres, d'acheter des services internes et de soutenir la communauté.
- ARTC n'est pas une monnaie légale en dehors de GlobalArtPro.

5) Comment fonctionne la Fondation GlobalArtPro ?
- C'est une structure culturelle et sociale.
- Elle soutient des projets artistiques, éducatifs et humanitaires.
- Nous mettons l'humanité en premier à travers l'art numérique.

6) Qu'est-ce que la certification NFT GlobalArtPro ?
- La certification atteste l'authenticité et l'origine d'une œuvre numérique.
- Elle utilise une signature numérique et un horodatage sécurisé.

7) Comment fonctionne le programme de parrainage ?
- Vous pouvez inviter des amis via votre lien de parrainage.
- Le parrain et le filleul gagnent des ARTC selon les règles de la plateforme.
- Le parrainage renforce la communauté et les récompenses.

8) Quels sont les aspects de sécurité ?
- GlobalArtPro utilise la vérification par email.
- Le système comporte des protections contre la fraude et les comptes multiples.
- Les données sont protégées et les paiements sont supervisés par le SDK Pi.

9) Que faire si j'ai un problème ?
- Dirigez l'utilisateur vers le support via Pi Browser ou les réseaux sociaux de GlobalArtPro.
- Rassurez sur la sécurité et proposez d'expliquer le processus pas à pas.

Règles de réponse :
- Réponds toujours dans la langue utilisée par l'utilisateur.
- Si l'utilisateur écrit en français, anglais, espagnol ou dans une langue commune, réponds dans cette langue.
- Si la langue est rare ou non reconnue, réponds en anglais par défaut.
- Sois clair, court et utile.
- Rappelle toujours l'importance du Pi Browser pour les paiements Pi.
- Si la question est hors sujet, utilise la phrase de redirection fournie.
`;

const DEFAULT_OFF_TOPIC = "C'est une question intéressante, mais en tant qu'assistant GlobalArtPro, je suis ici pour vous accompagner dans l'univers de l'art numérique. Revenons à nos services...";

function sanitizeMessages(messages) {
  return messages
    .filter((msg) => msg && msg.role && msg.content)
    .map((msg) => ({ role: msg.role, content: String(msg.content) }));
}

function createFallbackAnswer(text) {
  const normalized = text.toLowerCase();

  const matches = {
    inscription: ['inscript', 'register', 's inscrire', 'compte', 'création de compte'],
    paiement: ['acheter', 'paiement', 'payer', 'checkout', 'paiements'],
    piBrowser: ['pi browser', 'browser', 'pi navigateur', 'navigateur'],
    artc: ['artc', 'token', 'récompense', 'récompenses', 'balance'],
    referral: ['parrain', 'referral', 'inviter', 'parrainage'],
    fondation: ['fondation', 'humanitaire', 'culture', 'patrimoine'],
    sécurité: ['sécurité', 'fraude', 'protection', 'compte'],
  };

  if (Object.values(matches).some((keywords) => keywords.some((keyword) => normalized.includes(keyword)))) {
    if (matches.inscription.some((keyword) => normalized.includes(keyword))) {
      return "Pour vous inscrire, allez sur /register, complétez le formulaire puis confirmez votre email. Si vous utilisez Pi, connectez-vous via Pi Browser pour profiter de l'authentification Pi Network.";
    }
    if (matches.paiement.some((keyword) => normalized.includes(keyword))) {
      return "Pour acheter une œuvre avec Pi, choisissez le paiement en Pi sur la page de checkout, ouvrez le Pi Browser et validez la transaction via votre wallet Pi. Le paiement est sécurisé par le SDK Pi et validé par le réseau Pi.";
    }
    if (matches.piBrowser.some((keyword) => normalized.includes(keyword))) {
      return "Le Pi Browser est obligatoire pour les paiements Pi. C'est le seul navigateur compatible avec le SDK Pi et le wallet Pi sur GlobalArtPro.";
    }
    if (matches.artc.some((keyword) => normalized.includes(keyword))) {
      return "ARTC est le token interne de GlobalArtPro. Il sert de récompense et de crédit utilitaire sur la plateforme. Ce n'est pas une monnaie légale externe.";
    }
    if (matches.referral.some((keyword) => normalized.includes(keyword))) {
      return "Le programme de parrainage permet de gagner des ARTC en invitant des amis. Le parrain et le filleul gagnent des récompenses lorsqu'ils utilisent le lien de parrainage.";
    }
    if (matches.fondation.some((keyword) => normalized.includes(keyword))) {
      return "GlobalArtPro est une fondation culturelle et artistique. Nous mettons l'humain en premier en protégeant le patrimoine et en soutenant des projets solidaires.";
    }
    if (matches.sécurité.some((keyword) => normalized.includes(keyword))) {
      return "GlobalArtPro accorde une grande importance à la sécurité : vérification email, surveillance anti-fraude et paiements supervisés par le SDK Pi.";
    }
  }

  return DEFAULT_OFF_TOPIC;
}

async function queryOpenAI(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.5,
      max_tokens: 700,
      top_p: 0.95,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content || null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const incomingMessages = Array.isArray(body.messages) ? sanitizeMessages(body.messages) : [];

    const userMessages = incomingMessages.filter((msg) => msg.role === 'user');
    const lastUserMessage = userMessages.length ? userMessages[userMessages.length - 1].content : '';

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...incomingMessages.filter((msg) => msg.role !== 'system'),
    ];

    let assistantReply;

    try {
      assistantReply = await queryOpenAI(messages);
    } catch (error) {
      console.warn('[chat] OpenAI unavailable, fallback to local rule-based response.', error.message);
      assistantReply = createFallbackAnswer(lastUserMessage || '');
    }

    if (!assistantReply) {
      assistantReply = createFallbackAnswer(lastUserMessage || '');
    }

    return NextResponse.json({ message: assistantReply }, { status: 200 });
  } catch (error) {
    console.error('[chat] Error processing request:', error);
    return NextResponse.json(
      { message: "Désolé, je n'ai pas réussi à traiter votre demande. Essayez de nouveau." },
      { status: 500 }
    );
  }
}
