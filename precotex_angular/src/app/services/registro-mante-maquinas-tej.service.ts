import { Injectable } from '@angular/core';
import { GlobalVariable } from '../VarGlobals';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class RegistroManteMaquinasTejService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  UrlBase: string = GlobalVariable.baseUrlProcesoTenido;
  sCod_Usuario = GlobalVariable.vusu;

  Header = new HttpHeaders({
    'Content-type': 'application/json'
  });  


  constructor(private http: HttpClient) { }

  listadoDatosService(sCod_Accion:string, SFechaReg: string, SFechaReg2: string, sMaquina: string, sOt:string, Tarea: string ) {
    return this.http.get(`${this.baseUrl}/app_listar_opciones_man_maqui_tej.php?Cod_Accion=${sCod_Accion}
    &sFecha=${SFechaReg}&sFecha2=${SFechaReg2}&sMaquina=${sMaquina}&sOt=${sOt}&sTarea=${Tarea}&Cod_Usuario=${this.sCod_Usuario}`);
  }


  ingresaTareaManteMaquina(sFec_Registro: string, cod_maquina: string, cod_tarea: string, ot:string, finicio: string, 
                          hinicio: string, ffin: string,hfin: string, observacion: string, dni: string) {



    let sFec_Despacho="";
    let sFec_Inicio="";
    let sFec_Fin="";

    let dtinicio="";
    let dtfin="";

    if (!_moment(sFec_Registro).isValid()) { sFec_Despacho = '01/01/1900';  }
    sFec_Despacho = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');

    if (!_moment(finicio).isValid()) { sFec_Inicio = '01/01/1900';  }
    sFec_Inicio = _moment(finicio.valueOf()).format('DD/MM/YYYY');
    dtinicio=sFec_Inicio + ' ' + hinicio;

    if (!_moment(ffin).isValid()) { sFec_Fin = '01/01/1900';  }
    sFec_Fin = _moment(ffin.valueOf()).format('DD/MM/YYYY');
    //console.log(sFec_Fin);
    if(sFec_Fin=='Invalid date') {  dtfin='';  } else {
      dtfin=sFec_Fin + ' ' + hfin;
    }

    return this.http.get(`${this.baseUrl}/app_mante_maqui_tej.php?Accion=I
    &Fec_Registro=${sFec_Despacho}&Cod_Maquina=${cod_maquina}&Nro_DocIde=${dni}&CodTarea=${cod_tarea}&Cod_Ordtra=${ot}
    &Fec_Hora_Inicio=${dtinicio}&Fec_Hora_Fin=01/01/1900 00:00&Observacion=${observacion}&Cod_Usuario=${this.sCod_Usuario}`);
  }







  
  guardarEditarEliminarMantenimiento(xAccion: string, sNum_Mante: string, sFec_Registro: string, cod_maquina: string, cod_tarea: string, ot:string,finicio: string, 
                             hinicio: string, ffin: string,hfin: string, observacion: string, dni: string,
                             Cod_Espe: string, Cod_Articulo: string, Cod_Area_Tej_Mante_Maq: string, Cod_Tej_Cond: string, Cod_ParMaq_Tej: string, Cod_TipFall: string )
  {

    

    let sFec_Despacho="";
    let sFec_Inicio="";
    let sFec_Fin="";
    let dtinicio="";
    let dtfin="";


 if (xAccion == 'I')
 {

    if (!_moment(sFec_Registro).isValid()) 
    { 
      
      sFec_Despacho = '01/01/1900';  
    }
      //sFec_Despacho = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');
      sFec_Despacho = sFec_Registro;

    if (!_moment(finicio).isValid()) 
    { 
      sFec_Inicio = '01/01/1900';  
    }
      //sFec_Inicio = _moment(finicio.valueOf()).format('DD/MM/YYYY');
      dtinicio= finicio + ' ' + hinicio;

     dtfin='';  
     //console.log("fecha reg recibida: "+finicio)
 }
 else
 {

    if (!_moment(ffin).isValid()) { sFec_Fin = '01/01/1900';  }
    sFec_Fin = _moment(ffin.valueOf()).format('DD/MM/YYYY');
    //console.log(sFec_Fin);
    if(sFec_Fin=='Invalid date') {  dtfin='';  } else {
      dtfin=sFec_Fin + ' ' + hfin;
    }
    
     sFec_Despacho = sFec_Registro;
     dtinicio=finicio + ' ' + hinicio;
    

 }


 //console.log("fecha reg enviada: "+sFec_Despacho)

//Cod_Espe: string, Cod_Articulo: string, Cod_Area_Tej_Mante_Maq: string, Cod_Tej_Cond: string, Cod_ParMaq_Tej: string, Cod_TipFall: string )
    return this.http.get(`${this.baseUrl}/app_mante_maqui_tej_v2.php?
    Accion=${xAccion}
    &Num_Mante=${sNum_Mante}
    &Fec_Registro=${sFec_Despacho}
    &Cod_Maquina=${cod_maquina}
    &Nro_DocIde=${dni}
    &CodTarea=${cod_tarea}
    &Cod_Ordtra=${ot}
    &Fec_Hora_Inicio=${dtinicio}
    &Fec_Hora_Fin=${dtfin}
    &Observacion=${observacion}
    &Cod_Usuario=${this.sCod_Usuario}
    &Cod_Espe=${Cod_Espe}
    &Cod_Articulo=${Cod_Articulo}
    &Cod_Area_Tej_Mante_Maq=${Cod_Area_Tej_Mante_Maq}
    &Cod_Tej_Cond=${Cod_Tej_Cond}
    &Cod_ParMaq_Tej=${Cod_ParMaq_Tej}
    &Cod_TipFall=${Cod_TipFall}`);
  }






  eliminarTareaMaquinaTej(sFec_Registro: string, cod_maquina: string, cod_tarea: string,finicio: string, ffin: string, dni:string, ot:string) {
    let sFec_Despacho="";
    let sFec_Inicio="";
    let sFec_Fin="";
  

    return this.http.get(`${this.baseUrl}/app_mante_maqui_tej.php?Accion=D&Fec_Registro=${sFec_Registro}
    &Cod_Maquina=${cod_maquina}&Nro_DocIde=${dni}&CodTarea=${cod_tarea}&Cod_Ordtra=${ot}&Fec_Hora_Inicio=${finicio}&Fec_Hora_Fin=${ffin}
    &Observacion=&Cod_Usuario=${this.sCod_Usuario}`);

  }




  


  ListarReporteDetallado(FechaR: string, FechaR2: string) {
    return this.http.get(`${this.baseUrl}/app_mostrar_reporte_mante_maquinas.php?
    Cod_Maquina=''&Cod_OrdTra=''&Cod_Tarea=''&Fec_Registro=${FechaR}&Fec_Registro2=${FechaR2}`);
  }


  traerTejedorTra(Cod_Trabajador: string, Tip_Trabajador: string ) {
    return this.http.get(`${this.baseUrl}/app_muestra_nom_trabajador_cod_trabajador.php?Cod_Trabajador=${Cod_Trabajador}&Tip_Trabajador=${Tip_Trabajador}`);
  }



  ListarEspecialidad(xdni){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej.php?Opcion=ET&Cod_Tarea=&Cod_Articulo=&xDni=${xdni}`);
  }


  
  ListarArea(){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej.php?Opcion=AR&Cod_Tarea=&Cod_Articulo=&xDni=`);
  }

  ListarCondicion(){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej.php?Opcion=CO&Cod_Tarea=&Cod_Articulo=&xDni=`);
  }


  ListarTipoFalla(Cod_tarea : string){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej.php?Opcion=TF&Cod_Tarea=${Cod_tarea}&Cod_Articulo=&xDni=`);
  }

  
  ListarArticulo(Cod_tarea : string){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej.php?Opcion=TA&Cod_Tarea=${Cod_tarea}&Cod_Articulo=&xDni=`);
  }

  ListarArticuloMinMax(Cod_tarea : string, Cod_Articulo: string){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej.php?Opcion=TA2&Cod_Tarea=${Cod_tarea}&Cod_Articulo=${Cod_Articulo}&xDni=`);
  }


  ListarParoMaquina(){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej.php?Opcion=PM&Cod_Tarea=&Cod_Articulo=&xDni=`);
  }

  //Agregado por HMEDINA.
  getListaUsuarioSedeByUser(){
    const headers = this.Header;
    let params = new HttpParams();
    params = params.append('pCodUsuario', this.sCod_Usuario);

    return this.http.get(this.UrlBase + 'UsuarioSede/getListaUsuarioSedeByUser', { headers, params });
  }

  ListarAreaBySede(Num_Planta: string){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej_sede.php?Opcion=AR&Cod_Tarea=&Cod_Articulo=&xDni=&Num_Planta=${Num_Planta}&Cod_Area=`);
  }

  ListarTareaByArea(Num_Planta: string, Cod_Area: string){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej_sede.php?Opcion=LT&Cod_Tarea=&Cod_Articulo=&xDni=&Num_Planta=${Num_Planta}&Cod_Area=${Cod_Area}`);
  }

    
  ListarArticuloSede(Num_Planta: string, Cod_Area: string, Cod_tarea : string){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej_sede.php?Opcion=TA&Cod_Tarea=${Cod_tarea}&Cod_Articulo=&xDni=&Num_Planta=${Num_Planta}&Cod_Area=${Cod_Area}`);
  }

  ListarTipoFallaSede(Num_Planta: string, Cod_Area: string, Cod_tarea : string){
    return this.http.get(`${this.baseUrl}/app_listar_opciones_mant_maq_tej_sede.php?Opcion=TF&Cod_Tarea=${Cod_tarea}&Cod_Articulo=&xDni=&Num_Planta=${Num_Planta}&Cod_Area=${Cod_Area}`);
  }  

  guardarEditarEliminarMantenimientoSede(xAccion: string, sNum_Mante: string, sFec_Registro: string, cod_maquina: string, cod_tarea: string, ot:string,finicio: string, 
    hinicio: string, ffin: string,hfin: string, observacion: string, dni: string,
    Cod_Espe: string, Cod_Articulo: string, Cod_Area_Tej_Mante_Maq: string, Cod_Tej_Cond: string, Cod_ParMaq_Tej: string, Cod_TipFall: string,
    Observacion2: string, Flg_Atribuido: string, Num_Planta: string)
  {

    let sFec_Despacho="";
    let sFec_Inicio="";
    let sFec_Fin="";
    let dtinicio="";
    let dtfin="";


    if (xAccion == 'I')
    {
      
      if (!_moment(sFec_Registro).isValid()) 
      { 

      sFec_Despacho = '01/01/1900';  
      }
      //sFec_Despacho = _moment(sFec_Registro.valueOf()).format('DD/MM/YYYY');
      sFec_Despacho = sFec_Registro;

      if (!_moment(finicio).isValid()) 
      { 
      sFec_Inicio = '01/01/1900';  
      }
      //sFec_Inicio = _moment(finicio.valueOf()).format('DD/MM/YYYY');
      dtinicio= finicio + ' ' + hinicio;

      dtfin='';  
      //console.log("fecha reg recibida: "+finicio)
    }
    else
    {

      if (!_moment(ffin).isValid()) { sFec_Fin = '01/01/1900';  }
      sFec_Fin = _moment(ffin.valueOf()).format('DD/MM/YYYY');
      //console.log(sFec_Fin);
      if(sFec_Fin=='Invalid date') {  dtfin='';  } else {
      dtfin=sFec_Fin + ' ' + hfin;
      }

      sFec_Despacho = sFec_Registro;
      dtinicio=finicio + ' ' + hinicio;

    }
    //console.log("fecha reg enviada: "+sFec_Despacho)

    //Cod_Espe: string, Cod_Articulo: string, Cod_Area_Tej_Mante_Maq: string, Cod_Tej_Cond: string, Cod_ParMaq_Tej: string, Cod_TipFall: string )
    return this.http.get(`${this.baseUrl}/app_mante_maqui_tej_v2_sede.php?
    Accion=${xAccion}
    &Num_Mante=${sNum_Mante}
    &Fec_Registro=${sFec_Despacho}
    &Cod_Maquina=${cod_maquina}
    &Nro_DocIde=${dni}
    &CodTarea=${cod_tarea}
    &Cod_Ordtra=${ot}
    &Fec_Hora_Inicio=${dtinicio}
    &Fec_Hora_Fin=${dtfin}
    &Observacion=${observacion}
    &Cod_Usuario=${this.sCod_Usuario}
    &Cod_Espe=${Cod_Espe}
    &Cod_Articulo=${Cod_Articulo}
    &Cod_Area_Tej_Mante_Maq=${Cod_Area_Tej_Mante_Maq}
    &Cod_Tej_Cond=${Cod_Tej_Cond}
    &Cod_ParMaq_Tej=${Cod_ParMaq_Tej}
    &Cod_TipFall=${Cod_TipFall}

    &Observacion2=${Observacion2}
    &Flg_Atribuido=${Flg_Atribuido}
    &Num_Planta=${Num_Planta}`);
  }

  listadoDatosServiceSede(sCod_Accion:string, SFechaReg: string, SFechaReg2: string, sMaquina: string, sOt:string, Tarea: string, Num_Planta: string) {
    return this.http.get(`${this.baseUrl}/app_listar_opciones_man_maqui_tej_sede.php?Cod_Accion=${sCod_Accion}
    &sFecha=${SFechaReg}&sFecha2=${SFechaReg2}&sMaquina=${sMaquina}&sOt=${sOt}&sTarea=${Tarea}&Cod_Usuario=${this.sCod_Usuario}&Num_Planta=${Num_Planta}`);
  }

  ListarReporteDetalladoSede(FechaR: string, FechaR2: string, Num_Planta: string) {
    return this.http.get(`${this.baseUrl}/app_mostrar_reporte_mante_maquinas_sede.php?
    Cod_Maquina=''&Cod_OrdTra=''&Cod_Tarea=''&Fec_Registro=${FechaR}&Fec_Registro2=${FechaR2}&Cod_Usuario=${this.sCod_Usuario}&Num_Planta=${Num_Planta}`);
  }




}

//sFec_Inicio = _moment(finicio.valueOf()).format('DD/MM/YYYY');