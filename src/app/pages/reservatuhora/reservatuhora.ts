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

  submitReserva(): void {
    // Aquí iría la lógica para enviar la reserva
    console.log('Reserva enviada:', {
      tipoConsulta: this.selectedTab,
      fecha: this.fecha,
      hora: this.hora,
      nombreMascota: this.nombreMascota,
      tipoMascota: this.tipoMascota,
      nombreDueno: this.nombreDueno,
      telefono: this.telefono,
      email: this.email
    });
    alert('¡Reserva enviada exitosamente!');
  }
}

