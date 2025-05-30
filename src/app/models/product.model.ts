export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  discount?: number;
  icon: string;
  reviews: number;
  category: string;
  rating?: number;
  imageUrl?: string;
  inStock?: boolean;
  specifications?: { [key: string]: string };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
}

export interface Deal {
  id: number;
  product: Product;
  originalPrice: number;
  dealPrice: number;
  savings: number;
  endDate: Date;
  isActive: boolean;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  icon: string;
  price: number;
  originalPrice: number;
  savings: number;
  features: string[];
  products: Product[];
}