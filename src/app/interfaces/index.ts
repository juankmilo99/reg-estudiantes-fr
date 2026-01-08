export interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  creditosTotales: number;
  materias?: Materia[];
}

export interface Materia {
  id: number;
  nombre: string;
  creditos: number;
  profesor: {
    id: number;
    nombre: string;
  };
  periodo: {
    id: number;
    nombre: string;
    activo: boolean;
  };
}

export interface Inscripcion {
  estudianteId: number;
  materiasIds: number[];
}

export interface Profesor {
  id: number;
  nombre: string;
  materias: Materia[];
}

export interface MateriaDisponible extends Materia {
  disponible: boolean;
}

export interface CompaneroCuota {
  estudianteId: number;
  nombre: string;
  materiasId: number[];
}

export interface MateriaConCompaneros extends Materia {
  companeros: {
    id: number;
    nombre: string;
  }[];
}
