import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PetService } from '../../services/pet';

interface PetSearchResult {
  id: string;
  ficha: number;
  nombre: string;
  especie: string;
  dueno: string;
  dueno_email: string;
}

type SearchField = 'nombre' | 'dueno' | 'ficha';

@Component({
  selector: 'app-buscar-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './buscar-mascota.html',
  styleUrls: ['./buscar-mascota.css'],
})
export class BuscarMascota {
  criterio = '';
  campo: SearchField = 'nombre';

  resultados: PetSearchResult[] = [];
  buscado = false;
  loading = false;
  errorMsg = '';

  constructor(private petService: PetService, private router: Router) {}

  buscar(): void {
    const texto = this.criterio.trim();
    this.buscado = true;
    this.errorMsg = '';
    this.loading = true;

    const all = this.petService.getAllPets();
    const rows: PetSearchResult[] = all.map(p => ({
      id: p.id,
      ficha: p.ficha,
      nombre: p.nombre,
      especie: p.especie,
      dueno: p.ownerName,
      dueno_email: p.ownerEmail,
    }));

    if (!texto) {
      this.resultados = rows;
      this.loading = false;
      return;
    }

    const t = texto.toLowerCase();
    this.resultados = rows.filter(p => {
      if (this.campo === 'nombre') return (p.nombre || '').toLowerCase().includes(t);
      if (this.campo === 'dueno') {
        return ((p.dueno || '').toLowerCase().includes(t) || (p.dueno_email || '').toLowerCase().includes(t));
      }
      return String(p.ficha ?? '').includes(texto);
    });

    this.loading = false;
  }

  verDetalle(pet: PetSearchResult): void {
    // OJO: si tu ruta real es /admin/mascota-detalle/:id, cámbiala aquí
    this.router.navigate(['/admin/mascota-detalle', pet.id]);
  }

  eliminar(pet: PetSearchResult, event: Event): void {
    event.stopPropagation();
    const confirmado = confirm(`¿Eliminar la ficha de ${pet.nombre} (#${pet.ficha})?`);
    if (!confirmado) {
      return;
    }

    this.petService.deletePetById(pet.id);
    this.buscar();
  }
}
