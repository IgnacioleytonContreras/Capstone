import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.currentUser();
      if (user?.role === 'admin' || user?.role === 'bodeguero') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/cliente']);
      }
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).then((success) => {
        this.isLoading.set(false);
        if (success) {
          const user = this.authService.currentUser();
          if (user?.role === 'admin' || user?.role === 'bodeguero') {
            this.router.navigate(['/admin']);
          } else {
            // Si no es admin, mostrar error y cerrar sesión
            this.authService.logout();
            this.errorMessage.set('Este usuario no tiene acceso de administrador ni bodeguero.');
          }
        } else {
          this.errorMessage.set('Credenciales inválidas. Por favor, intente nuevamente.');
        }
      }).catch(() => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al iniciar sesión. Por favor, intente más tarde.');
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  irRegistroBodeguero(): void {
    this.router.navigate(['/admin-register-bodeguero']);
  }
}

