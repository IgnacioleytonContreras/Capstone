import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const user = authService.currentUser();
  
  if (user?.role === 'admin' || user?.role === 'bodeguero') {
    return true;
  }

  // Redirigir según el rol
  if (user?.role === 'cliente') {
    router.navigate(['/cliente']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};


