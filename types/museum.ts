export interface MuseumArtwork {
  id: string;
  title: string;
  artist: string;
  region: 'Afrique' | 'Asie' | 'Europe' | 'Amérique' | 'Océanie';
  culturalOrigin: string;
  image: string;
  description: string;
  year?: number;
  medium?: string;
}

export interface GallerySection {
  region: 'Afrique' | 'Asie' | 'Europe' | 'Amérique' | 'Océanie';
  title: string;
  description: string;
  icon: string;
  artworks: MuseumArtwork[];
  ambiance?: string;
}
