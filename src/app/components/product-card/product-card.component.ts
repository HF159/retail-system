// src/app/components/product-card/product-card.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card h-100" 
         [routerLink]="['/products', product.id]"
         [@cardHover]="hoverState"
         (mouseenter)="onMouseEnter()"
         (mouseleave)="onMouseLeave()">
      
      <!-- Product Image Container -->
      <div class="product-image-container">
        <!-- Main Image -->
        <div class="image-wrapper">
          <img [src]="currentImage" 
               [alt]="product.name" 
               class="product-image main-image"
               [@imageTransition]="imageState">
          
          <!-- Hover Image (if available) -->
          <img *ngIf="product.images.length > 1"
               [src]="product.images[1]" 
               [alt]="product.name" 
               class="product-image hover-image"
               [@imageTransition]="imageState">
        </div>
        
        <!-- Product Badges -->
        <div class="product-badges" [@badgeSlide]>
          <span *ngIf="product.isNew" class="badge badge-new" [@badgePulse]>
            <i class="bi bi-star-fill me-1"></i>New
          </span>
          <span *ngIf="product.isBestSeller" class="badge badge-bestseller" [@badgePulse]>
            <i class="bi bi-trophy-fill me-1"></i>Best Seller
          </span>
          <span *ngIf="product.discount" class="badge badge-discount" [@badgePulse]>
            <i class="bi bi-percent me-1"></i>{{product.discount}}% OFF
          </span>
          <span *ngIf="product.isFeatured" class="badge badge-featured" [@badgePulse]>
            <i class="bi bi-gem me-1"></i>Featured
          </span>
        </div>

        <!-- Quick Actions -->
        <div class="product-actions" [@actionsSlide]="hoverState">
          <button class="btn-action btn-wishlist" 
                  (click)="addToWishlist($event)"
                  [title]="isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'">
            <i class="bi" [class.bi-heart]="!isInWishlist" [class.bi-heart-fill]="isInWishlist"></i>
          </button>
          
          <button class="btn-action btn-quick-view" 
                  (click)="quickView($event)"
                  title="Quick View">
            <i class="bi bi-eye"></i>
          </button>
          
          <button class="btn-action btn-compare" 
                  (click)="addToCompare($event)"
                  title="Add to Compare">
            <i class="bi bi-arrow-left-right"></i>
          </button>
        </div>

        <!-- Image Gallery Dots -->
        <div class="image-dots" *ngIf="product.images.length > 1" [@dotsSlide]="hoverState">
          <button *ngFor="let image of product.images; let i = index"
                  class="dot"
                  [class.active]="i === currentImageIndex"
                  (click)="selectImage(i, $event)">
          </button>
        </div>

        <!-- Stock Status -->
        <div class="stock-status" *ngIf="!product.inStock" [@statusSlide]>
          <span class="badge bg-danger">
            <i class="bi bi-x-circle me-1"></i>Out of Stock
          </span>
        </div>

        <!-- Low Stock Warning -->
        <div class="stock-warning" *ngIf="product.inStock && product.stockQuantity <= 5" [@statusSlide]>
          <span class="badge bg-warning text-dark">
            <i class="bi bi-exclamation-triangle me-1"></i>Only {{product.stockQuantity}} left!
          </span>
        </div>

        <!-- Product Overlay -->
        <div class="product-overlay" [@overlayFade]="hoverState">
          <div class="overlay-content">
            <h6 class="overlay-title">{{product.name}}</h6>
            <p class="overlay-description">{{getShortDescription()}}</p>
            <div class="overlay-features" *ngIf="product.features.length > 0">
              <span *ngFor="let feature of product.features.slice(0, 3)" class="feature-tag">
                {{feature}}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Information -->
      <div class="product-info" [@infoSlide]>
        <!-- Category and Brand -->
        <div class="product-meta">
          <span class="product-category">{{product.category}}</span>
          <span class="product-brand">{{product.brand}}</span>
        </div>

        <!-- Product Name -->
        <h6 class="product-name" [title]="product.name">{{product.name}}</h6>
        
        <!-- Product Rating -->
        <div class="product-rating" [@ratingSlide]>
          <div class="stars">
            <i class="bi bi-star-fill" 
               *ngFor="let star of getStars(product.rating); let i = index"
               [@starTwinkle]="getStarDelay(i)"></i>
            <i class="bi bi-star" 
               *ngFor="let star of getEmptyStars(product.rating)"></i>
          </div>
          <span class="rating-text">
            {{product.rating}} <span class="review-count">({{product.reviewCount}})</span>
          </span>
        </div>
        
        <!-- Product Price -->
        <div class="product-price" [@priceSlide]>
          <span class="current-price">₹{{product.price | number:'1.2-2'}}</span>
          <span *ngIf="product.originalPrice" class="original-price">
            ₹{{product.originalPrice | number:'1.2-2'}}
          </span>
          <span *ngIf="product.discount" class="savings">
            Save ₹{{(product.originalPrice! - product.price) | number:'1.2-2'}}
          </span>
        </div>

        <!-- Product Features (Preview) -->
        <div class="product-features-preview" *ngIf="product.features.length > 0" [@featuresSlide]>
          <div class="features-list">
            <span *ngFor="let feature of product.features.slice(0, 2)" class="feature-item">
              <i class="bi bi-check-circle me-1"></i>{{feature}}
            </span>
            <span *ngIf="product.features.length > 2" class="more-features">
              +{{product.features.length - 2}} more
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="product-actions-bottom" [@actionsBottomSlide]>
          <button class="btn btn-add-cart flex-grow-1" 
                  (click)="addToCart($event)"
                  [disabled]="!product.inStock"
                  [@buttonPulse]="cartButtonState">
            <i class="bi" [class.bi-cart-plus]="!isAddingToCart" 
               [class.bi-check-circle-fill]="isAddingToCart"></i>
            <span class="ms-2">
              {{isAddingToCart ? 'Added!' : (product.inStock ? 'Add to Cart' : 'Out of Stock')}}
            </span>
          </button>
          
          <button class="btn btn-buy-now" 
                  (click)="buyNow($event)"
                  [disabled]="!product.inStock"
                  title="Buy Now">
            <i class="bi bi-lightning-charge"></i>
          </button>
        </div>

        <!-- Delivery Info -->
        <div class="delivery-info" [@deliverySlide]>
          <div class="delivery-item">
            <i class="bi bi-truck text-success"></i>
            <span>Free delivery</span>
          </div>
          <div class="delivery-item">
            <i class="bi bi-arrow-return-left text-info"></i>
            <span>30-day returns</span>
          </div>
        </div>
      </div>

      <!-- Hover Effect Background -->
      <div class="card-glow" [@glowEffect]="hoverState"></div>
      
      <!-- Loading State -->
      <div class="loading-overlay" *ngIf="isLoading" [@loadingFade]>
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      backdrop-filter: blur(20px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .product-card:hover {
      transform: translateY(-12px) scale(1.02);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(14, 165, 233, 0.3);
      border-color: rgba(14, 165, 233, 0.5);
    }

    /* Image Container */
    .product-image-container {
      position: relative;
      height: 250px;
      overflow: hidden;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .main-image {
      position: absolute;
      top: 0;
      left: 0;
    }

    .hover-image {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transform: scale(1.1);
    }

    .product-card:hover .main-image {
      opacity: 0;
      transform: scale(0.95);
    }

    .product-card:hover .hover-image {
      opacity: 1;
      transform: scale(1);
    }

    /* Badges */
    .product-badges {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      z-index: 10;
    }

    .badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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

    .badge-featured {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
    }

    /* Quick Actions */
    .product-actions {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      opacity: 0;
      transform: translateX(20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;
    }

    .product-card:hover .product-actions {
      opacity: 1;
      transform: translateX(0);
    }

    .btn-action {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.95);
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn-action:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-wishlist:hover {
      background: #fef2f2;
      color: #ef4444;
    }

    .btn-wishlist.active {
      background: #ef4444;
      color: white;
    }

    .btn-quick-view:hover {
      background: #eff6ff;
      color: #3b82f6;
    }

    .btn-compare:hover {
      background: #f0fdf4;
      color: #22c55e;
    }

    /* Image Dots */
    .image-dots {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .product-card:hover .image-dots {
      opacity: 1;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
    }

    .dot.active {
      background: white;
      transform: scale(1.2);
    }

    /* Stock Status */
    .stock-status,
    .stock-warning {
      position: absolute;
      bottom: 12px;
      right: 12px;
      z-index: 10;
    }

    /* Product Overlay */
    .product-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(15, 23, 42, 0.9) 0%,
        rgba(30, 41, 59, 0.95) 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      backdrop-filter: blur(10px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .product-card:hover .product-overlay {
      opacity: 1;
    }

    .overlay-content {
      text-align: center;
      color: white;
      padding: 2rem;
      transform: translateY(20px);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .product-card:hover .overlay-content {
      transform: translateY(0);
    }

    .overlay-title {
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: white;
    }

    .overlay-description {
      font-size: 0.9rem;
      opacity: 0.9;
      margin-bottom: 1rem;
      line-height: 1.5;
    }

    .overlay-features {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }

    .feature-tag {
      padding: 4px 8px;
      background: rgba(14, 165, 233, 0.2);
      border: 1px solid rgba(14, 165, 233, 0.3);
      border-radius: 12px;
      font-size: 0.7rem;
      color: #38bdf8;
    }

    /* Product Info */
    .product-info {
      padding: 1.5rem;
      background: white;
    }

    .product-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .product-category {
      color: #0ea5e9;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .product-brand {
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .product-name {
      font-weight: 700;
      margin-bottom: 0.75rem;
      line-height: 1.3;
      height: 2.6em;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      color: #1e293b;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .stars {
      color: #fbbf24;
      font-size: 0.9rem;
      display: flex;
      gap: 1px;
    }

    .rating-text {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }

    .review-count {
      color: #94a3b8;
    }

    .product-price {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .current-price {
      font-size: 1.25rem;
      font-weight: 800;
      color: #0ea5e9;
    }

    .original-price {
      font-size: 0.9rem;
      color: #94a3b8;
      text-decoration: line-through;
    }

    .savings {
      font-size: 0.8rem;
      color: #059669;
      font-weight: 600;
      padding: 2px 6px;
      background: #dcfce7;
      border-radius: 8px;
    }

    /* Features Preview */
    .product-features-preview {
      margin-bottom: 1rem;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .feature-item {
      font-size: 0.8rem;
      color: #64748b;
      display: flex;
      align-items: center;
    }

    .feature-item i {
      color: #059669;
      font-size: 0.7rem;
    }

    .more-features {
      font-size: 0.8rem;
      color: #0ea5e9;
      font-weight: 500;
      margin-top: 0.25rem;
    }

    /* Action Buttons */
    .product-actions-bottom {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .btn-add-cart {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      border: none;
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-add-cart:hover:not(:disabled) {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
    }

    .btn-add-cart:disabled {
      background: #e2e8f0;
      color: #94a3b8;
      cursor: not-allowed;
    }

    .btn-buy-now {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border: none;
      color: white;
      padding: 0.75rem;
      border-radius: 12px;
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .btn-buy-now:hover:not(:disabled) {
      background: linear-gradient(135deg, #d97706, #b45309);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
    }

    /* Delivery Info */
    .delivery-info {
      display: flex;
      justify-content: space-between;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }

    .delivery-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #64748b;
    }

    .delivery-item i {
      font-size: 0.9rem;
    }

    /* Card Glow Effect */
    .card-glow {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(
        45deg,
        #0ea5e9,
        #38bdf8,
        #06b6d4,
        #0ea5e9
      );
      border-radius: 22px;
      opacity: 0;
      z-index: -1;
      animation: glowRotate 3s linear infinite;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .card-glow {
      opacity: 0.6;
    }

    /* Loading Overlay */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(5px);
    }

    /* Animations */
    @keyframes glowRotate {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .product-image-container {
        height: 200px;
      }
      
      .product-info {
        padding: 1rem;
      }
      
      .product-overlay {
        display: none;
      }
      
      .product-actions {
        position: static;
        opacity: 1;
        transform: none;
        flex-direction: row;
        justify-content: flex-end;
        margin-bottom: 0.5rem;
      }
      
      .btn-action {
        width: 32px;
        height: 32px;
        font-size: 0.8rem;
      }
    }

    @media (max-width: 576px) {
      .product-card:hover {
        transform: translateY(-5px) scale(1.01);
      }
      
      .product-features-preview {
        display: none;
      }
      
      .delivery-info {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `],
  animations: [
    trigger('cardHover', [
      state('hover', style({
        transform: 'translateY(-12px) scale(1.02)'
      })),
      state('normal', style({
        transform: 'translateY(0) scale(1)'
      })),
      transition('normal => hover', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('hover => normal', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),

    trigger('imageTransition', [
      transition('* => *', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),

    trigger('badgeSlide', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('300ms 100ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),

    trigger('badgePulse', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),

    trigger('actionsSlide', [
      state('hover', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      state('normal', style({
        opacity: 0,
        transform: 'translateX(20px)'
      })),
      transition('normal => hover', animate('300ms ease-out')),
      transition('hover => normal', animate('200ms ease-in'))
    ]),

    trigger('dotsSlide', [
      state('hover', style({ opacity: 1 })),
      state('normal', style({ opacity: 0 })),
      transition('normal => hover', animate('300ms ease-out')),
      transition('hover => normal', animate('200ms ease-in'))
    ]),

    trigger('statusSlide', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),

    trigger('overlayFade', [
      state('hover', style({ opacity: 1 })),
      state('normal', style({ opacity: 0 })),
      transition('normal => hover', animate('400ms ease-out')),
      transition('hover => normal', animate('300ms ease-in'))
    ]),

    trigger('infoSlide', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('400ms 200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),

    trigger('ratingSlide', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('300ms 300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),

    trigger('starTwinkle', [
      transition(':enter', [
        style({ transform: 'scale(0) rotate(180deg)', opacity: 0 }),
        animate('{{delay}}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'scale(1) rotate(0deg)', opacity: 1 }))
      ], { params: { delay: 0 } })
    ]),

    trigger('priceSlide', [
      transition(':enter', [
        style({ transform: 'translateX(20px)', opacity: 0 }),
        animate('300ms 400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),

    trigger('featuresSlide', [
      transition(':enter', [
        style({ transform: 'translateY(10px)', opacity: 0 }),
        animate('300ms 500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),

    trigger('actionsBottomSlide', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms 600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),

    trigger('buttonPulse', [
      state('adding', style({ transform: 'scale(0.95)' })),
      state('normal', style({ transform: 'scale(1)' })),
      state('added', style({ transform: 'scale(1.05)' })),
      transition('normal => adding', animate('150ms ease-in')),
      transition('adding => added', animate('200ms ease-out')),
      transition('added => normal', animate('300ms ease-out'))
    ]),

    trigger('deliverySlide', [
      transition(':enter', [
        style({ transform: 'translateY(10px)', opacity: 0 }),
        animate('300ms 700ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),

    trigger('glowEffect', [
      state('hover', style({ opacity: 0.6 })),
      state('normal', style({ opacity: 0 })),
      transition('normal => hover', animate('300ms ease-out')),
      transition('hover => normal', animate('300ms ease-in'))
    ]),

    trigger('loadingFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Input() showOverlay = true;
  @Input() showQuickActions = true;
  @Output() productClick = new EventEmitter<Product>();
  @Output() addToCartClick = new EventEmitter<Product>();
  @Output() addToWishlistClick = new EventEmitter<Product>();
  @Output() quickViewClick = new EventEmitter<Product>();

  hoverState = 'normal';
  imageState = 'normal';
  cartButtonState = 'normal';
  currentImageIndex = 0;
  currentImage = '';
  isInWishlist = false;
  isAddingToCart = false;
  isLoading = false;

  private hoverTimeout?: number;

  ngOnInit(): void {
    this.currentImage = this.product.images[0] || '';
    this.checkWishlistStatus();
  }

  ngOnDestroy(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  }

  onMouseEnter(): void {
    this.hoverState = 'hover';
    this.imageState = 'hover';
  }

  onMouseLeave(): void {
    this.hoverState = 'normal';
    this.imageState = 'normal';
  }

  selectImage(index: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.currentImageIndex = index;
    this.currentImage = this.product.images[index];
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.product.inStock || this.isAddingToCart) {
      return;
    }

    this.isAddingToCart = true;
    this.cartButtonState = 'adding';
    
    // Simulate API call
    setTimeout(() => {
      this.cartButtonState = 'added';
      this.addToCartClick.emit(this.product);
      
      setTimeout(() => {
        this.isAddingToCart = false;
        this.cartButtonState = 'normal';
      }, 1000);
    }, 500);
  }

  addToWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isInWishlist = !this.isInWishlist;
    this.addToWishlistClick.emit(this.product);
    
    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  quickView(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.quickViewClick.emit(this.product);
  }

  addToCompare(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Add to compare:', this.product.name);
    // Implement compare functionality
  }

  buyNow(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (!this.product.inStock) {
      return;
    }
    
    // Navigate to checkout with this product
    console.log('Buy now:', this.product.name);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  getStarDelay(index: number): string {
    return `${index * 100}ms`;
  }

  getShortDescription(): string {
    if (this.product.description.length <= 100) {
      return this.product.description;
    }
    return this.product.description.substring(0, 100) + '...';
  }

  private checkWishlistStatus(): void {
    // Check if product is in wishlist
    // This would typically check against a service
    this.isInWishlist = false; // Default to false
  }
}