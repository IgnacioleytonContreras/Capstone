import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'cliente' | 'admin';

export interface User {
  email: string;
  name?: string;
  role?: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  // Estado de autenticación usando signals
  private _isAuthenticated = signal<boolean>(this.checkAuthStatus());
  currentUser = signal<User | null>(this.getStoredUser());

  /**
   * Signal de autenticación (para uso en componentes)
   */
  get isAuthenticatedSignal() {
    return this._isAuthenticated;
  }

  constructor(private router: Router) {
    // Verificar estado al inicializar
    this.checkAuthStatus();
  }

  /**
   * Verifica si hay un token válido almacenado
   */
  private checkAuthStatus(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }

  /**
   * Obtiene el usuario almacenado
   */
  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Realiza el login del usuario
   */
  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulación de autenticación
      // En producción, esto debería hacer una llamada HTTP al backend
      setTimeout(() => {
        // Validación básica (en producción, esto debe validarse en el backend)
        if (email && password && password.length >= 6) {
          const token = this.generateToken();
          
          // Determinar rol: si el email contiene "admin" es administrador, sino es cliente
          const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'cliente';
          
          const user: User = {
            email: email,
            name: email.split('@')[0],
            role: role
          };

          localStorage.setItem(this.TOKEN_KEY, token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));

          this._isAuthenticated.set(true);
          this.currentUser.set(user);

          resolve(true);
        } else {
          resolve(false);
        }
      }, 500); // Simula delay de red
    });
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Verifica si el usuario está autenticado (método para guards)
   */
  isAuthenticated(): boolean {
    return this._isAuthenticated();
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Genera un token simulado (en producción debe venir del backend)
   */
  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'admin';
  }

  /**
   * Verifica si el usuario es cliente
   */
  isCliente(): boolean {
    const user = this.currentUser();
    return user?.role === 'cliente';
  }
}
