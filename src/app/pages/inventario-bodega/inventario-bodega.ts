import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryItem, InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventario-bodega',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario-bodega.html',
  styleUrl: './inventario-bodega.css',
})
export class InventarioBodega implements OnInit {
  items: InventoryItem[] = [];
  lowStock: InventoryItem[] = [];
  expiringSoon: InventoryItem[] = [];
  hasAlerts = false;
  errorMessage = '';

  nombre = '';
  stock: number | null = null;
  stockMinimo: number | null = null;
  fechaVencimiento = '';

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.refresh();
  }

  agregarItem(): void {
    this.errorMessage = '';
    if (!this.nombre.trim() || this.stock === null || this.stockMinimo === null) {
      this.errorMessage = 'Completa nombre, stock y stock mínimo.';
      return;
    }

    this.inventoryService.addItem({
      nombre: this.nombre.trim(),
      stock: Number(this.stock),
      stockMinimo: Number(this.stockMinimo),
      fechaVencimiento: this.fechaVencimiento || undefined,
    });

    this.nombre = '';
    this.stock = null;
    this.stockMinimo = null;
    this.fechaVencimiento = '';
    this.refresh();
  }

  eliminarItem(item: InventoryItem): void {
    if (!confirm('¿Eliminar este producto del inventario?')) return;
    this.inventoryService.deleteItem(item.id);
    this.refresh();
  }

  private refresh(): void {
    this.items = this.inventoryService.getAll();
    this.lowStock = this.inventoryService.getLowStockItems();
    this.expiringSoon = this.inventoryService.getExpiringSoonItems(30);
    this.hasAlerts = this.lowStock.length > 0 || this.expiringSoon.length > 0;
  }
}
