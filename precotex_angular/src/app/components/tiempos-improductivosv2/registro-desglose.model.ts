export interface DesgloseItem {
  //id_desglose: number;
  descripcion: string;
  metros: number;
}

export interface RegistroDesglose {
  proveedor: string;
  partida: string;
  fechaInicio: string; // formato ISO
  fechaFin: string;
  auditor: string;
  total: number;
  colitas: number;
  usuarioCrea: string;
  items: DesgloseItem[];
}


export interface MaquinaResponse {
  elements: Maquina[];
}

export interface Maquina {
  idMaquina : string;
  acronimo : string;
  estado : string;
}