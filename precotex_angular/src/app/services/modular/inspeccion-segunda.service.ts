import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';

@Injectable({
  providedIn: 'root'
})
export class InspeccionSegundaService {
  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  CF_MUESTRA_INSPECCION_LECTURA_TICKET(Ticket: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MUESTRA_INSPECCION_LECTURA_TICKET_RECUPERACION.php?Ticket=${Ticket}`);
  }

  //INSPECCION SEGUNDAS
  CF_Modular_Inspeccion_Prenda_Seg_Web(Cod_Accion: string, Cod_Fabrica: string, Cod_OrdPro: string, Cod_Present: number, Cod_Talla: string, Num_Paquete: string, Prendas_Paq: number, Ticket: string, Tipo_Ticket:string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Inspeccion_Prenda_Seg_Web.php?Accion=${Cod_Accion}&Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Talla=${Cod_Talla}&Prendas_Paq=${Prendas_Paq}&Num_Paquete=${Num_Paquete}&Cod_Usuario=${this.sCod_Usuario}&Ticket=${Ticket}&Tipo_Ticket=${Tipo_Ticket}`);
  }

  //INSPECCION MANUAL
  CF_Modular_Inspeccion_Prenda_Man_Web(Cod_Accion: string, Cod_Fabrica: string, Cod_OrdPro: string, Cod_Present: number, Cod_Talla: string, Num_Paquete: string, Prendas_Paq: number, Ticket: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Inspeccion_Prenda_Man_Web.php?Accion=${Cod_Accion}&Cod_Fabrica=${Cod_Fabrica}&Cod_OrdPro=${Cod_OrdPro}&Cod_Present=${Cod_Present}&Cod_Talla=${Cod_Talla}&Prendas_Paq=${Prendas_Paq}&Num_Paquete=${Num_Paquete}&Cod_Usuario=${this.sCod_Usuario}&Ticket=${Ticket}`);
  }

  

  CF_MODULAR_INSPECCION_PRENDAS(Id: number) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_INSPECCION_PRENDAS.php?Id=${Id}`);
  }

  CF_MODULAR_RESUMEN_POR_RECOJER_INSPECTORA(Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_RESUMEN_POR_RECOJER_INSPECTORA.php?Cod_Usuario=${Cod_Usuario}`);
  }

  CF_Modular_Agregar_Prenda_Web(Accion: string, Id: number, Id_Numero_Prenda: string, Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Agregar_Prenda_Web.php?Accion=${Accion}&Id=${Id}&Id_Numero_Prenda=${Id_Numero_Prenda}&Cod_Usuario=${Cod_Usuario}`);
  }

  CF_Modular_Agregar_Prenda_Man_Web(Accion: string, Id: number, Id_Numero_Prenda: string, Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Agregar_Prenda_Man_Web.php?Accion=${Accion}&Id=${Id}&Id_Numero_Prenda=${Id_Numero_Prenda}&Cod_Usuario=${Cod_Usuario}`);
  }

  CF_Man_Modular_Auditoria_Finaliza_Web(Accion:string, Flg_Estado: string, Id: number, Muestra: number, Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Man_Modular_Auditoria_Finaliza_Web.php?Accion=${Accion}&Flg_Estado=${Flg_Estado}&Id=${Id}&Muestra=${Muestra}&Cod_Usuario=${Cod_Usuario}`);
  }
  

  CF_Modular_Inspeccion_Prenda_Finalizado_Web(Id: number, Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Modular_Inspeccion_Prenda_Finalizado_Web.php?Id=${Id}&Cod_Usuario=${Cod_Usuario}`);
  }

  CF_MODULAR_SEGUNDA_DEFECTO_FAMILIA(Id: number, Cod_Familia: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_MODULAR_SEGUNDA_DEFECTO_FAMILIA.php?Id=${Id}&Cod_Familia=${Cod_Familia}`);
  }

  CF_Man_Modular_Segundas_Detalle_Web(Accion: string, Id: number, Cod_Familia: string, Cod_Defecto: string, Id_Numero_Prenda: string, Defecto_Leve: string, Defecto_Critico: string, Usuario: string) {
    return this.http.get(`${this.baseUrl}/modular/app_CF_Man_Modular_Segundas_Detalle_Web.php?Accion=${Accion}&Id=${Id}&Cod_Familia=${Cod_Familia}&Cod_Defecto=${Cod_Defecto}&Id_Numero_Prenda=${Id_Numero_Prenda}&Defecto_Leve=${Defecto_Leve}&Defecto_Critico=${Defecto_Critico}&Usuario=${Usuario}`);
  }
  
  
}
