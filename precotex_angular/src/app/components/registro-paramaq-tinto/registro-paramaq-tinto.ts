
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParaMaqTinto } from 'src/app/models/paramaqTinto';
import { SeguimientoToberaService } from 'src/app/services/seguimiento-tobera.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalVariable } from 'src/app/VarGlobals';
import { NetworkService } from 'src/app/services/network.service';
import jsPDF from 'jspdf';
import { TiProcesosTintoreriaService } from 'src/app/services/ti-procesos-tintoreria.service';
import { Tx_Muestra_Control_Proceso } from 'src/app/models/Tintoreria/Tx_Muestra_Control_Proceso';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Console } from 'console';
import { DialogVisorRegComponent } from '../estatus-control-tenido/dialog-visor-reg/dialog-visor-reg.component';

@Component({
  selector: 'app-registro-paramaq-tinto',
  templateUrl: './registro-paramaq-tinto.html',
  styleUrls: ['./registro-paramaq-tinto.scss'],
  providers: [DatePipe]
})


export class RegistroParaMaqTinto implements OnInit {

  lstParametros : ParaMaqTinto [] = [];
  objMuestraControlProceso: Tx_Muestra_Control_Proceso[] = [];
  Arraydata: string[][] = [];
  
  RutaFoto1 = '';
  RutaFoto2 = '';
  RutaFoto3 = '';
  elementload1 = false;
  elementget1 = false;
  elementload2 = false;
  elementget2 = false;
  elementload3 = false;
  elementget3 = false; 
  flg_existe = false;
  title = 'qr-reader';
  public cameras:MediaDeviceInfo[]=[];
  public myDevice!: MediaDeviceInfo;
  public scannerEnabled=false;
  public results:string[]=[];  
  date = new FormControl(new Date().toLocaleDateString('en-GB'));
  num_guiaMascara = [/[0-2]/, /\d/, ':', /[0-5]/, /\d/];

  formulario = this.formBuilder.group({
    Nro_Referencia: [''],
    sDureza:[null],
    sPeroxido:[null],

    nDgFecha: [{value: '', disabled:true}], /*add */
    nDgHoraCarga: ['00:00'], /*add */
    nDgOperario: [{value: '', disabled:true}], /*add */
    nDgMaquina: [{value: '', disabled:true}],
    nDgPartida: [{value: '', disabled:true}],
    nDgColor: [{value: '', disabled:true}],
    nDgArticulo: [{value: '', disabled:true}],
    nDgPeso: [{value: '', disabled:true}],
    nDgCuerdas:[''],
    nDgCliente: [{value: '', disabled:true}],
    nDgRelaBano: [{value: '', disabled:true}], /*add */
    nDgVolReceta: [{value: '', disabled:true}], /*add */
    
    nCrAncho:[''],
    nCrDensidad:[''],
    
    nPrBar: [{value: '', disabled:true}],
    nPrTobera:[''],
    nPrAcumulador: [''],
    nPrBomba: [''],    
    nPrVelocidad: [''],
    nPrTiempoCiclo1: [''],
    // nPrTiempoCiclo2: [{value: '', disabled:true}],
    // nPrTiempoCiclo3: [{value: '', disabled:true}],
    // nPrTiempoCiclo4: [{value: '', disabled:true}],
    // nPrTiempoCiclo5: [{value: '', disabled:true}],
    nPrNivBanoMaq: [''],
    nPrPhPilling1: [''],/*add */
    nPrPhPilling2: [''],/*add */

    nTrBar: [{value: '', disabled:true}],
    nTrTobera: [''],
    nTrAcumulador: [''],
    nTrBomba: [''],
    nTrVelocidad: [''],
    nTrTiempoCiclo1: [''],
    // nTrTiempoCiclo2: [{value: '', disabled:true}],
    // nTrTiempoCiclo3: [{value: '', disabled:true}],
    // nTrTiempoCiclo4: [{value: '', disabled:true}],
    // nTrTiempoCiclo5: [{value: '', disabled:true}],
    nTrVolumen: [''],
    nTrNivBanoMaq1: [''],
    nTrNivBanoMaq2: [''],
    // nTrPhInicio1: [''],
    // nTrPhInicio2: [''],
    nTrPhInicio1CSal: [''],
    nTrPhInicio2CSal: [''],
    nTrPhInicio1SSal: [''],
    nTrPhInicio2SSal: [''],
    nTrDensidadSal1: [''],
    nTrDensidadSal2: [''],
    nTrTemperatura1: [''],
    nTrTemperatura2: [''],
    nTrCantDosif: [''],

    nTrGLDensidad: [{value: '', disabled:true}],    
    nTrGLDensidad2: [{value: '', disabled:true}],
    nTrLTDensidad: [{value: '', disabled:true}],
    nTrLTDensidad2: [{value: '', disabled:true}],
    nTrCorrTeorica: [{value: '', disabled:true}],
    nTrCorrTeorica2: [{value: '', disabled:true}],    
    nTrCorrReal: [{value: '', disabled:true}],
    nTrCorrReal2: [{value: '', disabled:true}],

    nTrLtDosifColor: [''],
    nTrLtDosifSal: [''],
    nTrLtDosif1Alca: [''],
    nTrLtDosif2Alca: [''],
    nTrLtDosif3Alca: [''],
    nTrPh1Alcali1: [''],
    nTrPh1Alcali2: [''],
    nTrPh2Alcali1: [''],
    nTrPh2Alcali2: [''],
    nTrAgotamiento1: [''],
    nTrAgotamiento2: [''],
    nTrTiempoAgota: [''], 
    /*NEUTRALIZADO*/ 
    nNePh1: [''],
    nNePh2: [''],
    /*JABONADO*/ 
    nJaPh1: [''],
    nJaPh2: [''],
    /*FIJADO*/
    nFiPh1: [''],
    nFiPh2: [''],
    /*ACIDULADO*/
    nAcPh1: [''],
    nAcPh2: [''],    
    /*TEÑIDO DISPERSO*/
    nTdBar: [{value: '', disabled:true}], 
    nTdTobera: [''],
    nTdAcumulador: [''],
    nTdBomba: [''],
    nTdVelocidad: [''],
    nTdTiempoCiclo1: [''],
    // nTdTiempoCiclo2: [{value: '', disabled:true}],
    // nTdTiempoCiclo3: [{value: '', disabled:true}],
    // nTdTiempoCiclo4: [{value: '', disabled:true}],
    // nTdTiempoCiclo5: [{value: '', disabled:true}],
    nTdPhTenido1: [''],/*add */
    nTdPhTenido2: [''],/*add */
    nTdPhDescargaDisp1: [''],/*add */
    nTdPhDescargaDisp2: [''],/*add */
  /*--------------------*/
    
  /*--------------------*/
    sCambioTurno: [''],
    sOpeEntrante: [''],
    sObs: [''],
    sCodUsuario: [''],    
  })

  dAcHoraDescarga = ''
  linkPicture : string = '';
  linkPicture2 : string = '';
  linkPicture3 : string = '';
  file: any;
  file2: any;
  file3: any;
  timeStamp : number = 0;
  timeStamp2 : number = 0; 
  timeStamp3 : number = 0;  
  Nro_Referencia: string = '';
  flg_campo: string = '';
  flg_inicio: string = 'N';
  flg_habilita: string = '';
  flg_maq_at: string = 'N'

  base64Image: string | undefined;
  urlLogo: string = 'assets/logo.jpg';
  sFechaReg: string = '';

  constructor(private formBuilder: FormBuilder, private SpinnerService: NgxSpinnerService,
    private matSnackBar: MatSnackBar, public dialog: MatDialog,private SeguimientoTobera:SeguimientoToberaService,
    private networkService: NetworkService, 
    private serviceTiProcesoTintoreria: TiProcesosTintoreriaService, 
    private toastr: ToastrService,
    private http: HttpClient,
    private datePipe: DatePipe ) {      
  }

  ngOnInit(): void {  
    this.convertImageToBase64(this.urlLogo);
    this.formulario.valueChanges.subscribe((value) => {
      localStorage.setItem('formulario', JSON.stringify(value));
    });
  
    this.networkService.isOnline$.subscribe((isOnline) => {
      if (isOnline) {      
        this.syncData();
      }
    });
    

  }

  

