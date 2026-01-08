import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
    Header = new HttpHeaders({
      'Content-type': 'application/json'
    });
    constructor(private http: HttpClient) { }
  
  getListarProcesosExportacion(Pro_Cen_Cos: string){
      const headers = this.Header;
      let params = new HttpParams();
      params = params.append("Pro_Cen_Cos", Pro_Cen_Cos)
      return this.http.get(this.baseUrlTinto + 'TxCotizaciones/getListarProcesosExportacion', { headers, params });
    }

}
