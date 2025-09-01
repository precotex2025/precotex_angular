import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistroCalidadTejeduriaService } from 'src/app/services/registro-calidad-tejeduria.service';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { GlobalVariable } from '../../VarGlobals'; //<==== this one
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";

import { startWith, map,debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Auditor } from 'src/app/models/Auditor';
import { Digitador } from 'src/app/models/Digitador';
import { Restriccion } from 'src/app/models/Restriccion';
import { MatPaginator } from '@angular/material/paginator';
import { DialogCuatroPuntosComponent } from './dialog-cuatro-puntos/dialog-cuatro-puntos.component';

interface data_det {
  ID: string,
  ROLLO: string,
  TALLA: string,
  OT: string,
  Lote: string,
  Partida : string,
  OC: string,
  PROVEEDOR: string,
  prefijo_maquina: string,
  Codigo_Rollo:string,
}




@Component({
  selector: 'app-registro-calidad-tejeduria',
  templateUrl: './registro-calidad-tejeduria.component.html',
  styleUrls: ['./registro-calidad-tejeduria.component.scss']
})
export class RegistroCalidadTejeduriaComponent implements OnInit {

  mask_cod_ordtra = [/[A-Z-0-9]/i, /\d/, /\d/, /\d/, /\d/];

  Cd_Rollo:string =''
  // Not:string =''
  // Cod_Auditor:string =''
  // Cod_Digitador:string =''
  
  public data_det = [{
    ID:"",
    ROLLO:"",
    TALLA:"",
    OT:"",
    Lote:"",
    Partida:"",
    OC:"",
    PROVEEDOR:"",
    prefijo_maquina:"",
    Codigo_Rollo:""
    
  }]




  formulario = this.formBuilder.group({
    sOt: [''],
    nstrollo: ['a'],
    ninspector: [''],
    ndigitador:[''],
    nrestriccion: [''],
    nturno:[''],
    nobservacion:['']
  })


  dataForExcel = [];


  displayedColumns_cab: string[] = 
  ['ID', 'ROLLO','TALLA', 'OT', 'Lote','Partida', 'OC','PROVEEDOR',
  'Prefijo_Maquina','Codigo_Rollo','TELA_COMB','NOMBRE_TELA','CALIDAD','Cod_Maquina_Tejeduria','MAQUINA','Sec_Maquina','Tip_Trabajador_Tejedor','Cod_Trabajador_Tejedor','TEJEDOR'
  ,'KGS_PRODUCIDOS','STATUS_ROLLO','Calf_Auto','Def_Tej','INSPECTOR','Observaciones_Inspeccion','FECHA_CALIFICACION','DIGITADOR','TURNO'
  ,'FECHA_PRODUCCION','FECHA_ALMACEN','FECHA_DESPACHO_CRUDO','flg_status','RESTRICCION','OBSERVACION','AUTORIZA_TERCERO','PEDIDO', 'CALIFICACION','Cod_Auditor', 
  'Cod_Digitador','Cod_Restriccion', 'Cod_Turno', 'MetrosCuad']

  dataSource: MatTableDataSource<data_det>;

  listar_operacionAuditor:  Auditor[] = [];
  listar_operacionDigitador:  Auditor[] = [];
  listar_operacionRestriccion:  Restriccion[] = [];


  ndigitador=''
  ninspector=''
  selectedValueAuditor: string = ''; 
  selectedValueDigitador: string = ''; 
  desAuditor: string = '';

  constructor(private formBuilder: FormBuilder, private matSnackBar: MatSnackBar,  private dialog: MatDialog, private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService, private exceljsService:ExceljsService, private RegistroCalidadTejeduriaService: RegistroCalidadTejeduriaService) 
    { 
      this.dataSource = new MatTableDataSource();
    }


    @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
   // this.showInspector()
    //this.showRestric()
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




  showInspector() {
    this.RegistroCalidadTejeduriaService.showAuditor("","","TEJ").subscribe(
      (result: any) => {
        this.listar_operacionAuditor = result
        //console.log(this.listar_operacionAuditor);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  
  showDigitador() {
    this.RegistroCalidadTejeduriaService.showDigitador("","","TEJ").subscribe(
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
        //console.log(this.listar_operacionRestriccion);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  showOtRollos() {
    //let fec_despacho = this.formulario.value['fec_registro'];
    //fec_despacho = moment(fec_despacho).format('YYYY-MM-DDTHH:mm:ss');

    this.RegistroCalidadTejeduriaService.showOtRollos('1', this.formulario.get('sOt')?.value,'','','','','','N',this.formulario.get('nstrollo')?.value).subscribe(
           (result: any) => {
          //this.data_det = result
          this.dataSource.data = result
          //console.log(this.data_det);
          //console.log(this.dataSource.data);
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }



  openDialogRollo(Cd_Rollo: string, Ot:string, Cod_Auditor:string, Cod_Digitador:string, 
    Cod_Restriccion: string, Cod_Turno: String, Prefijo_Maquina: string, 
    Observacion: string, MetrosCuad: number, Calidad: number){
    console.log(Cod_Auditor)
    let dialogRef = this.dialog.open(DialogCuatroPuntosComponent, {
    minWidth:'98%',
    minHeight:'98%',
    disableClose: true,
    data: {
      CodRollo: Cd_Rollo,
      Not:  Ot,
     
      Dinspector: Cod_Auditor, 
      Ddigitador: Cod_Digitador, 
      Drestriccion: Cod_Restriccion, 
      Dturno: Cod_Turno,
      DpMaquina: Prefijo_Maquina,
      Dobservacion: Observacion,
      DMetrosCuad: MetrosCuad,
      DCalidad:Calidad
      }

,
      // Dinspector: this.formulario.get('ninspector')?.value, 
      // Ddigitador: this.formulario.get('ndigitador')?.value, 
      //Drestriccion: this.formulario.get('nrestriccion')?.value , 
      //Dturno: this.formulario.get('nturno')?.value  }
        
      });
      
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result == 'false') {
      //     this.showOtRollos()
      //   }else{
      //     this.showOtRollos()
      //   }
      //   })
        //this.showOtRollos();
      

    }





}
