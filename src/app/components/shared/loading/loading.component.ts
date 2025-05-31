// src/app/components/shared/loading/loading.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" 
         [class]="containerClass"
         [@fadeIn]>
      
      <!-- Spinner Type Loading -->
      <div *ngIf="type === 'spinner'" class="spinner-container" [@spinnerAnimation]>
        <div class="spinner-ring">
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
          <div class="spinner-segment"></div>
        </div>
        <div class="loading-text" *ngIf="showText">{{text}}</div>
      </div>

      <!-- Dots Type Loading -->
      <div *ngIf="type === 'dots'" class="dots-container" [@dotsAnimation]>
        <div class="dot" *ngFor="let dot of [1,2,3,4,5]; let i = index" 
             [style.animation-delay]="(i * 0.2) + 's'"></div>
        <div class="loading-text" *ngIf="showText">{{text}}</div>
      </div>

      <!-- Pulse Type Loading -->
      <div *ngIf="type === 'pulse'" class="pulse-container" [@pulseAnimation]>
        <div class="pulse-circle"></div>
        <div class="pulse-circle"></div>
        <div class="pulse-circle"></div>
        <div class="loading-text" *ngIf="showText">{{text}}</div>
      </div>

      <!-- Wave Type Loading -->
      <div *ngIf="type === 'wave'" class="wave-container" [@waveAnimation]>
        <div class="wave-bar" *ngFor="let bar of [1,2,3,4,5,6]; let i = index"
             [style.animation-delay]="(i * 0.1) + 's'"></div>
        <div class="loading-text" *ngIf="showText">{{text}}</div>
      </div>

      <!-- Skeleton Type Loading -->
      <div *ngIf="type === 'skeleton'" class="skeleton-container" [@skeletonAnimation]>
        <div class="skeleton-item" *ngFor="let item of skeletonItems">
          <div class="skeleton-avatar" *ngIf="item.avatar"></div>
          <div class="skeleton-content">
            <div class="skeleton-line" 
                 *ngFor="let line of item.lines"
                 [style.width]="line.width"
                 [style.height]="line.height || '12px'"></div>
          </div>
        </div>
      </div>

      <!-- Card Type Loading -->
      <div *ngIf="type === 'card'" class="card-skeleton-container" [@cardAnimation]>
        <div class="card-skeleton" *ngFor="let card of cardCount | slice:0:count">
          <div class="card-skeleton-image"></div>
          <div class="card-skeleton-content">
            <div class="card-skeleton-title"></div>
            <div class="card-skeleton-subtitle"></div>
            <div class="card-skeleton-text"></div>
            <div class="card-skeleton-footer">
              <div class="card-skeleton-button"></div>
              <div class="card-skeleton-price"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Type Loading -->
      <div *ngIf="type === 'progress'" class="progress-container" [@progressAnimation]>
        <div class="progress-circle">
          <svg class="progress-svg" viewBox="0 0 100 100">
            <circle class="progress-bg" cx="50" cy="50" r="45"></circle>
            <circle class="progress-bar" 
                    cx="50" 
                    cy="50" 
                    r="45"
                    [style.stroke-dasharray]="circumference"
                    [style.stroke-dashoffset]="progressOffset"></circle>
          </svg>
          <div class="progress-text">
            <span class="progress-percentage">{{progressValue}}%</span>
            <span class="progress-label" *ngIf="showText">{{text}}</span>
          </div>
        </div>
      </div>

      <!-- Brand Type Loading -->
      <div *ngIf="type === 'brand'" class="brand-container" [@brandAnimation]>
        <div class="brand-logo">
          <div class="logo-icon">
            <i class="bi bi-lightning-charge-fill"></i>
          </div>
          <div class="logo-text">
            <span class="logo-name">TechNova</span>
            <span class="logo-tagline">Loading...</span>
          </div>
        </div>
        <div class="brand-spinner">
          <div class="brand-ring"></div>
        </div>
      </div>

      <!-- Custom Type Loading -->
      <div *ngIf="type === 'custom'" class="custom-container" [@customAnimation]>
        <ng-content></ng-content>
        <div class="loading-text" *ngIf="showText">{{text}}</div>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100px;
      width: 100%;
    }

    .loading-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      z-index: 9999;
      min-height: 100vh;
    }

    .loading-container.overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(5px);
      z-index: 100;
    }

    .loading-container.inline {
      position: relative;
      background: transparent;
      min-height: 80px;
    }

    .loading-text {
      margin-top: 1rem;
      color: #64748b;
      font-size: 0.9rem;
      font-weight: 500;
      text-align: center;
      animation: textPulse 2s ease-in-out infinite;
    }

    /* Spinner Animation */
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .spinner-ring {
      width: 60px;
      height: 60px;
      position: relative;
    }

    .spinner-segment {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid transparent;
      border-top-color: #0ea5e9;
      border-radius: 50%;
      animation: spinnerRotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }

    .spinner-segment:nth-child(1) { animation-delay: -0.45s; }
    .spinner-segment:nth-child(2) { animation-delay: -0.3s; }
    .spinner-segment:nth-child(3) { animation-delay: -0.15s; }

    /* Dots Animation */
    .dots-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .dots-container .dot {
      width: 12px;
      height: 12px;
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      border-radius: 50%;
      margin: 0 6px;
      display: inline-block;
      animation: dotBounce 1.4s ease-in-out infinite both;
    }

    /* Pulse Animation */
    .pulse-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .pulse-circle {
      width: 40px;
      height: 40px;
      background: rgba(14, 165, 233, 0.3);
      border-radius: 50%;
      position: absolute;
      animation: pulseExpand 2s ease-in-out infinite;
    }

    .pulse-circle:nth-child(2) { animation-delay: 0.5s; }
    .pulse-circle:nth-child(3) { animation-delay: 1s; }

    /* Wave Animation */
    .wave-container {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      height: 50px;
      margin-bottom: 20px;
    }

    .wave-bar {
      width: 6px;
      height: 20px;
      background: linear-gradient(0deg, #0ea5e9, #38bdf8);
      margin: 0 2px;
      border-radius: 3px;
      animation: waveMove 1.2s ease-in-out infinite;
    }

    /* Skeleton Animation */
    .skeleton-container {
      width: 100%;
      max-width: 400px;
    }

    .skeleton-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      margin-bottom: 1rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .skeleton-avatar {
      width: 50px;
      height: 50px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      border-radius: 50%;
      margin-right: 1rem;
      animation: skeletonLoading 1.5s infinite;
    }

    .skeleton-content {
      flex: 1;
    }

    .skeleton-line {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      animation: skeletonLoading 1.5s infinite;
    }

    /* Card Skeleton Animation */
    .card-skeleton-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      width: 100%;
      max-width: 1200px;
    }

    .card-skeleton {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .card-skeleton-image {
      width: 100%;
      height: 200px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeletonLoading 1.5s infinite;
    }

    .card-skeleton-content {
      padding: 1.5rem;
    }

    .card-skeleton-title {
      width: 80%;
      height: 20px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      border-radius: 6px;
      margin-bottom: 0.75rem;
      animation: skeletonLoading 1.5s infinite;
    }

    .card-skeleton-subtitle {
      width: 60%;
      height: 16px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      border-radius: 6px;
      margin-bottom: 1rem;
      animation: skeletonLoading 1.5s infinite;
    }

    .card-skeleton-text {
      width: 100%;
      height: 14px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      animation: skeletonLoading 1.5s infinite;
    }

    .card-skeleton-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-skeleton-button {
      width: 80px;
      height: 32px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      border-radius: 6px;
      animation: skeletonLoading 1.5s infinite;
    }

    .card-skeleton-price {
      width: 60px;
      height: 20px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      border-radius: 6px;
      animation: skeletonLoading 1.5s infinite;
    }

    /* Progress Animation */
    .progress-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .progress-circle {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .progress-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .progress-bg {
      fill: none;
      stroke: #e5e7eb;
      stroke-width: 3;
    }

    .progress-bar {
      fill: none;
      stroke: url(#progressGradient);
      stroke-width: 3;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.3s ease;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .progress-percentage {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0ea5e9;
      display: block;
    }

    .progress-label {
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    /* Brand Animation */
    .brand-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      z-index: 2;
      position: relative;
    }

    .logo-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #0ea5e9, #38bdf8);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      animation: logoFloat 3s ease-in-out infinite;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-name {
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
      animation: textGlow 2s ease-in-out infinite alternate;
    }

    .logo-tagline {
      font-size: 0.9rem;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .brand-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .brand-ring {
      width: 100px;
      height: 100px;
      border: 3px solid transparent;
      border-top-color: rgba(14, 165, 233, 0.3);
      border-right-color: rgba(14, 165, 233, 0.3);
      border-radius: 50%;
      animation: brandSpin 2s linear infinite;
    }

    /* Keyframe Animations */
    @keyframes spinnerRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes dotBounce {
      0%, 80%, 100% { transform: scale(0.8); }
      40% { transform: scale(1.2); }
    }

    @keyframes pulseExpand {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(1); opacity: 0; }
    }

    @keyframes waveMove {
      0%, 40%, 100% { transform: scaleY(0.4); }
      20% { transform: scaleY(1); }
    }

    @keyframes skeletonLoading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @keyframes textPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @keyframes logoFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes textGlow {
      0% { color: #1e293b; }
      100% { color: #0ea5e9; }
    }

    @keyframes brandSpin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .card-skeleton-container {
        grid-template-columns: 1fr;
        max-width: 400px;
      }

      .skeleton-container {
        max-width: 300px;
      }

      .progress-circle {
        width: 100px;
        height: 100px;
      }

      .logo-name {
        font-size: 1.5rem;
      }

      .logo-icon {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .loading-container.fullscreen {
        padding: 2rem 1rem;
      }

      .spinner-ring {
        width: 50px;
        height: 50px;
      }

      .progress-circle {
        width: 80px;
        height: 80px;
      }

      .brand-logo {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ]),

    trigger('spinnerAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),

    trigger('dotsAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),

    trigger('pulseAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),

    trigger('waveAnimation', [
      transition(':enter', [
        style({ transform: 'scaleY(0)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'scaleY(1)', opacity: 1 }))
      ])
    ]),

    trigger('skeletonAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    trigger('progressAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),

    trigger('brandAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.7)', opacity: 0 }),
        animate('800ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ]),

    trigger('customAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoadingComponent {
  @Input() type: 'spinner' | 'dots' | 'pulse' | 'wave' | 'skeleton' | 'card' | 'progress' | 'brand' | 'custom' = 'spinner';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary';
  @Input() text = 'Loading...';
  @Input() showText = true;
  @Input() overlay = false;
  @Input() fullscreen = false;
  @Input() count = 6; // For card/skeleton count
  @Input() progressValue = 0; // For progress type (0-100)
  
  // Skeleton configuration
  @Input() skeletonItems = [
    {
      avatar: true,
      lines: [
        { width: '80%', height: '16px' },
        { width: '60%', height: '14px' },
        { width: '90%', height: '12px' }
      ]
    },
    {
      avatar: true,
      lines: [
        { width: '75%', height: '16px' },
        { width: '55%', height: '14px' },
        { width: '85%', height: '12px' }
      ]
    },
    {
      avatar: true,
      lines: [
        { width: '85%', height: '16px' },
        { width: '65%', height: '14px' },
        { width: '95%', height: '12px' }
      ]
    }
  ];

  cardCount = Array(12).fill(0); // For creating card skeletons

  get containerClass(): string {
    let classes = ['loading-container'];
    
    if (this.fullscreen) {
      classes.push('fullscreen');
    } else if (this.overlay) {
      classes.push('overlay');
    } else {
      classes.push('inline');
    }
    
    classes.push(`size-${this.size}`);
    classes.push(`color-${this.color}`);
    
    return classes.join(' ');
  }

  get circumference(): number {
    return 2 * Math.PI * 45; // radius = 45
  }

  get progressOffset(): number {
    const progress = Math.min(Math.max(this.progressValue, 0), 100);
    return this.circumference - (progress / 100) * this.circumference;
  }
}