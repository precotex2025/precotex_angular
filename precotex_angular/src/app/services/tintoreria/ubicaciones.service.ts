import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVariable } from '../../VarGlobals';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  baseUrlTinto  = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  constructor(private http: HttpClient) { }

  getListaBultoUbicaciones(Cod_Almacen, Codigo_Barra_Grupo){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Almacen', Cod_Almacen);
    params = params.append('Codigo_Barra_Grupo', Codigo_Barra_Grupo);

    return this.http.get(this.baseUrlTinto + 'Ubicaciones/getListaBultoUbicaciones', { headers, params });
  }

  getListaAgrupamientosDelDia(Fec_Creacion, Codigo_Barra_Grupo){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Fec_Creacion', Fec_Creacion);
    params = params.append('Codigo_Barra_Grupo', Codigo_Barra_Grupo);

    return this.http.get(this.baseUrlTinto + 'Ubicaciones/getListaAgrupamientosDelDia', { headers, params });
  }  

  getListaDetalleBultosAgrupados(Cod_Almacen, Id_Agrupamiento, Codigo_Barra_Grupo) {
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Almacen', Cod_Almacen);
    params = params.append('Id_Agrupamiento', Id_Agrupamiento);
    params = params.append('Codigo_Barra_Grupo', Codigo_Barra_Grupo);

    return this.http.get(this.baseUrlTinto + 'Ubicaciones/getListaDetalleBultosAgrupados', { headers, params });
  }  

  postInsertarBultoGrupo(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'Ubicaciones/postInsertarBultoGrupo', data, { headers })
  }

  postUbicarGrupoOBulto(data: any){
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'Ubicaciones/postUbicarGrupoOBulto', data, { headers })
  }  

  getConsultaKardexPda(Cod_Almacen, Codigo_Escaneado){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Cod_Almacen', Cod_Almacen);
    params = params.append('Codigo_Escaneado', Codigo_Escaneado);

    return this.http.get(this.baseUrlTinto + 'Ubicaciones/getConsultaKardexPda', { headers, params });
  }  
}
