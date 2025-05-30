import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container-fluid">
        <!-- Brand -->
        <a class="navbar-brand fw-bold" routerLink="/">
          <i class="bi bi-lightning-charge-fill me-2"></i>
          TechNova
        </a>

        <!-- Mobile Toggle -->
        <button 
          class="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          [attr.aria-expanded]="false" 
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Categories Dropdown -->
          <ul class="navbar-nav me-auto">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle fw-medium" 
                 href="#" 
                 role="button" 
                 data-bs-toggle="dropdown">
                <i class="bi bi-grid-3x3-gap me-1"></i>
                Categories
              </a>
              <ul class="dropdown-menu bg-surface border-0 shadow-lg">
                <li *ngFor="let category of categories">
                  <a class="dropdown-item" [routerLink]="['/categories', category.slug]">
                    <i [class]="category.icon + ' me-2'"></i>
                    {{ category.name }}
                  </a>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/products">
                <i class="bi bi-box me-1"></i>
                Products
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/deals">
                <i class="bi bi-lightning me-1"></i>
                Deals
              </a>
            </li>
          </ul>

          <!-- Search Bar -->
          <form class="d-flex me-3 search-form" (ngSubmit)="onSearch()">
            <div class="input-group">
              <input 
                class="form-control search-input" 
                type="search" 
                placeholder="Search products..."
                [(ngModel)]="searchQuery"
                name="search">
              <button class="btn btn-outline-primary" type="submit">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </form>

          <!-- Action Buttons -->
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link position-relative" routerLink="/cart">
                <i class="bi bi-cart3 fs-5"></i>
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                      *ngIf="cartItemCount > 0">
                  {{ cartItemCount }}
                </span>
              </a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" 
                 href="#" 
                 role="button" 
                 data-bs-toggle="dropdown">
                <i class="bi bi-person-circle fs-5"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end bg-surface border-0 shadow-lg">
                <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i>Profile</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-bag me-2"></i>Orders</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: rgba(15, 23, 42, 0.95) !important;
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(51, 65, 85, 0.3);
      padding: 1rem 0;
      z-index: 1050;
    }

    .navbar-brand {
      font-size: 1.75rem;
      background: linear-gradient(135deg, #0ea5e9, #38bdf8, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;
    }

    .nav-link {
      color: var(--text-secondary) !important;
      font-weight: 500;
      padding: 0.5rem 1rem !important;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      color: var(--accent-light-sky) !important;
      background: rgba(14, 165, 233, 0.1);
      transform: translateY(-1px);
    }

    .dropdown-menu {
      background: var(--surface-primary);
      border: 1px solid var(--surface-tertiary);
      border-radius: 12px;
      margin-top: 0.5rem;
      min-width: 200px;
    }

    .dropdown-item {
      color: var(--text-secondary);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin: 0.25rem;
      transition: all 0.3s ease;
    }

    .dropdown-item:hover {
      background: rgba(14, 165, 233, 0.1);
      color: var(--accent-light-sky);
    }

    .search-form {
      width: 100%;
      max-width: 400px;
    }

    .search-input {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid var(--surface-tertiary);
      border-right: none;
      color: var(--text-primary);
      border-radius: 12px 0 0 12px;
    }

    .search-input:focus {
      background: rgba(30, 41, 59, 0.9);
      border-color: var(--accent-sky);
      box-shadow: none;
      color: var(--text-primary);
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .btn-outline-primary {
      border-color: var(--surface-tertiary);
      color: var(--accent-sky);
      border-radius: 0 12px 12px 0;
      border-left: none;
    }

    .btn-outline-primary:hover {
      background: var(--accent-sky);
      border-color: var(--accent-sky);
      color: white;
    }

    .badge {
      font-size: 0.7rem;
      background: linear-gradient(135deg, #0ea5e9, #38bdf8) !important;
    }

    .navbar-toggler {
      border: none;
      padding: 0.25rem 0.5rem;
    }

    .navbar-toggler:focus {
      box-shadow: none;
    }

    @media (max-width: 991px) {
      .search-form {
        margin: 1rem 0;
        max-width: 100%;
      }
      
      .navbar-nav {
        align-items: stretch;
      }
      
      .nav-link {
        padding: 0.75rem 1rem !important;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  searchQuery: string = '';
  cartItemCount: number = 0;
  
  categories = [
    { name: 'Laptops', slug: 'laptops', icon: 'bi bi-laptop' },
    { name: 'Desktops', slug: 'desktops', icon: 'bi bi-pc-display' },
    { name: 'Smartphones', slug: 'smartphones', icon: 'bi bi-phone' },
    { name: 'Gaming', slug: 'gaming', icon: 'bi bi-controller' },
    { name: 'Wearables', slug: 'wearables', icon: 'bi bi-smartwatch' },
    { name: 'Components', slug: 'components', icon: 'bi bi-cpu' },
    { name: 'Cameras', slug: 'cameras', icon: 'bi bi-camera' },
    { name: 'Audio', slug: 'audio', icon: 'bi bi-headphones' },
    { name: 'Accessories', slug: 'accessories', icon: 'bi bi-usb-plug' }
  ];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement search functionality
    }
  }
}