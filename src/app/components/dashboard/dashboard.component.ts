import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  year = new Date().getFullYear();

  serviciosList = [
    'Consultas generales',
    'Consultas especialistas',
    'Controles',
    'Exámenes',
    'Vacunas',
    'Evaluación pre quirúrgica',
  ];

  detailedServices = [
    {
      title: 'Consultas Generales',
      doctor: 'Dr. Alejandro Silva',
      description: 'Atención integral para tu mascota, desde chequeos rutinarios hasta diagnósticos complejos. Nuestro equipo está preparado para cuidar de su salud.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 0 0 5 2h14a.3.3 0 0 0 .2.3l4 15a.3.3 0 0 0 .3.3v4a.3.3 0 0 0-.3.3H.8a.3.3 0 0 0-.3-.3v-4a.3.3 0 0 0 .3-.3l4-15Z"/><path d="M12 12v6"/><path d="M9 15h6"/></svg>'
    },
    {
      title: 'Cirugías',
      doctor: 'Dra. María Paz',
      description: 'Quirófano equipado con tecnología de punta. Realizamos cirugías de tejidos blandos, traumatología y esterilizaciones con la máxima seguridad.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
    },
    {
      title: 'Vacunación',
      doctor: 'Dr. Jorge Soto',
      description: 'Protege a tu compañero con nuestro plan de vacunación completo. Utilizamos biológicos de alta calidad certificada.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>'
    },
    {
      title: 'Laboratorio',
      doctor: 'Tec. Ana Torres',
      description: 'Resultados rápidos y precisos en hematología, bioquímica y urianálisis para un diagnóstico certero en el momento.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
    }
  ];

  heroImages = [
    'assets/images/pexels-tima-miroshnichenko-6234610.jpg',
    'assets/images/pexels-tima-miroshnichenko-6235007.jpg',
    'assets/images/pexels-tahir-33998172.jpg',
  ];
  currentHeroIndex = 0;
  private heroIntervalId?: number;

  constructor(public authService: AuthService, private router: Router) { }

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

  reservarHora(): void {
    this.router.navigate(['/login']);
  }

  irIngresoClientes(): void {
    this.router.navigate(['/login']);
  }

  irAUrgencias(): void {
    this.router.navigate(['/urgencias']);
  }

  irAServicios(): void {
    this.router.navigate(['/servicios']);
  }

  irWhatsapp(): void {
    window.open('https://wa.me/56912345678', '_blank');
  }
}
