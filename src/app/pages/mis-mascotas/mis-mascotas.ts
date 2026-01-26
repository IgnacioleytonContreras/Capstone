import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Pet, PetService } from '../../services/pet';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mis-mascotas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mis-mascotas.html',
  styleUrl: './mis-mascotas.css',
})
export class MisMascotas implements OnInit {
  mascotas: Pet[] = [];

  constructor(
    private petService: PetService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // HU-03: listado de mascotas asociadas al cliente
    this.mascotas = this.petService.getPetsByOwnerEmail(user.email);
  }

  irRegistrarMascota(): void {
    this.router.navigate(['/cliente/mascota-nueva']);
  }

  verDetalle(mascota: Pet): void {
    this.router.navigate(['/cliente/mascota-detalle', mascota.id]);
  }
}
