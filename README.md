# Registro de Estudiantes (Frontend Angular)

Frontend en Angular para el sistema de registro de estudiantes, conectado al backend en Render.

- Demo: https://interrmaterias.netlify.app/estudiantes
- Backend API: https://reg-estudiantes-bc.onrender.com/
- Framework: Angular 20 (standalone components, signals)

## Requisitos
- Node.js 20+
- npm 10+

## Instalación y desarrollo
```bash
npm ci
npm start   # o: ng serve
```
App local en: http://localhost:4200/

## Build
```bash
npm run build
```
Salida en: `dist/reg-estudiantes-fr/browser`

## Deploy (Netlify)
- Build command: `npm run build`
- Publish directory: `dist/reg-estudiantes-fr/browser`
- SPA fallback: ya configurado en `netlify.toml`

## Rutas principales
- `/` Inicio
- `/estudiantes` Lista de estudiantes
- `/registro` Registro nuevo estudiante
- `/estudiante/:id` Detalle con materias y compañeros
- `/inscribir-adicional/:id` Agregar materias a estudiante existente

## Reglas de negocio
- 10 materias de 3 créditos cada una
- Máximo 3 materias por estudiante (9 créditos)
- Profesores: 5, cada uno dicta 2 materias
- No repetir profesor entre materias del mismo estudiante
- Ver compañeros por materia
- Periodo por materia: `{ id, nombre, activo }`

## Servicios y Endpoints
- Estudiantes: `/api/estudiantes`
  - `GET /{id}` detalle (incluye materias)
  - `GET /{id}/materias-companeros` materias con `profesor`, `periodo` y `companeros`
- Materias: `/api/materias`
  - `GET /disponibles/{estudianteId}` materias disponibles para agregar
- Inscripciones: `/api/inscripciones`
  - `POST` `{ estudianteId, materiasIds: number[] }`
  - `DELETE /{estudianteId}/{materiaId}`

## Notas
- Si Netlify advierte "Publish directory is configured incorrectly", asegúrate que el directorio sea `dist/reg-estudiantes-fr/browser`.
- API puede tardar unos segundos en frío (Render). Intenta nuevamente si ves timeouts.
