export class Tx_Muestra_Control_Proceso {

    fecha 	        :Date = null;
    nrO_REFERENCIA  :string = '';
    horA_CARGA 		:string = '';
    operario 		:string = '';
    maquina 		:string = '';
    partida 		:string = '';
    color 			:string = '';
    articulo 		:string = '';
    peso 			:number = 0;
    cuerdas  		:string = '';
    cliente 		:string = '';
    relbano 		:string = '';
    volreceta 		:number = 0;	

    /*PARAMETROS CRUDO*/
    cR_ANCHO 	: number = 0;
    cR_DENSIDAD : number = 0;

    /*PARAMETROS PREVIO*/
    pR_BAR 				: number = 0;
    pR_TOBERA 			: number = 0;
    pR_ACUMULADOR 		: number = 0;
    pR_BOMBA 			: number = 0;
    pR_VELOCIDAD 		: number = 0;
    pR_TIEMPO_CICLO_1 	: number = 0;
    pR_NIV_BANO_MAQ 	: number = 0;
    pR_PH_PILLING 		: number = 0;
    pR_PH_PILLING_2 	: number = 0;

    /*PARAMETROS TEÑIDO REACTIVO*/
    tR_BAR 					: number = 0;
    tR_TOBERA 				: number = 0;
    tR_ACUMULADOR 			: number = 0;
    tR_BOMBA 				: number = 0;
    tR_VELOCIDAD 			: number = 0;
    tR_TIEMPO_CICLO_1 		: number = 0;
    tR_VOLUMEN 				: number = 0;
    tR_NIV_BANO_MAQ_1 		: number = 0;
    tR_PH_INICIO1_CSAL		: number = 0;	
    tR_PH_INICIO2_CSAL		: number = 0;	
    tR_PH_INICIO1_SSAL 		: number = 0;
    tR_PH_INICIO2_SSAL 		: number = 0;
    tR_DENSIDAD_SAL_1		: number = 0;	
    tR_DENSIDAD_SAL_2		: number = 0;	
    tR_TEMPERATURA_1		: number = 0;
    tR_TEMPERATURA_2		: number = 0;
    tR_CANT_DOSIF			: number = 0;	
    tR_GL_DENSIDAD			: number = 0;	
    tR_GL_DENSIDAD2			: number = 0;
    tR_LT_DENSIDAD 			: number = 0;
    tR_LT_DENSIDAD2 		: number = 0;
    tR_CORR_TEORICA 		: number = 0;
    tR_CORR_TEORICA2 		: number = 0;
    tR_CORR_REAL 			: number = 0;
    tR_CORR_REAL2 			: number = 0;
    tR_LT_DOSIF_COLOR 		: number = 0;
    tR_LT_DOSIF_SAL 		: number = 0;
    tR_LT_DOSIF1_ALCA 		: number = 0;
    tR_PH_1_ALCALI_1 		: number = 0;
    tR_PH_1_ALCALI_2 		: number = 0;
    tR_LT_DOSIF2_ALCA 		: number = 0;
    tR_PH_2_ALCALI_1 		: number = 0;
    tR_PH_2_ALCALI_2 		: number = 0;
    tR_LT_DOSIF3_ALCA 		: number = 0;
    tR_NIV_BANO_MAQ_2 		: number = 0;
    tR_AGOTAMIENTO_1 		: number = 0;
    tR_AGOTAMIENTO_2 		: number = 0;
    tR_TIEMPO_AGOTA 		: number = 0;

    /*PARAMETROS JABONADO*/
    jA_PH_1	: number = 0;
    jA_PH_2	: number = 0;
    fI_PH_1	: number = 0;
    fI_PH_2	: number = 0;
    aC_PH_1 : number = 0;
    aC_PH_2 : number = 0;

    /*PARAMETROS TEÑIDO DISPERSO*/
    tD_BAR 					: number = 0;
    tD_TOBERA               : number = 0;
    tD_ACUMULADOR           : number = 0;
    tD_BOMBA                : number = 0;
    tD_VELOCIDAD            : number = 0;
    tD_TIEMPO_CICLO_1		: number = 0;	
    tD_PH_TENIDO_1			: number = 0;	
    tD_PH_TENIDO_2			: number = 0;	
    tD_PH_DESCARGA_DISP_1   : number = 0;
    tD_PH_DESCARGA_DISP_2   : number = 0;
                         
    cambiO_TURNO: string = '';
    observaciones: string = '';       
}






		

