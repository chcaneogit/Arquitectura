import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrlEmail = 'http://localhost:3000/send-email';  // Ruta para correos
  private apiUrlSms = 'http://localhost:3000/send-sms'; // Ruta para SMS

  constructor(private http: HttpClient) {}

  // Método para enviar correos electrónicos
  sendEmail(to: string, subject: string, content: string) {
    const payload = { to, subject, text: content };
    return this.http.post(this.apiUrlEmail, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.handleSendGridError(error);
        return throwError(errorMessage);
      })
    );
  }

  // Método para enviar SMS
  sendSms(to: string, message: string) {
    const payload = { to, message };
    return this.http.post(this.apiUrlSms, payload).pipe(
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
