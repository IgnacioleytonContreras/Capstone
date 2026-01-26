import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DomicilioRequest, DomicilioService } from '../../services/domicilio.service';

@Component({
  selector: 'app-mi-domicilio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mi-domicilio.html',
  styleUrl: './mi-domicilio.css',
})
export class MiDomicilio implements OnInit {
  solicitudes: DomicilioRequest[] = [];

  constructor(
    private authService: AuthService,
    private domicilioService: DomicilioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.solicitudes = this.domicilioService.getByOwnerEmail(user.email);
  }
}
