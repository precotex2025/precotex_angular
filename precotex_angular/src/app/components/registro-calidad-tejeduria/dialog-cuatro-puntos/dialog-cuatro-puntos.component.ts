import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';
import { NgxSpinnerService }  from "ngx-spinner";
import { RegistroCalidadTejeduriaService } from 'src/app/services/registro-calidad-tejeduria.service';
import { Auditor } from 'src/app/models/Auditor';
import { Restriccion } from 'src/app/models/Restriccion';
import { MatDialog } from '@angular/material/dialog';
import { ValueCache } from 'ag-grid-community';

interface data_det {
  MTRS: string,
  CODIGO: string,
  DEFECTO: string,
  TAM_DEFECTO: string,
  PUNTOS: string,
}


interface data{
  CodRollo: string,
  Not:string,
  Dinspector: string,
  Ddigitador: string,
  Drestriccion: string,
  Dturno: string,
  DpMaquina:string,
  Dobservacion:string,
  DMetrosCuad:number,
  DCalidad: number
}


interface DEFECTO {
  Cod_Motivo: string,
  Descripcion: string,
}




@Component({
  selector: 'app-dialog-cuatro-puntos',
  templateUrl: './dialog-cuatro-puntos.component.html',
  styleUrls: ['./dialog-cuatro-puntos.component.scss']
})
export class DialogCuatroPuntosComponent implements OnInit {

  Cdrollo=''
  Not = ''
  Inspector=''
  Digitador=''
  Restriccion=''
  Turno=''
  Cod_Accion=''
  DpMaquina=''
  Dobservacion=''
  DMetrosCuad=0
  Total_Puntos=0
  DCalidad=0
  

  Cod_Motivo="";
  Descripcion="";


  MTRS= ""
  CODIGO= ""
  DEFECTO= ""
  TAM_DEFECTO= ""
  PUNTOS= ""

  ANCHO=""

  Tip_Trabajador=""
  Cod_Trabajador=''


    
  public data_det = [{
  MTRS: "",
  CODIGO: "",
  DEFECTO: "",
  TAM_DEFECTO: "",
  PUNTOS: "",
  ANCHO:""
    
  }]


  formulario = this.formBuilder.group({
    ncodrollo:          ['',[Validators.required]],
    not:                ['',[Validators.required]],
    ninspector:         ['',[Validators.required]],
    nrestriccion:       ['',[Validators.required]],
    nturno:             ['',[Validators.required]],

    ndefecto:           ['',[Validators.required]],
    ncoddefecto:        ['',[Validators.required]],
    nmetros:            ['',[Validators.required]],
    ntamdefecto:        [''],
    npuntos:            [''],
    tpuntos:            [0],
    ncalidad:           [0],
    InpCalidad:         [0],
    leyenda:            ['',[Validators.required]],  
    npmaquina:          ['',[Validators.required]],  
    nobservacion:       ['',[Validators.required]],  
    
    metroslineales:     [0],  
    anchotela:          [0,],  
    MetrosCuad:         [0],  

    //InpCalidad
  }) 

  listar_operacionAuditor:  Auditor[] = [];
  listar_operacionDigitador:  Auditor[] = [];
  listar_operacionRestriccion:  Restriccion[] = [];

  listar_operacionDE:    DEFECTO [] = [];
  filtroOperacionDE:        Observable<DEFECTO []> | undefined;


  displayedColumns_cab: string[] = 
  ['MTRS', 'CODIGO','DEFECTO', 'TAMANO_DEFECTO', 'PUNTOS', 'ACCION', 'OT', 'ROLLO', 'PREFIJO_MAQUINA', 'NUM_SEC']

