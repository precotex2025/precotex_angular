// Criterios de amarre de una cotización: los siete filtros que identifican al conjunto
// de versiones. Los comparte getListaCabecerasCotizacion y getListaDetalleCotizacionXFiltros.
export interface ListaCabecerasCotizacionRequest {
  Id_Unidad_NegocioKey: number;
  Cod_Tipo_Orden_tinto: string;
  Cod_Cliente_Tex: string;
  Cod_Tela: string;
  Cod_Ruta: string;
  Cod_Color: string;
  SDC_Referencia: string;
}
