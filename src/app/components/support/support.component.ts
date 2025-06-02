// src/app/components/support/support.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  isExpanded?: boolean;
}

interface SupportTicket {
  subject: string;
  category: string;
  priority: string;
  description: string;
  email: string;
  orderNumber?: string;
}

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="support-page">
      <!-- Hero Section -->
      <section class="support-hero">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h1 class="display-4 fw-bold text-gradient mb-4">How can we help you?</h1>
              <p class="lead text-secondary mb-4">
                Get instant support with our comprehensive help center, live chat, or submit a ticket.
              </p>
              
              <!-- Search Bar -->
              <div class="support-search">
                <div class="search-wrapper">
                  <input 
                    type="search" 
                    class="form-control search-input" 
                    placeholder="Search for help articles, FAQs, tutorials..."
                    [(ngModel)]="searchQuery"
                    (input)="onSearchInput()">
                  <button class="search-btn" type="button" (click)="performSearch()">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-lg-6 text-center">
              <div class="support-visual">
                <i class="bi bi-headset display-1 text-gradient"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Support Options -->
      <section class="quick-support py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-4 col-md-6">
              <div class="support-card h-100" (click)="openLiveChat()">
                <div class="support-icon">
                  <i class="bi bi-chat-dots"></i>
                </div>
                <h5>Live Chat</h5>
                <p class="text-secondary">Get instant help from our support team</p>
                <div class="support-status online">
                  <i class="bi bi-circle-fill"></i>
                  Online Now
                </div>
              </div>
            </div>
            
            <div class="col-lg-4 col-md-6">
              <div class="support-card h-100" (click)="scrollToTicket()">
                <div class="support-icon">
                  <i class="bi bi-ticket-perforated"></i>
                </div>
                <h5>Submit Ticket</h5>
                <p class="text-secondary">Create a support ticket for detailed assistance</p>
                <div class="support-status">
                  <i class="bi bi-clock"></i>
                  24h Response
                </div>
              </div>
            </div>
            
            <div class="col-lg-4 col-md-6">
              <div class="support-card h-100" (click)="callSupport()">
                <div class="support-icon">
                  <i class="bi bi-telephone"></i>
                </div>
                <h5>Phone Support</h5>
                <p class="text-secondary">Speak directly with our experts</p>
                <div class="support-status">
                  <i class="bi bi-clock"></i>
                  Mon-Fri 9AM-6PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Popular Topics -->
      <section class="popular-topics py-5 bg-surface">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="display-5 fw-bold text-gradient mb-3">Popular Help Topics</h2>
            <p class="lead text-secondary">Quick answers to common questions</p>
          </div>
          
          <div class="row g-4">
            <div class="col-lg-3 col-md-6" *ngFor="let topic of popularTopics">
              <div class="topic-card h-100" [routerLink]="topic.link">
                <div class="topic-icon">
                  <i [class]="topic.icon"></i>
                </div>
                <h6>{{topic.title}}</h6>
                <p class="text-secondary small">{{topic.description}}</p>
                <div class="topic-stats">
                  <span class="text-muted">{{topic.articles}} articles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section py-5">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="display-5 fw-bold text-gradient mb-3">Frequently Asked Questions</h2>
            <p class="lead text-secondary">Find quick answers to common questions</p>
          </div>
          
          <!-- FAQ Categories -->
          <div class="faq-categories mb-4">
            <div class="category-filters">
              <button 
                class="btn filter-btn"
                [class.active]="selectedFAQCategory === 'all'"
                (click)="filterFAQs('all')">
                All
              </button>
              <button 
                class="btn filter-btn"
                *ngFor="let category of faqCategories"
                [class.active]="selectedFAQCategory === category"
                (click)="filterFAQs(category)">
                {{category}}
              </button>
            </div>
          </div>
          
          <!-- FAQ Items -->
          <div class="faq-list">
            <div class="faq-item" *ngFor="let faq of filteredFAQs">
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
      </section>

      <!-- Support Ticket Form -->
      <section class="ticket-form py-5 bg-surface" #ticketSection>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-lg-8">
              <div class="form-card">
                <div class="text-center mb-4">
                  <h3 class="fw-bold text-gradient mb-3">Submit Support Ticket</h3>
                  <p class="text-secondary">Can't find what you're looking for? We're here to help!</p>
                </div>
                
                <form (ngSubmit)="submitTicket()" #ticketForm="ngForm">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        [(ngModel)]="ticket.email"
                        name="email"
                        required>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Order Number (Optional)</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        [(ngModel)]="ticket.orderNumber"
                        name="orderNumber"
                        placeholder="e.g., TN-2024-001234">
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Category *</label>
                      <select 
                        class="form-select" 
                        [(ngModel)]="ticket.category"
                        name="category"
                        required>
                        <option value="">Select a category</option>
                        <option value="order">Order Issues</option>
                        <option value="product">Product Support</option>
                        <option value="shipping">Shipping & Delivery</option>
                        <option value="returns">Returns & Refunds</option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing Questions</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div class="col-md-6">
                      <label class="form-label">Priority *</label>
                      <select 
                        class="form-select" 
                        [(ngModel)]="ticket.priority"
                        name="priority"
                        required>
                        <option value="">Select priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    
                    <div class="col-12">
                      <label class="form-label">Subject *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        [(ngModel)]="ticket.subject"
                        name="subject"
                        placeholder="Brief description of your issue"
                        required>
                    </div>
                    
                    <div class="col-12">
                      <label class="form-label">Description *</label>
                      <textarea 
                        class="form-control" 
                        rows="5"
                        [(ngModel)]="ticket.description"
                        name="description"
                        placeholder="Please provide detailed information about your issue..."
                        required></textarea>
                    </div>
                    
                    <div class="col-12">
                      <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">* Required fields</small>
                        <button type="submit" class="btn btn-primary btn-lg" [disabled]="!ticketForm.valid || isSubmitting">
                          <i class="bi bi-send me-2" *ngIf="!isSubmitting"></i>
                          <div class="spinner-border spinner-border-sm me-2" *ngIf="isSubmitting"></div>
                          {{isSubmitting ? 'Submitting...' : 'Submit Ticket'}}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Information -->
      <section class="contact-info py-5">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="display-5 fw-bold text-gradient mb-3">Get in Touch</h2>
            <p class="lead text-secondary">Multiple ways to reach our support team</p>
          </div>
          
          <div class="row g-4">
            <div class="col-lg-3 col-md-6">
              <div class="contact-card text-center">
                <div class="contact-icon">
                  <i class="bi bi-envelope"></i>
                </div>
                <h6>Email Support</h6>
                <p class="text-secondary">support&#64;technova.com</p>
                <small class="text-muted">24h response time</small>
              </div>
            </div>
            
            <div class="col-lg-3 col-md-6">
              <div class="contact-card text-center">
                <div class="contact-icon">
                  <i class="bi bi-telephone"></i>
                </div>
                <h6>Phone Support</h6>
                <p class="text-secondary">+1 (555) 123-4567</p>
                <small class="text-muted">Mon-Fri 9AM-6PM EST</small>
              </div>
            </div>
            
            <div class="col-lg-3 col-md-6">
              <div class="contact-card text-center">
                <div class="contact-icon">
                  <i class="bi bi-chat-square-dots"></i>
                </div>
                <h6>Live Chat</h6>
                <p class="text-secondary">Instant messaging</p>
                <small class="text-muted">Available 24/7</small>
              </div>
            </div>
            
            <div class="col-lg-3 col-md-6">
              <div class="contact-card text-center">
                <div class="contact-icon">
                  <i class="bi bi-geo-alt"></i>
                </div>
                <h6>Visit Us</h6>
                <p class="text-secondary">123 Tech Street<br>Digital City, DC 12345</p>
                <small class="text-muted">By appointment only</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .support-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    /* Hero Section */
    .support-hero {
      background: var(--gradient-primary);
      color: white;
      padding: 80px 0 60px;
    }

    .support-visual {
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: inline-block;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .support-search {
      max-width: 500px;
    }

    .search-wrapper {
      position: relative;
    }

    .search-input {
      background: rgba(255, 255, 255, 0.15) !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      color: white !important;
      border-radius: 25px;
      padding: 15px 55px 15px 25px;
      font-size: 1rem;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.7) !important;
    }

    .search-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Quick Support Cards */
    .support-card {
      background: white;
      border-radius: 16px;
      padding: 30px 25px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
      border: 2px solid transparent;
    }

    .support-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      border-color: var(--accent-sky);
    }

    .support-icon {
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

    .support-status {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 0.9rem;
      color: #6c757d;
      margin-top: 15px;
    }

    .support-status.online {
      color: #28a745;
    }

    .support-status.online i {
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    /* Popular Topics */
    .topic-card {
      background: white;
      border-radius: 12px;
      padding: 25px 20px;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      border: 1px solid #e9ecef;
    }

    .topic-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      text-decoration: none;
      color: inherit;
    }

    .topic-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
      font-size: 1.5rem;
      color: var(--accent-sky);
    }

    .topic-stats {
      margin-top: 15px;
      font-size: 0.8rem;
    }

    /* FAQ Section */
    .faq-categories {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }

    .category-filters {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .filter-btn {
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 25px;
      padding: 8px 20px;
      color: #6c757d;
      transition: all 0.3s ease;
    }

    .filter-btn.active,
    .filter-btn:hover {
      background: var(--accent-sky);
      border-color: var(--accent-sky);
      color: white;
    }

    .faq-list {
      max-width: 800px;
      margin: 0 auto;
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

    .faq-question h6 {
      margin: 0;
      color: #2c3e50;
      font-weight: 600;
    }

    .faq-question i {
      color: var(--accent-sky);
      transition: transform 0.3s ease;
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

    /* Support Ticket Form */
    .form-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .form-label {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .form-control,
    .form-select {
      border-radius: 8px;
      border: 1px solid #dee2e6;
      padding: 12px 16px;
      transition: all 0.3s ease;
    }

    .form-control:focus,
    .form-select:focus {
      border-color: var(--accent-sky);
      box-shadow: 0 0 0 0.2rem rgba(14, 165, 233, 0.25);
    }

    /* Contact Cards */
    .contact-card {
      background: white;
      border-radius: 12px;
      padding: 30px 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .contact-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .contact-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-sky), var(--accent-light-sky));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 1.5rem;
      color: white;
    }

    .contact-card h6 {
      color: #2c3e50;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .contact-card p {
      color: #495057;
      margin-bottom: 8px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .support-hero {
        padding: 60px 0 40px;
        text-align: center;
      }

      .display-4 {
        font-size: 2rem;
      }

      .category-filters {
        gap: 8px;
      }

      .filter-btn {
        font-size: 0.85rem;
        padding: 6px 15px;
      }

      .form-card {
        padding: 25px;
      }

      .support-card {
        margin-bottom: 20px;
      }
    }

    .bg-surface {
      background: rgba(30, 41, 59, 0.05) !important;
    }

    .text-gradient {
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `]
})
export class SupportComponent implements OnInit {
  searchQuery = '';
  selectedFAQCategory = 'all';
  isSubmitting = false;

  ticket: SupportTicket = {
    subject: '',
    category: '',
    priority: '',
    description: '',
    email: '',
    orderNumber: ''
  };

  popularTopics = [
    {
      title: 'Order & Shipping',
      description: 'Track orders, shipping info, delivery updates',
      icon: 'bi bi-truck',
      articles: 12,
      link: '/support/shipping'
    },
    {
      title: 'Returns & Refunds',
      description: 'Return policy, refund process, exchanges',
      icon: 'bi bi-arrow-return-left',
      articles: 8,
      link: '/support/returns'
    },
    {
      title: 'Product Support',
      description: 'Setup guides, troubleshooting, warranties',
      icon: 'bi bi-gear',
      articles: 25,
      link: '/support/products'
    },
    {
      title: 'Account Help',
      description: 'Login issues, profile settings, passwords',
      icon: 'bi bi-person-circle',
      articles: 15,
      link: '/support/account'
    }
  ];

  faqs: FAQ[] = [
    {
      id: 1,
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "Order History" section. You\'ll receive an email with tracking information once your order ships.',
      category: 'Shipping'
    },
    {
      id: 2,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with all packaging. Some restrictions apply to certain categories.',
      category: 'Returns'
    },
    {
      id: 3,
      question: 'Do you offer technical support for products?',
      answer: 'Yes, we provide technical support for all products we sell. You can contact our technical team via live chat, email, or phone during business hours.',
      category: 'Technical'
    },
    {
      id: 4,
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping (1-2 days) and overnight shipping options are available at checkout.',
      category: 'Shipping'
    },
    {
      id: 5,
      question: 'Can I change or cancel my order?',
      answer: 'Orders can be modified or canceled within 1 hour of placement. After that, please contact customer service for assistance.',
      category: 'Orders'
    },
    {
      id: 6,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and financing options through Klarna.',
      category: 'Payment'
    }
  ];

  faqCategories: string[] = [];
  filteredFAQs: FAQ[] = [];

  ngOnInit(): void {
    this.initializeFAQs();
  }

  initializeFAQs(): void {
    this.faqCategories = [...new Set(this.faqs.map(faq => faq.category))];
    this.filteredFAQs = this.faqs;
  }

  onSearchInput(): void {
    // Implement search functionality
    console.log('Searching for:', this.searchQuery);
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Performing search for:', this.searchQuery);
      // Implement search logic
    }
  }

  openLiveChat(): void {
    console.log('Opening live chat...');
    // Implement live chat functionality
  }

  scrollToTicket(): void {
    const element = document.querySelector('#ticketSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  callSupport(): void {
    window.open('tel:+15551234567', '_self');
  }

  filterFAQs(category: string): void {
    this.selectedFAQCategory = category;
    if (category === 'all') {
      this.filteredFAQs = this.faqs;
    } else {
      this.filteredFAQs = this.faqs.filter(faq => faq.category === category);
    }
  }

  toggleFAQ(id: number): void {
    const faq = this.filteredFAQs.find(f => f.id === id);
    if (faq) {
      faq.isExpanded = !faq.isExpanded;
    }
  }

  submitTicket(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      console.log('Submitting ticket:', this.ticket);
      alert('Support ticket submitted successfully! You will receive a confirmation email shortly.');
      
      // Reset form
      this.ticket = {
        subject: '',
        category: '',
        priority: '',
        description: '',
        email: '',
        orderNumber: ''
      };
      
      this.isSubmitting = false;
    }, 2000);
  }
}