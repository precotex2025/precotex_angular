export interface RutaTelaRawItem {
  cod_Ruta: string;
  descripcion: string;
}

export interface RutaXCodTelaResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: RutaTelaRawItem[];
}
