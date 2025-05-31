// src/app/components/account/order-history/order-history.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  itemCount: number;
  trackingNumber?: string;
  items: {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Order Filters -->
    <div class="order-filters mb-4">
      <div class="row g-3">
        <div class="col-md-3">
          <select class="form-select" [(ngModel)]="orderFilter" (ngModelChange)="filterOrders()">
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="col-md-4">
          <input type="search" class="form-control" 
                 placeholder="Search orders..." 
                 [(ngModel)]="orderSearch"
                 (ngModelChange)="filterOrders()">
        </div>
        <div class="col-md-3">
          <select class="form-select" [(ngModel)]="timeFilter" (ngModelChange)="filterOrders()">
            <option value="">All Time</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
        <div class="col-md-2">
          <button class="btn btn-outline-secondary w-100" (click)="exportOrders()">
            <i class="bi bi-download me-2"></i>
            Export
          </button>
        </div>
      </div>
    </div>

    <!-- Order Summary Stats -->
    <div class="order-stats mb-4">
      <div class="row g-3">
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-value">{{getTotalOrdersCount()}}</div>
            <div class="stat-label">Total Orders</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-value">\${{getTotalSpent() | number:'1.2-2'}}</div>
            <div class="stat-label">Total Spent</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-value">{{getAverageOrderValue() | number:'1.2-2'}}</div>
            <div class="stat-label">Avg Order</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-item">
            <div class="stat-value">{{getPendingOrdersCount()}}</div>
            <div class="stat-label">Pending</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="orders-list">
      <div *ngIf="filteredOrders.length === 0" class="no-orders text-center py-5">
        <i class="bi bi-bag display-4 text-muted mb-3"></i>
        <h5>No orders found</h5>
        <p class="text-muted">
          <span *ngIf="orderFilter || orderSearch">Try adjusting your filters</span>
          <span *ngIf="!orderFilter && !orderSearch">You haven't placed any orders yet</span>
        </p>
        <button *ngIf="!orderFilter && !orderSearch" class="btn btn-primary" routerLink="/products">
          <i class="bi bi-cart-plus me-2"></i>
          Start Shopping
        </button>
        <button *ngIf="orderFilter || orderSearch" class="btn btn-outline-secondary" (click)="clearFilters()">
          Clear Filters
        </button>
      </div>

      <div *ngFor="let order of filteredOrders" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <h5 class="order-number">Order #{{order.orderNumber}}</h5>
            <div class="order-meta">
              <span class="order-date">
                <i class="bi bi-calendar3 me-1"></i>
                {{order.date | date:'fullDate'}}
              </span>
              <span class="order-items">
                <i class="bi bi-box me-1"></i>
                {{order.itemCount}} {{order.itemCount === 1 ? 'item' : 'items'}}
              </span>
            </div>
          </div>
          <div class="order-status-section">
            <span class="badge order-status-badge" [class]="getOrderStatusBadge(order.status)">
              <i class="bi" [class]="getOrderStatusIcon(order.status)"></i>
              {{order.status | titlecase}}
            </span>
            <div class="order-total">\${{order.total | number:'1.2-2'}}</div>
          </div>
        </div>

        <!-- Order Progress -->
        <div class="order-progress mb-3" *ngIf="order.status !== 'cancelled'">
          <div class="progress-steps">
            <div class="step" [class.completed]="isStepCompleted('pending', order.status)" [class.active]="order.status === 'pending'">
              <div class="step-icon">
                <i class="bi bi-clock"></i>
              </div>
              <div class="step-label">Pending</div>
            </div>
            <div class="step" [class.completed]="isStepCompleted('processing', order.status)" [class.active]="order.status === 'processing'">
              <div class="step-icon">
                <i class="bi bi-gear"></i>
              </div>
              <div class="step-label">Processing</div>
            </div>
            <div class="step" [class.completed]="isStepCompleted('shipped', order.status)" [class.active]="order.status === 'shipped'">
              <div class="step-icon">
                <i class="bi bi-truck"></i>
              </div>
              <div class="step-label">Shipped</div>
            </div>
            <div class="step" [class.completed]="isStepCompleted('delivered', order.status)" [class.active]="order.status === 'delivered'">
              <div class="step-icon">
                <i class="bi bi-check-circle"></i>
              </div>
              <div class="step-label">Delivered</div>
            </div>
          </div>
        </div>

        <!-- Tracking Info -->
        <div *ngIf="order.trackingNumber && order.status === 'shipped'" class="tracking-info mb-3">
          <div class="alert alert-info">
            <i class="bi bi-truck me-2"></i>
            <strong>Tracking Number:</strong> {{order.trackingNumber}}
            <button class="btn btn-sm btn-outline-primary ms-3" (click)="trackOrder(order.id)">
              Track Package
            </button>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-items-section">
          <div class="items-header">
            <h6>Order Items</h6>
            <button class="btn btn-sm btn-outline-secondary" 
                    (click)="toggleItemsVisibility(order.id)"
                    [attr.aria-expanded]="isItemsVisible(order.id)">
              <i class="bi" [class.bi-chevron-down]="!isItemsVisible(order.id)" [class.bi-chevron-up]="isItemsVisible(order.id)"></i>
              {{isItemsVisible(order.id) ? 'Hide' : 'Show'}} Items
            </button>
          </div>
          
          <div class="order-items" *ngIf="isItemsVisible(order.id)">
            <div *ngFor="let item of order.items" class="order-item">
              <img [src]="item.image" [alt]="item.name" class="item-image">
              <div class="item-details">
                <h6 class="item-name">{{item.name}}</h6>
                <p class="item-quantity">Quantity: {{item.quantity}}</p>
              </div>
              <div class="item-price">\${{item.price | number:'1.2-2'}}</div>
              <div class="item-actions">
                <button class="btn btn-sm btn-outline-primary" [routerLink]="['/products', item.id]">
                  View Product
                </button>
                <button *ngIf="order.status === 'delivered'" 
                        class="btn btn-sm btn-outline-secondary" 
                        (click)="addToCart(item)">
                  Buy Again
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Actions -->
        <div class="order-footer">
          <div class="order-actions">
            <button class="btn btn-outline-primary btn-sm" (click)="viewOrderDetails(order.id)">
              <i class="bi bi-eye me-1"></i>
              View Details
            </button>
            
            <button *ngIf="order.status === 'shipped'" 
                    class="btn btn-outline-info btn-sm" 
                    (click)="trackOrder(order.id)">
              <i class="bi bi-truck me-1"></i>
              Track Order
            </button>
            
            <button *ngIf="canReorder(order.status)" 
                    class="btn btn-primary btn-sm" 
                    (click)="reorder(order.id)">
              <i class="bi bi-arrow-repeat me-1"></i>
              Reorder
            </button>
            
            <button *ngIf="canCancel(order.status)" 
                    class="btn btn-outline-danger btn-sm" 
                    (click)="cancelOrder(order.id)">
              <i class="bi bi-x-circle me-1"></i>
              Cancel
            </button>

            <div class="dropdown">
              <button class="btn btn-outline-secondary btn-sm dropdown-toggle" 
                      data-bs-toggle="dropdown">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" (click)="downloadInvoice(order.id)">
                  <i class="bi bi-download me-2"></i>Download Invoice
                </a></li>
                <li><a class="dropdown-item" (click)="contactSupport(order.id)">
                  <i class="bi bi-headset me-2"></i>Contact Support
                </a></li>
                <li *ngIf="order.status === 'delivered'"><a class="dropdown-item" (click)="leaveReview(order.id)">
                  <i class="bi bi-star me-2"></i>Leave Review
                </a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <nav class="pagination-wrapper mt-4" *ngIf="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" [class.disabled]="currentPage === 1">
          <a class="page-link" (click)="goToPage(currentPage - 1)">
            <i class="bi bi-chevron-left"></i>
          </a>
        </li>
        
        <li class="page-item" 
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
  `,
  styles: [`
    .order-filters {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .order-stats {
      background: white;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e9ecef;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .stat-item {
      text-align: center;
      padding: 10px;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .order-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
      border: 1px solid #e9ecef;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .order-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f1f3f4;
    }

    .order-number {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .order-meta {
      display: flex;
      gap: 20px;
      font-size: 0.9rem;
      color: #6c757d;
    }

    .order-status-section {
      text-align: right;
    }

    .order-status-badge {
      font-size: 0.8rem;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      margin-bottom: 8px;
      display: inline-block;
    }

    .order-status-badge.bg-pending {
      background-color: #ffc107;
      color: #856404;
    }

    .order-status-badge.bg-processing {
      background-color: #17a2b8;
      color: white;
    }

    .order-status-badge.bg-shipped {
      background-color: #007bff;
      color: white;
    }

    .order-status-badge.bg-delivered {
      background-color: #28a745;
      color: white;
    }

    .order-status-badge.bg-cancelled {
      background-color: #dc3545;
      color: white;
    }

    .order-total {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2c3e50;
    }

    /* Progress Steps */
    .order-progress {
      margin: 20px 0;
    }

    .progress-steps {
      display: flex;
      justify-content: space-between;
      position: relative;
    }

    .progress-steps::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 0;
      right: 0;
      height: 2px;
      background: #e9ecef;
      z-index: 1;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      position: relative;
      z-index: 2;
    }

    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e9ecef;
      color: #6c757d;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
      font-size: 1.1rem;
      transition: all 0.3s ease;
    }

    .step.completed .step-icon {
      background: #28a745;
      color: white;
    }

    .step.active .step-icon {
      background: #007bff;
      color: white;
      animation: pulse 2s infinite;
    }

    .step-label {
      font-size: 0.8rem;
      color: #6c757d;
      text-align: center;
    }

    .step.completed .step-label,
    .step.active .step-label {
      color: #2c3e50;
      font-weight: 500;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
    }

    /* Tracking Info */
    .tracking-info {
      background: #e3f2fd;
      border: 1px solid #bbdefb;
      border-radius: 8px;
      padding: 12px;
    }

    /* Order Items */
    .items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .items-header h6 {
      margin: 0;
      color: #2c3e50;
    }

    .order-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f1f3f4;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .item-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      object-fit: cover;
      margin-right: 16px;
    }

    .item-details {
      flex: 1;
      margin-right: 16px;
    }

    .item-name {
      font-size: 0.95rem;
      font-weight: 500;
      margin-bottom: 4px;
      color: #2c3e50;
    }

    .item-quantity {
      font-size: 0.85rem;
      color: #6c757d;
      margin: 0;
    }

    .item-price {
      font-weight: 600;
      color: #007bff;
      margin-right: 16px;
    }

    .item-actions {
      display: flex;
      gap: 8px;
    }

    /* Order Footer */
    .order-footer {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #f1f3f4;
    }

    .order-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    /* No Orders State */
    .no-orders {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 40px 20px;
    }

    /* Pagination */
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

    /* Responsive Design */
    @media (max-width: 768px) {
      .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .order-status-section {
        text-align: left;
        width: 100%;
      }

      .progress-steps {
        flex-wrap: wrap;
        gap: 10px;
      }

      .step {
        flex: none;
        min-width: 70px;
      }

      .order-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .item-image {
        margin-right: 0;
      }

      .item-actions {
        width: 100%;
        justify-content: space-between;
      }

      .order-actions {
        flex-direction: column;
      }

      .order-actions .btn {
        width: 100%;
      }
    }

    @media (max-width: 576px) {
      .order-card {
        padding: 16px;
      }

      .order-meta {
        flex-direction: column;
        gap: 8px;
      }

      .stat-value {
        font-size: 1.25rem;
      }
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  @Input() orders: Order[] = [];

  orderFilter: string = '';
  orderSearch: string = '';
  timeFilter: string = '';
  filteredOrders: Order[] = [];
  visibleItems: Set<string> = new Set();

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor() {}

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];
    this.calculatePagination();
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = !this.orderFilter || order.status === this.orderFilter;
      const matchesSearch = !this.orderSearch || 
        order.orderNumber.toLowerCase().includes(this.orderSearch.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(this.orderSearch.toLowerCase()));
      
      const matchesTime = this.matchesTimeFilter(order);
      
      return matchesStatus && matchesSearch && matchesTime;
    });

    this.currentPage = 1;
    this.calculatePagination();
  }

  private matchesTimeFilter(order: Order): boolean {
    if (!this.timeFilter) return true;
    
    const orderDate = new Date(order.date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysDiff <= parseInt(this.timeFilter);
  }

  clearFilters(): void {
    this.orderFilter = '';
    this.orderSearch = '';
    this.timeFilter = '';
    this.filterOrders();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
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

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
    }
  }

  // Statistics methods
  getTotalOrdersCount(): number {
    return this.orders.length;
  }

  getTotalSpent(): number {
    return this.orders.reduce((total, order) => total + order.total, 0);
  }

  getAverageOrderValue(): number {
    const total = this.getTotalSpent();
    const count = this.getTotalOrdersCount();
    return count > 0 ? total / count : 0;
  }

  getPendingOrdersCount(): number {
    return this.orders.filter(order => order.status === 'pending' || order.status === 'processing').length;
  }

  // Order status helpers
  getOrderStatusBadge(status: string): string {
    return `bg-${status}`;
  }

  getOrderStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'pending': 'bi-clock',
      'processing': 'bi-gear',
      'shipped': 'bi-truck',
      'delivered': 'bi-check-circle',
      'cancelled': 'bi-x-circle'
    };
    return icons[status] || 'bi-circle';
  }

  // Progress tracking
  isStepCompleted(stepStatus: string, currentStatus: string): boolean {
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const stepIndex = statusOrder.indexOf(stepStatus);
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex > stepIndex;
  }

  // Item visibility
  toggleItemsVisibility(orderId: string): void {
    if (this.visibleItems.has(orderId)) {
      this.visibleItems.delete(orderId);
    } else {
      this.visibleItems.add(orderId);
    }
  }

  isItemsVisible(orderId: string): boolean {
    return this.visibleItems.has(orderId);
  }

  // Order actions
  canReorder(status: string): boolean {
    return status === 'delivered';
  }

  canCancel(status: string): boolean {
    return status === 'pending' || status === 'processing';
  }

  viewOrderDetails(orderId: string): void {
    console.log('Viewing order details:', orderId);
    // Navigate to order details page
  }

  trackOrder(orderId: string): void {
    console.log('Tracking order:', orderId);
    // Open tracking modal or navigate to tracking page
  }

  reorder(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order && confirm(`Reorder ${order.items.length} items from order #${order.orderNumber}?`)) {
      console.log('Reordering:', orderId);
      // Add all items to cart
    }
  }

  cancelOrder(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order && confirm(`Cancel order #${order.orderNumber}? This action cannot be undone.`)) {
      console.log('Cancelling order:', orderId);
      // Cancel order API call
    }
  }

  addToCart(item: any): void {
    console.log('Adding to cart:', item.name);
    // Add item to cart
  }

  downloadInvoice(orderId: string): void {
    console.log('Downloading invoice for order:', orderId);
    // Download invoice PDF
  }

  contactSupport(orderId: string): void {
    console.log('Contacting support for order:', orderId);
    // Open support chat or navigate to support page
  }

  leaveReview(orderId: string): void {
    console.log('Leaving review for order:', orderId);
    // Navigate to review page
  }

  exportOrders(): void {
    console.log('Exporting orders...');
    // Export orders to CSV/PDF
  }
}