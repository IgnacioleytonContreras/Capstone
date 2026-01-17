import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppointmentService } from '../../services/appointment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './agendar-cita.html',
  styleUrl: './agendar-cita.css',
})
export class AgendarCita {
  form: FormGroup;
  submitted = false;
  successMessage = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nombreDueno: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      nombreMascota: ['', [Validators.required, Validators.maxLength(50)]],
      especie: ['', [Validators.required, Validators.maxLength(50)]],
      servicio: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      notas: [''],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => control.markAsTouched());
      return;
    }

    const value = this.form.value;
    const user = this.authService.currentUser();
    const ownerEmail = user?.email ?? value.email;

    this.appointmentService.createAppointment({
      nombreDueno: value.nombreDueno.trim(),
      ownerEmail: ownerEmail.trim().toLowerCase(),
      telefono: value.telefono.trim(),
      nombreMascota: value.nombreMascota.trim(),
      especie: value.especie.trim(),
      servicio: value.servicio,
      fecha: value.fecha,
      hora: value.hora,
      notas: value.notas?.trim(),
    });

    this.successMessage = 'Cita agendada correctamente.';
    this.form.reset();
    this.submitted = false;
  }

  volver(): void {
    this.router.navigate(['/cliente/mi-agenda']);
  }

}
