import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment';
import { AppointmentsApiService } from '../../services/appointments-api.service';
import { VetAvailability, VetAvailabilityService } from '../../services/vet-availability.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agendar-cita.html',
  styleUrl: './agendar-cita.css',
})
export class AgendarCita implements OnInit {
  ownerName = '';
  ownerEmail = '';
  telefono = '';
  petName = '';
  especie = '';
  servicio = '';
  doctorName = '';
  date = '';
  time = '';
  notas = '';
  disponibilidades: VetAvailability[] = [];

  loading = false;
  okMsg = '';
  errorMsg = '';

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private availabilityService: VetAvailabilityService,
    private appointmentsApi: AppointmentsApiService
  ) {}

  ngOnInit(): void {
    this.disponibilidades = this.availabilityService.getAll();
  }

  get disponibilidadesFiltradas(): VetAvailability[] {
    let items = this.disponibilidades;
    if (this.date) {
      items = items.filter(item => item.date === this.date);
    }
    if (this.time) {
      items = items.filter(item => this.isTimeWithinRange(this.time, item.startTime, item.endTime));
    }
    return items;
  }

  private isTimeWithinRange(value: string, start: string, end: string): boolean {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };
    const minutes = toMinutes(value);
    return minutes >= toMinutes(start) && minutes <= toMinutes(end);
  }

  agendar(): void {
    this.okMsg = '';
    this.errorMsg = '';

    if (!this.ownerEmail || !this.petName || !this.date || !this.time) {
      this.errorMsg = 'Completa Email, Nombre mascota, Fecha y Hora.';
      return;
    }

    if (this.servicio === 'domicilio') {
      this.router.navigate(['/cliente/atencion-domicilio']);
      return;
    }

    this.loading = true;

    try {
      this.persistLocalAppointment();
    } catch (error) {
      console.error('❌ Error guardando localmente:', error);
      this.loading = false;
      this.errorMsg = 'No se pudo guardar la cita localmente.';
      return;
    }

    const emailPayload = {
      ownerEmail: this.ownerEmail.trim().toLowerCase(),
      ownerName: this.ownerName?.trim() || 'Cliente',
      telefono: this.telefono?.trim() || '',
      nombreMascota: this.petName.trim(),
      especie: this.especie?.trim() || '',
      servicio: this.servicio || 'Consulta',
      doctorName: this.doctorName?.trim() || '',
      fecha: this.date,
      hora: this.time,
      notas: this.notas?.trim() || '',
    };

    this.appointmentsApi
      .sendAppointmentEmail(emailPayload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.okMsg = 'Cita agendada y correo enviado.';
          this.ownerName = '';
          this.ownerEmail = '';
          this.telefono = '';
          this.petName = '';
          this.especie = '';
          this.servicio = '';
          this.doctorName = '';
          this.date = '';
          this.time = '';
          this.notas = '';
        },
        error: (err: { message?: string }) => {
          this.errorMsg = `Cita guardada. ${err?.message || 'No se pudo enviar el correo.'}`;
        },
      });
  }

  volver(): void {
    this.router.navigate(['/cliente/mi-agenda']);
  }

  private persistLocalAppointment() {
    return this.appointmentService.createAppointment({
      nombreDueno: this.ownerName?.trim() || 'Sin nombre',
      ownerEmail: this.ownerEmail.trim().toLowerCase(),
      telefono: this.telefono?.trim() || '',
      nombreMascota: this.petName.trim(),
      especie: this.especie?.trim() || '',
      servicio: this.servicio || 'consulta',
      fecha: this.date,
      hora: this.time,
      notas: this.notas?.trim() || '',
    });
  }
}
