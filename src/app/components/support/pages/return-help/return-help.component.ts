// src/app/components/support/pages/returns-help/returns-help.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-returns-help',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="returns-help-page">
      <!-- Breadcrumb -->
      <div class="container">
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
            <li class="breadcrumb-item"><a routerLink="/support">Support</a></li>
            <li class="breadcrumb-item active">Returns & Refunds</li>
          </ol>
        </nav>
      </div>

      <!-- Header -->
      <section class="page-header">
        <div class="container">
          <div class="text-center">
            <i class="bi bi-arrow-return-left display-3 text-gradient mb-3"></i>
            <h1 class="display-4 fw-bold text-gradient mb-3">Returns & Refunds</h1>
            <p class="lead text-secondary">Easy returns and hassle-free refunds</p>
          </div>
        </div>
      </section>

      <!-- Return Policy -->
      <section class="return-policy py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="policy-card">
                <h2 class="text-center mb-4">Our Return Policy</h2>
                <div class="policy-highlights">
                  <div class="highlight-item">
                    <i class="bi bi-calendar-check"></i>
                    <div>
                      <h5>30-Day Returns</h5>
                      <p>Return most items within 30 days of delivery</p>
                    </div>
                  </div>
                  <div class="highlight-item">
                    <i class="bi bi-truck"></i>
                    <div>
                      <h5>Free Return Shipping</h5>
                      <p>Free returns for defective or damaged items</p>
                    </div>
                  </div>
                  <div class="highlight-item">
                    <i class="bi bi-cash-stack"></i>
                    <div>
                      <h5>Full Refunds</h5>
                      <p>Get your money back or exchange for another item</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Return Process -->
      <section class="return-process py-5 bg-surface">
        <div class="container">
          <h2 class="text-center mb-5">How to Return an Item</h2>
          <div class="row g-4">
            <div class="col-lg-3 col-md-6">
              <div class="process-step">
                <div class="step-number">1</div>
                <h5>Initiate Return</h5>
                <p>Log into your account and select the item you want to return from your order history.</p>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="process-step">
                <div class="step-number">2</div>
                <h5>Print Label</h5>
                <p>Print the prepaid return shipping label and attach it to your package.</p>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="process-step">
                <div class="step-number">3</div>
                <h5>Ship Package</h5>
                <p>Drop off your package at any authorized shipping location or schedule a pickup.</p>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div class="process-step">
                <div class="step-number">4</div>
                <h5>Get Refund</h5>
                <p>Receive your refund within 3-5 business days after we process your return.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Start Return -->
      <section class="start-return py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-6">
              <div class="return-card">
                <div class="text-center mb-4">
                  <i class="bi bi-box-arrow-in-down display-4 text-primary mb-3"></i>
                  <h3>Start a Return</h3>
                  <p class="text-muted">Enter your order details to begin the return process</p>
                </div>
                
                <form>
                  <div class="mb-3">
                    <label class="form-label">Order Number *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="e.g., TN-2024-001234"
                      [(ngModel)]="orderNumber"
                      name="orderNumber">
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      placeholder="Your email address"
                      [(ngModel)]="email"
                      name="email">
                  </div>
                  
                  <button type="button" class="btn btn-primary w-100" (click)="startReturn()">
                    <i class="bi bi-search me-2"></i>
                    Find My Order
                  </button>
                </form>
                
                <div class="mt-4 text-center">
                  <small class="text-muted">
                    Don't have your order number? 
                    <a routerLink="/support" class="text-primary">Contact Support</a>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .returns-help-page {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      min-height: 100vh;
    }

    .page-header {
      padding: 60px 0;
      background: var(--gradient-primary);
      color: white;
    }

    .policy-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .policy-highlights {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .highlight-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .highlight-item i {
      font-size: 2rem;
      color: var(--accent-sky);
      flex-shrink: 0;
    }

    .highlight-item h5 {
      margin-bottom: 5px;
      color: #2c3e50;
    }

    .highlight-item p {
      margin: 0;
      color: #6c757d;
    }

    .process-step {
      text-align: center;
      padding: 30px 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .process-step:hover {
      transform: translateY(-5px);
    }

    .step-number {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-sky), var(--accent-light-sky));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 auto 20px;
    }

    .return-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .breadcrumb {
      background: none;
      padding: 20px 0 0;
    }

    .breadcrumb-item a {
      color: var(--accent-sky);
      text-decoration: none;
    }

    .text-gradient {
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .bg-surface {
      background: rgba(30, 41, 59, 0.05) !important;
    }

    @media (max-width: 768px) {
      .policy-highlights {
        gap: 20px;
      }
      
      .highlight-item {
        flex-direction: column;
        text-align: center;
        gap: 15px;
      }
    }
  `]
})
export class ReturnsHelpComponent {
  orderNumber = '';
  email = '';

  startReturn(): void {
    if (this.orderNumber.trim() && this.email.trim()) {
      alert(`Starting return process for order: ${this.orderNumber}`);
      // Implement return initiation logic
    } else {
      alert('Please fill in all required fields');
    }
  }
}