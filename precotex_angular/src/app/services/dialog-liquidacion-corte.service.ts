import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariable } from '../VarGlobals';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DialogLiquidacionCorteService {

  baseUrl = GlobalVariable.baseUrl;
  baseUrlLocal = GlobalVariable.baseUrlLocal;
  sCod_Usuario = GlobalVariable.vusu;

  constructor(private http: HttpClient) { }

  verDetalleLiquidacionCorte(cod_op: string, Cod_Tordtra: string,cod_ordtra: string,cod_tela: string,Cod_comb: string,Cod_color: string,modo: string){

    return this.http.get(`${this.baseUrl}/app_liquidacion_corte_retorna_detalle.php?Cod_op=${cod_op}&Cod_Tordtra=${Cod_Tordtra}&cod_ordtra=${cod_ordtra}&Cod_Tela=${cod_tela}&Cod_comb=${Cod_comb}&Cod_color=${Cod_color}&modo=${modo}`);

  }

  verMotivosLiquidacionWeb(){

    return this.http.get(`${this.baseUrl}/app_SM_MUESTRA_MOTIVO_LIQUIDACION_WEB.php`);

  }

  app_SM_MUESTRA_MOTIVO_LIQUIDACION_WEB
  verGrillaDetalles(cod_op: string, cod_tela: string, cod_grupo: string){

    return this.http.get(`${this.baseUrl}/app_liquidacion_corte_grilla_detalles.php?Cod_op=${cod_op}&Cod_Tela=${cod_tela}&Cod_Grupo=${cod_grupo}`);

  }
  listarComboTizado(cod_op: string, Cod_Tordtra: string,cod_ordtra: string,cod_tela: string,Cod_comb: string,Cod_color: string,modo: string) {
    //Cod_op=F2184&Cod_Tordtra=TI&cod_ordtra=G3417&Cod_Tela=JE002634&Cod_comb=%20&Cod_color=011740&modo=I
    return this.http.get(`${this.baseUrl}/app_liquidacion_corte_combo_tizado.php?Cod_op=${cod_op}&Cod_Tordtra=${Cod_Tordtra}&cod_ordtra=${cod_ordtra}&Cod_Tela=${cod_tela}&Cod_comb=${Cod_comb}&Cod_color=${Cod_color}&modo=${modo}`);

  }

  listarCargarConformidad(cod_op: string, Cod_Tordtra: string,cod_ordtra: string,cod_tela: string,Cod_comb: string,Cod_color: string, Cod_calidad: string, modo: string) {
    //Cod_op=F2184&Cod_Tordtra=TI&cod_ordtra=G3417&Cod_Tela=JE002634&Cod_comb=%20&Cod_color=011740&modo=I
    return this.http.get(`${this.baseUrl}/app_CF_CONFORMIDAD_LIQUIDACION_CORTE.php?Cod_op=${cod_op}&Cod_Tordtra=${Cod_Tordtra}&cod_ordtra=${cod_ordtra}&Cod_Tela=${cod_tela}&Cod_comb=${Cod_comb}&Cod_color=${Cod_color}&Cod_calidad=${Cod_calidad}&modo=${modo}`);

  }

  guardarDetalleGrilla1(accion: string,co_codordpro: string,cod_tipordtra: string,cod_ordtra: string,cod_tela: string,cod_comb: string,cod_color: string,
    cod_medida: string,cod_calidad: string,retazos: string,puntas: string,entrecortes: string,tela_fallada: string,dev_1era: string,dev_2da: string,
    depurada: string,peso_por_pano: string,num_panos_tendidos: string,kgs_atendidos: string,num_tendido: string,kgs_accesorios: string,
    merma_retazos_panos: string,kgs_merma_lavanderia: string,kgs_sobrantes_panos: string,kgs_empalmes: string,kgs_tela_recuperada: string,
    retazos_corte_panos: string,puntas_corte_panos: string,ancho_total_real: string,can_anchotizado: string,modo: string, fec_liquidacion: string, cod_motivo: string) {

    return this.http.get(`${this.baseUrl}/app_mantenimiento_ordprotelas_detalle.php?accion=${accion}&co_codordpro=${co_codordpro}&cod_tipordtra=${cod_tipordtra}&cod_ordtra=${cod_ordtra}&
    cod_tela=${cod_tela}&cod_comb=${cod_comb}&cod_color=${cod_color}&cod_medida=${cod_medida}&cod_calidad=${cod_calidad}&retazos=${retazos}&puntas=${puntas}&entrecortes=${entrecortes}&
    tela_fallada=${tela_fallada}&dev_1era=${dev_1era}&dev_2da=${dev_2da}&depurada=${depurada}&peso_por_pano=${peso_por_pano}&num_panos_tendidos=${num_panos_tendidos}&kgs_atendidos=${kgs_atendidos}&
    num_tendido=${num_tendido}&kgs_accesorios=${kgs_accesorios}&merma_retazos_panos=${merma_retazos_panos}&kgs_merma_lavanderia=${kgs_merma_lavanderia}&kgs_sobrantes_panos=${kgs_sobrantes_panos}&
    kgs_empalmes=${kgs_empalmes}&kgs_tela_recuperada=${kgs_tela_recuperada}&retazos_corte_panos=${retazos_corte_panos}&puntas_corte_panos=${puntas_corte_panos}&ancho_total_real=${ancho_total_real}&
    can_anchotizado=${can_anchotizado}&modo=${modo}&fec_liquidacion=${fec_liquidacion}&cod_motivo=${cod_motivo}`);
  }

  guardarDetalleGrilla2(accion: string,cod_ordpro: string,num_tendido: string,secuencia: string,largotendidomts: string,pesoxpanokgs: string,prendasxpano: string,num_panos: string,modo: string) {

    return this.http.get(`${this.baseUrl}/app_Mantenimiento_Tendido_detalle.php?accion=${accion}&cod_ordpro=${cod_ordpro}&num_tendido=${num_tendido}&secuencia=${secuencia}&largotendidomts=${largotendidomts}&pesoxpanokgs=${pesoxpanokgs}&prendasxpano=${prendasxpano}&num_panos=${num_panos}&modo=${modo}`);

  }

}
