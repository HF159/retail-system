// src/app/components/products/pages/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { ProductCardComponent } from '../../../product-card/product-card.component';
import { ProductFiltersComponent } from '../../components/product-filters/product-filters.component';
import { Product, ProductSearchParams, ProductResponse } from '../../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, ProductFiltersComponent],
  template: `
    <div class="product-list-page">
      <!-- Header Section -->
      <div class="page-header">
        <div class="container-fluid">
          <div class="row align-items-center">
            <div class="col-md-6">
              <h1 class="page-title">
                <i class="bi bi-grid-3x3-gap me-3"></i>
                {{pageTitle}}
              </h1>
              <p class="page-subtitle" *ngIf="searchQuery">
                Search results for "<strong>{{searchQuery}}</strong>"
              </p>
            </div>
            <div class="col-md-6">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item"><a href="/">Home</a></li>
                  <li class="breadcrumb-item active">Products</li>
                  <li class="breadcrumb-item active" *ngIf="categoryName">{{categoryName}}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div class="container-fluid">
        <div class="row">
          <!-- Filters Sidebar -->
          <div class="col-lg-3 col-md-4 d-none d-md-block">
            <app-product-filters 
              [totalProducts]="totalProducts"
              (filtersChanged)="onFiltersChanged($event)">
            </app-product-filters>
          </div>

          <!-- Main Content -->
          <div class="col-lg-9 col-md-8">
            <!-- Mobile Filters Toggle -->
            <div class="mobile-filters d-md-none mb-3">
              <button 
                class="btn btn-outline-primary w-100"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#filtersOffcanvas">
                <i class="bi bi-funnel me-2"></i>Filters & Sort
              </button>
            </div>

            <!-- Toolbar -->
            <div class="products-toolbar">
              <div class="toolbar-left">
                <span class="results-count">
                  {{totalProducts}} products found
                </span>
              </div>
              <div class="toolbar-right">
                <!-- View Toggle -->
                <div class="view-toggle me-3">
                  <div class="btn-group" role="group">
                    <button 
                      type="button" 
                      class="btn btn-sm"
                      [class.btn-primary]="viewMode === 'grid'"
                      [class.btn-outline-primary]="viewMode !== 'grid'"
                      (click)="setViewMode('grid')">
                      <i class="bi bi-grid-3x3"></i>
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-sm"
                      [class.btn-primary]="viewMode === 'list'"
                      [class.btn-outline-primary]="viewMode !== 'list'"
                      (click)="setViewMode('list')">
                      <i class="bi bi-list"></i>
                    </button>
                  </div>
                </div>

                <!-- Sort Dropdown -->
                <div class="sort-dropdown">
                  <select 
                    class="form-select form-select-sm"
                    [(ngModel)]="sortBy"
                    (ngModelChange)="onSortChange()">
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low to High</option>
                    <option value="price-desc">Price High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div class="loading-state" *ngIf="loading">
              <div class="row">
                <div class="col-md-6 col-lg-4 mb-4" *ngFor="let i of [1,2,3,4,5,6]">
                  <div class="product-skeleton">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-content">
                      <div class="skeleton-line"></div>
                      <div class="skeleton-line short"></div>
                      <div class="skeleton-line"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Products Grid -->
            <div class="products-grid" *ngIf="!loading">
              <!-- No Results -->
              <div class="no-results" *ngIf="products.length === 0">
                <div class="text-center py-5">
                  <i class="bi bi-search display-1 text-muted mb-3"></i>
                  <h4>No products found</h4>
                  <p class="text-muted">Try adjusting your filters or search terms</p>
                  <button class="btn btn-primary" (click)="clearFilters()">
                    Clear Filters
                  </button>
                </div>
              </div>

              <!-- Grid View -->
              <div 
                class="row" 
                *ngIf="products.length > 0 && viewMode === 'grid'">
                <div 
                  class="col-xl-4 col-lg-6 col-md-6 mb-4"
                  *ngFor="let product of products; trackBy: trackByProductId">
                  <app-product-card [product]="product"></app-product-card>
                </div>
              </div>

              <!-- List View -->
              <div 
                class="products-list-view"
                *ngIf="products.length > 0 && viewMode === 'list'">
                <div 
                  class="product-list-item"
                  *ngFor="let product of products; trackBy: trackByProductId">
                  <app-product-card [product]="product"></app-product-card>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <nav class="pagination-wrapper" *ngIf="totalPages > 1 && !loading">
              <ul class="pagination justify-content-center">
                <li class="page-item" [class.disabled]="currentPage === 1">
                  <a class="page-link" (click)="goToPage(currentPage - 1)">
                    <i class="bi bi-chevron-left"></i>
                  </a>
                </li>
                
                <li 
                  class="page-item"
                  *ngFor="let page of getPageNumbers()"
                  [class.active]="page === currentPage">
                  <a class="page-link" (click)="goToPage(page)">{{page}}</a>
                </li>
                
                <li class="page-item" [class.disabled]="currentPage === totalPages">
                  <a class="page-link" (click)="goToPage(currentPage + 1)">
                    <i class="bi bi-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filters Offcanvas -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="filtersOffcanvas">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">Filters</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body">
        <app-product-filters 
          [totalProducts]="totalProducts"
          (filtersChanged)="onFiltersChanged($event)">
        </app-product-filters>
      </div>
    </div>
  `,
  styles: [`
    .product-list-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .page-header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 60px 0 40px;
      margin-bottom: 30px;
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

    .products-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }

    .results-count {
      color: #6c757d;
      font-weight: 500;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
    }

    .view-toggle .btn {
      border-radius: 6px;
    }

    .sort-dropdown select {
      min-width: 180px;
      border-radius: 6px;
    }

    .products-grid {
      min-height: 400px;
    }

    .no-results {
      background: white;
      border-radius: 12px;
      margin: 20px 0;
    }

    /* Loading Skeleton */
    .product-skeleton {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      height: 350px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton-image {
      height: 200px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    .skeleton-content {
      padding: 16px;
    }

    .skeleton-line {
      height: 12px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .skeleton-line.short {
      width: 60%;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    /* Pagination */
    .pagination-wrapper {
      margin-top: 40px;
      margin-bottom: 40px;
    }

    .pagination .page-link {
      border-radius: 8px;
      margin: 0 2px;
      border: 1px solid #dee2e6;
      color: #007bff;
    }

    .pagination .page-link:hover {
      background-color: #e9ecef;
    }

    .pagination .page-item.active .page-link {
      background: linear-gradient(135deg, #007bff, #0056b3);
      border-color: #007bff;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }

      .products-toolbar {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
      }

      .toolbar-right {
        justify-content: space-between;
      }

      .sort-dropdown select {
        min-width: auto;
        flex: 1;
        margin-left: 10px;
      }
    }

    @media (max-width: 576px) {
      .page-header {
        padding: 40px 0 30px;
      }

      .page-title {
        font-size: 1.75rem;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  totalProducts = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 12;
  loading = false;

  searchQuery = '';
  categoryName = '';
  pageTitle = 'All Products';
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'name-asc';

  currentFilters: any = {};
  searchParams: ProductSearchParams = {
    page: 1,
    limit: 12,
    sortBy: 'name',
    sortOrder: 'asc'
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.currentPage = parseInt(params['page']) || 1;
      const category = params['category'];
      
      if (category) {
        this.searchParams.category = parseInt(category);
        this.updatePageTitle();
      }

      if (this.searchQuery) {
        this.searchParams.query = this.searchQuery;
        this.pageTitle = `Search Results`;
      }

      this.searchParams.page = this.currentPage;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.searchParams).subscribe({
      next: (response: ProductResponse) => {
        this.products = response.products;
        this.totalProducts = response.total;
        this.totalPages = response.totalPages;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onFiltersChanged(filters: any): void {
    this.currentFilters = filters;
    this.searchParams = {
      ...this.searchParams,
      category: filters.categories.length > 0 ? filters.categories[0] : undefined,
      minPrice: filters.priceRange.min,
      maxPrice: filters.priceRange.max,
      brand: filters.brands.length > 0 ? filters.brands[0] : undefined,
      page: 1
    };
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange(): void {
    const [sortBy, sortOrder] = this.sortBy.split('-');
    this.searchParams.sortBy = sortBy as any;
    this.searchParams.sortOrder = sortOrder as any;
    this.searchParams.page = 1;
    this.currentPage = 1;
    this.loadProducts();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.searchParams.page = page;
      this.loadProducts();
      
      // Update URL
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ...this.route.snapshot.queryParams, page: page },
        queryParamsHandling: 'merge'
      });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfPages = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, this.currentPage - halfPages);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  clearFilters(): void {
    this.currentFilters = {};
    this.searchParams = {
      page: 1,
      limit: 12,
      sortBy: 'name',
      sortOrder: 'asc'
    };
    this.currentPage = 1;
    this.loadProducts();
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  private updatePageTitle(): void {
    if (this.searchParams.category) {
      this.productService.getCategories().subscribe(categories => {
        const category = categories.find(c => c.id === this.searchParams.category);
        if (category) {
          this.categoryName = category.name;
          this.pageTitle = category.name;
        }
      });
    }
  }
}