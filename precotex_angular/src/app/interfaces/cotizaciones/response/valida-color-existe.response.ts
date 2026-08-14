export interface ValidaColorItem {
  descripcion: string;
}

export interface ValidaColorExisteResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: ValidaColorItem[];
}
