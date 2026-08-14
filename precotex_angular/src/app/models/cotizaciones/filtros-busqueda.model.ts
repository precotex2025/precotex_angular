// Filtros de la última búsqueda, para poder re-disparar getListarProcesosExportacion
// cuando el usuario elige otra card del historial sin volver a leer el formulario.
export interface FiltrosBusqueda {
  unidad: number;
  tipo: string;
  cliente: string;
  tela: string;
  ruta: string;
  color: string;
}
