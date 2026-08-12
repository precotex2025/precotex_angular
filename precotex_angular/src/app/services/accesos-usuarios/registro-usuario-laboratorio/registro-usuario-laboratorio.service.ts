import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../../../VarGlobals';
import { MantenimientoUsuarioLabRequest } from 'src/app/interfaces/accesos-usuarios/registro-usuario-laboratorio/request/mantenimiento-usuario-lab.request';
import { AsignarPerfilUsuarioLabRequest } from 'src/app/interfaces/accesos-usuarios/registro-usuario-laboratorio/request/asignar-perfil-usuario-lab.request';
import { ListarPerfilesLabResponse } from 'src/app/interfaces/accesos-usuarios/registro-usuario-laboratorio/response/listar-perfiles-lab.response';
import { MantenimientoUsuarioLabResponse } from 'src/app/interfaces/accesos-usuarios/registro-usuario-laboratorio/response/mantenimiento-usuario-lab.response';
import { AsignarPerfilUsuarioLabResponse } from 'src/app/interfaces/accesos-usuarios/registro-usuario-laboratorio/response/asignar-perfil-usuario-lab.response';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioLaboratorioService {
  private readonly baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  private readonly endpoint = 'AccesoUsuario/';
  private readonly Header = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private readonly http: HttpClient) { }

  getListarPerfilesLab(): Observable<ListarPerfilesLabResponse> {
    return this.http.get<ListarPerfilesLabResponse>(this.baseUrlTinto + this.endpoint + 'getListarPerfilesLab', { headers: this.Header });
  }

  putAsignarPerfilUsuarioLab(data: AsignarPerfilUsuarioLabRequest): Observable<AsignarPerfilUsuarioLabResponse> {
    return this.http.put<AsignarPerfilUsuarioLabResponse>(this.baseUrlTinto + this.endpoint + 'putAsignarPerfilUsuarioLab', data, { headers: this.Header });
  }

  postMantenimientoUsuarioLab(data: MantenimientoUsuarioLabRequest): Observable<MantenimientoUsuarioLabResponse> {
    return this.http.post<MantenimientoUsuarioLabResponse>(this.baseUrlTinto + this.endpoint + 'postMantenimientoUsuarioLab', data, { headers: this.Header });
  }

  putMantenimientoUsuarioLab(data: MantenimientoUsuarioLabRequest): Observable<MantenimientoUsuarioLabResponse> {
    return this.http.put<MantenimientoUsuarioLabResponse>(this.baseUrlTinto + this.endpoint + 'putMantenimientoUsuarioLab', data, { headers: this.Header });
  }

}
