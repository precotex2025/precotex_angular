import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AprofabriccardService {


  baseUrl      = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  mantenimientoAprobacionFabricService(Num_Fabric: string, Cod_OrdTra: string, FecRegIni: string, FecRegFin: string, Des_TemCli: string, Cod_Usuario: string) {
    return this.http.get(`${this.baseUrl}/app_mante_aprobacion_fabric_card.php?Num_Fabric=${Num_Fabric}&Cod_OrdTra=${Cod_OrdTra}&FecRegIni=${FecRegIni}&FecRegFin=${FecRegFin}&Des_TemCli=${Des_TemCli}&Cod_Usuario=${this.sCod_Usuario}`);                                             
  }
  

  GuardarServiceCopia(data: any) {
      //return this.http.get(`${this.baseUrl}/app_man_registro_control_guia.php?Accion=${'I'}&Num_Planta=${nNum_Planta}&Cod_Accion=${sCod_Accion}&Num_Guia=${sNum_Guia}&Cod_Proveedor=${sCod_Proveedor}&Num_Planta_Destino=${nNum_Planta_Destino}&Num_Planta_Origen=${nNum_Planta_Origen}&Dni_Entregado=${sDni_Entregado}&Num_Bulto=${nNum_Bulto}&Num_Cantidad=${nNum_Cantidad}&Num_Peso=${nNum_Peso}&Dni_Despachado=${sDni_Despachado}&Glosa=${sGlosa}&Cod_Usuario=${this.sCod_Usuario}`);
      return this.http.post(`${this.baseUrl}/app_man_registro_aprobacion_fabricard.php`, data);

  }


  RecepcionarFabricard(data: any) {
    return this.http.post(`${this.baseUrl}/app_man_recepcion_fabricard.php`, data);

}

}
