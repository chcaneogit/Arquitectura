import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/send-email'; // Ruta del servidor

  constructor(private http: HttpClient) {}

  sendEmail(toEmail: string, subject: string, message: string) {
    const emailData = {
      to: toEmail,
      subject: subject,
      text: message,
    };

    return this.http.post(this.apiUrl, emailData);
  }
}
