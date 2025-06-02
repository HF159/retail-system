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
    path: 'account', // Fixed: changed from 'Acount' to 'account'
    loadComponent: () => import('./components/account/account.component').then(m => m.AccountComponent), // Fixed: changed from ProductListComponent to AccountComponent
    title: 'Account - TechNova' // Fixed: spelling
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
    path: 'support',
    loadComponent: () => import('./components/support/support.component').then(m => m.SupportComponent),
    title: 'Support - TechNova'
  },
  {
    path: 'support/shipping',
    loadComponent: () => import('./components/support/pages/shipping-help/shipping-help.component').then(m => m.ShippingHelpComponent),
    title: 'Shipping Help - TechNova'
  },
  // Temporarily commented out until the component is created
  // {
  //   path: 'support/returns',
  //   loadComponent: () => import('./components/support/pages/returns-help/returns-help.component').then(m => m.ReturnsHelpComponent),
  //   title: 'Returns Help - TechNova'
  // },
  {
    path: 'support/products',
    loadComponent: () => import('./components/support/pages/product-help/product-help.component').then(m => m.ProductHelpComponent),
    title: 'Product Help - TechNova'
  },
  {
    path: 'support/account',
    loadComponent: () => import('./components/support/pages/account-help/account-help.component').then(m => m.AccountHelpComponent),
    title: 'Account Help - TechNova'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];