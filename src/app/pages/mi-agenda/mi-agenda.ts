import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Appointment, AppointmentService, ConsultationRecord } from '../../services/appointment';
import { PaymentRecord, PaymentService } from '../../services/payment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mi-agenda',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mi-agenda.html',
  styleUrl: './mi-agenda.css',
})
export class MiAgenda implements OnInit {
  citas: Appointment[] = [];
  pagos: PaymentRecord[] = [];
  historial: ConsultationRecord[] = [];
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.citas = this.appointmentService.getAppointmentsByOwnerEmail(user.email);
    this.pagos = this.paymentService.getPaymentsByOwnerEmail(user.email);
    this.historial = this.appointmentService.getConsultationsByOwnerEmail(user.email);
  }

  agendar(): void {
    this.router.navigate(['/cliente/agendar-cita']);
  }
}
