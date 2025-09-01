import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment'; 
import { Observable } from 'rxjs';
import { SeguridadControlJabaService } from 'src/app/services/seguridad-control-jaba.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { GlobalVariable } from '../../../VarGlobals'; //<==== this one
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';
import { DialogConfirmacionComponent} from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component'
import { DialogRegistrarCabeceraJabaComponent } from "./dialog-seguridad-control-jaba/dialog-registrar-cabecera-jaba/dialog-registrar-cabecera-jaba.component";
import { ExceljsService} from 'src/app/services/exceljs-jaba.service';

interface data_det {
  Cod_Registro_Cab: number
  Observacion:      string,
  Total:            number,
  Fec_Registro:     string,
  Cod_Usuario:      string,
  Flg_Estado:       string,
  Cod_Almacen:      string,
  Num_MovStk:       string

}
 
@Component({
  selector: 'app-seguridad-control-jaba',
  templateUrl: './seguridad-control-jaba.component.html',
  styleUrls: ['./seguridad-control-jaba.component.scss']
})
export class SeguridadControlJabaComponent implements OnInit {

  //Orden_ServicioMascara = [/[0-9]/i, /[0-9]/i, /[0-9]/i, '-', /[0-9]/i, /[0-9]/i, /[0-9]/i, /[0-9]/i, /[0-9]/i,/[0-9]/i];
  
  
  public data_det = [{
    Cod_Registro_Cab: '',
    Observacion:      '',
    Total:            '',
    Fec_Registro:     '',
    Cod_Usuario:      ''
  }]


