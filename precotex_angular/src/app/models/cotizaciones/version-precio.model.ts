// Item del panel de Cotizaciones: una fila por versión guardada de la cotización.
// Alimentado por getListaCabecerasCotizacion (ver cargarHistorialCotizaciones).
// SDC, precio de carta y tiempo no viven aquí: son iguales en todas las versiones del
// grupo (es el criterio de amarre) y el componente los tiene en global_SDC /
// global_PrecioTinto / global_Tiempo desde el combo Precio/SDC.
export interface VersionPrecio {
  id                : number;   // idCotizacion_Cab
  titulo            : string;   // 'Versión 1', 'Versión 2', ... según num_Version
  numVersion        : number;   // num_Version (valor real de BD, no la posición en el arreglo)
  precioReferencia  : number;   // precio_Referencia guardado en esa versión
  receta            : string;   // idrecetalabprod de esa versión
  estado            : string;   // flg_Estatus traducido a etiqueta
  usuario           : string;   // usu_Registro
  fecha             : string;   // fec_Registro
  reciente          : boolean;  // true solo en el primer elemento (versión más reciente)
  raw               : any;      // elemento crudo, por si se necesita otro campo
}
