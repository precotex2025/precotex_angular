import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from 'src/app/VarGlobals';
import _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LecturaBultosService {

  baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  getListarAlmacenesDisponibles(){
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'LecturaBultos/getListarAlmacenesDisponibles', { headers })
  }

  getListarMovimientos(Num_MovStk: string, Cod_Almacen: string, Fec_MovStk: any, Flg_Pendiente: string){
    
    if(!_moment(Fec_MovStk).isValid())
    { Fec_MovStk = ''; }
    else
    //{ Fec_MovStk = _moment(Fec_MovStk.valueOf()).format('YYYY-MM-DD'); }
    { Fec_MovStk = _moment(Fec_MovStk.valueOf()).format('DD/MM/YYYY'); }

    // console.log(Num_MovStk);
    // console.log(Fec_MovStk);

    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Num_MovStk", Num_MovStk ?? "");
    params = params.append("Cod_Almacen", Cod_Almacen ?? "");
    params = params.append("Fec_MovStk", Fec_MovStk ?? null);
    params = params.append("Flg_Pendiente", Flg_Pendiente ?? "N");

    return this.http.get(this.baseUrlTinto + 'LecturaBultos/getListarMovimientos', { headers, params })
  }

  getListarBultos(Num_MovStk: string, Cod_Almacen: string) {
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append("Num_MovStk", Num_MovStk);
    params = params.append("Cod_Almacen", Cod_Almacen);
    return this.http.get(this.baseUrlTinto + 'LecturaBultos/getListarBultos', { headers, params })
  }
  
  patchLecturarBulto(data: any) {
    const headers = this.Header;
    return this.http.patch(this.baseUrlTinto + 'LecturaBultos/patchLecturarBulto', data, { headers })
  }

}
