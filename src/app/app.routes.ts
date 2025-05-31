// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'TechNova - Home'
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/pages/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'Products - TechNova'
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./components/products/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Product Details - TechNova'
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
    title: 'Shopping Cart - TechNova'
  },
  {
    path: 'deals',
    loadComponent: () => import('./components/deals/deals.component').then(m => m.DealsComponent),
    title: 'Deals - TechNova'
  },
  {
    path: 'account',
    loadComponent: () => import('./components/account/account.component').then(m => m.AccountComponent),
    title: 'My Account - TechNova'
  },
  {
    path: 'account/:tab',
    loadComponent: () => import('./components/account/account.component').then(m => m.AccountComponent),
    title: 'My Account - TechNova'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];