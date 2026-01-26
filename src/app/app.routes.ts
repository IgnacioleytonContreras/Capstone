import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { clienteGuard } from './guards/cliente.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./components/admin-login/admin-login.component').then(m => m.AdminLoginComponent),
  },
  {
    path: 'admin-register-bodeguero',
    loadComponent: () =>
      import('./components/bodeguero-register/bodeguero-register.component').then(
        m => m.BodegueroRegisterComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'nosotros',
    loadComponent: () =>
      import('./pages/nosotros/nosotros').then(m => m.Nosotros),
  },
  {
    path: 'urgencias',
    loadComponent: () =>
      import('./pages/urgencias/urgencias').then(m => m.Urgencias),
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./pages/servicios/servicios').then(m => m.Servicios),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contacto/contacto').then(m => m.Contacto),
  },

  // Vista Cliente
  {
    path: 'cliente',
    canActivate: [authGuard, clienteGuard],
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
        path: 'atencion-domicilio',
        loadComponent: () =>
          import('./pages/atencion-domicilio/atencion-domicilio').then(
            m => m.AtencionDomicilio
          ),
      },
      {
        path: 'mi-domicilio',
        loadComponent: () =>
          import('./pages/mi-domicilio/mi-domicilio').then(m => m.MiDomicilio),
      },
      {
        path: 'mascota-detalle/:id',
        loadComponent: () =>
          import('./pages/mascota-detalle/mascota-detalle').then(m => m.MascotaDetalle),
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
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
      },
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
      {
        path: 'inventario',
        loadComponent: () =>
          import('./pages/inventario-bodega/inventario-bodega').then(m => m.InventarioBodega),
      },
      {
        path: 'disponibilidad',
        loadComponent: () =>
          import('./pages/disponibilidad-veterinarios/disponibilidad-veterinarios').then(
            m => m.DisponibilidadVeterinarios
          ),
      },
      {
        path: 'reporte-cliente',
        loadComponent: () =>
          import('./pages/reporte-cliente/reporte-cliente').then(m => m.ReporteCliente),
      },
      {
        path: 'domicilio',
        loadComponent: () =>
          import('./pages/admin-domicilio/admin-domicilio').then(m => m.AdminDomicilio),
      },
    ],
  },

  // Redirecciones de compatibilidad
  { path: 'home', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
