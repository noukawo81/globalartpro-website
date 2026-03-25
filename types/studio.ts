export interface CreateNFTFormData {
  title: string;
  description: string;
  category: 'Art' | 'Culture' | 'Tradition' | 'Performance' | 'Digital' | 'Sculpture';
  price: string;
  priceType: 'ARTC' | 'Pi';
  certified: boolean;
  image: File | null;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
