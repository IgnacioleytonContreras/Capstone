import { Injectable } from '@angular/core';

export type AppointmentStatus = 'Programada' | 'En atención' | 'Atendida';

export interface Appointment {
  id: string;
  nombreDueno: string;
  ownerEmail: string;
  telefono: string;
  nombreMascota: string;
  especie: string;
  servicio: string;
  fecha: string;
  hora: string;
  notas?: string;
  estado: AppointmentStatus;
  monto?: number;
  creadoEn: string;
}

export interface ConsultationRecord {
  id: string;
  appointmentId: string;
  nombreMascota: string;
  ownerEmail: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  controlFecha?: string;
  creadoEn: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly STORAGE_KEY = 'appointments';
  private readonly CONSULT_KEY = 'consultations';

  createAppointment(data: Omit<Appointment, 'id' | 'estado' | 'creadoEn'>): Appointment {
    const all = this.loadAll();
    const appointment: Appointment = {
      ...data,
      id: crypto.randomUUID(),
      estado: 'Programada',
      creadoEn: new Date().toISOString(),
    };
    all.push(appointment);
    this.saveAll(all);
    return appointment;
  }

  getAllAppointments(): Appointment[] {
    return this.loadAll();
  }

  getAppointmentsByOwnerEmail(ownerEmail: string): Appointment[] {
    const normalized = this.normalizeEmail(ownerEmail);
    return this.loadAll().filter(a => this.normalizeEmail(a.ownerEmail) === normalized);
  }

  getAppointmentById(id: string): Appointment | undefined {
    return this.loadAll().find(a => a.id === id);
  }

  updateAppointment(updated: Appointment): void {
    const all = this.loadAll();
    const next = all.map(a => (a.id === updated.id ? updated : a));
    this.saveAll(next);
  }

  deleteAppointment(id: string): void {
    const next = this.loadAll().filter(a => a.id !== id);
    this.saveAll(next);
  }

  addConsultation(record: Omit<ConsultationRecord, 'id' | 'creadoEn'>): ConsultationRecord {
    const all = this.loadConsultations();
    const created: ConsultationRecord = {
      ...record,
      id: crypto.randomUUID(),
      creadoEn: new Date().toISOString(),
    };
    all.push(created);
    this.saveConsultations(all);
    return created;
  }

  getAllConsultations(): ConsultationRecord[] {
    return this.loadConsultations();
  }

  getConsultationsByOwnerEmail(ownerEmail: string): ConsultationRecord[] {
    const normalized = this.normalizeEmail(ownerEmail);
    return this.loadConsultations().filter(c => this.normalizeEmail(c.ownerEmail) === normalized);
  }

  getConsultationsByPet(nombreMascota: string, ownerEmail: string): ConsultationRecord[] {
    const normalized = this.normalizeEmail(ownerEmail);
    return this.loadConsultations().filter(
      c =>
        c.nombreMascota.toLowerCase() === nombreMascota.toLowerCase() &&
        this.normalizeEmail(c.ownerEmail) === normalized
    );
  }

  deleteConsultation(id: string): void {
    const next = this.loadConsultations().filter(c => c.id !== id);
    this.saveConsultations(next);
  }

  deleteConsultationsByAppointment(appointmentId: string): void {
    const next = this.loadConsultations().filter(c => c.appointmentId !== appointmentId);
    this.saveConsultations(next);
  }

  private loadAll(): Appointment[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Appointment[]) : [];
    } catch {
      return [];
    }
  }

  private saveAll(items: Appointment[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private loadConsultations(): ConsultationRecord[] {
    try {
      const raw = localStorage.getItem(this.CONSULT_KEY);
      return raw ? (JSON.parse(raw) as ConsultationRecord[]) : [];
    } catch {
      return [];
    }
  }

  private saveConsultations(items: ConsultationRecord[]): void {
    localStorage.setItem(this.CONSULT_KEY, JSON.stringify(items));
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
