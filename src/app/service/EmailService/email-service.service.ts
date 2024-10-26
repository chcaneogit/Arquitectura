import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com'; // Asegúrate de importar EmailJS
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private userId = environment.emailjsUserId;
  private serviceId = environment.emailjsServiceId;
  private templateId = environment.emailjsTemplateId;

  constructor() {
    emailjs.init(this.userId); // Inicializa EmailJS
  }

  sendEmail(toEmail: string, subject: string, message: string): Promise<any> {
    const emailParams = {
      to_email: toEmail,
      subject: subject,
      message: message
    };

    return new Promise((resolve, reject) => {
      emailjs.send(this.serviceId, this.templateId, emailParams)
        .then((response: any) => {
          console.log('Correo enviado con éxito:', response);
          resolve(response);
        })
        .catch((error: any) => {
          console.error('Error al enviar el correo:', error);
          reject(error);
        });
    });
  }
}
