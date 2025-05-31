// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Product, ProductResponse, ProductSearchParams, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Mock data for demonstration
  private mockProducts: Product[] = [
    {
      id: 1,
      name: "Gaming Laptop Pro X1",
      description: "High-performance gaming laptop with RTX 4080 GPU and Intel i9 processor",
      price: 2499.99,
      originalPrice: 2799.99,
      discount: 11,
      category: "Laptops",
      categoryId: 1,
      brand: "TechNova",
      images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"],
      rating: 4.8,
      reviewCount: 124,
      inStock: true,
      stockQuantity: 15,
      features: ["RTX 4080 GPU", "Intel i9-13900H", "32GB DDR5 RAM", "1TB NVMe SSD"],
      specifications: {
        "Processor": "Intel i9-13900H",
        "Graphics": "NVIDIA RTX 4080",
        "RAM": "32GB DDR5",
        "Storage": "1TB NVMe SSD",
        "Display": "15.6\" 4K OLED"
      },
      tags: ["gaming", "high-performance", "laptop"],
      isNew: true,
      isFeatured: true
    },
    {
      id: 2,
      name: "Wireless Gaming Headset",
      description: "Premium wireless headset with 7.1 surround sound and noise cancellation",
      price: 299.99,
      category: "Audio",
      categoryId: 2,
      brand: "AudioMax",
      images: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
      rating: 4.6,
      reviewCount: 89,
      inStock: true,
      stockQuantity: 32,
      features: ["7.1 Surround Sound", "Wireless Connectivity", "Noise Cancellation", "50hr Battery"],
      specifications: {
        "Connectivity": "Wireless 2.4GHz + Bluetooth",
        "Battery Life": "50 hours",
        "Drivers": "50mm Neodymium",
        "Frequency Response": "20Hz - 20kHz"
      },
      tags: ["wireless", "gaming", "audio"],
      isBestSeller: true
    },
    {
      id: 3,
      name: "Mechanical Gaming Keyboard",
      description: "RGB mechanical keyboard with Cherry MX switches and customizable lighting",
      price: 159.99,
      originalPrice: 199.99,
      discount: 20,
      category: "Accessories",
      categoryId: 3,
      brand: "KeyMaster",
      images: ["https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"],
      rating: 4.7,
      reviewCount: 203,
      inStock: true,
      stockQuantity: 45,
      features: ["Cherry MX Blue Switches", "RGB Backlighting", "Programmable Keys", "USB-C"],
      specifications: {
        "Switch Type": "Cherry MX Blue",
        "Layout": "Full Size (104 Keys)",
        "Connection": "USB-C",
        "Lighting": "Per-key RGB"
      },
      tags: ["mechanical", "rgb", "gaming"]
    },
    {
      id: 4,
      name: "4K Gaming Monitor",
      description: "32-inch 4K gaming monitor with 144Hz refresh rate and HDR support",
      price: 699.99,
      category: "Monitors",
      categoryId: 4,
      brand: "ViewMax",
      images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500", "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500"],
      rating: 4.9,
      reviewCount: 156,
      inStock: true,
      stockQuantity: 8,
      features: ["4K Resolution", "144Hz Refresh Rate", "HDR10 Support", "1ms Response Time"],
      specifications: {
        "Resolution": "3840 x 2160 (4K)",
        "Refresh Rate": "144Hz",
        "Panel Type": "IPS",
        "Response Time": "1ms",
        "HDR": "HDR10"
      },
      tags: ["4k", "gaming", "monitor", "hdr"],
      isFeatured: true
    },
    {
      id: 5,
      name: "Gaming Mouse Pro",
      description: "High-precision gaming mouse with 25,600 DPI sensor and customizable weights",
      price: 89.99,
      category: "Accessories",
      categoryId: 3,
      brand: "PrecisionTech",
      images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=500"],
      rating: 4.5,
      reviewCount: 312,
      inStock: true,
      stockQuantity: 67,
      features: ["25,600 DPI Sensor", "Customizable Weights", "RGB Lighting", "8 Programmable Buttons"],
      specifications: {
        "Sensor": "PixArt PMW3389",
        "DPI": "25,600",
        "Polling Rate": "1000Hz",
        "Buttons": "8 Programmable"
      },
      tags: ["gaming", "mouse", "high-dpi"]
    },
    {
      id: 6,
      name: "Ultrabook Slim X",
      description: "Ultra-portable laptop perfect for professionals and students",
      price: 1299.99,
      category: "Laptops",
      categoryId: 1,
      brand: "SlimTech",
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"],
      rating: 4.4,
      reviewCount: 78,
      inStock: true,
      stockQuantity: 23,
      features: ["Intel i7 Processor", "16GB RAM", "512GB SSD", "14-hour Battery"],
      specifications: {
        "Processor": "Intel i7-1260P",
        "RAM": "16GB LPDDR5",
        "Storage": "512GB NVMe SSD",
        "Display": "13.3\" 2K IPS",
        "Weight": "1.2kg"
      },
      tags: ["ultrabook", "portable", "business"]
    }
  ];

  private mockCategories: Category[] = [
    { id: 1, name: "Laptops", slug: "laptops", description: "Gaming and business laptops", icon: "laptop", productCount: 45 },
    { id: 2, name: "Audio", slug: "audio", description: "Headphones and speakers", icon: "headphones", productCount: 32 },
    { id: 3, name: "Accessories", slug: "accessories", description: "Gaming accessories", icon: "mouse", productCount: 78 },
    { id: 4, name: "Monitors", slug: "monitors", description: "Gaming and professional monitors", icon: "display", productCount: 23 },
    { id: 5, name: "Components", slug: "components", description: "PC components and parts", icon: "cpu", productCount: 56 }
  ];

  constructor() { }

  getProducts(params: ProductSearchParams = {}): Observable<ProductResponse> {
    let filteredProducts = [...this.mockProducts];

    // Apply filters
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (params.category) {
      filteredProducts = filteredProducts.filter(product => product.categoryId === params.category);
    }

    if (params.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => product.price <= params.maxPrice!);
    }

    if (params.brand) {
      filteredProducts = filteredProducts.filter(product => product.brand === params.brand);
    }

    // Apply sorting
    if (params.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (params.sortBy) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'newest':
            aValue = a.id; // Assuming higher ID means newer
            bValue = b.id;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return params.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return params.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const response: ProductResponse = {
      products: paginatedProducts,
      total: filteredProducts.length,
      page: page,
      totalPages: Math.ceil(filteredProducts.length / limit),
      hasNext: endIndex < filteredProducts.length,
      hasPrev: page > 1
    };

    return of(response).pipe(delay(300)); // Simulate API delay
  }

  getProduct(id: number): Observable<Product | null> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product || null).pipe(delay(200));
  }

  getRelatedProducts(productId: number, limit: number = 4): Observable<Product[]> {
    const currentProduct = this.mockProducts.find(p => p.id === productId);
    if (!currentProduct) {
      return of([]);
    }

    const relatedProducts = this.mockProducts
      .filter(p => p.id !== productId && p.categoryId === currentProduct.categoryId)
      .slice(0, limit);

    return of(relatedProducts).pipe(delay(200));
  }

  getCategories(): Observable<Category[]> {
    return of(this.mockCategories).pipe(delay(200));
  }

  getFeaturedProducts(limit: number = 8): Observable<Product[]> {
    const featured = this.mockProducts
      .filter(p => p.isFeatured)
      .slice(0, limit);
    return of(featured).pipe(delay(200));
  }

  getBestSellers(limit: number = 8): Observable<Product[]> {
    const bestSellers = this.mockProducts
      .filter(p => p.isBestSeller)
      .slice(0, limit);
    return of(bestSellers).pipe(delay(200));
  }

  searchProducts(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return of([]);
    }

    const searchQuery = query.toLowerCase();
    const results = this.mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.brand.toLowerCase().includes(searchQuery)
    ).slice(0, 8); // Limit autocomplete results

    return of(results).pipe(delay(150));
  }

  getBrands(): Observable<string[]> {
    const brands = [...new Set(this.mockProducts.map(p => p.brand))].sort();
    return of(brands).pipe(delay(100));
  }

  getPriceRange(): Observable<{min: number, max: number}> {
    const prices = this.mockProducts.map(p => p.price);
    return of({
      min: Math.min(...prices),
      max: Math.max(...prices)
    }).pipe(delay(100));
  }
}