// src/app/components/support/pages/shipping-help/shipping-help.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipping-help',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="shipping-help-page">
      <!-- Breadcrumb -->
      <div class="container">
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
            <li class="breadcrumb-item"><a routerLink="/support">Support</a></li>
            <li class="breadcrumb-item active">Shipping Help</li>
          </ol>
        </nav>
      </div>

      <!-- Header -->
      <section class="page-header">
        <div class="container">
          <div class="text-center">
            <i class="bi bi-truck display-3 text-gradient mb-3"></i>
            <h1 class="display-4 fw-bold text-gradient mb-3">Shipping & Delivery</h1>
            <p class="lead text-secondary">Everything you need to know about shipping and delivery</p>
          </div>
        </div>
      </section>

      <!-- Shipping Options -->
      <section class="shipping-options py-5">
        <div class="container">
          <h2 class="text-center mb-5">Shipping Options</h2>
          <div class="row g-4">
            <div class="col-lg-4">
              <div class="shipping-card">
                <div class="shipping-icon">
                  <i class="bi bi-truck"></i>
                </div>
                <h5>Standard Shipping</h5>
                <div class="shipping-time">3-5 Business Days</div>
                <div class="shipping-cost">FREE on orders $50+</div>
                <ul class="shipping-features">
                  <li>Tracking included</li>
                  <li>Signature not required</li>
                  <li>Business days only</li>
                </ul>
              </div>
            </div>
            
            <div class="col-lg-4">
              <div class="shipping-card featured">
                <div class="shipping-icon">
                  <i class="bi bi-lightning"></i>
                </div>
                <h5>Express Shipping</h5>
                <div class="shipping-time">1-2 Business Days</div>
                <div class="shipping-cost">$9.99</div>
                <ul class="shipping-features">
                  <li>Priority handling</li>
                  <li>Tracking included</li>
                  <li>Signature required</li>
                </ul>
              </div>
            </div>
            
            <div class="col-lg-4">
              <div class="shipping-card">
                <div class="shipping-icon">
                  <i class="bi bi-stopwatch"></i>
                </div>
                <h5>Same Day Delivery</h5>
                <div class="shipping-time">Within 4-8 Hours</div>
                <div class="shipping-cost">$19.99</div>
                <ul class="shipping-features">
                  <li>Select areas only</li>
                  <li>Order by 2 PM</li>
                  <li>Real-time tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Shipping FAQ -->
      <section class="shipping-faq py-5 bg-surface">
        <div class="container">
          <h2 class="text-center mb-5">Shipping FAQ</h2>
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="faq-list">
                <div class="faq-item" *ngFor="let faq of shippingFAQs">
                  <div class="faq-question" (click)="toggleFAQ(faq.id)">
                    <h6>{{faq.question}}</h6>
                    <i class="bi" [class.bi-chevron-down]="!faq.isExpanded" [class.bi-chevron-up]="faq.isExpanded"></i>
                  </div>
                  <div class="faq-answer" [class.expanded]="faq.isExpanded">
                    <div class="answer-content">
                      <p>{{faq.answer}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Track Your Order -->
      <section class="order-tracking py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-6">
              <div class="tracking-card">
                <div class="text-center mb-4">
                  <i class="bi bi-search display-4 text-primary mb-3"></i>
                  <h3>Track Your Order</h3>
                  <p class="text-muted">Enter your order number to get real-time updates</p>
                </div>
                
                <div class="tracking-form">
                  <div class="input-group mb-3">
                    <span class="input-group-text">
                      <i class="bi bi-hash"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="Enter order number (e.g., TN-2024-001234)"
                      [(ngModel)]="trackingNumber">
                    <button class="btn btn-primary" (click)="trackOrder()">
                      Track Order
                    </button>
                  </div>
                  <small class="text-muted">
                    You can find your order number in your confirmation email or account dashboard.
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
    .shipping-help-page {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      min-height: 100vh;
    }

    .page-header {
      padding: 60px 0;
      background: var(--gradient-primary);
      color: white;
    }

    .shipping-options {
      background: white;
    }

    .shipping-card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 2px solid transparent;
      height: 100%;
    }

    .shipping-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .shipping-card.featured {
      border-color: var(--accent-sky);
      transform: scale(1.02);
    }

    .shipping-icon {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-sky), var(--accent-light-sky));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 1.8rem;
      color: white;
    }

    .shipping-time {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--accent-sky);
      margin-bottom: 10px;
    }

    .shipping-cost {
      font-size: 1.2rem;
      font-weight: 700;
      color: #28a745;
      margin-bottom: 20px;
    }

    .shipping-features {
      list-style: none;
      padding: 0;
      text-align: left;
    }

    .shipping-features li {
      padding: 5px 0;
      color: #6c757d;
      position: relative;
      padding-left: 20px;
    }

    .shipping-features li:before {
      content: "✓";
      color: #28a745;
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    .faq-item {
      background: white;
      border-radius: 12px;
      margin-bottom: 15px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .faq-question {
      padding: 20px 25px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.3s ease;
    }

    .faq-question:hover {
      background: #f8f9fa;
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      border-top: 1px solid #f8f9fa;
    }

    .faq-answer.expanded {
      max-height: 200px;
    }

    .answer-content {
      padding: 20px 25px;
      color: #6c757d;
      line-height: 1.6;
    }

    .tracking-card {
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
  `]
})
export class ShippingHelpComponent {
  trackingNumber = '';

  shippingFAQs = [
    {
      id: 1,
      question: 'How much does shipping cost?',
      answer: 'Standard shipping is FREE on orders over $50. Express shipping costs $9.99, and same-day delivery is $19.99 in select areas.',
      isExpanded: false
    },
    {
      id: 2,
      question: 'When will my order ship?',
      answer: 'Orders placed before 2 PM EST Monday-Friday typically ship the same business day. Weekend orders ship on the next business day.',
      isExpanded: false
    },
    {
      id: 3,
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 100 countries worldwide. International shipping costs and delivery times vary by destination.',
      isExpanded: false
    },
    {
      id: 4,
      question: 'Can I change my shipping address?',
      answer: 'Shipping addresses can be changed within 1 hour of placing your order. After that, please contact customer service immediately.',
      isExpanded: false
    }
  ];

  toggleFAQ(id: number): void {
    const faq = this.shippingFAQs.find(f => f.id === id);
    if (faq) {
      faq.isExpanded = !faq.isExpanded;
    }
  }

  trackOrder(): void {
    if (this.trackingNumber.trim()) {
      // Implement order tracking functionality
      alert(`Tracking order: ${this.trackingNumber}`);
    }
  }
}