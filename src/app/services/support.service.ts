// src/app/services/support.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface SupportTicket {
  id?: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  email: string;
  orderNumber?: string;
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  helpful?: number;
  notHelpful?: number;
  tags?: string[];
}

export interface SupportArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
  lastUpdated: Date;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'text' | 'image' | 'file';
}

export interface LiveChatSession {
  id: string;
  status: 'waiting' | 'connected' | 'ended';
  agent?: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  messages: ChatMessage[];
  startedAt: Date;
  endedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private mockFAQs: FAQ[] = [
    {
      id: 1,
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "Order History" section. You\'ll receive an email with tracking information once your order ships. You can also use the tracking number provided in your shipping confirmation email on our website or the carrier\'s website.',
      category: 'Shipping',
      helpful: 142,
      notHelpful: 5,
      tags: ['tracking', 'order', 'shipping']
    },
    {
      id: 2,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with all packaging and accessories. Items must be unused and in resalable condition. Some restrictions apply to certain categories like software, consumables, and custom-built systems. Return shipping is free for defective items, while customer-initiated returns may incur return shipping costs.',
      category: 'Returns',
      helpful: 89,
      notHelpful: 12,
      tags: ['returns', 'policy', 'refund']
    },
    {
      id: 3,
      question: 'Do you offer technical support for products?',
      answer: 'Yes, we provide comprehensive technical support for all products we sell. Our technical team is available via live chat, email, or phone during business hours (Monday-Friday, 9AM-6PM EST). We also offer video tutorials, setup guides, and troubleshooting articles in our knowledge base.',
      category: 'Technical',
      helpful: 156,
      notHelpful: 8,
      tags: ['technical', 'support', 'troubleshooting']
    },
    {
      id: 4,
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days within the continental US. Express shipping (1-2 business days) and overnight shipping options are available at checkout for an additional fee. We also offer same-day delivery in select metropolitan areas. International shipping times vary by destination and shipping method chosen.',
      category: 'Shipping',
      helpful: 203,
      notHelpful: 15,
      tags: ['shipping', 'delivery', 'timing']
    },
    {
      id: 5,
      question: 'Can I change or cancel my order?',
      answer: 'Orders can be modified or canceled within 1 hour of placement, provided they haven\'t entered the fulfillment process. After this window, please contact customer service immediately for assistance. We\'ll do our best to accommodate changes, but once an order has shipped, modifications are not possible.',
      category: 'Orders',
      helpful: 98,
      notHelpful: 22,
      tags: ['cancel', 'modify', 'order']
    },
    {
      id: 6,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and financing options through Klarna and Affirm. For business customers, we also accept wire transfers and purchase orders with approved credit applications.',
      category: 'Payment',
      helpful: 76,
      notHelpful: 3,
      tags: ['payment', 'credit card', 'paypal']
    },
    {
      id: 7,
      question: 'Do you offer warranty on products?',
      answer: 'All products come with manufacturer warranties. Additionally, we offer extended warranty protection plans for most electronics. Warranty terms vary by product and manufacturer. You can find specific warranty information on each product page or contact our support team for details.',
      category: 'Warranty',
      helpful: 134,
      notHelpful: 7,
      tags: ['warranty', 'protection', 'coverage']
    },
    {
      id: 8,
      question: 'How do I create an account?',
      answer: 'Creating an account is easy! Click the "Account" button in the top navigation, then select "Register." Fill in your email address, create a secure password, and provide your basic information. You\'ll receive a verification email to activate your account. Having an account allows you to track orders, save favorites, and speed up checkout.',
      category: 'Account',
      helpful: 45,
      notHelpful: 2,
      tags: ['account', 'register', 'signup']
    }
  ];

  private mockArticles: SupportArticle[] = [
    {
      id: 'setup-gaming-laptop',
      title: 'Setting Up Your New Gaming Laptop',
      content: 'Complete guide to setting up your gaming laptop for optimal performance...',
      category: 'Technical',
      tags: ['gaming', 'laptop', 'setup'],
      views: 2341,
      helpful: 189,
      notHelpful: 12,
      lastUpdated: new Date('2024-03-01')
    },
    {
      id: 'troubleshoot-audio',
      title: 'Troubleshooting Audio Issues',
      content: 'Step-by-step guide to resolving common audio problems...',
      category: 'Technical',
      tags: ['audio', 'troubleshooting', 'headphones'],
      views: 1876,
      helpful: 156,
      notHelpful: 23,
      lastUpdated: new Date('2024-02-28')
    }
  ];

  constructor() { }

