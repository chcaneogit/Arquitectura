import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/service/supabase/supabase.service';
import { AlertController } from '@ionic/angular';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  destinatarios: any[] = [];
  errorMessage: string | null = null;

  constructor(private supabaseService: SupabaseService, private alertController: AlertController, private router:Router) {}

  ngOnInit() {
    this.getDestinatarios();
  }

  // Método para obtener la lista de destinatarios
  getDestinatarios() {
    this.supabaseService.getDestinatarios().subscribe({
      next: (response: HttpResponse<any>) => {
        this.destinatarios = response.body;
        console.log('Destinatarios cargados:', this.destinatarios);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar destinatarios';
        console.error(error);
      }
    });
  }

  // Método para manejar el cambio de no_molestar de un destinatario
  onNoMolestarToggle(rut: string, noMolestar: boolean) {
    const destinatario = this.destinatarios.find(d => d.rut === rut);
    if (destinatario) {
      destinatario.no_molestar = noMolestar;
    }
  }

  // Método para mostrar la alerta de confirmación antes de guardar
  async confirmSaveChanges() {
    const alert = await this.alertController.create({
      header: 'Confirmar Guardado',
      message: '¿Estás seguro de que deseas guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Guardado cancelado');
          }
        },
        {
          text: 'Guardar',
          handler: () => {
            this.saveChanges();
          }
        }
      ]
    });

    await alert.present();
  }

  // Método para guardar los cambios pendientes
  saveChanges() {
    this.destinatarios.forEach(destinatario => {
      this.supabaseService.updateDestinatarioNoMolestar(destinatario.rut, destinatario.no_molestar).subscribe({
        next: () => {
          console.log(`Destinatario ${destinatario.rut} actualizado a no_molestar: ${destinatario.no_molestar}`);
        },
        error: (error) => {
          this.errorMessage = `Error al actualizar no_molestar para el destinatario ${destinatario.rut}`;
          console.error(error);
        }
      });
    });
  }

  cerrar() {
    this.router.navigate(['/login']);
  }
}
