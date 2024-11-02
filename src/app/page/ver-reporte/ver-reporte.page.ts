import { Component, OnInit, ViewChild } from '@angular/core';
import { SupabaseService } from 'src/app/service/supabase/supabase.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-reporte',
  templateUrl: './ver-reporte.page.html',
  styleUrls: ['./ver-reporte.page.scss'],
})
export class VerReportePage implements OnInit {
  @ViewChild(IonModal) modal?: IonModal; // Referencia al modal

  reportes: any[] = []; // Almacena los reportes
  selectedReporte: any; // Almacena el reporte seleccionado

  constructor(private supabaseService: SupabaseService, private router:Router) {}

  ngOnInit() {
    this.obtenerReportes();
  }

  // Método para obtener los reportes desde Supabase
  obtenerReportes() {
    this.supabaseService.getReportes().subscribe(
      (response) => {
        this.reportes = response.body;
      },
      (error) => {
        console.error('Error al obtener reportes:', error);
      }
    );
  }

  // Método para abrir el modal y mostrar los detalles del reporte seleccionado
  mostrarDetalles(reporte: any) {
    this.selectedReporte = reporte;
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

  irHome(){
    this.router.navigate(['/home']);
  }
}
