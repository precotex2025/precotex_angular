/** Fila cruda de getListarProcesosExportacion. Las propiedades isParent/isChild/tieneHijos/
 *  childCount/padreKey no vienen del backend: el componente las agrega en sitio sobre el
 *  mismo objeto (ver getListarProcesosExportacion → planosConFlags), por eso quedan opcionales. */
export interface ProcesoExportacionItem {
  pro_Hover: string;
  pro_Factor: number;
  pro_Cos_Kg: number;
  pro_Tot: number;
  pro_Tot_Com: number;
  pro_Aju: number;
  pro_Cotizacion: number;
  pro_Por: number;
  pro_Tip: string;
  observacion: string;
  nivel: number;
  cod_Subtotal: number;
  parteEntera: number;
  parteDecimal: number;
  cod_ProcesoPadre: string;
  cod_Proceso_Tex: string;
  cod_SubProceso: string;
  existeCotizacion: string;

  // --- Agregadas en el cliente (ver getListarProcesosExportacion) ---
  isParent?: boolean;
  isChild?: boolean;
  tieneHijos?: boolean;
  childCount?: number;
  padreKey?: string;
}
