// src/app/components/products/components/product-filters/product-filters.component.ts
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';

interface FilterState {
  categories: number[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
  brands: string[];
  rating: number;
  inStockOnly: boolean;
  dealTypes: string[];
  discountRange: {
    min: number;
    max: number;
  };
  endingSoon: boolean;
}

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filters-container">
      <div class="filters-header">
        <h5 class="filters-title">
          <i class="bi bi-funnel me-2"></i>
          Filters
        </h5>
        <button class="btn btn-sm btn-outline-secondary" (click)="clearFilters()">
          <i class="bi bi-x-circle me-1"></i>
          Clear All
        </button>
      </div>

      <!-- Results Count -->
      <div class="results-summary">
        <span class="text-muted">{{ totalProducts }} products found</span>
      </div>

      <!-- Deal Types Filter (for deals page) -->
      <div class="filter-section" *ngIf="showDealFilters">
        <h6 class="filter-title">
          <i class="bi bi-lightning-charge me-2"></i>Deal Types
          <button class="btn btn-sm" (click)="toggleSection('dealTypes')">
            <i class="bi" [class.bi-chevron-down]="!collapsedSections.dealTypes" 
               [class.bi-chevron-right]="collapsedSections.dealTypes"></i>
          </button>
        </h6>
        <div class="filter-content" *ngIf="!collapsedSections.dealTypes">
          <div class="form-check" *ngFor="let dealType of dealTypes">
            <input 
              class="form-check-input" 
              type="checkbox" 
              [id]="'dealType-' + dealType.id"
              [checked]="selectedDealTypes.includes(dealType.id)"
              (change)="onDealTypeChange(dealType.id, $event)">
            <label class="form-check-label" [for]="'dealType-' + dealType.id">
              <span class="label-content">
                <i [class]="dealType.icon + ' me-2'" [style.color]="dealType.color"></i>
                {{ dealType.name }}
              </span>
              <span class="count">({{ dealType.count }})</span>
            </label>
          </div>
        </div>
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
              [checked]="selectedCategories.includes(category.id)"
              (change)="onCategoryChange($event, category.id)">
            <label class="form-check-label" [for]="'cat-' + category.id">
              <span class="label-content">
                <i class="bi" [class]="'bi-' + category.icon + ' me-2'"></i>
                {{category.name}}
              </span>
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

      <!-- Discount Range (for deals page) -->
      <div class="filter-section" *ngIf="showDealFilters">
        <h6 class="filter-title">
          <i class="bi bi-percent me-2"></i>Discount Range
          <button class="btn btn-sm" (click)="toggleSection('discount')">
            <i class="bi" [class.bi-chevron-down]="!collapsedSections.discount" 
               [class.bi-chevron-right]="collapsedSections.discount"></i>
          </button>
        </h6>
        <div class="filter-content" *ngIf="!collapsedSections.discount">
          <div class="range-slider">
            <input 
              type="range" 
              class="form-range" 
              [min]="0" 
              [max]="80" 
              [(ngModel)]="discountRange.min"
              (ngModelChange)="onDiscountChange()">
            <div class="range-labels">
              <span>{{ discountRange.min }}%+</span>
              <span>80%</span>
            </div>
          </div>
          <div class="discount-presets mt-2">
            <button 
              class="btn btn-sm btn-outline-success me-1 mb-1"
              *ngFor="let preset of discountPresets"
              (click)="setDiscountRange(preset.min)"
              [class.active]="discountRange.min === preset.min">
              {{ preset.label }}
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
                [checked]="selectedBrands.includes(brand)"
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
                [checked]="selectedRating === rating.value"
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
              <i class="bi bi-check-circle me-2 text-success"></i>
              In Stock Only
            </label>
          </div>
        </div>
      </div>

      <!-- Ending Soon (for deals page) -->
      <div class="filter-section" *ngIf="showDealFilters">
        <h6 class="filter-title">
          <i class="bi bi-clock me-2"></i>Deal Status
        </h6>
        <div class="filter-content">
          <div class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="ending-soon"
              [(ngModel)]="showEndingSoon"
              (ngModelChange)="onEndingSoonChange()">
            <label class="form-check-label" for="ending-soon">
              <i class="bi bi-hourglass-split me-2 text-warning"></i>
              Ending Soon (24h)
            </label>
          </div>
        </div>
      </div>

