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

  getRutaXCodTela(Cod_Tela: string) {
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("cod_tela", Cod_Tela);
    return this.http.get(this.baseUrlTinto + 'txCotizaciones/getRutaXCodTela', { headers, params });
  }

  getRutaXCodTelaDetalle(Cod_Tela: string, Cod_Ruta: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Cod_Tela", Cod_Tela);
    params = params.append("Cod_Ruta", Cod_Ruta);
    return this.http.get(this.baseUrlTinto + 'txCotizaciones/getRutaXCodTelaDetalle', { headers, params });
  }

  getListaTelas(Cod_Tela: string) {
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Cod_Tela", Cod_Tela);
    return this.http.get(this.baseUrlTinto + 'txCotizaciones/getListaTelas', { headers, params });
  }



}
