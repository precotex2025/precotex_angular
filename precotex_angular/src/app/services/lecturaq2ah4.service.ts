import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';

import * as _moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class Lecturaq2ah4Service {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  showMostrarPendienteQ2H4(x_Tipo, x_CodAlmDest, x_CodAlmOri, x_Num_Mov, x_Cod_item, x_Cod_Proveedor, x_Lote )
    {
       return this.http.get(`${this.baseUrl}/app_muestra_mov_q2_h4.php?Tipo=${x_Tipo}&Cod_Usuario=${this.sCod_Usuario}&Cod_Almacen=${x_CodAlmDest}&Cod_Almacen_Origen=${x_CodAlmOri}&Num_Movstk_Origen=${x_Num_Mov}
       &Cod_Item_O=${x_Cod_item}&Cod_Proveedor_O=${x_Cod_Proveedor}&Cod_OrdProv_O=${x_Lote}`);
    }

    guardarCabDetBultos(xTipo, xCod_OrdProv, xCod_Item, xCod_Proveedor, xCod_Almacen_Origen, xNum_Movstk_Origen, xCantidad, xCod_TipMovi, xNum_Corre)
    {
       return this.http.get(`${this.baseUrl}/app_muestra_mov_q2_h4_Guarda_Detalle.php?Tipo=${xTipo}&Cod_OrdProv=${xCod_OrdProv}&Cod_Item=${xCod_Item}&Cod_Proveedor=${xCod_Proveedor}&Cod_Almacen_Origen=${xCod_Almacen_Origen}
       &Num_Movstk_Origen=${xNum_Movstk_Origen}&Cantidad=${xCantidad}&Cod_TipMovi=${xCod_TipMovi}&Num_Corre=${xNum_Corre}&Cod_Usuario=${this.sCod_Usuario}`);
    }

    generarMovimientoQ2H4(x_Tipo, x_CodAlmDest, x_CodAlmOri, x_Num_Mov, x_Cod_item, x_Cod_Proveedor, x_Lote )
    {
       return this.http.get(`${this.baseUrl}/app_muestra_mov_q2_h4.php?Tipo=${x_Tipo}&Cod_Usuario=${this.sCod_Usuario}&Cod_Almacen=${x_CodAlmDest}&Cod_Almacen_Origen=${x_CodAlmOri}&Num_Movstk_Origen=${x_Num_Mov}
       &Cod_Item_O=${x_Cod_item}&Cod_Proveedor_O=${x_Cod_Proveedor}&Cod_OrdProv_O=${x_Lote}`);
    }




    // showMostrarPendienteQ2H4_Seleccionado(x_Tipo, x_CodAlmDest, x_CodAlmOri, x_Num_Mov, x_Cod_item, x_Cod_Proveedor, x_Lote )
    // {
    //    return this.http.get(`${this.baseUrl}/app_muestra_mov_q2_h4.php?Tipo=${x_Tipo}&Cod_Usuario=${this.sCod_Usuario}&Cod_Almacen=${x_CodAlmDest}&Cod_Almacen_Origen=${x_CodAlmOri}&Num_Movstk_Origen=${x_Num_Mov}
    //    &Cod_Item_O=${x_Cod_item}&Cod_Proveedor_O=${x_Cod_Proveedor}&Cod_OrdProv_O=${x_Lote}`);
    // }


    // showMostrarBultos(x_Tipo, x_CodAlmDest, x_CodAlmOri, x_Num_Mov, x_Cod_item, x_Cod_Proveedor, x_Lote )
    // {
    //    return this.http.get(`${this.baseUrl}/app_muestra_mov_q2_h4.php?Tipo=${x_Tipo}&Cod_Usuario=${this.sCod_Usuario}&Cod_Almacen=${x_CodAlmDest}&Cod_Almacen_Origen=${x_CodAlmOri}&Num_Movstk_Origen=${x_Num_Mov}
    //    &Cod_Item_O=${x_Cod_item}&Cod_Proveedor_O=${x_Cod_Proveedor.trim()}&Cod_OrdProv_O=${x_Lote}`);
    // }

}