  syncData() {
    const formData = localStorage.getItem('formulario');
    if (formData) {      
      console.log('Sincronizando datos:', JSON.parse(formData));     
      this.submit(this.formulario,'S');       
      localStorage.removeItem('formulario');
    }
  }

  onToggle(inicio:string) {          
    if ((this.formulario.get('Nro_Referencia')?.value).toString().length >= 6) {        
        if (inicio == 'S')
        {
          this.flg_inicio = 'S'
        }
        this.showParamReceta(this.formulario.get('Nro_Referencia')?.value);               
    }
  } 

  step = -1;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  showParamReceta(Nro_Referencia:string)
  {    
    this.SeguimientoTobera.showParamReceta(Nro_Referencia).subscribe(
      (result:any) => {

        if (result.length > 0)
        {      
          this.flg_existe = true 

          if (this.flg_campo == 'S')
          {
            this.step = 3; 
          }
          if(this.flg_inicio == 'S')          
          {            
            this.step = 0;
          }       
                 
          //this.formulario.get('nDgFecha')?.setValue(this.date.value);
          this.sFechaReg = result[0].Dg_Fecha;

          const fechaOriginal = result[0].Dg_Fecha;
          const [dia, mes, anio] = fechaOriginal.split(" ")[0].split("/");
          const fechaFormateada = `${dia}/${mes}/${anio}`;

          this.formulario.get('nDgFecha')?.setValue(fechaFormateada);
          this.formulario.get('nDgHoraCarga')?.setValue(result[0].Dg_Hora+':'+result[0].Dg_Minuto);          
          this.formulario.get('nDgOperario')?.setValue(result[0].Cod_Usuario == '' ? GlobalVariable.vusu.toUpperCase() : result[0].Cod_Usuario);
      
          this.formulario.get('nDgMaquina')?.setValue(result[0].Dg_Maquina);
          this.formulario.get('nDgPartida')?.setValue(result[0].Dg_Partida);
          this.formulario.get('nDgColor')?.setValue(result[0].Dg_Color);
          this.formulario.get('nDgArticulo')?.setValue(result[0].Dg_Articulo);
          this.formulario.get('nDgPeso')?.setValue(Number(result[0].Dg_Peso));
          this.formulario.get('nDgCuerdas')?.setValue(result[0].Dg_Cuerdas);
          this.formulario.get('nDgCliente')?.setValue(result[0].Dg_Cliente);
          this.formulario.get('nDgRelaBano')?.setValue(result[0].Dg_RelaBano);
          this.formulario.get('nDgVolReceta')?.setValue(result[0].Dg_VolReceta);
          
          this.formulario.get('nCrAncho')?.setValue(Number(result[0].Cr_Ancho));
          this.formulario.get('nCrDensidad')?.setValue(Number(result[0].Cr_Densidad));
          
          this.formulario.get('nPrBar')?.setValue(Number(result[0].Pr_Bar));
          this.formulario.get('nPrTobera')?.setValue(Number(result[0].Pr_Tobera));
          this.formulario.get('nPrAcumulador')?.setValue(Number(result[0].Pr_Acumulador));
          this.formulario.get('nPrBomba')?.setValue(Number(result[0].Pr_Bomba));
          this.formulario.get('nPrVelocidad')?.setValue(Number(result[0].Pr_Velocidad));
          this.formulario.get('nPrTiempoCiclo1')?.setValue(Number(result[0].Pr_Tiempo_Ciclo_1));
          this.formulario.get('nPrNivBanoMaq')?.setValue(Number(result[0].Pr_Niv_Bano_Maq));
          this.formulario.get('nPrPhPilling1')?.setValue(Number(result[0].Pr_Ph_Pilling_1));
          this.formulario.get('nPrPhPilling2')?.setValue(Number(result[0].Pr_Ph_Pilling_2));

          this.formulario.get('nTrBar')?.setValue(Number(result[0].Tr_Bar));
          this.formulario.get('nTrTobera')?.setValue(Number(result[0].Tr_Tobera));
          this.formulario.get('nTrAcumulador')?.setValue(Number(result[0].Tr_Acumulador));
          this.formulario.get('nTrBomba')?.setValue(Number(result[0].Tr_Bomba));
          this.formulario.get('nTrVelocidad')?.setValue(Number(result[0].Tr_Velocidad));
          this.formulario.get('nTrTiempoCiclo1')?.setValue(Number(result[0].Tr_Tiempo_Ciclo_1));

          this.formulario.get('nTrVolumen')?.setValue(Number(result[0].Tr_Volumen));
          this.formulario.get('nTrNivBanoMaq1')?.setValue(Number(result[0].Tr_Niv_Bano_Maq_1));
          this.formulario.get('nTrNivBanoMaq2')?.setValue(Number(result[0].Tr_Niv_Bano_Maq_2));
          
          this.formulario.get('nTrPhInicio1CSal')?.setValue(Number(result[0].Tr_Ph_Inicio1_CSal));
          this.formulario.get('nTrPhInicio2CSal')?.setValue(Number(result[0].Tr_Ph_Inicio2_CSal));
          this.formulario.get('nTrPhInicio1SSal')?.setValue(Number(result[0].Tr_Ph_Inicio1_SSal));
          this.formulario.get('nTrPhInicio2SSal')?.setValue(Number(result[0].Tr_Ph_Inicio2_SSal));
          this.formulario.get('nTrDensidadSal1')?.setValue(Number(result[0].Tr_Densidad_Sal_1));
          this.formulario.get('nTrDensidadSal2')?.setValue(Number(result[0].Tr_Densidad_Sal_2));
          this.formulario.get('nTrTemperatura1')?.setValue(Number(result[0].Tr_Temperatura_1));
          this.formulario.get('nTrTemperatura2')?.setValue(Number(result[0].Tr_Temperatura_2));
          this.formulario.get('nTrCantDosif')?.setValue(Number(result[0].Tr_Cant_Dosif));

          this.formulario.get('nTrGLDensidad')?.setValue(Number(result[0].Tr_GL_Densidad));
          this.formulario.get('nTrGLDensidad2')?.setValue(Number(result[0].Tr_GL_Densidad_2));
          this.formulario.get('nTrLTDensidad')?.setValue(Number(result[0].Tr_LT_Densidad));
          this.formulario.get('nTrLTDensidad2')?.setValue(Number(result[0].Tr_LT_Densidad_2));
          this.formulario.get('nTrCorrTeorica')?.setValue(Number(result[0].Tr_Corr_Teorica));
          this.formulario.get('nTrCorrTeorica2')?.setValue(Number(result[0].Tr_Corr_Teorica_2));
          this.formulario.get('nTrCorrReal')?.setValue(Number(result[0].Tr_Corr_Real));
          this.formulario.get('nTrCorrReal2')?.setValue(Number(result[0].Tr_Corr_Real_2));

          this.formulario.get('nTrLtDosifColor')?.setValue(Number(result[0].Tr_Lt_Dosif_Color));
          this.formulario.get('nTrLtDosifSal')?.setValue(Number(result[0].Tr_Lt_Dosif_Sal));
          this.formulario.get('nTrLtDosif1Alca')?.setValue(Number(result[0].Tr_Lt_Dosif1_Alca));
          this.formulario.get('nTrPh1Alcali1')?.setValue(Number(result[0].Tr_Ph_1_Alcali_1));
          this.formulario.get('nTrPh1Alcali2')?.setValue(Number(result[0].Tr_Ph_1_Alcali_2));
          this.formulario.get('nTrPh2Alcali1')?.setValue(Number(result[0].Tr_Ph_2_Alcali_1));
          this.formulario.get('nTrPh2Alcali2')?.setValue(Number(result[0].Tr_Ph_2_Alcali_2));
          this.formulario.get('nTrLtDosif2Alca')?.setValue(Number(result[0].Tr_Lt_Dosif2_Alca));
          this.formulario.get('nTrLtDosif3Alca')?.setValue(Number(result[0].Tr_Lt_Dosif3_Alca));
          this.formulario.get('nTrAgotamiento1')?.setValue(Number(result[0].Tr_Agotamiento_1));
          this.formulario.get('nTrAgotamiento2')?.setValue(Number(result[0].Tr_Agotamiento_2));
          this.formulario.get('nTrTiempoAgota')?.setValue(Number(result[0].Tr_Tiempo_Agota));

          this.formulario.get('nNePh1')?.setValue(Number(result[0].Ne_Ph_1));
          this.formulario.get('nNePh2')?.setValue(Number(result[0].Ne_Ph_2));
          this.formulario.get('nJaPh1')?.setValue(Number(result[0].Ja_Ph_1));
          this.formulario.get('nJaPh2')?.setValue(Number(result[0].Ja_Ph_2));
          this.formulario.get('nFiPh1')?.setValue(Number(result[0].Fi_Ph_1));
          this.formulario.get('nFiPh2')?.setValue(Number(result[0].Fi_Ph_2));
          this.formulario.get('nAcPh1')?.setValue(Number(result[0].Ac_Ph_1));
          this.formulario.get('nAcPh2')?.setValue(Number(result[0].Ac_Ph_2));

          this.formulario.get('nTdBar')?.setValue(Number(result[0].Td_Bar));
          this.formulario.get('nTdTobera')?.setValue(Number(result[0].Td_Tobera));
          this.formulario.get('nTdAcumulador')?.setValue(Number(result[0].Td_Acumulador));
          this.formulario.get('nTdBomba')?.setValue(Number(result[0].Td_Bomba));
          this.formulario.get('nTdVelocidad')?.setValue(Number(result[0].Td_Velocidad));
          this.formulario.get('nTdTiempoCiclo1')?.setValue(Number(result[0].Td_Tiempo_Ciclo_1));

          this.formulario.get('nTdPhTenido1')?.setValue(Number(result[0].Td_Ph_Tenido_1));
          this.formulario.get('nTdPhTenido2')?.setValue(Number(result[0].Td_Ph_Tenido_2));
          this.formulario.get('nTdPhDescargaDisp1')?.setValue(Number(result[0].Td_Ph_Descarga_Disp_1));
          this.formulario.get('nTdPhDescargaDisp2')?.setValue(Number(result[0].Td_Ph_Descarga_Disp_2));
          this.flg_habilita = result[0].Flg_Habilita;
          this.flg_maq_at = result[0].Flg_Maquina_AT;

          if (this.flg_habilita == 'S')
          {
            this.Habilitar();
                                    
          }else{
            this.Deshabilitar();
          }

          if (result[0].Mu_Dureza_Tenido==undefined){
            this.RutaFoto1 = ""                       
          }
            else{                              
            this.RutaFoto1 = result[0].Mu_Dureza_Tenido;            
            this.setLinkPicture(this.RutaFoto1);          
            this.showGet();
          }

          if (result[0].Mu_Peroxi_Residu==undefined){
            this.RutaFoto2 = ""             
          }
            else{                               
            this.RutaFoto2 = result[0].Mu_Peroxi_Residu;            
            this.setLinkPicture2(this.RutaFoto2);          
            this.showGet();
          }

          if (result[0].Cr_Foto_Cuerda==undefined){
            this.RutaFoto3 = ""             
          }
            else{                              
            console.log("RUTA:",result[0].Cr_Foto_Cuerda) 
            this.RutaFoto3 = result[0].Cr_Foto_Cuerda.trim();            
            this.setLinkPicture3(this.RutaFoto3);          
            this.showGet();
          }
         
          this.formulario.get('sCambioTurno')?.setValue(result[0].Cambio_Turno);          
          this.formulario.get('sObs')?.setValue(result[0].Observaciones);    
          
          // const savedData = localStorage.getItem('formulario');
          // if (savedData) {
          //   this.formulario.setValue(JSON.parse(savedData));
          //   console.log("savedData",savedData)
          // }
        }else{
          this.Limpiar();
          //localStorage.removeItem('formulario');
        }
      }
    )
  }

