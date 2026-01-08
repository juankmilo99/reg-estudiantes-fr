import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profesor } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {
  private readonly apiUrl = 'https://reg-estudiantes-bc.onrender.com/api/profesores';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Profesor> {
    return this.http.get<Profesor>(`${this.apiUrl}/${id}`);
  }
}
