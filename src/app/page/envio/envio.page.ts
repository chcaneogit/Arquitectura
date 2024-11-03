import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/service/emailService/email-service.service';
import { SupabaseService } from 'src/app/service/supabase/supabase.service';
import { AlertController } from '@ionic/angular';

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

  constructor(
    private supabaseService: SupabaseService,
    private emailService: EmailService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarDestinatarios();
  }

  cargarDestinatarios(): void {
    this.supabaseService.getDestinatarios().subscribe({
      next: (response) => {
        this.destinatarios = response.body || [];
        console.log('Destinatarios cargados:', this.destinatarios);
      },
      error: (error) => console.error('Error al obtener destinatarios:', error)
    });
  }

  async enviarCampania(): Promise<void> {
    this.errores = [];
    const subject = `Campaña: ${this.campaignName}`;

    // Inicializar contadores para SMS y correos
    let totalEnviados = 0;
    let totalNoEnviados = 0;
    let totalEnviadosSMS = 0;
    let totalNoEnviadosSMS = 0;

    // Crear campaña inicial
    this.supabaseService.createCampanha(this.campaignName, this.messageContent, totalEnviados, totalNoEnviados, totalEnviadosSMS, totalNoEnviadosSMS).subscribe({
      next: async () => {
        // Enviar mensajes y obtener totales
        const resultados = await this.enviarMensajes(subject);
        totalEnviados = resultados.enviados;
        totalNoEnviados = resultados.noEnviados;
        totalEnviadosSMS = resultados.enviadosSMS;
        totalNoEnviadosSMS = resultados.noEnviadosSMS;

        console.log('Resultados de envío:', resultados);

        // Actualizar campaña con los totales
        this.supabaseService.updateCampanha(this.campaignName, totalEnviados, totalNoEnviados, totalEnviadosSMS, totalNoEnviadosSMS).subscribe({
          next: () => {
            // Crear reporte con los totales
            this.supabaseService.createReporte(this.campaignName, totalEnviados, totalNoEnviados, totalEnviadosSMS, totalNoEnviadosSMS).subscribe({
              next: () => {
                this.mostrarAlert();
                this.limpiarCampos();
              },
              error: () => this.errores.push('Error al crear el reporte. Intenta nuevamente.')
            });
          },
          error: () => this.errores.push('Error al actualizar la campaña con los totales de envíos.'),
        });
      },
      error: () => this.errores.push('Error al crear la campaña. Intenta nuevamente.')
    });
  }

  private async enviarMensajes(subject: string): Promise<{ enviados: number, noEnviados: number, enviadosSMS: number, noEnviadosSMS: number }> {
    let totalEnviados = 0;
    let totalNoEnviados = 0;
    let totalEnviadosSMS = 0;
    let totalNoEnviadosSMS = 0;

    const promises = this.destinatarios.map(async (destinatario) => {
      // Comprobar si el destinatario ha solicitado no recibir mensajes
      if (destinatario.no_molestar) {
        this.errores.push(`No se puede enviar correo ni SMS a ${destinatario.nombre}, ha solicitado no recibir mensajes.`);
        totalNoEnviados++;
        totalNoEnviadosSMS++;
        return; // Salir de la función para este destinatario
      }

      // Enviar correo si tiene un correo
      if (destinatario.correo) {
        const personalizedMessage = `Hola ${destinatario.nombre},\n\n${this.messageContent}`;
        try {
          await this.emailService.sendEmail(destinatario.correo, subject, personalizedMessage).toPromise();
          totalEnviados++; // Incrementar solo si se envía correctamente
          console.log(`Correo enviado a ${destinatario.nombre}`);
        } catch {
          this.errores.push(`Error al enviar correo a ${destinatario.nombre}.`);
          totalNoEnviados++; // Incrementar si hay error
        }
      } else {
        this.errores.push(`No se puede enviar correo a ${destinatario.nombre}, no tiene correo.`);
        totalNoEnviados++; // Incrementar si no tiene correo
      }

      // Enviar SMS si tiene un número de teléfono
      if (destinatario.telefono) {
        const personalizedMessage = `Hola ${destinatario.nombre},\n\n${this.messageContent}`;
        try {
          await this.emailService.sendSms(destinatario.telefono, personalizedMessage).toPromise();
          totalEnviadosSMS++; // Incrementar solo si se envía correctamente
          console.log(`SMS enviado a ${destinatario.nombre}`);
        } catch {
          this.errores.push(`Error al enviar SMS a ${destinatario.nombre}.`);
          totalNoEnviados++;
          totalNoEnviadosSMS++; // Incrementar si hay error en SMS también
        }
      } else {
        this.errores.push(`No se puede enviar SMS a ${destinatario.nombre}, no tiene teléfono.`);
        totalNoEnviados++;
        totalNoEnviadosSMS++; // Incrementar si no tiene teléfono
      }
    });

    await Promise.all(promises);

    console.log(`Totales enviados: ${totalEnviados}, No enviados: ${totalNoEnviados}`);
    console.log(`Totales SMS enviados: ${totalEnviadosSMS}, No enviados SMS: ${totalNoEnviadosSMS}`);

    return { enviados: totalEnviados, noEnviados: totalNoEnviados, enviadosSMS: totalEnviadosSMS, noEnviadosSMS: totalNoEnviadosSMS };
  }

  private async mostrarAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'La campaña se ha enviado exitosamente.',
      buttons: [{ text: 'OK', handler: () => this.limpiarCampos() }]
    });

    await alert.present();
  }

  private limpiarCampos() {
    this.campaignName = '';
    this.messageContent = '';
  }

  irHome() {
    this.router.navigate(['/home']);
  }
}
