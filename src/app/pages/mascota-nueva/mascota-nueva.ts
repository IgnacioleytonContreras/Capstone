import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PetService, PetSex } from '../../services/pet';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mascota-nueva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './mascota-nueva.html',
  styleUrl: './mascota-nueva.css',
})
export class MascotaNueva {
  form: FormGroup;
  sexOptions: PetSex[] = ['Macho', 'Hembra'];
  submitted = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      especie: ['', [Validators.required, Validators.maxLength(50)]],
      raza: ['', [Validators.required, Validators.maxLength(50)]],
      sexo: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      pesoKg: [null, [Validators.required, Validators.min(0.1)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';

    if (this.form.invalid) {
      // HU-03: mostrar mensajes de validación cuando hay campos obligatorios en blanco
      Object.values(this.form.controls).forEach(control => control.markAsTouched());
      return;
    }

    const owner = this.authService.currentUser();
    if (!owner) {
      this.router.navigate(['/login']);
      return;
    }

    const value = this.form.value;

    this.petService.createPet(
      {
        nombre: value.nombre,
        especie: value.especie,
        raza: value.raza,
        sexo: value.sexo,
        fechaNacimiento: value.fechaNacimiento,
        pesoKg: Number(value.pesoKg),
      },
      owner
    );

    // HU-03: mascota creada y asociada al cliente
    this.successMessage = 'Mascota registrada correctamente.';

    // limpiar formulario para nuevo registro
    this.form.reset();
    this.submitted = false;

    // opcional: redirigir al listado
    this.router.navigate(['/cliente/mis-mascotas']);
  }
}
