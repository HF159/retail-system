// src/app/components/header/header.component.ts
import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, state } from '@angular/animations';
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
      <!-- Top Bar -->
      <div class="top-bar" *ngIf="!isScrolled">
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col-md-6">
              <div class="top-bar-left">
                <span class="top-bar-item">
                  <i class="bi bi-telephone me-1"></i>
                  +1 (555) 123-4567
                </span>
                <span class="top-bar-item">
                  <i class="bi bi-envelope me-1"></i>
                  support&#64;technova.com
                </span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="top-bar-right">
                <span class="top-bar-item">
                  <i class="bi bi-truck me-1"></i>
                  Free shipping on orders over $50
                </span>
                <div class="social-links">
                  <a href="#" class="social-link" aria-label="Facebook">
                    <i class="bi bi-facebook"></i>
                  </a>
                  <a href="#" class="social-link" aria-label="Twitter">
                    <i class="bi bi-twitter"></i>
                  </a>
                  <a href="#" class="social-link" aria-label="Instagram">
                    <i class="bi bi-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

              <li class="nav-item">
                <a class="nav-link" 
                   href="#" 
                   (click)="$event.preventDefault(); closeMobileMenu()">
                  <i class="bi bi-headset me-1"></i>
                  <span>Support</span>
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
                  <div class="search-section" *ngIf="searchSuggestions.length > 0">
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
                      Products
                    </div>
                    <div class="search-results">
                      <a *ngFor="let product of searchResults; trackBy: trackByProduct" 
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
                  data-bs-toggle="dropdown">
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
                    <a class="dropdown-item" routerLink="/account">
                      <i class="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" [routerLink]="['/account', 'profile']">
                      <i class="bi bi-person me-2"></i>
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" [routerLink]="['/account', 'orders']">
                      <i class="bi bi-bag me-2"></i>
                      My Orders
                      <span class="badge bg-primary ms-auto">3</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" [routerLink]="['/account', 'wishlist']">
                      <i class="bi bi-heart me-2"></i>
                      Wishlist
                      <span class="badge bg-secondary ms-auto">12</span>
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" [routerLink]="['/account', 'addresses']">
                      <i class="bi bi-geo-alt me-2"></i>
                      Addresses
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" [routerLink]="['/account', 'settings']">
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
                   [routerLink]="['/account', 'wishlist']"
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
                      <a class="btn btn-primary btn-sm" routerLink="/checkout">
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
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Mobile Toggle */
    .navbar-toggler {
      border: none;
      padding: 0.5rem;
      background: transparent;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .navbar-toggler:focus {
      box-shadow: none;
    }

    .navbar-toggler-icon {
      background: none;
      width: 24px;
      height: 18px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .navbar-toggler-icon span {
      width: 100%;
      height: 2px;
      background: #1e293b;
      border-radius: 1px;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    .navbar-toggler[aria-expanded="true"] .navbar-toggler-icon span:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    .navbar-toggler[aria-expanded="true"] .navbar-toggler-icon span:nth-child(2) {
      opacity: 0;
    }

    .navbar-toggler[aria-expanded="true"] .navbar-toggler-icon span:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }

    /* Navigation */
    .navbar {
      padding: 1rem 0;
    }

    .nav-link {
      color: #1e293b !important;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 0.75rem 1rem !important;
      border-radius: 12px;
      margin: 0 0.25rem;
      display: flex;
      align-items: center;
      position: relative;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #0ea5e9 !important;
      background: rgba(14, 165, 233, 0.1);
      transform: translateY(-1px);
    }

    .nav-badge {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      font-size: 0.6rem;
      padding: 0.2rem 0.4rem;
      border-radius: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
      border-radius: 0 0 20px 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      margin-top: 0;
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
      font-weight: 700;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
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
      color: #64748b;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .category-item:hover {
      background: #f8fafc;
      color: #0ea5e9;
      transform: translateX(5px);
      text-decoration: none;
    }

    .category-icon {
      width: 40px;
      height: 40px;
      background: rgba(14, 165, 233, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
      color: #0ea5e9;
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .category-item:hover .category-icon {
      background: #0ea5e9;
      color: white;
      transform: scale(1.1);
    }

    .category-info {
      flex: 1;
    }

    .category-name {
      font-weight: 600;
      display: block;
      margin-bottom: 0.25rem;
    }

    .category-count {
      color: #94a3b8;
      font-size: 0.8rem;
    }

    .category-arrow {
      color: #cbd5e1;
      transition: all 0.3s ease;
    }

    .category-item:hover .category-arrow {
      color: #0ea5e9;
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
      padding: 1rem;
      text-decoration: none;
      color: inherit;
      border-radius: 12px;
      transition: all 0.3s ease;
      border: 1px solid #f1f5f9;
    }

    .featured-product-item:hover {
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      text-decoration: none;
      color: inherit;
    }

    .product-image {
      position: relative;
      width: 60px;
      height: 60px;
      margin-right: 1rem;
      border-radius: 10px;
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ef4444;
      color: white;
      font-size: 0.7rem;
      padding: 0.25rem 0.5rem;
      border-radius: 10px;
      font-weight: 600;
    }

    .product-details {
      flex: 1;
    }

    .product-name {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #1e293b;
    }

    .product-price {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .current-price {
      font-weight: 700;
      color: #0ea5e9;
      font-size: 0.9rem;
    }

    .original-price {
      font-size: 0.8rem;
      color: #94a3b8;
      text-decoration: line-through;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars {
      color: #fbbf24;
      font-size: 0.8rem;
      display: flex;
    }

    .rating-count {
      color: #94a3b8;
      font-size: 0.8rem;
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
      color: #64748b;
      border-radius: 12px;
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }

    .quick-link-item:hover {
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.05), rgba(56, 189, 248, 0.05));
      color: #0ea5e9;
      border-color: rgba(14, 165, 233, 0.2);
      transform: translateX(5px);
      text-decoration: none;
    }

    .quick-link-item i {
      width: 20px;
      margin-right: 0.75rem;
      color: #0ea5e9;
    }

    /* Promotional Banner */
    .promo-banner {
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      border-radius: 15px;
      padding: 1.5rem;
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .promo-content h6 {
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .promo-content p {
      font-size: 0.85rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .btn-promo {
      background: white;
      color: #0ea5e9;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.8rem;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .btn-promo:hover {
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      color: #0ea5e9;
      text-decoration: none;
    }

    .promo-decoration {
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 3rem;
      opacity: 0.2;
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
      display: flex;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 50px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .search-input-group:focus-within {
      border-color: #0ea5e9;
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
    }

    .search-input {
      border: none;
      background: transparent;
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
      color: #1e293b;
      flex: 1;
    }

    .search-input:focus {
      outline: none;
      box-shadow: none;
    }

    .search-input::placeholder {
      color: #94a3b8;
    }

    .search-btn {
      background: #0ea5e9;
      border: none;
      color: white;
      padding: 0.75rem 1.25rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .search-btn:hover {
      background: #0284c7;
      transform: scale(1.05);
    }

    /* Search Dropdown */
    .search-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: 15px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
      margin-top: 0.5rem;
      z-index: 1000;
      max-height: 80vh;
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
      padding: 0 1.5rem 0.75rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
    }

    .search-suggestions {
      display: flex;
      flex-direction: column;
    }

    .search-suggestion-item {
      background: transparent;
      border: none;
      padding: 0.75rem 1.5rem;
      text-align: left;
      color: #64748b;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
    }

    .search-suggestion-item:hover {
      background: #f8fafc;
      color: #0ea5e9;
    }

    .search-results {
      display: flex;
      flex-direction: column;
    }

    .search-result-item {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
    }

    .search-result-item:hover {
      background: #f8fafc;
      text-decoration: none;
      color: inherit;
    }

    .result-image {
      width: 50px;
      height: 50px;
      margin-right: 1rem;
      border-radius: 10px;
      overflow: hidden;
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
      margin-bottom: 0.25rem;
      color: #1e293b;
    }

    .result-category {
      font-size: 0.8rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    .result-price {
      font-weight: 700;
      color: #0ea5e9;
    }

    .result-rating {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    .rating-text {
      font-size: 0.8rem;
      color: #64748b;
    }

    .no-results {
      padding: 2rem 1.5rem;
      text-align: center;
      color: #64748b;
    }

    .search-suggestions-text {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .search-all-link {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      color: #0ea5e9;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .search-all-link:hover {
      background: rgba(14, 165, 233, 0.05);
      color: #0284c7;
      text-decoration: none;
    }

    /* User Actions */
    .user-dropdown .dropdown-toggle::after {
      display: none;
    }

    .user-avatar {
      font-size: 1.5rem;
      color: #64748b;
    }

    .user-menu {
      border-radius: 15px;
      border: none;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
      min-width: 250px;
      padding: 0;
      overflow: hidden;
    }

    .user-menu-header {
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      color: white;
      padding: 1.5rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar-large {
      font-size: 2.5rem;
    }

    .user-name {
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .user-email {
      font-size: 0.85rem;
      opacity: 0.9;
    }

    .user-menu .dropdown-item {
      padding: 0.75rem 1.5rem;
      color: #64748b;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
    }

    .user-menu .dropdown-item:hover {
      background: #f8fafc;
      color: #0ea5e9;
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
      background: #ef4444;
      color: white;
      border-radius: 50%;
      min-width: 18px;
      height: 18px;
      font-size: 0.7rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse 2s infinite;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      min-width: 16px;
      height: 16px;
      font-size: 0.6rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Cart Preview */
    .cart-dropdown {
      position: relative;
    }

    .cart-preview {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 15px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
      min-width: 350px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #e2e8f0;
      margin-top: 0.5rem;
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
      font-size: 0.9rem;
    }

    .cart-preview-items {
      max-height: 300px;
      overflow-y: auto;
      padding: 1rem;
    }

    .cart-preview-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border-radius: 10px;
      margin-bottom: 0.75rem;
      transition: all 0.3s ease;
    }

    .cart-preview-item:hover {
      background: #f8fafc;
    }

    .item-image {
      width: 50px;
      height: 50px;
      margin-right: 0.75rem;
      border-radius: 8px;
      overflow: hidden;
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
      margin-bottom: 0.25rem;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .item-quantity {
      font-size: 0.8rem;
      color: #64748b;
      margin-bottom: 0.25rem;
    }

    .item-price {
      font-weight: 700;
      color: #0ea5e9;
      font-size: 0.9rem;
    }

    .more-items {
      text-align: center;
      color: #64748b;
      font-size: 0.9rem;
      padding: 0.5rem;
      border-top: 1px solid #f1f5f9;
    }

    .cart-preview-footer {
      padding: 1.5rem;
      border-top: 1px solid #f1f5f9;
      background: #f8fafc;
    }

    .cart-total {
      margin-bottom: 1rem;
      text-align: center;
      font-size: 1.1rem;
      color: #1e293b;
    }

    .cart-actions {
      display: flex;
      gap: 0.75rem;
    }

    .cart-actions .btn {
      flex: 1;
      border-radius: 8px;
      font-weight: 600;
    }

    /* Overlays */
    .search-overlay,
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .search-container {
        max-width: 400px;
      }
      
      .mega-menu .container-fluid {
        padding: 0 1rem;
      }
    }

    @media (max-width: 992px) {
      .top-bar {
        display: none;
      }
      
      .navbar-collapse {
        background: white;
        border-radius: 15px;
        margin-top: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
        padding: 1rem;
      }
      
      .search-container {
        order: -1;
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
        padding: 1rem;
        background: #f8fafc;
      }
      
      .cart-preview {
        right: auto;
        left: 0;
        min-width: 280px;
      }
    }

    @media (max-width: 768px) {
      .brand-text {
        display: none;
      }
      
      .nav-link span {
        display: none;
      }
      
      .top-bar-left,
      .top-bar-right {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
    }

    @media (max-width: 576px) {
      .navbar {
        padding: 0.75rem 0;
      }
      
      .brand-container {
        gap: 0.5rem;
      }
      
      .brand-icon {
        width: 32px;
        height: 32px;
        font-size: 1.2rem;
      }
      
      .brand-name {
        font-size: 1.2rem;
      }
      
      .featured-products,
      .quick-links {
        display: none;
      }
      
      .cart-preview {
        min-width: 250px;
      }
    }

    /* Animations */
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  featuredProducts: Product[] = [];
  searchQuery = '';
  searchResults: Product[] = [];
  searchSuggestions: string[] = ['Gaming Laptops', 'Wireless Headphones', 'Mechanical Keyboards'];
  selectedCategory: string | null = null;
  
  signOut(event: Event): void {
    event.preventDefault();
    if (confirm('Are you sure you want to sign out?')) {
      console.log('Signing out...');
      // Implement sign out logic here
      // this.userService.logout().subscribe(() => {
      //   this.router.navigate(['/']);
      // });
    }
  }
  // State management
  isScrolled = false;
  mobileMenuOpen = false;
  megaMenuOpen = false;
  userMenuOpen = false;
  cartPreviewOpen = false;
  showSearchResults = false;
  searchFocused = false;
  mobileSearchOpen = false;
  
  // Cart data
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  cartTotal = 0;
  wishlistItemCount = 0;
  
  // Mobile detection
  isMobile = false;
  
  private destroy$ = new Subject<void>();
  private searchSubject = new BehaviorSubject<string>('');

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isMobile = isPlatformBrowser(this.platformId) && window.innerWidth < 768;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.pageYOffset > 100;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
      if (!this.isMobile) {
        this.mobileMenuOpen = false;
        this.mobileSearchOpen = false;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Close mega menu if clicking outside
    if (!target.closest('.mega-dropdown')) {
      this.megaMenuOpen = false;
    }
    
    // Close search results if clicking outside
    if (!target.closest('.search-container')) {
      this.showSearchResults = false;
    }
    
    // Close cart preview if clicking outside
    if (!target.closest('.cart-dropdown')) {
      this.cartPreviewOpen = false;
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
    this.setupSearch();
    this.subscribeToCart();
    
    // Handle route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closeMobileMenu();
        this.closeMegaMenu();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.slice(0, 6); // Show only first 6 categories
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts(4).subscribe({
      next: (products) => {
        this.featuredProducts = products;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
      }
    });
  }

  setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (query.length >= 2) {
            return this.productService.searchProducts(query);
          }
          return of([]);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results) => {
          this.searchResults = results;
        },
        error: (error) => {
          console.error('Error searching products:', error);
          this.searchResults = [];
        }
      });
  }

  subscribeToCart(): void {
    this.cartService.getCartItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        this.cartTotal = this.cartService.getCartTotal();
      });

    this.cartService.getCartItemCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.cartItemCount = count;
      });
  }

  // Menu Controls
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.megaMenuOpen = false;
      this.showSearchResults = false;
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  showMegaMenu(): void {
    if (!this.isMobile) {
      this.megaMenuOpen = true;
    }
  }

  hideMegaMenu(): void {
    if (!this.isMobile) {
      this.megaMenuOpen = false;
    }
  }

  closeMegaMenu(): void {
    this.megaMenuOpen = false;
  }

  // Search Controls
  onSearchFocus(): void {
    this.searchFocused = true;
    this.showSearchResults = true;
  }

  onSearchBlur(): void {
    // Delay hiding to allow for clicks on dropdown
    setTimeout(() => {
      this.searchFocused = false;
    }, 200);
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
    this.showSearchResults = this.searchQuery.length > 0;
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.hideSearchResults();
      this.addToSearchSuggestions(this.searchQuery);
      
      // Navigate to products page with search query
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
      this.searchSuggestions = this.searchSuggestions.slice(0, 5); // Keep only 5 suggestions
    }
  }

  // Cart Controls
  showCartPreview(): void {
    if (!this.isMobile && this.cartItems.length > 0) {
      this.cartPreviewOpen = true;
    }
  }

  hideCartPreview(): void {
    if (!this.isMobile) {
      this.cartPreviewOpen = false;
    }
  }

  // Utility Functions
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // TrackBy Functions
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