  Limpiar()
  {
          this.step = -1;
          this.formulario.get('nDgFecha')?.setValue("");
          this.formulario.get('nDgHoraCarga')?.setValue("");
          this.formulario.get('nDgOperario')?.setValue("");
          this.formulario.get('nDgMaquina')?.setValue("");
          this.formulario.get('nDgPartida')?.setValue("");
          this.formulario.get('nDgColor')?.setValue("");
          this.formulario.get('nDgArticulo')?.setValue("");
          this.formulario.get('nDgPeso')?.setValue("");
          this.formulario.get('nDgCuerdas')?.setValue("");
          this.formulario.get('nDgCliente')?.setValue("");
          this.formulario.get('nDgRelaBano')?.setValue("");
          this.formulario.get('nDgVolReceta')?.setValue("");

          this.formulario.get('nCrAncho')?.setValue("");
          this.formulario.get('nCrDensidad')?.setValue(""); 
          this.formulario.get('sCrFotoCuerda')?.setValue("");         

          this.formulario.get('nPrBar')?.setValue("");
          this.formulario.get('nPrTobera')?.setValue("");
          this.formulario.get('nPrAcumulador')?.setValue("");
          this.formulario.get('nPrBomba')?.setValue("");
          this.formulario.get('nPrVelocidad')?.setValue("");
          this.formulario.get('nPrTiempoCiclo1')?.setValue("");

          this.formulario.get('nPrNivBanoMaq')?.setValue("");
          this.formulario.get('nPrPhPilling1')?.setValue("");
          this.formulario.get('nPrPhPilling2')?.setValue("");

          this.formulario.get('nTrBar')?.setValue("");
          this.formulario.get('nTrTobera')?.setValue("");
          this.formulario.get('nTrAcumulador')?.setValue("");
          this.formulario.get('nTrBomba')?.setValue("");
          this.formulario.get('nTrVelocidad')?.setValue("");
          this.formulario.get('nTrTiempoCiclo1')?.setValue("");

          this.formulario.get('nTrVolumen')?.setValue("");
          this.formulario.get('nTrNivBanoMaq1')?.setValue("");
          this.formulario.get('nTrNivBanoMaq2')?.setValue("");
          
          this.formulario.get('nTrPhInicio1CSal')?.setValue("");
          this.formulario.get('nTrPhInicio2CSal')?.setValue("");
          this.formulario.get('nTrPhInicio1SSal')?.setValue("");
          this.formulario.get('nTrPhInicio2SSal')?.setValue("");
          this.formulario.get('nTrDensidadSal1')?.setValue("");
          this.formulario.get('nTrDensidadSal2')?.setValue("");
          this.formulario.get('nTrTemperatura1')?.setValue("");
          this.formulario.get('nTrTemperatura2')?.setValue("");
          this.formulario.get('nTrCantDosif')?.setValue("");

          this.formulario.get('nTrGLDensidad')?.setValue("");
          this.formulario.get('nTrGLDensidad2')?.setValue("");
          this.formulario.get('nTrLTDensidad')?.setValue("");
          this.formulario.get('nTrLTDensidad2')?.setValue("");
          this.formulario.get('nTrCorrTeorica')?.setValue("");
          this.formulario.get('nTrCorrTeorica2')?.setValue("");
          this.formulario.get('nTrCorrReal')?.setValue("");
          this.formulario.get('nTrCorrReal2')?.setValue("");

          this.formulario.get('nTrLtDosifColor')?.setValue("");
          this.formulario.get('nTrLtDosifSal')?.setValue("");
          this.formulario.get('nTrLtDosif1Alca')?.setValue("");
          this.formulario.get('nTrPh1Alcali1')?.setValue("");
          this.formulario.get('nTrPh1Alcali2')?.setValue("");
          this.formulario.get('nTrPh2Alcali1')?.setValue("");
          this.formulario.get('nTrPh2Alcali2')?.setValue("");
          this.formulario.get('nTrLtDosif2Alca')?.setValue("");
          this.formulario.get('nTrLtDosif3Alca')?.setValue("");
          this.formulario.get('nTrAgotamiento1')?.setValue("");
          this.formulario.get('nTrAgotamiento2')?.setValue("");
          this.formulario.get('nTrTiempoAgota')?.setValue("");

          this.formulario.get('nNePh1')?.setValue("");
          this.formulario.get('nNePh2')?.setValue("");
          this.formulario.get('nJaPh1')?.setValue("");
          this.formulario.get('nJaPh2')?.setValue("");
          this.formulario.get('nFiPh1')?.setValue("");
          this.formulario.get('nFiPh2')?.setValue("");
          this.formulario.get('nAcPh1')?.setValue("");
          this.formulario.get('nAcPh2')?.setValue("");

          this.formulario.get('nTdBar')?.setValue("");
          this.formulario.get('nTdTobera')?.setValue("");
          this.formulario.get('nTdAcumulador')?.setValue("");
          this.formulario.get('nTdBomba')?.setValue("");
          this.formulario.get('nTdVelocidad')?.setValue("");
          this.formulario.get('nTdTiempoCiclo1')?.setValue("");

          this.formulario.get('nTdPhTenido1')?.setValue("");
          this.formulario.get('nTdPhTenido2')?.setValue("");
          this.formulario.get('nTdPhDescargaDisp1')?.setValue("");
          this.formulario.get('nTdPhDescargaDisp2')?.setValue("");

          this.formulario.get('sMuDurezaTenido')?.setValue("");
          this.formulario.get('sMuPeroxiResidu')?.setValue("");         

          this.formulario.get('sCambioTurno')?.setValue("");
          this.formulario.get('sOpeEntrante')?.setValue("");
          this.formulario.get('sObs')?.setValue("");  
          this.flg_habilita = '';    
          this.flg_existe = false;      
  }
 

