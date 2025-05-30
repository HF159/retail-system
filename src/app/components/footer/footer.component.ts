import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <footer class="footer bg-surface mt-5">
      <div class="container py-5">
        <div class="row g-4">
          <!-- Brand & Description -->
          <div class="col-lg-4">
            <div class="mb-4">
              <h3 class="text-gradient fw-bold mb-3">
                <i class="bi bi-lightning-charge-fill me-2"></i>
                TechNova
              </h3>
              <p class="text-secondary">
                Your trusted partner for cutting-edge technology solutions. 
                We provide professional-grade hardware and expert support 
                for businesses and tech enthusiasts.
              </p>
            </div>
            <div class="social-links">
              <a href="#" class="social-link me-3">
                <i class="bi bi-facebook"></i>
              </a>
              <a href="#" class="social-link me-3">
                <i class="bi bi-twitter"></i>
              </a>
              <a href="#" class="social-link me-3">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="#" class="social-link me-3">
                <i class="bi bi-linkedin"></i>
              </a>
              <a href="#" class="social-link">
                <i class="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="col-lg-2 col-md-4">
            <h5 class="fw-semibold mb-3 text-primary">Quick Links</h5>
            <ul class="list-unstyled footer-links">
              <li><a routerLink="/" class="footer-link">Home</a></li>
              <li><a routerLink="/products" class="footer-link">All Products</a></li>
              <li><a routerLink="/deals" class="footer-link">Special Deals</a></li>
              <li><a routerLink="/categories" class="footer-link">Categories</a></li>
              <li><a href="#" class="footer-link">New Arrivals</a></li>
            </ul>
          </div>

          <!-- Categories -->
          <div class="col-lg-2 col-md-4">
            <h5 class="fw-semibold mb-3 text-primary">Categories</h5>
            <ul class="list-unstyled footer-links">
              <li><a routerLink="/categories/laptops" class="footer-link">Laptops</a></li>
              <li><a routerLink="/categories/gaming" class="footer-link">Gaming</a></li>
              <li><a routerLink="/categories/smartphones" class="footer-link">Smartphones</a></li>
              <li><a routerLink="/categories/components" class="footer-link">Components</a></li>
              <li><a routerLink="/categories/audio" class="footer-link">Audio</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="col-lg-2 col-md-4">
            <h5 class="fw-semibold mb-3 text-primary">Support</h5>
            <ul class="list-unstyled footer-links">
              <li><a href="#" class="footer-link">Help Center</a></li>
              <li><a href="#" class="footer-link">Contact Us</a></li>
              <li><a href="#" class="footer-link">Shipping Info</a></li>
              <li><a href="#" class="footer-link">Returns</a></li>
              <li><a href="#" class="footer-link">Warranty</a></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="col-lg-2">
            <h5 class="fw-semibold mb-3 text-primary">Contact</h5>
            <div class="contact-info">
              <div class="contact-item mb-2">
                <i class="bi bi-geo-alt-fill text-accent-sky me-2"></i>
                <span class="text-secondary small">123 Tech Street, Digital City</span>
              </div>
              <div class="contact-item mb-2">
                <i class="bi bi-telephone-fill text-accent-sky me-2"></i>
                <span class="text-secondary small">+1 (555) 123-4567</span>
              </div>
              <div class="contact-item mb-2">
                <i class="bi bi-envelope-fill text-accent-sky me-2"></i>
                <span class="text-secondary small">support&#64;technova.com</span>
              </div>
              <div class="contact-item">
                <i class="bi bi-clock-fill text-accent-sky me-2"></i>
                <span class="text-secondary small">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Newsletter Subscription -->
        <div class="row mt-5 pt-4 border-top border-secondary">
          <div class="col-lg-8">
            <h5 class="fw-semibold mb-3 text-primary">Stay Updated</h5>
            <p class="text-secondary mb-3">Subscribe to get the latest tech news and exclusive deals.</p>
            <div class="newsletter-form">
              <div class="input-group">
                <input 
                  type="email" 
                  class="form-control" 
                  placeholder="Enter your email address"
                  [(ngModel)]="newsletterEmail">
                <button class="btn btn-primary" type="button" (click)="subscribeNewsletter()">
                  <i class="bi bi-envelope-plus me-2"></i>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-4 text-lg-end">
            <h5 class="fw-semibold mb-3 text-primary">Secure Payments</h5>
            <div class="payment-methods">
              <i class="bi bi-credit-card-2-front fs-3 text-secondary me-2"></i>
              <i class="bi bi-paypal fs-3 text-secondary me-2"></i>
              <i class="bi bi-apple fs-3 text-secondary me-2"></i>
              <i class="bi bi-google fs-3 text-secondary"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom border-top border-secondary">
        <div class="container py-3">
          <div class="row align-items-center">
            <div class="col-md-6">
              <p class="text-muted small mb-0">
                © {{ currentYear }} TechNova. All rights reserved.
              </p>
            </div>
            <div class="col-md-6 text-md-end">
              <div class="footer-legal">
                <a href="#" class="footer-link small me-3">Privacy Policy</a>
                <a href="#" class="footer-link small me-3">Terms of Service</a>
                <a href="#" class="footer-link small">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--gradient-surface);
      border-top: 1px solid var(--surface-tertiary);
      margin-top: auto;
    }

    .text-gradient {
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .social-links {
      display: flex;
      gap: 0.5rem;
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(14, 165, 233, 0.1);
      color: var(--accent-sky);
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 1.1rem;
    }

    .social-link:hover {
      background: var(--accent-sky);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(14, 165, 233, 0.3);
    }

    .footer-links {
      margin: 0;
      padding: 0;
    }

    .footer-links li {
      margin-bottom: 0.5rem;
    }

    .footer-link {
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .footer-link:hover {
      color: var(--accent-light-sky);
      padding-left: 0.5rem;
    }

    .contact-info {
      font-size: 0.9rem;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      line-height: 1.4;
    }

    .newsletter-form .input-group {
      max-width: 400px;
    }

    .newsletter-form .form-control {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid var(--surface-tertiary);
      color: var(--text-primary);
      border-radius: 12px 0 0 12px;
    }

    .newsletter-form .form-control:focus {
      background: rgba(30, 41, 59, 0.9);
      border-color: var(--accent-sky);
      box-shadow: none;
      color: var(--text-primary);
    }

    .newsletter-form .form-control::placeholder {
      color: var(--text-muted);
    }

    .newsletter-form .btn {
      border-radius: 0 12px 12px 0;
    }

    .payment-methods {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .footer-bottom {
      background: rgba(15, 23, 42, 0.5);
    }

    .footer-legal a {
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-legal a:hover {
      color: var(--accent-sky);
    }

    @media (max-width: 768px) {
      .social-links {
        justify-content: center;
        margin-bottom: 2rem;
      }

      .footer-links {
        text-align: center;
        margin-bottom: 2rem;
      }

      .contact-info {
        text-align: center;
        margin-bottom: 2rem;
      }

      .newsletter-form .input-group {
        max-width: 100%;
      }

      .payment-methods {
        justify-content: center;
        margin-top: 1rem;
      }

      .footer-legal {
        text-align: center !important;
        margin-top: 1rem;
      }
    }

    .footer-link,
    .social-link {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .contact-item i {
      margin-top: 2px;
    }

    h5 {
      position: relative;
      padding-bottom: 0.5rem;
    }

    h5::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30px;
      height: 2px;
      background: var(--gradient-accent);
      border-radius: 1px;
    }

    @media (max-width: 768px) {
      h5::after {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  newsletterEmail = '';

  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      console.log('Subscribing email:', this.newsletterEmail);
      // Implement newsletter subscription logic
      this.newsletterEmail = '';
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}