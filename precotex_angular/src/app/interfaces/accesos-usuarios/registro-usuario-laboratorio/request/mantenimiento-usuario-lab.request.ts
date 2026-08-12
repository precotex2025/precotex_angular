export const enum AccionMantenimiento {
  Insertar = 'I',
  Actualizar = 'U'
}

export interface MantenimientoUsuarioLabRequest {
  Accion: AccionMantenimiento;
  Cod_Usuario: string;
  Nom_Usuario: string;
  Password: string;
  Tip_Trabajador: string;
  Cod_Trabajador: string;
  Acc_Cod: string;
}
