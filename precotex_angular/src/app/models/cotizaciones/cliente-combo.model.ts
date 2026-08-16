/** Forma normalizada para el <ng-select> de Cliente (ver LoadClientes, que agrega
 *  "label" a cada ClienteColgadorItem que llega del backend). */
export interface ClienteComboItem {
  cod_Cliente_Tex: string;
  abr_Cliente: string;
  nom_Cliente: string;
  label: string;
}
