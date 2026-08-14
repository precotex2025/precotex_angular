export interface PrecioXColorItem {
  corR_CARTA: string;
  tiempo: number;
  preC_TINTO: number;
  preC_ACABADO: number;
  idcotizacioN_CAB: number;
  idrecetalabprod: string;

  // --- Fase 2: pendientes de que el backend agregue estos campos ---
  usu_Registro?: string;
  fec_Registro?: string;
  estado?: string;
}

export interface ListaPrecioXColorResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: PrecioXColorItem[];
}
