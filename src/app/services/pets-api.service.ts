import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';

export interface PetSearchRow {
  id: number | string;
  ficha: number;
  nombre: string;
  especie: string;
  dueno: string;
  dueno_email: string;
}

export interface PetDetailRow extends PetSearchRow {
  raza: string | null;
  sexo: string;
  fecha_nacimiento: string | null;
  peso_kg: number | null;
}

export interface CreatePetDto {
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  fecha_nacimiento?: string;
  peso_kg?: number;
  owner_email?: string;
  // Fallbacks para APIs con nombres distintos
  fechaNacimiento?: string;
  pesoKg?: number;
  ownerEmail?: string;
}

@Injectable({ providedIn: 'root' })
export class PetsApiService {
  constructor(private http: HttpClient) {}

  search(q: string): Observable<PetSearchRow[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<PetSearchRow[]>(`${API_URL}/pets/search`, { params });
  }

  getById(id: number): Observable<PetDetailRow> {
    return this.http.get<PetDetailRow>(`${API_URL}/pets/${id}`);
  }

  create(dto: CreatePetDto): Observable<{ ok: boolean; id: number }> {
    return this.http.post<{ ok: boolean; id: number }>(`${API_URL}/pets`, dto);
  }
}
