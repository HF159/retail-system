// src/app/components/home/home.component.ts
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product, Category } from '../../models/product.model';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Define interface for countdown units
interface CountdownUnit {
  key: keyof CountdownTime;
  label: string;
}

// Define interface for time left object
interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, FormsModule],
  template: `
    <!-- Hero Section with Advanced Animations -->
    <section class="hero-section" [@fadeIn]>
      <div class="hero-background">
        <div class="hero-particles"></div>
        <div class="hero-gradient"></div>
      </div>
      
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6" [@slideInLeft]>
            <div class="hero-content">
              <span class="hero-badge" [@bounceIn]>
                <i class="bi bi-lightning-charge-fill me-2"></i>
                New Technology Hub
              </span>
              
              <h1 class="hero-title" [@slideInUp]>
                <span class="text-gradient">Redefining</span><br>
                <span class="text-premium">Tech Excellence</span>
              </h1>
              
              <p class="hero-description" [@slideInUp]="{ delay: '300ms' }">
                Discover cutting-edge technology solutions crafted for professionals, 
                gamers, and innovators. Your journey to tech excellence starts here.
              </p>
              
              <div class="hero-actions" [@slideInUp]="{ delay: '600ms' }">
                <button class="btn btn-primary btn-hero" routerLink="/products">
                  <span>Explore Products</span>
                  <i class="bi bi-arrow-right ms-2"></i>
                </button>
                <button class="btn btn-outline-light btn-hero-secondary" (click)="scrollToProducts()">
                  <i class="bi bi-play-circle me-2"></i>
                  Watch Demo
                </button>
              </div>
              
              <!-- Trust Indicators -->
              <div class="trust-indicators" [@slideInUp]="{ delay: '900ms' }">
                <div class="trust-item">
                  <span class="trust-number">10K+</span>
                  <span class="trust-label">Happy Customers</span>
                </div>
                <div class="trust-item">
                  <span class="trust-number">99.9%</span>
                  <span class="trust-label">Uptime</span>
                </div>
                <div class="trust-item">
                  <span class="trust-number">24/7</span>
                  <span class="trust-label">Support</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-6" [@slideInRight]>
            <div class="hero-visual">
              <div class="floating-cards">
                <div class="floating-card card-1" [@float]="'1'">
                  <i class="bi bi-laptop display-4 text-primary"></i>
                  <span>Laptops</span>
                </div>
                <div class="floating-card card-2" [@float]="'2'">
                  <i class="bi bi-phone display-4 text-success"></i>
                  <span>Smartphones</span>
                </div>
                <div class="floating-card card-3" [@float]="'3'">
                  <i class="bi bi-headphones display-4 text-warning"></i>
                  <span>Audio</span>
                </div>
                <div class="floating-card card-4" [@float]="'4'">
                  <i class="bi bi-controller display-4 text-danger"></i>
                  <span>Gaming</span>
                </div>
              </div>
              
              <!-- 3D Visual Element -->
              <div class="hero-3d-element">
                <div class="rotating-cube">
                  <div class="cube-face front"></div>
                  <div class="cube-face back"></div>
                  <div class="cube-face right"></div>
                  <div class="cube-face left"></div>
                  <div class="cube-face top"></div>
                  <div class="cube-face bottom"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="scroll-indicator" [@bounceIn]="{ delay: '1200ms' }">
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section" [@fadeInOnScroll]>
      <div class="container">
        <div class="row">
          <div class="col-md-3 col-6" *ngFor="let stat of stats; trackBy: trackByStat" [@countUp]>
            <div class="stat-card">
              <div class="stat-icon">
                <i [class]="stat.icon"></i>
              </div>
              <div class="stat-number">{{ stat.number }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section with Enhanced Design -->
    <section class="categories-section" id="products" [@fadeInOnScroll]>
      <div class="container">
        <div class="section-header text-center">
          <span class="section-badge">Our Categories</span>
          <h2 class="section-title">
            <span class="text-gradient">Explore by</span> Category
          </h2>
          <p class="section-subtitle">
            Discover our comprehensive range of cutting-edge technology products
          </p>
        </div>
        
        <div class="categories-grid">
          <div 
            class="category-card" 
            *ngFor="let category of categories; trackBy: trackByCategory"
            [routerLink]="['/products']" 
            [queryParams]="{category: category.id}"
            [@slideInOnScroll]>
            
            <div class="category-background"></div>
            <div class="category-content">
              <div class="category-icon-wrapper">
                <i [class]="'bi bi-' + category.icon + ' category-icon'"></i>
              </div>
              <h3 class="category-name">{{ category.name }}</h3>
              <p class="category-description">{{ category.description }}</p>
              <div class="category-stats">
                <span class="product-count">{{ category.productCount }}+ Products</span>
                <i class="bi bi-arrow-right category-arrow"></i>
              </div>
            </div>
            
            <!-- Hover Effect Elements -->
            <div class="category-glow"></div>
            <div class="category-particles">
              <span class="particle" *ngFor="let p of [1,2,3,4,5]"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products with Advanced Grid -->
    <section class="featured-section" [@fadeInOnScroll]>
      <div class="container">
        <div class="section-header text-center">
          <span class="section-badge">Handpicked</span>
          <h2 class="section-title">
            <span class="text-gradient">Featured</span> Products
          </h2>
          <p class="section-subtitle">
            Carefully selected products that define excellence
          </p>
        </div>
        
        <div class="products-showcase">
          <!-- Featured Product Grid -->
          <div class="featured-grid">
            <div 
              class="featured-product-card"
              *ngFor="let product of featuredProducts; let i = index; trackBy: trackByProduct"
              [class.large-card]="i === 0"
              [@slideInOnScroll]="{ delay: i * 100 + 'ms' }">
              
              <div class="product-image-wrapper">
                <img [src]="product.images[0]" [alt]="product.name" class="product-image">
                <div class="product-badges">
                  <span *ngIf="product.isNew" class="badge badge-new">New</span>
                  <span *ngIf="product.isBestSeller" class="badge badge-bestseller">Best Seller</span>
                  <span *ngIf="product.discount" class="badge badge-discount">-{{product.discount}}%</span>
                </div>
                <div class="product-overlay">
                  <button class="btn btn-overlay" (click)="addToCart(product, $event)">
                    <i class="bi bi-cart-plus"></i>
                  </button>
                  <button class="btn btn-overlay" [routerLink]="['/products', product.id]">
                    <i class="bi bi-eye"></i>
                  </button>
                </div>
              </div>
              
              <div class="product-info">
                <div class="product-category">{{ product.category }}</div>
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-rating">
                  <div class="stars">
                    <i class="bi bi-star-fill" *ngFor="let star of getStars(product.rating)"></i>
                    <i class="bi bi-star" *ngFor="let star of getEmptyStars(product.rating)"></i>
                  </div>
                  <span class="rating-count">({{ product.reviewCount }})</span>
                </div>
                <div class="product-price">
                  <span class="current-price">₹{{ product.price | number:'1.2-2' }}</span>
                  <span *ngIf="product.originalPrice" class="original-price">₹{{ product.originalPrice | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-5">
          <button class="btn btn-primary btn-lg btn-explore" routerLink="/products">
            <span>Explore All Products</span>
            <i class="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Deal of the Week with Advanced Countdown -->
    <section class="deal-section" [@fadeInOnScroll]>
      <div class="container">
        <div class="deal-container">
          <div class="deal-background"></div>
          <div class="deal-content">
            <div class="row align-items-center">
              <div class="col-lg-6">
                <div class="deal-info">
                  <span class="deal-badge">Limited Time Offer</span>
                  <h2 class="deal-title">
                    <span class="text-gradient">Deal of the</span><br>
                    <span class="text-premium">Week</span>
                  </h2>
                  <p class="deal-description">
                    Exclusive discount on premium gaming laptop. 
                    Don't miss this incredible opportunity!
                  </p>
                  
                  <!-- Countdown Timer -->
                  <div class="countdown-timer">
                    <div class="timer-unit" *ngFor="let unit of countdownUnits">
                      <div class="timer-number">{{ getTimeValue(unit.key) }}</div>
                      <div class="timer-label">{{ unit.label }}</div>
                    </div>
                  </div>
                  
                  <div class="deal-pricing">
                    <span class="deal-old-price">₹2,999</span>
                    <span class="deal-new-price">₹1,999</span>
                    <span class="deal-savings">Save ₹1,000</span>
                  </div>
                  
                  <button class="btn btn-deal" (click)="claimDeal()">
                    <i class="bi bi-lightning-charge-fill me-2"></i>
                    Claim Deal Now
                  </button>
                </div>
              </div>
              
              <div class="col-lg-6">
                <div class="deal-visual">
                  <div class="deal-product-image">
                    <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600" alt="Gaming Laptop" class="img-fluid">
                    <div class="deal-glow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section" [@fadeInOnScroll]>
      <div class="container">
        <div class="newsletter-container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="newsletter-content">
                <h3 class="newsletter-title">
                  Stay Updated with <span class="text-gradient">TechNova</span>
                </h3>
                <p class="newsletter-description">
                  Get the latest tech news, exclusive deals, and product updates delivered to your inbox.
                </p>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="newsletter-form">
                <div class="input-group">
                  <input 
                    type="email" 
                    class="form-control" 
                    placeholder="Enter your email address"
                    [(ngModel)]="newsletterEmail">
                  <button class="btn btn-primary" (click)="subscribeNewsletter()">
                    <i class="bi bi-send me-2"></i>
                    Subscribe
                  </button>
                </div>
                <p class="newsletter-privacy">
                  <i class="bi bi-shield-check me-1"></i>
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section Advanced Styling */
    .hero-section {
      position: relative;
      min-height: 100vh;
      overflow: hidden;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }

    .hero-particles {
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(2px 2px at 20px 30px, #0ea5e9, transparent),
        radial-gradient(2px 2px at 40px 70px, #38bdf8, transparent),
        radial-gradient(1px 1px at 90px 40px, #06b6d4, transparent);
      background-repeat: repeat;
      background-size: 100px 80px;
      animation: particleFloat 20s linear infinite;
      opacity: 0.3;
    }

    .hero-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at center, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
    }

    .hero-content {
      position: relative;
      z-index: 2;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      padding: 8px 16px;
      background: rgba(14, 165, 233, 0.1);
      border: 1px solid rgba(14, 165, 233, 0.3);
      border-radius: 50px;
      color: #38bdf8;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
    }

    .hero-title {
      font-size: 4rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 2rem;
      color: white;
    }

    .text-gradient {
      background: linear-gradient(135deg, #0ea5e9, #38bdf8, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .text-premium {
      background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.25rem;
      color: #cbd5e1;
      line-height: 1.7;
      margin-bottom: 3rem;
      max-width: 500px;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .btn-hero {
      padding: 16px 32px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .btn-hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .btn-hero:hover::before {
      left: 100%;
    }

    .btn-hero:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);
    }

    .btn-hero-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      backdrop-filter: blur(10px);
    }

    .trust-indicators {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .trust-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .trust-number {
      font-size: 2rem;
      font-weight: 800;
      color: #0ea5e9;
      line-height: 1;
    }

    .trust-label {
      font-size: 0.9rem;
      color: #94a3b8;
      margin-top: 0.25rem;
    }

    /* Hero Visual Elements */
    .hero-visual {
      position: relative;
      height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .floating-cards {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .floating-card {
      position: absolute;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 20px;
      padding: 2rem;
      backdrop-filter: blur(20px);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      transition: transform 0.3s ease;
    }

    .floating-card span {
      color: white;
      font-weight: 600;
    }

    .card-1 { top: 10%; left: 10%; animation: float1 6s ease-in-out infinite; }
    .card-2 { top: 20%; right: 20%; animation: float2 8s ease-in-out infinite; }
    .card-3 { bottom: 30%; left: 20%; animation: float3 7s ease-in-out infinite; }
    .card-4 { bottom: 20%; right: 10%; animation: float4 9s ease-in-out infinite; }

    /* 3D Rotating Cube */
    .hero-3d-element {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      perspective: 1000px;
    }

    .rotating-cube {
      width: 100px;
      height: 100px;
      position: relative;
      transform-style: preserve-3d;
      animation: rotateCube 20s linear infinite;
    }

    .cube-face {
      position: absolute;
      width: 100px;
      height: 100px;
      background: rgba(14, 165, 233, 0.1);
      border: 1px solid rgba(14, 165, 233, 0.3);
      backdrop-filter: blur(10px);
    }

    .cube-face.front { transform: rotateY(0deg) translateZ(50px); }
    .cube-face.back { transform: rotateY(180deg) translateZ(50px); }
    .cube-face.right { transform: rotateY(90deg) translateZ(50px); }
    .cube-face.left { transform: rotateY(-90deg) translateZ(50px); }
    .cube-face.top { transform: rotateX(90deg) translateZ(50px); }
    .cube-face.bottom { transform: rotateX(-90deg) translateZ(50px); }

    /* Scroll Indicator */
    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      z-index: 2;
    }

    .scroll-mouse {
      width: 24px;
      height: 40px;
      border: 2px solid #94a3b8;
      border-radius: 12px;
      position: relative;
      animation: scrollMouse 2s infinite;
    }

    .scroll-wheel {
      width: 3px;
      height: 6px;
      background: #94a3b8;
      border-radius: 2px;
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      animation: scrollWheel 2s infinite;
    }

    /* Stats Section */
    .stats-section {
      padding: 5rem 0;
      background: rgba(30, 41, 59, 0.3);
    }

    .stat-card {
      text-align: center;
      padding: 2rem 1rem;
      background: rgba(30, 41, 59, 0.5);
      border-radius: 20px;
      border: 1px solid rgba(51, 65, 85, 0.3);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .stat-icon {
      font-size: 2.5rem;
      color: #0ea5e9;
      margin-bottom: 1rem;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #94a3b8;
      font-weight: 500;
    }

    /* Categories Section */
    .categories-section {
      padding: 8rem 0;
      background: rgba(15, 23, 42, 0.8);
    }

    .section-header {
      margin-bottom: 5rem;
    }

    .section-badge {
      display: inline-block;
      padding: 8px 20px;
      background: rgba(14, 165, 233, 0.1);
      border: 1px solid rgba(14, 165, 233, 0.3);
      border-radius: 50px;
      color: #38bdf8;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1rem;
      backdrop-filter: blur(10px);
    }

    .section-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: white;
    }

    .section-subtitle {
      font-size: 1.2rem;
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .category-card {
      position: relative;
      padding: 3rem 2rem;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(51, 65, 85, 0.4);
      border-radius: 25px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(20px);
      text-decoration: none;
      color: inherit;
    }

    .category-card:hover {
      transform: translateY(-10px) scale(1.02);
      border-color: #0ea5e9;
      box-shadow: 0 25px 50px rgba(14, 165, 233, 0.3);
      text-decoration: none;
      color: inherit;
    }

    .category-card:hover .category-glow {
      opacity: 1;
    }

    .category-card:hover .category-particles .particle {
      animation: particleFloat 3s ease-in-out infinite;
    }

    .category-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(56, 189, 248, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .category-card:hover .category-background {
      opacity: 1;
    }

    .category-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }

    .category-icon-wrapper {
      width: 80px;
      height: 80px;
      margin: 0 auto 2rem;
      background: rgba(14, 165, 233, 0.1);
      border: 2px solid rgba(14, 165, 233, 0.3);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .category-card:hover .category-icon-wrapper {
      background: rgba(14, 165, 233, 0.2);
      border-color: #0ea5e9;
      transform: scale(1.1);
    }

    .category-icon {
      font-size: 2.5rem;
      color: #0ea5e9;
    }

    .category-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
    }

    .category-description {
      color: #94a3b8;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .category-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: #0ea5e9;
      font-weight: 600;
    }

    .category-arrow {
      transition: transform 0.3s ease;
    }

    .category-card:hover .category-arrow {
      transform: translateX(5px);
    }

    .category-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .category-particles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: #0ea5e9;
      border-radius: 50%;
      opacity: 0.6;
    }

    .particle:nth-child(1) { top: 20%; left: 20%; }
    .particle:nth-child(2) { top: 40%; right: 30%; }
    .particle:nth-child(3) { bottom: 30%; left: 40%; }
    .particle:nth-child(4) { bottom: 50%; right: 20%; }
    .particle:nth-child(5) { top: 60%; left: 60%; }

    /* Featured Products Section */
    .featured-section {
      padding: 8rem 0;
      background: rgba(30, 41, 59, 0.4);
    }

    .products-showcase {
      margin-top: 4rem;
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .featured-product-card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(51, 65, 85, 0.4);
      border-radius: 25px;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(20px);
      cursor: pointer;
    }

    .featured-product-card.large-card {
      grid-column: span 2;
      grid-row: span 2;
    }

    .featured-product-card:hover {
      transform: translateY(-10px);
      border-color: #0ea5e9;
      box-shadow: 0 25px 50px rgba(14, 165, 233, 0.2);
    }

    .product-image-wrapper {
      position: relative;
      height: 250px;
      overflow: hidden;
    }

    .large-card .product-image-wrapper {
      height: 400px;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .featured-product-card:hover .product-image {
      transform: scale(1.1);
    }

    .product-badges {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 2;
    }

    .badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-new {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }

    .badge-bestseller {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
    }

    .badge-discount {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
    }

    .product-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .featured-product-card:hover .product-overlay {
      opacity: 1;
    }

    .btn-overlay {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      color: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .btn-overlay:hover {
      background: white;
      transform: scale(1.1);
      color: #0ea5e9;
    }

    .product-info {
      padding: 2rem;
    }

    .product-category {
      color: #0ea5e9;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }

    .product-name {
      font-size: 1.3rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
      line-height: 1.3;
    }

    .large-card .product-name {
      font-size: 1.8rem;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .stars {
      color: #fbbf24;
      font-size: 1rem;
    }

    .rating-count {
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .product-price {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .current-price {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0ea5e9;
    }

    .large-card .current-price {
      font-size: 2rem;
    }

    .original-price {
      font-size: 1.1rem;
      color: #94a3b8;
      text-decoration: line-through;
    }

    .btn-explore {
      padding: 16px 40px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 50px;
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      border: none;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .btn-explore::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .btn-explore:hover::before {
      left: 100%;
    }

    .btn-explore:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(14, 165, 233, 0.4);
    }

    /* Deal Section */
    .deal-section {
      padding: 8rem 0;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      position: relative;
    }

    .deal-container {
      position: relative;
      border-radius: 30px;
      overflow: hidden;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(51, 65, 85, 0.4);
      backdrop-filter: blur(20px);
    }

    .deal-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at center, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
    }

    .deal-content {
      position: relative;
      z-index: 2;
      padding: 4rem;
    }

    .deal-badge {
      display: inline-block;
      padding: 8px 20px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-radius: 50px;
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      animation: pulse 2s infinite;
    }

    .deal-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: white;
    }

    .deal-description {
      font-size: 1.1rem;
      color: #94a3b8;
      margin-bottom: 3rem;
      line-height: 1.6;
    }

    .countdown-timer {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .timer-unit {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(51, 65, 85, 0.6);
      border-radius: 15px;
      padding: 1.5rem 1rem;
      min-width: 80px;
      text-align: center;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .timer-unit:hover {
      transform: scale(1.05);
      border-color: #0ea5e9;
    }

    .timer-number {
      font-size: 2rem;
      font-weight: 800;
      color: #0ea5e9;
      line-height: 1;
      display: block;
    }

    .timer-label {
      font-size: 0.8rem;
      color: #94a3b8;
      margin-top: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .deal-pricing {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .deal-old-price {
      font-size: 1.5rem;
      color: #94a3b8;
      text-decoration: line-through;
    }

    .deal-new-price {
      font-size: 3rem;
      font-weight: 800;
      color: #0ea5e9;
    }

    .deal-savings {
      padding: 8px 16px;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50px;
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .btn-deal {
      padding: 18px 40px;
      font-size: 1.2rem;
      font-weight: 700;
      border-radius: 50px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border: none;
      color: #1e293b;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .btn-deal:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(251, 191, 36, 0.4);
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .deal-visual {
      position: relative;
      text-align: center;
    }

    .deal-product-image {
      position: relative;
      display: inline-block;
    }

    .deal-product-image img {
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .deal-glow {
      position: absolute;
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
      background: radial-gradient(ellipse, rgba(14, 165, 233, 0.3) 0%, transparent 70%);
      border-radius: 30px;
      animation: dealGlow 3s ease-in-out infinite;
    }

    /* Newsletter Section */
    .newsletter-section {
      padding: 6rem 0;
      background: rgba(15, 23, 42, 0.6);
    }

    .newsletter-container {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(51, 65, 85, 0.4);
      border-radius: 25px;
      padding: 4rem;
      backdrop-filter: blur(20px);
    }

    .newsletter-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
    }

    .newsletter-description {
      font-size: 1.1rem;
      color: #94a3b8;
      line-height: 1.6;
    }

    .newsletter-form .input-group {
      border-radius: 50px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .newsletter-form .form-control {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(51, 65, 85, 0.6);
      color: white;
      padding: 16px 24px;
      font-size: 1rem;
      border-radius: 50px 0 0 50px;
    }

    .newsletter-form .form-control:focus {
      background: rgba(15, 23, 42, 0.9);
      border-color: #0ea5e9;
      box-shadow: none;
      color: white;
    }

    .newsletter-form .form-control::placeholder {
      color: #64748b;
    }

    .newsletter-form .btn {
      padding: 16px 32px;
      border-radius: 0 50px 50px 0;
      font-weight: 600;
    }

    .newsletter-privacy {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: #94a3b8;
      text-align: center;
    }

    /* Animations */
    @keyframes particleFloat {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-10px) rotate(120deg); }
      66% { transform: translateY(-5px) rotate(240deg); }
    }

    @keyframes float1 {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    @keyframes float2 {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(-3deg); }
    }

    @keyframes float3 {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-25px) rotate(4deg); }
    }

    @keyframes float4 {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-18px) rotate(-2deg); }
    }

    @keyframes rotateCube {
      0% { transform: rotateX(0deg) rotateY(0deg); }
      100% { transform: rotateX(360deg) rotateY(360deg); }
    }

    @keyframes scrollMouse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @keyframes scrollWheel {
      0% { transform: translateX(-50%) translateY(0px); }
      50% { transform: translateX(-50%) translateY(8px); }
      100% { transform: translateX(-50%) translateY(0px); }
    }

    @keyframes dealGlow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.05); }
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .hero-title { font-size: 3.5rem; }
      .section-title { font-size: 3rem; }
      .deal-title { font-size: 2.5rem; }
      .newsletter-title { font-size: 2rem; }
    }

    @media (max-width: 992px) {
      .hero-title { font-size: 3rem; }
      .section-title { font-size: 2.5rem; }
      .deal-title { font-size: 2rem; }
      .featured-product-card.large-card {
        grid-column: span 1;
        grid-row: span 1;
      }
      .large-card .product-image-wrapper {
        height: 250px;
      }
      .large-card .product-name {
        font-size: 1.3rem;
      }
      .large-card .current-price {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 2.5rem; }
      .section-title { font-size: 2rem; }
      .deal-title { font-size: 1.8rem; }
      .newsletter-title { font-size: 1.8rem; }
      .hero-actions { flex-direction: column; }
      .trust-indicators { justify-content: center; }
      .countdown-timer { justify-content: center; }
      .deal-pricing { justify-content: center; }
      .categories-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .category-card {
        padding: 2rem 1.5rem;
      }
      .deal-content {
        padding: 2rem;
        text-align: center;
      }
      .newsletter-container {
        padding: 2rem;
      }
      .floating-card {
        padding: 1.5rem;
      }
    }

    @media (max-width: 576px) {
      .hero-title { font-size: 2rem; }
      .section-title { font-size: 1.8rem; }
      .deal-title { font-size: 1.5rem; }
      .newsletter-title { font-size: 1.5rem; }
      .btn-hero {
        padding: 14px 24px;
        font-size: 1rem;
      }
      .timer-unit {
        padding: 1rem 0.75rem;
        min-width: 60px;
      }
      .timer-number {
        font-size: 1.5rem;
      }
      .deal-new-price {
        font-size: 2rem;
      }
    }
  `],
  animations: [
    // Entrance animations
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-50px)', opacity: 0 }),
        animate('800ms 200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(50px)', opacity: 0 }),
        animate('800ms 400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('600ms {{delay}} ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ], { params: { delay: '0ms' } })
    ]),
    
    trigger('bounceIn', [
      transition(':enter', [
        style({ transform: 'scale(0.3)', opacity: 0 }),
        animate('600ms {{delay}} cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ], { params: { delay: '0ms' } })
    ]),
    
    // Floating animation for cards
    trigger('float', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('800ms {{delay}}ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ], { params: { delay: '0' } })
    ]),
    
    // Scroll-triggered animations
    trigger('fadeInOnScroll', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    
    trigger('slideInOnScroll', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('600ms {{delay}} ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { params: { delay: '0ms' } })
    ]),
    
    // Count up animation for stats
    trigger('countUp', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('800ms 200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  categories: Category[] = [];
  timeLeft: CountdownTime = { days: 3, hours: 12, minutes: 45, seconds: 30 };
  newsletterEmail = '';
  
  stats = [
    { icon: 'bi bi-people-fill', number: '10K+', label: 'Happy Customers' },
    { icon: 'bi bi-box-seam-fill', number: '5K+', label: 'Products' },
    { icon: 'bi bi-truck', number: '99.9%', label: 'On-Time Delivery' },
    { icon: 'bi bi-headset', number: '24/7', label: 'Support' }
  ];
  
  countdownUnits: CountdownUnit[] = [
    { key: 'days', label: 'Days' },
    { key: 'hours', label: 'Hours' },
    { key: 'minutes', label: 'Minutes' },
    { key: 'seconds', label: 'Seconds' }
  ];

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
    if (this.isBrowser) {
      this.startCountdown();
      this.initializeScrollAnimations();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
      }
    });
  }

  loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts(8).subscribe({
      next: (products) => {
        this.featuredProducts = products;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.featuredProducts = [];
      }
    });
  }

  startCountdown(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
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
      });
  }

  initializeScrollAnimations(): void {
    if (typeof window !== 'undefined') {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);

      // Observe all sections that should animate on scroll
      const sections = document.querySelectorAll('.stats-section, .categories-section, .featured-section, .deal-section, .newsletter-section');
      sections.forEach(section => observer.observe(section));
    }
  }

  scrollToProducts(): void {
    if (this.isBrowser) {
      const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  addToCart(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(product);
    console.log('Added to cart:', product.name);
  }

  claimDeal(): void {
    console.log('Claiming deal...');
    // Implement deal claiming logic
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      console.log('Subscribing email:', this.newsletterEmail);
      // Implement newsletter subscription logic
      this.newsletterEmail = '';
    }
  }

  getTimeValue(key: keyof CountdownTime): number {
    return this.timeLeft[key];
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // TrackBy functions for performance
  trackByStat(index: number, stat: any): string {
    return stat.label;
  }

  trackByCategory(index: number, category: Category): number {
    return category.id;
  }

  trackByProduct(index: number, product: Product): number {
    return product.id;
  }
}