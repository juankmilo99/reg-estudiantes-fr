import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MateriasService } from '../../services/materias.service';
import { InscripcionesService } from '../../services/inscripciones.service';
import { EstudiantesService } from '../../services/estudiantes.service';
import { Materia } from '../../interfaces';
import { signal } from '@angular/core';

@Component({
  selector: 'app-agregar-materias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agregar-materias.component.html',
  styleUrl: './agregar-materias.component.css'
})
export class AgregarMateriasComponent implements OnInit {
  materias = signal<Materia[]>([]);
  materiasSeleccionadas = signal<number[]>([]);
  materiasInscritas = signal<number[]>([]);
  cargando = signal(false);
  enviando = signal(false);
  error = signal<string | null>(null);
  exito = signal(false);
  estudianteId: number = 0;

  readonly maxMaterias = 3;
  readonly creditosPorMateria = 3;
  readonly creditosTotalesMax = 9;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materiasService: MateriasService,
    private inscripcionesService: InscripcionesService,
    private estudiantesService: EstudiantesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.estudianteId = parseInt(params['id']);
      this.cargarDatos();
    });
  }

  private cargarDatos(): void {
    this.cargando.set(true);
    
    // Cargar materias disponibles para el estudiante
    this.materiasService.obtenerDisponibles(this.estudianteId).subscribe({
      next: (datos) => {
        this.materias.set(datos);
        // Cargar materias inscritas del estudiante
        this.cargarMateriasInscritas();
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar materias.');
        this.cargando.set(false);
      }
    });
  }

  private cargarMateriasInscritas(): void {
    this.estudiantesService.obtenerMateriasConCompaneros(this.estudianteId).subscribe({
      next: (datos) => {
        const ids = datos.map(m => m.id);
        this.materiasInscritas.set(ids);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar materias inscritas.');
        this.cargando.set(false);
      }
    });
  }

  toggleMateria(materiaId: number): void {
    const seleccionadas = [...this.materiasSeleccionadas()];
    const inscritas = this.materiasInscritas();
    const creditosActuales = (inscritas.length + seleccionadas.length) * this.creditosPorMateria;

    const index = seleccionadas.indexOf(materiaId);

    if (index > -1) {
      // Deseleccionar
      seleccionadas.splice(index, 1);
    } else {
      // Seleccionar
      if (creditosActuales + this.creditosPorMateria <= this.creditosTotalesMax) {
        seleccionadas.push(materiaId);
      } else {
        this.error.set(`Solo puedes alcanzar máximo ${this.creditosTotalesMax} créditos totales.`);
        return;
      }
    }

    this.materiasSeleccionadas.set(seleccionadas);
    this.error.set(null);
  }

  estaSeleccionada(materiaId: number): boolean {
    return this.materiasSeleccionadas().includes(materiaId);
  }

  estaInscrita(materiaId: number): boolean {
    return this.materiasInscritas().includes(materiaId);
  }

  obtenerProfesoresSeleccionados(): Set<number> {
    const seleccionadas = this.materiasSeleccionadas();
    const inscritas = this.materiasInscritas();
    const profesores = new Set<number>();

    // Agregar profesores de materias ya inscritas
    this.materias().forEach(materia => {
      if (inscritas.includes(materia.id)) {
        profesores.add(materia.profesor.id);
      }
    });

    // Agregar profesores de materias seleccionadas
    this.materias().forEach(materia => {
      if (seleccionadas.includes(materia.id)) {
        profesores.add(materia.profesor.id);
      }
    });

    return profesores;
  }

  tieneProfesorRepetido(): boolean {
    const seleccionadas = this.materiasSeleccionadas();
    const inscritas = this.materiasInscritas();
    
    if (seleccionadas.length === 0) return false;

    const profesoresMap = new Map<number, number>();

    // Contar profesores en materias ya inscritas
    this.materias().forEach(materia => {
      if (inscritas.includes(materia.id)) {
        const count = profesoresMap.get(materia.profesor.id) || 0;
        profesoresMap.set(materia.profesor.id, count + 1);
      }
    });

    // Contar profesores en materias seleccionadas
    this.materias().forEach(materia => {
      if (seleccionadas.includes(materia.id)) {
        const count = profesoresMap.get(materia.profesor.id) || 0;
        profesoresMap.set(materia.profesor.id, count + 1);
      }
    });

    // Verificar si algún profesor aparece más de una vez
    for (const count of profesoresMap.values()) {
      if (count > 1) {
        return true;
      }
    }

    return false;
  }

  agregarMaterias(): void {
    if (this.materiasSeleccionadas().length === 0) {
      this.error.set('Debes seleccionar al menos 1 materia.');
      return;
    }

    if (this.tieneProfesorRepetido()) {
      this.error.set('No puedes tener al mismo profesor en diferentes materias.');
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    // Solo enviar las materias NUEVAMENTE seleccionadas
    const inscripcion = {
      estudianteId: this.estudianteId,
      materiasIds: this.materiasSeleccionadas()
    };

    this.inscripcionesService.inscribir(inscripcion).subscribe({
      next: () => {
        this.exito.set(true);
        this.enviando.set(false);
        setTimeout(() => {
          this.router.navigate(['/estudiante', this.estudianteId]);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.error.set(err.error?.message || 'Error al agregar materias.');
        this.enviando.set(false);
      }
    });
  }

  obtenerCreditosActuales(): number {
    return this.materiasInscritas().length * this.creditosPorMateria;
  }

  obtenerCreditosSeleccionados(): number {
    return this.materiasSeleccionadas().length * this.creditosPorMateria;
  }

  obtenerCreditosTotales(): number {
    return this.obtenerCreditosActuales() + this.obtenerCreditosSeleccionados();
  }

  obtenerMateriasDisponibles(): Materia[] {
    return this.materias().filter(m => !this.estaInscrita(m.id));
  }
}
