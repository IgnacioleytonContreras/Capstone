import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Pet, PetService } from '../../services/pet';
import { PetsApiService, PetDetailRow } from '../../services/pets-api.service';
import { AppointmentService, ConsultationRecord } from '../../services/appointment';

@Component({
  selector: 'app-mascota-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mascota-detalle.html',
  styleUrls: ['./mascota-detalle.css'],
})
export class MascotaDetalle implements OnInit {
  mascota?: PetDetailRow;
  historial: ConsultationRecord[] = [];
  loading = true;
  errorMsg = '';
  backPath = '/admin/buscar-mascota';
  photoUrl: string | null = null;

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
    if (!idParam) {
      this.router.navigate([this.backPath]);
      return;
    }
    const numericId = Number(idParam);

    this.loading = true;
    this.errorMsg = '';

    if (Number.isNaN(numericId)) {
      this.loadFromLocal(idParam);
      return;
    }

    this.api.getById(numericId).subscribe({
      next: (data) => {
        this.setMascota(data);
        this.loading = false;
      },
      error: () => {
        this.loadFromLocal(idParam);
      },
    });
  }

  volver(): void {
    this.router.navigate([this.backPath]);
  }

  private setMascota(mascota: PetDetailRow): void {
    this.mascota = mascota;
    this.historial = this.appointmentService.getConsultationsByPet(
      mascota.nombre,
      mascota.dueno_email
    );
    this.photoUrl = this.petService.getPhoto(mascota.id);
  }

  private loadFromLocal(id: string): void {
    const found = this.petService.getAllPets().find(p => p.id === id);
    if (!found) {
      this.loading = false;
      this.errorMsg = 'No se pudo cargar la mascota.';
      return;
    }
    this.setMascota(this.mapPetToRow(found));
    this.loading = false;
  }

  onPhotoSelected(event: Event): void {
    const mascota = this.mascota;
    if (!mascota) return;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      if (!dataUrl) return;
      this.petService.setPhoto(mascota.id, dataUrl);
      this.photoUrl = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  private mapPetToRow(pet: Pet): PetDetailRow {
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
