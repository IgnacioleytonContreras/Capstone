import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent),
  },

  // Vista Cliente
  {
    path: 'cliente',
    canActivate: [authGuard, () => {
      const authService = inject(AuthService);
      const router = inject(Router);
      const user = authService.currentUser();
      if (user?.role !== 'cliente') {
        if (user?.role === 'admin') {
          router.navigate(['/admin']);
        } else {
          router.navigate(['/login']);
        }
        return false;
      }
      return true;
    }],
    loadComponent: () =>
      import('./layouts/cliente-layout/cliente-layout.component').then(m => m.ClienteLayoutComponent),
    children: [
      { path: '', redirectTo: 'mis-mascotas', pathMatch: 'full' },
      {
        path: 'mis-mascotas',
        loadComponent: () =>
          import('./pages/mis-mascotas/mis-mascotas').then(m => m.MisMascotas),
      },
      {
        path: 'mascota-nueva',
        loadComponent: () =>
          import('./pages/mascota-nueva/mascota-nueva').then(m => m.MascotaNueva),
      },
      {
        path: 'agendar-cita',
        loadComponent: () =>
          import('./pages/agendar-cita/agendar-cita').then(m => m.AgendarCita),
      },
      {
        path: 'mi-agenda',
        loadComponent: () =>
          import('./pages/mi-agenda/mi-agenda').then(m => m.MiAgenda),
      },
      {
        path: 'reservatuhora',
        loadComponent: () =>
          import('./pages/reservatuhora/reservatuhora').then(m => m.ReservaTuHora),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./pages/contacto/contacto').then(m => m.Contacto),
      },
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./pages/nosotros/nosotros').then(m => m.Nosotros),
      },
      {
        path: 'servicios',
        loadComponent: () =>
          import('./pages/servicios/servicios').then(m => m.Servicios),
      },
      {
        path: 'urgencias',
        loadComponent: () =>
          import('./pages/urgencias/urgencias').then(m => m.Urgencias),
      },
    ],
  },

  // Vista Administrador
  {
    path: 'admin',
    canActivate: [authGuard, () => {
      const authService = inject(AuthService);
      const router = inject(Router);
      const user = authService.currentUser();
      if (user?.role !== 'admin') {
        if (user?.role === 'cliente') {
          router.navigate(['/cliente']);
        } else {
          router.navigate(['/login']);
        }
        return false;
      }
      return true;
    }],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'buscar-mascota', pathMatch: 'full' },
      {
        path: 'buscar-mascota',
        loadComponent: () =>
          import('./pages/buscar-mascota/buscar-mascota').then(m => m.BuscarMascota),
      },
      {
        path: 'mascota-detalle/:id',
        loadComponent: () =>
          import('./pages/mascota-detalle/mascota-detalle').then(m => m.MascotaDetalle),
      },
      {
        path: 'atencion',
        loadComponent: () =>
          import('./pages/atencion/atencion').then(m => m.Atencion),
      },
      {
        path: 'atencion/:citaId',
        loadComponent: () =>
          import('./pages/atencion/atencion').then(m => m.Atencion),
      },
      {
        path: 'registrar-pago',
        loadComponent: () =>
          import('./pages/registrar-pago/registrar-pago').then(m => m.RegistrarPago),
      },
      {
        path: 'registrar-pago/:citaId',
        loadComponent: () =>
          import('./pages/registrar-pago/registrar-pago').then(m => m.RegistrarPago),
      },
    ],
  },

  // Redirecciones de compatibilidad
  { path: 'dashboard', redirectTo: 'cliente/mis-mascotas', pathMatch: 'full' },
  { path: 'home', redirectTo: 'cliente/mis-mascotas', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
