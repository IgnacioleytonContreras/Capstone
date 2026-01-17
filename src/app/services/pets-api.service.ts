import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PetSearchResult {
  id: number;
  ficha: number;
  nombre: string;
  especie: string;
  dueno: string;
  dueno_email: string;
}

@Injectable({ providedIn: 'root' })
export class PetsApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  searchPets(q: string): Observable<PetSearchResult[]> {
    return this.http.get<PetSearchResult[]>(
      `${this.baseUrl}/pets/search?q=${encodeURIComponent(q)}`
    );
  }

  getPetById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/pets/${id}`);
  }
}
