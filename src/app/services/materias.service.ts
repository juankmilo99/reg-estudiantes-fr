import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia, MateriaDisponible } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  private readonly apiUrl = 'https://reg-estudiantes-bc.onrender.com/api/materias';

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/${id}`);
  }

  obtenerDisponibles(estudianteId: number): Observable<MateriaDisponible[]> {
    return this.http.get<MateriaDisponible[]>(`${this.apiUrl}/disponibles/${estudianteId}`);
  }
}
