import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Appointment, AppointmentService } from '../../services/appointment';
import { PaymentRecord, PaymentService } from '../../services/payment';
import { PetService } from '../../services/pet';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  totalMascotas = 0;
  totalCitas = 0;
  citasProgramadas = 0;
  citasEnAtencion = 0;
  citasAtendidas = 0;
  pagosHoy = 0;
  montoHoy = 0;

  recientesCitas: Appointment[] = [];
  recientesPagos: Array<PaymentRecord & { appointment?: Appointment }> = [];
  pagoExpandidoId: string | null = null;

  constructor(
    private petService: PetService,
    private appointmentService: AppointmentService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const pets = this.petService.getAllPets();
    const citas = this.appointmentService.getAllAppointments();
    const pagos = this.paymentService.getAllPayments();

    this.totalMascotas = pets.length;
    this.totalCitas = citas.length;
    this.citasProgramadas = citas.filter(c => c.estado === 'Programada').length;
    this.citasEnAtencion = citas.filter(c => c.estado === 'En atención').length;
    this.citasAtendidas = citas.filter(c => c.estado === 'Atendida').length;

    const today = new Date().toISOString().slice(0, 10);
    const pagosHoy = pagos.filter(p => p.creadoEn.slice(0, 10) === today);
    this.pagosHoy = pagosHoy.length;
    this.montoHoy = pagosHoy.reduce((acc, p) => acc + p.monto, 0);

    this.recientesCitas = [...citas]
      .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
      .slice(0, 5);
    const citasById = new Map(citas.map(cita => [cita.id, cita]));
    this.recientesPagos = [...pagos]
      .sort((a, b) => b.creadoEn.localeCompare(a.creadoEn))
      .slice(0, 5)
      .map(pago => ({
        ...pago,
        appointment: citasById.get(pago.appointmentId),
      }));
  }

  irAtencion(): void {
    this.router.navigate(['/admin/atencion']);
  }

  irPagos(): void {
    this.router.navigate(['/admin/registrar-pago']);
  }

  irBuscarMascota(): void {
    this.router.navigate(['/admin/buscar-mascota']);
  }

  togglePagoDetalle(pagoId: string): void {
    this.pagoExpandidoId = this.pagoExpandidoId === pagoId ? null : pagoId;
  }
}
