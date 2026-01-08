import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EstudiantesService } from '../../services/estudiantes.service';
import { InscripcionesService } from '../../services/inscripciones.service';
import { Estudiante, MateriaConCompaneros } from '../../interfaces';
import { signal } from '@angular/core';

@Component({
  selector: 'app-detalle-estudiante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-estudiante.component.html',
  styleUrl: './detalle-estudiante.component.css'
})
export class DetalleEstudianteComponent implements OnInit {
  estudiante = signal<Estudiante | null>(null);
  inscripciones = signal<MateriaConCompaneros[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);
  estudianteId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estudiantesService: EstudiantesService,
    private inscripcionesService: InscripcionesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.estudianteId = parseInt(params['id']);
      this.cargarDatos();
    });
  }

  private cargarDatos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.estudiantesService.obtenerPorId(this.estudianteId).subscribe({
      next: (datos) => {
        this.estudiante.set(datos);
        this.cargarMateriasConCompaneros();
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar los datos del estudiante.');
        this.cargando.set(false);
      }
    });
  }

  private cargarMateriasConCompaneros(): void {
    this.estudiantesService.obtenerMateriasConCompaneros(this.estudianteId).subscribe({
      next: (datos) => {
        this.inscripciones.set(datos);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar materias y compañeros.');
        this.cargando.set(false);
      }
    });
  }

  desinscribirse(materiaId: number): void {
    if (confirm('¿Estás seguro de que deseas desinscribirte de esta materia?')) {
      this.inscripcionesService.desinscribir(this.estudianteId, materiaId).subscribe({
        next: () => {
          this.cargarMateriasConCompaneros();
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error al desinscribirse de la materia.');
        }
      });
    }
  }

  obtenerCompanerosMateria(materiaId: number): { id: number; nombre: string }[] {
    const materia = this.inscripciones().find(m => m.id === materiaId);
    return materia?.companeros || [];
  }

  irAInscribirse(): void {
    // Guardar el ID del estudiante en sessionStorage para saber que viene de editar
    sessionStorage.setItem('estudianteIdEditar', this.estudianteId.toString());
    this.router.navigate(['/inscribir-adicional', this.estudianteId]);
  }
}
