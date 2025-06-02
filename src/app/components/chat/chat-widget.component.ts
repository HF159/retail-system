// src/app/components/chat/chat-widget.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Define interfaces locally since we don't have the service
interface ChatAgent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: Date;
}

interface LiveChatSession {
  id: string;
  status: 'waiting' | 'connected' | 'ended';
  agent?: ChatAgent;
  messages: ChatMessage[];
  startTime: Date;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Chat Widget Button -->
    <div class="chat-widget" [class.open]="isOpen">
      <button 
        class="chat-toggle"
        (click)="toggleChat()"
        [class.has-notification]="hasUnreadMessages">
        <i class="bi bi-chat-dots" *ngIf="!isOpen"></i>
        <i class="bi bi-x-lg" *ngIf="isOpen"></i>
        <span class="notification-badge" *ngIf="hasUnreadMessages && !isOpen">{{unreadCount}}</span>
      </button>

      <!-- Chat Window -->
      <div class="chat-window" *ngIf="isOpen">
        <div class="chat-header">
          <div class="agent-info" *ngIf="getAgentInfo(); else waitingHeader">
            <img [src]="getAgentInfo()?.avatar || ''" [alt]="getAgentInfo()?.name || ''" class="agent-avatar">
            <div class="agent-details">
              <span class="agent-name">{{getAgentInfo()?.name}}</span>
              <span class="agent-status">
                <i class="bi bi-circle-fill text-success"></i>
                Online
              </span>
            </div>
          </div>
          
          <ng-template #waitingHeader>
            <div class="waiting-info">
              <i class="bi bi-headset"></i>
              <span>TechNova Support</span>
            </div>
          </ng-template>

          <button class="btn btn-sm btn-link text-white" (click)="minimizeChat()">
            <i class="bi bi-dash-lg"></i>
          </button>
        </div>

        <div class="chat-body" #chatBody>
          <!-- Welcome Message -->
          <div class="welcome-message" *ngIf="!chatSession">
            <div class="welcome-content">
              <i class="bi bi-chat-heart display-4 text-primary mb-3"></i>
              <h6>Welcome to TechNova Support!</h6>
              <p class="text-muted small">How can we help you today?</p>
              <button class="btn btn-primary btn-sm" (click)="startChat()">
                <i class="bi bi-chat-dots me-2"></i>
                Start Chat
              </button>
            </div>
          </div>

          <!-- Waiting for Agent -->
          <div class="waiting-agent" *ngIf="isWaiting()">
            <div class="text-center py-4">
              <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="text-muted small">Connecting you to an agent...</p>
            </div>
          </div>

          <!-- Chat Messages -->
          <div class="messages-container" *ngIf="getMessages().length > 0">
            <div 
              class="message"
              *ngFor="let message of getMessages()"
              [class.user-message]="message.sender === 'user'"
              [class.agent-message]="message.sender === 'agent'">
              
              <div class="message-avatar" *ngIf="message.sender === 'agent'">
                <img [src]="getAgentInfo()?.avatar || '/assets/default-avatar.png'" alt="Agent">
              </div>
              
