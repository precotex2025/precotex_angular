export interface UnidadNegocioItem {
  codigo: string;
  descripcion: string;
}

export interface ListaUnidadNegocioResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: UnidadNegocioItem[];
}
