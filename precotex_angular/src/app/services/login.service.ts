import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { GlobalVariable } from '../VarGlobals';


@Injectable({
  providedIn: 'root'
})
export class LoginService { 

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;
 
  //_url: string ="/ws_android/app_login.php";
  //_url: string ="https://gestion.precotex.com/ws_android/app_login.php";

  constructor(private http: HttpClient) { }
  
  validarUsuario(login: Login){
    //console.log(this.baseUrl);
    return this.http.post<any>(`${this.baseUrl}/app_login_sc.php`,login)
  } 

  validarUsuario2(login: Login){
    //console.log(this.baseUrl);
    return this.http.post<any>(`${this.baseUrl}/app_login_sc_copia.php`,login)
  } 

  validarUsuarioTest(login){
    //console.log(this.baseUrl);
    return this.http.post<any>(`https://localhost:7261/api/Login`,login)
  } 

  MuestraMenu(Cod_Rol: number, Cod_Empresa: string){
    this.sCod_Usuario = GlobalVariable.vusu;
    return this.http.get(`${this.baseUrl}/app_muestra_menu_copia.php?Cod_Rol=${Cod_Rol}&Cod_Empresa=${Cod_Empresa}`);
  }

  

  MuestraOpcion(){
    this.sCod_Usuario = GlobalVariable.vusu;
    return this.http.get(`${this.baseUrl}/app_muestra_opcion.php?Cod_Usuario=${this.sCod_Usuario}`);
  }


  ValidaMuestraMenuSeguridad() {
    this.sCod_Usuario = GlobalVariable.vusu;
    return this.http.get(`${this.baseUrl}/app_muestra_menu_seguridad.php?Cod_Usuario=${this.sCod_Usuario}`);
  }

  ValidaMuestraMenuCalidad() {
    this.sCod_Usuario = GlobalVariable.vusu;
    return this.http.get(`${this.baseUrl}/app_muestra_menu_calidad.php?Cod_Usuario=${this.sCod_Usuario}`);
  }  

  ValidaMuestraMenuMovimiento() {
    this.sCod_Usuario = GlobalVariable.vusu;
    return this.http.get(`${this.baseUrl}/app_muestra_menu_movimiento.php?Cod_Usuario=${this.sCod_Usuario}`);
  }  
}
