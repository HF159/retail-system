// src/app/components/wishlist/wishlist.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { WishlistItem } from '../../models/wishlist.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="wishlist-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="page-title">
                <i class="bi bi-heart-fill me-3"></i>
                My Wishlist
              </h1>
              <p class="page-subtitle" *ngIf="wishlistItems.length > 0">
                {{wishlistItems.length}} {{wishlistItems.length === 1 ? 'item' : 'items'}} saved for later
              </p>
            </div>
            <div class="col-md-4 text-md-end">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
                  <li class="breadcrumb-item active">Wishlist</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div class="container py-4">
        <!-- Empty Wishlist State -->
        <div class="empty-wishlist" *ngIf="wishlistItems.length === 0">
          <div class="text-center py-5">
            <div class="empty-icon mb-4">
              <i class="bi bi-heart display-1 text-muted"></i>
            </div>
            <h3 class="mb-3">Your wishlist is empty</h3>
            <p class="text-muted mb-4">
              Save items you love to your wishlist and buy them later
            </p>
            <div class="empty-actions">
              <a routerLink="/products" class="btn btn-primary btn-lg me-3">
                <i class="bi bi-grid-3x3-gap me-2"></i>
                Browse Products
              </a>
              <a routerLink="/deals" class="btn btn-outline-primary btn-lg">
                <i class="bi bi-lightning me-2"></i>
                View Deals
              </a>
            </div>
          </div>
        </div>

        <!-- Wishlist Items -->
        <div class="wishlist-content" *ngIf="wishlistItems.length > 0">
          <!-- Wishlist Actions -->
          <div class="wishlist-actions mb-4">
            <div class="row align-items-center">
              <div class="col-md-6">
                <div class="items-count">
                  <strong>{{wishlistItems.length}}</strong> 
                  {{wishlistItems.length === 1 ? 'item' : 'items'}} in your wishlist
                </div>
              </div>
              <div class="col-md-6 text-md-end">
                <button 
                  class="btn btn-outline-danger"
                  (click)="clearWishlist()"
                  [disabled]="isLoading">
                  <i class="bi bi-trash me-2"></i>
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <!-- Wishlist Grid -->
          <div class="row g-4">
            <div class="col-lg-6" *ngFor="let item of wishlistItems; trackBy: trackByItemId">
              <div class="wishlist-item">
                <div class="item-image">
                  <img 
                    [src]="item.product.images[0]" 
                    [alt]="item.product.name"
                    class="product-image"
                    [routerLink]="['/products', item.product.id]">
                  
                  <!-- Product Badges -->
                  <div class="product-badges">
                    <span *ngIf="item.product.isNew" class="badge badge-new">New</span>
                    <span *ngIf="item.product.isBestSeller" class="badge badge-bestseller">Best Seller</span>
                    <span *ngIf="item.product.discount" class="badge badge-discount">
                      -{{item.product.discount}}%
                    </span>
                  </div>

                  <!-- Quick Remove -->
                  <button 
                    class="btn btn-remove"
                    (click)="removeFromWishlist(item.product.id)"
                    title="Remove from wishlist">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>

                <div class="item-details">
                  <div class="item-info">
                    <div class="product-category">{{item.product.category}}</div>
                    <h5 class="product-name">
                      <a [routerLink]="['/products', item.product.id]">{{item.product.name}}</a>
                    </h5>
                    
                    <div class="product-rating mb-2">
                      <div class="stars">
                        <i class="bi bi-star-fill" *ngFor="let star of getStars(item.product.rating)"></i>
                        <i class="bi bi-star" *ngFor="let star of getEmptyStars(item.product.rating)"></i>
                      </div>
                      <span class="rating-count">({{item.product.reviewCount}})</span>
                    </div>

                    <div class="product-price mb-3">
                      <span class="current-price">\${{item.product.price | number:'1.2-2'}}</span>
                      <span 
                        *ngIf="item.product.originalPrice" 
                        class="original-price">
                        \${{item.product.originalPrice | number:'1.2-2'}}
                      </span>
                    </div>

                    <div class="date-added text-muted small mb-3">
                      Added {{formatDate(item.dateAdded)}}
                    </div>
                  </div>

                  <div class="item-actions">
                    <div class="stock-status mb-2" 
                         [class.in-stock]="item.product.inStock" 
                         [class.out-of-stock]="!item.product.inStock">
                      <i class="bi" 
                         [class.bi-check-circle-fill]="item.product.inStock" 
                         [class.bi-x-circle-fill]="!item.product.inStock"></i>
                      <span *ngIf="item.product.inStock">In Stock</span>
                      <span *ngIf="!item.product.inStock">Out of Stock</span>
                    </div>

                    <div class="action-buttons">
                      <button 
                        class="btn btn-primary btn-sm w-100 mb-2"
                        (click)="moveToCart(item)"
                        [disabled]="!item.product.inStock || isLoading">
                        <i class="bi bi-cart-plus me-2"></i>
                        {{item.product.inStock ? 'Add to Cart' : 'Out of Stock'}}
                      </button>
                      
                      <div class="btn-group w-100" role="group">
                        <button 
                          class="btn btn-outline-secondary btn-sm"
                          [routerLink]="['/products', item.product.id]">
                          <i class="bi bi-eye me-1"></i>
                          View
                        </button>
                        <button 
                          class="btn btn-outline-danger btn-sm"
                          (click)="removeFromWishlist(item.product.id)">
                          <i class="bi bi-trash me-1"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Continue Shopping -->
          <div class="continue-shopping mt-5 text-center">
            <a routerLink="/products" class="btn btn-outline-primary">
              <i class="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast (you can integrate with a toast service) -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div 
        class="toast" 
        *ngIf="showToast"
        [class.show]="showToast">
        <div class="toast-header">
          <i class="bi bi-check-circle-fill text-success me-2"></i>
          <strong class="me-auto">Success</strong>
          <button type="button" class="btn-close" (click)="hideToast()"></button>
        </div>
        <div class="toast-body">
          {{toastMessage}}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .page-header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 60px 0 40px;
      margin-bottom: 0;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .page-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 0;
    }

    .breadcrumb {
      background: none;
      margin-bottom: 0;
    }

    .breadcrumb-item a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
    }

    .breadcrumb-item.active {
      color: white;
    }

    /* Empty Wishlist */
    .empty-wishlist {
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin: 2rem 0;
    }

    .empty-icon {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 50%;
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    /* Wishlist Actions */
    .wishlist-actions {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .items-count {
      font-size: 1.1rem;
      color: #495057;
    }

    /* Wishlist Items */
    .wishlist-item {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      display: flex;
      height: 280px;
    }

    .wishlist-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .item-image {
      position: relative;
      width: 200px;
      flex-shrink: 0;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .product-image:hover {
      transform: scale(1.05);
    }

    .product-badges {
      position: absolute;
      top: 10px;
      left: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-new {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
    }

    .badge-bestseller {
      background: linear-gradient(135deg, #ffc107, #fd7e14);
      color: white;
    }

    .badge-discount {
      background: linear-gradient(135deg, #dc3545, #e83e8c);
      color: white;
    }

    .btn-remove {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(220, 53, 69, 0.9);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.3s ease;
    }

    .wishlist-item:hover .btn-remove {
      opacity: 1;
    }

    .btn-remove:hover {
      background: #dc3545;
      transform: scale(1.1);
    }

    .item-details {
      flex: 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .product-category {
      color: #6c757d;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }

    .product-name a {
      color: #2c3e50;
      text-decoration: none;
      font-weight: 600;
      line-height: 1.3;
    }

    .product-name a:hover {
      color: #007bff;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stars {
      color: #ffc107;
      font-size: 0.9rem;
    }

    .rating-count {
      color: #6c757d;
      font-size: 0.8rem;
    }

    .product-price {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .current-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #007bff;
    }

    .original-price {
      font-size: 1rem;
      color: #6c757d;
      text-decoration: line-through;
    }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .stock-status.in-stock {
      color: #28a745;
    }

    .stock-status.out-of-stock {
      color: #dc3545;
    }

    .action-buttons .btn {
      font-weight: 500;
    }

    /* Toast Styles */
    .toast {
      background: white;
      border: 1px solid #dee2e6;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }

      .wishlist-item {
        flex-direction: column;
        height: auto;
      }

      .item-image {
        width: 100%;
        height: 200px;
      }

      .item-details {
        padding: 15px;
      }

      .wishlist-actions {
        text-align: center;
      }

      .wishlist-actions .row {
        flex-direction: column;
        gap: 15px;
      }
    }

    @media (max-width: 576px) {
      .page-header {
        padding: 40px 0 30px;
      }

      .page-title {
        font-size: 1.75rem;
      }

      .empty-actions .btn {
        display: block;
        width: 100%;
        margin-bottom: 10px;
      }
    }
  `]
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: WishlistItem[] = [];
  isLoading = false;
  showToast = false;
  toastMessage = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadWishlistItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadWishlistItems(): void {
    this.wishlistService.getWishlistItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.wishlistItems = items;
      });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
    this.showToastMessage('Item removed from wishlist');
  }

  moveToCart(item: WishlistItem): void {
    this.isLoading = true;
    
    // Add to cart
    this.cartService.addToCart(item.product, 1);
    
    // Remove from wishlist
    this.wishlistService.removeFromWishlist(item.product.id);
    
    this.isLoading = false;
    this.showToastMessage('Item moved to cart');
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlistService.clearWishlist();
      this.showToastMessage('Wishlist cleared');
    }
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'today';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  trackByItemId(index: number, item: WishlistItem): string {
    return item.id;
  }

  private showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  hideToast(): void {
    this.showToast = false;
  }
}