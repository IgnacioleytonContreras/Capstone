import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomicilioRequest, DomicilioService } from '../../services/domicilio.service';
import { VetAvailabilityService } from '../../services/vet-availability.service';

@Component({
  selector: 'app-admin-domicilio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-domicilio.html',
  styleUrl: './admin-domicilio.css',
})
export class AdminDomicilio implements OnInit {
  solicitudes: DomicilioRequest[] = [];
  vetOptions: string[] = [];

  constructor(
    private domicilioService: DomicilioService,
    private availabilityService: VetAvailabilityService
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.vetOptions = Array.from(
      new Set(this.availabilityService.getAll().map(item => item.vetName))
    );
  }

  programar(solicitud: DomicilioRequest): void {
    if (!solicitud.vetName || !solicitud.scheduledAt) {
      return;
    }
    const updated: DomicilioRequest = {
      ...solicitud,
      estado: 'Programada',
    };
    this.domicilioService.updateRequest(updated);
    this.refresh();
  }

  private refresh(): void {
    this.solicitudes = this.domicilioService.getAll();
  }
}
