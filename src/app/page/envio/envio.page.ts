import { Component, OnInit } from '@angular/core';
import { EmailService } from 'src/app/service/EmailService/email-service.service';
import { SupabaseService } from 'src/app/service/supabase/supabase.service';

@Component({
  selector: 'app-envio',
  templateUrl: './envio.page.html',
  styleUrls: ['./envio.page.scss'],
})
export class EnvioPage implements OnInit {
  destinatarios: any[] = [];
  campaignName: string = '';
  messageContent: string = '';
  errores: string[] = [];

  constructor(private supabaseService: SupabaseService, private emailService: EmailService) {}

  ngOnInit() {
    this.cargarDestinatarios();
  }

  cargarDestinatarios(): void {
    this.supabaseService.getDestinatarios().subscribe({
      next: (response) => {
        console.log('Respuesta de Supabase:', response);
        this.destinatarios = response.body || [];
        console.log('Destinatarios cargados:', this.destinatarios);
      },
      error: (error) => console.error('Error al obtener destinatarios:', error)
    });
  }

  async enviarCampania(): Promise<void> {
    const subject = `Campaña: ${this.campaignName}`;
    this.errores = [];

    for (const destinatario of this.destinatarios) {
      if (!destinatario.correo) {
        console.error(`El correo de ${destinatario.nombre} está vacío.`);
        this.errores.push(`El correo de ${destinatario.nombre} está vacío.`);
        continue;
      }

      // Construir el mensaje con un saludo personalizado
      const personalizedMessage = `Hola ${destinatario.nombre},\n\n${this.messageContent}`;

      // Suscribirse al servicio de envío de correo
      this.emailService.sendEmail(destinatario.correo, subject, personalizedMessage).subscribe({
        next: (response) => {
          console.log(`Correo enviado a ${destinatario.nombre}:`, response);
        },
        error: (error) => {
          console.error(`Error al enviar correo a ${destinatario.nombre}:`, error);
          const formattedError = this.formatError(destinatario.nombre, error);
          this.errores.push(formattedError);
        }
      });
    }

    if (this.errores.length > 0) {
      console.log('Errores al enviar correos:', this.errores);
    }
  }


  private formatError(destinatarioNombre: string, error: any): string {
    let errorMessage: string;

    if (typeof error === 'object' && error !== null && 'text' in error) {
      errorMessage = `Error al enviar correo a ${destinatarioNombre}: ${error.text}`;
    } else {
      errorMessage = `Error desconocido al enviar correo a ${destinatarioNombre}.`;
    }

    return errorMessage;
  }
}
