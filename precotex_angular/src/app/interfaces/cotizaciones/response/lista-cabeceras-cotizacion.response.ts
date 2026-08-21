// Una fila por versión guardada de la cotización (tabla de cabecera).
// Alimenta el panel de historial (ver cargarHistorialCotizaciones).
// SDC, precio de carta y tiempo no viajan aquí: son el criterio de amarre y ya los tiene
// el front desde el combo Precio/SDC (ver onChangePrecio).
export interface CabeceraCotizacionItem {
  idCotizacion_Cab: number;
  num_Version: number;
  precio_Referencia: number;
  idrecetalabprod: string;
  flg_Estatus: string;
  usu_Registro: string;
  fec_Registro: string;
}
