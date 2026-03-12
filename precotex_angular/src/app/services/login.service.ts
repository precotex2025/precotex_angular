import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Login } from '../models/login';
import { GlobalVariable } from '../VarGlobals';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  baseUrl = GlobalVariable.baseUrl;
  sCod_Usuario = GlobalVariable.vusu;

  baseUrlTinto = GlobalVariable.baseUrlProcesoTenido;
  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });

  //_url: string ="/ws_android/app_login.php";
  //_url: string ="https://gestion.precotex.com/ws_android/app_login.php";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  validarUsuario(login: Login) {
    //console.log(this.baseUrl);
    return this.http.post<any>(`${this.baseUrl}/app_login_sc.php`, login)
  }

  validarUsuario2(login: Login) {
    //console.log(this.baseUrl);
    return this.http.post<any>(`${this.baseUrl}/app_login_sc_copia.php`, login)
  }

  validarUsuarioTest(login) {
    //console.log(this.baseUrl);
    return this.http.post<any>(`https://localhost:7261/api/Login`, login)
  }

  MuestraMenu(Cod_Rol: number, Cod_Empresa: string) {
    this.sCod_Usuario = GlobalVariable.vusu;
    return this.http.get(`${this.baseUrl}/app_muestra_menu_copia.php?Cod_Rol=${Cod_Rol}&Cod_Empresa=${Cod_Empresa}`);
  }



  MuestraOpcion() {
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

  getValidaAccesoRol(Ruta: string, Cod_Rol: number) {
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('Ruta', Ruta);
    params = params.append('Cod_Rol', Cod_Rol);
    return this.http.get(this.baseUrlTinto + 'TxLogin/getValidaAccesoRol', { headers, params })
  }


  Entra: string = '';
  MetodoGeneralValidarAcceso(Ruta: string, Cod_Rol: number): void {
    this.getValidaAccesoRol(Ruta, Cod_Rol).subscribe({
      next: (response: any) => {
        if(response.success){
          this.Entra = response.elements[0].resultado;
          if (this.Entra == 'N'){
            this.router.navigate(['/']);
          }
        }
      },
      error: (error: any) => {

      }
    });
  }

}
