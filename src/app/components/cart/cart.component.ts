import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="text-center">
        <h1 class="display-4 fw-bold text-gradient mb-4">Shopping Cart</h1>
        <p class="lead text-secondary">Your cart functionality - Coming soon...</p>
      </div>
    </div>
  `,
  styles: [`
    .text-gradient {
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `]
})
export class CartComponent {}