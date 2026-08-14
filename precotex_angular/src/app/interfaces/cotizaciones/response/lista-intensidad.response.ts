import { ComboItem } from 'src/app/models/cotizaciones/combo-item.model';

export interface ListaIntensidadResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: ComboItem[];
}
