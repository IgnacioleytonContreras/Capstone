import { Injectable } from '@angular/core';

export interface VetAvailability {
  id: string;
  vetName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slots: number;
}

@Injectable({
  providedIn: 'root',
})
export class VetAvailabilityService {
  private readonly STORAGE_KEY = 'vet_availability';

  getAll(): VetAvailability[] {
    const items = this.loadAll();
    const { next, changed } = this.ensureCoverage(items);
    if (changed) {
      this.saveAll(next);
    }
    return next;
  }

  addAvailability(data: Omit<VetAvailability, 'id'>): VetAvailability {
    const all = this.loadAll();
    const created: VetAvailability = {
      ...data,
      id: crypto.randomUUID(),
    };
    all.push(created);
    this.saveAll(all);
    return created;
  }

  deleteAvailability(id: string): void {
    const next = this.loadAll().filter(item => item.id !== id);
    this.saveAll(next);
  }

  private loadAll(): VetAvailability[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as VetAvailability[];
      }
    } catch {
      // Ignore parse errors.
    }
    const seed = this.buildRandomAvailability();
    this.saveAll(seed);
    return seed;
  }

  private saveAll(items: VetAvailability[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private addDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  private buildRandomAvailability(): VetAvailability[] {
    const vets = [
      'Dr. Perez',
      'Dra. Maria Paz',
      'Dr. Jorge Soto',
      'Dra. Rojas',
      'Dr. Alejandro Silva',
      'Tec. Ana Torres',
    ];
    const ranges = [
      { start: '09:00', end: '12:00' },
      { start: '12:00', end: '15:00' },
      { start: '15:00', end: '18:00' },
    ];

    const items: VetAvailability[] = [];
    const dates = this.getAvailabilityDates();
    dates.forEach(date => {
      const count = this.randomInt(1, 3);
      const used = new Set<string>();
      for (let i = 0; i < count; i++) {
        const vet = this.pickRandom(vets, used);
        const range = ranges[this.randomInt(0, ranges.length - 1)];
        items.push({
          id: crypto.randomUUID(),
          vetName: vet,
          date,
          startTime: range.start,
          endTime: range.end,
          slots: this.randomInt(4, 10),
        });
      }
    });
    return items;
  }

  private ensureCoverage(items: VetAvailability[]): { next: VetAvailability[]; changed: boolean } {
    const dates = this.getAvailabilityDates();
    const byDate = new Map<string, VetAvailability[]>();
    items.forEach(item => {
      const list = byDate.get(item.date) ?? [];
      list.push(item);
      byDate.set(item.date, list);
    });

    let changed = false;
    const next = [...items];
    const vets = [
      'Dr. Perez',
      'Dra. Maria Paz',
      'Dr. Jorge Soto',
      'Dra. Rojas',
      'Dr. Alejandro Silva',
      'Tec. Ana Torres',
    ];
    const ranges = [
      { start: '09:00', end: '12:00' },
      { start: '12:00', end: '15:00' },
      { start: '15:00', end: '18:00' },
    ];

    dates.forEach(date => {
      if (byDate.has(date)) return;
      const count = this.randomInt(1, 3);
      const used = new Set<string>();
      for (let i = 0; i < count; i++) {
        const vet = this.pickRandom(vets, used);
        const range = ranges[this.randomInt(0, ranges.length - 1)];
        next.push({
          id: crypto.randomUUID(),
          vetName: vet,
          date,
          startTime: range.start,
          endTime: range.end,
          slots: this.randomInt(4, 10),
        });
      }
      changed = true;
    });

    return { next, changed };
  }

  private getAvailabilityDates(): string[] {
    const today = this.startOfDay(new Date());
    const nowMonth = today.getMonth();
    const nowYear = today.getFullYear();
    const targetYear = nowMonth <= 1 ? nowYear : nowYear + 1;
    const endDate = new Date(targetYear, 1, 28);
    const dates: string[] = [];
    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(this.formatDate(d));
    }
    return dates;
  }

  private pickRandom(list: string[], used: Set<string>): string {
    const available = list.filter(name => !used.has(name));
    const choice = available.length ? available : list;
    const value = choice[Math.floor(Math.random() * choice.length)];
    used.add(value);
    return value;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
