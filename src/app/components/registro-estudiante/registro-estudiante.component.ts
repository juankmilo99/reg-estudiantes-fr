import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EstudiantesService } from '../../services/estudiantes.service';
import { MateriasService } from '../../services/materias.service';
import { InscripcionesService } from '../../services/inscripciones.service';
import { Materia } from '../../interfaces';
import { signal } from '@angular/core';

@Component({
  selector: 'app-registro-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-estudiante.component.html',
  styleUrl: './registro-estudiante.component.css'
})
export class RegistroEstudianteComponent implements OnInit {
  formulario!: FormGroup;
  materias = signal<Materia[]>([]);
  materiasSeleccionadas = signal<number[]>([]);
  cargando = signal(false);
  enviando = signal(false);
  error = signal<string | null>(null);
  exito = signal(false);

  readonly maxMaterias = 3;
  readonly creditosPorMateria = 3;

  constructor(
    private fb: FormBuilder,
    private estudiantesService: EstudiantesService,
    private materiasService: MateriasService,
    private inscripcionesService: InscripcionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarMaterias();
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  private cargarMaterias(): void {
    this.cargando.set(true);
    this.materiasService.obtenerTodas().subscribe({
      next: (datos) => {
        this.materias.set(datos);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar materias.');
        this.cargando.set(false);
      }
    });
  }

  toggleMateria(materiaId: number): void {
    const seleccionadas = [...this.materiasSeleccionadas()];
    const index = seleccionadas.indexOf(materiaId);

    if (index > -1) {
      seleccionadas.splice(index, 1);
    } else {
      if (seleccionadas.length < this.maxMaterias) {
        seleccionadas.push(materiaId);
      } else {
        this.error.set(`Solo puedes seleccionar máximo ${this.maxMaterias} materias.`);
        return;
      }
    }

    this.materiasSeleccionadas.set(seleccionadas);
    this.error.set(null);
  }

  estaSeleccionada(materiaId: number): boolean {
    return this.materiasSeleccionadas().includes(materiaId);
  }

  obtenerProfesoresSeleccionados(): Set<number> {
    const seleccionadas = this.materiasSeleccionadas();
    const profesores = new Set<number>();

    this.materias().forEach(materia => {
      if (seleccionadas.includes(materia.id)) {
        profesores.add(materia.profesor.id);
      }
    });

    return profesores;
  }

  tieneProfesorRepetido(): boolean {
    const profesores = this.obtenerProfesoresSeleccionados();
    return profesores.size < this.materiasSeleccionadas().length;
  }

  registrar(): void {
    if (!this.formulario.valid) {
      this.error.set('Por favor completa todos los campos correctamente.');
      return;
    }

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

    const datosEstudiante = this.formulario.value;

    this.estudiantesService.crear(datosEstudiante).subscribe({
      next: (estudiante) => {
        this.inscribirMaterias(estudiante.id);
      },
      error: (err) => {
        console.error(err);
        this.error.set(err.error?.message || 'Error al crear el estudiante.');
        this.enviando.set(false);
      }
    });
  }

  private inscribirMaterias(estudianteId: number): void {
    const inscripcion = {
      estudianteId,
      materiasIds: this.materiasSeleccionadas()
    };

    this.inscripcionesService.inscribir(inscripcion).subscribe({
      next: () => {
        this.exito.set(true);
        this.enviando.set(false);
        setTimeout(() => {
          this.router.navigate(['/estudiante', estudianteId]);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.error.set(err.error?.message || 'Error al inscribirse en las materias.');
        this.enviando.set(false);
      }
    });
  }
}
