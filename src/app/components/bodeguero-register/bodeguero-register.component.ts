import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bodeguero-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './bodeguero-register.component.html',
  styleUrl: './bodeguero-register.component.css',
})
export class BodegueroRegisterComponent {
  registerForm: FormGroup;
  registerMessage = signal<string | null>(null);
  registerError = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  registrarBodeguero(): void {
    this.registerMessage.set(null);
    this.registerError.set(null);

    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    const { password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.registerError.set('Las contraseñas no coinciden.');
      return;
    }

    const ok = this.authService.registerBodeguero(password);
    if (!ok) {
      this.registerError.set('No se pudo registrar al bodeguero.');
      return;
    }

    this.registerMessage.set('Bodeguero registrado: bodeguero@gmail.com');
    this.registerForm.reset();
  }

  volver(): void {
    this.router.navigate(['/admin-login']);
  }

  get bodegueroEmail() {
    return this.authService.getBodegueroEmail();
  }

  get regPassword() {
    return this.registerForm.get('password');
  }

  get regConfirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
