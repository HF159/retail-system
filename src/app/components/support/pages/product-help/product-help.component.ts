// src/app/components/support/pages/product-help/product-help.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-help',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-help-page">
      <!-- Breadcrumb -->
      <div class="container">
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
            <li class="breadcrumb-item"><a routerLink="/support">Support</a></li>
            <li class="breadcrumb-item active">Product Support</li>
          </ol>
        </nav>
      </div>

      <!-- Header -->
      <section class="page-header">
        <div class="container">
          <div class="text-center">
            <i class="bi bi-gear display-3 text-gradient mb-3"></i>
            <h1 class="display-4 fw-bold text-gradient mb-3">Product Support</h1>
            <p class="lead text-secondary">Setup guides, troubleshooting, and technical support</p>
          </div>
        </div>
      </section>

      <!-- Product Categories -->
      <section class="product-categories py-5">
        <div class="container">
          <h2 class="text-center mb-5">Browse by Product Category</h2>
          <div class="row g-4">
            <div class="col-lg-4 col-md-6" *ngFor="let category of productCategories">
              <div class="category-card">
                <div class="category-icon">
                  <i [class]="category.icon"></i>
                </div>
                <h5>{{category.name}}</h5>
                <p class="text-secondary">{{category.description}}</p>
                <div class="category-stats">
                  <span class="text-muted">{{category.guides}} guides available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Popular Guides -->
      <section class="popular-guides py-5 bg-surface">
        <div class="container">
          <h2 class="text-center mb-5">Popular Setup Guides</h2>
          <div class="row g-4">
            <div class="col-lg-6" *ngFor="let guide of popularGuides">
              <div class="guide-card">
                <div class="guide-header">
                  <div class="guide-icon">
                    <i [class]="guide.icon"></i>
                  </div>
                  <div class="guide-info">
                    <h6>{{guide.title}}</h6>
                    <span class="guide-category">{{guide.category}}</span>
                  </div>
                  <div class="guide-stats">
                    <span class="views">{{guide.views}} views</span>
                  </div>
                </div>
                <p class="guide-description">{{guide.description}}</p>
                <div class="guide-actions">
                  <button class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-book me-2"></i>Read Guide
                  </button>
                  <button class="btn btn-outline-secondary btn-sm">
                    <i class="bi bi-play-circle me-2"></i>Watch Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Troubleshooting -->
      <section class="troubleshooting py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="troubleshooting-card">
                <div class="text-center mb-4">
                  <i class="bi bi-tools display-4 text-primary mb-3"></i>
                  <h3>Need Help Troubleshooting?</h3>
                  <p class="text-muted">Use our diagnostic tool to identify and solve common issues</p>
                </div>
                
                <div class="diagnostic-options">
                  <div class="diagnostic-option">
                    <h6>What type of issue are you experiencing?</h6>
                    <div class="option-buttons">
                      <button class="btn btn-outline-secondary" *ngFor="let issue of commonIssues">
                        {{issue}}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="text-center mt-4">
                  <button class="btn btn-primary">
                    <i class="bi bi-search me-2"></i>Start Diagnosis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .product-help-page {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      min-height: 100vh;
    }

    .page-header {
      padding: 60px 0;
      background: var(--gradient-primary);
      color: white;
    }

    .category-card {
      background: white;
      border-radius: 16px;
      padding: 30px 25px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid transparent;
      height: 100%;
    }

    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      border-color: var(--accent-sky);
    }

    .category-icon {
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

    .category-stats {
      margin-top: 15px;
      font-size: 0.9rem;
    }

    .guide-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .guide-card:hover {
      transform: translateY(-5px);
    }

    .guide-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }

    .guide-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--accent-sky);
      flex-shrink: 0;
    }

    .guide-info {
      flex: 1;
    }

    .guide-info h6 {
      margin: 0 0 5px;
      font-weight: 600;
      color: #2c3e50;
    }

    .guide-category {
      font-size: 0.8rem;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .guide-stats {
      font-size: 0.8rem;
      color: #6c757d;
    }

    .guide-description {
      color: #6c757d;
      margin-bottom: 20px;
      line-height: 1.5;
      flex: 1;
    }

    .guide-actions {
      display: flex;
      gap: 10px;
    }

    .troubleshooting-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .diagnostic-option h6 {
      color: #2c3e50;
      margin-bottom: 15px;
    }

    .option-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }

    .option-buttons .btn {
      border-radius: 20px;
      font-size: 0.9rem;
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
      .guide-header {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }
      
      .guide-actions {
        flex-direction: column;
      }
      
      .option-buttons {
        justify-content: center;
      }
    }
  `]
})
export class ProductHelpComponent {
  productCategories = [
    {
      name: 'Laptops & Computers',
      description: 'Setup guides, performance optimization, and troubleshooting',
      icon: 'bi bi-laptop',
      guides: 24
    },
    {
      name: 'Gaming Accessories',
      description: 'Configuration guides for mice, keyboards, and headsets',
      icon: 'bi bi-controller',
      guides: 18
    },
    {
      name: 'Audio Equipment',
      description: 'Setup and optimization for headphones and speakers',
      icon: 'bi bi-headphones',
      guides: 15
    },
    {
      name: 'Monitors & Displays',
      description: 'Display setup, calibration, and troubleshooting',
      icon: 'bi bi-display',
      guides: 12
    },
    {
      name: 'Networking',
      description: 'Router setup, WiFi optimization, and connectivity',
      icon: 'bi bi-wifi',
      guides: 16
    },
    {
      name: 'Mobile Devices',
      description: 'Smartphone and tablet setup and troubleshooting',
      icon: 'bi bi-phone',
      guides: 20
    }
  ];

  popularGuides = [
    {
      title: 'Setting Up Your Gaming Laptop for Optimal Performance',
      description: 'Complete guide to optimize your gaming laptop settings, drivers, and performance tweaks.',
      category: 'Laptops',
      icon: 'bi bi-laptop',
      views: '12.5K'
    },
    {
      title: 'Configuring Your Mechanical Keyboard',
      description: 'Learn how to set up macros, customize lighting, and optimize your mechanical keyboard.',
      category: 'Gaming',
      icon: 'bi bi-keyboard',
      views: '8.2K'
    },
    {
      title: 'Monitor Calibration Guide',
      description: 'Step-by-step instructions to calibrate your monitor for accurate colors and optimal viewing.',
      category: 'Displays',
      icon: 'bi bi-display',
      views: '9.7K'
    },
    {
      title: 'Wireless Headset Setup and Troubleshooting',
      description: 'Everything you need to know about setting up and fixing wireless audio issues.',
      category: 'Audio',
      icon: 'bi bi-headphones',
      views: '6.3K'
    }
  ];

  commonIssues = [
    'Won\'t turn on',
    'Slow performance',
    'Connection issues',
    'Audio problems',
    'Display issues',
    'Software errors'
  ];
}