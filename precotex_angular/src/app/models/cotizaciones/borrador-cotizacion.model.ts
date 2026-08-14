import { ProcesoExportacionItem } from 'src/app/interfaces/cotizaciones/response/listar-procesos-exportacion.response';

// Borrador en curso: sobrevive a la navegación entre versiones (conserva ajustes escritos).
// onBuscar lo crea automáticamente cuando no hay cotizaciones para los filtros
// (ver crearBorradorNuevo). Se destruye tras guardar (ver reiniciaControles). Uno solo a la vez.
export interface BorradorCotizacion {
  planos: ProcesoExportacionItem[];
  planosBackup: ProcesoExportacionItem[];
  recetaCod: string;
  correlativo: string;
  version: number;
}
