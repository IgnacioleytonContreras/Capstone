import { Injectable } from '@angular/core';

export interface InventoryItem {
  id: string;
  nombre: string;
  stock: number;
  stockMinimo: number;
  fechaVencimiento?: string; // YYYY-MM-DD
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly STORAGE_KEY = 'inventory_items';

  getAll(): InventoryItem[] {
    return this.loadAll();
  }

  addItem(item: Omit<InventoryItem, 'id'>): InventoryItem {
    const all = this.loadAll();
    const created: InventoryItem = {
      ...item,
      id: crypto.randomUUID(),
    };
    all.push(created);
    this.saveAll(all);
    return created;
  }

  deleteItem(id: string): void {
    const next = this.loadAll().filter(item => item.id !== id);
    this.saveAll(next);
  }

  getLowStockItems(): InventoryItem[] {
    return this.loadAll().filter(item => item.stock <= item.stockMinimo);
  }

  getExpiringSoonItems(days = 30): InventoryItem[] {
    const now = this.startOfDay(new Date());
    const limit = new Date(now);
    limit.setDate(limit.getDate() + days);
    return this.loadAll().filter(item => {
      if (!item.fechaVencimiento) return false;
      const date = this.endOfDay(this.parseLocalDate(item.fechaVencimiento));
      return date >= now && date <= limit;
    });
  }

  private loadAll(): InventoryItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as InventoryItem[];
      }
    } catch {
      // Ignore parse errors.
    }
    const seed: InventoryItem[] = [
      {
        id: 'inv-1',
        nombre: 'Vacuna antirrabica',
        stock: 3,
        stockMinimo: 5,
        fechaVencimiento: this.addDays(20),
      },
      {
        id: 'inv-2',
        nombre: 'Antiparasitario',
        stock: 12,
        stockMinimo: 10,
        fechaVencimiento: this.addDays(60),
      },
      {
        id: 'inv-3',
        nombre: 'Suero fisiologico',
        stock: 2,
        stockMinimo: 4,
        fechaVencimiento: this.addDays(10),
      },
    ];
    this.saveAll(seed);
    return seed;
  }

  private saveAll(items: InventoryItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private addDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  private startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  private endOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(23, 59, 59, 999);
    return copy;
  }

  private parseLocalDate(value: string): Date {
    const parts = value.split('-').map(Number);
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return new Date(year, month - 1, day);
    }
    return new Date(value);
  }
}
