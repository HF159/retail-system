// src/app/components/header/header.component.ts
import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
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
          <!-- Brand -->
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

          <!-- Mobile Toggle -->
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

          <div class="collapse navbar-collapse" 
               [class.show]="mobileMenuOpen" 
               id="navbarNav">
            
            <!-- Main Navigation Links -->
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" 
                   routerLink="/" 
                   routerLinkActive="active" 
                   [routerLinkActiveOptions]="{exact: true}"
                   (click)="closeMobileMenu()">
                  <i class="bi bi-house me-1"></i>
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
                  <i class="bi bi-grid-3x3-gap me-1"></i>
                  <span>Products</span>
                </a>
                
                <div class="mega-menu" 
                     [class.show]="megaMenuOpen">
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

              <li class="nav-item">
                <a class="nav-link" 
                   routerLink="/deals" 
                   routerLinkActive="active"
                   (click)="closeMobileMenu()">
                  <i class="bi bi-lightning me-1"></i>
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
                <a 
                  class="nav-link dropdown-toggle" 
                  href="#" 
                  id="accountDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  [attr.aria-expanded]="userMenuOpen">
                  <i class="bi bi-person me-1"></i>
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
                    <a class="dropdown-item" href="#" (click)="$event.preventDefault()">
                      <i class="bi bi-heart me-2"></i>
                      Wishlist
                      <span class="badge bg-secondary ms-auto">{{wishlistItemCount}}</span>
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
                   href="#"
                   (click)="$event.preventDefault()"
                   title="Wishlist">
                  <i class="bi bi-heart"></i>
                  <span class="d-none d-lg-inline ms-1">Wishlist</span>
                  <span class="notification-badge" *ngIf="wishlistItemCount > 0">
                    {{wishlistItemCount}}
                  </span>
                </a>
              </li>

              <!-- Shopping Cart -->
              <li class="nav-item cart-dropdown" 
                  (mouseenter)="showCartPreview()" 
                  (mouseleave)="hideCartPreview()">
                <a class="nav-link position-relative cart-link" 
                   routerLink="/cart">
                  <div class="cart-icon">
                    <i class="bi bi-bag"></i>
                    <span class="cart-badge" 
                          *ngIf="cartItemCount > 0">
                      {{cartItemCount}}
                    </span>
                  </div>
                  <span class="d-none d-lg-inline ms-1">Cart</span>
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
    /* Header Container */
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

    /* Top Bar */
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
      width: 24px;
      height: 24px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: rgba(14, 165, 233, 0.8);
      transform: scale(1.1);
      color: white;
    }

    /* Notification Bar */
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
    }

    .btn-close-notification:hover {
      background: rgba(255, 255, 255, 0.2);
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

    /* Account Dropdown */
    .account-dropdown {
      width: 280px;
      padding: 0;
      border: none;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      margin-top: 10px;
    }

    .account-header {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      padding: 16px 20px;
      border-radius: 12px 12px 0 0;
      border-bottom: none;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar-small {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .user-details {
      flex: 1;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 2px;
    }

    .user-email {
      font-size: 0.8rem;
      opacity: 0.9;
    }

    .account-dropdown .dropdown-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      color: #495057;
      transition: all 0.3s ease;
      border-radius: 0;
    }

    .account-dropdown .dropdown-item:hover {
      background: #f8f9fa;
      color: #007bff;
      padding-left: 25px;
    }

    .account-dropdown .dropdown-item.text-danger:hover {
      background: #fff5f5;
      color: #dc3545;
    }

    .account-dropdown .badge {
      font-size: 0.7rem;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Brand */
    .navbar-brand {
      text-decoration: none;
      color: inherit;
      transition: transform 0.3s ease;
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
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .brand-name {
      font-size: 1.5rem;
      font-weight: 800;
      color: #1e293b;
    }

    .brand-tagline {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 500;
    }

    /* Mobile Toggle */
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

    /* Navigation */
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
      border-radius: 8px;
      margin: 0 0.125rem;
      transition: all 0.3s ease;
      position: relative;
      display: flex;
      align-items: center;
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
      padding: 2px 6px;
      border-radius: 10px;
      margin-left: 0.5rem;
      font-weight: 600;
      animation: pulse 2s infinite;
    }

    /* Mega Menu */
    .mega-dropdown {
      position: static;
    }

    .mega-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: none;
      border-radius: 0 0 16px 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      padding: 2rem 0;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
    }

    .mega-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .mega-menu-title {
      color: #1e293b;
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #f1f5f9;
      display: flex;
      align-items: center;
    }

    /* Category List */
    .category-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      text-decoration: none;
      color: #475569;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .category-item:hover {
      background: #f8fafc;
      color: #007bff;
      transform: translateX(5px);
      text-decoration: none;
    }

    .category-icon {
      width: 35px;
      height: 35px;
      background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
      font-size: 1.1rem;
      color: #64748b;
      transition: all 0.3s ease;
    }

    .category-item:hover .category-icon {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      color: #007bff;
    }

    .category-info {
      flex: 1;
    }

    .category-name {
      font-weight: 500;
      margin-bottom: 0.125rem;
      display: block;
    }

    .category-count {
      color: #94a3b8;
      font-size: 0.8rem;
    }

    .category-arrow {
      opacity: 0;
      transition: all 0.3s ease;
      color: #007bff;
    }

    .category-item:hover .category-arrow {
      opacity: 1;
      transform: translateX(3px);
    }

    /* Featured Products */
    .featured-products {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .featured-product-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      text-decoration: none;
      color: #475569;
      border-radius: 8px;
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }

    .featured-product-item:hover {
      background: #f8fafc;
      border-color: #e2e8f0;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-decoration: none;
      color: #475569;
    }

    .product-image {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 0.75rem;
      flex-shrink: 0;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      font-size: 0.65rem;
      padding: 2px 4px;
      border-radius: 4px;
      font-weight: 600;
    }

    .product-details {
      flex: 1;
      min-width: 0;
    }

    .product-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-price {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .current-price {
      color: #007bff;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .original-price {
      color: #94a3b8;
      text-decoration: line-through;
      font-size: 0.8rem;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .stars {
      color: #fbbf24;
      font-size: 0.75rem;
      display: flex;
    }

    .rating-count {
      color: #94a3b8;
      font-size: 0.75rem;
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
      padding: 0.75rem;
      text-decoration: none;
      color: #475569;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .quick-link-item:hover {
      background: #f8fafc;
      color: #007bff;
      transform: translateX(5px);
      text-decoration: none;
    }

    .quick-link-item i {
      width: 20px;
      margin-right: 0.75rem;
      color: #64748b;
      transition: color 0.3s ease;
    }

    .quick-link-item:hover i {
      color: #007bff;
    }

    /* Promotional Banner */
    .promo-banner {
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      border-radius: 12px;
      padding: 1.5rem;
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .promo-content {
      position: relative;
      z-index: 2;
    }

    .promo-banner h6 {
      font-weight: 700;
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .promo-banner p {
      font-size: 0.85rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .btn-promo {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      font-size: 0.85rem;
    }

    .btn-promo:hover {
      background: rgba(255, 255, 255, 0.3);
      color: white;
      text-decoration: none;
      transform: translateY(-1px);
    }

    .promo-decoration {
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 2rem;
      opacity: 0.3;
      transform: rotate(15deg);
    }

    /* Search Container */
    .search-container {
      position: relative;
      flex: 1;
      max-width: 500px;
      margin: 0 1rem;
    }

    .search-wrapper {
      position: relative;
      width: 100%;
    }

    .search-input-group {
      position: relative;
      display: flex;
      width: 100%;
    }

    .search-input {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      color: #1e293b;
      border-radius: 25px;
      padding: 0.75rem 3.5rem 0.75rem 1.25rem;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      width: 100%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .search-input::placeholder {
      color: #94a3b8;
    }

    .search-input:focus {
      outline: none;
      background: white;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .search-btn {
      position: absolute;
      right: 8px;
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
      box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
    }

    .search-btn:hover {
      background: linear-gradient(135deg, #0056b3, #004085);
      transform: translateY(-50%) scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
    }

    /* Search Dropdown */
    .search-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      max-height: 500px;
      overflow-y: auto;
      border: 1px solid #e2e8f0;
    }

    .search-section {
      padding: 0.5rem 0;
    }

    .search-section:not(:last-child) {
      border-bottom: 1px solid #f1f5f9;
    }

    .search-section-header {
      padding: 0.75rem 1.25rem 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
    }

    /* Search Suggestions */
    .search-suggestions {
      padding: 0 0.5rem;
    }

    .search-suggestion-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0.75rem;
      background: transparent;
      border: none;
      color: #475569;
      text-align: left;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .search-suggestion-item:hover {
      background: #f8fafc;
      color: #007bff;
    }

    /* Search Results */
    .search-results {
      padding: 0 0.5rem;
    }

    .search-result-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      text-decoration: none;
      color: #475569;
      border-radius: 8px;
      transition: all 0.3s ease;
      margin-bottom: 0.25rem;
    }

    .search-result-item:hover {
      background: #f8fafc;
      color: #007bff;
      text-decoration: none;
    }

    .result-image {
      width: 45px;
      height: 45px;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 0.75rem;
      flex-shrink: 0;
    }

    .result-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .result-info {
      flex: 1;
      min-width: 0;
    }

    .result-name {
      font-weight: 500;
      margin-bottom: 0.125rem;
      font-size: 0.9rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .result-category {
      color: #94a3b8;
      font-size: 0.75rem;
      margin-bottom: 0.125rem;
    }

    .result-price {
      color: #007bff;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .result-rating {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-left: 0.5rem;
    }

    .rating-text {
      color: #94a3b8;
      font-size: 0.75rem;
      margin-top: 0.125rem;
    }

    /* No Results */
    .no-results {
      padding: 2rem 1.25rem;
      text-align: center;
      color: #64748b;
    }

    .search-suggestions-text {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #94a3b8;
    }

    /* Search All Link */
    .search-all-link {
      display: flex;
      align-items: center;
      padding: 1rem 1.25rem;
      color: #007bff;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      background: #f8fafc;
      border-radius: 0 0 16px 16px;
    }

    .search-all-link:hover {
      background: #f1f5f9;
      color: #0056b3;
      text-decoration: none;
    }

    /* Cart */
    .cart-link {
      position: relative;
    }

    .cart-icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      border-radius: 50%;
      min-width: 20px;
      height: 20px;
      font-size: 0.7rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
      border: 2px solid white;
    }

    /* Cart Preview */
    .cart-dropdown {
      position: relative;
    }

    .cart-preview {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 350px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #e2e8f0;
    }

    .cart-preview.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .cart-preview-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .cart-preview-header h6 {
      margin: 0;
      font-weight: 600;
      color: #1e293b;
    }

    .cart-count {
      color: #64748b;
      font-size: 0.85rem;
    }

    .cart-preview-items {
      max-height: 300px;
      overflow-y: auto;
      padding: 0.5rem;
    }

    .cart-preview-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border-radius: 8px;
      transition: background 0.3s ease;
    }

    .cart-preview-item:hover {
      background: #f8fafc;
    }

    .cart-preview-item .item-image {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      overflow: hidden;
      margin-right: 0.75rem;
      flex-shrink: 0;
    }

    .cart-preview-item .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cart-preview-item .item-details {
      flex: 1;
      min-width: 0;
    }

    .cart-preview-item .item-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cart-preview-item .item-quantity {
      color: #64748b;
      font-size: 0.8rem;
      margin-bottom: 0.125rem;
    }

    .cart-preview-item .item-price {
      color: #007bff;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .more-items {
      padding: 0.75rem 1.25rem;
      text-align: center;
      color: #64748b;
      font-size: 0.85rem;
      border-top: 1px solid #f1f5f9;
    }

    .cart-preview-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid #f1f5f9;
      background: #f8fafc;
      border-radius: 0 0 16px 16px;
    }

    .cart-total {
      text-align: center;
      margin-bottom: 1rem;
      font-size: 1.1rem;
      color: #1e293b;
    }

    .cart-actions {
      display: flex;
      gap: 0.5rem;
    }

    .cart-actions .btn {
      flex: 1;
      padding: 0.5rem;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.85rem;
      text-decoration: none;
      text-align: center;
      transition: all 0.3s ease;
    }

    /* Notification Badge */
    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      border-radius: 50%;
      min-width: 18px;
      height: 18px;
      font-size: 0.65rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
      border: 2px solid white;
    }

    /* Overlays */
    .search-overlay,
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    }

    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }

    /* Animations */
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    /* Responsive Design */
    @media (max-width: 1199px) {
      .mega-menu .col-lg-2 {
        display: none;
      }
    }

    @media (max-width: 991px) {
      .top-bar {
        display: none;
      }

      .navbar-collapse {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 0 0 16px 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        border-top: 1px solid #e2e8f0;
        padding: 1rem;
        margin-top: 1px;
      }

      .search-container {
        order: 3;
        width: 100%;
        max-width: none;
        margin: 1rem 0;
      }

      .navbar-nav {
        margin-bottom: 1rem;
      }

      .nav-link {
        padding: 0.75rem 1rem !important;
        margin: 0.125rem 0;
        border-radius: 8px;
      }

      .mega-menu {
        position: static;
        box-shadow: none;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        margin-top: 0.5rem;
        padding: 1rem;
      }

      .mega-menu .row {
        flex-direction: column;
      }

      .mega-menu .col-lg-3,
      .mega-menu .col-lg-4 {
        margin-bottom: 1.5rem;
      }

      .cart-preview {
        right: -50px;
        width: 300px;
      }
    }

    @media (max-width: 767px) {
      .brand-name {
        font-size: 1.3rem;
      }

      .brand-tagline {
        display: none;
      }

      .nav-link span {
        font-size: 0.9rem;
      }

      .search-dropdown {
        left: -20px;
        right: -20px;
      }

      .cart-preview {
        right: -75px;
        width: 280px;
      }
    }

    @media (max-width: 575px) {
      .brand-icon {
        width: 35px;
        height: 35px;
        font-size: 1.25rem;
      }

      .brand-name {
        font-size: 1.2rem;
      }

      .search-input {
        font-size: 16px; /* Prevents zoom on iOS */
      }

      .cart-preview {
        right: -100px;
        width: 260px;
      }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new BehaviorSubject<string>('');
  
  // Component state
  searchQuery = '';
  searchResults: Product[] = [];
  searchSuggestions: string[] = ['Gaming Laptops', 'iPhone', 'Headphones', 'Graphics Cards'];
  showSearchResults = false;
  
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  
  // Menu states
  megaMenuOpen = false;
  mobileMenuOpen = false;
  userMenuOpen = false;
  cartPreviewOpen = false;
  showNotificationBar = true;
  
  // Cart and user data
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  cartTotal = 0;
  wishlistItemCount = 5;
  
  // Scroll state
  isScrolled = false;
  
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    this.setupSearchDebounce();
    this.loadInitialData();
    this.subscribeToCartChanges();
    this.setupScrollListener();
    this.setupRouterEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeComponent(): void {
    // Load notification bar state from localStorage
    if (isPlatformBrowser(this.platformId)) {
      const notificationDismissed = localStorage.getItem('notificationBarDismissed');
      this.showNotificationBar = !notificationDismissed;
    }
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length >= 2) {
          return this.productService.searchProducts(query);
        }
        return of([]);
      })
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.searchResults = [];
      }
    });
  }

  private loadInitialData(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  private subscribeToCartChanges(): void {
    this.cartService.getCartItems().pipe(
      takeUntil(this.destroy$)
    ).subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });

    this.cartService.getCartItemCount().pipe(
      takeUntil(this.destroy$)
    ).subscribe(count => {
      this.cartItemCount = count;
    });
  }

  private setupScrollListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    }
  }

  private setupRouterEvents(): void {
    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobileMenu();
      this.closeMegaMenu();
      this.hideSearchResults();
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 100;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Close search results if clicking outside
    if (this.showSearchResults && !target.closest('.search-container')) {
      this.hideSearchResults();
    }
    
    // Close mega menu if clicking outside
    if (this.megaMenuOpen && !target.closest('.mega-dropdown')) {
      this.closeMegaMenu();
    }
    
    // Close cart preview if clicking outside
    if (this.cartPreviewOpen && !target.closest('.cart-dropdown')) {
      this.hideCartPreview();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Close dropdowns on Escape key
    if (event.key === 'Escape') {
      this.hideSearchResults();
      this.closeMegaMenu();
      this.hideCartPreview();
      this.closeMobileMenu();
    }
    
    // Focus search on Ctrl/Cmd + K
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.focusSearch();
    }
  }

  // Data loading methods
  private loadCategories(): void {
    this.productService.getCategories().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (categories) => {
        this.categories = categories.slice(0, 6); // Show only first 6 categories
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
      }
    });
  }

  private loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts(4).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (products) => {
        this.featuredProducts = products;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.featuredProducts = [];
      }
    });
  }

  // Search methods
  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
    this.showSearchResults = true;
  }

  onSearchFocus(): void {
    this.showSearchResults = true;
  }

  onSearchBlur(): void {
    // Delay hiding to allow clicks on search results
    setTimeout(() => {
      if (!document.activeElement?.closest('.search-dropdown')) {
        this.showSearchResults = false;
      }
    }, 200);
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.hideSearchResults();
      this.addToSearchHistory(this.searchQuery);
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

  private focusSearch(): void {
    if (isPlatformBrowser(this.platformId)) {
      const searchInput = document.querySelector('.search-input') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  }

  private addToSearchHistory(query: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const updatedHistory = [query, ...history.filter((item: string) => item !== query)].slice(0, 5);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        this.searchSuggestions = updatedHistory;
      } catch (error) {
        console.error('Error saving search history:', error);
      }
    }
  }

  // Menu methods
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.closeMegaMenu();
      this.hideCartPreview();
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
    setTimeout(() => {
      this.megaMenuOpen = false;
    }, 100);
  }

  closeMegaMenu(): void {
    this.megaMenuOpen = false;
  }

  // Cart methods
  showCartPreview(): void {
    if (this.cartItems.length > 0) {
      this.cartPreviewOpen = true;
    }
  }

  hideCartPreview(): void {
    setTimeout(() => {
      this.cartPreviewOpen = false;
    }, 100);
  }

  // Notification methods
  closeNotificationBar(): void {
    this.showNotificationBar = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('notificationBarDismissed', 'true');
    }
  }

  // User methods
  signOut(event: Event): void {
    event.preventDefault();
    // Implement sign out logic
    console.log('Signing out...');
  }

  // Utility methods
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

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