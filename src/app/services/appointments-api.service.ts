import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { API_URL } from './api.config';

export interface CreateAppointmentDto {
  ownerEmail: string;
  petName: string;
  date: string;
  time: string;
  petId?: number | null;
  branchName?: string | null;
  doctorName?: string | null;
}

export interface AppointmentResponse {
  ok: boolean;
  id: number;
  message?: string;
}

export interface SendEmailDto {
  ownerEmail: string;
  ownerName: string;
  telefono?: string;
  nombreMascota: string;
  especie?: string;
  servicio?: string;
  fecha: string;
  hora: string;
  notas?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentsApiService {
  private baseUrl = API_URL;

  constructor(private http: HttpClient) {
    console.log('🔧 AppointmentsApiService inicializado con baseUrl:', this.baseUrl);
  }

  createAppointment(dto: CreateAppointmentDto): Observable<AppointmentResponse> {
    const url = `${this.baseUrl}/appointments`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log('📤 POST', url, dto);

    return this.http.post<AppointmentResponse>(url, dto, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en createAppointment:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error,
          message: error.message
        });

        // Si el error es "Cannot GET", significa que el backend está recibiendo GET en lugar de POST
        if (error.error && typeof error.error === 'string' && error.error.includes('Cannot GET')) {
          return throwError(() => ({
            message: 'Error: El servidor está recibiendo GET en lugar de POST. Verifica la configuración del backend.',
            status: error.status,
            error: error.error
          }));
        }

        // Otros errores
        let errorMessage = 'Error al agendar la cita';
        if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica que la API esté corriendo en http://localhost:3000';
        } else if (error.status === 409) {
          errorMessage = 'Horario ocupado';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        return throwError(() => ({
          message: errorMessage,
          status: error.status || 0,
          error: error.error
        }));
      })
    );
  }

  sendAppointmentEmail(dto: SendEmailDto): Observable<{ ok: boolean }> {
    // El servidor de correo está en el puerto 3001 (según server/index.js)
    const url = 'http://localhost:3001/api/appointments/notify';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log('📧 POST (enviar correo)', url, dto);

    return this.http.post<{ ok: boolean }>(url, dto, { headers }).pipe(
      timeout(15000), // Timeout de 15 segundos
      catchError((error: HttpErrorResponse | any) => {
        console.error('❌ Error enviando correo:', error);

        // Manejar timeout
        if ((error as any).name === 'TimeoutError' || error.message?.includes('timeout')) {
          return throwError(() => ({
            message: 'Tiempo de espera agotado. Verifica que la API esté corriendo.',
            status: 0,
            name: 'TimeoutError'
          }));
        }

        // Manejar errores HTTP
        const httpError = error as HttpErrorResponse;
        console.error('❌ Error HTTP:', {
          status: httpError.status,
          statusText: httpError.statusText,
          url: httpError.url,
          error: httpError.error,
          message: httpError.message
        });

        let errorMessage = 'Error al enviar el correo';
        if (httpError.status === 0 || !httpError.status) {
          errorMessage = 'No se pudo conectar con el servidor de correo. Verifica que la API esté corriendo en http://localhost:3001';
        } else if (httpError.error?.error) {
          errorMessage = httpError.error.error;
        } else if (httpError.error?.message) {
          errorMessage = httpError.error.message;
        }

        return throwError(() => ({
          message: errorMessage,
          status: httpError.status || 0,
          error: httpError.error
        }));
      })
    );
  }
}
