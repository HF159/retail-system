// src/app/components/account/account.component.ts (Enhanced Version)
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { UserService, UserProfile, Address, UserSettings } from '../../services/user.service';
import { CartService } from '../../services/cart.service';

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
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="account-page">
      <div class="container-fluid py-4">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-lg-3 col-md-4">
            <div class="account-sidebar">
              <!-- User Info Card -->
              <div class="user-info-card" *ngIf="userProfile">
                <div class="user-avatar">
                  <img [src]="userProfile.avatar" [alt]="userProfile.firstName" class="avatar-img">
                  <button class="btn btn-sm btn-primary avatar-edit" (click)="openAvatarUpload()">
                    <i class="bi bi-camera"></i>
                  </button>
                </div>
                <div class="user-details">
                  <h4 class="user-name">{{userProfile.firstName}} {{userProfile.lastName}}</h4>
                  <p class="user-email">{{userProfile.email}}</p>
                  <div class="membership-badge">
                    <span class="badge" [class]="getMembershipBadgeClass()">
                      <i class="bi bi-star-fill me-1"></i>
                      {{userProfile.membershipLevel}}
                    </span>
                  </div>
                  <div class="membership-progress mt-2">
                    <div class="progress" style="height: 4px;">
                      <div class="progress-bar bg-gradient" 
                           [style.width.%]="getMembershipProgress()"
                           role="progressbar"></div>
                    </div>
                    <small class="text-muted">{{getNextMembershipInfo()}}</small>
                  </div>
                </div>
              </div>

              <!-- Navigation Menu -->
              <nav class="account-nav">
                <ul class="nav flex-column">
                  <li class="nav-item">
                    <a class="nav-link" 
                       [class.active]="activeTab === 'overview'" 
                       (click)="setActiveTab('overview')">
                      <i class="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" 
                       [class.active]="activeTab === 'profile'" 
                       (click)="setActiveTab('profile')">
                      <i class="bi bi-person me-2"></i>
                      Profile
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" 
                       [class.active]="activeTab === 'orders'" 
                       (click)="setActiveTab('orders')">
                      <i class="bi bi-bag me-2"></i>
                      Orders
                      <span class="badge bg-primary ms-auto">{{orders.length}}</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" 
                       [class.active]="activeTab === 'addresses'" 
                       (click)="setActiveTab('addresses')">
                      <i class="bi bi-geo-alt me-2"></i>
                      Addresses
                      <span class="badge bg-secondary ms-auto">{{addresses.length}}</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" 
                       [class.active]="activeTab === 'wishlist'" 
                       (click)="setActiveTab('wishlist')">
                      <i class="bi bi-heart me-2"></i>
                      Wishlist
                      <span class="badge bg-danger ms-auto">{{wishlistCount}}</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" 
                       [class.active]="activeTab === 'settings'" 
                       (click)="setActiveTab('settings')">
                      <i class="bi bi-gear me-2"></i>
                      Settings
                    </a>
                  </li>
                  <li class="nav-item mt-3">
                    <a class="nav-link text-danger" (click)="signOut()">
                      <i class="bi bi-box-arrow-right me-2"></i>
                      Sign Out
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-lg-9 col-md-8">
            <div class="account-content">

              <!-- Loading State -->
              <div *ngIf="loading" class="loading-state text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading your account information...</p>
              </div>

              <!-- Dashboard Tab -->
              <div *ngIf="activeTab === 'overview' && !loading" class="tab-content">
                <div class="page-header">
                  <h2 class="page-title">
                    <i class="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </h2>
                  <p class="page-subtitle">Welcome back, {{userProfile?.firstName}}!</p>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions-row mb-4">
                  <button class="btn btn-primary" routerLink="/products">
                    <i class="bi bi-cart-plus me-2"></i>
                    Continue Shopping
                  </button>
                  <button class="btn btn-outline-primary" (click)="setActiveTab('orders')">
                    <i class="bi bi-bag me-2"></i>
                    View Orders
                  </button>
                  <button class="btn btn-outline-secondary" (click)="setActiveTab('wishlist')">
                    <i class="bi bi-heart me-2"></i>
                    My Wishlist
                  </button>
                </div>

                <!-- Stats Cards -->
                <div class="row g-3 mb-4">
                  <div class="col-lg-3 col-md-6">
                    <div class="stat-card">
                      <div class="stat-icon bg-primary">
                        <i class="bi bi-bag"></i>
                      </div>
                      <div class="stat-content">
                        <h3 class="stat-number">{{userProfile?.totalOrders}}</h3>
                        <p class="stat-label">Total Orders</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-6">
                    <div class="stat-card">
                      <div class="stat-icon bg-success">
                        <i class="bi bi-currency-dollar"></i>
                      </div>
                      <div class="stat-content">
                        <h3 class="stat-number">\${{userProfile?.totalSpent | number:'1.0-0'}}</h3>
                        <p class="stat-label">Total Spent</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-6">
                    <div class="stat-card">
                      <div class="stat-icon bg-warning">
                        <i class="bi bi-heart"></i>
                      </div>
                      <div class="stat-content">
                        <h3 class="stat-number">{{wishlistCount}}</h3>
                        <p class="stat-label">Wishlist Items</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-6">
                    <div class="stat-card">
                      <div class="stat-icon bg-info">
                        <i class="bi bi-star"></i>
                      </div>
                      <div class="stat-content">
                        <h3 class="stat-number">{{cartItemCount}}</h3>
                        <p class="stat-label">Cart Items</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Membership Benefits -->
                <div class="card mb-4" *ngIf="userProfile">
                  <div class="card-header">
                    <h5 class="card-title mb-0">
                      <i class="bi bi-star-fill me-2 text-warning"></i>
                      {{userProfile.membershipLevel}} Member Benefits
                    </h5>
                  </div>
                  <div class="card-body">
                    <div class="benefits-list">
                      <div *ngFor="let benefit of membershipBenefits" class="benefit-item">
                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                        {{benefit}}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Recent Orders -->
                <div class="card">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">
                      <i class="bi bi-clock-history me-2"></i>
                      Recent Orders
                    </h5>
                    <button class="btn btn-sm btn-outline-primary" (click)="setActiveTab('orders')">
                      View All
                    </button>
                  </div>
                  <div class="card-body">
                    <div class="recent-orders" *ngIf="orders.length > 0">
                      <div *ngFor="let order of getRecentOrders()" class="order-item">
                        <div class="order-info">
                          <div class="order-number">#{{order.orderNumber}}</div>
                          <div class="order-date">{{order.date | date:'mediumDate'}}</div>
                        </div>
                        <div class="order-status">
                          <span class="badge" [class]="getOrderStatusBadge(order.status)">
                            {{order.status | titlecase}}
                          </span>
                        </div>
                        <div class="order-total">\${{order.total | number:'1.2-2'}}</div>
                        <div class="order-actions">
                          <button class="btn btn-sm btn-outline-primary" (click)="viewOrder(order.id)">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                    <div *ngIf="orders.length === 0" class="text-center py-4">
                      <i class="bi bi-bag display-4 text-muted mb-3"></i>
                      <h6>No orders yet</h6>
                      <p class="text-muted">Start shopping to see your orders here</p>
                      <button class="btn btn-primary" routerLink="/products">
                        Browse Products
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Profile Tab -->
              <div *ngIf="activeTab === 'profile' && !loading" class="tab-content">
                <div class="page-header">
                  <h2 class="page-title">
                    <i class="bi bi-person me-2"></i>
                    Profile Settings
                  </h2>
                  <p class="page-subtitle">Manage your personal information</p>
                </div>

                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" *ngIf="profileForm">
                  <div class="row g-4">
                    <div class="col-md-6">
                      <label class="form-label">First Name *</label>
                      <input type="text" class="form-control" formControlName="firstName"
                             [class.is-invalid]="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched">
                      <div class="invalid-feedback">
                        First name is required
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Last Name *</label>
                      <input type="text" class="form-control" formControlName="lastName"
                             [class.is-invalid]="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched">
                      <div class="invalid-feedback">
                        Last name is required
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Email *</label>
                      <input type="email" class="form-control" formControlName="email"
                             [class.is-invalid]="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                      <div class="invalid-feedback">
                        Please enter a valid email address
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Phone</label>
                      <input type="tel" class="form-control" formControlName="phone">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Date of Birth</label>
                      <input type="date" class="form-control" formControlName="dateOfBirth">
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Gender</label>
                      <select class="form-select" formControlName="gender">
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <button type="submit" class="btn btn-primary me-3" 
                              [disabled]="!profileForm.valid || profileUpdateLoading">
                        <span *ngIf="profileUpdateLoading" class="spinner-border spinner-border-sm me-2"></span>
                        <i *ngIf="!profileUpdateLoading" class="bi bi-check-lg me-2"></i>
                        {{profileUpdateLoading ? 'Updating...' : 'Update Profile'}}
                      </button>
                      <button type="button" class="btn btn-outline-secondary" (click)="resetProfileForm()">
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Reset
                      </button>
                    </div>
                  </div>
                </form>

                <!-- Success Message -->
                <div *ngIf="profileUpdateSuccess" class="alert alert-success alert-dismissible fade show mt-3">
                  <i class="bi bi-check-circle me-2"></i>
                  Profile updated successfully!
                  <button type="button" class="btn-close" (click)="profileUpdateSuccess = false"></button>
                </div>
              </div>

              <!-- Other tabs remain the same as in the previous version -->
              <!-- Orders Tab -->
              <div *ngIf="activeTab === 'orders' && !loading" class="tab-content">
                <!-- Previous orders content here -->
              </div>

              <!-- Addresses Tab -->
              <div *ngIf="activeTab === 'addresses' && !loading" class="tab-content">
                <!-- Previous addresses content here -->
              </div>

              <!-- Wishlist Tab -->
              <div *ngIf="activeTab === 'wishlist' && !loading" class="tab-content">
                <div class="page-header">
                  <h2 class="page-title">
                    <i class="bi bi-heart me-2"></i>
                    My Wishlist
                  </h2>
                  <p class="page-subtitle">Items you've saved for later</p>
                </div>

                <div class="text-center py-5">
                  <i class="bi bi-heart display-1 text-muted mb-3"></i>
                  <h4>Your wishlist is empty</h4>
                  <p class="text-muted">Save items you love to your wishlist</p>
                  <button class="btn btn-primary" routerLink="/products">
                    <i class="bi bi-search me-2"></i>
                    Discover Products
                  </button>
                </div>
              </div>

              <!-- Settings Tab -->
              <div *ngIf="activeTab === 'settings' && !loading" class="tab-content">
                <!-- Previous settings content here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- File Upload Input (Hidden) -->
    <input type="file" #fileInput (change)="onAvatarSelected($event)" 
           accept="image/*" style="display: none;">
  `,
  styles: [`
    /* Previous styles remain the same, adding new ones */
    
    .quick-actions-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .loading-state {
      min-height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .membership-progress {
      margin-top: 12px;
    }

    .progress {
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
    }

    .progress-bar {
      background: linear-gradient(135deg, #28a745, #20c997);
      border-radius: 10px;
      transition: width 0.6s ease;
    }

    .benefits-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 12px;
    }

    .benefit-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      color: #495057;
    }

    .alert {
      border-radius: 12px;
      border: none;
    }

    .alert-success {
      background: linear-gradient(135deg, #d4edda, #c3e6cb);
      color: #155724;
    }

    .form-control.is-invalid,
    .form-select.is-invalid {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }

    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #dc3545;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }

    @media (max-width: 576px) {
      .quick-actions-row {
        flex-direction: column;
      }

      .quick-actions-row .btn {
        width: 100%;
      }
    }
  `]
})
export class AccountComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  activeTab: string = 'overview';
  loading = true;
  profileUpdateLoading = false;
  profileUpdateSuccess = false;
  
  userProfile: UserProfile | null = null;
  addresses: Address[] = [];
  userSettings: UserSettings | null = null;
  membershipBenefits: string[] = [];
  cartItemCount = 0;
  wishlistCount = 12; // Mock data
  
  orderFilter: string = '';
  orderSearch: string = '';
  
  profileForm: FormGroup | null = null;
  filteredOrders: Order[] = [];

  // Mock orders data
  orders: Order[] = [
    {
      id: '1',
      orderNumber: 'TN-2024-001',
      date: '2024-03-15',
      status: 'delivered',
      total: 1299.99,
      itemCount: 2,
      trackingNumber: 'TRK123456789',
      items: [
        {
          id: 1,
          name: 'Gaming Laptop Pro X1',
          image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=100&h=100&fit=crop',
          price: 999.99,
          quantity: 1
        },
        {
          id: 2,
          name: 'Wireless Gaming Mouse',
          image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=100&h=100&fit=crop',
          price: 299.99,
          quantity: 1
        }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.setupRouteHandling();
    this.setupCartSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.loading = true;
    
    // Load user profile
    this.userService.getUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.setupProfileForm();
          this.membershipBenefits = this.userService.getMembershipBenefits(profile.membershipLevel);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.loading = false;
        }
      });

    // Load addresses
    this.userService.getAddresses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (addresses) => {
          this.addresses = addresses;
        },
        error: (error) => {
          console.error('Error loading addresses:', error);
        }
      });

    // Load settings
    this.userService.getSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (settings) => {
          this.userSettings = settings;
        },
        error: (error) => {
          console.error('Error loading settings:', error);
        }
      });
  }

  private setupRouteHandling(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['tab']) {
          this.activeTab = params['tab'];
        }
      });
  }

  private setupCartSubscription(): void {
    this.cartService.getCartItemCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.cartItemCount = count;
      });
  }

  private setupProfileForm(): void {
    if (this.userProfile) {
      this.profileForm = this.fb.group({
        firstName: [this.userProfile.firstName, [Validators.required]],
        lastName: [this.userProfile.lastName, [Validators.required]],
        email: [this.userProfile.email, [Validators.required, Validators.email]],
        phone: [this.userProfile.phone],
        dateOfBirth: [this.userProfile.dateOfBirth],
        gender: [this.userProfile.gender]
      });
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.router.navigate(['/account', tab]);
  }

  getMembershipBadgeClass(): string {
    if (!this.userProfile) return 'bg-secondary';
    const level = this.userProfile.membershipLevel.toLowerCase();
    return level === 'gold' ? 'gold' : level === 'silver' ? 'silver' : level === 'platinum' ? 'platinum' : 'bronze';
  }

  getMembershipProgress(): number {
    if (!this.userProfile) return 0;
    const spent = this.userProfile.totalSpent;
    const level = this.userProfile.membershipLevel.toLowerCase();
    
    if (level === 'platinum') return 100;
    if (level === 'gold') return Math.min((spent / 10000) * 100, 100);
    if (level === 'silver') return Math.min((spent / 5000) * 100, 100);
    return Math.min((spent / 1000) * 100, 100);
  }

  getNextMembershipInfo(): string {
    if (!this.userProfile) return '';
    const spent = this.userProfile.totalSpent;
    const level = this.userProfile.membershipLevel.toLowerCase();
    
    if (level === 'platinum') return 'You\'ve reached the highest level!';
    if (level === 'gold') return `$${(10000 - spent).toFixed(0)} to Platinum`;
    if (level === 'silver') return `$${(5000 - spent).toFixed(0)} to Gold`;
    return `$${(1000 - spent).toFixed(0)} to Silver`;
  }

  getRecentOrders(): Order[] {
    return this.orders.slice(0, 3);
  }

  getOrderStatusBadge(status: string): string {
    return `bg-${status}`;
  }

  updateProfile(): void {
    if (this.profileForm && this.profileForm.valid) {
      this.profileUpdateLoading = true;
      this.profileUpdateSuccess = false;

      const formData = this.profileForm.value;
      this.userService.updateProfile(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedProfile) => {
            this.userProfile = updatedProfile;
            this.profileUpdateLoading = false;
            this.profileUpdateSuccess = true;
            
            // Hide success message after 3 seconds
            setTimeout(() => {
              this.profileUpdateSuccess = false;
            }, 3000);
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.profileUpdateLoading = false;
          }
        });
    }
  }

  resetProfileForm(): void {
    if (this.userProfile && this.profileForm) {
      this.profileForm.patchValue({
        firstName: this.userProfile.firstName,
        lastName: this.userProfile.lastName,
        email: this.userProfile.email,
        phone: this.userProfile.phone,
        dateOfBirth: this.userProfile.dateOfBirth,
        gender: this.userProfile.gender
      });
      this.profileForm.markAsUntouched();
    }
  }

  openAvatarUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onAvatarSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      this.userService.updateAvatar(file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (avatarUrl) => {
            if (this.userProfile) {
              this.userProfile.avatar = avatarUrl;
            }
          },
          error: (error) => {
            console.error('Error updating avatar:', error);
          }
        });
    }
  }

  viewOrder(orderId: string): void {
    console.log('Viewing order:', orderId);
    // Navigate to order details page
  }

  signOut(): void {
    if (confirm('Are you sure you want to sign out?')) {
      this.userService.logout()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error signing out:', error);
          }
        });
    }
  }
}