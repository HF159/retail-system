// src/app/components/deals/deals.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CartService } from '../../services/cart.service';
import { DealsService, Deal, DealCategory, DealsResponse } from '../../services/deals.service';
import { Product } from '../../models/product.model';
import { Subject, takeUntil } from 'rxjs';

interface ClaimDealResponse {
  success: boolean;
  message: string;
  updatedDeal?: Deal;
}

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="deals-hero">
      <div class="container">
        <div class="row align-items-center min-vh-50">
          <div class="col-lg-6 text-center text-lg-start">
            <div class="hero-content">
              <span class="hero-badge">
                <i class="bi bi-lightning-charge-fill me-2"></i>
                Limited Time Offers
              </span>
              <h1 class="display-3 fw-bold text-gradient mb-4 fade-in-up">
                Unbeatable Tech Deals
              </h1>
              <p class="lead mb-4 text-secondary fade-in-up" style="animation-delay: 0.2s;">
                Discover incredible savings on premium technology products. 
                From gaming gear to professional equipment - all at amazing prices!
              </p>
              <div class="hero-stats fade-in-up" style="animation-delay: 0.4s;">
                <div class="stat-item">
                  <div class="stat-number">{{ totalDeals }}+</div>
                  <div class="stat-label">Active Deals</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ Math.round(averageDiscount) }}%</div>
                  <div class="stat-label">Avg. Discount</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">\${{ (totalSavings/1000) | number:'1.0-1' }}K+</div>
                  <div class="stat-label">Total Savings</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <div class="hero-visual fade-in-up" style="animation-delay: 0.6s;">
              <div class="floating-deals">
                <div class="deal-badge badge-1">
                  <i class="bi bi-lightning-charge"></i>
                  <span>-50%</span>
                </div>
                <div class="deal-badge badge-2">
                  <i class="bi bi-fire"></i>
                  <span>-75%</span>
                </div>
                <div class="deal-badge badge-3">
                  <i class="bi bi-star-fill"></i>
                  <span>-30%</span>
                </div>
              </div>
              <div class="hero-icon">
                <i class="bi bi-tag-fill display-1 text-gradient"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Flash Deals Section -->
    <section class="flash-deals py-5" *ngIf="flashDeals.length > 0">
      <div class="container">
        <div class="section-header text-center mb-5">
          <div class="section-badge">
            <i class="bi bi-lightning-charge-fill me-2"></i>
            Flash Deals
          </div>
          <h2 class="display-5 fw-bold text-gradient mb-3">Lightning Fast Savings</h2>
          <p class="lead text-secondary">Limited time offers that won't last long!</p>
        </div>

        <!-- Flash Deal Timer -->
        <div class="flash-timer text-center mb-5">
          <h4 class="text-gradient mb-3">Deal ends in:</h4>
          <div class="countdown-timer">
            <div class="timer-unit">
              <div class="timer-number">{{ flashTimer.hours }}</div>
              <div class="timer-label">Hours</div>
            </div>
            <div class="timer-unit">
              <div class="timer-number">{{ flashTimer.minutes }}</div>
              <div class="timer-label">Minutes</div>
            </div>
            <div class="timer-unit">
              <div class="timer-number">{{ flashTimer.seconds }}</div>
              <div class="timer-label">Seconds</div>
            </div>
          </div>
        </div>

        <!-- Flash Deals Grid -->
        <div class="row g-4">
          <div class="col-lg-4 col-md-6" *ngFor="let deal of flashDeals">
            <div class="flash-deal-card">
              <div class="deal-header">
                <div class="flash-badge">
                  <i class="bi bi-lightning-charge-fill"></i>
                  Flash Deal
                </div>
                <div class="discount-badge">-{{ deal.discount }}%</div>
              </div>
              
              <div class="product-image">
                <img [src]="deal.product.images[0]" [alt]="deal.product.name" class="img-fluid">
                <div class="stock-warning" *ngIf="deal.limitedStock && deal.limitedStock <= 5">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  Only {{ deal.limitedStock }} left!
                </div>
              </div>

              <div class="deal-content">
                <h5 class="product-name">{{ deal.product.name }}</h5>
                <div class="product-rating mb-2">
                  <i class="bi bi-star-fill" *ngFor="let star of getStars(deal.product.rating)"></i>
                  <span class="rating-count">({{ deal.product.reviewCount }})</span>
                </div>
                
                <div class="price-comparison mb-3">
                  <span class="deal-price">\${{ deal.dealPrice | number:'1.2-2' }}</span>
                  <span class="original-price">\${{ deal.originalPrice | number:'1.2-2' }}</span>
                  <span class="savings">Save \${{ deal.savings | number:'1.2-2' }}</span>
                </div>

                <div class="deal-actions">
                  <button 
                    class="btn btn-primary w-100 mb-2" 
                    (click)="addDealToCart(deal)"
                    [disabled]="!deal.isActive">
                    <i class="bi bi-cart-plus me-2"></i>
                    {{ deal.isActive ? 'Grab This Deal' : 'Deal Expired' }}
                  </button>
                  <button class="btn btn-outline-secondary w-100" [routerLink]="['/products', deal.product.id]">
                    <i class="bi bi-eye me-2"></i>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Deal Categories -->
    <section class="deal-categories py-5 bg-surface">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="display-5 fw-bold text-gradient mb-3">Shop by Deal Type</h2>
          <p class="lead text-secondary">Find exactly what you're looking for</p>
        </div>

        <!-- Category Filter Tabs -->
        <div class="category-tabs mb-5">
          <div class="nav nav-pills justify-content-center" role="tablist">
            <button 
              class="nav-link"
              [class.active]="activeCategory === 'all'"
              (click)="setActiveCategory('all')">
              <i class="bi bi-grid-3x3-gap me-2"></i>
              All Deals ({{ totalDeals }})
            </button>
            <button 
              *ngFor="let category of dealCategories"
              class="nav-link"
              [class.active]="activeCategory === category.id"
              (click)="setActiveCategory(category.id)">
              <i [class]="category.icon + ' me-2'"></i>
              {{ category.name }} ({{ category.deals.length }})
            </button>
          </div>
        </div>

        <!-- Sort and Filter Controls -->
        <div class="deals-toolbar mb-4">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="results-info">
                <span class="text-secondary">
                  Showing {{ filteredDeals.length }} of {{ totalDeals }} deals
                  <span *ngIf="activeCategory !== 'all'">in {{ getActiveCategoryName() }}</span>
                </span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="sort-controls d-flex justify-content-md-end">
                <select class="form-select me-3" [(ngModel)]="sortBy" (ngModelChange)="onSortChange()">
                  <option value="discount-desc">Highest Discount</option>
                  <option value="discount-asc">Lowest Discount</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="savings-desc">Best Savings</option>
                  <option value="ending-soon">Ending Soon</option>
                </select>
                <div class="view-toggle">
                  <div class="btn-group" role="group">
                    <button 
                      type="button" 
                      class="btn btn-sm"
                      [class.btn-primary]="viewMode === 'grid'"
                      [class.btn-outline-primary]="viewMode !== 'grid'"
                      (click)="viewMode = 'grid'">
                      <i class="bi bi-grid-3x3"></i>
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-sm"
                      [class.btn-primary]="viewMode === 'list'"
                      [class.btn-outline-primary]="viewMode !== 'list'"
                      (click)="viewMode = 'list'">
                      <i class="bi bi-list"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div class="loading-state text-center py-5" *ngIf="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading deals...</span>
          </div>
          <p class="mt-3 text-secondary">Loading amazing deals...</p>
        </div>

        <!-- Deals Grid -->
        <div class="deals-grid" [class.list-view]="viewMode === 'list'" *ngIf="!loading">
          <!-- No Deals Found -->
          <div class="no-deals text-center py-5" *ngIf="filteredDeals.length === 0">
            <i class="bi bi-search display-1 text-muted mb-3"></i>
            <h4>No deals found</h4>
            <p class="text-muted">Try selecting a different category or check back later for new deals.</p>
            <button class="btn btn-primary" (click)="setActiveCategory('all')">
              View All Deals
            </button>
          </div>

          <!-- Grid View -->
          <div 
            class="row" 
            *ngIf="filteredDeals.length > 0 && viewMode === 'grid'">
            <div 
              class="col-lg-4 col-md-6 mb-4"
              *ngFor="let deal of filteredDeals; trackBy: trackByDealId">
              <div class="deal-card">
                <div class="deal-image-container">
                  <img [src]="deal.product.images[0]" [alt]="deal.product.name" class="deal-image">
                  
                  <div class="deal-badges">
                    <span class="badge badge-discount">-{{ deal.discount }}%</span>
                    <span class="badge badge-type" [class]="'badge-' + deal.dealType">
                      {{ deal.dealType | titlecase }}
                    </span>
                  </div>

                  <div class="deal-timer" *ngIf="isDealEndingSoon(deal)">
                    <i class="bi bi-clock me-1"></i>
                    {{ getTimeRemaining(deal.endDate) }}
                  </div>

                  <div class="deal-actions-overlay">
                    <button class="btn btn-light btn-sm" (click)="addToWishlist(deal.product)">
                      <i class="bi bi-heart"></i>
                    </button>
                    <button class="btn btn-light btn-sm" [routerLink]="['/products', deal.product.id]">
                      <i class="bi bi-eye"></i>
                    </button>
                  </div>
                </div>

                <div class="deal-content">
                  <div class="product-category">{{ deal.product.category }}</div>
                  <h6 class="product-name">{{ deal.product.name }}</h6>
                  
                  <div class="product-rating mb-2">
                    <i class="bi bi-star-fill" *ngFor="let star of getStars(deal.product.rating)"></i>
                    <span class="rating-count">({{ deal.product.reviewCount }})</span>
                  </div>

                  <div class="price-section mb-3">
                    <div class="current-price">\${{ deal.dealPrice | number:'1.2-2' }}</div>
                    <div class="price-comparison">
                      <span class="original-price">\${{ deal.originalPrice | number:'1.2-2' }}</span>
                      <span class="savings-badge">Save \${{ deal.savings | number:'1.2-2' }}</span>
                    </div>
                  </div>

                  <div class="progress-container" *ngIf="deal.limitedStock">
                    <div class="progress mb-2">
                      <div class="progress-bar bg-warning" [style.width.%]="getStockPercentage(deal)"></div>
                    </div>
                    <small class="text-muted">{{ deal.limitedStock }} left in stock</small>
                  </div>

                  <button 
                    class="btn btn-primary w-100 mt-2" 
                    (click)="addDealToCart(deal)"
                    [disabled]="!deal.isActive">
                    <i class="bi bi-cart-plus me-2"></i>
                    {{ deal.isActive ? 'Add to Cart' : 'Deal Expired' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div class="deals-list" *ngIf="filteredDeals.length > 0 && viewMode === 'list'">
            <div class="deal-list-item" *ngFor="let deal of filteredDeals; trackBy: trackByDealId">
              <div class="row align-items-center">
                <div class="col-md-3">
                  <div class="deal-image-container">
                    <img [src]="deal.product.images[0]" [alt]="deal.product.name" class="deal-image">
                    <div class="deal-badges">
                      <span class="badge badge-discount">-{{ deal.discount }}%</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="deal-info">
                    <div class="product-category">{{ deal.product.category }}</div>
                    <h5 class="product-name">{{ deal.product.name }}</h5>
                    <p class="product-description">{{ deal.product.description }}</p>
                    <div class="product-rating">
                      <i class="bi bi-star-fill" *ngFor="let star of getStars(deal.product.rating)"></i>
                      <span class="rating-count">({{ deal.product.reviewCount }})</span>
                    </div>
                    <div class="deal-meta mt-2">
                      <span class="badge badge-{{ deal.dealType }} me-2">{{ deal.dealType | titlecase }}</span>
                      <span class="text-muted small" *ngIf="isDealEndingSoon(deal)">
                        <i class="bi bi-clock me-1"></i>
                        Ends {{ getTimeRemaining(deal.endDate) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 text-end">
                  <div class="deal-pricing">
                    <div class="current-price">\${{ deal.dealPrice | number:'1.2-2' }}</div>
                    <div class="original-price">\${{ deal.originalPrice | number:'1.2-2' }}</div>
                    <div class="savings-badge">Save \${{ deal.savings | number:'1.2-2' }}</div>
                  </div>
                  <div class="deal-actions mt-3">
                    <button 
                      class="btn btn-primary w-100 mb-2" 
                      (click)="addDealToCart(deal)"
                      [disabled]="!deal.isActive">
                      <i class="bi bi-cart-plus me-2"></i>
                      {{ deal.isActive ? 'Add to Cart' : 'Deal Expired' }}
                    </button>
                    <button class="btn btn-outline-secondary w-100" [routerLink]="['/products', deal.product.id]">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Subscription -->
    <section class="deals-newsletter py-5">
      <div class="container">
        <div class="newsletter-card">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <div class="newsletter-content">
                <h3 class="text-gradient mb-3">
                  <i class="bi bi-envelope-heart me-3"></i>
                  Never Miss a Deal!
                </h3>
                <p class="lead text-secondary mb-0">
                  Subscribe to our newsletter and be the first to know about exclusive deals, 
                  flash sales, and new product launches.
                </p>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="newsletter-form">
                <div class="input-group">
                  <input 
                    type="email" 
                    class="form-control" 
                    placeholder="Enter your email"
                    [(ngModel)]="newsletterEmail">
                  <button 
                    class="btn btn-primary" 
                    (click)="subscribeNewsletter()"
                    [disabled]="!newsletterEmail">
                    <i class="bi bi-send me-2"></i>
                    Subscribe
                  </button>
                </div>
                <small class="text-muted mt-2 d-block">
                  Get exclusive deals delivered to your inbox weekly.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .deals-hero {
      background: var(--gradient-primary);
      padding: 80px 0 60px;
      position: relative;
      overflow: hidden;
    }

    .deals-hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at center, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
    }

    .min-vh-50 {
      min-height: 50vh;
    }

    .hero-badge {
      display: inline-block;
      background: rgba(14, 165, 233, 0.2);
      color: var(--accent-sky);
      padding: 8px 20px;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 20px;
      border: 1px solid rgba(14, 165, 233, 0.3);
    }

    .hero-stats {
      display: flex;
      gap: 30px;
      margin-top: 30px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: var(--accent-sky);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-top: 5px;
    }

    .hero-visual {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 300px;
    }

    .hero-icon {
      font-size: 8rem;
      opacity: 0.3;
    }

    .floating-deals {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .deal-badge {
      position: absolute;
      background: var(--gradient-accent);
      color: white;
      padding: 10px 15px;
      border-radius: 20px;
      font-weight: 700;
      box-shadow: var(--shadow-lg);
      animation: float 3s ease-in-out infinite;
    }

    .deal-badge i {
      margin-right: 5px;
    }

    .badge-1 {
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .badge-2 {
      top: 60%;
      right: 20%;
      animation-delay: 1s;
    }

    .badge-3 {
      bottom: 20%;
      left: 30%;
      animation-delay: 2s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    /* Flash Deals */
    .flash-deals {
      background: rgba(30, 41, 59, 0.3);
    }

    .section-header {
      text-align: center;
    }

    .section-badge {
      display: inline-block;
      background: rgba(239, 68, 68, 0.2);
      color: var(--error);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .flash-timer {
      background: var(--gradient-surface);
      border-radius: 20px;
      padding: 30px;
      margin: 0 auto;
      max-width: 600px;
    }

    .countdown-timer {
      display: flex;
      justify-content: center;
      gap: 20px;
    }

    .timer-unit {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid var(--surface-tertiary);
      border-radius: 15px;
      padding: 20px 15px;
      min-width: 80px;
      text-align: center;
    }

    .timer-number {
      font-size: 2rem;
      font-weight: 800;
      color: var(--error);
      line-height: 1;
    }

    .timer-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 5px;
    }

    /* Flash Deal Cards */
    .flash-deal-card {
      background: var(--gradient-surface);
      border: 2px solid var(--error);
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s ease;
      position: relative;
    }

    .flash-deal-card:hover {
      transform: translateY(-10px);
      box-shadow: var(--shadow-xl);
    }

    .deal-header {
      position: relative;
      background: linear-gradient(135deg, var(--error) 0%, #dc2626 100%);
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .flash-badge {
      color: white;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .discount-badge {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 5px 12px;
      border-radius: 15px;
      font-weight: 700;
    }

    .product-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .stock-warning {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: var(--warning);
      color: white;
      padding: 5px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .deal-content {
      padding: 20px;
    }

    .product-name {
      font-weight: 600;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .product-rating {
      color: var(--warning);
    }

    .rating-count {
      color: var(--text-muted);
      font-size: 0.8rem;
      margin-left: 5px;
    }

    .price-comparison {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .deal-price {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--error);
    }

    .original-price {
      font-size: 1rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }

    .savings {
      color: var(--success);
      font-weight: 600;
      font-size: 0.9rem;
    }

    /* Category Tabs */
    .category-tabs {
      display: flex;
      justify-content: center;
    }

    .nav-pills .nav-link {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid var(--surface-tertiary);
      color: var(--text-secondary);
      margin: 0 5px;
      border-radius: 25px;
      padding: 12px 20px;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .nav-pills .nav-link.active {
      background: var(--gradient-accent);
      color: white;
      border-color: var(--accent-sky);
    }

    .nav-pills .nav-link:hover:not(.active) {
      background: rgba(14, 165, 233, 0.1);
      color: var(--accent-light-sky);
    }

    /* Toolbar */
    .deals-toolbar {
      background: var(--gradient-surface);
      border-radius: 15px;
      padding: 20px;
      box-shadow: var(--shadow-md);
    }

    .sort-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .form-select {
      max-width: 200px;
    }

    .view-toggle .btn {
      border-radius: 8px;
    }

    /* Deal Cards */
    .deal-card {
      background: var(--gradient-surface);
      border: 1px solid var(--surface-tertiary);
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.3s ease;
      height: 100%;
    }

    .deal-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
      border-color: var(--accent-sky);
    }

    .deal-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .deal-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .deal-card:hover .deal-image {
      transform: scale(1.05);
    }

    .deal-badges {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 12px;
    }

    .badge-discount {
      background: var(--error);
      color: white;
    }

    .badge-flash {
      background: var(--warning);
      color: white;
    }

    .badge-daily {
      background: var(--accent-sky);
      color: white;
    }

    .badge-weekly {
      background: var(--success);
      color: white;
    }

    .badge-clearance {
      background: var(--primary-slate);
      color: white;
    }

    .deal-timer {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .deal-actions-overlay {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .deal-card:hover .deal-actions-overlay {
      opacity: 1;
    }

    .deal-actions-overlay .btn {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .deal-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      height: calc(100% - 200px);
    }

    .product-category {
      color: var(--accent-sky);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .price-section {
      margin-top: auto;
    }

    .current-price {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--accent-sky);
    }

    .price-comparison {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 5px;
    }

    .savings-badge {
      background: var(--success);
      color: white;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .progress {
      height: 6px;
      background: rgba(51, 65, 85, 0.3);
      border-radius: 3px;
    }

    .progress-bar {
      border-radius: 3px;
    }

    /* List View */
    .deals-list .deal-list-item {
      background: var(--gradient-surface);
      border: 1px solid var(--surface-tertiary);
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 20px;
      transition: all 0.3s ease;
    }

    .deals-list .deal-list-item:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
      border-color: var(--accent-sky);
    }

    .deals-list .deal-image-container {
      height: 120px;
    }

    .deals-list .product-description {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 10px;
      line-height: 1.4;
    }

    .deal-pricing {
      text-align: right;
    }

    .deal-pricing .current-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-sky);
    }

    .deal-pricing .original-price {
      font-size: 1rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }

    .deal-pricing .savings-badge {
      display: inline-block;
      margin-top: 5px;
    }

    /* Newsletter Section */
    .deals-newsletter {
      background: var(--gradient-primary);
    }

    .newsletter-card {
      background: var(--gradient-surface);
      border: 1px solid var(--surface-tertiary);
      border-radius: 25px;
      padding: 40px;
      box-shadow: var(--shadow-xl);
    }

    .newsletter-form .input-group {
      border-radius: 15px;
      overflow: hidden;
    }

    .newsletter-form .form-control {
      border-radius: 15px 0 0 15px;
      border-right: none;
    }

    .newsletter-form .btn {
      border-radius: 0 15px 15px 0;
    }

    /* Loading State */
    .loading-state {
      min-height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .deals-hero {
        padding: 60px 0 40px;
      }

      .hero-stats {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .countdown-timer {
        gap: 10px;
        flex-wrap: wrap;
      }

      .timer-unit {
        min-width: 60px;
        padding: 15px 10px;
      }

      .timer-number {
        font-size: 1.5rem;
      }

      .category-tabs .nav {
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
      }

      .sort-controls {
        flex-direction: column;
        gap: 10px;
      }

      .deals-list .deal-list-item .row {
        text-align: center;
      }

      .deal-pricing {
        text-align: center !important;
        margin-top: 20px;
      }

      .newsletter-card {
        padding: 30px 20px;
        text-align: center;
      }

      .newsletter-form {
        margin-top: 20px;
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

    /* Deal Type Specific Styles */
    .badge-type.badge-flash {
      background: linear-gradient(135deg, var(--error), #dc2626);
      animation: pulse-glow 2s infinite;
    }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 5px var(--error); }
      50% { box-shadow: 0 0 20px var(--error); }
    }

    .badge-type.badge-daily {
      background: linear-gradient(135deg, var(--accent-sky), var(--accent-light-sky));
    }

    .badge-type.badge-weekly {
      background: linear-gradient(135deg, var(--success), #059669);
    }

    .badge-type.badge-clearance {
      background: linear-gradient(135deg, var(--warning), #d97706);
    }

    /* No deals state */
    .no-deals {
      background: var(--gradient-surface);
      border-radius: 20px;
      padding: 60px 20px;
      margin: 20px 0;
    }
  `]
})
export class DealsComponent implements OnInit, OnDestroy {
  Math = Math; // Make Math available in template
  private destroy$ = new Subject<void>();

  deals: Deal[] = [];
  flashDeals: Deal[] = [];
  filteredDeals: Deal[] = [];
  dealCategories: DealCategory[] = [];
  
  activeCategory = 'all';
  sortBy = 'discount-desc';
  viewMode: 'grid' | 'list' = 'grid';
  loading = true;
  
  totalDeals = 0;
  averageDiscount = 0;
  totalSavings = 0;
  
  flashTimer = { hours: 12, minutes: 30, seconds: 45 };
  newsletterEmail = '';

  constructor(
    private cartService: CartService,
    private dealsService: DealsService
  ) {}

  ngOnInit(): void {
    this.loadDeals();
    this.startFlashTimer();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDeals(): void {
    this.loading = true;
    this.dealsService.getDeals()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: DealsResponse) => {
          this.deals = response.deals;
          this.flashDeals = response.flashDeals;
          this.dealCategories = response.categories;
          this.totalDeals = response.total;
          this.totalSavings = response.totalSavings;
          this.averageDiscount = response.averageDiscount;
          
          this.filteredDeals = [...this.deals];
          this.sortDeals();
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading deals:', error);
          this.loading = false;
        }
      });
  }

  setActiveCategory(categoryId: string): void {
    this.activeCategory = categoryId;
    this.filterDeals();
  }

  filterDeals(): void {
    if (this.activeCategory === 'all') {
      this.filteredDeals = [...this.deals];
    } else {
      this.filteredDeals = this.deals.filter(deal => deal.dealType === this.activeCategory);
    }
    this.sortDeals();
  }

  onSortChange(): void {
    this.sortDeals();
  }

  sortDeals(): void {
    const [sortField, sortOrder] = this.sortBy.split('-');
    
    this.filteredDeals.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'discount':
          aValue = a.discount;
          bValue = b.discount;
          break;
        case 'price':
          aValue = a.dealPrice;
          bValue = b.dealPrice;
          break;
        case 'savings':
          aValue = a.savings;
          bValue = b.savings;
          break;
        case 'ending':
          aValue = a.endDate.getTime();
          bValue = b.endDate.getTime();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });
  }

  getActiveCategoryName(): string {
    const category = this.dealCategories.find(cat => cat.id === this.activeCategory);
    return category ? category.name : 'All Deals';
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getTimeRemaining(endDate: Date): string {
    const timeRemaining = this.dealsService.getTimeRemaining(endDate);
    
    if (timeRemaining.isExpired) return 'Expired';
    
    if (timeRemaining.days > 0) {
      return `${timeRemaining.days}d ${timeRemaining.hours}h`;
    } else if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
    } else {
      return `${timeRemaining.minutes}m ${timeRemaining.seconds}s`;
    }
  }

  isDealEndingSoon(deal: Deal): boolean {
    return this.dealsService.isDealEndingSoon(deal);
  }

  getStockPercentage(deal: Deal): number {
    if (!deal.limitedStock) return 100;
    return Math.max(10, (deal.limitedStock / 20) * 100); // Assuming 20 was the original stock
  }

  addDealToCart(deal: Deal): void {
    if (!deal.isActive) {
      console.log('Deal is no longer active');
      return;
    }

    // Create a copy of the product with the deal price
    const dealProduct = { 
      ...deal.product, 
      price: deal.dealPrice,
      originalPrice: deal.originalPrice 
    };
    
    this.cartService.addToCart(dealProduct);
    console.log('Added deal to cart:', deal.product.name, 'at deal price:', deal.dealPrice);
    
    // Optionally, you could also claim the deal here
    this.dealsService.claimDeal(deal.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: ClaimDealResponse) => {
          if (result.success && result.updatedDeal) {
            // Update the local deal with the new stock count
            const dealIndex = this.deals.findIndex(d => d.id === deal.id);
            if (dealIndex !== -1) {
              this.deals[dealIndex] = result.updatedDeal;
              this.filterDeals(); // Refresh the filtered list
            }
          }
        },
        error: (error: any) => {
          console.error('Error claiming deal:', error);
        }
      });
  }

  addToWishlist(product: Product): void {
    console.log('Added to wishlist:', product.name);
    // TODO: Implement wishlist functionality
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      console.log('Newsletter subscription:', this.newsletterEmail);
      this.newsletterEmail = '';
      // TODO: Implement newsletter subscription
      // Show success message
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  trackByDealId(index: number, deal: Deal): number {
    return deal.id;
  }

  private startFlashTimer(): void {
    setInterval(() => {
      if (this.flashTimer.seconds > 0) {
        this.flashTimer.seconds--;
      } else if (this.flashTimer.minutes > 0) {
        this.flashTimer.minutes--;
        this.flashTimer.seconds = 59;
      } else if (this.flashTimer.hours > 0) {
        this.flashTimer.hours--;
        this.flashTimer.minutes = 59;
        this.flashTimer.seconds = 59;
      } else {
        // Timer expired, reload flash deals
        this.loadDeals();
        this.flashTimer = { hours: 12, minutes: 30, seconds: 45 }; // Reset timer
      }
    }, 1000);
  }
}