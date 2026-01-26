import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pet, PetService } from '../../services/pet';
import { Appointment, AppointmentService } from '../../services/appointment';
import { PaymentRecord, PaymentService } from '../../services/payment';

interface ClienteResumen {
  email: string;
  nombre: string;
}

@Component({
  selector: 'app-reporte-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-cliente.html',
  styleUrl: './reporte-cliente.css',
})
export class ReporteCliente implements OnInit {
  clientes: ClienteResumen[] = [];
  seleccionado = '';
  mascotas: Pet[] = [];
  citasAtendidas: Appointment[] = [];
  pagos: PaymentRecord[] = [];
  totalPagado = 0;
  generado = false;

  constructor(
    private petService: PetService,
    private appointmentService: AppointmentService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    const pets = this.petService.getAllPets();
    const appointments = this.appointmentService.getAllAppointments();
    const payments = this.paymentService.getAllPayments();
    const map = new Map<string, ClienteResumen>();

    pets.forEach(p => {
      map.set(p.ownerEmail, { email: p.ownerEmail, nombre: p.ownerName });
    });
    appointments.forEach(a => {
      if (!map.has(a.ownerEmail)) {
        map.set(a.ownerEmail, { email: a.ownerEmail, nombre: a.nombreDueno });
      }
    });
    payments.forEach(p => {
      if (!map.has(p.ownerEmail)) {
        map.set(p.ownerEmail, { email: p.ownerEmail, nombre: p.ownerName });
      }
    });

    this.clientes = Array.from(map.values()).sort((a, b) => a.email.localeCompare(b.email));
  }

  generar(): void {
    if (!this.seleccionado) {
      this.generado = false;
      return;
    }
    this.mascotas = this.petService.getPetsByOwnerEmail(this.seleccionado);
    this.citasAtendidas = this.appointmentService
      .getAppointmentsByOwnerEmail(this.seleccionado)
      .filter(c => c.estado === 'Atendida');
    this.pagos = this.paymentService.getPaymentsByOwnerEmail(this.seleccionado);
    this.totalPagado = this.pagos.reduce((acc, p) => acc + p.monto, 0);
    this.generado = true;
  }

  exportar(): void {
    window.print();
  }

  get clienteSeleccionado(): ClienteResumen | undefined {
    return this.clientes.find(c => c.email === this.seleccionado);
  }
}
