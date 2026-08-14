export interface CorrelativoVersionItem {
  correlativo: string;
  version: number;
}

export interface ObtenerNuevoCorrelativoVersionResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: CorrelativoVersionItem[];
}
