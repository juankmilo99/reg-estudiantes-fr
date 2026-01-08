import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListaEstudiantesComponent } from './components/lista-estudiantes/lista-estudiantes.component';
import { RegistroEstudianteComponent } from './components/registro-estudiante/registro-estudiante.component';
import { DetalleEstudianteComponent } from './components/detalle-estudiante/detalle-estudiante.component';
import { AgregarMateriasComponent } from './components/agregar-materias/agregar-materias.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'estudiantes', component: ListaEstudiantesComponent },
  { path: 'registro', component: RegistroEstudianteComponent },
  { path: 'inscribir-adicional/:id', component: AgregarMateriasComponent },
  { path: 'estudiante/:id', component: DetalleEstudianteComponent },
  { path: '**', redirectTo: '' }
];
