import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios {
  servicios = [
    {
      icono: '🩺',
      titulo: 'Consulta General',
      descripcion: 'Exámenes físicos completos, diagnóstico y tratamiento de enfermedades comunes.',
      precio: 'Desde $25.000'
    },
    {
      icono: '💉',
      titulo: 'Vacunación',
      descripcion: 'Programa completo de vacunación para perros y gatos según su edad y necesidades.',
      precio: 'Desde $15.000'
    },
    {
      icono: '🔬',
      titulo: 'Laboratorio Clínico',
      descripcion: 'Análisis de sangre, orina, heces y otros exámenes de diagnóstico.',
      precio: 'Desde $20.000'
    },
    {
      icono: '🏥',
      titulo: 'Cirugías',
      descripcion: 'Cirugías generales, esterilización, castración y procedimientos especializados.',
      precio: 'Consultar'
    },
    {
      icono: '📷',
      titulo: 'Radiografía y Ecografía',
      descripcion: 'Diagnóstico por imágenes de alta calidad para un diagnóstico preciso.',
      precio: 'Desde $30.000'
    },
    {
      icono: '🦷',
      titulo: 'Odontología',
      descripcion: 'Limpieza dental, extracciones y tratamiento de problemas bucales.',
      precio: 'Desde $40.000'
    },
    {
      icono: '🛁',
      titulo: 'Peluquería y Estética',
      descripcion: 'Baños, cortes de pelo, limpieza de oídos y cuidado estético.',
      precio: 'Desde $20.000'
    },
    {
      icono: '🏥',
      titulo: 'Hospitalización',
      descripcion: 'Atención 24 horas para mascotas que requieren cuidados intensivos.',
      precio: 'Consultar'
    },
    {
      icono: '⚡',
      titulo: 'Urgencias 24 Horas',
      descripcion: 'Atención inmediata para emergencias veterinarias las 24 horas del día.',
      precio: 'Consultar'
    },
    {
      icono: '💊',
      titulo: 'Farmacia',
      descripcion: 'Medicamentos y productos veterinarios de calidad garantizada.',
      precio: 'Variado'
    },
    {
      icono: '🐾',
      titulo: 'Microchip',
      descripcion: 'Implantación de microchip para identificación permanente de tu mascota.',
      precio: '$15.000'
    },
    {
      icono: '❤️',
      titulo: 'Cardiología',
      descripcion: 'Evaluación cardíaca, electrocardiogramas y tratamiento de enfermedades del corazón.',
      precio: 'Consultar'
    }
  ];

  constructor(private router: Router) { }

  reservarHora(): void {
    this.router.navigate(['/reservatuhora']);
  }
}
