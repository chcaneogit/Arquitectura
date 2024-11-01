import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/send-email';  // Cambia a tu servidor local

  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, content: string) {
    const payload = { to, subject, text: content };

    return this.http.post(this.apiUrl, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = this.handleSendGridError(error);
        return throwError(errorMessage); // Enviar el mensaje de error formateado
      })
    );
  }

  private handleSendGridError(error: HttpErrorResponse): string {
    if (error.error && error.error.errors) {
      // SendGrid suele enviar los errores en un arreglo de 'errors'
      return error.error.errors.map((err: any) => `${err.message}`).join(', ');
    } else {
      return `Error desconocido: ${error.message}`;
    }
  }
}