  dataSource: MatTableDataSource<data_det>;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,   private dialog: MatDialog, 
    private RegistroCalidadTejeduriaService: RegistroCalidadTejeduriaService, 
    private SpinnerService: NgxSpinnerService
    , @Inject(MAT_DIALOG_DATA) public data: data) { 
      this.dataSource = new MatTableDataSource();
    }

    @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    
    this.showInspector();
    //this.showDigitador();
    this.showRestric();
    this.showDefectos();
    
    this.formulario.get('ncodrollo').disable();
    this.formulario.get('not').disable();
    this.formulario.get('ncoddefecto').disable();
    this.formulario.get('tpuntos').disable();
    this.formulario.get('ncalidad').disable();
    this.formulario.get('ninspector').disable();
    this.formulario.get('npuntos').disable();
    this.formulario.get('leyenda').disable();
    this.formulario.get('npmaquina').disable();
    this.formulario.get('MetrosCuad').disable();

    // this.formulario.get('ninspector').disable();
    // this.formulario.get('ndigitador').disable();
    // this.formulario.get('nrestriccion').disable();
    // this.formulario.get('nturno').disable();

    this.Cdrollo=this.data.CodRollo
    this.Not=this.data.Not
    this.DpMaquina=this.data.DpMaquina
    this.Dobservacion=this.data.Dobservacion
    this.DMetrosCuad=this.data.DMetrosCuad
    if (this.data.DCalidad)
    {
      this.DCalidad=this.data.DCalidad
      console.log("Calidad:"+this.data.DCalidad)
    }else{
      this.DCalidad=0
    }

    
    
    this.formulario.get('ncodrollo')?.setValue(this.Cdrollo)
    this.formulario.get('not')?.setValue(this.Not)
    this.formulario.get('npmaquina')?.setValue(this.DpMaquina)
    
    this.formulario.get('nobservacion')?.setValue(this.Dobservacion)
    this.formulario.get('nobservacion')?.setValue(this.Dobservacion)
    this.formulario.get('MetrosCuad')?.setValue(this.DMetrosCuad)

    this.formulario.get('ncalidad')?.setValue(this.DCalidad)
    this.formulario.get('InpCalidad')?.setValue(this.DCalidad)

     this.Inspector=this.data.Dinspector
     console.log(this.data.Dinspector)
     this.formulario.get('ninspector')?.setValue(this.data.Dinspector)


    this.Digitador=this.data.Ddigitador
    this.formulario.get('ndigitador')?.setValue(this.data.Ddigitador)

    this.Restriccion=this.data.Drestriccion
    this.formulario.get('nrestriccion')?.setValue(this.Restriccion)

    this.Turno=this.data.Dturno
    this.formulario.get('nturno')?.setValue(this.Turno)

    this.showDetalleDefectos();
    //console.log(this.data.CodRollo)

    //this.showSumaPtos();  COMENTADO 14062023 PARA CALCULAR LA CALIDAD

    //this.showCalidadRollo();

    this.mostrarDatosInspector();

  }



  ngAfterViewInit() {
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

  showDetalleDef() {
    this.RegistroCalidadTejeduriaService.showAuditor("","","TEJ").subscribe(
      (result: any) => {
        this.listar_operacionAuditor = result
        //console.log(this.listar_operacionAuditor);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }



  showInspector() {
    this.RegistroCalidadTejeduriaService.showAuditor("","","TEJ").subscribe(
      (result: any) => {
        this.listar_operacionAuditor = result
        //console.log(this.listar_operacionAuditor);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  showDigitador() {
    this.RegistroCalidadTejeduriaService.showAuditor("","","TEJ").subscribe(
      (result: any) => {
        this.listar_operacionDigitador = result
        //console.log(this.listar_operacionDigitador);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }



  showRestric() {
    this.RegistroCalidadTejeduriaService.showRestric().subscribe(
      (result: any) => {
        this.listar_operacionRestriccion = result
       // console.log(this.listar_operacionRestriccion);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  showDefectos() {
    this.RegistroCalidadTejeduriaService.showDefectos("B", "''").subscribe(
      (result: any) => {
        this.listar_operacionDE = result
        this.RecargarOperacionDefecto();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

 
  RecargarOperacionDefecto(){
    this.filtroOperacionDE = this.formulario.controls['ndefecto'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionDef(option) : this.listar_operacionDE.slice())),
    );
    
  }


  private _filterOperacionDef(value: string): DEFECTO[] {
    if (value == null || value == undefined ) {
      value = ''
      
    }
    const filterValue = value.toLowerCase();
    return this.listar_operacionDE.filter(option => option.Cod_Motivo.toLowerCase().includes(filterValue));
  }

  CambiarValorDef(Cod_Motivo: string, Descripcion: string){
    //this.Cod_Motivo = Cod_Motivo
    this.formulario.get('ncoddefecto')?.setValue(Cod_Motivo)
  }


  showDetalleDefectos() {
    this.RegistroCalidadTejeduriaService.showDetalleDefectos(this.formulario.get('not')?.value, this.formulario.get('ncodrollo')?.value).subscribe(
      //this.RegistroCalidadTejeduriaService.showDetalleDefectos("44502", "22").subscribe(
      (result: any) => {
        this.dataSource = result
        console.log(result)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  showSumaPtos() {
    this.RegistroCalidadTejeduriaService.showSumaPtos(this.formulario.get('not')?.value, this.formulario.get('ncodrollo')?.value, 
    this.formulario.get('npmaquina')?.value, this.formulario.get('MetrosCuad')?.value ).subscribe(
      (result: any) => {

        if (result[0].Status == '0') {
          this.matSnackBar.open(result[0].Mensaje, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
        } else {
          this.formulario.get('tpuntos')?.setValue(result[0].SumaPt)
        }
        
         this.Total_Puntos=(result[0].SumaPt*100)/this.formulario.get('MetrosCuad')?.value
         console.log("Calidad del rollo:"+this.Total_Puntos)

          /* PARA EL CALCULO DE LA CALIDAD */
            let CalRoll = 0;
            if(this.Total_Puntos < 1){
              CalRoll = 0;
            }else if(this.Total_Puntos >= 1 && this.Total_Puntos <= 5){
              CalRoll = 1;
            }else if(this.Total_Puntos >= 6 && this.Total_Puntos <= 20){
              CalRoll = 2;
            }else if(this.Total_Puntos > 20){
              CalRoll = 3;
            }
            this.formulario.get('ncalidad')?.setValue(CalRoll)
            /* PARA EL CALCULO DE LA CALIDAD */


      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1 }))
      
      
  }

  showCalidadRollo()
  {
    this.formulario.get('ncalidad')?.setValue('')      
    let CalRoll = 0;
    //let x = this.formulario.controls['tpuntos']?.value;
    this.Total_Puntos=this.formulario.controls['tpuntos']?.value;
            if(this.Total_Puntos < 1){
              CalRoll = 0;
            }else if(this.Total_Puntos >= 1 && this.Total_Puntos <= 5){
              CalRoll = 1;
            }else if(this.Total_Puntos >= 6 && this.Total_Puntos <= 20){
              CalRoll = 2;
            }else if(this.Total_Puntos > 20){
              CalRoll = 3;
            }
            // else{
            // CalRoll = 4;
            // }
            this.formulario.get('ncalidad')?.setValue(CalRoll)
            console.log(this.Total_Puntos)
            console.log(CalRoll)
            

  }






  submit(formDirective) :void {
    //console.log(this.formulario.valid)
    
      this.Cod_Accion   = 'I'
      this.Inspector=this.formulario.get('ninspector')?.value,
      this.Digitador=this.formulario.get('ndigitador')?.value,
      this.Restriccion=this.formulario.get('nrestriccion')?.value,
      this.Turno=this.formulario.get('nturno')?.value,

      this.CODIGO= this.formulario.get('ncoddefecto')?.value,
      this.MTRS= this.formulario.get('nmetros')?.value,
      this.ANCHO= this.formulario.get('anchotela')?.value,
      this.TAM_DEFECTO= this.formulario.get('ntamdefecto')?.value,
      this.PUNTOS= this.formulario.get('npuntos')?.value

      var tp =  this.formulario.get('ninspector')?.value;
      this.Tip_Trabajador=tp.charAt(0)

      var ct =  this.formulario.get('ninspector')?.value;
      this.Cod_Trabajador=ct.substring(1)
      this.valKeySize();
      //console.log('tp es:'+this.Cod_Trabajador)

          this.RegistroCalidadTejeduriaService.GuardarDefectos(
            this.Cod_Accion,
            this.Not,
            this.Cdrollo,
            this.DpMaquina,
            this.formulario.get('ninspector')?.value,
            this.formulario.get('ninspector')?.value,
            this.formulario.get('nrestriccion')?.value,
            this.formulario.get('nturno')?.value,
            this.MTRS,
            this.CODIGO,
            this.PUNTOS,
            "",
            this.ANCHO, //AQUI
            //this.formulario.get('ncalidad')?.value,
            this.formulario.get('InpCalidad')?.value,
            this.Tip_Trabajador,
            this.Cod_Trabajador,
            this.formulario.get('nobservacion')?.value,
            this.formulario.get('MetrosCuad')?.value
            ).subscribe(
            (result: any) => {
              console.log(result);
              if (result) {
                if (result.Mensaje == 'Ok') {
                  this.matSnackBar.open('Registrado Correctamente!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
                  //this.dialog.closeAll();
                  this.showDetalleDefectos();
                  this.limpiar();
                  //this.showSumaPtos();    SUMABA LOS PUNTAJES Y CALCULA LA CALIDAD EN BASE A 4 PUNTOS
                  
                  
                } else {
                  this.matSnackBar.open(result.Mensaje, 'Cerrar', {
                    duration: 3000,
                  })
                }
              } else {
                this.matSnackBar.open('Error, No Se Pudo Registrar!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
              }

            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

      }


      EliminarDefecto(Ot: string, Rollo: string, CodDefecto: string, PreMaqui: string, Num_secuencia: number) {
        this.Cod_Accion   = 'D'
        var tp =  this.formulario.get('ninspector')?.value;
        this.Tip_Trabajador=tp.charAt(0)
        var ct =  this.formulario.get('ninspector')?.value;
        this.Cod_Trabajador=ct.substring(1)

        if(confirm("Desea Eliminar este registro?")) {
          this.valKeySize();
          //console.log("Implement delete functionality here");
          this.RegistroCalidadTejeduriaService.eliminarDefecto(
          this.Cod_Accion,
            Ot,
            Rollo,
            PreMaqui,
            this.formulario.get('ninspector')?.value,
            this.formulario.get('ninspector')?.value,
            this.formulario.get('nrestriccion')?.value,
            this.formulario.get('nturno')?.value,
            this.MTRS,
            CodDefecto,
            this.PUNTOS,
            "",
            this.TAM_DEFECTO,
            this.formulario.get('ncalidad')?.value,
            this.Tip_Trabajador,
            this.Cod_Trabajador,
            this.formulario.get('nobservacion')?.value,
            Num_secuencia             
          ).subscribe(
            (result: any) => {
              if (result.Mensaje == 'Ok') {
                this.matSnackBar.open('El registro se elimino correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 3000 })
                this.showDetalleDefectos();
                this.limpiar();
                //this.showSumaPtos();
                
                  
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

        calculomt2() {
          
          let z = 0;
          let x = this.formulario.controls['metroslineales']?.value;
          let y = (this.formulario.controls['anchotela']?.value / 100);
          z= x * y
          this.formulario.get('MetrosCuad')?.setValue(z.toFixed(2))
          }



        valKeySize() {
          
          let z = 0;
          let x = this.formulario.controls['ntamdefecto']?.value;
          let y = this.formulario.controls['ndefecto']?.value;
    
          y = y.toLowerCase();
          if(y.indexOf("aguje") == 0){ 
            if(x == 0){
              z = 0;
            }else if(x <= 1){
              z = 1;  
            }else if(x > 1 && x <= 2){
              z = 2;
            }else if(x > 2 && x <= 4){
              z = 3;
            }else{
              z = 4;
            }
          }else{
            if(x == 0){
              z = 0;
            }else if(x <= 5){
              z = 1;
            }else if(x > 5 && x <= 10){
              z = 2;
            }else if(x > 10 && x <= 20){
              z = 3;
            }else{
              z = 4;
            }
          }
          console.log(z)
          this.formulario.get('npuntos')?.setValue(z)
          }


          limpiar(){
            this.formulario.get('ndefecto')?.setValue('');
            this.formulario.get('ncoddefecto')?.setValue('');
            this.formulario.get('nmetros')?.setValue('');
            this.formulario.get('ntamdefecto')?.setValue('');
            this.formulario.get('npuntos')?.setValue('');
            this.formulario.get('metroslineales')?.setValue(0);
            this.formulario.get('anchotela')?.setValue(0);
            //this.formulario.get('MetrosCuad')?.setValue(0);
            //document.getElementById("ndefecto")?.focus();


          }


          mostrarDatosInspector() {

            //let dni_tejedor=this.formulario.get('dnitejedor')?.value;
            let Cod_Trabajador=GlobalVariable.vcodtra;
            let Tip_Trabajador=GlobalVariable.vtiptra;
            //if (dni_tejedor.length===8) {
              console.log(Cod_Trabajador.length);
              this.RegistroCalidadTejeduriaService.traerDatosInspector(Cod_Trabajador, Tip_Trabajador).subscribe(
                (result: any) => {
                  console.log(result);
                   if (result[0].Respuesta == 'OK') {
                    //this.formulario.get('dnitejedor')?.setValue(result[0].Nro_DocIde); 
                    this.formulario.get('ninspector')?.setValue(result[0].Cod_Trabajador);
                   }
                 },
                 (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
            //}
        
        
          }
     




    
     
    
  
}
