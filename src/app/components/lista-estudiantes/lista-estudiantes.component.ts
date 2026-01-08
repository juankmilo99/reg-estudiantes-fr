import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EstudiantesService } from '../../services/estudiantes.service';
import { Estudiante } from '../../interfaces';
import { signal } from '@angular/core';

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-estudiantes.component.html',
  styleUrl: './lista-estudiantes.component.css'
})
export class ListaEstudiantesComponent implements OnInit {
  estudiantes = signal<Estudiante[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  constructor(private estudiantesService: EstudiantesService) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.estudiantesService.obtenerTodos().subscribe({
      next: (datos) => {
        this.estudiantes.set(datos);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar estudiantes. Intenta de nuevo.');
        this.cargando.set(false);
      }
    });
  }

  obtenerCreditosTotales(estudiante: Estudiante): number {
    if (!estudiante.materias || estudiante.materias.length === 0) {
      return 0;
    }
    return estudiante.materias.reduce((total, materia) => total + materia.creditos, 0);
  }
}
