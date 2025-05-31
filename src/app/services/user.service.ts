// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  membershipLevel: string;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface UserSettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  profileVisibility: 'public' | 'private';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Mock user data
  private mockUser: UserProfile = {
    id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    joinDate: '2022-01-15',
    totalOrders: 24,
    totalSpent: 5420,
    membershipLevel: 'Gold'
  };

  private mockAddresses: Address[] = [
    {
      id: '1',
      type: 'shipping',
      isDefault: true,
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Tech Street',
      addressLine2: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States',
      phone: '+1 (555) 123-4567'
    },
    {
      id: '2',
      type: 'billing',
      isDefault: false,
      firstName: 'John',
      lastName: 'Doe',
      company: 'Tech Solutions Inc.',
      addressLine1: '456 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'United States',
      phone: '+1 (555) 987-6543'
    }
  ];

  private mockSettings: UserSettings = {
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    profileVisibility: 'public'
  };

  constructor() {
    // Simulate logged in user
    this.currentUserSubject.next(this.mockUser);
    this.isAuthenticatedSubject.next(true);
  }

  // Observables
  get currentUser$(): Observable<UserProfile | null> {
    return this.currentUserSubject.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Current user getter
  get currentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Authentication methods
  login(email: string, password: string): Observable<{ success: boolean; user?: UserProfile; error?: string }> {
    // Simulate API call
    return of({
      success: true,
      user: this.mockUser
    }).pipe(delay(1000));
  }

  register(userData: Partial<UserProfile>): Observable<{ success: boolean; user?: UserProfile; error?: string }> {
    // Simulate API call
    const newUser: UserProfile = {
      ...this.mockUser,
      ...userData,
      id: 'user' + Date.now(),
      joinDate: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
      membershipLevel: 'Bronze'
    };

    return of({
      success: true,
      user: newUser
    }).pipe(delay(1000));
  }

  logout(): Observable<boolean> {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    return of(true).pipe(delay(500));
  }

  // Profile methods
  getUserProfile(): Observable<UserProfile> {
    return of(this.mockUser).pipe(delay(300));
  }

  updateProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    const updatedUser = { ...this.mockUser, ...profileData };
    this.currentUserSubject.next(updatedUser);
    return of(updatedUser).pipe(delay(500));
  }

  updateAvatar(avatarFile: File): Observable<string> {
    // Simulate file upload
    const avatarUrl = URL.createObjectURL(avatarFile);
    this.mockUser.avatar = avatarUrl;
    this.currentUserSubject.next(this.mockUser);
    return of(avatarUrl).pipe(delay(1000));
  }

  // Address methods
  getAddresses(): Observable<Address[]> {
    return of(this.mockAddresses).pipe(delay(300));
  }

  addAddress(address: Omit<Address, 'id'>): Observable<Address> {
    const newAddress: Address = {
      ...address,
      id: 'addr' + Date.now()
    };
    this.mockAddresses.push(newAddress);
    return of(newAddress).pipe(delay(500));
  }

  updateAddress(addressId: string, addressData: Partial<Address>): Observable<Address> {
    const index = this.mockAddresses.findIndex(addr => addr.id === addressId);
    if (index !== -1) {
      this.mockAddresses[index] = { ...this.mockAddresses[index], ...addressData };
      return of(this.mockAddresses[index]).pipe(delay(500));
    }
    throw new Error('Address not found');
  }

  deleteAddress(addressId: string): Observable<boolean> {
    const index = this.mockAddresses.findIndex(addr => addr.id === addressId);
    if (index !== -1) {
      this.mockAddresses.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  setDefaultAddress(addressId: string): Observable<boolean> {
    // Remove default from all addresses of the same type
    const targetAddress = this.mockAddresses.find(addr => addr.id === addressId);
    if (targetAddress) {
      this.mockAddresses.forEach(addr => {
        if (addr.type === targetAddress.type) {
          addr.isDefault = false;
        }
      });
      targetAddress.isDefault = true;
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  // Settings methods
  getSettings(): Observable<UserSettings> {
    return of(this.mockSettings).pipe(delay(300));
  }

  updateSettings(settings: Partial<UserSettings>): Observable<UserSettings> {
    this.mockSettings = { ...this.mockSettings, ...settings };
    return of(this.mockSettings).pipe(delay(500));
  }

  // Security methods
  changePassword(currentPassword: string, newPassword: string): Observable<{ success: boolean; error?: string }> {
    // Simulate password change
    return of({ success: true }).pipe(delay(1000));
  }

  enableTwoFactor(): Observable<{ success: boolean; qrCode?: string; backupCodes?: string[] }> {
    // Simulate 2FA setup
    return of({
      success: true,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      backupCodes: ['123456', '789012', '345678', '901234', '567890']
    }).pipe(delay(1000));
  }

  disableTwoFactor(): Observable<boolean> {
    this.mockSettings.twoFactorEnabled = false;
    return of(true).pipe(delay(500));
  }

  // Account deletion
  deleteAccount(password: string): Observable<{ success: boolean; error?: string }> {
    // Simulate account deletion
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    return of({ success: true }).pipe(delay(1000));
  }

  // Utility methods
  getMembershipLevel(totalSpent: number): string {
    if (totalSpent >= 10000) return 'Platinum';
    if (totalSpent >= 5000) return 'Gold';
    if (totalSpent >= 1000) return 'Silver';
    return 'Bronze';
  }

  getMembershipBenefits(level: string): string[] {
    const benefits: { [key: string]: string[] } = {
      'Bronze': ['Basic support', 'Standard shipping'],
      'Silver': ['Priority support', 'Free standard shipping', '5% discount'],
      'Gold': ['Premium support', 'Free express shipping', '10% discount', 'Early access'],
      'Platinum': ['VIP support', 'Free overnight shipping', '15% discount', 'Exclusive products', 'Personal shopper']
    };
    return benefits[level] || benefits['Bronze'];
  }
}