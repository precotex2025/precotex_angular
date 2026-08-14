export interface UnidadNegocioTipoItem {
  codigo: string;
  descripcion: string;
}

export interface ListaUnidadNegocioTipoResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: UnidadNegocioTipoItem[];
}
