import { Component, OnInit, ViewChild } from '@angular/core';
import { SupabaseService } from 'src/app/service/supabase/supabase.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AlertController } from '@ionic/angular'; // Importa AlertController
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-campanha',
  templateUrl: './ver-campanha.page.html',
  styleUrls: ['./ver-campanha.page.scss'],
})
export class VerCampanhaPage implements OnInit {
  @ViewChild(IonModal) modal?: IonModal; // Referencia al modal

  campanhas: any[] = []; // Almacena las campañas
  selectedContent: string = ''; // Contenido de la campaña seleccionada

  constructor(private supabaseService: SupabaseService, private alertController: AlertController, private router: Router) {} // Inyecta AlertController

  ngOnInit() {
    this.obtenerCampanhas();
  }

  // Método para obtener las campañas desde Supabase
  obtenerCampanhas() {
    this.supabaseService.getCampanhas().subscribe(
      (response) => {
        this.campanhas = response.body;
      },
      (error) => {
        console.error('Error al obtener campañas:', error);
      }
    );
  }

  // Método para abrir el modal y mostrar el contenido de la campaña seleccionada
  mostrarContenido(campanhaContent: string) {
    this.selectedContent = campanhaContent;
    this.modal?.present();
  }

  // Método para cerrar el modal
  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  // Método que se ejecuta al cerrar el modal
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log(`Modal confirmado con el contenido: ${ev.detail.data}`);
    }
  }

  // Método para mostrar el cuadro de confirmación
  async presentConfirm(campaignId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta campaña?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarCampanha(campaignId); // Llama al método de eliminación
          },
        },
      ],
    });

    await alert.present();
  }

  eliminarCampanha(campaignId: number) {
    this.supabaseService.deleteCampanhaById(campaignId).subscribe(
      () => {
        console.log('Campaña eliminada con éxito');
        this.obtenerCampanhas();
      },
      (error) => {
        console.error('Error al eliminar la campaña:', error);
      }
    );
  }

  irHome(){
    this.router.navigate(['/home']);
  }
}
