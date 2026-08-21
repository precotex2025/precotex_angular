/** Ítem crudo: el contrato del endpoint no está confirmado, se toleran variantes de nombre. */
export interface PerfilLabItem {
  Cod_PerfilUsuarioLab?: string;
  cod_PerfilUsuarioLab?: string;
  codigo?: string;
  id?: string | number;
  Des_PerfilUsuarioLab?: string;
  des_PerfilUsuarioLab?: string;
  descripcion?: string;
  nombre?: string;
}

export interface ListarPerfilesLabResponse {
  success: boolean;
  message?: string;
  totalElements: number;
  elements: PerfilLabItem[];
}

/** Modelo normalizado que alimenta el mat-select y el chip del título. */
export interface PerfilLab {
  codigo: string;
  descripcion: string;
}
