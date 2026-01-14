import { Component } from '@angular/core';
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
export class DashboardComponent {
  menuOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  // ✅ cierra el menú (para móvil)
  closeMenu(): void {
    this.menuOpen = false;
  }

  // ✅ navega al login de clientes
  irIngresoClientes(): void {
    this.closeMenu();
    this.router.navigate(['/clientes-login']); // asegúrate de tener esta ruta
  }

  // ✅ botón "RESERVA TU HORA"
  reservarHora(): void {
    this.closeMenu();
    // Redirige a la página de reserva tu hora
    this.router.navigate(['/reservatuhora']);
  }

  // ✅ scroll suave a secciones (#inicio, #servicios, etc.)
  scrollTo(id: string): void {
    this.closeMenu();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ✅ navegación a páginas
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

  // ✅ cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ✅ Navegar a área de cliente
  irACliente(): void {
    this.router.navigate(['/cliente']);
  }

  // ✅ Navegar a área de administrador
  irAAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
