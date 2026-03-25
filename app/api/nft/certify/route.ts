import { NextResponse } from 'next/server';

interface CertifyRequest {
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'ARTC' | 'Pi';
  certified: boolean;
}

const generateId = () => `GAP-NFT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const generateHash = async (payload: string) => {
  const buffer = new TextEncoder().encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CertifyRequest;

    // Server-side validations
    if (!body.title || body.title.trim().length < 3) {
      return NextResponse.json({ error: 'Titre invalide.' }, { status: 400 });
    }
    if (!body.description || body.description.trim().length < 10) {
      return NextResponse.json({ error: 'Description invalide.' }, { status: 400 });
    }
    if (!body.category) {
      return NextResponse.json({ error: 'Catégorie manquante.' }, { status: 400 });
    }
    if (Number.isNaN(body.price) || body.price < 0) {
      return NextResponse.json({ error: 'Prix invalide.' }, { status: 400 });
    }

    const id = generateId();
    const issuedAt = new Date().toISOString();
    const source = `${id}|${body.title}|${body.category}|${body.price}|${issuedAt}`;
    const signature = await generateHash(source);

    const status = body.certified ? 'en attente' : 'non certifié';

    return NextResponse.json({ id, status, issuedAt, signature, kind: { certifié: body.certified }, message: 'Certification request enregistrée et vérifiée.' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur', detail: error }, { status: 500 });
  }
}
