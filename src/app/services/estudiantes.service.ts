import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, CompaneroCuota, MateriaConCompaneros } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {
  private readonly apiUrl = 'https://reg-estudiantes-bc.onrender.com/api/estudiantes';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`);
  }

  crear(estudiante: Omit<Estudiante, 'id' | 'creditosTotales'>): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }

  actualizar(id: number, estudiante: Partial<Estudiante>): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, estudiante);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerCompañeros(id: number): Observable<CompaneroCuota[]> {
    return this.http.get<CompaneroCuota[]>(`${this.apiUrl}/${id}/materias-companeros`);
  }

  obtenerMateriasConCompaneros(id: number): Observable<MateriaConCompaneros[]> {
    return this.http.get<MateriaConCompaneros[]>(`${this.apiUrl}/${id}/materias-companeros`);
  }
}
