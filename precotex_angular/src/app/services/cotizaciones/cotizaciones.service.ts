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
  
  getListarProcesosExportacion(Pro_Cen_Cos: number, Tipo: string, Cod_Cliente_Tex: string, Cod_Tela: string, Cod_Ruta: string, Cod_Color: string){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Pro_Cen_Cos", Pro_Cen_Cos);
    params = params.append("Tipo", Tipo);
    params = params.append("Cod_Cliente_Tex", Cod_Cliente_Tex);
    params = params.append("Cod_Tela", Cod_Tela);
    params = params.append("Cod_Ruta", Cod_Ruta);
    params = params.append("Cod_Color", Cod_Color);
    return this.http.get(this.baseUrlTinto + 'TxCotizaciones/getListarProcesosExportacion', { headers, params });
  }

  getListarProcesosExportacionFooter(Pro_Cen_Cos: number){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Pro_Cen_Cos", Pro_Cen_Cos);
    return this.http.get(this.baseUrlTinto + 'TxCotizaciones/getListarProcesosExportacionFooter', { headers, params });
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

  getListaCentroCosto() {
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'txCotizaciones/getListaCentroCosto', { headers });
  }

  postProcesoCotizacion(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'txCotizaciones/postProcesoCotizacion', data, { headers })
  }  

  getValidaColorExiste(Cod_Color: string) {
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Cod_Color", Cod_Color);
    return this.http.get(this.baseUrlTinto + 'txCotizaciones/getValidaColorExiste', { headers, params });
  }  

  getListaUnidadNegocio() {
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'txCotizaciones/getListaUnidadNegocio', { headers });
  }  

  getListaIntensidad(Id_Unidad_NegocioKey: number) {
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Id_Unidad_NegocioKey", Id_Unidad_NegocioKey);
    return this.http.get(this.baseUrlTinto + 'txCotizaciones/getListaIntensidad', { headers, params });
  }  

  getListaHiladoxTela(Cod_Tela: string) {
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Cod_Tela", Cod_Tela);
    return this.http.get(this.baseUrlTinto + 'txCotizaciones/getListaHiladoxTela', { headers, params });
  }    

  getListaUnidadNegocioTipo(Id_Unidad_NegocioKey: number) {
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Id_Unidad_NegocioKey", Id_Unidad_NegocioKey);
    return this.http.get(this.baseUrlTinto + 'txCotizaciones/getListaUnidadNegocioTipo', { headers, params });
  }   


}
