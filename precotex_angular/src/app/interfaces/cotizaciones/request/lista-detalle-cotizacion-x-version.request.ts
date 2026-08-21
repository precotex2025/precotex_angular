// Detalle de costeo de una versión ya guardada. La cabecera identifica la cotización,
// por eso no viajan los filtros.
export interface ListaDetalleCotizacionXVersionRequest {
  IdCotizacion_Cab: number;
  Num_Version: number;
}
