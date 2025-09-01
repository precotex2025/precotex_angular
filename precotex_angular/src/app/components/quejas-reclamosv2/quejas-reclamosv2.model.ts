export interface ReclamoCliente {

  cliente?: string;
  nroCaso?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipoRegistro: string;
  unidadNegocio: string;
  usuarioRegistro?: string;
  responsable: string;
  motivoRegistro: string;
  estadoSolicitud?: string;
  observacion: string;
  archivoAdjunto?: File;
  partida: string;
}

export interface Cliente {
  cod_Cliente_Tex : string;
  nom_Cliente : string;
  abr_Cliente : string;
}

export interface ClientesResponse {
  elements: Cliente[];
}

export interface Estados {
  idEstado : string;
  acronimo : string;
  estado : string;
}

export interface EstadoResponse {
  elements: Estados[];
}

export interface UnidadNegocio {
  cod_Unidad_Negocio : string;
  descripcion : string;
}

export interface UnidadNegocioResponse {
  elements: UnidadNegocio[];
}

export interface UsuarioResponsable {
  idArea : number;
  nombreArea : string;
}

export interface UsuarioResponsableResponse {
  elements: UsuarioResponsable[];
}

export interface MotivoReclamo {
  cod_Unidad_Negocio : string;
  descripcion : string;
}

export interface MotivoReclamoResponse {
  elements: MotivoReclamo[];
}
