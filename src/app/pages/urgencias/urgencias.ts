import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-urgencias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './urgencias.html',
  styleUrl: './urgencias.css',
})
export class Urgencias {
  sintomasUrgentes = [
    'Dificultad para respirar',
    'Vómitos o diarrea persistentes',
    'Convulsiones',
    'Sangrado profuso',
    'Incapacidad para orinar',
    'Ingesta de sustancias tóxicas',
    'Traumatismos graves',
    'Pérdida de consciencia',
    'Dolor intenso',
    'Hinchazón abdominal'
  ];

  constructor(private router: Router) {}

  llamarUrgencia(): void {
    window.location.href = 'tel:+56912345678';
  }

  irAUrgencias(): void {
    // Aquí se podría redirigir a una página de contacto o mostrar un mapa
    alert('Por favor, dirígete a nuestra clínica ubicada en Av. Principal 1234, Santiago');
  }
}
