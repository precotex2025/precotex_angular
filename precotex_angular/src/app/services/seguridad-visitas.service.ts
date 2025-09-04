import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class SeguridadVisitasService {
  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  sCod_Usuario = GlobalVariable.vusu;
  constructor(private http: HttpClient) { }


  SEG_OBTENER_AREAS_TRABAJO(Opcion: string, Cod_Empresa: string, Rh_Cod_Area: string){    
    return this.http.get(`${this.baseUrl}/app_SEG_OBTENER_AREAS_TRABAJO.php?Opcion=${Opcion}&Cod_Empresa=${Cod_Empresa}&Rh_Cod_Area=${Rh_Cod_Area}`);
  }

  SEG_CREAR_VISITA_PLANTA(
    Opcion,
    Id,
    Cod_Empresa,
    Num_Planta,
    Tipo_Documento,
    Nro_DNI,
    Nombres_Visita,
    Empresa,
    Hora_Ingreso,
    Hora_Salida,
    Horas_Planta,
    RH_Cod_Area,
    Area_Visitada,
    Motivo_Visita,
    Persona_Visitada,
    Observaciones,
    Fec_Registro,
    Cod_Usuario
  ){    
    return this.http.get(`${this.baseUrl}/app_SEG_CREAR_VISITA_PLANTA.php?Opcion=${Opcion}&Id=${Id}&Cod_Empresa=${Cod_Empresa}&Num_Planta=${Num_Planta}&Tipo_Documento=${Tipo_Documento}&Nro_DNI=${Nro_DNI}&Nombres_Visita=${Nombres_Visita}&Empresa=${Empresa}&Hora_Ingreso=${Hora_Ingreso}&Hora_Salida=${Hora_Salida}&Horas_Planta=${Horas_Planta}&RH_Cod_Area=${RH_Cod_Area}&Area_Visitada=${Area_Visitada}&Motivo_Visita=${Motivo_Visita}&Persona_Visitada=${Persona_Visitada}&Observaciones=${Observaciones}&Fec_Registro=${Fec_Registro}&Cod_Usuario=${Cod_Usuario}`);
  }


  consultaDNI(DNI: any){    
    return this.http.get(`https://dniruc.apisperu.com/api/v1/dni/${DNI}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRlYXRobWlsZXhAZ21haWwuY29tIn0.OA-i30hxgqCvZhn-MtedXZsjGCRwApDwYXP7D40cB74`);
  }
  
  SEG_TRAER_DATOS_VISITA(Opcion: string, Nro_DNI: string, Num_Planta: any){    
    return this.http.get(`${this.baseUrl}/app_SEG_TRAER_DATOS_VISITA.php?Opcion=${Opcion}&Nro_DNI=${Nro_DNI}&Num_Planta=${Num_Planta}`);
  }
  

  SEG_OBTENER_VISITAS(sFec_Registro: any, Nro_DNI: string, Num_Planta: any){
    if (!_moment(sFec_Registro).isValid()) {
      sFec_Registro = '';
    } else{
      sFec_Registro = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');
    }  
  
    return this.http.get(`${this.baseUrl}/app_SEG_OBTENER_VISITAS.php?Fec_Registro=${sFec_Registro}&Nro_DNI=${Nro_DNI}&Num_Planta=${Num_Planta}`);
  }

  segConsultaRequisitoria(numDocumento: string){    
    return this.http.get(`${this.baseUrl}/app_SG_ConsultaRequisitorias.php?numDocumento=${numDocumento}`);
  }
  

  
}
