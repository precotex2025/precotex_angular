// Detalle de costeo armado desde cero, cuando no existe ninguna cabecera para estos
// criterios. No se envía IdCotizacion_Cab ni Num_Version porque todavía no hay
// cotización guardada. SDC_Referencia sí viaja: es parte del amarre de la cotización,
// igual que en getListaCabecerasCotizacion.
// Precio_Referencia y Tiempo_Referencia sí son insumo del cálculo, igual que el
// precio/tiempo del método anterior: se llenan al seleccionar el color
// (ver onChangePrecio).
export interface ListaDetalleCotizacionXFiltrosRequest {
  Id_Unidad_NegocioKey: number;
  Cod_Tipo_Orden_tinto: string;
  Cod_Cliente_Tex: string;
  Cod_Tela: string;
  Cod_Ruta: string;
  Cod_Color: string;
  Precio_Referencia: number;
  Tiempo_Referencia: number;
  SDC_Referencia: string;
}
