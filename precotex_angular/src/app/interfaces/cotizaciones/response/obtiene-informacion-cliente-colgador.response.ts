export interface ClienteColgadorItem {
  cod_Cliente_Tex: string;
  abr_Cliente: string;
  nom_Cliente: string;
}

export interface ObtieneInformacionClienteColgadorResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: ClienteColgadorItem[];
}
