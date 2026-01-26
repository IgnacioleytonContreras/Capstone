import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VetAvailability, VetAvailabilityService } from '../../services/vet-availability.service';

@Component({
  selector: 'app-disponibilidad-veterinarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disponibilidad-veterinarios.html',
  styleUrl: './disponibilidad-veterinarios.css',
})
export class DisponibilidadVeterinarios implements OnInit {
  items: VetAvailability[] = [];
  errorMessage = '';

  vetName = '';
  date = '';
  startTime = '';
  endTime = '';
  slots: number | null = null;

  constructor(private availabilityService: VetAvailabilityService) {}

  ngOnInit(): void {
    this.refresh();
  }

  agregarDisponibilidad(): void {
    this.errorMessage = '';

    if (!this.vetName.trim() || !this.date || !this.startTime || !this.endTime || this.slots === null) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }

    if (this.slots <= 0) {
      this.errorMessage = 'Los cupos deben ser mayores a 0.';
      return;
    }

    this.availabilityService.addAvailability({
      vetName: this.vetName.trim(),
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      slots: Number(this.slots),
    });

    this.vetName = '';
    this.date = '';
    this.startTime = '';
    this.endTime = '';
    this.slots = null;
    this.refresh();
  }

  eliminarDisponibilidad(item: VetAvailability): void {
    if (!confirm('¿Eliminar esta disponibilidad?')) return;
    this.availabilityService.deleteAvailability(item.id);
    this.refresh();
  }

  private refresh(): void {
    this.items = this.availabilityService.getAll();
  }
}
