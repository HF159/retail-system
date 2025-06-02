// src/app/components/footer/footer.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <footer class="footer" [@fadeInUp]>
      <!-- Main Footer Content -->
      <div class="footer-main">
        <div class="container">
          <div class="row g-5">
            <!-- Brand & About Section -->
            <div class="col-lg-4 col-md-6">
              <div class="footer-section" [@slideInLeft]>
                <div class="footer-brand">
                  <div class="brand-container">
                    <div class="brand-icon">
                      <i class="bi bi-lightning-charge-fill"></i>
                    </div>
                    <div class="brand-text">
                      <span class="brand-name">TechNova</span>
                      <span class="brand-tagline">Tech Excellence</span>
                    </div>
                  </div>
                </div>
                
                <p class="footer-description">
                  Your trusted partner for cutting-edge technology solutions. 
                  We provide professional-grade hardware and expert support 
                  for businesses and tech enthusiasts worldwide.
                </p>
                
                <!-- Trust Badges -->
                <div class="trust-badges">
                  <div class="trust-badge" title="SSL Secured">
                    <i class="bi bi-shield-check"></i>
                    <span>SSL Secured</span>
                  </div>
                  <div class="trust-badge" title="24/7 Support">
                    <i class="bi bi-headset"></i>
                    <span>24/7 Support</span>
                  </div>
                  <div class="trust-badge" title="Free Shipping">
                    <i class="bi bi-truck"></i>
                    <span>Free Shipping</span>
                  </div>
                </div>

                <!-- Social Media Links -->
                <div class="social-media">
                  <h6 class="social-title">Connect With Us</h6>
                  <div class="social-links">
                    <a href="#" class="social-link facebook" title="Facebook" [@socialHover]>
                      <i class="bi bi-facebook"></i>
                    </a>
                    <a href="#" class="social-link twitter" title="Twitter" [@socialHover]>
                      <i class="bi bi-twitter"></i>
                    </a>
                    <a href="#" class="social-link instagram" title="Instagram" [@socialHover]>
                      <i class="bi bi-instagram"></i>
                    </a>
                    <a href="#" class="social-link linkedin" title="LinkedIn" [@socialHover]>
                      <i class="bi bi-linkedin"></i>
                    </a>
                    <a href="#" class="social-link youtube" title="YouTube" [@socialHover]>
                      <i class="bi bi-youtube"></i>
                    </a>
                    <a href="#" class="social-link discord" title="Discord" [@socialHover]>
                      <i class="bi bi-discord"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Links -->
            <div class="col-lg-2 col-md-4">
                <h5 class="fw-semibold mb-3 text-primary">Quick Links</h5>
                <ul class="list-unstyled footer-links">
                  <li><a routerLink="/" class="footer-link">Home</a></li>
                  <li><a routerLink="/products" class="footer-link">All Products</a></li>
                  <li><a routerLink="/deals" class="footer-link">Special Deals</a></li>
                  <li><a routerLink="/wishlist" class="footer-link">Wishlist</a></li>
                  <li><a routerLink="/cart" class="footer-link">Shopping Cart</a></li>
                </ul>
            </div>
            <!-- Product Categories -->
            <div class="col-lg-2 col-md-6">
              <div class="footer-section" [@slideInUp]="{ delay: '400ms' }">
                <h5 class="footer-title">
                  <i class="bi bi-grid me-2"></i>
                  Categories
                </h5>
                <ul class="footer-links">
                  <li><a [routerLink]="['/products']" [queryParams]="{category: 1}" class="footer-link">Laptops</a></li>
                  <li><a [routerLink]="['/products']" [queryParams]="{category: 2}" class="footer-link">Audio</a></li>
                  <li><a [routerLink]="['/products']" [queryParams]="{category: 3}" class="footer-link">Gaming</a></li>
                  <li><a [routerLink]="['/products']" [queryParams]="{category: 4}" class="footer-link">Monitors</a></li>
                  <li><a [routerLink]="['/products']" [queryParams]="{category: 5}" class="footer-link">Components</a></li>
                  <li><a href="#" class="footer-link">Accessories</a></li>
                </ul>
              </div>
            </div>

            <!-- Customer Support -->
            <div class="col-lg-2 col-md-6">
              <div class="footer-section" [@slideInUp]="{ delay: '600ms' }">
                <h5 class="footer-title">
                  <i class="bi bi-headset me-2"></i>
                  Support
                </h5>
                <ul class="footer-links">
                  <li><a href="#" class="footer-link">Help Center</a></li>
                  <li><a href="#" class="footer-link">Contact Us</a></li>
                  <li><a href="#" class="footer-link">Track Order</a></li>
                  <li><a href="#" class="footer-link">Shipping Info</a></li>
                  <li><a href="#" class="footer-link">Returns</a></li>
                  <li><a href="#" class="footer-link">Warranty</a></li>
                </ul>
              </div>
            </div>

            <!-- Contact & Newsletter -->
            <div class="col-lg-2 col-md-6">
              <div class="footer-section" [@slideInRight]>
                <h5 class="footer-title">
                  <i class="bi bi-envelope me-2"></i>
                  Contact
                </h5>
                
                <div class="contact-info">
                  <div class="contact-item">
                    <i class="bi bi-geo-alt"></i>
                    <div class="contact-details">
                      <span class="contact-label">Address</span>
                      <span class="contact-value">123 Tech Street, Digital City, TC 12345</span>
                    </div>
                  </div>
                  
                  <div class="contact-item">
                    <i class="bi bi-telephone"></i>
                    <div class="contact-details">
                      <span class="contact-label">Phone</span>
                      <span class="contact-value">+1 (555) 123-4567</span>
                    </div>
                  </div>
                  
                  <div class="contact-item">
                    <i class="bi bi-envelope"></i>
                    <div class="contact-details">
                      <span class="contact-label">Email</span>
                      <span class="contact-value">support&#64;technova.com</span>
                    </div>
                  </div>
                  
                  <div class="contact-item">
                    <i class="bi bi-clock"></i>
                    <div class="contact-details">
                      <span class="contact-label">Hours</span>
                      <span class="contact-value">24/7 Online Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter Section -->
      <div class="newsletter-section" [@slideInUp]="{ delay: '800ms' }">
        <div class="container">
          <div class="newsletter-container">
            <div class="row align-items-center">
              <div class="col-lg-6">
                <div class="newsletter-content">
                  <div class="newsletter-icon">
                    <i class="bi bi-envelope-heart"></i>
                  </div>
                  <div class="newsletter-text">
                    <h4 class="newsletter-title">Stay in the Loop!</h4>
                    <p class="newsletter-subtitle">
                      Get exclusive deals, product updates, and tech news delivered to your inbox.
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="col-lg-6">
                <div class="newsletter-form" [@newsletterSlide]>
                  <div class="input-group">
                    <input 
                      type="email" 
                      class="form-control newsletter-input" 
                      placeholder="Enter your email address"
                      [(ngModel)]="newsletterEmail"
                      [class.is-valid]="isValidEmail(newsletterEmail) && newsletterEmail.length > 0"
                      [class.is-invalid]="!isValidEmail(newsletterEmail) && newsletterEmail.length > 0">
                    
                    <button class="btn btn-newsletter" 
                            type="button" 
                            (click)="subscribeNewsletter()"
                            [disabled]="!isValidEmail(newsletterEmail)"
                            [@buttonPulse]="subscribeButtonState">
                      <i class="bi" 
                         [class.bi-send]="subscribeButtonState === 'normal'"
                         [class.bi-check-circle]="subscribeButtonState === 'success'"></i>
                      <span class="ms-2">
                        {{subscribeButtonState === 'success' ? 'Subscribed!' : 'Subscribe'}}
                      </span>
                    </button>
                  </div>
                  
                  <div class="newsletter-benefits">
                    <small class="benefit-item">
                      <i class="bi bi-check-circle text-success me-1"></i>
                      Exclusive deals & early access
                    </small>
                    <small class="benefit-item">
                      <i class="bi bi-check-circle text-success me-1"></i>
                      No spam, unsubscribe anytime
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment & Security Section -->
      <div class="payment-section" [@slideInUp]="{ delay: '1000ms' }">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="payment-info">
                <h6 class="payment-title">
                  <i class="bi bi-shield-check me-2"></i>
                  Secure Payment Methods
                </h6>
                <div class="payment-methods">
                  <div class="payment-method" title="Visa">
                    <i class="bi bi-credit-card"></i>
                  </div>
                  <div class="payment-method" title="Mastercard">
                    <i class="bi bi-credit-card-2-front"></i>
                  </div>
                  <div class="payment-method" title="PayPal">
                    <i class="bi bi-paypal"></i>
                  </div>
                  <div class="payment-method" title="Apple Pay">
                    <i class="bi bi-apple"></i>
                  </div>
                  <div class="payment-method" title="Google Pay">
                    <i class="bi bi-google"></i>
                  </div>
                  <div class="payment-method" title="Bitcoin">
                    <i class="bi bi-currency-bitcoin"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-lg-6">
              <div class="security-badges">
                <div class="security-badge">
                  <i class="bi bi-shield-lock"></i>
                  <span>256-bit SSL</span>
                </div>
                <div class="security-badge">
                  <i class="bi bi-award"></i>
                  <span>PCI Compliant</span>
                </div>
                <div class="security-badge">
                  <i class="bi bi-check-circle"></i>
                  <span>Verified Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="footer-bottom">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="copyright">
                <p class="copyright-text">
                  © {{currentYear}} <strong>TechNova</strong>. All rights reserved. 
                  <span class="made-with">Made with <i class="bi bi-heart-fill text-danger"></i> for tech enthusiasts.</span>
                </p>
              </div>
            </div>
            
            <div class="col-lg-6">
              <div class="footer-legal">
                <a href="#" class="legal-link">Privacy Policy</a>
                <a href="#" class="legal-link">Terms of Service</a>
                <a href="#" class="legal-link">Cookie Policy</a>
                <a href="#" class="legal-link">GDPR</a>
                <a href="#" class="legal-link">Accessibility</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to Top Button -->
      <button class="back-to-top" 
              [class.visible]="showBackToTop"
              (click)="scrollToTop()"
              [@backToTopSlide]="showBackToTop ? 'visible' : 'hidden'"
              title="Back to Top">
        <i class="bi bi-arrow-up"></i>
      </button>

      <!-- Floating Elements -->
      <div class="footer-decoration">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
      color: white;
      position: relative;
      overflow: hidden;
      margin-top: auto;
    }

    /* Main Footer */
    .footer-main {
      padding: 4rem 0 2rem;
      position: relative;
      z-index: 2;
    }

    .footer-section {
      height: 100%;
    }

    /* Brand Section */
    .footer-brand {
      margin-bottom: 1.5rem;
    }

    .brand-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .brand-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.8rem;
    }

    .brand-name {
      font-size: 1.8rem;
      font-weight: 800;
      color: white;
      display: block;
    }

    .brand-tagline {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .footer-description {
      color: #cbd5e1;
      line-height: 1.7;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    /* Trust Badges */
    .trust-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .trust-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 0.8rem;
      color: #e2e8f0;
      backdrop-filter: blur(10px);
    }

    .trust-badge i {
      color: #10b981;
      font-size: 1rem;
    }

    /* Social Media */
    .social-media {
      margin-top: 1.5rem;
    }

    .social-title {
      color: white;
      font-weight: 600;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .social-link {
      width: 45px;
      height: 45px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-size: 1.3rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .social-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 10px;
    }

    .social-link:hover::before {
      opacity: 1;
    }

    .social-link.facebook {
      color: #1877f2;
      background: rgba(24, 119, 242, 0.1);
    }

    .social-link.facebook::before {
      background: #1877f2;
    }

    .social-link.facebook:hover {
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(24, 119, 242, 0.3);
    }

    .social-link.twitter {
      color: #1da1f2;
      background: rgba(29, 161, 242, 0.1);
    }

    .social-link.twitter::before {
      background: #1da1f2;
    }

    .social-link.twitter:hover {
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(29, 161, 242, 0.3);
    }

    .social-link.instagram {
      color: #e4405f;
      background: rgba(228, 64, 95, 0.1);
    }

    .social-link.instagram::before {
      background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    }

    .social-link.instagram:hover {
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(228, 64, 95, 0.3);
    }

    .social-link.linkedin {
      color: #0077b5;
      background: rgba(0, 119, 181, 0.1);
    }

    .social-link.linkedin::before {
      background: #0077b5;
    }

    .social-link.linkedin:hover {
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 119, 181, 0.3);
    }

    .social-link.youtube {
      color: #ff0000;
      background: rgba(255, 0, 0, 0.1);
    }

    .social-link.youtube::before {
      background: #ff0000;
    }

    .social-link.youtube:hover {
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(255, 0, 0, 0.3);
    }

    .social-link.discord {
      color: #5865f2;
      background: rgba(88, 101, 242, 0.1);
    }

    .social-link.discord::before {
      background: #5865f2;
    }

    .social-link.discord:hover {
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(88, 101, 242, 0.3);
    }

    /* Footer Sections */
    .footer-title {
      color: white;
      font-weight: 700;
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      position: relative;
    }

    .footer-title i {
      color: #0ea5e9;
      font-size: 1rem;
    }

    .footer-title::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 30px;
      height: 2px;
      background: linear-gradient(90deg, #0ea5e9, #38bdf8);
      border-radius: 1px;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links li {
      margin-bottom: 0.75rem;
    }

    .footer-link {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      display: inline-block;
      position: relative;
    }

    .footer-link::before {
      content: '';
      position: absolute;
      left: -15px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 2px;
      background: #0ea5e9;
      transition: width 0.3s ease;
    }

    .footer-link:hover {
      color: #0ea5e9;
      text-decoration: none;
      padding-left: 15px;
    }

    .footer-link:hover::before {
      width: 10px;
    }

    /* Contact Info */
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .contact-item i {
      color: #0ea5e9;
      font-size: 1.1rem;
      margin-top: 0.25rem;
      min-width: 16px;
    }

    .contact-details {
      display: flex;
      flex-direction: column;
    }

    .contact-label {
      color: #94a3b8;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .contact-value {
      color: #e2e8f0;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    /* Newsletter Section */
    .newsletter-section {
      background: rgba(255, 255, 255, 0.05);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 3rem 0;
      backdrop-filter: blur(10px);
    }

    .newsletter-container {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 2.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
    }

    .newsletter-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .newsletter-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      color: white;
      flex-shrink: 0;
    }

    .newsletter-title {
      color: white;
      font-weight: 700;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
    }

    .newsletter-subtitle {
      color: #cbd5e1;
      margin: 0;
      line-height: 1.5;
    }

    .newsletter-form .input-group {
      margin-bottom: 1rem;
    }

    .newsletter-input {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.875rem 1.25rem;
      font-size: 1rem;
      border-radius: 50px 0 0 50px;
      backdrop-filter: blur(10px);
    }

    .newsletter-input:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: #0ea5e9;
      box-shadow: 0 0 0 0.2rem rgba(14, 165, 233, 0.25);
      color: white;
    }

    .newsletter-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .newsletter-input.is-valid {
      border-color: #10b981;
    }

    .newsletter-input.is-invalid {
      border-color: #ef4444;
    }

    .btn-newsletter {
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      border: none;
      color: white;
      padding: 0.875rem 1.5rem;
      border-radius: 0 50px 50px 0;
      font-weight: 600;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .btn-newsletter:hover:not(:disabled) {
      background: linear-gradient(135deg, #0284c7, #0ea5e9);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
      color: white;
    }

    .btn-newsletter:disabled {
      background: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.5);
    }

    .newsletter-benefits {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .benefit-item {
      color: #cbd5e1;
      display: flex;
      align-items: center;
    }

    /* Payment Section */
    .payment-section {
      background: rgba(255, 255, 255, 0.03);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2rem 0;
    }

    .payment-title {
      color: white;
      font-weight: 600;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
    }

    .payment-methods {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .payment-method {
      width: 50px;
      height: 35px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #cbd5e1;
      font-size: 1.5rem;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .payment-method:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
      color: white;
    }

    .security-badges {
      display: flex;
      gap: 1.5rem;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .security-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 25px;
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10b981;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .security-badge i {
      font-size: 1rem;
    }

    /* Bottom Footer */
    .footer-bottom {
      background: rgba(0, 0, 0, 0.3);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1.5rem 0;
      backdrop-filter: blur(10px);
    }

    .copyright-text {
      color: #94a3b8;
      margin: 0;
      font-size: 0.9rem;
    }

    .made-with {
      color: #cbd5e1;
      font-style: italic;
    }

    .footer-legal {
      display: flex;
      gap: 2rem;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .legal-link {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.85rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .legal-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: #0ea5e9;
      transition: width 0.3s ease;
    }

    .legal-link:hover {
      color: #0ea5e9;
      text-decoration: none;
    }

    .legal-link:hover::after {
      width: 100%;
    }

    /* Back to Top Button */
    .back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
    }

    .back-to-top.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .back-to-top:hover {
      background: linear-gradient(135deg, #0284c7, #0ea5e9);
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(14, 165, 233, 0.4);
    }

    /* Floating Decoration */
    .footer-decoration {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(56, 189, 248, 0.1));
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 100px;
      height: 100px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 80px;
      height: 80px;
      bottom: 20%;
      left: 70%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(120deg); }
      66% { transform: translateY(-10px) rotate(240deg); }
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .footer-main {
        padding: 3rem 0 1.5rem;
      }

      .newsletter-container {
        padding: 2rem;
      }

      .payment-methods {
        justify-content: flex-start;
      }

      .security-badges {
        justify-content: flex-start;
        margin-top: 1rem;
      }
    }

    @media (max-width: 992px) {
      .footer-main {
        padding: 2.5rem 0 1rem;
      }

      .newsletter-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .newsletter-form {
        margin-top: 1.5rem;
      }

      .footer-legal {
        justify-content: center;
        margin-top: 1rem;
      }

      .social-links {
        justify-content: center;
      }

      .trust-badges {
        justify-content: center;
      }
    }

    @media (max-width: 768px) {
      .footer-main {
        padding: 2rem 0 1rem;
      }

      .newsletter-section {
        padding: 2rem 0;
      }

      .newsletter-container {
        padding: 1.5rem;
      }

      .newsletter-form .input-group {
        flex-direction: column;
      }

      .newsletter-input {
        border-radius: 25px;
        margin-bottom: 0.75rem;
      }

      .btn-newsletter {
        border-radius: 25px;
        width: 100%;
      }

      .newsletter-benefits {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }

      .payment-methods {
        justify-content: center;
      }

      .security-badges {
        justify-content: center;
      }

      .footer-legal {
        gap: 1rem;
      }

      .back-to-top {
        width: 45px;
        height: 45px;
        bottom: 1.5rem;
        right: 1.5rem;
      }
    }

    @media (max-width: 576px) {
      .footer-main {
        padding: 1.5rem 0 0.5rem;
      }

      .footer-section {
        margin-bottom: 2rem;
        text-align: center;
      }

      .brand-container {
        justify-content: center;
      }

      .contact-info {
        align-items: center;
      }

      .contact-item {
        justify-content: center;
        text-align: left;
      }

      .footer-legal {
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
      }

      .payment-section {
        text-align: center;
      }

      .floating-shape {
        display: none;
      }
    }
  `],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms {{delay}} ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { params: { delay: '0ms' } })
    ]),

    trigger('socialHover', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),

    trigger('newsletterSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('600ms 400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    trigger('buttonPulse', [
      transition('normal => success', [
        animate('200ms ease-in', style({ transform: 'scale(0.95)' })),
        animate('300ms ease-out', style({ transform: 'scale(1.05)' })),
        animate('200ms ease-out', style({ transform: 'scale(1)' }))
      ])
    ]),

    trigger('backToTopSlide', [
      transition('hidden => visible', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition('visible => hidden', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  newsletterEmail = '';
  subscribeButtonState: 'normal' | 'success' = 'normal';
  showBackToTop = false;

  ngOnInit(): void {
    this.setupScrollListener();
  }

  setupScrollListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.showBackToTop = window.pageYOffset > 300;
      });
    }
  }

  subscribeNewsletter(): void {
    if (this.isValidEmail(this.newsletterEmail)) {
      this.subscribeButtonState = 'success';
      
      // Simulate API call
      setTimeout(() => {
        console.log('Newsletter subscription for:', this.newsletterEmail);
        // Reset after success message
        setTimeout(() => {
          this.newsletterEmail = '';
          this.subscribeButtonState = 'normal';
        }, 2000);
      }, 500);
    }
  }

  isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}