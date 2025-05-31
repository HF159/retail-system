// src/app/components/products/components/product-filters/product-filters.component.ts
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-container">
      <div class="filters-header">
        <h5><i class="bi bi-funnel me-2"></i>Filters</h5>
        <button class="btn btn-sm btn-outline-secondary" (click)="clearFilters()">
          <i class="bi bi-arrow-clockwise me-1"></i>Clear
        </button>
      </div>

      <!-- Categories -->
      <div class="filter-section">
        <h6 class="filter-title">
          <i class="bi bi-grid-3x3-gap me-2"></i>Categories
          <button class="btn btn-sm" (click)="toggleSection('categories')">
            <i class="bi" [class.bi-chevron-down]="!collapsedSections.categories" 
               [class.bi-chevron-right]="collapsedSections.categories"></i>
          </button>
        </h6>
        <div class="filter-content" *ngIf="!collapsedSections.categories">
          <div class="form-check" *ngFor="let category of categories">
            <input 
              class="form-check-input" 
              type="checkbox" 
              [id]="'cat-' + category.id"
              [value]="category.id"
              (change)="onCategoryChange($event, category.id)">
            <label class="form-check-label" [for]="'cat-' + category.id">
              <i class="bi" [class]="'bi-' + category.icon + ' me-2'"></i>
              {{category.name}}
              <span class="count">({{category.productCount}})</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Price Range -->
      <div class="filter-section">
        <h6 class="filter-title">
          <i class="bi bi-currency-dollar me-2"></i>Price Range
          <button class="btn btn-sm" (click)="toggleSection('price')">
            <i class="bi" [class.bi-chevron-down]="!collapsedSections.price" 
               [class.bi-chevron-right]="collapsedSections.price"></i>
          </button>
        </h6>
        <div class="filter-content" *ngIf="!collapsedSections.price">
          <div class="price-inputs">
            <div class="input-group input-group-sm mb-2">
              <span class="input-group-text">$</span>
              <input 
                type="number" 
                class="form-control" 
                placeholder="Min"
                [(ngModel)]="priceRange.min"
                (ngModelChange)="onPriceChange()">
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text">$</span>
              <input 
                type="number" 
                class="form-control" 
                placeholder="Max"
                [(ngModel)]="priceRange.max"
                (ngModelChange)="onPriceChange()">
            </div>
          </div>
          
          <!-- Quick Price Ranges -->
          <div class="quick-ranges">
            <button 
              class="btn btn-sm btn-outline-primary"
              *ngFor="let range of quickPriceRanges"
              (click)="setQuickPrice(range)">
              {{range.label}}
            </button>
          </div>
        </div>
      </div>

      <!-- Brands -->
      <div class="filter-section">
        <h6 class="filter-title">
          <i class="bi bi-award me-2"></i>Brands
          <button class="btn btn-sm" (click)="toggleSection('brands')">
            <i class="bi" [class.bi-chevron-down]="!collapsedSections.brands" 
               [class.bi-chevron-right]="collapsedSections.brands"></i>
          </button>
        </h6>
        <div class="filter-content" *ngIf="!collapsedSections.brands">
          <div class="search-brands mb-2">
            <input 
              type="text" 
              class="form-control form-control-sm" 
              placeholder="Search brands..."
              [(ngModel)]="brandSearch"
              (ngModelChange)="filterBrands()">
          </div>
          <div class="brands-list">
            <div class="form-check" *ngFor="let brand of filteredBrands">
              <input 
                class="form-check-input" 
                type="checkbox" 
                [id]="'brand-' + brand"
                [value]="brand"
                (change)="onBrandChange($event, brand)">
              <label class="form-check-label" [for]="'brand-' + brand">
                {{brand}}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Rating -->
      <div class="filter-section">
        <h6 class="filter-title">
          <i class="bi bi-star me-2"></i>Rating
          <button class="btn btn-sm" (click)="toggleSection('rating')">
            <i class="bi" [class.bi-chevron-down]="!collapsedSections.rating" 
               [class.bi-chevron-right]="collapsedSections.rating"></i>
          </button>
        </h6>
        <div class="filter-content" *ngIf="!collapsedSections.rating">
          <div class="rating-options">
            <div class="form-check" *ngFor="let rating of ratingOptions">
              <input 
                class="form-check-input" 
                type="radio" 
                name="rating"
                [id]="'rating-' + rating.value"
                [value]="rating.value"
                (change)="onRatingChange(rating.value)">
              <label class="form-check-label" [for]="'rating-' + rating.value">
                <div class="stars">
                  <i class="bi bi-star-fill" *ngFor="let star of getStars(rating.value)"></i>
                  <i class="bi bi-star" *ngFor="let star of getEmptyStars(rating.value)"></i>
                </div>
                <span class="rating-text">{{rating.label}}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Stock Status -->
      <div class="filter-section">
        <h6 class="filter-title">
          <i class="bi bi-box me-2"></i>Availability
        </h6>
        <div class="filter-content">
          <div class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="in-stock"
              [(ngModel)]="showInStockOnly"
              (ngModelChange)="onStockChange()">
            <label class="form-check-label" for="in-stock">
              In Stock Only
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filters-container {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      height: fit-content;
      position: sticky;
      top: 100px;
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e9ecef;
    }

    .filters-header h5 {
      margin: 0;
      color: #2c3e50;
      font-weight: 600;
    }

    .filter-section {
      margin-bottom: 24px;
      border-bottom: 1px solid #f8f9fa;
      padding-bottom: 16px;
    }

    .filter-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .filter-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      color: #495057;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .filter-title button {
      border: none;
      background: none;
      color: #6c757d;
      padding: 2px 4px;
    }

    .filter-content {
      margin-left: 8px;
    }

    .form-check {
      margin-bottom: 8px;
    }

    .form-check-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      cursor: pointer;
      color: #495057;
      font-size: 0.9rem;
    }

    .count {
      color: #6c757d;
      font-size: 0.8rem;
    }

    .price-inputs {
      margin-bottom: 12px;
    }

    .quick-ranges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .quick-ranges .btn {
      font-size: 0.8rem;
      padding: 4px 8px;
    }

    .search-brands input {
      border-radius: 6px;
    }

    .brands-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .rating-options .form-check-label {
      flex-direction: column;
      align-items: flex-start;
    }

    .stars {
      color: #ffc107;
      margin-bottom: 2px;
    }

    .rating-text {
      font-size: 0.8rem;
      color: #6c757d;
    }

    /* Custom scrollbar */
    .brands-list::-webkit-scrollbar {
      width: 4px;
    }

    .brands-list::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }

    .brands-list::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 2px;
    }

    .brands-list::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }

    @media (max-width: 768px) {
      .filters-container {
        position: static;
        margin-bottom: 20px;
      }
    }
  `]
})
export class ProductFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();
  @Input() totalProducts = 0;

  categories: Category[] = [];
  brands: string[] = [];
  filteredBrands: string[] = [];
  brandSearch = '';

  priceRange = {
    min: null as number | null,
    max: null as number | null
  };

  selectedCategories: number[] = [];
  selectedBrands: string[] = [];
  selectedRating = 0;
  showInStockOnly = false;

  collapsedSections = {
    categories: false,
    price: false,
    brands: false,
    rating: false
  };

  quickPriceRanges = [
    { label: 'Under $100', min: 0, max: 100 },
    { label: '$100-$500', min: 100, max: 500 },
    { label: '$500-$1000', min: 500, max: 1000 },
    { label: '$1000+', min: 1000, max: null }
  ];

  ratingOptions = [
    { value: 4, label: '4 stars & up' },
    { value: 3, label: '3 stars & up' },
    { value: 2, label: '2 stars & up' },
    { value: 1, label: '1 star & up' }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadBrands(): void {
    this.productService.getBrands().subscribe(brands => {
      this.brands = brands;
      this.filteredBrands = brands;
    });
  }

  toggleSection(section: keyof typeof this.collapsedSections): void {
    this.collapsedSections[section] = !this.collapsedSections[section];
  }

  onCategoryChange(event: any, categoryId: number): void {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.emitFilters();
  }

  onBrandChange(event: any, brand: string): void {
    if (event.target.checked) {
      this.selectedBrands.push(brand);
    } else {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
    }
    this.emitFilters();
  }

  onPriceChange(): void {
    this.emitFilters();
  }

  onRatingChange(rating: number): void {
    this.selectedRating = rating;
    this.emitFilters();
  }

  onStockChange(): void {
    this.emitFilters();
  }

  setQuickPrice(range: any): void {
    this.priceRange.min = range.min;
    this.priceRange.max = range.max;
    this.emitFilters();
  }

  filterBrands(): void {
    if (!this.brandSearch.trim()) {
      this.filteredBrands = this.brands;
    } else {
      this.filteredBrands = this.brands.filter(brand =>
        brand.toLowerCase().includes(this.brandSearch.toLowerCase())
      );
    }
  }

  clearFilters(): void {
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.selectedRating = 0;
    this.showInStockOnly = false;
    this.priceRange = { min: null, max: null };
    this.brandSearch = '';
    this.filteredBrands = this.brands;

    // Clear all checkboxes and radio buttons
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(cb => cb.checked = false);
    
    const radios = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    radios.forEach(rb => rb.checked = false);

    this.emitFilters();
  }

  private emitFilters(): void {
    const filters = {
      categories: this.selectedCategories,
      brands: this.selectedBrands,
      priceRange: this.priceRange,
      rating: this.selectedRating,
      inStockOnly: this.showInStockOnly
    };
    this.filtersChanged.emit(filters);
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}