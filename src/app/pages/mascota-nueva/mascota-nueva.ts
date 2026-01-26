import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PetService, PetSex } from '../../services/pet';
import { AuthService } from '../../services/auth.service';
import { PetsApiService } from '../../services/pets-api.service';

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
  especieOptions = ['Perro', 'Gato'];
  catBreeds = ['Siamés', 'British Shorthair', 'Esfinge'];
  submitted = false;
  successMessage = '';
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private authService: AuthService,
    private petsApi: PetsApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      especie: ['', [Validators.required, Validators.maxLength(50)]],
      raza: [
        '',
        [Validators.required, Validators.maxLength(50), this.catBreedValidator.bind(this)],
      ],
      sexo: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      pesoKg: [null, [Validators.required, Validators.min(0.1)]],
    });

    this.form.get('especie')?.valueChanges.subscribe(() => {
      this.form.get('raza')?.updateValueAndValidity();
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

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

    this.loading = true;

    const payload = {
      nombre: value.nombre,
      especie: value.especie,
      raza: value.raza,
      sexo: value.sexo,
      fecha_nacimiento: value.fechaNacimiento,
      peso_kg: Number(value.pesoKg),
      owner_email: owner.email,
      // Fallbacks por si la API espera otros nombres
      fechaNacimiento: value.fechaNacimiento,
      pesoKg: Number(value.pesoKg),
      ownerEmail: owner.email,
    };

    this.petsApi.create(payload).subscribe({
      next: () => {
        this.persistLocal(owner, value);
        this.successMessage = 'Mascota registrada correctamente.';
        this.finish();
      },
      error: (err) => {
        // Fallback local para no bloquear el registro
        this.persistLocal(owner, value);
        this.errorMessage = err?.error?.message || '';
        this.finish(false);
      },
    });
  }

  private persistLocal(owner: { email: string; name?: string }, value: any): void {
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
  }

  private finish(navigate = true): void {
    this.loading = false;
    this.form.reset();
    this.submitted = false;
    if (navigate) {
      this.router.navigate(['/cliente/mis-mascotas']);
    }
  }

  private catBreedValidator(control: import('@angular/forms').AbstractControl) {
    const especie = this.form?.get('especie')?.value;
    const raza = String(control.value ?? '').trim();
    if (!raza) {
      return null;
    }
    const normalized = this.normalizeText(raza);
    const catBreeds = this.catBreeds.map(b => this.normalizeText(b));
    if (especie === 'Gato') {
      return catBreeds.includes(normalized) ? null : { catBreedInvalid: true };
    }
    if (especie === 'Perro') {
      return catBreeds.includes(normalized) ? { dogBreedInvalid: true } : null;
    }
    return null;
  }

  private normalizeText(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
