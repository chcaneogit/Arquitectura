import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private sendgridApiUrl = 'https://api.sendgrid.com/v3/mail/send';
  private apiKey = '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';

  constructor(private http: HttpClient) {}

  sendEmail(to: string, subject: string, content: string) {
    const payload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'tu_correo@tudominio.com' },
      subject: subject,
      content: [{ type: 'text/plain', value: content }]
    };

    return this.http.post(this.sendgridApiUrl, payload, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    }).pipe(
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
