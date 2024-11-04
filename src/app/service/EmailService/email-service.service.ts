import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // Define la URL según el entorno
  private apiUrl: string;

  constructor(private http: HttpClient) {
    // Determina la IP a usar
    this.apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '192.168.0.3'
                  ? 'http://192.168.0.3:8080'
                  : 'http://181.73.104.66:8080'; // Cambia esto por tu IP pública
  }

  // Método para enviar correos electrónicos
  sendEmail(to: string, subject: string, content: string) {
    const payload = { to, subject, text: content };
    return this.http.post(`${this.apiUrl}/send-email`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.handleSendGridError(error);
        return throwError(errorMessage);
      })
    );
  }

  // Método para enviar SMS
  sendSms(to: string, message: string) {
    const payload = { to, message };
    return this.http.post(`${this.apiUrl}/send-sms`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.handleTwilioError(error);
        return throwError(errorMessage);
      })
    );
  }

  private handleSendGridError(error: HttpErrorResponse): string {
    if (error.error && error.error.errors) {
      return error.error.errors.map((err: any) => `${err.message}`).join(', ');
    } else {
      return `Error desconocido: ${error.message}`;
    }
  }

  private handleTwilioError(error: HttpErrorResponse): string {
    if (error.error && error.error.message) {
      return `Error de Twilio: ${error.error.message}`;
    } else {
      return `Error desconocido: ${error.message}`;
    }
  }
}