      <!-- Apply Filters Button (Mobile) -->
      <div class="apply-filters d-md-none">
        <button class="btn btn-primary w-100" (click)="applyFilters()">
          <i class="bi bi-check2 me-2"></i>
          Apply Filters
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filters-container {
      background: var(--gradient-surface, white);
      border-radius: 15px;
      padding: 20px;
      box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
      border: 1px solid var(--surface-tertiary, rgba(255, 255, 255, 0.2));
      height: fit-content;
      position: sticky;
      top: 100px;
      max-height: calc(100vh - 120px);
      overflow-y: auto;
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--surface-tertiary, #e9ecef);
    }

    .filters-title {
      color: var(--text-primary, #2c3e50);
      font-weight: 600;
      margin: 0;
    }

    .results-summary {
      background: rgba(14, 165, 233, 0.1);
      border: 1px solid rgba(14, 165, 233, 0.2);
      border-radius: 10px;
      padding: 10px 15px;
      margin-bottom: 20px;
      text-align: center;
    }

    .filter-section {
      margin-bottom: 24px;
      border-bottom: 1px solid var(--surface-tertiary, #f8f9fa);
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
      color: var(--accent-sky, #495057);
      font-weight: 600;
      font-size: 0.95rem;
    }

    .filter-title button {
      border: none;
      background: none;
      color: var(--text-muted, #6c757d);
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
      color: var(--text-secondary, #495057);
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }

    .form-check-label:hover {
      color: var(--accent-light-sky, #007bff);
    }

    .form-check-input:checked ~ .form-check-label {
      color: var(--accent-sky, #007bff);
      font-weight: 500;
    }

    .label-content {
      display: flex;
      align-items: center;
    }

    .count {
      color: var(--text-muted, #6c757d);
      font-size: 0.8rem;
      background: rgba(51, 65, 85, 0.1);
      padding: 2px 6px;
      border-radius: 8px;
    }

    .price-inputs {
      margin-bottom: 12px;
    }

    .input-group-text {
      background: rgba(30, 41, 59, 0.1);
      border-color: var(--surface-tertiary, #dee2e6);
      color: var(--text-secondary, #6c757d);
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
      background: rgba(30, 41, 59, 0.05);
      border-color: var(--surface-tertiary, #dee2e6);
      color: var(--text-primary, #495057);
    }

    .brands-list {
      max-height: 150px;
      overflow-y: auto;
    }

    .rating-options .form-check-label {
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .stars {
      color: var(--warning, #ffc107);
      margin-bottom: 2px;
      font-size: 0.9rem;
    }

    .rating-text {
      font-size: 0.8rem;
      color: var(--text-muted, #6c757d);
    }

    /* Discount Range */
    .range-slider {
      margin-bottom: 10px;
    }

    .form-range {
      background: var(--surface-tertiary, #e9ecef);
    }

    .form-range::-webkit-slider-thumb {
      background: var(--accent-sky, #007bff);
    }

    .form-range::-moz-range-thumb {
      background: var(--accent-sky, #007bff);
      border: none;
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--text-muted, #6c757d);
      margin-top: 5px;
    }

    .discount-presets button {
      font-size: 0.8rem;
      padding: 4px 8px;
    }

    .discount-presets button.active {
      background: var(--success, #28a745);
      border-color: var(--success, #28a745);
      color: white;
    }

    /* Apply Filters Button */
    .apply-filters {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--surface-tertiary, #e9ecef);
    }

    /* Custom scrollbar */
    .brands-list::-webkit-scrollbar,
    .filters-container::-webkit-scrollbar {
      width: 4px;
    }

    .brands-list::-webkit-scrollbar-track,
    .filters-container::-webkit-scrollbar-track {
      background: var(--surface-primary, #f1f1f1);
      border-radius: 2px;
    }

    .brands-list::-webkit-scrollbar-thumb,
    .filters-container::-webkit-scrollbar-thumb {
      background: var(--accent-sky, #c1c1c1);
      border-radius: 2px;
    }

    .brands-list::-webkit-scrollbar-thumb:hover,
    .filters-container::-webkit-scrollbar-thumb:hover {
      background: var(--accent-light-sky, #a8a8a8);
    }

    @media (max-width: 768px) {
      .filters-container {
        position: static;
        margin-bottom: 20px;
        max-height: none;
      }
    }
  `]
})
export class ProductFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<FilterState>();
  @Input() totalProducts = 0;
  @Input() showDealFilters = false; // New input to show deal-specific filters

  categories: Category[] = [];
  brands: string[] = [];
  filteredBrands: string[] = [];
  brandSearch = '';

  priceRange = {
    min: null as number | null,
    max: null as number | null
  };

  discountRange = {
    min: 0,
    max: 80
  };

  selectedCategories: number[] = [];
  selectedBrands: string[] = [];
  selectedDealTypes: string[] = [];
  selectedRating = 0;
  showInStockOnly = false;
  showEndingSoon = false;

  collapsedSections = {
    categories: false,
    price: false,
    brands: false,
    rating: false,
    dealTypes: false,
    discount: false
  };

  dealTypes = [
    { id: 'flash', name: 'Flash Deals', icon: 'bi bi-lightning-charge', color: '#ef4444', count: 3 },
    { id: 'daily', name: 'Daily Deals', icon: 'bi bi-sun', color: '#0ea5e9', count: 2 },
    { id: 'weekly', name: 'Weekly Specials', icon: 'bi bi-calendar-week', color: '#10b981', count: 4 },
    { id: 'clearance', name: 'Clearance', icon: 'bi bi-tag', color: '#f59e0b', count: 1 }
  ];

  quickPriceRanges = [
    { label: 'Under $100', min: 0, max: 100 },
    { label: '$100-$500', min: 100, max: 500 },
    { label: '$500-$1000', min: 500, max: 1000 },
    { label: '$1000+', min: 1000, max: null }
  ];

  discountPresets = [
    { label: '10%+', min: 10 },
    { label: '25%+', min: 25 },
    { label: '50%+', min: 50 },
    { label: '75%+', min: 75 }
  ];

  ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4, label: '4 stars & up' },
    { value: 3, label: '3 stars & up' },
    { value: 2, label: '2 stars & up' },
    { value: 1, label: '1 star & up' }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
    this.emitFilters(); // Emit initial state
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

  onDealTypeChange(dealTypeId: string, event: any): void {
    if (event.target.checked) {
      this.selectedDealTypes.push(dealTypeId);
    } else {
      this.selectedDealTypes = this.selectedDealTypes.filter(id => id !== dealTypeId);
    }
    this.emitFilters();
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

  onDiscountChange(): void {
    this.emitFilters();
  }

  onRatingChange(rating: number): void {
    this.selectedRating = rating;
    this.emitFilters();
  }

  onStockChange(): void {
    this.emitFilters();
  }

  onEndingSoonChange(): void {
    this.emitFilters();
  }

  setQuickPrice(range: any): void {
    this.priceRange.min = range.min;
    this.priceRange.max = range.max;
    this.emitFilters();
  }

  setDiscountRange(min: number): void {
    this.discountRange.min = min;
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
    this.selectedDealTypes = [];
    this.selectedRating = 0;
    this.showInStockOnly = false;
    this.showEndingSoon = false;
    this.priceRange = { min: null, max: null };
    this.discountRange = { min: 0, max: 80 };
    this.brandSearch = '';
    this.filteredBrands = this.brands;
    this.emitFilters();
  }

  applyFilters(): void {
    // For mobile - close the offcanvas after applying filters
    const offcanvas = document.getElementById('filtersOffcanvas');
    if (offcanvas) {
      const bsOffcanvas = (window as any).bootstrap?.Offcanvas?.getInstance(offcanvas);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  }

  private emitFilters(): void {
    const filters: FilterState = {
      categories: this.selectedCategories,
      brands: this.selectedBrands,
      dealTypes: this.selectedDealTypes,
      priceRange: this.priceRange,
      discountRange: this.discountRange,
      rating: this.selectedRating,
      inStockOnly: this.showInStockOnly,
      endingSoon: this.showEndingSoon
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