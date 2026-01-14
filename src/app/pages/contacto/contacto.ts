import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  contactoForm = {
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  };

  enviarMensaje(): void {
    // Aquí iría la lógica para enviar el mensaje
    console.log('Mensaje enviado:', this.contactoForm);
    alert('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
    // Limpiar formulario
    this.contactoForm = {
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: ''
    };
  }
}
