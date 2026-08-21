import { ProcesoExportacionItem } from 'src/app/interfaces/cotizaciones/response/listar-procesos-exportacion.response';

// Borrador en curso: sobrevive a la navegación entre versiones (conserva ajustes escritos).
// onBuscar lo crea automáticamente cuando no hay cabeceras para los filtros
// (ver cargarDetalleXFiltros). Se destruye tras guardar (ver reiniciaControles). Uno solo a la vez.
export interface BorradorCotizacion {
  planos: ProcesoExportacionItem[];
  planosBackup: ProcesoExportacionItem[];
  recetaCod: string;
  correlativo: string;
  version: number;
  // Versión de la que se derivó este borrador. 0 si es la primera cotización.
  baseIdCotizacionCab: number;
}
