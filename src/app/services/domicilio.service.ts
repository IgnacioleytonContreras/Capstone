import { Injectable } from '@angular/core';

export type DomicilioStatus = 'Pendiente' | 'Programada';

export interface DomicilioRequest {
  id: string;
  ownerEmail: string;
  ownerName: string;
  direccion: string;
  rangoHorario: string;
  motivo: string;
  estado: DomicilioStatus;
  vetName?: string;
  scheduledAt?: string; // YYYY-MM-DD HH:mm
  creadoEn: string;
}

@Injectable({
  providedIn: 'root',
})
export class DomicilioService {
  private readonly STORAGE_KEY = 'domicilio_requests';

  createRequest(data: Omit<DomicilioRequest, 'id' | 'estado' | 'creadoEn'>): DomicilioRequest {
    const all = this.loadAll();
    const created: DomicilioRequest = {
      ...data,
      id: crypto.randomUUID(),
      estado: 'Pendiente',
      creadoEn: new Date().toISOString(),
    };
    all.push(created);
    this.saveAll(all);
    return created;
  }

  updateRequest(updated: DomicilioRequest): void {
    const all = this.loadAll();
    const next = all.map(item => (item.id === updated.id ? updated : item));
    this.saveAll(next);
  }

  getAll(): DomicilioRequest[] {
    return this.loadAll();
  }

  getByOwnerEmail(ownerEmail: string): DomicilioRequest[] {
    const normalized = ownerEmail.trim().toLowerCase();
    return this.loadAll().filter(r => r.ownerEmail.toLowerCase() === normalized);
  }

  private loadAll(): DomicilioRequest[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as DomicilioRequest[]) : [];
    } catch {
      return [];
    }
  }

  private saveAll(items: DomicilioRequest[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}