  // FAQ Methods
  getFAQs(category?: string): Observable<FAQ[]> {
    let faqs = this.mockFAQs;
    if (category && category !== 'all') {
      faqs = this.mockFAQs.filter(faq => 
        faq.category.toLowerCase() === category.toLowerCase()
      );
    }
    return of(faqs).pipe(delay(300));
  }

  getFAQCategories(): Observable<string[]> {
    const categories = [...new Set(this.mockFAQs.map(faq => faq.category))];
    return of(categories).pipe(delay(200));
  }

  searchFAQs(query: string): Observable<FAQ[]> {
    const searchTerm = query.toLowerCase();
    const results = this.mockFAQs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm) ||
      faq.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    return of(results).pipe(delay(400));
  }

  markFAQHelpful(faqId: number, helpful: boolean): Observable<boolean> {
    const faq = this.mockFAQs.find(f => f.id === faqId);
    if (faq) {
      if (helpful) {
        faq.helpful = (faq.helpful || 0) + 1;
      } else {
        faq.notHelpful = (faq.notHelpful || 0) + 1;
      }
    }
    return of(true).pipe(delay(200));
  }

  // Support Ticket Methods
  submitTicket(ticket: SupportTicket): Observable<{ success: boolean; ticketId: string }> {
    const ticketId = `TN-${Date.now()}`;
    const result = {
      success: true,
      ticketId: ticketId
    };
    
    console.log('Submitting support ticket:', { ...ticket, id: ticketId });
    return of(result).pipe(delay(1500));
  }

  getTicketStatus(ticketId: string): Observable<SupportTicket | null> {
    // Mock ticket data
    const mockTicket: SupportTicket = {
      id: ticketId,
      subject: 'Sample Ticket',
      category: 'Technical',
      priority: 'medium',
      description: 'Sample description',
      email: 'user@example.com',
      status: 'in-progress',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return of(mockTicket).pipe(delay(500));
  }

  // Support Article Methods
  getArticles(category?: string): Observable<SupportArticle[]> {
    let articles = this.mockArticles;
    if (category) {
      articles = this.mockArticles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
    }
    return of(articles).pipe(delay(400));
  }

  getArticle(articleId: string): Observable<SupportArticle | null> {
    const article = this.mockArticles.find(a => a.id === articleId);
    return of(article || null).pipe(delay(300));
  }

  searchArticles(query: string): Observable<SupportArticle[]> {
    const searchTerm = query.toLowerCase();
    const results = this.mockArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    return of(results).pipe(delay(500));
  }

  // Live Chat Methods
  startChatSession(): Observable<LiveChatSession> {
    const session: LiveChatSession = {
      id: `chat-${Date.now()}`,
      status: 'waiting',
      messages: [],
      startedAt: new Date()
    };
    
    return of(session).pipe(delay(1000));
  }

  connectToAgent(sessionId: string): Observable<LiveChatSession> {
    const session: LiveChatSession = {
      id: sessionId,
      status: 'connected',
      agent: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150',
        isOnline: true
      },
      messages: [
        {
          id: 'msg-1',
          message: 'Hi! I\'m Sarah, your support agent. How can I help you today?',
          sender: 'agent',
          timestamp: new Date(),
          type: 'text'
        }
      ],
      startedAt: new Date()
    };
    
    return of(session).pipe(delay(2000));
  }

  sendChatMessage(sessionId: string, message: string): Observable<ChatMessage[]> {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      message: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    // Simulate agent response
    const agentResponse: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      message: 'Thank you for your message. Let me help you with that.',
      sender: 'agent',
      timestamp: new Date(Date.now() + 2000),
      type: 'text'
    };

    return of([userMessage, agentResponse]).pipe(delay(1000));
  }

  endChatSession(sessionId: string): Observable<boolean> {
    console.log('Ending chat session:', sessionId);
    return of(true).pipe(delay(500));
  }

  // Contact Methods
  getContactInfo(): Observable<any> {
    return of({
      email: 'support@technova.com',
      phone: '+1 (555) 123-4567',
      hours: 'Monday-Friday 9AM-6PM EST',
      address: '123 Tech Street, Digital City, DC 12345',
      socialMedia: {
        twitter: '@technova',
        facebook: 'TechNovaStore',
        instagram: 'technovaofficial'
      }
    }).pipe(delay(200));
  }

  // Analytics Methods
  recordSupportInteraction(type: string, data: any): Observable<boolean> {
    console.log('Recording support interaction:', type, data);
    return of(true).pipe(delay(100));
  }

  getSupportStats(): Observable<any> {
    return of({
      avgResponseTime: '2 hours',
      satisfactionScore: 4.8,
      ticketsResolved: '98%',
      avgResolutionTime: '4 hours'
    }).pipe(delay(300));
  }
}