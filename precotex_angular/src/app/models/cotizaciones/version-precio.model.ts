// Item del panel de Cotizaciones: una fila por cotización existente para los filtros
// buscados. Alimentado por getListaPrecioXColor (ver mapPreciosAVersiones / onBuscar).
export interface VersionPrecio {
  id            : number;   // idcotizacioN_CAB
  titulo        : string;   // 'Opción 1', 'Opción 2', ... (correlativo local)
  sdc           : string;   // corR_CARTA
  precioTinto   : number;   // preC_TINTO
  precioAcabado : number;   // preC_ACABADO
  tiempo        : number;   // tiempo
  receta        : string;   // idrecetalabprod
  reciente      : boolean;  // true solo en el primer elemento
  raw           : any;      // elemento crudo, por si se necesita otro campo

  // --- Fase 2: pendientes de que el backend agregue estos campos a getListaPrecioXColor ---
  usuario?: string;  // usu_Registro
  fecha?  : string;  // fec_Registro
  estado? : 'Vigente' | 'Aprobada' | 'Borrador';  // estado

  // Solo presentes cuando la "versión" es en realidad el borrador nuevo (ver crearBorradorNuevo)
  correlativo?: string;
  version?    : number;
}
