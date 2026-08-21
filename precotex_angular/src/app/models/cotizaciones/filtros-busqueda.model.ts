// Filtros de la última búsqueda, para poder re-disparar la carga del historial y del
// detalle cuando el usuario elige otra card sin volver a leer el formulario.
// Son los siete criterios que amarran una cotización.
export interface FiltrosBusqueda {
  unidad: number;
  tipo: string;
  cliente: string;
  tela: string;
  ruta: string;
  color: string;
  sdcReferencia: string;
}
