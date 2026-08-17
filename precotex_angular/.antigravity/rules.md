# Reglas de Desarrollo Frontend - Angular 13

## 1. Directivas Generales y Restricciones
- Idioma: Responde siempre en español, con explicaciones breves, técnicas y directas.
- Flujo de Trabajo y Ramas Git:
  * Toda mejora, refactorización, nueva funcionalidad o corrección debe implementarse obligatoriamente en una rama diferente a la rama actual.
  * Usar ramas dedicadas con nomenclatura semántica: [rama_base]-[nombre_trabajo] o feature-[nombre_funcionalidad].
  * Prohibido realizar commits o cambios directos sobre la rama base o ramas principales.
- Restricción de Alcance (No tocar globales):
  * Prohibido modificar estilos globales (styles.scss), VarGlobals.ts, o componentes/servicios compartidos por otros módulos.
  * Todo cambio de estilo debe pertenecer exclusivamente al .scss del componente o formulario en edición.
- Ubicación de Código Nuevo en Archivos Existentes:
  * El código nuevo va estrictamente al final del archivo (métodos al final de la clase, propiedades al final del bloque de variables, interfaces al final del archivo).
  * Nunca intercalar ni reordenar código preexistente para evitar conflictos de merge.
  * Prohibido dejar bloques de código comentado.
- Validación final: Todo cambio generado debe compilar limpio con:
  npx tsc --noEmit -p tsconfig.app.json

## 2. UI / UX y Componentes
- Librería UI: Uso exclusivo de Angular Material v13, @ng-select/ng-select para combos con búsqueda predictiva (cot-ng-select) y ngx-spinner. Prohibido el uso de Bootstrap.
- Iconografía: Material Icons / Google Fonts (<mat-icon>). Si un diseño o requerimiento trae FontAwesome, traducirlo obligatoriamente a Material Icons.
- Estrategia de Alertas y Feedback:
  * ngOnInit y Cargas Iniciales: Usar exclusivamente MatSnackBar (notificación inferior) para reportar errores o advertencias ocurridas durante la precarga de datos/combos al iniciar la vista.
  * Acciones de Usuario y CRUD (Botones): Usar SweetAlert2 (Swal.fire) para validaciones de formulario, confirmaciones antes de acciones destructivas (eliminar, descartar) y respuestas de éxito/error/advertencia de operaciones ejecutadas por el usuario.
- Formularios:
  * Agrupar criterios de búsqueda dentro de paneles colapsables.
  * Tras ejecutar la búsqueda, colapsar filtros para dar altura a los resultados/tabla.
  * Todos los botones principales de acción ("Guardar") deben ubicarse en la parte inferior.
  * Mensajes de error (mat-error) estrictamente debajo del campo.
  * Deshabilitar botones no aplicables según el estado actual en vez de ocultarlos.
  * Diferenciar visualmente campos de solo lectura vs editables.
- Tablas (mat-table):
  * Cabecera fija (sticky: true).
  * Scroll horizontal/vertical contenido en el contenedor de la tabla, nunca en la página completa.
  * Estado vacío explícito con icono y texto (No hay datos para mostrar), nunca tabla en blanco.
- Modales: No usar modales gigantes; preferir modales compactos estructurados (<ng-template #dialog...>).

## 3. Arquitectura, Estructura de Carpetas e Imports
- Estructura fija por módulo:
  src/app/
  ├── components/<modulo>/   <- .component.ts | .html | .scss | .spec.ts
  ├── services/<modulo>/     <- <modulo>.service.ts
  ├── interfaces/<modulo>/   <- Contratos de API (request/ y response/)
  └── models/<modulo>/       <- Modelos que solo viven en la UI
- Interfaces vs Models:
  * interfaces/: Respeta exactamente el casing y estructura que entrega el backend (corR_CARTA, preC_TINTO, pro_Hover, etc.). No normalizar aquí.
  * models/: Datos normalizados y estado que solo existe en la pantalla.
  * Naming: <endpoint-kebab>.request.ts, <endpoint-kebab>.response.ts, <nombre>.model.ts.
- Barriles e Imports:
  * Un index.ts por carpeta hoja (interfaces/<modulo>/request/, interfaces/<modulo>/response/, models/<modulo>/) con export * from './archivo'.
  * Un index.ts combinado en interfaces/<modulo>/ que reexporta request + response.
  * Imports absolutos desde la raíz: import { ... } from 'src/app/interfaces/<modulo>'.
  * Prohibido usar rutas relativas profundas (../../) y prohibido escribir el sufijo /index explícito en el path.

## 4. Modelos de Respuesta y Servicios HTTP
- Envelopes Genéricos (Existentes en el proyecto):
  * Listas:
    export interface ServiceResponseList<T> {
      success: boolean;
      codeResult: number;
      message: string;
      elements?: T[];
      totalElements: number;
    }
  * Unitarios:
    export interface ServiceResponse<T> {
      success: boolean;
      codeResult: number;
      message?: string;
      element?: T;
      codeTransacc: number;
    }
- Estructura del Service:
  * Métodos siempre tipados retornando Observable<ServiceResponse<T>> o Observable<ServiceResponseList<T>>. Nunca Observable<Object>.
  * Base URLs provenientes de GlobalVariable en src/app/VarGlobals.ts.
  * Pipe estandarizado: .pipe(retry(1), catchError(this.handleError)) en GETs; omitir retry en POST/PUT/DELETE.
  * Manejador de error estándar:
    private readonly handleError = (error: HttpErrorResponse): Observable<never> =>
      throwError(() => new Error(
        error?.error?.message ?? error.message ?? 'Error de comunicación con el servidor'
      ));
  * El Service no maneja spinners ni alertas (responsabilidad del componente).

## 5. Componentes y Consumo (.ts)
- Consumo directo: Llamadas estándar con .pipe(...).subscribe({ next: (res) => { ... }, error: (err) => { ... } }).
- Estados de carga: Uso de ngx-spinner (this.spinner.show() / this.spinner.hide()).
- Ubicación de interfaces: No declarar interfaces dentro del .component.ts; importarlas siempre desde interfaces/ o models/.