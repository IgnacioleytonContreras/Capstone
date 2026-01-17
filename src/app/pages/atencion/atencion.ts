import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Appointment, AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-atencion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './atencion.html',
  styleUrl: './atencion.css',
})
export class Atencion implements OnInit {
  citas: Appointment[] = [];
  cita?: Appointment;
  selectedCitaId = '';
  form: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      diagnostico: ['', [Validators.required, Validators.maxLength(500)]],
      tratamiento: ['', [Validators.required, Validators.maxLength(500)]],
      observaciones: ['', [Validators.maxLength(800)]],
      controlFecha: [''],
      monto: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.citas = this.appointmentService.getAllAppointments();
    const citaId = this.route.snapshot.paramMap.get('citaId');
    if (citaId) {
      this.selectedCitaId = citaId;
      this.selectCita(citaId);
    }
  }

  get f() {
    return this.form.controls;
  }

  selectCita(id: string): void {
    this.selectedCitaId = id;
    const found = this.appointmentService.getAppointmentById(id);
    if (!found) {
      this.errorMessage = 'No se encontró la cita.';
      return;
    }
    this.cita = found;
    this.errorMessage = '';
    this.successMessage = '';
    if (this.cita.estado === 'Programada') {
      this.marcarEnAtencion();
    }
  }

  marcarEnAtencion(): void {
    if (!this.cita) return;
    this.cita.estado = 'En atención';
    this.appointmentService.updateAppointment(this.cita);
  }

  guardarConsulta(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.cita) {
      this.errorMessage = 'Selecciona una cita.';
      return;
    }

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => control.markAsTouched());
      return;
    }

    const value = this.form.value;

    this.appointmentService.addConsultation({
      appointmentId: this.cita.id,
      nombreMascota: this.cita.nombreMascota,
      ownerEmail: this.cita.ownerEmail,
      diagnostico: value.diagnostico.trim(),
      tratamiento: value.tratamiento.trim(),
      observaciones: value.observaciones?.trim() ?? '',
      controlFecha: value.controlFecha || undefined,
    });

    this.cita.estado = 'Atendida';
    this.cita.monto = this.parseMonto(value.monto);
    this.appointmentService.updateAppointment(this.cita);

    this.successMessage = 'Consulta registrada y cita marcada como Atendida.';
    this.form.reset();
    this.submitted = false;
  }

  volver(): void {
    this.router.navigate(['/admin']);
  }

  formatMonto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.form.get('monto')?.setValue(formatted, { emitEvent: false });
  }

  private parseMonto(value: string): number {
    const digits = value.replace(/\./g, '').replace(/\D/g, '');
    return Number(digits || 0);
  }
}
