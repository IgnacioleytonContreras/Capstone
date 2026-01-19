import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  menuOpen = false;
  serviciosOpen = false;
  year = new Date().getFullYear();

  serviciosList = [
    'Consultas generales',
    'Consultas especialistas',
    'Controles',
    'Exámenes',
    'Vacunas',
    'Evaluación pre quirúrgica',
  ];

  heroImages = [
    'assets/images/pexels-tima-miroshnichenko-6234610.jpg',
    'assets/images/pexels-tima-miroshnichenko-6235007.jpg',
    'assets/images/pexels-tahir-33998172.jpg',
  ];
  currentHeroIndex = 0;
  private heroIntervalId?: number;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.startHeroCarousel();
  }

  ngOnDestroy(): void {
    if (this.heroIntervalId) {
      window.clearInterval(this.heroIntervalId);
    }
  }

  private startHeroCarousel(): void {
    if (this.heroImages.length <= 1) {
      return;
    }
    this.heroIntervalId = window.setInterval(() => {
      this.nextHero();
    }, 5000);
  }

  prevHero(): void {
    if (this.heroImages.length === 0) {
      return;
    }
    this.currentHeroIndex =
      (this.currentHeroIndex - 1 + this.heroImages.length) % this.heroImages.length;
  }

  nextHero(): void {
    if (this.heroImages.length === 0) {
      return;
    }
    this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroImages.length;
  }

  goToHero(index: number): void {
    if (index < 0 || index >= this.heroImages.length) {
      return;
    }
    this.currentHeroIndex = index;
  }

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

  irIngresoClientes(): void {
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  scrollTo(id: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.closeMenu();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
}
