import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'] as 'cliente' | 'admin' | 'bodeguero';
  
  if (!requiredRole) {
    return true; // Si no se especifica rol, cualquier usuario autenticado puede acceder
  }

  const user = authService.currentUser();
  
  if (user?.role === requiredRole) {
    return true;
  }

  // Redirigir según el rol del usuario
  if (user?.role === 'admin' || user?.role === 'bodeguero') {
    router.navigate(['/admin']);
  } else {
    router.navigate(['/cliente']);
  }
  
  return false;
};
