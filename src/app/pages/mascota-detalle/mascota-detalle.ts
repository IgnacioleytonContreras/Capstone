import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Pet, PetService } from '../../services/pet';
import { PetsApiService } from '../../services/pets-api.service';
import { AppointmentService, ConsultationRecord } from '../../services/appointment';

interface MascotaDetalleRow {
  id: string | number;
  ficha: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fecha_nacimiento: string;
  peso_kg: number;
  dueno: string;
  dueno_email: string;
}

@Component({
  selector: 'app-mascota-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mascota-detalle.html',
  styleUrls: ['./mascota-detalle.css'],
})
export class MascotaDetalle implements OnInit {
  mascota?: MascotaDetalleRow;
  historial: ConsultationRecord[] = [];
  loading = true;
  errorMsg = '';
  backPath = '/admin/buscar-mascota';

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private api: PetsApiService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ decide el "volver" según si estás en /cliente o /admin
    const isCliente = this.router.url.startsWith('/cliente');
    this.backPath = isCliente
      ? '/cliente/mis-mascotas'
      : '/admin/buscar-mascota';

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ?? '';

    if (!idParam) {
      this.router.navigate([this.backPath]);
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    if (isCliente) {
      const found = this.petService.getAllPets().find(p => p.id === id);
      if (!found) {
        this.loading = false;
        this.errorMsg = 'No se encontró la mascota.';
        return;
      }

      this.setMascota(this.mapPetToRow(found));
      this.loading = false;
      return;
    }

    const idNumber = Number(idParam);
    if (Number.isNaN(idNumber)) {
      const found = this.petService.getAllPets().find(p => p.id === id);
      if (!found) {
        this.loading = false;
        this.errorMsg = 'No se encontró la mascota.';
        return;
      }

      this.setMascota(this.mapPetToRow(found));
      this.loading = false;
      return;
    }

    // ✅ trae desde MySQL vía API (admin)
    this.api.getPetById(idNumber).subscribe({
      next: (data) => {
        this.setMascota(data as MascotaDetalleRow);
        this.loading = false;
      },
      error: () => {
        // fallback a local si la API no responde
        const found = this.petService.getAllPets().find(p => p.id === id);
        if (found) {
          this.setMascota(this.mapPetToRow(found));
          this.loading = false;
          return;
        }

        this.loading = false;
        this.errorMsg = 'No se pudo cargar la mascota.';
      },
    });
  }

  volver(): void {
    this.router.navigate([this.backPath]);
  }

  private setMascota(mascota: MascotaDetalleRow): void {
    this.mascota = mascota;
    this.historial = this.appointmentService.getConsultationsByPet(
      mascota.nombre,
      mascota.dueno_email
    );
  }

  private mapPetToRow(pet: Pet): MascotaDetalleRow {
    return {
      id: pet.id,
      ficha: pet.ficha,
      nombre: pet.nombre,
      especie: pet.especie,
      raza: pet.raza,
      sexo: pet.sexo,
      fecha_nacimiento: pet.fechaNacimiento,
      peso_kg: pet.pesoKg,
      dueno: pet.ownerName,
      dueno_email: pet.ownerEmail,
    };
  }
}
