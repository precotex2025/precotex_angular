export interface CentroCostoRawItem {
  cen_Cos_Cod: number;
  cen_Cos_Des: string;
}

export interface ListaCentroCostoResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: CentroCostoRawItem[];
}
