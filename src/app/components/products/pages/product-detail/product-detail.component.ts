// src/app/components/products/pages/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { ProductCardComponent } from '../../../product-card/product-card.component';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent],
  template: `
    <div class="product-detail-page" *ngIf="!loading">
      <!-- Breadcrumb -->
      <div class="container-fluid">
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
            <li class="breadcrumb-item"><a routerLink="/products">Products</a></li>
            <li class="breadcrumb-item"><a [routerLink]="['/products']" [queryParams]="{category: product?.categoryId}">{{product?.category}}</a></li>
            <li class="breadcrumb-item active">{{product?.name}}</li>
          </ol>
        </nav>
      </div>

      <div class="container-fluid" *ngIf="product">
        <div class="row">
          <!-- Product Images -->
          <div class="col-lg-6">
            <div class="product-images">
              <div class="main-image-container">
                <img [src]="selectedImage" [alt]="product.name" class="main-image">
                
                <!-- Badges -->
                <div class="product-badges">
                  <span *ngIf="product.isNew" class="badge badge-new">New</span>
                  <span *ngIf="product.isBestSeller" class="badge badge-bestseller">Best Seller</span>
                  <span *ngIf="product.discount" class="badge badge-discount">-{{product.discount}}%</span>
                </div>

                <!-- Image Navigation -->
                <div class="image-nav" *ngIf="product.images.length > 1">
                  <button class="btn btn-nav btn-prev" (click)="previousImage()" [disabled]="currentImageIndex === 0">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <button class="btn btn-nav btn-next" (click)="nextImage()" [disabled]="currentImageIndex === product.images.length - 1">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>

              <!-- Thumbnail Images -->
              <div class="thumbnail-images" *ngIf="product.images.length > 1">
                <div 
                  class="thumbnail"
                  *ngFor="let image of product.images; let i = index"
                  [class.active]="i === currentImageIndex"
                  (click)="selectImage(i)">
                  <img [src]="image" [alt]="product.name">
                </div>
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="col-lg-6">
            <div class="product-info">
              <div class="product-header">
                <div class="product-category">{{product.category}}</div>
                <h1 class="product-title">{{product.name}}</h1>
                
                <div class="product-rating">
                  <div class="stars">
                    <i class="bi bi-star-fill" *ngFor="let star of getStars(product.rating)"></i>
                    <i class="bi bi-star" *ngFor="let star of getEmptyStars(product.rating)"></i>
                  </div>
                  <span class="rating-text">{{product.rating}} ({{product.reviewCount}} reviews)</span>
                </div>
              </div>

              <div class="product-price">
                <span class="current-price">\${{product.price | number:'1.2-2'}}</span>
                <span *ngIf="product.originalPrice" class="original-price">\${{product.originalPrice | number:'1.2-2'}}</span>
                <span *ngIf="product.discount" class="savings">You save \${{(product.originalPrice! - product.price) | number:'1.2-2'}}</span>
              </div>

              <div class="product-description">
                <p>{{product.description}}</p>
              </div>

              <!-- Key Features -->
              <div class="key-features" *ngIf="product.features.length > 0">
                <h6>Key Features:</h6>
                <ul>
                  <li *ngFor="let feature of product.features">{{feature}}</li>
                </ul>
              </div>

              <!-- Stock Status -->
              <div class="stock-info">
                <div class="stock-status" [class.in-stock]="product.inStock" [class.out-of-stock]="!product.inStock">
                  <i class="bi" [class.bi-check-circle-fill]="product.inStock" [class.bi-x-circle-fill]="!product.inStock"></i>
                  <span *ngIf="product.inStock">In Stock ({{product.stockQuantity}} available)</span>
                  <span *ngIf="!product.inStock">Out of Stock</span>
                </div>
              </div>

              <!-- Purchase Options -->
              <div class="purchase-options">
                <div class="quantity-selector" *ngIf="product.inStock">
                  <label>Quantity:</label>
                  <div class="quantity-input">
                    <button class="btn btn-outline-secondary" (click)="decreaseQuantity()" [disabled]="quantity <= 1">-</button>
                    <input type="number" class="form-control" [(ngModel)]="quantity" [max]="product.stockQuantity" min="1">
                    <button class="btn btn-outline-secondary" (click)="increaseQuantity()" [disabled]="quantity >= product.stockQuantity">+</button>
                  </div>
                </div>

                <div class="action-buttons">
                  <button 
                    class="btn btn-primary btn-add-cart"
                    (click)="addToCart()"
                    [disabled]="!product.inStock">
                    <i class="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </button>
                  <button class="btn btn-outline-secondary btn-wishlist" (click)="addToWishlist()">
                    <i class="bi bi-heart me-2"></i>
                    Add to Wishlist
                  </button>
                </div>

                <div class="quick-actions">
                  <button class="btn btn-outline-primary">
                    <i class="bi bi-lightning me-2"></i>
                    Buy Now
                  </button>
                  <button class="btn btn-outline-secondary">
                    <i class="bi bi-share me-2"></i>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Details Tabs -->
        <div class="row mt-5">
          <div class="col-12">
            <div class="product-tabs">
              <ul class="nav nav-tabs" id="productTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="specifications-tab" data-bs-toggle="tab" data-bs-target="#specifications" type="button" role="tab">
                    <i class="bi bi-list-check me-2"></i>Specifications
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab">
                    <i class="bi bi-star me-2"></i>Reviews ({{product.reviewCount}})
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="shipping-tab" data-bs-toggle="tab" data-bs-target="#shipping" type="button" role="tab">
                    <i class="bi bi-truck me-2"></i>Shipping & Returns
                  </button>
                </li>
              </ul>
              
              <div class="tab-content" id="productTabsContent">
                <!-- Specifications Tab -->
                <div class="tab-pane fade show active" id="specifications" role="tabpanel">
                  <div class="specifications-content">
                    <div class="row">
                      <div class="col-md-6" *ngFor="let spec of getSpecificationEntries()">
                        <div class="spec-item">
                          <span class="spec-label">{{spec.key}}:</span>
                          <span class="spec-value">{{spec.value}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Reviews Tab -->
                <div class="tab-pane fade" id="reviews" role="tabpanel">
                  <div class="reviews-content">
                    <div class="reviews-summary">
                      <div class="rating-overview">
                        <div class="average-rating">
                          <span class="rating-number">{{product.rating}}</span>
                          <div class="stars">
                            <i class="bi bi-star-fill" *ngFor="let star of getStars(product.rating)"></i>
                            <i class="bi bi-star" *ngFor="let star of getEmptyStars(product.rating)"></i>
                          </div>
                          <span class="review-count">Based on {{product.reviewCount}} reviews</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Sample Reviews -->
                    <div class="reviews-list">
                      <div class="review-item" *ngFor="let review of sampleReviews">
                        <div class="review-header">
                          <div class="reviewer-info">
                            <div class="reviewer-avatar">{{review.name.charAt(0)}}</div>
                            <div class="reviewer-details">
                              <div class="reviewer-name">{{review.name}}</div>
                              <div class="review-date">{{review.date}}</div>
                            </div>
                          </div>
                          <div class="review-rating">
                            <i class="bi bi-star-fill" *ngFor="let star of getStars(review.rating)"></i>
                            <i class="bi bi-star" *ngFor="let star of getEmptyStars(review.rating)"></i>
                          </div>
                        </div>
                        <div class="review-content">
                          <p>{{review.comment}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Shipping Tab -->
                <div class="tab-pane fade" id="shipping" role="tabpanel">
                  <div class="shipping-content">
                    <div class="row">
                      <div class="col-md-6">
                        <h6><i class="bi bi-truck me-2"></i>Shipping Information</h6>
                        <ul>
                          <li>Free standard shipping on orders over $50</li>
                          <li>Express shipping available for $9.99</li>
                          <li>Same-day delivery in select areas</li>
                          <li>International shipping available</li>
                        </ul>
                      </div>
                      <div class="col-md-6">
                        <h6><i class="bi bi-arrow-return-left me-2"></i>Return Policy</h6>
                        <ul>
                          <li>30-day return policy</li>
                          <li>Free returns for defective items</li>
                          <li>Return shipping costs may apply</li>
                          <li>Items must be in original condition</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div class="row mt-5" *ngIf="relatedProducts.length > 0">
          <div class="col-12">
            <div class="related-products">
              <h3><i class="bi bi-grid me-2"></i>Related Products</h3>
              <div class="row">
                <div class="col-lg-3 col-md-6 mb-4" *ngFor="let relatedProduct of relatedProducts">
                  <app-product-card [product]="relatedProduct"></app-product-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="loading">
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading product details...</p>
      </div>
    </div>

    <!-- Not Found State -->
    <div class="not-found-container" *ngIf="!loading && !product">
      <div class="text-center py-5">
        <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
        <h3>Product Not Found</h3>
        <p class="text-muted">The product you're looking for doesn't exist or has been removed.</p>
        <a routerLink="/products" class="btn btn-primary">
          <i class="bi bi-arrow-left me-2"></i>Back to Products
        </a>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-page {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      min-height: 100vh;
      padding: 20px 0;
    }

    .breadcrumb {
      background: none;
      padding: 0;
      margin-bottom: 0;
    }

    .breadcrumb-item a {
      color: #007bff;
      text-decoration: none;
    }

    .breadcrumb-item.active {
      color: #6c757d;
    }

    /* Product Images */
    .product-images {
      position: sticky;
      top: 20px;
    }

    .main-image-container {
      position: relative;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 15px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .main-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
    }

    .product-badges {
      position: absolute;
      top: 15px;
      left: 15px;
      display: flex;
      flex-direction: column;
      gap: 8px;
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

    .image-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
    }

    .btn-nav {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .btn-nav:hover:not(:disabled) {
      background: white;
      transform: scale(1.1);
    }

    .btn-nav:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .thumbnail-images {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding: 5px 0;
    }

    .thumbnail {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .thumbnail.active {
      border-color: #007bff;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Product Info */
    .product-info {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }

    .product-category {
      color: #007bff;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .product-title {
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 15px;
      line-height: 1.3;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .stars {
      color: #ffc107;
      font-size: 1.1rem;
    }

    .rating-text {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .product-price {
      margin-bottom: 25px;
    }

    .current-price {
      font-size: 2rem;
      font-weight: 700;
      color: #007bff;
      margin-right: 15px;
    }

    .original-price {
      font-size: 1.2rem;
      color: #6c757d;
      text-decoration: line-through;
      margin-right: 15px;
    }

    .savings {
      color: #28a745;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .product-description {
      color: #495057;
      line-height: 1.6;
      margin-bottom: 25px;
    }

    .key-features {
      margin-bottom: 25px;
    }

    .key-features h6 {
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .key-features ul {
      list-style: none;
      padding: 0;
    }

    .key-features li {
      padding: 5px 0;
      color: #495057;
      position: relative;
      padding-left: 20px;
    }

    .key-features li:before {
      content: "✓";
      color: #28a745;
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    .stock-info {
      margin-bottom: 25px;
    }

    .stock-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }

    .stock-status.in-stock {
      color: #28a745;
    }

    .stock-status.out-of-stock {
      color: #dc3545;
    }

    .purchase-options > div {
      margin-bottom: 20px;
    }

    .quantity-selector {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .quantity-input {
      display: flex;
      align-items: center;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      overflow: hidden;
    }

    .quantity-input button {
      width: 40px;
      height: 40px;
      border: none;
      background: #f8f9fa;
      border-radius: 0;
    }

    .quantity-input input {
      width: 60px;
      text-align: center;
      border: none;
      height: 40px;
    }

    .action-buttons {
      display: flex;
      gap: 15px;
    }

    .btn-add-cart {
      background: linear-gradient(135deg, #007bff, #0056b3);
      border: none;
      padding: 12px 30px;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-add-cart:hover:not(:disabled) {
      background: linear-gradient(135deg, #0056b3, #004085);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
    }

    .btn-wishlist {
      padding: 12px 30px;
      font-weight: 600;
    }

    .quick-actions {
      display: flex;
      gap: 15px;
    }

    /* Product Tabs */
    .product-tabs {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .nav-tabs {
      border-bottom: 2px solid #f8f9fa;
      padding: 0 20px;
    }

    .nav-tabs .nav-link {
      border: none;
      border-radius: 0;
      color: #6c757d;
      font-weight: 600;
      padding: 20px 25px;
      transition: all 0.3s ease;
    }

    .nav-tabs .nav-link.active {
      color: #007bff;
      background: none;
      border-bottom: 3px solid #007bff;
    }

    .tab-content {
      padding: 30px;
    }

    .spec-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f8f9fa;
    }

    .spec-label {
      font-weight: 600;
      color: #495057;
    }

    .spec-value {
      color: #6c757d;
    }

    /* Reviews */
    .rating-overview {
      text-align: center;
      padding: 30px;
      background: #f8f9fa;
      border-radius: 12px;
      margin-bottom: 30px;
    }

    .rating-number {
      font-size: 3rem;
      font-weight: 700;
      color: #007bff;
      display: block;
    }

    .review-item {
      border-bottom: 1px solid #f8f9fa;
      padding: 20px 0;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .reviewer-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .reviewer-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .reviewer-name {
      font-weight: 600;
      color: #2c3e50;
    }

    .review-date {
      color: #6c757d;
      font-size: 0.9rem;
    }

    /* Related Products */
    .related-products {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .related-products h3 {
      color: #2c3e50;
      font-weight: 700;
      margin-bottom: 25px;
    }

    /* Loading and Error States */
    .loading-container,
    .not-found-container {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Mobile Responsiveness */
    @media (max-width: 768px) {
      .product-title {
        font-size: 1.5rem;
      }

      .current-price {
        font-size: 1.5rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .quick-actions {
        flex-direction: column;
      }

      .main-image {
        height: 300px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  quantity = 1;
  selectedImage = '';
  currentImageIndex = 0;

  sampleReviews = [
    {
      name: 'John Smith',
      rating: 5,
      date: 'March 15, 2024',
      comment: 'Excellent product! Works exactly as described and arrived quickly.'
    },
    {
      name: 'Sarah Johnson',
      rating: 4,
      date: 'March 10, 2024',
      comment: 'Great value for money. Minor issue with packaging but product is perfect.'
    },
    {
      name: 'Mike Chen',
      rating: 5,
      date: 'March 5, 2024',
      comment: 'Outstanding quality and performance. Highly recommended!'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id']);
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.selectedImage = product.images[0];
          this.currentImageIndex = 0;
          this.loadRelatedProducts(product.id);
        } else {
          this.product = null;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.product = null;
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(productId: number): void {
    this.productService.getRelatedProducts(productId).subscribe({
      next: (products) => {
        this.relatedProducts = products;
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  selectImage(index: number): void {
    if (this.product && index >= 0 && index < this.product.images.length) {
      this.currentImageIndex = index;
      this.selectedImage = this.product.images[index];
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.selectImage(this.currentImageIndex - 1);
    }
  }

  nextImage(): void {
    if (this.product && this.currentImageIndex < this.product.images.length - 1) {
      this.selectImage(this.currentImageIndex + 1);
    }
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product && this.product.inStock) {
      console.log(`Adding ${this.quantity} of ${this.product.name} to cart`);
      // TODO: Implement add to cart functionality
    }
  }

  addToWishlist(): void {
    if (this.product) {
      console.log(`Adding ${this.product.name} to wishlist`);
      // TODO: Implement add to wishlist functionality
    }
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  getSpecificationEntries(): {key: string, value: string}[] {
    if (!this.product) return [];
    return Object.entries(this.product.specifications).map(([key, value]) => ({ key, value }));
  }
}