export interface Defecto {
  defecto: string;
  coD_MOTIVO: string;
  flG_ORDEN: string;
  pagina: number;
}

export interface DefectoResponse {
  elements: Defecto[];
}

export interface DefectoRegistrado {
  sel: boolean;
  //id: number;
  codTela: string;
  codRollo: string;
  codMotivo: string;
  metros: number;
  grado: number;
}
export interface DefectoRegistradoResponse {
  elements: DefectoRegistrado[];
}

export interface Maquina {
  idMaquina : string;
  acronimo : string;
  estado : string;
}

export interface MaquinaResponse {
  elements: Maquina[];
}

export interface Supervisor {
  idAuditor : string;
  acronimo : string;
  estado : string;
}

export interface SupervisorResponse {
  elements: Supervisor[];
}

export interface Auditor {
  idAuditor : string;
  acronimo : string;
  estado : string;
}

export interface AuditorResponse {
  elements: Auditor[];
}

export interface Turno {
  idTurno : string;
  acronimo : string;
  estado : string;
}

export interface TurnoResponse {
  elements: Turno[];
}

export interface UnidadNegocio {
  idUnidadNegocio : string;
  acronimo : string;
  estado : string;
}

export interface UnidadNegocioResponse {
  elements: UnidadNegocio[];
}

export interface EstadoPartida {
  idEstadoPartida : string;
  acronimo : string;
  estado : string;
}

export interface EstadoPartidaResponse {
  elements: EstadoPartida[];
}

export interface ProcesoAuditado {
  idEstadoPartida : string;
  acronimo : string;
  estado : string;
}

export interface ProcesoAuditadoResponse {
  elements: ProcesoAuditado[];
}

export interface Calificacion {
  idCalificacion : string;
  acronimo : string;
  estado : string;
}

export interface CalificacionResponse {
  elements: Calificacion[];
}

export interface EstadoProceso {
  idCalificacion : string;
  acronimo : string;
  estado : string;
}

export interface EstadoProcesoResponse {
  elements: EstadoProceso[];
}


export  interface PartidaItem  {
  sel: boolean;
  id: string;
  rollo: string;
  despacho: string;
  mtrs2_T: number;
  calidad: number;
  secuencia: string;
  tela_comb: string;
  flg_Despacho: string;
  mtrsAuditados?: string;
  calidadAditada?: number;
  //ancho: number;
  //prim5mts: number;
  //medio: number;
  //ult5mts: number;
  //densidad: number;
  isEditing?: boolean;
  archivoNombre?: string;
  archivo?: File;
  und_Crudo: string;
  largo?: string;
  alto?: string;
  med_Std?: string;
  und_Real: string;
  kgs_Crudo: string;
  ot_Tejeduria: string;

}

export interface PartidaItemResponse {
  elements: PartidaItem[];
}

export interface PartidaCabecera {

  usuario: string;
  auditor: string;
  supervisor: string;
  maquina: string;
  turno: string;
  unidadNegocio: string;
  estadoPartida: string;
  calificacion: string;
  observaciones: string;
  datosPartida: string;
  datosTela: string;
  datosCliente: string;
  detPartida: any[];
  detDefecto: any[];

}

export interface PartidaCabResponse {
  elements: PartidaCabecera[];
}

export interface PartidaPorRolloCabecera {

  id: number;
  codPartida: string;
  codRollo: string;
  codTela: string;
  metros: string;
  cliente: string;

}

export interface PartidaPorRolloCabeceraResponse {
  elements: PartidaPorRolloCabecera[];
}


export interface UnionRollosCabecera {

  id: number;
  cod_Ordtra: string;
  rollo: string;
  med_std: string;
  kgs_crudo: string;
  tela_comb: string;
  und_crudo: string;
  calidad: number;

}

export interface UnionRollosResponse {
  elements: UnionRollosCabecera[];
}

export interface GuardarUnionRollos {
  usuario: string;
  ot_tejeduria: string;
  rollo1: string;
  rollo2: string;

}

export interface GuardarUnionRollosResponse {
  elements: GuardarUnionRollos[];
}


