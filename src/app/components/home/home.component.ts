import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MateriasService } from '../../services/materias.service';
import { ProfesoresService } from '../../services/profesores.service';
import { Materia, Profesor } from '../../interfaces';
import { signal } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  materias = signal<Materia[]>([]);
  profesores = signal<Profesor[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);

  constructor(
    private materiasService: MateriasService,
    private profesoresService: ProfesoresService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.materiasService.obtenerTodas().subscribe({
      next: (datos) => {
        this.materias.set(datos);
        this.cargarProfesores();
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar información.');
        this.cargando.set(false);
      }
    });
  }

  private cargarProfesores(): void {
    this.profesoresService.obtenerTodos().subscribe({
      next: (datos) => {
        this.profesores.set(datos);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar profesores.');
        this.cargando.set(false);
      }
    });
  }
}