  onFileChange(event: any,formDirective): void {
    this.file = event.target.files[0];
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
     
      reader.onload = () => {       
        this.RutaFoto1 = reader.result as string;                       
        this.showLoad(); 
        this.submit(formDirective,'N');       
      };          
    }           
  }

  onFileChange2(event: any,formDirective): void {
    this.file2 = event.target.files[0];
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file2] = event.target.files;
      reader.readAsDataURL(file2);
     
      reader.onload = () => {       
        this.RutaFoto2 = reader.result as string;                       
        this.showLoad();
        this.submit(formDirective,'N');
      };          
    }           
  }

  onFileChange3(event: any,formDirective): void {
    this.file3 = event.target.files[0];
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file3] = event.target.files;
      reader.readAsDataURL(file3);
     
      reader.onload = () => {       
        this.RutaFoto3 = reader.result as string;                       
        this.showLoad();
        this.submit(formDirective,'N');
      };          
    }           
  }

  showLoad() {
    this.elementload1 = false;
    this.elementget1 = true;    
    this.elementload2 = false;
    this.elementget2 = true;  
    this.elementload3 = false;
    this.elementget3 = true;    
  }

  public getLinkPicture() {
    if(this.timeStamp) {
       return this.linkPicture + '?' + this.timeStamp;
    }
    return this.linkPicture;    
  }

  public getLinkPicture2() {
    if(this.timeStamp2) {
       return this.linkPicture2 + '?' + this.timeStamp2;
    }
    return this.linkPicture2;    
  }

  public getLinkPicture3() {
    if(this.timeStamp3) {
       return this.linkPicture3 + '?' + this.timeStamp3;
    }
    return this.linkPicture3;    
  }

  public setLinkPicture(url: string) {
    this.linkPicture = url;
    this.timeStamp = (new Date()).getTime();
  }

  public setLinkPicture2(url: string) {
    this.linkPicture2 = url;
    this.timeStamp2 = (new Date()).getTime();
  }

  public setLinkPicture3(url: string) {
    this.linkPicture3 = url;
    this.timeStamp3 = (new Date()).getTime();
  }

  showGet() {
    this.elementload1 = true;
    this.elementget1 = false;
    this.elementload2 = true;
    this.elementget2 = false;
    this.elementload3 = true;
    this.elementget3 = false;
  }

  onEditar(campo :string) {        
       if (this.formulario.get(''+campo+'')?.value ==  "0" ){        
        this.formulario.get(''+campo+'')?.setValue("");        
       }
  }

  onSave(campo :string,formDirective): void {    
    if (this.formulario.get(''+campo+'')?.value !==  "0" || this.formulario.get(''+campo+'')?.value !==  ""){ 
      
      // if (campo == 'nTrDensidadSal1' || campo == 'nTrDensidadSal2' || campo == 'nTrTemperatura1' || campo == 'nTrTemperatura2' || campo == 'nTrPhInicio1CSal' || campo == 'nTrPhInicio2CSal' || campo == 'nTrPhInicio1SSal' || campo == 'nTrPhInicio2SSal')
      if (campo == 'nTrDensidadSal1' || campo == 'nTrDensidadSal2' || campo == 'nTrTemperatura1' || campo == 'nTrTemperatura2')
      {        
        this.flg_campo = 'S';    
        this.flg_inicio = 'N';  
        this.submit(formDirective,'N');       
      }      
        // this.submit(formDirective,'N');
     }           
  }

