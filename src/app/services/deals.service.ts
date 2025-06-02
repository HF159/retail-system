// src/app/services/deals.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../models/product.model';

export interface Deal {
  id: number;
  product: Product;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  savings: number;
  endDate: Date;
  isActive: boolean;
  isFlashDeal: boolean;
  dealType: 'flash' | 'daily' | 'weekly' | 'clearance';
  limitedStock?: number;
  description?: string;
  terms?: string[];
}

export interface DealCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  deals: Deal[];
  color: string;
  isActive: boolean;
}

export interface DealsResponse {
  deals: Deal[];
  total: number;
  flashDeals: Deal[];
  categories: DealCategory[];
  totalSavings: number;
  averageDiscount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DealsService {

  private mockDeals: Deal[] = [
    {
      id: 1,
      product: {
        id: 1,
        name: "Gaming Laptop Pro X1 RTX 4080",
        description: "Ultimate gaming performance with RTX 4080 GPU and Intel i9 processor for professionals and enthusiasts",
        price: 1999.99,
        originalPrice: 2499.99,
        discount: 20,
        category: "Laptops",
        categoryId: 1,
        brand: "TechNova",
        images: [
          "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500",
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
        ],
        rating: 4.8,
        reviewCount: 324,
        inStock: true,
        stockQuantity: 8,
        features: ["RTX 4080 GPU", "Intel i9-13900H", "32GB DDR5 RAM", "1TB NVMe SSD", "15.6\" 4K OLED"],
        specifications: {
          "Processor": "Intel i9-13900H",
          "Graphics": "NVIDIA RTX 4080 16GB",
          "RAM": "32GB DDR5-5600",
          "Storage": "1TB NVMe SSD Gen4",
          "Display": "15.6\" 4K OLED 120Hz"
        },
        tags: ["gaming", "laptop", "rtx", "4k"],
        isNew: true,
        isFeatured: true
      },
      originalPrice: 2499.99,
      dealPrice: 1999.99,
      discount: 20,
      savings: 500,
      endDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      isActive: true,
      isFlashDeal: true,
      dealType: 'flash',
      limitedStock: 3,
      description: "Lightning deal on our flagship gaming laptop!",
      terms: ["Limited to 3 units", "Cannot be combined with other offers", "Valid for 8 hours only"]
    },
    {
      id: 2,
      product: {
        id: 2,
        name: "Wireless Gaming Headset Pro Max",
        description: "Premium wireless headset with active noise cancellation and 7.1 surround sound",
        price: 199.99,
        originalPrice: 299.99,
        discount: 33,
        category: "Audio",
        categoryId: 2,
        brand: "AudioMax",
        images: [
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
        ],
        rating: 4.6,
        reviewCount: 189,
        inStock: true,
        stockQuantity: 25,
        features: ["7.1 Surround Sound", "Active Noise Cancellation", "50hr Battery", "Wireless 2.4GHz + Bluetooth"],
        specifications: {
          "Connectivity": "Wireless 2.4GHz + Bluetooth 5.2",
          "Battery Life": "50 hours",
          "Drivers": "50mm Neodymium",
          "Frequency Response": "20Hz - 20kHz",
          "Weight": "280g"
        },
        tags: ["wireless", "gaming", "audio", "noise-cancellation"],
        isBestSeller: true
      },
      originalPrice: 299.99,
      dealPrice: 199.99,
      discount: 33,
      savings: 100,
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isActive: true,
      isFlashDeal: false,
      dealType: 'daily',
      description: "Daily deal on premium gaming audio"
    },
    {
      id: 3,
      product: {
        id: 3,
        name: "Mechanical Gaming Keyboard RGB Pro",
        description: "Professional mechanical keyboard with Cherry MX switches and per-key RGB lighting",
        price: 129.99,
        originalPrice: 199.99,
        discount: 35,
        category: "Accessories",
        categoryId: 3,
        brand: "KeyMaster",
        images: [
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500",
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"
        ],
        rating: 4.7,
        reviewCount: 456,
        inStock: true,
        stockQuantity: 45,
        features: ["Cherry MX Blue Switches", "Per-key RGB", "Programmable Macros", "USB-C", "Aluminum Frame"],
        specifications: {
          "Switch Type": "Cherry MX Blue",
          "Layout": "Full Size (104 Keys)",
          "Connection": "USB-C Detachable",
          "Lighting": "Per-key RGB with 16.7M colors",
          "Frame": "Aluminum Alloy"
        },
        tags: ["mechanical", "rgb", "gaming", "programmable"]
      },
      originalPrice: 199.99,
      dealPrice: 129.99,
      discount: 35,
      savings: 70,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
      isFlashDeal: false,
      dealType: 'weekly',
      description: "Weekly special on mechanical keyboards"
    },
    {
      id: 4,
      product: {
        id: 4,
        name: "4K Gaming Monitor 32\" 144Hz",
        description: "Professional 4K gaming monitor with 144Hz refresh rate and HDR support",
        price: 549.99,
        originalPrice: 699.99,
        discount: 21,
        category: "Monitors",
        categoryId: 4,
        brand: "ViewMax",
        images: [
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500"
        ],
        rating: 4.9,
        reviewCount: 234,
        inStock: true,
        stockQuantity: 12,
        features: ["4K UHD Resolution", "144Hz Refresh Rate", "HDR10 Support", "1ms Response Time", "FreeSync Premium"],
        specifications: {
          "Resolution": "3840 x 2160 (4K UHD)",
          "Refresh Rate": "144Hz",
          "Panel Type": "IPS",
          "Response Time": "1ms MPRT",
          "HDR": "HDR10, HDR400"
        },
        tags: ["4k", "gaming", "monitor", "hdr", "144hz"],
        isFeatured: true
      },
      originalPrice: 699.99,
      dealPrice: 549.99,
      discount: 21,
      savings: 150,
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isActive: true,
      isFlashDeal: false,
      dealType: 'flash',
      limitedStock: 7,
      description: "Flash sale on premium 4K gaming monitor"
    },
    {
      id: 5,
      product: {
        id: 5,
        name: "Gaming Mouse Pro 25K DPI",
        description: "High-precision gaming mouse with 25,600 DPI sensor and customizable weights",
        price: 69.99,
        originalPrice: 89.99,
        discount: 22,
        category: "Accessories",
        categoryId: 3,
        brand: "PrecisionTech",
        images: [
          "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500"
        ],
        rating: 4.5,
        reviewCount: 567,
        inStock: true,
        stockQuantity: 89,
        features: ["25,600 DPI Sensor", "Customizable Weights", "RGB Lighting", "8 Programmable Buttons"],
        specifications: {
          "Sensor": "PixArt PMW3389",
          "DPI": "Up to 25,600",
          "Polling Rate": "1000Hz",
          "Buttons": "8 Programmable",
          "Weight": "85g (without weights)"
        },
        tags: ["gaming", "mouse", "high-dpi", "programmable"]
      },
      originalPrice: 89.99,
      dealPrice: 69.99,
      discount: 22,
      savings: 20,
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isActive: true,
      isFlashDeal: false,
      dealType: 'weekly',
      description: "Weekly deal on precision gaming mouse"
    },
    {
      id: 6,
      product: {
        id: 6,
        name: "SSD NVMe 2TB Gen4",
        description: "Ultra-fast NVMe SSD with PCIe Gen4 interface for maximum performance",
        price: 179.99,
        originalPrice: 249.99,
        discount: 28,
        category: "Components",
        categoryId: 5,
        brand: "SpeedDrive",
        images: [
          "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500"
        ],
        rating: 4.8,
        reviewCount: 189,
        inStock: true,
        stockQuantity: 34,
        features: ["PCIe Gen4 Interface", "2TB Capacity", "7000MB/s Read Speed", "5-Year Warranty"],
        specifications: {
          "Capacity": "2TB",
          "Interface": "PCIe 4.0 x4",
          "Read Speed": "Up to 7,000 MB/s",
          "Write Speed": "Up to 6,500 MB/s",
          "Form Factor": "M.2 2280"
        },
        tags: ["ssd", "nvme", "gen4", "storage", "fast"]
      },
      originalPrice: 249.99,
      dealPrice: 179.99,
      discount: 28,
      savings: 70,
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      isActive: true,
      isFlashDeal: false,
      dealType: 'clearance',
      description: "Clearance pricing on high-speed storage"
    },
    {
      id: 7,
      product: {
        id: 7,
        name: "Webcam 4K Pro Stream",
        description: "Professional 4K webcam with auto-focus and noise reduction for streaming and video calls",
        price: 149.99,
        originalPrice: 199.99,
        discount: 25,
        category: "Accessories",
        categoryId: 3,
        brand: "StreamTech",
        images: [
          "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500"
        ],
        rating: 4.4,
        reviewCount: 145,
        inStock: true,
        stockQuantity: 28,
        features: ["4K 30fps Video", "Auto-Focus", "Noise Reduction", "Wide-Angle Lens", "USB-C"],
        specifications: {
          "Resolution": "4K UHD (3840x2160)",
          "Frame Rate": "30fps at 4K, 60fps at 1080p",
          "Field of View": "90° diagonal",
          "Connection": "USB-C 3.0",
          "Microphone": "Dual stereo with noise reduction"
        },
        tags: ["webcam", "4k", "streaming", "professional"]
      },
      originalPrice: 199.99,
      dealPrice: 149.99,
      discount: 25,
      savings: 50,
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isActive: true,
      isFlashDeal: false,
      dealType: 'daily',
      description: "Daily deal for content creators"
    },
    {
      id: 8,
      product: {
        id: 8,
        name: "Ultrabook Slim Pro 13\"",
        description: "Ultra-portable laptop perfect for professionals and students with all-day battery life",
        price: 999.99,
        originalPrice: 1299.99,
        discount: 23,
        category: "Laptops",
        categoryId: 1,
        brand: "SlimTech",
        images: [
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
        ],
        rating: 4.4,
        reviewCount: 234,
        inStock: true,
        stockQuantity: 18,
        features: ["Intel i7 Processor", "16GB LPDDR5", "512GB SSD", "14-hour Battery", "Thunderbolt 4"],
        specifications: {
          "Processor": "Intel i7-1260P",
          "RAM": "16GB LPDDR5",
          "Storage": "512GB NVMe SSD",
          "Display": "13.3\" 2K IPS",
          "Weight": "1.2kg",
          "Battery": "14 hours"
        },
        tags: ["ultrabook", "portable", "business", "lightweight"]
      },
      originalPrice: 1299.99,
      dealPrice: 999.99,
      discount: 23,
      savings: 300,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isActive: true,
      isFlashDeal: false,
      dealType: 'weekly',
      description: "Weekly special on ultraportable laptops"
    }
  ];

  constructor() { }

  getDeals(): Observable<DealsResponse> {
    const flashDeals = this.mockDeals.filter(deal => deal.isFlashDeal);
    const totalSavings = this.mockDeals.reduce((sum, deal) => sum + deal.savings, 0);
    const averageDiscount = this.mockDeals.reduce((sum, deal) => sum + deal.discount, 0) / this.mockDeals.length;

    const categories: DealCategory[] = [
      {
        id: 'flash',
        name: 'Flash Deals',
        description: 'Limited time lightning deals',
        icon: 'bi bi-lightning-charge',
        deals: this.mockDeals.filter(d => d.dealType === 'flash'),
        color: '#ef4444',
        isActive: true
      },
      {
        id: 'daily',
        name: 'Daily Deals',
        description: 'Fresh deals every day',
        icon: 'bi bi-sun',
        deals: this.mockDeals.filter(d => d.dealType === 'daily'),
        color: '#0ea5e9',
        isActive: true
      },
      {
        id: 'weekly',
        name: 'Weekly Specials',
        description: 'Week-long special offers',
        icon: 'bi bi-calendar-week',
        deals: this.mockDeals.filter(d => d.dealType === 'weekly'),
        color: '#10b981',
        isActive: true
      },
      {
        id: 'clearance',
        name: 'Clearance',
        description: 'Final sale items',
        icon: 'bi bi-tag',
        deals: this.mockDeals.filter(d => d.dealType === 'clearance'),
        color: '#f59e0b',
        isActive: true
      }
    ];

    const response: DealsResponse = {
      deals: this.mockDeals,
      total: this.mockDeals.length,
      flashDeals: flashDeals,
      categories: categories,
      totalSavings: totalSavings,
      averageDiscount: averageDiscount
    };

    return of(response).pipe(delay(300));
  }

  getDeal(id: number): Observable<Deal | null> {
    const deal = this.mockDeals.find(d => d.id === id);
    return of(deal || null).pipe(delay(200));
  }

  getFlashDeals(): Observable<Deal[]> {
    const flashDeals = this.mockDeals.filter(deal => deal.isFlashDeal && deal.isActive);
    return of(flashDeals).pipe(delay(200));
  }

  getDealsByCategory(categoryId: string): Observable<Deal[]> {
    let deals: Deal[] = [];
    
    if (categoryId === 'all') {
      deals = this.mockDeals.filter(deal => deal.isActive);
    } else {
      deals = this.mockDeals.filter(deal => deal.dealType === categoryId && deal.isActive);
    }
    
    return of(deals).pipe(delay(200));
  }

  getDealsByDiscount(minDiscount: number): Observable<Deal[]> {
    const deals = this.mockDeals.filter(deal => deal.discount >= minDiscount && deal.isActive);
    return of(deals).pipe(delay(200));
  }

  searchDeals(query: string): Observable<Deal[]> {
    if (!query.trim()) {
      return of([]);
    }

    const searchQuery = query.toLowerCase();
    const results = this.mockDeals.filter(deal =>
      deal.product.name.toLowerCase().includes(searchQuery) ||
      deal.product.description.toLowerCase().includes(searchQuery) ||
      deal.product.brand.toLowerCase().includes(searchQuery) ||
      deal.product.category.toLowerCase().includes(searchQuery) ||
      deal.description?.toLowerCase().includes(searchQuery)
    );

    return of(results).pipe(delay(150));
  }

  getTopDeals(limit: number = 6): Observable<Deal[]> {
    // Sort by highest savings and get top deals
    const topDeals = [...this.mockDeals]
      .filter(deal => deal.isActive)
      .sort((a, b) => b.savings - a.savings)
      .slice(0, limit);
    
    return of(topDeals).pipe(delay(200));
  }

  getDealStatistics(): Observable<{
    totalDeals: number;
    totalSavings: number;
    averageDiscount: number;
    highestDiscount: number;
    flashDealsCount: number;
    endingSoonCount: number;
  }> {
    const now = new Date().getTime();
    const endingSoonThreshold = 24 * 60 * 60 * 1000; // 24 hours

    const stats = {
      totalDeals: this.mockDeals.length,
      totalSavings: this.mockDeals.reduce((sum, deal) => sum + deal.savings, 0),
      averageDiscount: this.mockDeals.reduce((sum, deal) => sum + deal.discount, 0) / this.mockDeals.length,
      highestDiscount: Math.max(...this.mockDeals.map(deal => deal.discount)),
      flashDealsCount: this.mockDeals.filter(deal => deal.isFlashDeal).length,
      endingSoonCount: this.mockDeals.filter(deal => 
        deal.endDate.getTime() - now <= endingSoonThreshold
      ).length
    };

    return of(stats).pipe(delay(100));
  }

  // Utility method to check if a deal is ending soon (within 24 hours)
  isDealEndingSoon(deal: Deal): boolean {
    const now = new Date().getTime();
    const endingSoonThreshold = 24 * 60 * 60 * 1000; // 24 hours
    return deal.endDate.getTime() - now <= endingSoonThreshold;
  }

  // Utility method to get time remaining for a deal
  getTimeRemaining(endDate: Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } {
    const now = new Date().getTime();
    const end = endDate.getTime();
    const diff = end - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isExpired: false };
  }

  // Method to simulate claiming a deal (updating stock, etc.)
  claimDeal(dealId: number): Observable<{ success: boolean; message: string; updatedDeal?: Deal }> {
    const deal = this.mockDeals.find(d => d.id === dealId);
    
    if (!deal) {
      return of({ success: false, message: 'Deal not found' });
    }

    if (!deal.isActive) {
      return of({ success: false, message: 'Deal is no longer active' });
    }

    if (deal.limitedStock && deal.limitedStock <= 0) {
      return of({ success: false, message: 'Deal is out of stock' });
    }

    // Simulate claiming the deal
    if (deal.limitedStock) {
      deal.limitedStock--;
      if (deal.limitedStock === 0) {
        deal.isActive = false;
      }
    }

    return of({ 
      success: true, 
      message: 'Deal claimed successfully!', 
      updatedDeal: deal 
    }).pipe(delay(500));
  }
}