import { Injectable } from '@angular/core';

export type PaymentMethod = 'efectivo' | 'debito' | 'credito' | 'transferencia';

export interface PaymentRecord {
  id: string;
  appointmentId: string;
  ownerEmail: string;
  ownerName: string;
  monto: number;
  metodo: PaymentMethod;
  creadoEn: string;
  creadoPor: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly STORAGE_KEY = 'payments';

  createPayment(data: Omit<PaymentRecord, 'id' | 'creadoEn'>): PaymentRecord {
    const all = this.loadAll();
    const payment: PaymentRecord = {
      ...data,
      id: crypto.randomUUID(),
      creadoEn: new Date().toISOString(),
    };
    all.push(payment);
    this.saveAll(all);
    return payment;
  }

  getAllPayments(): PaymentRecord[] {
    return this.loadAll();
  }

  getPaymentsByOwnerEmail(ownerEmail: string): PaymentRecord[] {
    const normalized = this.normalizeEmail(ownerEmail);
    return this.loadAll().filter(p => this.normalizeEmail(p.ownerEmail) === normalized);
  }

  deletePaymentsByAppointment(appointmentId: string): void {
    const next = this.loadAll().filter(p => p.appointmentId !== appointmentId);
    this.saveAll(next);
  }

  private loadAll(): PaymentRecord[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PaymentRecord[]) : [];
    } catch {
      return [];
    }
  }

  private saveAll(items: PaymentRecord[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
