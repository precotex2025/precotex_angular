import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RegistroCalidadTejeduriaService } from 'src/app/services/registro-calidad-tejeduria.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService }  from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { Auditor } from 'src/app/models/Auditor';
import { Restriccion } from 'src/app/models/Restriccion';
import { GlobalVariable } from '../../VarGlobals';
import { MatPaginator } from '@angular/material/paginator';
import { allowedNodeEnvironmentFlags } from 'process';
import { ActivatedRoute, Router } from '@angular/router';

interface data_det {
  Num_Rollo: string;
  Defecto: string;
}


interface DEFECTO {
  Cod_Motivo: string,
  Descripcion: string,
  Factor_Conversion: number,
}

interface Audit{
  Codigo:string,
  Tip_Auditor:string,
  Descripcion:string,
}

interface data_det_Defecto {
  ACCCION: String,
  GRUPO: string,
  COD_MOTIVO: string,
  SECUENCIA: string,
  DESCRIPCION: string,
  CANTIDAD_DEFECTOS: string,
  METROS: string,
  FACTOR_CONVERSION: string,
  CALIDAD_ROLLO: string,
  FECHA_REGISRO: string,
  USUARIO: string,
  PREFIJO_MAQUINA: string,
  CODIGO_ROLLO: string,
  ANCHO_TELA: string,
  DENSIDAD_TELA: string,
  OBSERVACIONES: string,
}

//Interface Lista Tipo de Maquina Revisadora
interface MaquinaRevisadora {
  cod_Maquina_Revisadora: string,
  des_Maquina_Revisadora: string,
  flg_Estatus: string,
  fec_Registro: string,
  usu_Registro: string,
  fec_Modifica: string,
  usu_Modifica: string,
  cod_Equipo: string
}




@Component({
  selector: 'app-calificacion-rollo-cal',
  templateUrl: './calificacion-rollo-cal.component.html',
  styleUrls: ['./calificacion-rollo-cal.component.scss'],
})
export class CalificacionRolloCalComponent implements OnInit {
  displayedColumns_cab: string[] = ['Num_Rollo', 'Defecto'];

  @ViewChild('miInput') miInput: ElementRef;

  Codigo_Barras    = ''
  Inspector        = ''

  Cdrollo=''
  Not = ''
  Digitador=''
  Restriccion=''
  Turno=''
  Cod_Accion=''
  DpMaquina=''
  Dobservacion=''
  DMetrosCuad=0
  Total_Puntos=0
  DCalidad=0
  
  xCodDefe = ''
  xAncho = 0
  xDensidad = 0
  xCalidad = 1
  xCantDefe = 0
  xObservaciones = ''
  

  Tip_Trabajador=""
  Cod_Trabajador=''
  xAccion	    =''
  xCod_Usuario =''
  

  public data_det_Defecto = [{
    ACCION:"",
    GRUPO: "",
    COD_MOTIVO: "",
    SECUENCIA: "",
    DESCRIPCION: "",
    CANTIDAD_DEFECTOS: "",
    METROS:"",
    FACTOR_CONVERSION:"",
    CALIDAD_ROLLO:"",
    FECHA_REGISRO:"",
    USUARIO:"",
    PREFIJO_MAQUINA: "",
    CODIGO_ROLLO: "",
    ANCHO_TELA: "",
    DENSIDAD_TELA: "",
    OBSERVACIONES: "" 
    }]

  formulario = this.formBuilder.group({
    Txt_CodRollo: [''],
    Txt_Ot: [''],
    Txt_Pref_Maquina: [''],
    Txt_Codigo_Rollo: [''],
    Txt_Cliente: [''],
    Txt_Maquina: [''],
    Txt_Cod_Turno: [''],
    Txt_CodDefecto: [''],
    Txt_NomDefecto: [''],
    Txt_Inspector: [''],
    Txt_Restriccion: [''],

    Txt_Ancho: [''],
    Txt_Densidad: [''],
    Txt_Calidad: [''],
    Txt_CantDef: [''],
    Txt_FacConv: [''],
    Txt_Observaciones: [''],

    Txt_AnchoEstandar: [''],
    Txt_TipoTejidoTela: [''],
    Txt_MaqRevisadora: [''],

  });


