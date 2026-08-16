/** Contrato no confirmado: dataRecetas se asigna tal cual llega, sin mapeo ni uso
 *  todavía en el template. Se toleran variantes de nombre hasta confirmar con backend. */
export interface RecetaAntipillingItem {
  codigo?: string;
  cod_Receta?: string;
  descripcion?: string;
  des_Receta?: string;
}
