import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reserva-tu-hora',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reservatuhora.html',
  styleUrl: './reservatuhora.css'
})
export class ReservaTuHora {
  currentStep = 1;
  selectedTab = 'consulta';
  successMessage = '';
  emailError = '';
  
  // Datos del formulario
  tipoConsulta = '';
  fecha = '';
  hora = '';
  nombreMascota = '';
  tipoMascota = '';
  nombreDueno = '';
  telefono = '';
  email = '';

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  async submitReserva(): Promise<void> {
    this.successMessage = '';
    this.emailError = '';

    if (!this.fecha || !this.hora || !this.nombreDueno || !this.email) {
      this.emailError = 'Completa fecha, hora, nombre y email para confirmar.';
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/appointments/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerEmail: this.email.trim().toLowerCase(),
          ownerName: this.nombreDueno.trim(),
          telefono: this.telefono?.trim(),
          nombreMascota: this.nombreMascota?.trim(),
          especie: this.tipoMascota,
          servicio: this.selectedTab,
          fecha: this.fecha,
          hora: this.hora,
          notas: '',
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.error ? String(payload.error) : 'No se pudo enviar el correo.';
        throw new Error(message);
      }

      this.successMessage = 'Reserva confirmada. Se envió un correo de confirmación.';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo enviar el correo.';
      this.emailError = `La reserva se guardó, pero no se pudo enviar el correo. ${message}`;
    }
  }
}

