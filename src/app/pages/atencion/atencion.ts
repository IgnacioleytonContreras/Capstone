import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Appointment, AppointmentService, ConsultationRecord } from '../../services/appointment';
import { PaymentService } from '../../services/payment';

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
  consultas: ConsultationRecord[] = [];
  form: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
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
    this.cargarConsultas();
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

  getConsultaPorCita(id: string): ConsultationRecord | undefined {
    return this.consultas.find(consulta => consulta.appointmentId === id);
  }

  eliminarConsultaDeCita(consulta: ConsultationRecord, event: Event): void {
    event.stopPropagation();
    this.eliminarConsulta(consulta);
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
    this.cargarConsultas();
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

  eliminarConsulta(consulta: ConsultationRecord): void {
    if (!confirm('¿Eliminar esta atención médica?')) return;
    this.appointmentService.deleteConsultation(consulta.id);
    this.cargarConsultas();
    this.successMessage = 'Atención médica eliminada.';
    this.errorMessage = '';
  }

  eliminarCita(cita: Appointment): void {
    if (!confirm('¿Eliminar esta cita y sus registros asociados?')) return;
    this.appointmentService.deleteAppointment(cita.id);
    this.appointmentService.deleteConsultationsByAppointment(cita.id);
    this.paymentService.deletePaymentsByAppointment(cita.id);
    this.citas = this.appointmentService.getAllAppointments();
    this.cargarConsultas();
    if (this.selectedCitaId === cita.id) {
      this.selectedCitaId = '';
      this.cita = undefined;
      this.form.reset();
    }
    this.successMessage = 'Cita eliminada.';
    this.errorMessage = '';
  }

  getCita(id: string): Appointment | undefined {
    return this.citas.find(cita => cita.id === id);
  }

  private cargarConsultas(): void {
    this.consultas = this.appointmentService
      .getAllConsultations()
      .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));
  }

  private parseMonto(value: string): number {
    const digits = value.replace(/\./g, '').replace(/\D/g, '');
    return Number(digits || 0);
  }
}
