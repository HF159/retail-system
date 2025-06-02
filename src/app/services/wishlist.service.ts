// src/app/services/wishlist.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { WishlistItem } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: WishlistItem[] = [];
  private wishlistItemsSubject = new BehaviorSubject<WishlistItem[]>([]);
  private wishlistItemCountSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.loadWishlistFromStorage();
  }

  getWishlistItems(): Observable<WishlistItem[]> {
    return this.wishlistItemsSubject.asObservable();
  }

  getWishlistItemCount(): Observable<number> {
    return this.wishlistItemCountSubject.asObservable();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.some(item => item.product.id === productId);
  }

  addToWishlist(product: Product): boolean {
    // Check if item already exists
    if (this.isInWishlist(product.id)) {
      return false; // Already in wishlist
    }

    const wishlistItem: WishlistItem = {
      id: this.generateId(),
      product: product,
      dateAdded: new Date()
    };

    this.wishlistItems.push(wishlistItem);
    this.updateWishlist();
    return true; // Successfully added
  }

  removeFromWishlist(productId: number): void {
    this.wishlistItems = this.wishlistItems.filter(item => item.product.id !== productId);
    this.updateWishlist();
  }

  clearWishlist(): void {
    this.wishlistItems = [];
    this.updateWishlist();
  }

  moveToCart(productId: number): WishlistItem | null {
    const itemIndex = this.wishlistItems.findIndex(item => item.product.id === productId);
    if (itemIndex !== -1) {
      const item = this.wishlistItems[itemIndex];
      this.wishlistItems.splice(itemIndex, 1);
      this.updateWishlist();
      return item;
    }
    return null;
  }

  private updateWishlist(): void {
    this.wishlistItemsSubject.next([...this.wishlistItems]);
    this.wishlistItemCountSubject.next(this.wishlistItems.length);
    this.saveWishlistToStorage();
  }

  private saveWishlistToStorage(): void {
    try {
      localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
    } catch (error) {
      console.warn('Failed to save wishlist to localStorage:', error);
    }
  }

  private loadWishlistFromStorage(): void {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        this.wishlistItems = JSON.parse(savedWishlist);
        // Convert date strings back to Date objects
        this.wishlistItems.forEach(item => {
          item.dateAdded = new Date(item.dateAdded);
        });
        this.updateWishlist();
      }
    } catch (error) {
      console.warn('Failed to load wishlist from localStorage:', error);
      this.wishlistItems = [];
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}