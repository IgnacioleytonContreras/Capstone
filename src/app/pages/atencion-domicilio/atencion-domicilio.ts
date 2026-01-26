import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DomicilioService } from '../../services/domicilio.service';

@Component({
  selector: 'app-atencion-domicilio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './atencion-domicilio.html',
  styleUrl: './atencion-domicilio.css',
})
export class AtencionDomicilio {
  direccion = '';
  rangoHorario = '';
  motivo = '';
  successMessage = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private domicilioService: DomicilioService,
    private router: Router
  ) {}

  enviar(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.direccion.trim() || !this.rangoHorario.trim() || !this.motivo.trim()) {
      this.errorMessage = 'Completa dirección, rango horario y motivo.';
      return;
    }

    this.domicilioService.createRequest({
      ownerEmail: user.email,
      ownerName: user.name ?? user.email,
      direccion: this.direccion.trim(),
      rangoHorario: this.rangoHorario.trim(),
      motivo: this.motivo.trim(),
    });

    this.successMessage = 'Solicitud enviada. Estado: Pendiente.';
    this.direccion = '';
    this.rangoHorario = '';
    this.motivo = '';
  }
}
