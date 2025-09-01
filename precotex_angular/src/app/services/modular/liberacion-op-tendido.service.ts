import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GlobalVariable } from "src/app/VarGlobals";

@Injectable({
    providedIn: 'root'
  })

export class LiberacionOpTendidoService {

    baseUrl = GlobalVariable.baseUrl;
    sCod_Usuario = GlobalVariable.vusu;
    
    constructor(private http: HttpClient) { }
  
    obtenerLiberacionOP(Opcion: string, Cod_OrdPro: string, Flg_Estado: String) {
      return this.http.get(`${this.baseUrl}/modular/app_CO_LIBERAR_OP_TENDIDO.php?Opcion=${Opcion}&Cod_OrdPro=${ Cod_OrdPro }&Flg_Estado=${ Flg_Estado }`);
    }
}