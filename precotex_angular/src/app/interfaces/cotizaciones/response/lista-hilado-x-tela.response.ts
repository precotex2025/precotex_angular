export interface HiladoTelaItem {
  porcentaje: number;
  precio_Final: number;
  total: number;
  des_hiltel: string;
  cod_Hilado_Estructurado: string;
}

export interface ListaHiladoXTelaResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: HiladoTelaItem[];
}
