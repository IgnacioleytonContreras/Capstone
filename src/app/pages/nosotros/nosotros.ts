import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.css',
})
export class Nosotros {
  equipo = [
    {
      nombre: 'Dr. Carlos Méndez',
      cargo: 'Veterinario Jefe',
      especialidad: 'Cirugía y Traumatología',
      imagen: '👨‍⚕️'
    },
    {
      nombre: 'Dra. María González',
      cargo: 'Veterinaria',
      especialidad: 'Medicina Interna',
      imagen: '👩‍⚕️'
    },
    {
      nombre: 'Dr. Juan Pérez',
      cargo: 'Veterinario',
      especialidad: 'Dermatología',
      imagen: '👨‍⚕️'
    },
    {
      nombre: 'Dra. Ana Silva',
      cargo: 'Veterinaria',
      especialidad: 'Cardiología',
      imagen: '👩‍⚕️'
    }
  ];
}