              <div class="message-content">
                <div class="message-bubble">
                  {{message.message}}
                </div>
                <div class="message-time">
                  {{message.timestamp | date:'short'}}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="chat-input" *ngIf="isConnected()">
          <form (ngSubmit)="sendMessage()" #messageForm="ngForm">
            <div class="input-group">
              <input 
                type="text" 
                class="form-control"
                placeholder="Type your message..."
                [(ngModel)]="currentMessage"
                name="message"
                #messageInput
                [disabled]="isSending">
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="!currentMessage.trim() || isSending">
                <i class="bi bi-send" *ngIf="!isSending"></i>
                <div class="spinner-border spinner-border-sm" *ngIf="isSending"></div>
              </button>
            </div>
          </form>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions" *ngIf="!chatSession">
          <div class="quick-action" (click)="openFAQ()">
            <i class="bi bi-question-circle"></i>
            <span>FAQ</span>
          </div>
          <div class="quick-action" (click)="openSupport()">
            <i class="bi bi-ticket-perforated"></i>
            <span>Support</span>
          </div>
          <div class="quick-action" (click)="trackOrder()">
            <i class="bi bi-truck"></i>
            <span>Track Order</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .chat-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-sky), var(--accent-light-sky));
      border: none;
      color: white;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
      transition: all 0.3s ease;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-toggle:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(14, 165, 233, 0.6);
    }

    .chat-toggle.has-notification {
      animation: pulse 2s infinite;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      min-width: 20px;
      height: 20px;
      font-size: 0.7rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    .chat-header {
      background: linear-gradient(135deg, var(--accent-sky), var(--accent-light-sky));
      color: white;
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .agent-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .agent-avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .agent-details {
      display: flex;
      flex-direction: column;
    }

    .agent-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .agent-status {
      font-size: 0.75rem;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .waiting-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }

    .chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      background: #f8f9fa;
      position: relative;
    }

    .welcome-message {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .welcome-content {
      text-align: center;
      max-width: 250px;
    }

    .messages-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .message {
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }

    .message.user-message {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
    }

    .message-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .message-content {
      max-width: 70%;
    }

    .message-bubble {
      padding: 10px 15px;
      border-radius: 18px;
      word-wrap: break-word;
      line-height: 1.4;
    }

    .agent-message .message-bubble {
      background: white;
      border: 1px solid #e9ecef;
      color: #495057;
    }

    .user-message .message-bubble {
      background: var(--accent-sky);
      color: white;
    }

    .message-time {
      font-size: 0.7rem;
      color: #6c757d;
      margin-top: 4px;
      text-align: center;
    }

    .chat-input {
      padding: 15px;
      background: white;
      border-top: 1px solid #e9ecef;
    }

    .chat-input .form-control {
      border: 1px solid #dee2e6;
      border-radius: 20px;
      padding: 10px 15px;
    }

    .chat-input .btn {
      border-radius: 20px;
      padding: 10px 15px;
    }

    .quick-actions {
      padding: 15px;
      background: white;
      border-top: 1px solid #e9ecef;
      display: flex;
      justify-content: space-around;
    }

    .quick-action {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      padding: 10px;
      border-radius: 8px;
      transition: background 0.2s ease;
      font-size: 0.8rem;
      color: #6c757d;
    }

    .quick-action:hover {
      background: #f8f9fa;
      color: var(--accent-sky);
    }

    .quick-action i {
      font-size: 1.2rem;
    }

    .waiting-agent {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Mobile Responsiveness */
    @media (max-width: 480px) {
      .chat-window {
        width: calc(100vw - 40px);
        height: 400px;
        bottom: 80px;
        right: 20px;
        left: 20px;
      }

      .chat-toggle {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
      }
    }

    /* Scrollbar Styling */
    .chat-body::-webkit-scrollbar {
      width: 4px;
    }

    .chat-body::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-body::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 2px;
    }

    .chat-body::-webkit-scrollbar-thumb:hover {
      background: #ced4da;
    }
  `]
})
export class ChatWidgetComponent implements OnInit, OnDestroy {
  isOpen = false;
  chatSession: LiveChatSession | null = null;
  currentMessage = '';
  isSending = false;
  hasUnreadMessages = false;
  unreadCount = 0;

  constructor() {}

  ngOnInit(): void {
    // Initialize chat widget
  }

  ngOnDestroy(): void {
    if (this.chatSession) {
      this.endChat();
    }
  }

  // Helper methods to safely access chatSession properties
  getAgentInfo(): ChatAgent | null {
    return this.chatSession?.agent || null;
  }

  getMessages(): ChatMessage[] {
    return this.chatSession?.messages || [];
  }

  isWaiting(): boolean {
    return this.chatSession?.status === 'waiting';
  }

  isConnected(): boolean {
    return this.chatSession?.status === 'connected';
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.hasUnreadMessages = false;
      this.unreadCount = 0;
    }
  }

  minimizeChat(): void {
    this.isOpen = false;
  }

  startChat(): void {
    // Mock implementation - replace with actual service call
    this.chatSession = {
      id: 'mock-session-' + Date.now(),
      status: 'waiting',
      messages: [],
      startTime: new Date()
    };

    // Simulate connecting to agent after a delay
    setTimeout(() => {
      this.connectToAgent();
    }, 2000);
  }

  connectToAgent(): void {
    if (this.chatSession) {
      this.chatSession.status = 'connected';
      this.chatSession.agent = {
        id: 'agent-1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c787?w=150',
        status: 'online'
      };

      // Add welcome message from agent
      this.chatSession.messages.push({
        id: 'msg-' + Date.now(),
        sender: 'agent',
        message: 'Hi! I\'m Sarah from TechNova Support. How can I help you today?',
        timestamp: new Date()
      });

      if (!this.isOpen) {
        this.hasUnreadMessages = true;
        this.unreadCount = 1;
      }
      this.scrollToBottom();
    }
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isSending || !this.chatSession) {
      return;
    }

    this.isSending = true;
    const message = this.currentMessage.trim();
    this.currentMessage = '';

    // Add user message
    this.chatSession.messages.push({
      id: 'msg-' + Date.now(),
      sender: 'user',
      message: message,
      timestamp: new Date()
    });

    // Simulate agent response
    setTimeout(() => {
      if (this.chatSession) {
        this.chatSession.messages.push({
          id: 'msg-' + Date.now(),
          sender: 'agent',
          message: 'Thank you for your message. Let me help you with that.',
          timestamp: new Date()
        });

        if (!this.isOpen) {
          this.hasUnreadMessages = true;
          this.unreadCount += 1;
        }
      }
      this.isSending = false;
      this.scrollToBottom();
    }, 1000);

    this.scrollToBottom();
  }

  endChat(): void {
    if (this.chatSession) {
      this.chatSession.status = 'ended';
      this.chatSession = null;
      this.isOpen = false;
    }
  }

  openFAQ(): void {
    window.open('/support#faq', '_blank');
  }

  openSupport(): void {
    window.open('/support', '_blank');
  }

  trackOrder(): void {
    window.open('/orders', '_blank');
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatBody = document.querySelector('.chat-body');
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }, 100);
  }
}