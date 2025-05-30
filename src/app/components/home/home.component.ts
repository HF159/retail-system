import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Carousel -->
    <section class="hero-section">
      <div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
        </div>
        
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="hero-slide hero-slide-1">
              <div class="container">
                <div class="row align-items-center min-vh-75">
                  <div class="col-lg-6 text-center text-lg-start">
                    <h1 class="display-3 fw-bold text-gradient mb-4 fade-in-up">
                      Professional Tech Solutions
                    </h1>
                    <p class="lead mb-4 text-secondary fade-in-up" style="animation-delay: 0.2s;">
                      Discover cutting-edge technology for professionals, gamers, and tech enthusiasts.
                    </p>
                    <div class="fade-in-up" style="animation-delay: 0.4s;">
                      <button class="btn btn-primary btn-lg me-3 shadow-glow">
                        <i class="bi bi-rocket-takeoff me-2"></i>
                        Explore Products
                      </button>
                      <button class="btn btn-outline-primary btn-lg">
                        <i class="bi bi-play-circle me-2"></i>
                        Watch Demo
                      </button>
                    </div>
                  </div>
                  <div class="col-lg-6 text-center">
                    <div class="hero-image-container fade-in-up" style="animation-delay: 0.6s;">
                      <div class="hero-tech-visual">
                        <i class="bi bi-laptop display-1 text-gradient"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="carousel-item">
            <div class="hero-slide hero-slide-2">
              <div class="container">
                <div class="row align-items-center min-vh-75">
                  <div class="col-lg-6 text-center text-lg-start">
                    <h1 class="display-3 fw-bold text-gradient mb-4">
                      Gaming Excellence
                    </h1>
                    <p class="lead mb-4 text-secondary">
                      Experience next-generation gaming with our premium hardware and accessories.
                    </p>
                    <button class="btn btn-primary btn-lg shadow-glow">
                      <i class="bi bi-controller me-2"></i>
                      Gaming Gear
                    </button>
                  </div>
                  <div class="col-lg-6 text-center">
                    <div class="hero-tech-visual">
                      <i class="bi bi-controller display-1 text-gradient"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="carousel-item">
            <div class="hero-slide hero-slide-3">
              <div class="container">
                <div class="row align-items-center min-vh-75">
                  <div class="col-lg-6 text-center text-lg-start">
                    <h1 class="display-3 fw-bold text-gradient mb-4">
                      Smart Innovation
                    </h1>
                    <p class="lead mb-4 text-secondary">
                      Connect your world with intelligent devices and smart home solutions.
                    </p>
                    <button class="btn btn-primary btn-lg shadow-glow">
                      <i class="bi bi-house-gear me-2"></i>
                      Smart Devices
                    </button>
                  </div>
                  <div class="col-lg-6 text-center">
                    <div class="hero-tech-visual">
                      <i class="bi bi-phone display-1 text-gradient"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
        </button>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-5 fw-bold text-gradient mb-3">Shop by Category</h2>
          <p class="lead text-secondary">Explore our comprehensive range of technology products</p>
        </div>
        
        <div class="row g-4">
          <div class="col-lg-3 col-md-6" *ngFor="let category of categories">
            <div class="category-card h-100" [routerLink]="['/categories', category.slug]">
              <div class="card-body text-center p-4">
                <div class="category-icon mb-3">
                  <i [class]="category.icon + ' display-4 text-gradient'"></i>
                </div>
                <h5 class="card-title fw-semibold">{{ category.name }}</h5>
                <p class="card-text text-secondary small">{{ category.description }}</p>
                <div class="category-stats">
                  <span class="badge bg-primary">{{ category.productCount }}+ Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-section py-5 bg-surface">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-5 fw-bold text-gradient mb-3">For You</h2>
          <p class="lead text-secondary">Handpicked products based on your preferences</p>
        </div>
        
        <div class="row g-4">
          <div class="col-lg-3 col-md-6" *ngFor="let product of featuredProducts">
            <div class="product-card h-100">
              <div class="product-image-container">
                <div class="product-image bg-accent-gradient d-flex align-items-center justify-content-center">
                  <i [class]="product.icon + ' display-4 text-white'"></i>
                </div>
                <div class="product-badge" *ngIf="product.discount">
                  <span class="badge bg-primary">-{{ product.discount }}%</span>
                </div>
              </div>
              <div class="card-body p-4">
                <h5 class="card-title fw-semibold mb-2">{{ product.name }}</h5>
                <p class="card-text text-secondary small mb-3">{{ product.description }}</p>
                <div class="product-rating mb-2">
                  <i class="bi bi-star-fill text-warning" *ngFor="let star of [1,2,3,4,5]"></i>
                  <span class="text-muted ms-2">({{ product.reviews }})</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="price-container">
                    <span class="price-current fw-bold text-primary fs-5">\${{ product.price }}</span>
                    <span class="price-original text-muted text-decoration-line-through ms-2" 
                          *ngIf="product.originalPrice">
                      \${{ product.originalPrice }}
                    </span>
                  </div>
                  <button class="btn btn-outline-primary btn-sm" (click)="addToCart(product)">
                    <i class="bi bi-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Deal of the Week Section -->
    <section class="deal-section py-5">
      <div class="container">
        <div class="deal-card p-5 text-center">
          <div class="mb-4">
            <h2 class="display-4 fw-bold text-gradient mb-3">Deal of the Week</h2>
            <p class="lead text-secondary">Limited time offer - Don't miss out!</p>
          </div>
          
          <!-- Countdown Timer -->
          <div class="countdown-timer mb-4">
            <div class="row justify-content-center">
              <div class="col-auto">
                <div class="timer-unit">
                  <div class="timer-number">{{ timeLeft.days }}</div>
                  <div class="timer-label">Days</div>
                </div>
              </div>
              <div class="col-auto">
                <div class="timer-unit">
                  <div class="timer-number">{{ timeLeft.hours }}</div>
                  <div class="timer-label">Hours</div>
                </div>
              </div>
              <div class="col-auto">
                <div class="timer-unit">
                  <div class="timer-number">{{ timeLeft.minutes }}</div>
                  <div class="timer-label">Minutes</div>
                </div>
              </div>
              <div class="col-auto">
                <div class="timer-unit">
                  <div class="timer-number">{{ timeLeft.seconds }}</div>
                  <div class="timer-label">Seconds</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="deal-product mb-4">
            <h3 class="h2 fw-bold mb-3">
              <i class="bi bi-lightning-charge text-warning me-2"></i>
              Premium Gaming Laptop RTX 4080
            </h3>
            <div class="price-comparison mb-4">
              <span class="original-price text-muted text-decoration-line-through fs-3">\$2,999</span>
              <span class="deal-price text-primary fw-bold fs-1 ms-3">\$1,999</span>
              <span class="savings badge bg-success fs-6 ms-3">Save \$1,000</span>
            </div>
            <button class="btn btn-primary btn-lg shadow-glow" (click)="claimDeal()">
              <i class="bi bi-lightning-charge-fill me-2"></i>
              Claim Deal Now
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Packages Section -->
    <section class="packages-section py-5 bg-surface">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-5 fw-bold text-gradient mb-3">Complete Packages</h2>
          <p class="lead text-secondary">Everything you need in one convenient bundle</p>
        </div>
        
        <div class="row g-4">
          <div class="col-lg-4" *ngFor="let package of packages">
            <div class="package-card h-100">
              <div class="package-header text-center p-4">
                <div class="package-icon mb-3">
                  <i [class]="package.icon + ' display-4 text-gradient'"></i>
                </div>
                <h3 class="h4 fw-bold text-gradient">{{ package.name }}</h3>
                <p class="text-secondary">{{ package.description }}</p>
              </div>
              <div class="package-features p-4">
                <ul class="list-unstyled">
                  <li class="mb-2" *ngFor="let feature of package.features">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <div class="package-footer p-4 text-center">
                <div class="package-pricing mb-3">
                  <span class="package-price fw-bold fs-2 text-primary">\${{ package.price }}</span>
                  <div class="text-muted small">
                    <span class="text-decoration-line-through">\${{ package.originalPrice }}</span>
                    <span class="text-success ms-2">Save \${{ package.originalPrice - package.price }}</span>
                  </div>
                </div>
                <button class="btn btn-primary w-100" (click)="addPackageToCart(package)">
                  <i class="bi bi-cart-plus me-2"></i>
                  Add Package
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      margin-top: -1rem;
      position: relative;
      overflow: hidden;
    }

    .hero-slide {
      min-height: 75vh;
      background: var(--gradient-primary);
      position: relative;
    }

    .hero-slide::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at center, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
    }

    .min-vh-75 {
      min-height: 75vh;
    }

    .hero-tech-visual {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: inline-block;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .carousel-control-prev,
    .carousel-control-next {
      width: 5%;
      color: var(--accent-sky);
    }

    .carousel-indicators [data-bs-target] {
      background-color: var(--accent-sky);
      border: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    /* Categories Section */
    .categories-section {
      background: rgba(30, 41, 59, 0.3);
    }

    .category-card {
      background: var(--gradient-surface);
      border: 1px solid var(--surface-tertiary);
      border-radius: 20px;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }

    .category-card:hover {
      transform: translateY(-10px);
      box-shadow: var(--shadow-xl);
      border-color: var(--accent-sky);
      text-decoration: none;
      color: inherit;
    }

    .category-icon {
      transition: transform 0.3s ease;
    }

    .category-card:hover .category-icon {
      transform: scale(1.1);
    }

    /* Featured Products */
    .product-card {
      background: var(--gradient-surface);
      border: 1px solid var(--surface-tertiary);
      border-radius: 20px;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .product-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
      border-color: var(--accent-sky);
    }

    .product-image-container {
      position: relative;
      overflow: hidden;
    }

    .product-image {
      height: 200px;
      border-radius: 20px 20px 0 0;
    }

    .product-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 10;
    }

    .product-rating {
      font-size: 0.9rem;
    }

    .price-current {
      color: var(--accent-sky) !important;
    }

    /* Deal Section */
    .deal-section {
      background: var(--gradient-primary);
      position: relative;
    }

    .deal-card {
      background: var(--gradient-surface);
      border: 1px solid var(--surface-tertiary);
      border-radius: 25px;
      box-shadow: var(--shadow-xl);
      position: relative;
      overflow: hidden;
    }

    .deal-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%);
      z-index: 1;
    }

    .deal-card > * {
      position: relative;
      z-index: 2;
    }

    .countdown-timer {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .timer-unit {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid var(--surface-tertiary);
      border-radius: 15px;
      padding: 1.5rem 1rem;
      min-width: 80px;
      backdrop-filter: blur(10px);
    }

    .timer-number {
      font-size: 2rem;
      font-weight: 800;
      color: var(--accent-sky);
      line-height: 1;
    }

    .timer-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .deal-price {
      color: var(--accent-sky) !important;
    }

    /* Packages Section */
    .package-card {
      background: var(--gradient-surface);
      border: 1px solid var(--surface-tertiary);
      border-radius: 25px;
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .package-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
      border-color: var(--accent-sky);
    }

    .package-header {
      border-bottom: 1px solid var(--surface-tertiary);
    }

    .package-features li {
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(51, 65, 85, 0.3);
    }

    .package-features li:last-child {
      border-bottom: none;
    }

    .package-footer {
      border-top: 1px solid var(--surface-tertiary);
      background: rgba(15, 23, 42, 0.3);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .hero-slide {
        min-height: 60vh;
        text-align: center;
      }

      .display-3 {
        font-size: 2.5rem;
      }

      .countdown-timer {
        gap: 0.5rem;
      }

      .timer-unit {
        padding: 1rem 0.75rem;
        min-width: 70px;
      }

      .timer-number {
        font-size: 1.5rem;
      }
    }

    /* Animation Classes */
    .fade-in-up {
      animation: fadeInUp 0.8s ease-out forwards;
      opacity: 0;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  timeLeft = { days: 3, hours: 12, minutes: 45, seconds: 30 };
  
  categories = [
    {
      name: 'Laptops',
      slug: 'laptops',
      icon: 'bi bi-laptop',
      description: 'Professional & Gaming',
      productCount: 150
    },
    {
      name: 'Desktops',
      slug: 'desktops',
      icon: 'bi bi-pc-display',
      description: 'Workstations & Gaming PCs',
      productCount: 85
    },
    {
      name: 'Smartphones',
      slug: 'smartphones',
      icon: 'bi bi-phone',
      description: 'Latest Mobile Technology',
      productCount: 120
    },
    {
      name: 'Gaming',
      slug: 'gaming',
      icon: 'bi bi-controller',
      description: 'Gaming Gear & Accessories',
      productCount: 200
    },
    {
      name: 'Components',
      slug: 'components',
      icon: 'bi bi-cpu',
      description: 'PC Building Components',
      productCount: 300
    },
    {
      name: 'Audio',
      slug: 'audio',
      icon: 'bi bi-headphones',
      description: 'Premium Audio Equipment',
      productCount: 75
    },
    {
      name: 'Cameras',
      slug: 'cameras',
      icon: 'bi bi-camera',
      description: 'Photography & Video',
      productCount: 60
    },
    {
      name: 'Wearables',
      slug: 'wearables',
      icon: 'bi bi-smartwatch',
      description: 'Smart Watches & Fitness',
      productCount: 45
    }
  ];

  packages = [
    {
      name: 'Gaming Ultimate',
      description: 'Complete gaming setup for enthusiasts',
      icon: 'bi bi-controller',
      price: 2999,
      originalPrice: 3599,
      features: [
        'RTX 4080 Gaming Laptop',
        'Mechanical Gaming Keyboard',
        'High-DPI Gaming Mouse',
        'Premium Gaming Headset',
        '27" 144Hz Monitor',
        '1-Year Premium Support'
      ]
    },
    {
      name: 'Professional Workspace',
      description: 'Everything for productivity professionals',
      icon: 'bi bi-briefcase',
      price: 2299,
      originalPrice: 2799,
      features: [
        'Business Ultrabook',
        'Wireless Ergonomic Keyboard',
        'Precision Wireless Mouse',
        '4K Professional Monitor',
        'Webcam & Audio Kit',
        'Office Software Suite'
      ]
    },
    {
      name: 'Smart Home Hub',
      description: 'Connected home automation bundle',
      icon: 'bi bi-house-gear',
      price: 1599,
      originalPrice: 1999,
      features: [
        'Smart Hub Controller',
        '10x Smart LED Bulbs',
        'Security Camera System',
        'Smart Thermostat',
        'Voice Assistant',
        'Mobile App Control'
      ]
    }
  ];

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.startCountdown();
  }

  loadFeaturedProducts(): void {
    this.featuredProducts = [
      {
        id: 1,
        name: 'MacBook Pro M3',
        description: 'Professional laptop with M3 chip',
        price: 2499,
        originalPrice: 2799,
        discount: 10,
        icon: 'bi bi-laptop',
        reviews: 324,
        category: 'laptops'
      },
      {
        id: 2,
        name: 'RTX 4080 Gaming PC',
        description: 'High-performance gaming desktop',
        price: 1899,
        originalPrice: 2199,
        discount: 15,
        icon: 'bi bi-pc-display',
        reviews: 189,
        category: 'desktops'
      },
      {
        id: 3,
        name: 'iPhone 15 Pro Max',
        description: 'Latest flagship smartphone',
        price: 1299,
        originalPrice: null,
        discount: 0,
        icon: 'bi bi-phone',
        reviews: 567,
        category: 'smartphones'
      },
      {
        id: 4,
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-cancelling headphones',
        price: 399,
        originalPrice: 449,
        discount: 11,
        icon: 'bi bi-headphones',
        reviews: 892,
        category: 'audio'
      }
    ];
  }

  startCountdown(): void {
    setInterval(() => {
      if (this.timeLeft.seconds > 0) {
        this.timeLeft.seconds--;
      } else if (this.timeLeft.minutes > 0) {
        this.timeLeft.minutes--;
        this.timeLeft.seconds = 59;
      } else if (this.timeLeft.hours > 0) {
        this.timeLeft.hours--;
        this.timeLeft.minutes = 59;
        this.timeLeft.seconds = 59;
      } else if (this.timeLeft.days > 0) {
        this.timeLeft.days--;
        this.timeLeft.hours = 23;
        this.timeLeft.minutes = 59;
        this.timeLeft.seconds = 59;
      }
    }, 1000);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  addPackageToCart(packageItem: any): void {
    console.log('Adding package to cart:', packageItem);
    // Implement package cart logic
  }

  claimDeal(): void {
    console.log('Claiming deal...');
    // Implement deal claiming logic
  }
}