import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen = false;
  serviciosOpen = false;

  serviciosList = [
    'Consultas generales',
    'Consultas especialistas',
    'Controles',
    'Exámenes',
    'Vacunas',
    'Evaluación pre quirúrgica',
  ];

  constructor(private router: Router) {}

  closeMenu(): void {
    this.menuOpen = false;
    this.serviciosOpen = false;
  }

  toggleServicios(): void {
    this.serviciosOpen = !this.serviciosOpen;
  }

  reservarHora(): void {
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  irANosotros(): void {
    this.closeMenu();
    this.router.navigate(['/nosotros']);
  }

  irAUrgencias(): void {
    this.closeMenu();
    this.router.navigate(['/urgencias']);
  }

  irAServicios(): void {
    this.closeMenu();
    this.router.navigate(['/servicios']);
  }

  irAContacto(): void {
    this.closeMenu();
    this.router.navigate(['/contacto']);
  }

  irWhatsapp(): void {
    window.open('https://wa.me/56912345678', '_blank');
  }

  scrollTo(id: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.closeMenu();
    // If not on home page, navigate there first
    if (this.router.url !== '/' && !this.router.url.startsWith('/#')) {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollLogic(id), 100);
      });
    } else {
      this.scrollLogic(id);
    }
  }

  private scrollLogic(id: string): void {
     const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
