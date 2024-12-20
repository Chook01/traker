import { Routes } from '@angular/router';
import { LoginComponent } from '../screens/login/login.component';
import { OrdersComponent } from '../screens/orders/orders.component';
import { SettingsComponent } from '../screens/settings/settings.component';

export const routes: Routes = [
    { path: '', component: OrdersComponent },
    { path: 'login', component: LoginComponent },
    { path: 'settings', component: SettingsComponent }, 
];
