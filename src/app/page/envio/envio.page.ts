import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { SupabaseService } from 'src/app/service/supabase/supabase.service';

@Component({
  selector: 'app-envio',
  templateUrl: './envio.page.html',
  styleUrls: ['./envio.page.scss'],
})
export class EnvioPage implements OnInit {

  destinatarios: any[] = [];  // Variable para almacenar los destinatarios

  constructor(private supabaseService: SupabaseService) { }  // Inyectar el servicio

  ngOnInit() {
    this.cargarDestinatarios();  // Llamar al método para cargar los destinatarios
  }

  cargarDestinatarios(): void {
    this.supabaseService.getDestinatarios().subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.body) {
          this.destinatarios = response.body;  // Guardar la respuesta en la variable destinatarios
          console.log('Destinatarios:', this.destinatarios);  // Log para verificar
        }
      },
      error: (error) => {
        console.error('Error al obtener destinatarios:', error);  // Manejo de errores
      }
    });
  }
}
