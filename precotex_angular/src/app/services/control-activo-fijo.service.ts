import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import { Observable } from 'rxjs';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ControlActivoFijoService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;
  
  constructor(private http: HttpClient) { }

MantenimientoActivoFijoCabeceraService(Cod_Accion: string, Cod_Item_Cab: number, Cod_Empresa: number, Cod_Establecimiento: string, Num_Piso: number, Cod_CenCost: string, Nom_Area: string, Cod_Activo: string, Clase_Activo: number, Nom_Responsable: string, Nom_Usuario: string,  Ubicacion: string){

 
    return this.http.get(`${this.baseUrl}/app_Man_Control_Activo_Fijo.php?Accion=${Cod_Accion}&Cod_Item_Cab=${Cod_Item_Cab}&Cod_Empresa=${Cod_Empresa}&Cod_Establecimiento=${Cod_Establecimiento}&Num_Piso=${Num_Piso}&Cod_CenCost=${Cod_CenCost}&Nom_Area=${Nom_Area}&Cod_Activo=${Cod_Activo}&Clase_Activo=${Clase_Activo}&Nom_Responsable=${Nom_Responsable}&Nom_Usuario=${Nom_Usuario}&Cod_Usuario=${this.sCod_Usuario}&Ubicacion=${Ubicacion}`);                                             
}


MantenimientoActivoFijoDetalleService(
  Cod_Accion: string,
  Cod_Item_Cab: number,
  Cod_Item_Det: number,
  Descripcion: string,
  Marca: string,
  Modelo: string,
  Motor: string,
  Chasis: string,
  Serie: string,
  Placa: string,
  Color: number,
  Combustible: number,
  Caja: number,
  Asiento: number,
  Fabricacion,
  Ejes: number,
  Medidas: string,
  Estado: number,
  Uso: number,
  Observacion: string,
  ){

 
  return this.http.get(`${this.baseUrl}/app_Man_Control_Activo_Fijo_Det.php?Accion=${Cod_Accion}&Cod_Item_Cab=${Cod_Item_Cab}&Cod_Item_Det=${Cod_Item_Det}&Descripcion=${Descripcion}&Marca=${Marca}&Modelo=${Modelo}&Motor=${Motor}&Chasis=${Chasis}&Serie=${Serie}&Placa=${Placa}&Color=${Color}&Combustible=${Combustible}&Caja=${Caja}&Asiento=${Asiento}&Fabricacion=${Fabricacion}&Ejes=${Ejes}&Medidas=${Medidas}&Estado=${Estado}&Uso=${Uso}&Observacion=${Observacion}&Cod_Usuario=${this.sCod_Usuario}`);                                             
}

MantenimientoActivoFijoService(
  Cod_Accion: string,
  Cod_Activo_Fijo: number,
  Cod_Empresa: string,
  Cod_Establecimiento: string,
  Num_Piso: string,
  Cod_CenCost: string,
  Nom_Area: string,
  Cod_Activo: string,
  Clase_Activo: string,
  Nom_Responsable: string,
  Nom_Usuario: string,
  Cod_Usuario: string,
  Ubicacion: string,
  Descripcion: string,
  Nom_Marca: string,
  Nom_Modelo: string,
  Num_Serie_Motor: string,
  Num_Serie_Chasis: string,
  Num_Serie_Equipo: string,
  Num_Placa: string,
  Color: string,
  Tipo_Combustible: string,
  Tipo_Caja: string,
  Cant_Asiento: string,
  Ano_Fabricacion: string,
  Cant_Eje: string,
  Medida: string,
  Estado_Fisico: string,
  Uso_Desuso: string,
  Observacion: string,
  ){

 
  return this.http.get(`${this.baseUrl}/app_mantenimiento_activo_fijo.php?Accion=${Cod_Accion}&Cod_Activo_Fijo=${Cod_Activo_Fijo}&Cod_Empresa=${Cod_Empresa}&Cod_Establecimiento=${Cod_Establecimiento}&Num_Piso=${Num_Piso}&Cod_CenCost=${Cod_CenCost}&Nom_Area=${Nom_Area}&Cod_Activo=${Cod_Activo}&Clase_Activo=${Clase_Activo}&Nom_Responsable=${Nom_Responsable}&Nom_Usuario=${Nom_Usuario}&Cod_Usuario=${Cod_Usuario}&Ubicacion=${Ubicacion}&Descripcion=${Descripcion}&Nom_Marca=${Nom_Marca}&Nom_Modelo=${Nom_Modelo}&Num_Serie_Motor=${Num_Serie_Motor}&Num_Serie_Chasis=${Num_Serie_Chasis}&Num_Serie_Equipo=${Num_Serie_Equipo}&Num_Placa=${Num_Placa}&Color=${Color}&Tipo_Combustible=${Tipo_Combustible}&Tipo_Caja=${Tipo_Caja}&Cant_Asiento=${Cant_Asiento}&Ano_Fabricacion=${Ano_Fabricacion}&Cant_Eje=${Cant_Eje}&Medida=${Medida}&Estado_Fisico=${Estado_Fisico}&Uso_Desuso=${Uso_Desuso}&Observacion=${Observacion}`);                                             
}


  MostrarSedePorEmpresaService($Accion: number){
    return this.http.get(`${this.baseUrl}/app_Mostrar_Sede_Por_Empresa.php?Accion=${$Accion}`);                                                
  }

  buscarAreaCentro(Cod_CentroCosto){
    return this.http.get(`${this.baseUrl}/app_AF_OBTENER_AREA_CENTRO.php?Cod_CentroCosto=${Cod_CentroCosto}`);           
  }

  getDescripcionActivos(Opcion, IdDescripcion, Descripcion, Cod_Categoria){
    return this.http.get(`${this.baseUrl}/app_AF_OBTENER_DESCRIPCION.php?Opcion=${Opcion}&IdDescripcion=${IdDescripcion}&Descripcion=${Descripcion}&Cod_Categoria=${Cod_Categoria}`);  
  }


  ObtenerActivoFijoCodigo(Cod_Activo: number){
    return this.http.get(`${this.baseUrl}/app_AF_Obtener_Activo_Codigo.php?Cod_Activo=${Cod_Activo}`);         
  }

  //- Control salida activos

  getActivosFijo(Cod_Categoria: string, Id_Descripcion: string): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/app_Get_SG_ActivosFijo.php?Cod_Categoria=${Cod_Categoria}&Id_Descripcion=${Id_Descripcion}`);  
  }

  valActivosFijo(Cod_Activo: string): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/app_Val_SG_ActivosFijo.php?Cod_Activo=${Cod_Activo}`);  
  }

  manActivosFijo(Cod_Activo_Fijo: string, Flg_Salida: string): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/app_Man_SG_ActivosFijo.php?Cod_Activo_Fijo=${Cod_Activo_Fijo}&Flg_Salida=${Flg_Salida}`);  
  }

  getTipoActivos(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/app_Man_SG_TipoActivos.php`);  
  }


}



