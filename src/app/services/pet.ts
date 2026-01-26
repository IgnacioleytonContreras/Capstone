import { Injectable } from '@angular/core';
import { User } from './auth.service';

export type PetSex = 'Macho' | 'Hembra';

export interface Pet {
  id: string;            // UUID
  ficha: number;         // Nº ficha incremental
  ownerId: string;       // cliente id/email
  ownerName: string;     // nombre dueño
  ownerEmail: string;

  nombre: string;
  especie: string;
  raza: string;
  sexo: PetSex;
  fechaNacimiento: string; // YYYY-MM-DD
  pesoKg: number;

  creadoEn: string;
}

interface CreatePetDto {
  nombre: string;
  especie: string;
  raza: string;
  sexo: PetSex;
  fechaNacimiento: string;
  pesoKg: number;
}

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly STORAGE_KEY = 'pets';
  private readonly FICHA_SEQ_KEY = 'pets_ficha_seq';
  private readonly PHOTO_KEY = 'pet_photos';

  /**
   * Crea una nueva mascota asociada al cliente.
   */
  createPet(data: CreatePetDto, owner: User): Pet {
    const all = this.loadAll();
    const ownerEmail = this.normalizeEmail(owner.email);
    const ownerName = owner.name ? this.normalizeText(owner.name) : ownerEmail;

    const newPet: Pet = {
      id: crypto.randomUUID(),
      ficha: this.nextFicha(),
      ownerId: ownerEmail,
      ownerName: ownerName,
      ownerEmail: ownerEmail,
      nombre: this.normalizeText(data.nombre),
      especie: this.normalizeText(data.especie),
      raza: this.normalizeText(data.raza),
      sexo: data.sexo,
      fechaNacimiento: data.fechaNacimiento,
      pesoKg: data.pesoKg,
      creadoEn: new Date().toISOString(),
    };

    all.push(newPet);
    this.saveAll(all);

    return newPet;
  }

  /**
   * Devuelve las mascotas asociadas al cliente autenticado.
   */
  getPetsByOwnerEmail(ownerEmail: string): Pet[] {
    const normalized = this.normalizeEmail(ownerEmail);
    return this.loadAll().filter(p => this.normalizeEmail(p.ownerEmail) === normalized);
  }

  /**
   * Devuelve todas las mascotas (para búsquedas globales).
   */
  getAllPets(): Pet[] {
    return this.loadAll();
  }

  /**
   * Elimina una mascota por id.
   */
  deletePetById(id: string): void {
    const all = this.loadAll();
    const next = all.filter(p => p.id !== id);
    this.saveAll(next);
  }

  getPhoto(petId: string | number): string | null {
    const map = this.loadPhotoMap();
    return map[`${petId}`] ?? null;
  }

  setPhoto(petId: string | number, dataUrl: string): void {
    const map = this.loadPhotoMap();
    map[`${petId}`] = dataUrl;
    localStorage.setItem(this.PHOTO_KEY, JSON.stringify(map));
  }

  // Helpers de almacenamiento ---------------------------------

  private loadAll(): Pet[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Pet[]) : [];
    } catch {
      return [];
    }
  }

  private saveAll(pets: Pet[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pets));
  }

  private nextFicha(): number {
    const current = Number(localStorage.getItem(this.FICHA_SEQ_KEY) ?? '0');
    const next = current + 1;
    localStorage.setItem(this.FICHA_SEQ_KEY, String(next));
    return next;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private loadPhotoMap(): Record<string, string> {
    try {
      const raw = localStorage.getItem(this.PHOTO_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  }

  private normalizeText(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }
}
