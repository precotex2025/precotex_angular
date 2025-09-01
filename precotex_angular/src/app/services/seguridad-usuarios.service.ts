import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../VarGlobals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguridadUsuariosService {
  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  sCod_Usuario = GlobalVariable.vusu;
  constructor(private http: HttpClient) { }

  verUsuariosBd(Empresa: string){    
    return this.http.get(`${this.baseUrl}/seg_obtener_usuarios_bd.php?Empresa=${Empresa}`);
  }

  recalcularAsistencia(Fecha: string){    
    return this.http.get(`${this.baseUrl}/app_Guardar_Asistencia_Periodo.php?Fecha=${Fecha}`);
  }

  app_seg_pago_bono(Fecha: string){    
    return this.http.get(`${this.baseUrl}/app_seg_pago_bono.php?Fecha=${Fecha}`);
  }

  

  validarCodUsuariosBd(Cod_Usuario: string){    
    return this.http.get(`${this.baseUrl}/seg_validar_cod_usuario.php?Cod_Usuario=${Cod_Usuario}`);
  }

  seg_obtener_cod_usuario(Cod_Trabajador: string, Tip_Trabajador: string, Cod_Empresa: string){    
    return this.http.get(`${this.baseUrl}/seg_obtener_cod_usuario.php?Cod_Trabajador=${Cod_Trabajador}&Tip_Trabajador=${Tip_Trabajador}&Cod_Empresa=${Cod_Empresa}`);
  }

  seg_insertar_usuario_Web(Cod_Usuario, Nom_Usuario, Password, Tip_Trabajador, Cod_Trabajador, Empresa, Flg_Activo, Cod_Usuario_Reg){    
    return this.http.get(`${this.baseUrl}/seg_insertar_usuario_web.php?Cod_Usuario=${Cod_Usuario}&Nom_Usuario=${Nom_Usuario}&Password=${Password}&Tip_Trabajador=${Tip_Trabajador}&Cod_Trabajador=${Cod_Trabajador}&Empresa=${Empresa}&Flg_Activo=${Flg_Activo}&Cod_Usuario_Reg=${Cod_Usuario_Reg}`);
  }

  
}
