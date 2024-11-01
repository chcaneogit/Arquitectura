import { Component, OnInit } from '@angular/core';
import { EmailService } from 'src/app/service/emailService/email-service.service';
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

    // Crea la campaña
    this.supabaseService.createCampanha(this.campaignName, this.messageContent, 0, 0).subscribe({
      next: (response) => {
        console.log('Campaña creada:', response.body);

        // Enviar correos después de que la campaña ha sido creada
        this.enviarCorreos(subject).then(({ enviados, noEnviados }) => {
          // Actualizar la campaña con los totales de enviados y no enviados
          this.supabaseService.updateCampanha(this.campaignName, enviados, noEnviados).subscribe({
            next: (updateResponse) => {
              console.log('Campaña actualizada con totales de envíos:', updateResponse.body);
            },
            error: (error) => {
              console.error('Error al actualizar la campaña:', error);
              this.errores.push('Error al actualizar la campaña con los totales de envíos.');
            }
          });

          // Crear el reporte
          this.supabaseService.createReporte(this.campaignName, enviados, noEnviados).subscribe({
            next: (reporteResponse) => {
              console.log('Reporte creado:', reporteResponse.body);
            },
            error: (error) => {
              console.error('Error al crear el reporte:', error);
              this.errores.push('Error al crear el reporte. Intenta nuevamente.');
            }
          });
        });
      },
      error: (error) => {
        console.error('Error al crear la campaña:', error);
        this.errores.push('Error al crear la campaña. Intenta nuevamente.');
      }
    });
  }


  private async enviarCorreos(subject: string): Promise<{ enviados: number, noEnviados: number }> {
    let totalEnviados = 0;
    let totalNoEnviados = 0;

    const promises = this.destinatarios.map(async (destinatario) => {
      if (destinatario.no_molestar) {
        console.log(`No se enviará correo a ${destinatario.nombre} porque no molestar es TRUE.`);
        totalNoEnviados++;
        return;
      }

      if (!destinatario.correo) {
        console.error(`El correo de ${destinatario.nombre} está vacío.`);
        this.errores.push(`El correo de ${destinatario.nombre} está vacío.`);
        totalNoEnviados++;
        return;
      }

      const personalizedMessage = `Hola ${destinatario.nombre},\n\n${this.messageContent}`;

      try {
        await this.emailService.sendEmail(destinatario.correo, subject, personalizedMessage).toPromise();
        console.log(`Correo enviado a ${destinatario.nombre}`);
        totalEnviados++;
      } catch (error) {
        const errorMessage = this.formatError(destinatario.nombre, error);
        console.error(errorMessage);
        this.errores.push(errorMessage);
        totalNoEnviados++;
      }
    });

    await Promise.all(promises);

    console.log(`Total de correos enviados: ${totalEnviados}`);
    console.log(`Total de correos no enviados: ${totalNoEnviados}`);

    return { enviados: totalEnviados, noEnviados: totalNoEnviados };
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
