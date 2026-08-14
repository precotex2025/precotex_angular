import { ComboItem } from 'src/app/models/cotizaciones/combo-item.model';

export interface ListaColoresXClienteResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: ComboItem[];
}
