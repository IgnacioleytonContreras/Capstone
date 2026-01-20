import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-urgencias',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './urgencias.html',
  styleUrls: ['./urgencias.css']
})
export class Urgencias {
  sintomasUrgentes = [
    {
      nombre: 'Dificultad para respirar',
      descripcion: 'Si notas jadeo excesivo, respiración ruidosa o encías azuladas, puede ser una emergencia respiratoria o cardíaca.'
    },
    {
      nombre: 'Vómitos o diarrea persistentes',
      descripcion: 'Más de 3 episodios en 24h o presencia de sangre pueden indicar parvovirus, obstrucciones o intoxicaciones graves.'
    },
    {
      nombre: 'Convulsiones',
      descripcion: 'Movimientos involuntarios o pérdida de control. Duran más de 5 minutos o son múltiples en corto tiempo.'
    },
    {
      nombre: 'Sangrado profuso',
      descripcion: 'Heridas que no dejan de sangrar tras 5 minutos de presión. Riesgo de shock hipovolémico.'
    },
    {
      nombre: 'Incapacidad para orinar',
      descripcion: 'Intentos fallidos de orinar, especialmente en gatos machos. Es una emergencia vital inmediata.'
    },
    {
      nombre: 'Ingesta de sustancias tóxicas',
      descripcion: 'Chocolate, veneno, medicamentos humanos o plantas tóxicas. Trae el envase o una muestra si es posible.'
    },
    {
      nombre: 'Traumatismos graves',
      descripcion: 'Atropellos, caídas de altura o peleas. Pueden haber lesiones internas no visibles.'
    },
    {
      nombre: 'Pérdida de consciencia',
      descripcion: 'No responde a estímulos. Mantén la vía aérea despejada y acude de inmediato.'
    },
    {
      nombre: 'Dolor intenso',
      descripcion: 'Vocalización, postura encorvada, agresividad repentina o rechazo al tacto.'
    },
    {
      nombre: 'Hinchazón abdominal',
      descripcion: 'Abdomen duro y distendido, intentos de vómito sin éxito. Puede ser torsión gástrica.'
    }
  ];

  constructor(private router: Router) { }

  llamarUrgencia(): void {
    window.location.href = 'tel:+56912345678';
  }

  irAUrgencias(): void {
    // Aquí se podría redirigir a una página de contacto o mostrar un mapa
    alert('Por favor, dirígete a nuestra clínica ubicada en Av. Principal 1234, Santiago');
  }
}
