import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalVariable } from '../../../VarGlobals';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioLaboratorioService {
  baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  getListarPerfilesLab() {
    const headers = this.Header;
    return this.http.get(this.baseUrlTinto + 'AccesoUsuario/getListarPerfilesLab', { headers });
  }  

  putAsignarPerfilUsuarioLab(data: any) {
    const headers = this.Header;
    return this.http.put(this.baseUrlTinto + 'AccesoUsuario/putAsignarPerfilUsuarioLab', data, { headers });
  }
  
  postMantenimientoUsuarioLab(postData: any) {
    const headers = this.Header;
    return this.http.post(this.baseUrlTinto + 'AccesoUsuario/postMantenimientoUsuarioLab', postData, { headers });
  }   

  putMantenimientoUsuarioLab(postData: any) {
    const headers = this.Header;
    return this.http.put(this.baseUrlTinto + 'AccesoUsuario/putMantenimientoUsuarioLab', postData, { headers });
  }

}
