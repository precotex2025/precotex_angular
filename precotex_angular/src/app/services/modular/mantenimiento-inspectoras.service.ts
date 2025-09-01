import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalVariable } from "src/app/VarGlobals";

@Injectable({
    providedIn: 'root'
  })

export class ModularMantenimientoInspectorasService {

    baseUrl = GlobalVariable.baseUrl;
    sCod_Usuario = GlobalVariable.vusu;
    
    constructor(private http: HttpClient) { }
  
    obtenerModuloInpectoras(Opcion: string, Cod_Usuario: string, Nom_Usuario: string, Tip_Trabajador: String, Cod_Trabajador: string, Cod_Modulo: String) {
      return this.http.get(`${this.baseUrl}/modular/app_CF_ASIGNAR_INSPECTOR_MODULO_WEB.php?Opcion=${Opcion}&Cod_Usuario=${ Cod_Usuario }&Nom_Usuario=${ Nom_Usuario }&Tip_Trabajador=${ Tip_Trabajador }&Cod_Trabajador=${ Cod_Trabajador }&Cod_Modulo=${ Cod_Modulo }`);
    }
}