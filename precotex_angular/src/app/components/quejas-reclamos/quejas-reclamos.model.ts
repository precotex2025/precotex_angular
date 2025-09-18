export interface ReclamoCliente {
  id: number,
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

  cadenaCodOrdtra: string;
    
  //Nuevos Campos
  cod_Ordtra: string;
  cod_Tela: string;
  des_Tela: string;
  cod_Color: string;
  des_Color: string;
  num_Secuencia: number;
  cod_Unidad_Negocio: string;
  des_Unidad_Negocio: string;
  cod_Cliente_Tex : string;
  cod_Motivo: string;
  cod_Estado?: string;
}

export interface Cliente {
  cod_Cliente_Tex : string;
  nom_Cliente : string;
  abr_Cliente : string;
}

export interface ClientesResponse {
  elements: Cliente[];
}

export interface EstadosOficial {
  cod_Estado    : string;
  nombre_Estado : string;
}

export interface EstadoOficialResponse {
  elements: EstadosOficial[];
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
  cod_Motivo : string;
  descripcion : string;
}

export interface MotivoReclamoResponse {
  elements: MotivoReclamo[];
}

//Nuevo
export interface UnidadNegocio2 {
  cod_Unidad_Negocio : string;
  des_Unidad_Negocio : string;
}

export interface UnidadNegocio2Response {
  elements: UnidadNegocio2[];
}