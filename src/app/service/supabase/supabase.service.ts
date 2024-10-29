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
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método POST genérico
  post<T>(path: string, data: T): Observable<HttpResponse<T>> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, data, { headers: this.getHeaders(), observe: 'response' })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para obtener la lista de destinatarios
  getDestinatarios(): Observable<HttpResponse<any>> {
    const params = new HttpParams().set('select', '*'); // Solo selecciona los campos de la tabla destinatario
    return this.get<any>('destinatario', params).pipe(
      tap((response) => {
        console.log('Destinatarios obtenidos:', response.body);
      }),
      catchError(this.handleError)
    );
  }

  // Método para crear una nueva campaña
  createCampanha(campaignName: string, messageContent: string): Observable<HttpResponse<any>> {
    const payload = {
      nombre: campaignName,
      contenido: messageContent,
    };

    return this.post<any>('campanhas', payload).pipe(
      tap((response) => {
        console.log('Campaña creada:', response.body);
      }),
      catchError(this.handleError)
    );
  }
}
