// src/app/components/header/header.component.ts
import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Category, Product, CartItem } from '../../models/product.model';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="main-header" [class.scrolled]="isScrolled">
      

      <!-- Main Navigation -->
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <!-- Brand Logo -->
          <a class="navbar-brand" routerLink="/">
            <div class="brand-container">
              <div class="brand-icon">
                <i class="bi bi-lightning-charge-fill"></i>
              </div>
              <div class="brand-text">
                <span class="brand-name">TechNova</span>
                <span class="brand-tagline">Tech Excellence</span>
              </div>
            </div>
          </a>

          <!-- Mobile Menu Toggle -->
          <button 
            class="navbar-toggler" 
            type="button" 
            [attr.aria-expanded]="mobileMenuOpen"
            (click)="toggleMobileMenu()">
            <span class="navbar-toggler-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>

          <!-- Navigation Content -->
          <div class="collapse navbar-collapse" 
               [class.show]="mobileMenuOpen" 
               id="navbarNav">
            
            <!-- Primary Navigation -->
            <ul class="navbar-nav me-auto">
              <!-- Home -->
              <li class="nav-item">
                <a class="nav-link" 
                   routerLink="/" 
                   routerLinkActive="active" 
                   [routerLinkActiveOptions]="{exact: true}"
                   (click)="closeMobileMenu()">
                  <i class="bi bi-house me-2"></i>
                  <span>Home</span>
                </a>
              </li>
              
              <!-- Products Mega Menu -->
              <li class="nav-item dropdown mega-dropdown" 
                  (mouseenter)="showMegaMenu()" 
                  (mouseleave)="hideMegaMenu()">
                <a class="nav-link dropdown-toggle" 
                   href="#" 
                   id="productsDropdown" 
                   role="button"
                   [attr.aria-expanded]="megaMenuOpen"
                   (click)="$event.preventDefault()">
                  <i class="bi bi-grid-3x3-gap me-2"></i>
                  <span>Products</span>
                </a>
                
                <!-- Mega Menu Content -->
                <div class="mega-menu" [class.show]="megaMenuOpen">
                  <div class="container-fluid">
                    <div class="row">
                      <!-- Categories Column -->
                      <div class="col-lg-3">
                        <h6 class="mega-menu-title">
                          <i class="bi bi-grid me-2"></i>
                          Shop by Category
                        </h6>
                        <div class="category-list">
                          <a *ngFor="let category of categories; trackBy: trackByCategory" 
                             class="category-item"
                             [routerLink]="['/products']"
                             [queryParams]="{category: category.id}"
                             (click)="closeMegaMenu()">
                            <div class="category-icon">
                              <i class="bi" [class]="'bi-' + category.icon"></i>
                            </div>
                            <div class="category-info">
                              <span class="category-name">{{category.name}}</span>
                              <small class="category-count">{{category.productCount}} items</small>
                            </div>
                            <i class="bi bi-arrow-right category-arrow"></i>
                          </a>
                        </div>
                      </div>
                      
                      <!-- Featured Products Column -->
                      <div class="col-lg-4">
                        <h6 class="mega-menu-title">
                          <i class="bi bi-star me-2"></i>
                          Featured Products
                        </h6>
                        <div class="featured-products">
                          <div *ngFor="let product of featuredProducts; trackBy: trackByProduct" 
                               class="featured-product-item"
                               [routerLink]="['/products', product.id]"
                               (click)="closeMegaMenu()">
                            <div class="product-image">
                              <img [src]="product.images[0]" [alt]="product.name">
                              <div class="product-badge" *ngIf="product.discount">
                                -{{product.discount}}%
                              </div>
                            </div>
                            <div class="product-details">
                              <h6 class="product-name">{{product.name}}</h6>
                              <div class="product-price">
                                <span class="current-price">\${{product.price | number:'1.2-2'}}</span>
                                <span *ngIf="product.originalPrice" class="original-price">
                                  \${{product.originalPrice | number:'1.2-2'}}
                                </span>
                              </div>
                              <div class="product-rating">
                                <div class="stars">
                                  <i class="bi bi-star-fill" *ngFor="let star of getStars(product.rating)"></i>
                                </div>
                                <span class="rating-count">({{product.reviewCount}})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Quick Links Column -->
                      <div class="col-lg-3">
                        <h6 class="mega-menu-title">
                          <i class="bi bi-lightning me-2"></i>
                          Quick Links
                        </h6>
                        <div class="quick-links">
                          <a class="quick-link-item" 
                             [routerLink]="['/products']" 
                             [queryParams]="{sortBy: 'newest'}"
                             (click)="closeMegaMenu()">
                            <i class="bi bi-star-fill"></i>
                            <span>New Arrivals</span>
                          </a>
                          <a class="quick-link-item" 
                             [routerLink]="['/products']" 
                             [queryParams]="{sortBy: 'rating-desc'}"
                             (click)="closeMegaMenu()">
                            <i class="bi bi-trophy-fill"></i>
                            <span>Best Sellers</span>
                          </a>
                          <a class="quick-link-item" 
                             [routerLink]="['/products']" 
                             [queryParams]="{maxPrice: 100}"
                             (click)="closeMegaMenu()">
                            <i class="bi bi-tag-fill"></i>
                            <span>Under \$100</span>
                          </a>
                          <a class="quick-link-item" 
                             [routerLink]="['/deals']"
                             (click)="closeMegaMenu()">
                            <i class="bi bi-lightning-charge-fill"></i>
                            <span>Special Deals</span>
                          </a>
                        </div>
                      </div>
                      
                      <!-- Promotional Banner Column -->
                      <div class="col-lg-2">
                        <div class="promo-banner">
                          <div class="promo-content">
                            <h6>Special Offer!</h6>
                            <p>Get 20% off on all gaming accessories</p>
                            <a class="btn btn-promo" [routerLink]="['/deals']" (click)="closeMegaMenu()">
                              Shop Now
                            </a>
                          </div>
                          <div class="promo-decoration">
                            <i class="bi bi-gift"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <!-- Deals -->
              <li class="nav-item">
                <a class="nav-link" 
                   routerLink="/deals" 
                   routerLinkActive="active"
                   (click)="closeMobileMenu()">
                  <i class="bi bi-lightning me-2"></i>
                  <span>Deals</span>
                  <span class="nav-badge">Hot</span>
                </a>
              </li>
            </ul>

            <!-- Search Bar -->
            <div class="search-container me-3">
              <div class="search-wrapper">
                <div class="search-input-group">
                  <input type="search" 
                         class="form-control search-input" 
                         placeholder="Search for products, brands, and more..."
                         [(ngModel)]="searchQuery"
                         (focus)="onSearchFocus()"
                         (blur)="onSearchBlur()"
                         (input)="onSearchInput()"
                         (keyup.enter)="performSearch()"
                         #searchInput>
                  
                  <button class="search-btn" 
                          type="button" 
                          (click)="performSearch()">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
                
                <!-- Search Dropdown -->
                <div class="search-dropdown" 
                     *ngIf="showSearchResults && (searchResults.length > 0 || searchQuery.length > 0)">
                  
                  <!-- Search Suggestions -->
                  <div class="search-section" *ngIf="searchSuggestions.length > 0 && searchQuery.length === 0">
                    <div class="search-section-header">
                      <i class="bi bi-clock-history me-2"></i>
                      Recent Searches
                    </div>
                    <div class="search-suggestions">
                      <button *ngFor="let suggestion of searchSuggestions"
                              class="search-suggestion-item"
                              (click)="selectSuggestion(suggestion)">
                        <i class="bi bi-search me-2"></i>
                        {{suggestion}}
                      </button>
                    </div>
                  </div>

                  <!-- Product Results -->
                  <div class="search-section" *ngIf="searchResults.length > 0">
                    <div class="search-section-header">
                      <i class="bi bi-box me-2"></i>
                      Products ({{searchResults.length}})
                    </div>
                    <div class="search-results">
                      <a *ngFor="let product of searchResults.slice(0, 5); trackBy: trackByProduct" 
                         class="search-result-item"
                         [routerLink]="['/products', product.id]"
                         (click)="hideSearchResults()">
                        <div class="result-image">
                          <img [src]="product.images[0]" [alt]="product.name">
                        </div>
                        <div class="result-info">
                          <div class="result-name">{{product.name}}</div>
                          <div class="result-category">{{product.category}}</div>
                          <div class="result-price">\${{product.price | number:'1.2-2'}}</div>
                        </div>
                        <div class="result-rating">
                          <div class="stars">
                            <i class="bi bi-star-fill" *ngFor="let star of getStars(product.rating)"></i>
                          </div>
                          <span class="rating-text">{{product.rating}}</span>
                        </div>
                      </a>
                    </div>
                  </div>
                  
                  <!-- No Results -->
                  <div class="search-section" *ngIf="searchResults.length === 0 && searchQuery.length > 2">
                    <div class="no-results">
                      <i class="bi bi-search me-2"></i>
                      No products found for "{{searchQuery}}"
                      <div class="search-suggestions-text">
                        Try searching for categories like "laptops", "phones", or "headphones"
                      </div>
                    </div>
                  </div>
                  
                  <!-- View All Results -->
                  <div class="search-section" *ngIf="searchQuery.length > 0">
                    <a class="search-all-link"
                       [routerLink]="['/products']" 
                       [queryParams]="{q: searchQuery}"
                       (click)="hideSearchResults()">
                      <i class="bi bi-arrow-right me-2"></i>
                      View all results for "{{searchQuery}}"
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- User Actions -->
            <ul class="navbar-nav">
              <!-- Account Dropdown -->
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" 
                   href="#" 
                   id="accountDropdown" 
                   role="button" 
                   data-bs-toggle="dropdown"
                   [attr.aria-expanded]="userMenuOpen">
                  <i class="bi bi-person me-2"></i>
                  <span class="d-none d-lg-inline">Account</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end account-dropdown">
                  <!-- User Info Header -->
                  <li class="dropdown-header account-header">
                    <div class="user-info">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                           alt="User Avatar" class="user-avatar-small">
                      <div class="user-details">
                        <div class="user-name">John Doe</div>
                        <div class="user-email">john&#64;example.com</div>
                      </div>
                    </div>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  
                  <!-- Account Menu Items -->
                  <li>
                    <a class="dropdown-item" routerLink="/account" (click)="$event.preventDefault()">
                      <i class="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                      <i class="bi bi-person me-2"></i>
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                      <i class="bi bi-bag me-2"></i>
                      My Orders
                      <span class="badge bg-primary ms-auto">3</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" routerLink="/wishlist">
                      <i class="bi bi-heart me-2"></i>
                      Wishlist
                      <span class="badge bg-danger ms-auto" *ngIf="wishlistItemCount > 0">{{wishlistItemCount}}</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                      <i class="bi bi-geo-alt me-2"></i>
                      Addresses
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                      <i class="bi bi-gear me-2"></i>
                      Settings
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" (click)="signOut($event)">
                      <i class="bi bi-box-arrow-right me-2"></i>
                      Sign Out
                    </a>
                  </li>
                </ul>
              </li>

              <!-- Wishlist -->
              <li class="nav-item">
                <a class="nav-link position-relative" 
                   routerLink="/wishlist"
                   routerLinkActive="active"
                   title="Wishlist">
                  <i class="bi bi-heart me-2"></i>
                  <span class="d-none d-lg-inline">Wishlist</span>
                  <span class="wishlist-badge" *ngIf="wishlistItemCount > 0">
                    {{wishlistItemCount}}
                  </span>
                </a>
              </li>

              <!-- Shopping Cart -->
              <li class="nav-item cart-dropdown" 
                  (mouseenter)="showCartPreview()" 
                  (mouseleave)="hideCartPreview()">
                <a class="nav-link position-relative cart-link" 
                   routerLink="/cart"
                   routerLinkActive="active">
                  <div class="cart-icon">
                    <i class="bi bi-bag me-2"></i>
                    <span class="d-none d-lg-inline">Cart</span>
                    <span class="cart-badge" *ngIf="cartItemCount > 0">
                      {{cartItemCount}}
                    </span>
                  </div>
                </a>

                <!-- Cart Preview Dropdown -->
                <div class="cart-preview" 
                     [class.show]="cartPreviewOpen && cartItems.length > 0">
                  <div class="cart-preview-header">
                    <h6>Shopping Cart</h6>
                    <span class="cart-count">{{cartItemCount}} items</span>
                  </div>
                  
                  <div class="cart-preview-items">
                    <div *ngFor="let item of cartItems.slice(0, 3); trackBy: trackByCartItem" 
                         class="cart-preview-item">
                      <div class="item-image">
                        <img [src]="item.product.images[0]" [alt]="item.product.name">
                      </div>
                      <div class="item-details">
                        <div class="item-name">{{item.product.name}}</div>
                        <div class="item-quantity">Qty: {{item.quantity}}</div>
                        <div class="item-price">\${{item.product.price * item.quantity | number:'1.2-2'}}</div>
                      </div>
                    </div>
                    
                    <div *ngIf="cartItems.length > 3" class="more-items">
                      +{{cartItems.length - 3}} more items
                    </div>
                  </div>
                  
                  <div class="cart-preview-footer">
                    <div class="cart-total">
                      <strong>Total: \${{cartTotal | number:'1.2-2'}}</strong>
                    </div>
                    <div class="cart-actions">
                      <a class="btn btn-outline-primary btn-sm" routerLink="/cart">
                        View Cart
                      </a>
                      <a class="btn btn-primary btn-sm" href="#" (click)="$event.preventDefault()">
                        Checkout
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Notification Bar -->
      <div class="notification-bar" *ngIf="showNotificationBar">
        <div class="container-fluid">
          <div class="notification-content">
            <i class="bi bi-megaphone me-2"></i>
            <span>🎉 Flash Sale: Up to 50% off selected items! Limited time offer.</span>
            <button class="btn-close-notification" (click)="closeNotificationBar()">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Search Overlay -->
    <div class="search-overlay" 
         *ngIf="showSearchResults"
         (click)="hideSearchResults()"></div>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" 
         *ngIf="mobileMenuOpen"
         (click)="closeMobileMenu()"></div>
  `,
  styles: [`
    /* ======================================
       HEADER MAIN CONTAINER
    ====================================== */
    .main-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1050;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .main-header.scrolled {
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    /* ======================================
       TOP BAR
    ====================================== */
    .top-bar {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: white;
      padding: 0.5rem 0;
      font-size: 0.85rem;
    }

    .top-bar-left,
    .top-bar-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .top-bar-right {
      justify-content: flex-end;
    }

    .top-bar-item {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.9);
      transition: color 0.3s ease;
    }

    .top-bar-item:hover {
      color: #38bdf8;
    }

    .social-links {
      display: flex;
      gap: 0.5rem;
      margin-left: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .social-link:hover {
      background: #38bdf8;
      transform: scale(1.1);
      color: white;
    }

    /* ======================================
       NOTIFICATION BAR
    ====================================== */
    .notification-bar {
      background: linear-gradient(135deg, #f59e0b, #f97316);
      color: white;
      padding: 0.5rem 0;
      font-size: 0.9rem;
      animation: slideDown 0.5s ease;
    }

    .notification-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      position: relative;
    }

    .btn-close-notification {
      background: transparent;
      border: none;
      color: white;
      position: absolute;
      right: 0;
      padding: 0.25rem;
      border-radius: 50%;
      transition: all 0.3s ease;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-close-notification:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    /* ======================================
       BRAND LOGO
    ====================================== */
    .navbar-brand {
      text-decoration: none;
      color: inherit;
      transition: transform 0.3s ease;
      margin-right: 2rem;
    }

    .navbar-brand:hover {
      transform: scale(1.05);
      color: inherit;
      text-decoration: none;
    }

    .brand-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-icon {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .brand-name {
      font-size: 1.6rem;
      font-weight: 800;
      color: #1e293b;
      letter-spacing: -0.5px;
    }

    .brand-tagline {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* ======================================
       MOBILE TOGGLE
    ====================================== */
    .navbar-toggler {
      border: none;
      padding: 0.25rem;
      position: relative;
      width: 35px;
      height: 35px;
      background: transparent;
    }

    .navbar-toggler:focus {
      box-shadow: none;
    }

    .navbar-toggler-icon {
      position: relative;
      width: 25px;
      height: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .navbar-toggler-icon span {
      display: block;
      height: 2px;
      width: 100%;
      background: #1e293b;
      border-radius: 1px;
      transition: all 0.3s ease;
    }

    .navbar-toggler[aria-expanded="true"] .navbar-toggler-icon span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .navbar-toggler[aria-expanded="true"] .navbar-toggler-icon span:nth-child(2) {
      opacity: 0;
    }

    .navbar-toggler[aria-expanded="true"] .navbar-toggler-icon span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    /* ======================================
       NAVIGATION
    ====================================== */
    .navbar {
      padding: 1rem 0;
    }

    .navbar-nav {
      align-items: center;
    }

    .nav-link {
      color: #475569 !important;
      font-weight: 500;
      padding: 0.75rem 1rem !important;
      border-radius: 10px;
      margin: 0 0.125rem;
      transition: all 0.3s ease;
      position: relative;
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #007bff !important;
      background: rgba(0, 123, 255, 0.1);
      transform: translateY(-1px);
    }

    .nav-badge {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      font-size: 0.6rem;
      padding: 3px 6px;
      border-radius: 10px;
      margin-left: 0.5rem;
      font-weight: 600;
      animation: pulse 2s infinite;
    }

    /* ======================================
       MEGA MENU
    ====================================== */
    .mega-dropdown {
      position: static;
    }

    .mega-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: 0 0 16px 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 2rem 0;
      z-index: 1000;
    }

    .mega-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .mega-menu-title {
      color: #1e293b;
      font-weight: 700;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
    }

    /* Category Items */
    .category-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #475569;
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }

    .category-item:hover {
      background: #f8fafc;
      color: #007bff;
      border-color: #e2e8f0;
      transform: translateX(4px);
      text-decoration: none;
    }

    .category-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #e2e8f0, #f1f5f9);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
      transition: all 0.3s ease;
    }

    .category-item:hover .category-icon {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
    }

    .category-info {
      flex: 1;
    }

    .category-name {
      font-weight: 600;
      font-size: 0.9rem;
      display: block;
      margin-bottom: 2px;
    }

    .category-count {
      color: #64748b;
      font-size: 0.75rem;
    }

    .category-arrow {
      opacity: 0;
      transition: all 0.3s ease;
      color: #007bff;
    }

    .category-item:hover .category-arrow {
      opacity: 1;
      transform: translateX(4px);
    }

    /* Featured Products */
    .featured-products {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .featured-product-item {
      display: flex;
      padding: 1rem;
      border-radius: 12px;
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
      border: 1px solid transparent;
    }

    .featured-product-item:hover {
      background: #f8fafc;
      border-color: #e2e8f0;
      transform: translateY(-2px);
      text-decoration: none;
      color: inherit;
    }

    .product-image {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 10px;
      overflow: hidden;
      margin-right: 1rem;
      flex-shrink: 0;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      font-size: 0.6rem;
      padding: 2px 4px;
      border-radius: 6px;
      font-weight: 600;
    }

    .product-details {
      flex: 1;
    }

    .product-name {
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      line-height: 1.3;
      color: #1e293b;
    }

    .product-price {
      margin-bottom: 0.25rem;
    }

    .current-price {
      font-weight: 700;
      color: #007bff;
      font-size: 0.85rem;
    }

    .original-price {
      color: #94a3b8;
      text-decoration: line-through;
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .stars {
      color: #fbbf24;
      font-size: 0.7rem;
    }

    .rating-count {
      color: #64748b;
      font-size: 0.7rem;
    }

    /* Quick Links */
    .quick-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .quick-link-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #475569;
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .quick-link-item:hover {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      transform: translateX(4px);
      text-decoration: none;
    }

    .quick-link-item i {
      margin-right: 0.75rem;
      width: 16px;
      text-align: center;
    }

    /* Promotional Banner */
    .promo-banner {
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      border-radius: 16px;
      padding: 1.5rem;
      color: white;
      position: relative;
      overflow: hidden;
      text-align: center;
    }

    .promo-content h6 {
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: white;
    }

    .promo-content p {
      font-size: 0.8rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .btn-promo {
      background: white;
      color: #7c3aed;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.8rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn-promo:hover {
      background: #f3f4f6;
      transform: translateY(-1px);
      color: #7c3aed;
      text-decoration: none;
    }

    .promo-decoration {
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 3rem;
      opacity: 0.2;
    }

    /* ======================================
       SEARCH
    ====================================== */
    .search-container {
      position: relative;
      width: 100%;
      max-width: 450px;
    }

    .search-wrapper {
      position: relative;
    }

    .search-input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 3rem 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 25px;
      background: #f8fafc;
      color: #1e293b;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #007bff;
      background: white;
      box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1);
    }

    .search-input::placeholder {
      color: #94a3b8;
    }

    .search-btn {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #007bff, #0056b3);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .search-btn:hover {
      transform: translateY(-50%) scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }

    .search-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e2e8f0;
    }

    .search-section {
      padding: 1rem 0;
    }

    .search-section:not(:last-child) {
      border-bottom: 1px solid #f1f5f9;
    }

    .search-section-header {
      padding: 0 1.5rem 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .search-suggestions {
      padding: 0 0.5rem;
    }

    .search-suggestion-item {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      background: transparent;
      border: none;
      text-align: left;
      color: #475569;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .search-suggestion-item:hover {
      background: #f8fafc;
      color: #007bff;
    }

    .search-results {
      padding: 0 0.5rem;
    }

    .search-result-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      color: inherit;
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.3s ease;
      margin-bottom: 0.5rem;
    }

    .search-result-item:hover {
      background: #f8fafc;
      transform: translateX(4px);
      text-decoration: none;
      color: inherit;
    }

    .result-image {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 1rem;
      flex-shrink: 0;
    }

    .result-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .result-info {
      flex: 1;
    }

    .result-name {
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
      color: #1e293b;
    }

    .result-category {
      font-size: 0.75rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    .result-price {
      font-weight: 700;
      color: #007bff;
      font-size: 0.85rem;
    }

    .result-rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-left: 1rem;
    }

    .rating-text {
      font-size: 0.75rem;
      color: #64748b;
    }

    .no-results {
      text-align: center;
      padding: 2rem 1.5rem;
      color: #64748b;
    }

    .search-suggestions-text {
      font-size: 0.8rem;
      margin-top: 0.5rem;
      opacity: 0.8;
    }

    .search-all-link {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      color: #007bff;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .search-all-link:hover {
      background: #f8fafc;
      color: #0056b3;
      text-decoration: none;
    }

    /* ======================================
       ACCOUNT DROPDOWN
    ====================================== */
    .account-dropdown {
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      padding: 0;
      min-width: 280px;
    }

    .account-header {
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      padding: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar-small {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      object-fit: cover;
    }

    .user-name {
      font-weight: 700;
      color: #1e293b;
      font-size: 1rem;
    }

    .user-email {
      color: #64748b;
      font-size: 0.85rem;
    }

    .dropdown-item {
      padding: 0.75rem 1.5rem;
      color: #475569;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      border-radius: 0;
    }

    .dropdown-item:hover {
      background: #f8fafc;
      color: #007bff;
      padding-left: 2rem;
    }

    .dropdown-item.text-danger:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .dropdown-item i {
      width: 20px;
    }

    .dropdown-item .badge {
      font-size: 0.65rem;
    }

    /* ======================================
       CART & WISHLIST BADGES
    ====================================== */
    .cart-badge,
    .wishlist-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      border-radius: 50%;
      min-width: 20px;
      height: 20px;
      font-size: 0.7rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }

    .wishlist-badge {
      background: linear-gradient(135deg, #ec4899, #db2777);
      box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
    }

    /* ======================================
       CART PREVIEW
    ====================================== */
    .cart-dropdown {
      position: relative;
    }

    .cart-preview {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 320px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid #e2e8f0;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
    }

    .cart-preview.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .cart-preview-header {
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cart-preview-header h6 {
      margin: 0;
      font-weight: 700;
      color: #1e293b;
    }

    .cart-count {
      color: #64748b;
      font-size: 0.85rem;
    }

    .cart-preview-items {
      max-height: 240px;
      overflow-y: auto;
      padding: 1rem;
    }

    .cart-preview-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f8fafc;
    }

    .cart-preview-item:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 1rem;
      flex-shrink: 0;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details {
      flex: 1;
    }

    .item-name {
      font-weight: 600;
      font-size: 0.85rem;
      color: #1e293b;
      margin-bottom: 0.25rem;
      line-height: 1.3;
    }

    .item-quantity {
      font-size: 0.75rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    .item-price {
      font-weight: 700;
      color: #007bff;
      font-size: 0.85rem;
    }

    .more-items {
      text-align: center;
      padding: 1rem 0;
      color: #64748b;
      font-size: 0.85rem;
      font-style: italic;
    }

    .cart-preview-footer {
      padding: 1.5rem;
      border-top: 1px solid #f1f5f9;
      background: #f8fafc;
    }

    .cart-total {
      text-align: center;
      margin-bottom: 1rem;
      color: #1e293b;
      font-size: 1.1rem;
    }

    .cart-actions {
      display: flex;
      gap: 0.75rem;
    }

    .cart-actions .btn {
      flex: 1;
      padding: 0.5rem;
      font-size: 0.85rem;
      border-radius: 8px;
    }

    /* ======================================
       OVERLAYS
    ====================================== */
    .search-overlay,
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    }

    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }

    /* ======================================
       ANIMATIONS
    ====================================== */
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    /* ======================================
       RESPONSIVE DESIGN
    ====================================== */
    @media (max-width: 1200px) {
      .mega-menu .col-lg-3,
      .mega-menu .col-lg-4,
      .mega-menu .col-lg-2 {
        margin-bottom: 2rem;
      }
    }

    @media (max-width: 992px) {
      .top-bar {
        display: none;
      }

      .search-container {
        margin: 1rem 0;
        max-width: none;
      }

      .mega-menu {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        box-shadow: none;
        border-radius: 0;
        padding: 1rem 0;
        background: #f8fafc;
      }

      .navbar-collapse {
        background: white;
        border-radius: 16px;
        margin-top: 1rem;
        padding: 1rem;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      }

      .brand-text {
        display: none;
      }

      .nav-badge {
        position: static;
        margin-left: 0.5rem;
      }
    }

    @media (max-width: 768px) {
      .top-bar-left,
      .top-bar-right {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }

      .social-links {
        margin-left: 0;
        justify-content: center;
      }

      .notification-content {
        padding: 0 2rem;
      }

      .brand-name {
        font-size: 1.4rem;
      }

      .search-input {
        font-size: 16px; /* Prevents zoom on iOS */
      }

      .cart-preview {
        width: 280px;
      }
    }

    @media (max-width: 576px) {
      .navbar {
        padding: 0.75rem 0;
      }

      .brand-icon {
        width: 36px;
        height: 36px;
        font-size: 1.2rem;
      }

      .brand-name {
        font-size: 1.2rem;
      }

      .search-dropdown {
        left: -1rem;
        right: -1rem;
      }

      .cart-preview {
        width: calc(100vw - 2rem);
        right: -1rem;
      }

      .nav-link span {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private isBrowser: boolean;

  // State variables
  searchQuery = '';
  searchResults: Product[] = [];
  showSearchResults = false;
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  cartTotal = 0;
  wishlistItemCount = 0;

  // UI state
  isScrolled = false;
  showTopBar = true;
  showNotificationBar = true;
  mobileMenuOpen = false;
  megaMenuOpen = false;
  userMenuOpen = false;
  cartPreviewOpen = false;

  // Search suggestions
  searchSuggestions: string[] = [
    'Gaming laptops',
    'Wireless headphones',
    'Mechanical keyboards',
    '4K monitors'
  ];

  private searchTimeout: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.initializeData();
    this.setupSearchSubscription();
    this.setupCartSubscription();
    this.setupScrollListener();
    this.setupRouterEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  /* ======================================
     INITIALIZATION METHODS
  ====================================== */
  private initializeData(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  private setupSearchSubscription(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length >= 2) {
          return this.productService.searchProducts(query);
        }
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  private setupCartSubscription(): void {
    this.cartService.getCartItems().pipe(
      takeUntil(this.destroy$)
    ).subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.getCartItemCount().pipe(
      takeUntil(this.destroy$)
    ).subscribe(count => {
      this.cartItemCount = count;
    });

    // Calculate cart total
    this.cartService.getCartItems().pipe(
      takeUntil(this.destroy$)
    ).subscribe(items => {
      this.cartTotal = items.reduce((total, item) => 
        total + (item.product.price * item.quantity), 0
      );
    });

    // Subscribe to wishlist count
    this.wishlistService.getWishlistItemCount().pipe(
      takeUntil(this.destroy$)
    ).subscribe(count => {
      this.wishlistItemCount = count;
    });
  }

  private setupScrollListener(): void {
    if (this.isBrowser) {
      this.handleScroll();
    }
  }

  private setupRouterEvents(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.closeMobileMenu();
      this.closeMegaMenu();
      this.hideSearchResults();
    });
  }

  @HostListener('window:scroll', ['$event'])
  private handleScroll(): void {
    if (this.isBrowser) {
      this.isScrolled = window.scrollY > 100;
    }
  }

  /* ======================================
     DATA LOADING METHODS
  ====================================== */
  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.slice(0, 6);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts(4).subscribe({
      next: (products) => {
        this.featuredProducts = products;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
      }
    });
  }

  /* ======================================
     SEARCH METHODS
  ====================================== */
  onSearchFocus(): void {
    this.showSearchResults = true;
  }

  onSearchBlur(): void {
    // Delay to allow clicks on search results
    setTimeout(() => {
      this.showSearchResults = false;
    }, 200);
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.addToSearchSuggestions(this.searchQuery);
      this.hideSearchResults();
      this.router.navigate(['/products'], { 
        queryParams: { q: this.searchQuery } 
      });
    }
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.performSearch();
  }

  hideSearchResults(): void {
    this.showSearchResults = false;
  }

  private addToSearchSuggestions(query: string): void {
    if (!this.searchSuggestions.includes(query)) {
      this.searchSuggestions.unshift(query);
      this.searchSuggestions = this.searchSuggestions.slice(0, 5);
    }
  }

  /* ======================================
     MENU METHODS
  ====================================== */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.closeMegaMenu();
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  showMegaMenu(): void {
    if (!this.mobileMenuOpen) {
      this.megaMenuOpen = true;
    }
  }

  hideMegaMenu(): void {
    this.megaMenuOpen = false;
  }

  closeMegaMenu(): void {
    this.megaMenuOpen = false;
  }

  showCartPreview(): void {
    this.cartPreviewOpen = true;
  }

  hideCartPreview(): void {
    this.cartPreviewOpen = false;
  }

  /* ======================================
     NOTIFICATION METHODS
  ====================================== */
  closeNotificationBar(): void {
    this.showNotificationBar = false;
  }

  /* ======================================
     USER METHODS
  ====================================== */
  signOut(event: Event): void {
    event.preventDefault();
    console.log('User signed out');
    // Implement sign out logic here
  }

  /* ======================================
     UTILITY METHODS
  ====================================== */
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  /* ======================================
     TRACKING METHODS
  ====================================== */
  trackByCategory(index: number, category: Category): number {
    return category.id;
  }

  trackByProduct(index: number, product: Product): number {
    return product.id;
  }

  trackByCartItem(index: number, item: CartItem): number {
    return item.product.id;
  }
}