  listar_operacionAuditor:  Audit[] = [];
  listar_operacionDigitador:  Auditor[] = [];
  listar_operacionRestriccion:  Restriccion[] = [];

  //Nueva Lista Maquina Revisadora
  listar_maqRevisadora: MaquinaRevisadora[] = [];
    
    // GRUPO: string,
    // COD_MOTIVO: string,
    // SECUENCIA: string,
    // DESCRIPCION: string,
    // CANTIDAD_DEFECTOS: string,
    // METROS: string,
    // FACTOR_CONVERSION: string,
    // CALIDAD_ROLLO: string,
    // FECHA_REGISRO: string,
    // USUARIO: string,


  displayedColumns_cab_2: string[] = 
  ['ACCION', 'GRUPO', 'COD_MOTIVO','SECUENCIA', 'DESCRIPCION', 'CANTIDAD_DEFECTOS', 'METROS', 'FACTOR_CONVERSION'
  , 'CALIDAD_ROLLO', 'FECHA_REGISRO', 'USUARIO', 'PREFIJO_MAQUINA', 'CODIGO_ROLLO', 'ANCHO_TELA', 'DENSIDAD_TELA', 'OBSERVACIONES']

  dataSource: MatTableDataSource<data_det>;
  

  @ViewChild('myinputAdd') inputAdd!: ElementRef;
  @ViewChild('myinputDef') inputDef!: ElementRef;
  @ViewChild('myinputAncho') inputAncho!: ElementRef;
  @ViewChild('myinputDensidad') inpuDensidad!: ElementRef;
  @ViewChild('myinputCalidad') inpuCalidad!: ElementRef;
  @ViewChild('myinputCantDef') inpuCantDef!: ElementRef;
  @ViewChild('myinputMet') inpuFacMetr!: ElementRef;
  @ViewChild('myinputObs') inpuObs!: ElementRef;
  @ViewChild('button') button;
  //@ViewChild('myGrabar') myGraba!: ElementRef;
  //@ViewChild('myGrabar', { static: true }) boton!: ElementRef;
  //@ViewChild('myinputDef', { static: true }) myinputDef!: ElementRef;

  filtroOperacionDE:        Observable<DEFECTO []> | undefined;
  listar_operacionDE:       DEFECTO [] = [];



  constructor(private formBuilder: FormBuilder, 
              private matSnackBar: MatSnackBar,   
              private dialog: MatDialog, 
              private RegistroCalidadTejeduriaService: RegistroCalidadTejeduriaService, 
              private SpinnerService: NgxSpinnerService,
              private router: Router,
              private ingresoRolloTejidoService: IngresoRolloTejidoService) {
    this.dataSource = new MatTableDataSource();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    // fecha actual
    let date = new Date();

    // la hora en tu zona horaria actual
    //alert( date.getHours() );


    this.xCod_Usuario                      = GlobalVariable.vusu;
    this.showMaquinasRevisadoras();//Nuevo Agregado por Hmedina 16/04/2025
    this.onToggle();
    this.showInspector();
    this.Codigo_Barras = this.formulario.get('Txt_CodRollo')?.value
    this.formulario.get('Txt_Ot').disable();
    this.formulario.get('Txt_Pref_Maquina').disable();
    this.formulario.get('Txt_Codigo_Rollo').disable();
    this.formulario.get('Txt_Maquina').disable();
    this.formulario.get('Txt_CodDefecto').disable();
    this.formulario.get('Txt_Inspector').disable();
    this.formulario.get('Txt_Cliente').disable();
    

    this.formulario.get('Txt_Ancho')?.setValue('0');
    this.formulario.get('Txt_Densidad')?.setValue('0');
    this.formulario.get('Txt_CantDef')?.setValue('');
    //this.formulario.get('Txt_FacConv')?.setValue('0');
    this.formulario.get('Txt_Observaciones')?.setValue('');

    if ( date.getHours() > 18){
      this.formulario.get('Txt_Cod_Turno')?.setValue('2');
    }else{
      this.formulario.get('Txt_Cod_Turno')?.setValue('1');
    }

    /*
      Cambio: Deshabilita los Inputs Ancho Standar, Tipó Tejido Tela
      Autor : Henry Medina
      Date  : 20/02/2025
    */
    this.formulario.get('Txt_AnchoEstandar').disable();
    this.formulario.get('Txt_TipoTejidoTela').disable();    


    this.showDefectos();
    this.showRestric();
    this.mostrarDatosInspector();
  }