 // nuevas variables
 Cod_Accion           = ''
 Cod_Registro_Cab     = 0
 Observacion          = ''
 Total                = 0
 Fec_Registro         = ''
 Cod_Usuario          = ''
 isDisableVerDetalle  = true
 dataForExcel = [];
 Cod_Rol              = GlobalVariable.vCod_Rol

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Fec_Registro:   [''],
    Cod_registro: ['']
  })


  displayedColumns_cab: string[] = ['Codigo',  'Total', 'Fec_Registro', 'Cod_Usuario','Observacion', 'Estado','Almacen','Movimiento' ,'Acciones']
  dataSource: MatTableDataSource<data_det>;



  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlJabaService: SeguridadControlJabaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private exceljsService:ExceljsService) { this.dataSource = new MatTableDataSource(); }



  ngOnInit(): void { 
    GlobalVariable.Num_movstk = '';
    this.ListarCabeceraJaba()
  }


 
  clearDate(event) {
    event.stopPropagation();
    this.formulario.controls['Fec_Registro'].setValue('')
  }

  generateExcel(Cod_Registro_Cab: number) {
    this.SpinnerService.show();
    this.Cod_Accion       = 'W'
    this.Cod_Registro_Cab = Cod_Registro_Cab
    this.Observacion      = ''
    this.Total            = 0
    this.Fec_Registro     = ''
    this.seguridadControlJabaService.ListarCabeceraJabaService(
      this.Cod_Accion,
      this.Cod_Registro_Cab,
      this.Observacion,
      this.Total,
      this.Fec_Registro
    ).subscribe(
      (result: any) => { 
        var Fec_Registro = result[0].Fec_Registro
        var Total = result[0].Total
        if (result.length > 0) {
          
          result.forEach((row: any) => {
            this.dataForExcel.push(Object.values(row)) 
       
          })
    
          let reportData = {
            title: 'REPORTE CONTROL JABA - ID '+result[0].Cod_Registro_Cab,
            data: this.dataForExcel,
            Fec_Registro: Fec_Registro,
            Total: Total,
            flg_jaba: true,
            headers: Object.keys(result[0])
          }
      
          this.exceljsService.exportExcel(reportData);
          this.dataForExcel = []
          this.matSnackBar.open('Descarga exitosa!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }


  ListarCabeceraJaba() {
    this.SpinnerService.show();
    this.Cod_Accion       = 'L'
    this.Cod_Registro_Cab 
    this.Observacion      = ''
    this.Total            = 0
    this.Fec_Registro     = this.formulario.get('Fec_Registro')?.value
    

    this.seguridadControlJabaService.ListarCabeceraJabaService(
      this.Cod_Accion,
      this.Cod_Registro_Cab,
      this.Observacion,
      this.Total,
      this.Fec_Registro
    ).subscribe(
      (result: any) => { 
        if (result.length > 0) {
          //console.log(result)
          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }


  AgregarDetalle(){
    GlobalVariable.Cod_Registro_CabG = 0
    GlobalVariable.Flg_Estado = 'N'
  }


  VerDetalle(Cod_Registro_Cab: number, Observacion: string, Flg_Estado: string) {
   // console.log(Cod_Registro_Cab)
    GlobalVariable.Cod_Registro_CabG = Cod_Registro_Cab
    GlobalVariable.ObservacionG = Observacion
    GlobalVariable.Flg_Estado = Flg_Estado
  }

  EliminarRegistroCabecera(Cod_Registro_Cab: number){
    let dialogRef =  this.dialog.open(DialogEliminarComponent, { disableClose: true});
    dialogRef.afterClosed().subscribe(result =>{
    if(result == 'true'){
      this.Cod_Accion       = 'D'
      this.Cod_Registro_Cab = Cod_Registro_Cab
      this.Observacion      = ''
      this.Total            = 0
      this.Fec_Registro     = ''
      this.seguridadControlJabaService.ListarCabeceraJabaService(
        this.Cod_Accion,
        this.Cod_Registro_Cab,
        this.Observacion,
        this.Total,
        this.Fec_Registro
      ).subscribe(
        (result: any) => { 
          if(result[0].Respuesta == 'OK'){
            this.ListarCabeceraJaba()
            this.matSnackBar.open("Proceso correcto..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          }
          else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          }
  
        
         
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 2500,
        }))
    }})
  }

  openDialog() {

    let dialogRef = this.dialog.open(DialogRegistrarCabeceraJabaComponent, {
       disableClose: true,
       data: {}
     });
 
     dialogRef.afterClosed().subscribe(result => {
 
       if (result == 'false') {
         this.ListarCabeceraJaba()
       }
  
     })
 
   }

   RevertirEstado(Cod_Registro_Cab: number){
    let dialogRef =  this.dialog.open(DialogConfirmacionComponent, { disableClose: true});
    dialogRef.afterClosed().subscribe(result =>{
    if(result == 'true'){
      this.SpinnerService.show();
      this.Cod_Accion       = 'R'
      this.Cod_Registro_Cab = Cod_Registro_Cab
      this.Observacion      = ''
      this.Total            = 0
      this.Fec_Registro     = ''
      this.seguridadControlJabaService.ListarCabeceraJabaService(
        this.Cod_Accion,
        this.Cod_Registro_Cab,
        this.Observacion,
        this.Total,
        this.Fec_Registro
      ).subscribe(
        (result: any) => { 
          if (result[0].Respuesta == 'OK') {
            this.ListarCabeceraJaba()
            this.matSnackBar.open('El registro se ha revertido con exito..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            this.SpinnerService.hide();
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            this.SpinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 2500,
        }))
    }})
   }


   FinalizarRegistro(Cod_Registro_Cab: number){
    let dialogRef =  this.dialog.open(DialogConfirmacionComponent, { disableClose: true});
    dialogRef.afterClosed().subscribe(result =>{
    if(result == 'true'){
      this.SpinnerService.show();
      this.Cod_Accion       = 'P'
      this.Cod_Registro_Cab = Cod_Registro_Cab
      this.Observacion      = ''
      this.Total            = 0
      this.Fec_Registro     = ''
      this.seguridadControlJabaService.ListarCabeceraJabaService(
        this.Cod_Accion,
        this.Cod_Registro_Cab,
        this.Observacion,
        this.Total,
        this.Fec_Registro
      ).subscribe(
        (result: any) => { 
          if (result[0].Respuesta == 'OK') {
            this.ListarCabeceraJaba()
            this.matSnackBar.open('El registro se ha finalizado con exito..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            this.SpinnerService.hide();
          }
          else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
            this.SpinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 2500,
        }))
    }})

   } 

} 

