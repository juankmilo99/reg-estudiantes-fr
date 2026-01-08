import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscripcion, Materia } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {
  private readonly apiUrl = 'https://reg-estudiantes-bc.onrender.com/api/inscripciones';

  constructor(private http: HttpClient) {}

  inscribir(datos: Inscripcion): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(this.apiUrl, datos);
  }

  desinscribir(estudianteId: number, materiaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${estudianteId}/${materiaId}`);
  }

  obtenerInscripciones(estudianteId: number): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/estudiante/${estudianteId}`);
  }
}
