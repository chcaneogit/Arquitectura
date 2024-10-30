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
    this.errores = [];
    const subject = `Campaña: ${this.campaignName}`;

    // Crear campaña y asignar valores iniciales para los totales
    this.supabaseService.createCampanha(this.campaignName, this.messageContent, 0, 0).subscribe({
      next: (response) => {
        console.log('Campaña creada:', response.body);
        this.enviarCorreos(subject); // Llama a la función para enviar correos después de crear la campaña
      },
      error: (error) => {
        console.error('Error al crear la campaña:', error);
        this.errores.push('Error al crear la campaña. Intenta nuevamente.');
      }
    });
  }

  private enviarCorreos(subject: string): void {
    let totalEnviados = 0;
    let totalNoEnviados = 0;

    for (const destinatario of this.destinatarios) {
      if (destinatario.no_molestar) {
        console.log(`No se enviará correo a ${destinatario.nombre} porque no molestar es TRUE.`);
        totalNoEnviados++;
        continue;
      }

      if (!destinatario.correo) {
        console.error(`El correo de ${destinatario.nombre} está vacío.`);
        this.errores.push(`El correo de ${destinatario.nombre} está vacío.`);
        continue;
      }

      const personalizedMessage = `Hola ${destinatario.nombre},\n\n${this.messageContent}`;

      this.emailService.sendEmail(destinatario.correo, subject, personalizedMessage).subscribe({
        next: (response) => {
          console.log(`Correo enviado a ${destinatario.nombre}:`, response);
          totalEnviados++;
        },
        error: (error) => {
          console.error(`Error al enviar correo a ${destinatario.nombre}:`, error);
          this.errores.push(`Error al enviar correo a ${destinatario.nombre}: ${error}`);
        }
      });
    }

    console.log(`Total de correos enviados: ${totalEnviados}`);
    console.log(`Total de correos no enviados: ${totalNoEnviados}`);
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
