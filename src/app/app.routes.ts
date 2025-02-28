import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('../screens/orders/orders.component').then(m => m.OrdersComponent) },
    { path: 'inventory', loadComponent: () => import('../screens/inventory/inventory.component').then(m => m.InventoryComponent) },
    { path: 'login', loadComponent: () => import('../screens/login/login.component').then(m => m.LoginComponent) },
    { path: 'settings', loadComponent: () => import('../screens/settings/settings.component').then(m => m.SettingsComponent) },
];
