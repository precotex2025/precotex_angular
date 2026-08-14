export interface ProcesoCotizacionDetalle {
  Pro_Hover: string;
  Pro_Factor: number;
  Pro_Cos_Kg: number;
  Pro_Tot: number;
  Pro_Tot_Com: number;
  Pro_Aju: number;
  Pro_Cotizacion: number;
  Pro_Por: number;
  Pro_Tip: string;
  Observacion: string;
  Nivel: number;
  cod_Subtotal: number;
  parteEntera: number;
  parteDecimal: number;
  isParent: boolean;
  isChild: boolean;
  tieneHijos: boolean;
  cod_ProcesoPadre: string;
  cod_Proceso_Tex: string;
  Cod_SubProceso: string;
}

export interface ProcesoCotizacionRequest {
  idCotizacion_Cab: number;
  pro_Id: number;
  cen_Cos_Cod: number;
  cod_Tipo: string;
  cod_Cliente_Tex: string;
  cod_Tela: string;
  cod_Ruta: string;
  cod_Color: string;
  cod_RecetaAcabado: string;
  tiempo_Referencia: number;
  precio_Referencia: number;
  sDC_Referencia: string;
  correlativo: string;
  version: number;
  flg_Estatus: string;
  usu_Registro: string;
  accion: string;
  detalles: ProcesoCotizacionDetalle[];
}
