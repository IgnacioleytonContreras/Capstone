import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Appointment, AppointmentService } from '../../services/appointment';
import { PaymentMethod, PaymentRecord, PaymentService } from '../../services/payment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registrar-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './registrar-pago.html',
  styleUrl: './registrar-pago.css',
})
export class RegistrarPago implements OnInit {
  form: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  citas: Appointment[] = [];
  pagos: PaymentRecord[] = [];
  filtroEmail = '';
  metodos: PaymentMethod[] = ['efectivo', 'debito', 'credito', 'transferencia'];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      citaId: ['', [Validators.required]],
      metodo: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.citas = this.appointmentService.getAllAppointments().filter(c => c.estado === 'Atendida');
    this.pagos = this.paymentService.getAllPayments();

    const citaId = this.route.snapshot.paramMap.get('citaId');
    if (citaId) {
      this.form.patchValue({ citaId });
    }
  }

  get f() {
    return this.form.controls;
  }

  registrarPago(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => control.markAsTouched());
      return;
    }

    const { citaId, metodo } = this.form.value;
    const cita = this.appointmentService.getAppointmentById(citaId);
    if (!cita || cita.monto === undefined) {
      this.errorMessage = 'La cita seleccionada no tiene monto asociado.';
      return;
    }

    const user = this.authService.currentUser();
    const creadoPor = user?.email ?? 'recepcion';

    const payment = this.paymentService.createPayment({
      appointmentId: cita.id,
      ownerEmail: cita.ownerEmail,
      ownerName: cita.nombreDueno,
      monto: cita.monto,
      metodo: metodo as PaymentMethod,
      creadoPor,
    });

    this.pagos = this.paymentService.getAllPayments();
    this.successMessage = 'Pago registrado correctamente.';
    this.form.reset();
    this.submitted = false;
  }

  get pagosFiltrados(): PaymentRecord[] {
    const texto = this.filtroEmail.trim().toLowerCase();
    if (!texto) {
      return this.pagos;
    }
    return this.pagos.filter(p => p.ownerEmail.toLowerCase().includes(texto));
  }

  generarComprobante(pago: PaymentRecord): void {
    const contenido = `
      <html>
        <head><title>Comprobante de Pago</title></head>
        <body>
          <h2>Comprobante de Pago</h2>
          <p><strong>Cliente:</strong> ${pago.ownerName} (${pago.ownerEmail})</p>
          <p><strong>Monto:</strong> $${pago.monto}</p>
          <p><strong>Método:</strong> ${pago.metodo}</p>
          <p><strong>Fecha:</strong> ${new Date(pago.creadoEn).toLocaleString()}</p>
          <p><strong>Registrado por:</strong> ${pago.creadoPor}</p>
          <hr />
          <small>Veterinaria Zift</small>
          <script>window.print()</script>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(contenido);
      win.document.close();
    }
  }

  volver(): void {
    this.router.navigate(['/admin']);
  }
}
