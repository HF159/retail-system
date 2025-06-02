// src/app/components/support/pages/account-help/account-help.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-help',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="account-help-page">
      <!-- Breadcrumb -->
      <div class="container">
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
            <li class="breadcrumb-item"><a routerLink="/support">Support</a></li>
            <li class="breadcrumb-item active">Account Help</li>
          </ol>
        </nav>
      </div>

      <!-- Header -->
      <section class="page-header">
        <div class="container">
          <div class="text-center">
            <i class="bi bi-person-circle display-3 text-gradient mb-3"></i>
            <h1 class="display-4 fw-bold text-gradient mb-3">Account Help</h1>
            <p class="lead text-secondary">Manage your account, passwords, and profile settings</p>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions py-5">
        <div class="container">
          <h2 class="text-center mb-5">Quick Account Actions</h2>
          <div class="row g-4">
            <div class="col-lg-3 col-md-6" *ngFor="let action of quickActions">
              <div class="action-card">
                <div class="action-icon">
                  <i [class]="action.icon"></i>
                </div>
                <h5>{{action.title}}</h5>
                <p class="text-secondary">{{action.description}}</p>
                <button class="btn btn-outline-primary btn-sm">{{action.buttonText}}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Account FAQ -->
      <section class="account-faq py-5 bg-surface">
        <div class="container">
          <h2 class="text-center mb-5">Account FAQ</h2>
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="faq-list">
                <div class="faq-item" *ngFor="let faq of accountFAQs">
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

      <!-- Security Tips -->
      <section class="security-tips py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="security-card">
                <div class="text-center mb-4">
                  <i class="bi bi-shield-check display-4 text-success mb-3"></i>
                  <h3>Keep Your Account Secure</h3>
                  <p class="text-muted">Follow these best practices to protect your account</p>
                </div>
                
                <div class="security-tips-list">
                  <div class="tip-item" *ngFor="let tip of securityTips">
                    <div class="tip-icon">
                      <i [class]="tip.icon"></i>
                    </div>
                    <div class="tip-content">
                      <h6>{{tip.title}}</h6>
                      <p>{{tip.description}}</p>
                    </div>
                  </div>
                </div>
                
                <div class="text-center mt-4">
                  <button class="btn btn-primary">
                    <i class="bi bi-gear me-2"></i>Review Security Settings
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
    .account-help-page {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      min-height: 100vh;
    }

    .page-header {
      padding: 60px 0;
      background: var(--gradient-primary);
      color: white;
    }

    .action-card {
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

    .action-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      border-color: var(--accent-sky);
    }

    .action-icon {
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

    .security-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .security-tips-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 30px;
    }

    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .tip-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #28a745, #20c997);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: white;
      flex-shrink: 0;
    }

    .tip-content h6 {
      margin: 0 0 5px;
      color: #2c3e50;
      font-weight: 600;
    }

    .tip-content p {
      margin: 0;
      color: #6c757d;
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
      .tip-item {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }
    }
  `]
})
export class AccountHelpComponent {
  quickActions = [
    {
      title: 'Reset Password',
      description: 'Change your account password securely',
      icon: 'bi bi-key',
      buttonText: 'Reset Now'
    },
    {
      title: 'Update Profile',
      description: 'Edit your personal information and preferences',
      icon: 'bi bi-person-gear',
      buttonText: 'Edit Profile'
    },
    {
      title: 'Manage Addresses',
      description: 'Add or update your shipping and billing addresses',
      icon: 'bi bi-geo-alt',
      buttonText: 'Manage'
    },
    {
      title: 'Order History',
      description: 'View your past orders and track current ones',
      icon: 'bi bi-clock-history',
      buttonText: 'View Orders'
    }
  ];

  accountFAQs = [
    {
      id: 1,
      question: 'How do I create a TechNova account?',
      answer: 'Click "Account" in the top navigation, then select "Register." Fill in your email address, create a secure password, and provide your basic information. You\'ll receive a verification email to activate your account.',
      isExpanded: false
    },
    {
      id: 2,
      question: 'I forgot my password. How can I reset it?',
      answer: 'Click "Account" then "Forgot Password." Enter your email address and we\'ll send you a reset link. Follow the instructions in the email to create a new password.',
      isExpanded: false
    },
    {
      id: 3,
      question: 'How do I change my email address?',
      answer: 'Log into your account, go to "Profile Settings," and update your email address. You\'ll need to verify the new email address before the change takes effect.',
      isExpanded: false
    },
    {
      id: 4,
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account by contacting customer support. Please note that this action is irreversible and you\'ll lose access to your order history and saved preferences.',
      isExpanded: false
    },
    {
      id: 5,
      question: 'How do I update my shipping address?',
      answer: 'In your account dashboard, go to "Address Book" where you can add, edit, or remove shipping and billing addresses. You can also set a default address for faster checkout.',
      isExpanded: false
    }
  ];

  securityTips = [
    {
      title: 'Use a Strong Password',
      description: 'Create a unique password with at least 12 characters, including uppercase, lowercase, numbers, and symbols.',
      icon: 'bi bi-shield-lock'
    },
    {
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security by enabling 2FA using your phone or authenticator app.',
      icon: 'bi bi-phone-vibrate'
    },
    {
      title: 'Keep Your Email Secure',
      description: 'Make sure your email account is secure since it\'s used for password resets and important notifications.',
      icon: 'bi bi-envelope-check'
    },
    {
      title: 'Monitor Your Account',
      description: 'Regularly check your order history and account activity for any unauthorized access or purchases.',
      icon: 'bi bi-eye'
    }
  ];

  toggleFAQ(id: number): void {
    const faq = this.accountFAQs.find(f => f.id === id);
    if (faq) {
      faq.isExpanded = !faq.isExpanded;
    }
  }
}