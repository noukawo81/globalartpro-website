import Link from 'next/link';
import { mockNFTs } from '@/lib/mockNFTs';
import { ArtistProfileContent, ArtistNotFound } from './ArtistProfile';

interface ArtistProfile {
  id: string;
  name: string;
  verified: boolean;
  followers: number;
  artworks: typeof mockNFTs;
  description: string;
  country: string;
  culture: string;
}

// Générer les paramètres statiques
export async function generateStaticParams() {
  const artists = [...new Set(mockNFTs.map((nft) => nft.creator))];
  return artists.map((artist) => ({
    id: encodeURIComponent(artist),
  }));
}

export default function ArtistProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const artistName = decodeURIComponent(params.id);
  
  // Récupérer tous les NFTs de cet artiste
  const artistArtworks = mockNFTs.filter(
    (nft) => nft.creator.toLowerCase() === artistName.toLowerCase()
  );

  if (artistArtworks.length === 0) {
    return <ArtistNotFound artistName={artistName} />;
  }

  const artist: ArtistProfile = {
    id: artistName,
    name: artistName,
    verified: Math.random() > 0.5, // Mock
    followers: Math.floor(Math.random() * 5000) + 100,
    artworks: artistArtworks,
    description: `Artiste créatif spécialisé dans la création d'œuvres numériques uniques et célébrant les cultures du monde.`,
    country: 'Monde',
    culture: 'Mondial',
  };

  return <ArtistProfileContent artist={artist} />;
}
