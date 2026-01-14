import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent),
  },

  {
    path: 'home', // o 'dashboard'
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },

  {
    path: 'reservatuhora',
    loadComponent: () =>
      import('./pages/reservatuhora/reservatuhora').then(m => m.ReservaTuHora),
    canActivate: [authGuard]
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contacto/contacto').then(m => m.Contacto),
    canActivate: [authGuard]
  },
  {
    path: 'nosotros',
    loadComponent: () =>
      import('./pages/nosotros/nosotros').then(m => m.Nosotros),
    canActivate: [authGuard]
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./pages/servicios/servicios').then(m => m.Servicios),
    canActivate: [authGuard]
  },
  {
    path: 'urgencias',
    loadComponent: () =>
      import('./pages/urgencias/urgencias').then(m => m.Urgencias),
    canActivate: [authGuard]
  },
];
