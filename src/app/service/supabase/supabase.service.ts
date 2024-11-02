import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  baseUrl = environment.api_url;

  constructor(private http: HttpClient) { }

  // Configurar headers comunes
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'apiKey': environment.apiKeySupabase,
      'Authorization': `Bearer ${environment.apiKeySupabase}`
    });
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error ocurrido:', error);
    return throwError(() => error);
  }

  // Método GET genérico
  get<T>(path: string, params?: HttpParams): Observable<HttpResponse<T>> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, { headers: this.getHeaders(), observe: 'response', params })
      .pipe(catchError(this.handleError));
  }

  // Método POST genérico
  post<T>(path: string, data: T): Observable<HttpResponse<T>> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, data, { headers: this.getHeaders(), observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  // Método para obtener la lista de destinatarios
  getDestinatarios(): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('select', '*');
    return this.get<any>('destinatario', params).pipe(
      tap((response) => {
        console.log('Destinatarios obtenidos:', response.body);
      }),
      catchError(this.handleError)
    );
  }

  // Método genérico para crear una entrada (campaña o reporte)
  createEntry<T>(path: string, payload: T): Observable<HttpResponse<any>> {
    return this.post<any>(path, payload).pipe(
      tap((response) => {
        console.log(`${path.charAt(0).toUpperCase() + path.slice(1)} creado:`, response.body);
      }),
      catchError((error) => {
        console.error(`Error al crear ${path}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Método para crear una nueva campaña
  createCampanha(campaignName: string, messageContent: string, enviados: number, noEnviados: number): Observable<HttpResponse<any>> {
    const payload = {
      nombre: campaignName,
      contenido: messageContent,
      enviado: enviados,
      no_enviado: noEnviados,
      fecha_envio: this.getCurrentDate(),
    };

    return this.createEntry('campanhas', payload).pipe(
      tap((response) => {
        console.log('Campaña creada:', response.body);
        // Crear un reporte después de crear la campaña
        if (response.body) {
          const { nombre } = response.body;
          console.log('Creando reporte con:', nombre, enviados, noEnviados);
          this.createReporte(nombre, enviados, noEnviados).subscribe(
            (reporteResponse) => {
              console.log('Reporte creado:', reporteResponse.body);
            },
            (error) => {
              console.error('Error al crear el reporte:', error);
            }
          );
        }
      }),
      catchError(this.handleError)
    );
  }

  // Método para crear un reporte
  createReporte(nombreCampana: string, enviados: number, noEnviados: number): Observable<HttpResponse<any>> {
    const payload = {
      nombre_campanha: nombreCampana,
      fecha_campanha: this.getCurrentDate(),
      enviado: enviados,
      no_enviado: noEnviados,
    };

    console.log('Payload para crear reporte:', payload);

    return this.createEntry('reportes', payload);
  }

  // Método para actualizar una campaña con los totales de envíos
  updateCampanha(campaignName: string, enviados: number, noEnviados: number): Observable<HttpResponse<any>> {
    const payload = {
      enviado: enviados,
      no_enviado: noEnviados,
      fecha_envio: this.getCurrentDate(),
    };

    return this.http.patch<any>(`${this.baseUrl}/campanhas?nombre=eq.${campaignName}`, payload, { headers: this.getHeaders(), observe: 'response' }).pipe(
      tap((response) => {
        console.log('Campaña actualizada:', response.body);
      }),
      catchError(this.handleError)
    );
  }

  // Método para actualizar un reporte
  updateReporte(campaignName: string, enviados: number, noEnviados: number): Observable<HttpResponse<any>> {
    const payload = {
      enviado: enviados,
      no_enviado: noEnviados,
    };

    return this.http.patch<any>(`${this.baseUrl}/reportes?nombre=eq.${campaignName}`, payload, { headers: this.getHeaders(), observe: 'response' }).pipe(
      tap((response) => {
        console.log('Reporte actualizado:', response.body);
      }),
      catchError(this.handleError)
    );
  }

  // Método para obtener la fecha actual en formato ISO
  private getCurrentDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0]; // Formato yyyy-mm-dd
  }

  // Método para obtener todas las campañas
  getCampanhas(): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('select', '*'); // Selecciona todos los campos de la tabla 'campanhas'
    return this.get<any>('campanhas', params).pipe(
      tap((response) => {
        console.log('Campañas obtenidas:', response.body);
      }),
      catchError(this.handleError)
    );
  }

  // Método para eliminar una campaña por su ID
  deleteCampanhaById(campaignId: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.baseUrl}/campanhas?id=eq.${campaignId}`, {
      headers: this.getHeaders(),
      observe: 'response',
    }).pipe(
      tap((response) => {
        console.log('Campaña eliminada:', response.body);
      }),
      catchError(this.handleError)
    );
  }

  // Método para obtener todos los reportes
  getReportes(): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('select', '*'); // Selecciona todos los campos de la tabla 'reportes'
    return this.get<any>('reportes', params).pipe(
      tap((response) => {
        console.log('Reportes obtenidos:', response.body);
      }),
      catchError(this.handleError)
    );
  }


}
