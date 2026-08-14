export interface TelaItem {
  des_Tela: string;
}

export interface ListaTelasResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: TelaItem[];
}