submit(formDirective,flg_msg:string):void{    
      
    try{
      if (this.flg_existe == true)
      {
        const formData = new FormData();                
        formData.append('Nro_Referencia', this.formulario.get('Nro_Referencia')?.value);
        formData.append('nDgHoraCarga', this.formulario.get('nDgHoraCarga')?.value);        
        formData.append('nDgCuerdas', this.formulario.get('nDgCuerdas')?.value);
        formData.append('nCrAncho', this.formulario.get('nCrAncho')?.value);
        formData.append('nCrDensidad', this.formulario.get('nCrDensidad')?.value);
        formData.append('sCrFotoCuerda', this.file3);

        formData.append('nPrTobera', this.formulario.get('nPrTobera')?.value);
        formData.append('nPrAcumulador', this.formulario.get('nPrAcumulador')?.value);
        formData.append('nPrBomba', this.formulario.get('nPrBomba')?.value);
        formData.append('nPrVelocidad', this.formulario.get('nPrVelocidad')?.value);
        formData.append('nPrTiempoCiclo1', this.formulario.get('nPrTiempoCiclo1')?.value);

        formData.append('nPrNivBanoMaq', this.formulario.get('nPrNivBanoMaq')?.value);
        formData.append('nPrPhPilling1', this.formulario.get('nPrPhPilling1')?.value);
        formData.append('nPrPhPilling2', this.formulario.get('nPrPhPilling2')?.value);

        formData.append('nTrTobera', this.formulario.get('nTrTobera')?.value);
        formData.append('nTrAcumulador', this.formulario.get('nTrAcumulador')?.value);
        formData.append('nTrBomba', this.formulario.get('nTrBomba')?.value);
        formData.append('nTrVelocidad', this.formulario.get('nTrVelocidad')?.value);
        formData.append('nTrTiempoCiclo1', this.formulario.get('nTrTiempoCiclo1')?.value);
                 
        formData.append('nTrVolumen', this.formulario.get('nTrVolumen')?.value);
        formData.append('nTrNivBanoMaq1', this.formulario.get('nTrNivBanoMaq1')?.value);
        formData.append('nTrNivBanoMaq2', this.formulario.get('nTrNivBanoMaq2')?.value);        
        formData.append('nTrPhInicio1CSal', this.formulario.get('nTrPhInicio1CSal')?.value);
        formData.append('nTrPhInicio2CSal', this.formulario.get('nTrPhInicio2CSal')?.value);
        formData.append('nTrPhInicio1SSal', this.formulario.get('nTrPhInicio1SSal')?.value);
        formData.append('nTrPhInicio2SSal', this.formulario.get('nTrPhInicio2SSal')?.value);
        formData.append('nTrDensidadSal1', this.formulario.get('nTrDensidadSal1')?.value);
        formData.append('nTrDensidadSal2', this.formulario.get('nTrDensidadSal2')?.value);
        formData.append('nTrTemperatura1', this.formulario.get('nTrTemperatura1')?.value);
        formData.append('nTrTemperatura2', this.formulario.get('nTrTemperatura2')?.value);
        formData.append('nTrCantDosif', this.formulario.get('nTrCantDosif')?.value);
        formData.append('nTrLtDosifColor', this.formulario.get('nTrLtDosifColor')?.value);
        formData.append('nTrLtDosifSal', this.formulario.get('nTrLtDosifSal')?.value);
        formData.append('nTrLtDosif1Alca', this.formulario.get('nTrLtDosif1Alca')?.value);
        formData.append('nTrPh1Alcali1', this.formulario.get('nTrPh1Alcali1')?.value);
        formData.append('nTrPh1Alcali2', this.formulario.get('nTrPh1Alcali2')?.value);
        formData.append('nTrPh2Alcali1', this.formulario.get('nTrPh2Alcali1')?.value);
        formData.append('nTrPh2Alcali2', this.formulario.get('nTrPh2Alcali2')?.value);
        formData.append('nTrLtDosif2Alca', this.formulario.get('nTrLtDosif2Alca')?.value);
        formData.append('nTrLtDosif3Alca', this.formulario.get('nTrLtDosif3Alca')?.value);
        formData.append('nTrAgotamiento1', this.formulario.get('nTrAgotamiento1')?.value);
        formData.append('nTrAgotamiento2', this.formulario.get('nTrAgotamiento2')?.value);
        formData.append('nTrTiempoAgota', this.formulario.get('nTrTiempoAgota')?.value);

        formData.append('nNePh1', this.formulario.get('nNePh1')?.value);
        formData.append('nNePh2', this.formulario.get('nNePh2')?.value);
        formData.append('nJaPh1', this.formulario.get('nJaPh1')?.value);
        formData.append('nJaPh2', this.formulario.get('nJaPh2')?.value);
        formData.append('nFiPh1', this.formulario.get('nFiPh1')?.value);
        formData.append('nFiPh2', this.formulario.get('nFiPh2')?.value);
        formData.append('nAcPh1', this.formulario.get('nAcPh1')?.value);
        formData.append('nAcPh2', this.formulario.get('nAcPh2')?.value);

        formData.append('nTdTobera', this.formulario.get('nTdTobera')?.value);
        formData.append('nTdAcumulador', this.formulario.get('nTdAcumulador')?.value);
        formData.append('nTdBomba', this.formulario.get('nTdBomba')?.value);
        formData.append('nTdVelocidad', this.formulario.get('nTdVelocidad')?.value);
        formData.append('nTdTiempoCiclo1', this.formulario.get('nTdTiempoCiclo1')?.value);

        formData.append('nTdPhTenido1', this.formulario.get('nTdPhTenido1')?.value);
        formData.append('nTdPhTenido2', this.formulario.get('nTdPhTenido2')?.value);
        formData.append('nTdPhDescargaDisp1', this.formulario.get('nTdPhDescargaDisp1')?.value);
        formData.append('nTdPhDescargaDisp2', this.formulario.get('nTdPhDescargaDisp2')?.value);
        formData.append('sMuDurezaTenido', this.file);
        formData.append('sMuPeroxiResidu', this.file2);
        formData.append('sCambioTurno', this.formulario.get('sCambioTurno')?.value);        
        formData.append('sObs', this.formulario.get('sObs')?.value);        
        this.SeguimientoTobera.saveParamReceta(formData).subscribe((result2: any) => {
          if (result2) {
            if (result2.Mensaje == 'Ok')  {  

              if (flg_msg =='S')
              {
                this.matSnackBar.open('Registrado Correctamente!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
                //this.formulario.get('Nro_Referencia')?.setValue("");
                //this.Limpiar()
              } else
              {
                if (this.flg_campo == 'S')
                  {                          
                    this.onToggle('N');               
                  }
              }             
              
            } else {
              this.matSnackBar.open(result2.Mensaje, 'Cerrar', {
                duration: 3000,
              })
            }
          } else {
            this.matSnackBar.open('Error, No Se Pudo Registrar!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
          }

        (err: HttpErrorResponse) => console.log(err.message)
      })
      }
      else
      {
        this.matSnackBar.open('Error, Buscar la receta!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
      }

        
  
      }catch (e) {
        console.log('Error', e);
      }
    } 

    Deshabilitar() {
      this.formulario.get('nPrAcumulador').disable();
      this.formulario.get('nPrBomba').disable();
      this.formulario.get('nPrVelocidad').disable();
      this.formulario.get('nPrTiempoCiclo1').disable();

      this.formulario.get('nTrAcumulador').disable();
      this.formulario.get('nTrBomba').disable();
      this.formulario.get('nTrVelocidad').disable();
      this.formulario.get('nTrTiempoCiclo1').disable();

      this.formulario.get('nTdAcumulador').disable();
      this.formulario.get('nTdBomba').disable();
      this.formulario.get('nTdVelocidad').disable();
      this.formulario.get('nTdTiempoCiclo1').disable();
    }

    Habilitar() {
      this.formulario.get('nPrAcumulador').enable();
      this.formulario.get('nPrBomba').enable();
      this.formulario.get('nPrVelocidad').enable();
      this.formulario.get('nPrTiempoCiclo1').enable();

      this.formulario.get('nTrAcumulador').enable();
      this.formulario.get('nTrBomba').enable();
      this.formulario.get('nTrVelocidad').enable();
      this.formulario.get('nTrTiempoCiclo1').enable();

      this.formulario.get('nTdAcumulador').enable();
      this.formulario.get('nTdBomba').enable();
      this.formulario.get('nTdVelocidad').enable();
      this.formulario.get('nTdTiempoCiclo1').enable();
    }

    // Imprimir(){
    //   if (this.flg_existe == true)
    //   {
    //     this.GenerarPdf();
    //   }else{
    //     this.matSnackBar.open('Error, Buscar la receta!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
    //   }
    // }
    
  generarPDF(Arraydata: string[][]) {
    const doc = new jsPDF();

    // Configuración inicial
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const tableWidth = pageWidth * 0.95; // 95% del ancho de la página
    const marginLeft = pageWidth * 0.05; // Margen izquierdo
    const marginRight = pageWidth * 0.05; // Margen derecho
    const marginTop = 20;
    const marginBottom = 20;
    const rowHeight = 8;

    // Logo y título
    const logo = this.base64Image;
    const title = "CONTROL PROCESOS TEÑIDO TELA";

    const logoWidth = pageWidth * 0.5;
    const titleX = logoWidth;

    doc.setFont("helvetica", "bold");
    doc.addImage(logo, "JPG", 5, 0, logoWidth - 20, 20); // Logo a la izquierda
    doc.setFontSize(14);
    doc.text(title, titleX + 10, 17, { align: "left" }); // Título a la derecha

    // Anchos de columnas ajustados
    const colWidthLeft = tableWidth * 0.495; // Cuadro izquierdo
    const colWidthRight = tableWidth * 0.425; // Cuadro derecho
    const spaceWidth = tableWidth * 0.05; // Espacio reducido al 5%
    const colWidths = [colWidthLeft / 2, colWidthLeft / 2, spaceWidth, colWidthRight / 2, colWidthRight / 2];

    // Datos
    const headers = ["", "PROCESO", "", "", "PROCESO"];
    const data = Arraydata;

    // Dibujar la cabecera
    let posY = marginTop;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    let posX = marginLeft;

    headers.forEach((header, i) => {
        if (i !== 2) { // Omitir el espacio
            doc.setFillColor(200, 200, 200); // Fondo gris para cuadros 1 y 2
            doc.rect(posX, posY, colWidths[i], rowHeight, "F"); // Fondo gris solo para cuadros
            doc.setDrawColor(0, 0, 0); // Línea de borde de la cabecera
            doc.rect(posX, posY, colWidths[i], rowHeight); // Bordes
            doc.text(header, posX + 2, posY + 6);
        }
        posX += colWidths[i];
    });

// Dibujar datos
posY += rowHeight;
doc.setFont("helvetica", "normal");

data.forEach((row, rowIndex) => {
  posX = marginLeft;
  const isDoubleRow = [7, 16, 17].includes(rowIndex);

  row.forEach((cell, i) => {
      const currentRowHeight = isDoubleRow ? rowHeight * 2 : rowHeight;

      if (posY + currentRowHeight > pageHeight - marginBottom) {
          // Si excede la página, agregar nueva página
          doc.addPage();
          posY = marginTop;
      }

      // Unir las columnas 1 y 2 en la fila 13, 16, 25, 26
      if (
        (rowIndex === 13 && (i === 0 || i === 1)) ||
        (rowIndex === 16 && (i === 0 || i === 1)) ||
        (rowIndex === 25 && (i === 0 || i === 1)) ||
        (rowIndex === 52 && (i === 0 || i === 1))
      ) {
        if (i === 0) {
          // Calcular el ancho combinado de las columnas 1 y 2
          const mergedWidth = colWidths[0] + colWidths[1];

          // Determinar la altura del merge: normal o de dos filas
          const mergedHeight = rowIndex === 16 ? rowHeight * 2 : rowHeight;

          // Dibujar el rectángulo combinado
          doc.setFillColor(169, 169, 169); // Establecer el color gris (RGB)
          doc.rect(posX, posY, mergedWidth, mergedHeight, "F");
          doc.setDrawColor(0, 0, 0); // Línea de borde
          doc.rect(posX, posY, mergedWidth, mergedHeight); // Dibujar bordes

          // Texto centrado en el rectángulo combinado
          const mergedText = `${row[0]} ${row[1]}`.trim();
          doc.setFont("helvetica", "bold");
          doc.text(
            mergedText,
            posX + mergedWidth / 2,
            posY + mergedHeight / 2 + 3, // Ajustar posición del texto
            { align: "center" }
          );
          doc.setFont("helvetica", "normal");
        }
        // No dibujar nada para la segunda columna (i === 1) porque ya está unida a la primera
      }

      // Proceder con las otras celdas normalmente
      else if (i !== 2) { // Omitir la columna 2 en la fila 3
          // Fusión de columnas 3 y 4 en la fila 1, 2, 4 y 6
          if ((rowIndex === 0 && (i === 3 || i === 4) || 
               rowIndex === 2 && (i === 3 || i === 4) || 
               rowIndex === 4 && (i === 3 || i === 4) ||
              //  rowIndex === 6 && (i === 3 || i === 4) ||
               rowIndex === 6 && (i === 3 || i === 4))) {
              // Solo dibujar el rectángulo y texto una vez en la columna 3
              if (i === 3) {
                  const mergedWidth = colWidths[3] + colWidths[4]; // Ancho combinado de columnas 3 y 4
                  doc.setFillColor(169, 169, 169); // Establecer el color gris (RGB)
                  doc.rect(posX, posY, mergedWidth, rowHeight, "F");
                  doc.setDrawColor(0, 0, 0); // Línea de borde de la cabecera
                  doc.rect(posX, posY, mergedWidth, rowHeight); // Bordes                      

                  // Texto centrado dentro del rectángulo combinado
                  const mergedText = `${row[3]} ${row[4]}`.trim();
                  doc.setFont("helvetica", "bold");
                  doc.text(mergedText, posX + mergedWidth / 2, posY + 6, { align: 'center' });
                  doc.setFont("helvetica", "normal");
              }
          } 

          else if ((rowIndex === 1 && i === 4 ||
                    rowIndex === 3 && i === 4 ||
                    rowIndex === 5 && i === 4 ||
                    rowIndex === 13 && i === 4 ||
                    rowIndex === 14 && i === 4
          )) {
            // Calcular el centro de la columna 4 (i == 3)
            const centerX = posX + colWidths[3] / 2; // Centro de la columna 4
        
            // Dibujar línea vertical en el centro de la columna 4
            doc.line(centerX, posY, centerX, posY + currentRowHeight); // Línea vertical
        
            // Obtener las infos
            const info: string[] = row[4].split("|");     
            
            // Asignamos los valores a variables
            const valor1: string = info[0]; // "1"
            const valor2: string = info[1]; // "2"            

            // Dibujar la celda izquierda
            doc.rect(posX, posY, colWidths[3] / 2, currentRowHeight);
            doc.text(valor1, posX + 2, posY + 6);
        
            // Dibujar la celda derecha
            doc.rect(centerX, posY, colWidths[3] / 2, currentRowHeight);
            doc.text(valor2, centerX + 2, posY + 6);
        }          
          
          // Dividir la columna 2 en la fila 24 con una línea vertical
          else if ((rowIndex === 24 && i === 1 ||
                    rowIndex === 34 && i === 1 || 
                    rowIndex === 35 && i === 1 ||
                    rowIndex === 36 && i === 1 ||
                    rowIndex === 37 && i === 1 ||
                    rowIndex === 38 && i === 1 ||
                    rowIndex === 39 && i === 1 ||
                    rowIndex === 40 && i === 1 ||
                    rowIndex === 41 && i === 1 ||
                    rowIndex === 45 && i === 1 ||
                    rowIndex === 47 && i === 1 ||
                    rowIndex === 50 && i === 1 ||
                    rowIndex === 53 && i === 1)) {
              // Dibujar línea vertical en el centro de la columna 2
              const centerX = posX + colWidths[1] / 2; // Centro de la columna 2
              doc.line(centerX, posY, centerX, posY + currentRowHeight); // Línea vertical

              // Dibujar dos nuevas celdas a cada lado de la línea
              const leftCellWidth = colWidths[1] / 2;
              const rightCellWidth = colWidths[1] / 2;

              // Dibujar las celdas divididas
              doc.rect(posX, posY, leftCellWidth, currentRowHeight);
              doc.text(row[1], posX + 2, posY + 6); // Texto en la parte izquierda

              doc.rect(centerX, posY, rightCellWidth, currentRowHeight);
              doc.text(row[2], centerX + 2, posY + 6); // Texto en la parte derecha
          }

          // Dibujar las demás celdas normalmente (excepto la fila 18 y siguientes para las columnas 3 y 4)
          else if (!(rowIndex === 0 && i === 4)) {
              // Eliminar filas 18 en adelante para las columnas 3 y 4
              if (rowIndex >= 18 && (i === 3 || i === 4)) {
                  // No hacer nada para estas celdas
              } else {
                  doc.rect(posX, posY, colWidths[i], currentRowHeight);

                  // Dividir texto en celdas específicas
                  if (rowIndex == 7 && i == 1) {
                      doc.setFontSize(8);
                      const texto = cell.split('\n').map(linea => linea.trim()).join(' ');
                      const textArray = doc.splitTextToSize(String(texto), 45);
                      doc.text(textArray, posX + 25, posY + 3, { align: 'center' });
                      doc.setFontSize(10);
                  } else if ((rowIndex == 16 || rowIndex == 17) && i == 4) {
                      doc.setFontSize(8);
                      const texto = cell.split('\n').map(linea => linea.trim()).join(' ');
                      const textArray = doc.splitTextToSize(String(texto), 45);
                      doc.text(textArray, posX + 21, posY + 3, { align: 'center' });
                      doc.setFontSize(10);
                  }
                  // Títulos en negrita
                  else if (
                      (rowIndex == 0 && i == 3) ||
                      (rowIndex == 2 && i == 3) ||
                      (rowIndex == 4 && i == 3) ||
                      (rowIndex == 6 && i == 3) ||
                      (rowIndex == 13 && i == 0) ||
                      (rowIndex == 16 && i == 0) ||
                      (rowIndex == 25 && i == 0)
                  ) {
                      doc.setFont("helvetica", "bold");
                      doc.text(cell, posX + 2, posY + 6);
                      doc.setFont("helvetica", "normal");
                  }
                  // Celdas numéricas centradas
                  else if (
                      (rowIndex >= 0 && rowIndex <= 7 && i == 1) ||
                      (rowIndex >= 8 && rowIndex <= 50 && i == 1)
                  ) {
                      if (rowIndex == 6 && i == 1) {
                          doc.setFontSize(8);
                          doc.text(cell, posX + 2, posY + 6);
                          doc.setFontSize(10);
                      } else {
                          doc.text(cell.trim(), posX + 25, posY + 6, { align: 'center' });
                      }
                  } else if (rowIndex >= 1 && rowIndex <= 50 && i == 4) {
                      doc.text(cell.trim(), posX + 22, posY + 6, { align: 'center' });
                  } else {
                      doc.text(cell, posX + 2, posY + 6);
                  }
              }
          }
      }

      // Solo avanzar en el eje X si no es la columna 4 en la primera fila
      if (!(rowIndex === 0 && i === 4)) {
          posX += colWidths[i];
      }
  });

  posY += isDoubleRow ? rowHeight * 2 : rowHeight;
});

    // Guardar el PDF
    // doc.save("Partida.pdf");
    const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
    
        this.dialog.open(DialogVisorRegComponent, {
          disableClose: false,
          panelClass: 'my-class',
          data: {
            boton: 'ARRANQUE',
            Opcion: 'I',
            Imagen: pdfUrl
          },
          minWidth: '45vh'
        });
}

    Imprimir(){
      if (this.flg_existe == true)
      {
        const fechaOriginal = this.sFechaReg;

        //2025-01-09T10:53:32
        //7/01/2025 09:58:29
       
        // Separar la fecha y la hora
        const [fecha, hora] = fechaOriginal.split(" ");
        
        // Reorganizar la fecha al formato ISO (yyyy-MM-dd)
        const [dia, mes, anio] = fecha.split("/");
        // Asegurar que el día y el mes tengan siempre dos dígitos
        const diaFormateado = dia.padStart(2, '0');
        const mesFormateado = mes.padStart(2, '0');   
        const fechaISO = `${anio}-${mesFormateado}-${diaFormateado}T${hora}`;     
        //const fechaISO = `${anio}-${mes}-${dia}T${hora}`;

        
        // Convertir al objeto Date
        const fechaComoDate = new Date(fechaISO);

        let cod_Ordtra  = this.formulario.get('nDgPartida')?.value;
        let dFecha      = fechaComoDate;
        
        const sPartida1     : string = cod_Ordtra;
        const fecha_start1  : Date   = dFecha;
        const fecha_end1    : Date   = dFecha;    
        this.Arraydata = [];      
   
        this.SpinnerService.show();
        this.serviceTiProcesoTintoreria.getObtieneMuestraControlProceso(sPartida1, fecha_start1, fecha_end1).subscribe({
          next: (response: any)=> {
            if(response.success){
              if (response.totalElements > 0){
  
              /*CREAMOS LAS FILAS*/
              // const row0: string[] = ["PARTIDA", response.elements[0]["partida"], "", "NEUTRALIZADO",""];     
              // const row01: string[] = ["NRO REFERENCIA", response.elements[0]["nrO_REFERENCIA"].trim(), "", "PH NEUTRALIZADO",(response.elements[0]["nE_PH_1"]==0?"":String(response.elements[0]["nE_PH_1"])) + '|' + (response.elements[0]["nE_PH_2"]==0?"":String(response.elements[0]["nE_PH_2"]))];

              const row1: string[] = ["PARTIDA", response.elements[0]["partida"], "", "JABONADO",""];     
              const row2: string[] = ["NRO REFERENCIA", response.elements[0]["nrO_REFERENCIA"].trim(), "", "PH JABONADO",(response.elements[0]["jA_PH_1"]==0?"":String(response.elements[0]["jA_PH_1"])) + '|' + (response.elements[0]["jA_PH_2"]==0?"":String(response.elements[0]["jA_PH_2"]))];
              const row3: string[] = ["OPERARIO", response.elements[0]["operario"], "", "FIJADO", ""];   
              const row4: string[] = ["FECHA", this.datePipe.transform(response.elements[0]["fecha"], 'dd/MM/yyyy'), "", "PH FIJADO",(response.elements[0]["fI_PH_1"]==0?"":String(response.elements[0]["fI_PH_1"])) + '|' + (response.elements[0]["fI_PH_2"]==0?"":String(response.elements[0]["fI_PH_2"]))];   
              const row5: string[] = ["HORA CARGA", response.elements[0]["horA_CARGA"], "", "ACIDULADO",""];   
              const row6: string[] = ["MÁQUINA", response.elements[0]["maquina"], "", "PH ACIDULADO",(response.elements[0]["aC_PH_1"]==0?"":String(response.elements[0]["aC_PH_1"])) + '|' + (response.elements[0]["aC_PH_2"]==0?"":String(response.elements[0]["aC_PH_2"]))];   
              const row7: string[] = ["COLOR", response.elements[0]["color"].trim(), "", "TEÑIDO DISPERSO",""];   
              const row8: string[] = ["ARTICULO", response.elements[0]["articulo"].trim(), "", "BAR",response.elements[0]["tD_BAR"]==0?"":String(response.elements[0]["tD_BAR"])];   
              const row9: string[] = ["PESO", response.elements[0]["peso"]==0?"":String(response.elements[0]["peso"]), "", "TOBERA",response.elements[0]["tD_TOBERA"]==0?"":String(response.elements[0]["tD_TOBERA"])];   
              const row10: string[] = ["CUERDAS", response.elements[0]["cuerdas"], "", "ACUMULADOR",response.elements[0]["tD_ACUMULADOR"]==0?"":String(response.elements[0]["tD_ACUMULADOR"])];   

              //BLOQUE 2
              const row11: string[] = ["CLIENTE", response.elements[0]["cliente"], "", "BOMBA", response.elements[0]["tD_BOMBA"]==0?"":String(response.elements[0]["tD_BOMBA"])];   
              const row12: string[] = ["RELACIÓN BAÑO", response.elements[0]["relbano"], "", "VELOCIDAD", response.elements[0]["tD_VELOCIDAD"]==0?"":String(response.elements[0]["tD_VELOCIDAD"])];  
              const row13: string[] = ["VOLUMEN RECETA", response.elements[0]["volreceta"]==0?"":String(response.elements[0]["volreceta"]), "", "T.CICLO", response.elements[0]["tD_TIEMPO_CICLO_1"]==0?"":String(response.elements[0]["tD_TIEMPO_CICLO_1"])];  
              const row14: string[] = ["CRUDO", "", "", "PH TEÑIDO", (response.elements[0]["tD_PH_TENIDO_1"]==0?"":String(response.elements[0]["tD_PH_TENIDO_1"])) + '|' + (response.elements[0]["tD_PH_TENIDO_2"]==0?"":String(response.elements[0]["tD_PH_TENIDO_2"]))];  
              const row15: string[] = ["ANCHO", response.elements[0]["cR_ANCHO"]==0?"":String(response.elements[0]["cR_ANCHO"]), "", "PH DESCARGA", (response.elements[0]["tD_PH_DESCARGA_DISP_1"]==0?"":String(response.elements[0]["tD_PH_DESCARGA_DISP_1"])) + '|' + (response.elements[0]["tD_PH_DESCARGA_DISP_2"]==0?"":String(response.elements[0]["tD_PH_DESCARGA_DISP_2"]))];  
              const row16: string[] = ["DENSIDAD", response.elements[0]["cR_DENSIDAD"]==0?"":String(response.elements[0]["cR_DENSIDAD"]), "", "PESO POR CUERDA", response.elements[0]["pesO_POR_CUERDA"]==0?"":String(response.elements[0]["pesO_POR_CUERDA"])];
              
              //BLOQUE PREVIO
              const row17: string[] = ["PREVIO", "", "", "P. CAMBIO DE TURNO", response.elements[0]["cambiO_TURNO"].trim()];
              const row18: string[] = ["BAR", response.elements[0]["pR_BAR"]==0?"":String(response.elements[0]["pR_BAR"]			), "", "OBSERVACIONES", response.elements[0]["observaciones"].trim()];  
              const row19: string[] = ["TOBERA", response.elements[0]["pR_TOBERA"]==0?"":				String(response.elements[0]["pR_TOBERA"]		), "", "", ""];  
              const row20: string[] = ["ACUMULADOR", response.elements[0]["pR_ACUMULADOR"]==0?"":		String(response.elements[0]["pR_ACUMULADOR"]	), "", "OBSERVACIONES", response.elements[0]["observaciones"].trim()];  
              const row21: string[] = ["BOMBA", response.elements[0]["pR_BOMBA"]==0?"":					String(response.elements[0]["pR_BOMBA"]			), "", "", ""];  
              const row22: string[] = ["VELOCIDAD", response.elements[0]["pR_VELOCIDAD"]==0?"":			String(response.elements[0]["pR_VELOCIDAD"]		), "", "", ""];  
              const row23: string[] = ["T.CICLO", response.elements[0]["pR_TIEMPO_CICLO_1"]==0?"":		String(response.elements[0]["pR_TIEMPO_CICLO_1"]), "", "", ""];  
              const row24: string[] = ["NIVEL BAÑO", response.elements[0]["pR_NIV_BANO_MAQ"]==0?"":		String(response.elements[0]["pR_NIV_BANO_MAQ"]	), "", "", ""];  
              const row25: string[] = ["PH ANTIPILLING", response.elements[0]["pR_PH_PILLING"]==0?"":	String(response.elements[0]["pR_PH_PILLING"]	), response.elements[0]["pR_PH_PILLING_2"]==0?"":	String(response.elements[0]["pR_PH_PILLING_2"]	), "", ""];  
              
              //BLOQUE TEÑIDO REACTIVO
              const row51: string[] = ["TEÑIDO REACTIVO", "", "", "", ""];  
              const row26: string[] = ["BAR", response.elements[0]["tR_BAR"]==0?"":								String(response.elements[0]["tR_BAR"]			  	), "", "", ""];  
              const row27: string[] = ["TOBERA", response.elements[0]["tR_TOBERA"]==0?"":						String(response.elements[0]["tR_TOBERA"]			), "", "", ""];  
              const row28: string[] = ["ACUMULADOR", response.elements[0]["tR_ACUMULADOR"]==0?"":				String(response.elements[0]["tR_ACUMULADOR"]		), "", "", ""];  
              const row29: string[] = ["BOMBA", response.elements[0]["tR_BOMBA"]==0?"":							String(response.elements[0]["tR_BOMBA"]				), "", "", ""];  
              const row30: string[] = ["VELOCIDAD", response.elements[0]["tR_VELOCIDAD"]==0?"":					String(response.elements[0]["tR_VELOCIDAD"]			), "", "", ""];  
              const row31: string[] = ["T.CICLO", response.elements[0]["tR_TIEMPO_CICLO_1"]==0?"":				String(response.elements[0]["tR_TIEMPO_CICLO_1"]	), "", "", ""];  
              const row32: string[] = ["VOLUMEN INICIO", response.elements[0]["tR_VOLUMEN"]==0?"":				String(response.elements[0]["tR_VOLUMEN"]			), "", "", ""];  
              const row33: string[] = ["NIVEL BAÑO 1", response.elements[0]["tR_NIV_BANO_MAQ_1"]==0?"":			String(response.elements[0]["tR_NIV_BANO_MAQ_1"]	), "", "", ""];  
              const row34: string[] = ["PH INICIAL CSAL", response.elements[0]["tR_PH_INICIO1_CSAL"]==0?"":			String(response.elements[0]["tR_PH_INICIO1_CSAL"]	), response.elements[0]["tR_PH_INICIO2_CSAL"]==0?"":			String(response.elements[0]["tR_PH_INICIO2_CSAL"]	), "", ""];  
              const row52: string[] = ["PH INICIAL SSAL", response.elements[0]["tR_PH_INICIO1_SSAL"]==0?"":			String(response.elements[0]["tR_PH_INICIO1_SSAL"]	), response.elements[0]["tR_PH_INICIO2_SSAL"]==0?"":			String(response.elements[0]["tR_PH_INICIO2_SSAL"]	), "", ""]; 
              const row35: string[] = ["DENSIDAD SAL", response.elements[0]["tR_DENSIDAD_SAL_1"]==0?"":			String(response.elements[0]["tR_DENSIDAD_SAL_1"]	), response.elements[0]["tR_DENSIDAD_SAL_2"]==0?"":			String(response.elements[0]["tR_DENSIDAD_SAL_2"]	), "", ""];  
              const row36: string[] = ["TEMPERATURA", response.elements[0]["tR_TEMPERATURA_1"]==0?"":			String(response.elements[0]["tR_TEMPERATURA_1"]		), response.elements[0]["tR_TEMPERATURA_2"]==0?"":			String(response.elements[0]["tR_TEMPERATURA_2"]		), "", ""];  
              const row37: string[] = ["G/L DENSIDAD", response.elements[0]["tR_GL_DENSIDAD"]==0?"":			String(response.elements[0]["tR_GL_DENSIDAD"]		), response.elements[0]["tR_GL_DENSIDAD2"]==0?"":			String(response.elements[0]["tR_GL_DENSIDAD2"]		), "", ""];
              const row38: string[] = ["LTS DENSIDAD", response.elements[0]["tR_LT_DENSIDAD"]==0?"":			String(response.elements[0]["tR_LT_DENSIDAD"]		), response.elements[0]["tR_LT_DENSIDAD2"]==0?"":			String(response.elements[0]["tR_LT_DENSIDAD2"]		), "", ""];
              const row39: string[] = ["CORRECCIÓN TEÓRICA", response.elements[0]["tR_CORR_TEORICA"]==0?"":		String(response.elements[0]["tR_CORR_TEORICA"]		), response.elements[0]["tR_CORR_TEORICA2"]==0?"":		String(response.elements[0]["tR_CORR_TEORICA2"]		), "", ""];
              const row40: string[] = ["CORRECCIÓN REAL", (response.elements[0]["tR_CORR_REAL"]==0)?"":			String(response.elements[0]["tR_CORR_REAL"]			), (response.elements[0]["tR_CORR_REAL2"]==0)?"":			String(response.elements[0]["tR_CORR_REAL2"]			), "", ""];
              const row41: string[] = ["LTS DOSIF COLORANTE", (response.elements[0]["tR_LT_DOSIF_COLOR"]==0)?"":String(response.elements[0]["tR_LT_DOSIF_COLOR"]	), "", "", ""];  
              const row42: string[] = ["LTS DOSIF SAL TEXTIL", (response.elements[0]["tR_LT_DOSIF_SAL"]==0)?"":	String(response.elements[0]["tR_LT_DOSIF_SAL"]		), "", "", ""];
              const row43: string[] = ["LTS DOSIF 1°",  (response.elements[0]["tR_LT_DOSIF1_ALCA"]==0)?"":		String(response.elements[0]["tR_LT_DOSIF1_ALCA"]	), "", "", ""];
              const row44: string[] = ["PH1 ALCALI",    (response.elements[0]["tR_PH_1_ALCALI_1"]==0)?"":		String(response.elements[0]["tR_PH_1_ALCALI_1"]		), (response.elements[0]["tR_PH_1_ALCALI_2"]==0)?"":		String(response.elements[0]["tR_PH_1_ALCALI_2"]		), "", ""];
              const row45: string[] = ["LTS DOSIF 2°",  (response.elements[0]["tR_LT_DOSIF2_ALCA"]==0)?"":		String(response.elements[0]["tR_LT_DOSIF2_ALCA"]	), "", "", ""];
              const row46: string[] = ["PH2 ALCALI",          (response.elements[0]["tR_PH_2_ALCALI_1"]==0)?"":	String(response.elements[0]["tR_PH_2_ALCALI_1"]		), (response.elements[0]["tR_PH_2_ALCALI_2"]==0)?"":	String(response.elements[0]["tR_PH_2_ALCALI_2"]		), "", ""]; 
              const row47: string[] = ["LTS DOSIF 3°",        (response.elements[0]["tR_LT_DOSIF3_ALCA"]==0)?"":String(response.elements[0]["tR_LT_DOSIF3_ALCA"]	), "", "", ""]; 
              const row48: string[] = ["NIVEL BAÑO 2",        (response.elements[0]["tR_NIV_BANO_MAQ_2"]==0)?"":String(response.elements[0]["tR_NIV_BANO_MAQ_2"]	), "", "", ""]; 
              const row49: string[] = ["PH AGOTAMIENTO",      (response.elements[0]["tR_AGOTAMIENTO_1"]==0)?"":	String(response.elements[0]["tR_AGOTAMIENTO_1"]		), (response.elements[0]["tR_AGOTAMIENTO_2"]==0)?"":	String(response.elements[0]["tR_AGOTAMIENTO_2"]		), "", ""]; 
              const row50: string[] = ["TIEMPO AGOTAMIENTO",  (response.elements[0]["tR_TIEMPO_AGOTA"]==0)?"":String(response.elements[0]["tR_TIEMPO_AGOTA"]), "", "", ""]; 
              
              const row53: string[] = ["NEUTRALIZADO", "", "", "", ""];               
              const row54: string[] = ["PH NEUTRALIZADO",      (response.elements[0]["nE_PH_1"]==0)?"":	String(response.elements[0]["nE_PH_1"]		), (response.elements[0]["nE_PH_2"]==0)?"":	String(response.elements[0]["nE_PH_2"]		), "", ""];


              // Agregar filas al ARRAY
              this.Arraydata.push(row1,row2,row3,row4,row5,row6,row7,row8,row9,row10);  
              this.Arraydata.push(row11,row12,row13,row14,row15,row16,row17,row18,row19,row20,row21,row22,row23,row24,row25,row51,row26,row27, row28, row29,row30);             
              this.Arraydata.push(row31,row32,row33,row34,row52,row35,row36,row37,row38,row39,row40,row41,row42,row43,row44,row45,row46,row47,row48,row49,row50,row53,row54);  

              }
            }
            this.SpinnerService.hide();    
  
            //Generar PDF en caso exista Data en ArrayData
            if (this.Arraydata.length >0){
              this.generarPDF(this.Arraydata);
            }
  
          },
          error: (error) => {
            this.SpinnerService.hide();
            this.toastr.error(error.error.message, 'Cerrar', {
            timeOut: 2500,
            });
          }
        });

      }else{
        this.matSnackBar.open('Error, Buscar la receta!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
      }        
    } 
  
    convertImageToBase64(imagePath: string): void {
      this.http.get(imagePath, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (reader.result) {
              this.base64Image = reader.result.toString(); // Aquí se obtiene el Base64
            }
          };
          reader.readAsDataURL(blob); // Convertir blob a Base64
        },
        error: (err) => {
          console.error('Error al cargar la imagen:', err);
        },
      });
    }

}