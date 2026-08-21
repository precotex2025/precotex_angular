export interface UsuarioLabFila {
  Cod_Usuario?: string;
  Nom_usuario?: string;
  Cod_Trabajador?: string;
  Empresa?: string;
  Flg_Activo?: number | string | null;
  Tip_Trabajador?: string;
  Password?: string;
  Cod_PerfilUsuarioLab?: string | null;
}

export interface UsuarioLabDialogData {
  data: UsuarioLabFila | string;
}