 ngAfterViewInit() {
  this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };
  }


  // ngAfterViewInit(): void{
  //   //this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
  // }
  

  ReproducirError() {
    const audio = new Audio('assets/error.mp3');
    audio.play();
  }
 
  ReproducirOk() {
    const audio = new Audio('assets/aceptado.mp3');
    audio.play();
  } 


  onToggle() {
    if (this.formulario.get('Txt_CodRollo')?.value.length >=7) {
      this.Codigo_Barras = this.formulario.get('Txt_CodRollo')?.value
      //console.log("Codigo:"+this.Codigo_Barras)
      this.LecturarBulto() ;
      
      //this.inputDef.nativeElement.focus() // hace focus sobre "myInput"
    }

  }

AnadirBulto() {
    this.Codigo_Barras = this.formulario.get('Txt_CodRollo')?.value
     if (this.Codigo_Barras.length >= 5) {
        this.LecturarBulto();
    }
    else if (this.Codigo_Barras.length > 2) {
      this.ReproducirError();
      this.matSnackBar.open("Rollo Longitud Incorrecta", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    
  }



  LecturarBulto() {
    this.ingresoRolloTejidoService.BuscarRolloCalificacion(this.Codigo_Barras).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'Ok') {

          //this.ReproducirOk;
          this.formulario.get('Txt_Ot')?.setValue(result[0].Ot); 
          this.formulario.get('Txt_Pref_Maquina')?.setValue(result[0].Prefijo_Maquina);
          this.formulario.get('Txt_Codigo_Rollo')?.setValue(result[0].Codigo_Rollo);
          this.formulario.get('Txt_Maquina')?.setValue(result[0].Maquina);
          this.formulario.get('Txt_Calidad')?.setValue(result[0].Calidad);
          this.formulario.get('Txt_Cliente')?.setValue(result[0].Cliente);
          //this.formulario.get('Txt_Observaciones')?.setValue(result[0].Observaciones);
          //this.formulario.get('Txt_Ancho')?.setValue(result[0].Ancho_Tela);
          //this.formulario.get('Txt_Densidad')?.setValue(result[0].Densidad_Tela);


          if (result[0].Densidad_Tela==null){
            this.formulario.get('Txt_Ancho')?.setValue('0');  
          }else{
            this.formulario.get('Txt_Ancho')?.setValue(result[0].Ancho_Tela);
          }


          if (result[0].Densidad_Tela==null){
            this.formulario.get('Txt_Densidad')?.setValue('0');  
          }else{
            this.formulario.get('Txt_Densidad')?.setValue(result[0].Densidad_Tela);
          }

          

          
          if (result[0].Observaciones==null){
            this.formulario.get('Txt_Observaciones')?.setValue('');  
          }else{
            this.formulario.get('Txt_Restriccion')?.setValue(result[0].Observaciones);
          }

          if (result[0].Turno==null){
            let date = new Date();
                if ( date.getHours() > 18){
                  this.formulario.get('Txt_Cod_Turno')?.setValue('2');
                }else{
                  this.formulario.get('Txt_Cod_Turno')?.setValue('1');
                }
                    
            
          }else{
            this.formulario.get('Txt_Cod_Turno')?.setValue(result[0].Turno);
          }
          

          if (result[0].Cod_Restriccion==null){
            this.formulario.get('Txt_Restriccion')?.setValue('G');  
          }else{
            this.formulario.get('Txt_Restriccion')?.setValue(result[0].Cod_Restriccion);
          }

          /*Inicio - Muestra Ancho Estandar y Tipo Tejido Tela*/
          this.formulario.get('Txt_AnchoEstandar')?.setValue(result[0].Ancho_Estandar);  
          this.formulario.get('Txt_TipoTejidoTela')?.setValue(result[0].Tipo_Tejido_Tela);

          if (!(result[0].Cod_Maquina_Revisadora==null)) {
            this.formulario.get('Txt_MaqRevisadora')?.setValue(result[0].Cod_Maquina_Revisadora);
          }
          /*Fin - Muestra Ancho Estandar y Tipo Tejido Tela*/ 
          

          var tp =  this.formulario.get('Txt_Inspector')?.value;
          this.Tip_Trabajador=tp.charAt(0)
    
          var ct =  this.formulario.get('Txt_Inspector')?.value;
          this.Cod_Trabajador=ct.substring(1)

          this.showDetalleDefectos();
          this.formulario.get('Txt_FacConv')?.setValue('0');
          //this.formulario.get('Txt_CodRollo')?.setValue('');    
          //this.inpuCalidad.nativeElement.focus() // hace focus sobre "myInput"
          //this.inputDef.nativeElement.focus() // hace focus sobre "myInput"

          this.inpuObs.nativeElement.focus(); //PUntero en Observaciones para que no seleccione ningun Defecto
          
        }
        else 
        {
           // this.ReproducirError();
            
            this.formulario.get('Txt_CodRollo')?.setValue('');
            this.formulario.get('Txt_Ot')?.setValue('');
            this.formulario.get('Txt_Maquina')?.setValue('');
            this.formulario.get('Txt_Cod_Turno')?.setValue('');
            this.formulario.get('Txt_CodDefecto')?.setValue('');
            this.formulario.get('Txt_NomDefecto')?.setValue('');
            this.formulario.get('Txt_Restriccion')?.setValue('G');

            /*Inicio - Muestra Ancho Estandar y Tipo Tejido Tela*/
            this.formulario.get('Txt_AnchoEstandar')?.setValue('');  
            this.formulario.get('Txt_TipoTejidoTela')?.setValue('');  
            /*Fin - Muestra Ancho Estandar y Tipo Tejido Tela*/

            this.formulario.get('Txt_Ancho')?.setValue('0');
            this.formulario.get('Txt_Densidad')?.setValue('0');
            this.formulario.get('Txt_Calidad')?.setValue('');
            this.formulario.get('Txt_CantDef')?.setValue('');
            this.formulario.get('Txt_FacConv')?.setValue('0');
            this.formulario.get('Txt_Observaciones')?.setValue('');
            this.formulario.get('Txt_Pref_Maquina')?.setValue('');
            this.formulario.get('Txt_Codigo_Rollo')?.setValue('');
            this.formulario.get('Txt_Cliente')?.setValue('');
            this.showDetalleDefectos();  
            //this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.dataSource.data = [];
            //this.inpuCalidad.nativeElement.focus() // hace focus sobre "myInput"
            this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
        }
      },
      (err: HttpErrorResponse) => {
        this.ReproducirError();
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
        })
      })
  }

  NuevoEscaneo()
  {
            this.formulario.get('Txt_CodRollo')?.setValue('');
            this.formulario.get('Txt_Ot')?.setValue('');
            this.formulario.get('Txt_Pref_Maquina')?.setValue('');
            this.formulario.get('Txt_Cliente')?.setValue('');
            this.formulario.get('Txt_Codigo_Rollo')?.setValue('');
            this.formulario.get('Txt_Maquina')?.setValue('');
            this.formulario.get('Txt_NomDefecto')?.setValue('');
            this.formulario.get('Txt_Ancho')?.setValue('');
            this.formulario.get('Txt_Densidad')?.setValue('');
            this.formulario.get('Txt_CantDef')?.setValue('');
            this.formulario.get('Txt_FacConv')?.setValue('');
            this.formulario.get('Txt_Observaciones')?.setValue('');
            this.formulario.get('Txt_Calidad')?.setValue('');
            this.formulario.get('Txt_MaqRevisadora')?.setValue('');
            this.showDetalleDefectos(); 
            this.showDetalleDefectos();
            this.dataSource.data = [];
            this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
  }


  showDefectos() {
    this.ingresoRolloTejidoService.showDefectos("B", "").subscribe(
      (result: any) => {
        this.listar_operacionDE = result
        this.RecargarOperacionDefecto();
        //this.formulario.get('Txt_NomDefecto')?.setValue('TEJ21');
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  showMaquinasRevisadoras() {
    //this.SpinnerService.show();
    this.ingresoRolloTejidoService.getListaMaquinaRevisadora().subscribe({
      next: (response: any)=> {
        if(response.success){
          if (response.totalElements > 0){
            this.listar_maqRevisadora = response.elements;

          }
        }
      },
      error: (error) => {
        //this.SpinnerService.hide();
        console.log(error.error.message, 'Cerrar', {
        timeOut: 2500,
         });
      }
    });    
  }

  RecargarOperacionDefecto(){
    this.filtroOperacionDE = this.formulario.controls['Txt_NomDefecto'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionDef(option) : this.listar_operacionDE.slice())),
    );
    
  }

  private _filterOperacionDef(value: string): DEFECTO[] {
    if (value == null || value == undefined ) {
      value = ''
      
    }
    const filterValue = value.toLowerCase();
    return this.listar_operacionDE.filter(option => option.Descripcion.toLowerCase().includes(filterValue));
  }


  CambiarValorDef(Cod_Motivo: string, Descripcion: string, Factor_Conversion: number){
    this.formulario.get('Txt_CodDefecto')?.setValue(Cod_Motivo)
    this.formulario.get('Txt_FacConv')?.setValue(Factor_Conversion);
    this.showDefectosxCodigo(Cod_Motivo)
    this.inputDef.nativeElement.focus() // hace focus sobre "myInput"
  }


  showDefectosxCodigo(CodDefecto : string) {
    this.ingresoRolloTejidoService.showDefectos("S", CodDefecto).subscribe(
      (result: any) => {
        
        this.formulario.get('Txt_CodDefecto')?.setValue(result[0].Cod_Motivo);
        this.formulario.get('Txt_NomDefecto')?.setValue(result[0].Descripcion); 
        this.formulario.get('Txt_FacConv')?.setValue(result[0].Factor_Conversion);
        this.inpuCantDef.nativeElement.focus()
        this.formulario.get('Txt_CantDef')?.setValue('');

        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }   

  concatenarDefectos(Codigo: string, NombreCodigo: string){
    var xUlt = this.formulario.get('Txt_Observaciones')?.value;
    if (this.formulario.get('Txt_Observaciones')?.value.length > 0) {
      //alert(xUlt.slice(-2)) 
      if (xUlt.slice(-2)===', '  || xUlt.slice(-1)==='.'  ){
        this.formulario.get('Txt_Observaciones')?.setValue(xUlt + Codigo+"-"+ NombreCodigo+ ', ' ) 
      }else{
        this.formulario.get('Txt_Observaciones')?.setValue(xUlt + Codigo+"-"+ NombreCodigo) 
      }
      
          
    }else{
        this.formulario.get('Txt_Observaciones')?.setValue(Codigo+"-"+NombreCodigo + ', ') 
    }

  }


    CodDefectoEnvia1(){
      this.showDefectosxCodigo('TEJ21')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia2(){
      this.showDefectosxCodigo('TEJ28')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia3(){
      this.showDefectosxCodigo('TEJ29')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia4(){
      this.showDefectosxCodigo('TEJ27')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia5(){
      this.showDefectosxCodigo('TEJ31')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia6(){
      this.showDefectosxCodigo('TEJ32')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia7(){
      this.showDefectosxCodigo('TEJ34')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia8(){
      this.showDefectosxCodigo('TEJ38')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia9(){
      this.showDefectosxCodigo('TEJ39')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia10(){
      this.showDefectosxCodigo('TEJ50')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia11(){
      this.showDefectosxCodigo('TEJ41')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia12(){
      this.showDefectosxCodigo('TEJ46')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia13(){
      this.showDefectosxCodigo('HI019')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia14(){
      this.showDefectosxCodigo('TEJ35')
      this.inpuCantDef.nativeElement.focus()
    }

    CodDefectoEnvia15(){
      this.showDefectosxCodigo('HI010')
      this.inpuCantDef.nativeElement.focus()
    }





    CodDefectoEnvia16(){
      this.showDefectosxCodigo('TEJ30')
      this.inpuCantDef.nativeElement.focus()
    }


    CodDefectoEnvia17(){
      this.showDefectosxCodigo('TEJ33')
      this.inpuCantDef.nativeElement.focus()
    }


    CodDefectoEnvia18(){
      this.showDefectosxCodigo('TEJ36')
      this.inpuCantDef.nativeElement.focus()
    }


    CodDefectoEnvia19(){
      this.showDefectosxCodigo('TEJ45')
      this.inpuCantDef.nativeElement.focus()
    }


    CodDefectoEnvia20(){
      this.showDefectosxCodigo('TEJ49')
      this.inpuCantDef.nativeElement.focus()
    }


    


    validateFormat(event) {
      let key;
      if (event.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
      } else {
        key = event.keyCode;
        key = String.fromCharCode(key);
      }
      const regex = /[0-9]|\./;
       if (!regex.test(key)) {
        event.returnValue = false;
         if (event.preventDefault) {
          event.preventDefault();
         }
       }
      }





      onKeydown1(event) {
        if (event.key === "Enter") {
          this.inpuFacMetr.nativeElement.focus() // hace focus sobre "myInput"
        }
      }

      
      onKeydown2(event) {
        if (event.key === "Enter") {
          this.inputAncho.nativeElement.focus() // hace focus sobre "myInput"
        }
      }

      
      onKeydown3(event) {
        if (event.key === "Enter") {
          this.inpuDensidad.nativeElement.focus() // hace focus sobre "myInput"
        }
      }

      
      onKeydown4(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          this.inpuCalidad.nativeElement.focus() // hace focus sobre "myInput"
        }
      }

      prevenirEnter(event: KeyboardEvent) {
        event.preventDefault();
      }


      onKeydown5(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          this.inpuObs.nativeElement.focus() // hace focus sobre "inpuObs"
          
          
        }
      }

      
      onKeydown6(event) {
        if (event.key === "Enter") {
         // event.preventDefault();
          this.button.focus()
        }
      }





     


      
  showInspector() {
    this.ingresoRolloTejidoService.showAuditor("","","TEJ").subscribe(
      (result: any) => {
        this.listar_operacionAuditor = result
        console.log(this.listar_operacionAuditor);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  showRestric() {
    this.ingresoRolloTejidoService.showRestric().subscribe(
      (result: any) => {
        this.listar_operacionRestriccion = result
        this.formulario.get('Txt_Restriccion')?.setValue('G');
       // console.log(this.listar_operacionRestriccion);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  mostrarDatosInspector() {

    //let dni_tejedor=this.formulario.get('dnitejedor')?.value;
    let Cod_Trabajador=GlobalVariable.vcodtra;
    let Tip_Trabajador=GlobalVariable.vtiptra;
     console.log(Cod_Trabajador.length);
      this.RegistroCalidadTejeduriaService.traerDatosInspector(Cod_Trabajador, Tip_Trabajador).subscribe(
        (result: any) => {
          console.log(result);
           if (result[0].Respuesta == 'OK') {
            //this.formulario.get('dnitejedor')?.setValue(result[0].Nro_DocIde); 
            this.formulario.get('Txt_Inspector')?.setValue(result[0].Cod_Trabajador);
           }
         },
         (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    //}


  }


  InputSelCantDef() {
    const inputElement = this.inpuCantDef.nativeElement;
    inputElement.focus();
    inputElement.select();
  }

  



  InputSelMet() {
    const inputElement = this.inpuFacMetr.nativeElement;
    inputElement.focus();
    inputElement.select();
  }

  InputSelAnc() {
    const inputElement = this.inputAncho.nativeElement;
    inputElement.focus();
    inputElement.select();
  }


  InputSelDen() {
    const inputElement = this.inpuDensidad.nativeElement;
    inputElement.focus();
    inputElement.select();
  }


  InputSelCal() {
    const inputElement = this.inpuCalidad.nativeElement;
    inputElement.focus();
    inputElement.select();
  }

  InputSelObs() {
    const inputElement = this.inpuObs.nativeElement;
    inputElement.focus();
    inputElement.select();
  }

  //@ViewChild('myinputCantDef') inpuCantDef!: ElementRef;



  showDetalleDefectos() {
    this.ingresoRolloTejidoService.showDetalleDefectos(this.formulario.get('Txt_Ot')?.value, 
                                                       this.formulario.get('Txt_Pref_Maquina')?.value, 
                                                       this.formulario.get('Txt_Codigo_Rollo')?.value).subscribe(
      (result: any) => {
        this.dataSource = result
        //this.inputAncho.nativeElement.focus() // hace focus sobre "myInput"
        //this.formulario.get('Txt_NomDefecto')?.setValue('TEJ21');
        //console.log(result)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  GuardarDefecto() {

        if (this.formulario.get('Txt_CodDefecto')?.value == '') 
        {
          this.matSnackBar.open('Rellene todos los campos!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        else 
        {

          this.SpinnerService.show();
          const formData = new FormData();

          formData.append('Accion', 'I');
          /*     DEFECTOS DEL ROLLO      */
          formData.append('x_Prefijo_Maquina', this.formulario.get('Txt_Pref_Maquina')?.value);
          formData.append('x_Codigo_Rollo', this.formulario.get('Txt_Codigo_Rollo')?.value);
          formData.append('x_Secuencia', '0');
          formData.append('x_Motivo_Defecto', this.formulario.get('Txt_CodDefecto')?.value);
          formData.append('x_Cantidad_Defecto', this.formulario.get('Txt_CantDef')?.value);
          formData.append('x_Flg_Contar', 'S');
          formData.append('x_Cod_Usuario', this.xCod_Usuario);
          formData.append('x_Factor_Conversion', this.formulario.get('Txt_FacConv')?.value);
          formData.append('x_Ancho', this.formulario.get('Txt_Ancho')?.value);
          formData.append('x_Densidad', this.formulario.get('Txt_Densidad')?.value);

          /*     CALIDAD DEL ROLLO      */
          formData.append('x_Calidad', this.formulario.get('Txt_Calidad')?.value);
          formData.append('x_Tip_Trabajador', this.Tip_Trabajador);
          formData.append('x_Cod_Trabajador', this.Cod_Trabajador);
          formData.append('x_Cod_Auditor', this.Tip_Trabajador+this.Cod_Trabajador );
          formData.append('x_Cod_Restriccion', this.formulario.get('Txt_Restriccion')?.value);
          formData.append('x_Cod_Turno', this.formulario.get('Txt_Cod_Turno')?.value);
          formData.append('x_Observaciones', this.formulario.get('Txt_Observaciones')?.value);
          formData.append('x_Cod_Ordtra', this.formulario.get('Txt_Ot')?.value);

          this.ingresoRolloTejidoService.GuardarDefecto(formData).subscribe(

            (result: any) => {
              if (result[0].Respuesta == 'OK') {
                this.SpinnerService.hide();
                this.formulario.get('Txt_Ancho')?.setValue('0');
                this.formulario.get('Txt_Densidad')?.setValue('0');
                this.formulario.get('Txt_CantDef')?.setValue('');
                this.formulario.get('Txt_FacConv')?.setValue('0');
                this.formulario.get('Txt_Observaciones')?.setValue('-');
                this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
                this.showDetalleDefectos(); 
                this.matSnackBar.open('Se Registro Correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                
              }
              else {
                this.SpinnerService.hide();
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              }
            },
            (err: HttpErrorResponse) => {
              this.SpinnerService.hide();
              this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

            })

        }
   }


  EliminarDefecto(Prefijo_Maquina: string, Codigo_Rollo: string, Secuencia: string) {

    //this.SpinnerService.show();
          const formData = new FormData();
          formData.append('Accion', 'D');
          formData.append('y_Prefijo_Maquina', Prefijo_Maquina);
          formData.append('y_Codigo_Rollo', Codigo_Rollo);
          formData.append('y_Secuencia', Secuencia);
          formData.append('y_Motivo_Defecto', this.formulario.get('Txt_CodDefecto')?.value);
          formData.append('y_Cantidad_Defecto',  '0');
          formData.append('y_Flg_Contar', 'S');
          formData.append('y_Cod_Usuario', this.xCod_Usuario);
          formData.append('y_Factor_Conversion', '0');
          formData.append('y_Ancho', '0');
          formData.append('y_Densidad', '0');

          formData.append('y_Calidad', this.formulario.get('Txt_Calidad')?.value);
          formData.append('y_Tip_Trabajador', this.Tip_Trabajador);
          formData.append('y_Cod_Trabajador', this.Cod_Trabajador);
          formData.append('y_Cod_Auditor', this.Tip_Trabajador+this.Cod_Trabajador );
          formData.append('y_Cod_Restriccion', '');
          formData.append('y_Cod_Turno', '');
          formData.append('y_Observaciones', '');
          formData.append('y_Cod_Ordtra', this.formulario.get('Txt_Ot')?.value);

          //Nuevo Parametro. Valor de la maquina registradoa
          formData.append('z_Cod_MaquinaRevisadora', this.formulario.get('Txt_MaqRevisadora')?.value);
  
    if(confirm("Desea Eliminar este registro?")) {
      
      this.ingresoRolloTejidoService.eliminarDefecto(formData).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('El registro se elimino correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
            this.showDetalleDefectos();
            this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
            } else {
            this.matSnackBar.open(result.Mensaje, 'Cerrar', {
              duration: 3000,
            })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
        }))
    }
  }



  GuardarCalidad() {
    // GUARDAR CALIDAD
    if (this.formulario.get('Txt_CodRollo')?.value == '') 
    {
      this.matSnackBar.open('Ingrese el codigo de Rollo!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
    }
    //Nueva Validación agregado por HMEDINA
    else if (this.formulario.get('Txt_MaqRevisadora')?.value == ''){
      this.matSnackBar.open('Seleccione maquina revisadora!!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
    }
    else 
    {

      let sMotiDefecto = this.formulario.get('Txt_CodDefecto')?.value || '*';
      let sCantDefecto = this.formulario.get('Txt_CantDef')?.value || 0; 

      //this.SpinnerService.show();
      const formData = new FormData();

      formData.append('Accion', 'C');
      formData.append('z_Prefijo_Maquina', this.formulario.get('Txt_Pref_Maquina')?.value);
      formData.append('z_Codigo_Rollo', this.formulario.get('Txt_Codigo_Rollo')?.value);
      formData.append('z_Secuencia', '0');
      //formData.append('z_Motivo_Defecto', this.formulario.get('Txt_CodDefecto')?.value);
      //formData.append('z_Cantidad_Defecto', this.formulario.get('Txt_CantDef')?.value);
      formData.append('z_Motivo_Defecto', sMotiDefecto);
      formData.append('z_Cantidad_Defecto', sCantDefecto);      
      formData.append('z_Flg_Contar', 'S');
      formData.append('z_Cod_Usuario', this.xCod_Usuario);
      formData.append('z_Factor_Conversion', this.formulario.get('Txt_FacConv')?.value);
      formData.append('z_Ancho', this.formulario.get('Txt_Ancho')?.value);
      formData.append('z_Densidad', this.formulario.get('Txt_Densidad')?.value);

      formData.append('z_Calidad', this.formulario.get('Txt_Calidad')?.value);
      formData.append('z_Tip_Trabajador', this.Tip_Trabajador);
      formData.append('z_Cod_Trabajador', this.Cod_Trabajador);
      formData.append('z_Cod_Auditor', this.Tip_Trabajador+this.Cod_Trabajador );
      formData.append('z_Cod_Restriccion', this.formulario.get('Txt_Restriccion')?.value);
      formData.append('z_Cod_Turno', this.formulario.get('Txt_Cod_Turno')?.value);
      formData.append('z_Observaciones', this.formulario.get('Txt_Observaciones')?.value);
      formData.append('z_Cod_Ordtra', this.formulario.get('Txt_Ot')?.value);

      //Nuevo Parametro. Valor de la maquina registradoa
      formData.append('z_Cod_MaquinaRevisadora', this.formulario.get('Txt_MaqRevisadora')?.value);
      
      this.ingresoRolloTejidoService.GuardarCalidad(formData).subscribe(

        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            this.SpinnerService.hide();
            this.formulario.get('Txt_NomDefecto')?.setValue('');
            this.formulario.get('Txt_Ancho')?.setValue('0');
            this.formulario.get('Txt_Densidad')?.setValue('0');
            this.formulario.get('Txt_CantDef')?.setValue('');
            this.formulario.get('Txt_FacConv')?.setValue('0');
            this.formulario.get('Txt_Observaciones')?.setValue('');
            //this.inputDef.nativeElement.focus() // hace focus sobre "myInput"
            
            this.showDetalleDefectos(); 
            this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
            this.matSnackBar.open('Se Registro Correctamente', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
          else {
            this.SpinnerService.hide();
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

        })

       

    }
}


Funcion_Cancelar(){
  this.router.navigate(['/']);
}

seleccionarTexto(event:any) {
  
  var myinputDeTg = event.target.id
  myinputDeTg.select();
  console.log(event.target.id)
}


seleccionarTexto2(event: any): void {
  const inputElement = event.target as HTMLInputElement;
  inputElement.select();  // Selecciona el texto dentro del input
  //this.inpuCantDef.nativeElement.focus()

}

 

}
