// src/app/models/product.model.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  discount?: number;
  category: string;
  categoryId: number; // Added for filtering
  brand: string; // Added for filtering
  images: string[]; // Enhanced: multiple images instead of single imageUrl
  rating: number; // Made required instead of optional
  reviewCount: number; // Enhanced: renamed from 'reviews' and made more specific
  inStock: boolean; // Made required instead of optional
  stockQuantity: number; // Added for inventory tracking
  features: string[]; // Added for key features list
  specifications: { [key: string]: string }; // Made required instead of optional
  tags: string[]; // Added for search functionality
  isNew?: boolean; // Added for "New" badge
  isFeatured?: boolean; // Added for "Featured" badge
  isBestSeller?: boolean; // Added for "Best Seller" badge
  
  // Legacy support - keeping your original fields
  icon?: string; // Kept for backward compatibility
  imageUrl?: string; // Kept for backward compatibility
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
  parentId?: number; // Added for nested categories
  children?: Category[]; // Added for nested categories
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

// NEW INTERFACES FOR ENHANCED FUNCTIONALITY

export interface ProductFilter {
  categories: number[];
  priceRange: {
    min: number;
    max: number;
  };
  brands: string[];
  rating: number;
  inStock: boolean;
}

export interface ProductSearchParams {
  query?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}