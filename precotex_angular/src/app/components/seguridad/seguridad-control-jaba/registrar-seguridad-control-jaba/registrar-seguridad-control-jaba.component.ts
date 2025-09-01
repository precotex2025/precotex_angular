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
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { DialogConfirmacionComponent } from '../../../dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { Router} from '@angular/router';

interface data_det {
  Cod_Registro_Cab: number
  Observacion:      string,
  Cod_Registro_Det: string, 
  Cod_Jaba:         string,
  Des_Jaba:         string,
  Total:            number,
  Fec_Registro:     string,
  Fecha:            string,
  Hora:             string,
  Cod_Usuario:      string

}
 
@Component({
  selector: 'app-registrar-seguridad-control-jaba',
  templateUrl: './registrar-seguridad-control-jaba.component.html',
  styleUrls: ['./registrar-seguridad-control-jaba.component.scss']
})
export class RegistrarSeguridadControlJabaComponent implements OnInit {
  Orden_ServicioMascara = [/[0-9]/i, /[0-9]/i, /[0-9]/i, '-', /[0-9]/i, /[0-9]/i, /[0-9]/i, /[0-9]/i, /[0-9]/i,/[0-9]/i];
  
  
  public data_det = [{
    Cod_Registro_Cab: 0,
    Observacion:      '',
    Cod_Registro_Det: 0,
    Cod_Jaba:         '',
    Des_Jaba:         '',
    Total:            0,
    Fec_Registro:     '',
    Fecha:            '',
    Hora:             '',
    Cod_Usuario:      ''
  }]


 // nuevas variables
 Cod_Registro_Cab   = 0
 Cod_Accion         = ''
 Observacion        = ''
 Cod_Registro_Det   = 0
 Cod_Jaba           = ''
 Total              = 0
 Fec_Registro       = ''
 Cod_Usuario        = ''
 Titulo             = ''
 isDisableAll       = false


 @ViewChild('myinputAdd') inputAdd!: ElementRef;
 @ViewChild('myinputDel') inputDel!: ElementRef;

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Cod_Registro:     [''],
    bulto_añadir:     [''],
    bulto_eliminar:   [''],
    Observacion:      ['']
  })



  //displayedColumns_cab: string[] = ['Cod_Registro_Det', 'Des_Jaba', 'Total', 'Fecha','Hora', 'Usuario', 'Acciones']
  displayedColumns_cab: string[] = ['Des_Jaba', 'Total', 'Fecha','Hora', 'Acciones']
  dataSource: MatTableDataSource<data_det>;




  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlJabaService: SeguridadControlJabaService,
    public dialog: MatDialog,
    public router: Router,
    private SpinnerService: NgxSpinnerService,) { this.dataSource = new MatTableDataSource(); }



  ngOnInit(): void { 
   
    this.Cod_Registro_Cab   =   GlobalVariable.Cod_Registro_CabG 
    this.Titulo             =   GlobalVariable.Cod_Registro_CabG.toString()
    this.Observacion        =   GlobalVariable.ObservacionG
    if(GlobalVariable.Flg_Estado == 'S'){
    this.isDisableAll       =   true
    this.formulario.controls['bulto_añadir'].disable()
    this.formulario.controls['bulto_eliminar'].disable()
    this.formulario.controls['Observacion'].disable()
  }
    //console.log(this.Titulo)
    if(this.Cod_Registro_Cab != 0){
      this.formulario.controls['Cod_Registro'].setValue(this.Cod_Registro_Cab)
      this.formulario.controls['Cod_Registro'].disable()
      this.formulario.controls['Observacion'].setValue(this.Observacion)
      this.ListarDetalleJaba()}


  }

  ListarDetalleJaba() {
     

    this.SpinnerService.show();
    this.Cod_Accion         = 'L'
    this.Cod_Registro_Det   = 0
    this.Cod_Registro_Cab   
    this.Cod_Jaba           = ''
    this.Total              = 0
    this.Fec_Registro       = ''

    this.seguridadControlJabaService.ListarDetalleJabaService(
      this.Cod_Accion,
      this.Cod_Registro_Det,
      this.Cod_Registro_Cab,
      this.Cod_Jaba,
      this.Total,
      this.Fec_Registro
    ).subscribe(
      (result: any) => { 
        if (result.length > 0) {
          console.log(result)
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
 

  

  applyEnterAdd(event: any) {
    this.InsertarRegistro()
  }

  applyEnterDel(event: any) {
    this.EliminarRegistroDetalle()
  }



  InsertarRegistro() {
    if(this.Cod_Registro_Cab == 0){
      this.InsertarRegistroCabecera()
    }else{
      this.InsertarRegistroDetalle()
    }
  
  }




  InsertarRegistroCabecera(){
    this.Cod_Jaba = this.formulario.get('bulto_añadir')?.value
    if(this.Cod_Jaba == ''){
      this.matSnackBar.open('Vuelva a escanear la jaba..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
    }else{
    this.Cod_Accion       = 'I'
    this.Cod_Registro_Cab
    this.Observacion      = this.formulario.get('Observacion')?.value
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
        console.log(result)

        if(result[0].Respuesta == 'OK'){
        if(this.Cod_Registro_Cab == 0){
          this.Cod_Registro_Cab = result[0].Cod_Registro_Cab
          this.Titulo = result[0].Cod_Registro_Cab
          this.InsertarRegistroDetalle()
        }
      }
       
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
    }
  }

  InsertarRegistroDetalle(){
    this.Cod_Accion         = 'I'
    this.Cod_Registro_Det   = 0
    this.Cod_Registro_Cab   
    this.Cod_Jaba           = this.formulario.get('bulto_añadir')?.value
    this.Total              = 0
    this.Fec_Registro       = ''
    this.seguridadControlJabaService.ListarDetalleJabaService(
      this.Cod_Accion,
      this.Cod_Registro_Det,
      this.Cod_Registro_Cab,
      this.Cod_Jaba,
      this.Total,
      this.Fec_Registro
    ).subscribe(
      (result: any) => { 
        if(result[0].Respuesta == 'OK'){
          console.log(result)
          this.ListarDetalleJaba()
          this.ReproducirOk()
          this.formulario.controls['bulto_añadir'].setValue('')
          this.inputAdd.nativeElement.focus()
        }
        else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          this.ReproducirError()
        }
    
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }



  EliminarRegistroDetalle(){
    this.Cod_Accion         = 'D'
    this.Cod_Registro_Det   = 0
    this.Cod_Registro_Cab   
    this.Cod_Jaba           = this.formulario.get('bulto_eliminar')?.value
    this.Total              = 0
    this.Fec_Registro       = ''
    this.seguridadControlJabaService.ListarDetalleJabaService(
      this.Cod_Accion,
      this.Cod_Registro_Det,
      this.Cod_Registro_Cab,
      this.Cod_Jaba,
      this.Total,
      this.Fec_Registro
    ).subscribe(
      (result: any) => { 
        if(result[0].Respuesta == 'OK'){
          console.log(result)
          this.ListarDetalleJaba()
          this.ReproducirOk()
          this.formulario.controls['bulto_eliminar'].setValue('')
          this.inputDel.nativeElement.focus()
        }
        else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          this.ReproducirError()
        }
    
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }
  


  ReproducirError() {
    const audio = new Audio('assets/error.mp3');
    audio.play();
  }
 
  ReproducirOk() {
    const audio = new Audio('assets/aceptado.mp3');
    audio.play();
  } 


  clearDate(event) {
    event.stopPropagation();
    this.formulario.controls['Fec_Registro'].setValue('')
  }


  ActualizarObservacion(){
    this.Observacion      = this.formulario.get('Observacion')?.value
   // if(this.Observacion != ''){
    this.Cod_Accion       = 'O'
    this.Cod_Registro_Cab
    this.Observacion     
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
        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  //}
  }



  VerDetalle(Cod_Registro_Det: number){
    GlobalVariable.Cod_Registro_DetG = Cod_Registro_Det
  }


  FinalizarRegistro(){
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
      console.log(this.Cod_Registro_Cab)
      this.Cod_Accion         = 'P'
      this.Cod_Registro_Det   = 0
      this.Cod_Registro_Cab   
      this.Cod_Jaba           = ''
      this.Total              = 0
      this.Fec_Registro       = ''
      this.seguridadControlJabaService.ListarDetalleJabaService(
        this.Cod_Accion,
        this.Cod_Registro_Det,
        this.Cod_Registro_Cab,
        this.Cod_Jaba,
        this.Total,
        this.Fec_Registro
      ).subscribe(
        (result: any) => { 
          if (result[0].Respuesta == 'OK') {
          let element: HTMLElement = document.getElementsByClassName('button-close')[0] as HTMLElement;
          element.click();
          this.router.navigate(['/SeguridadControlJaba']);  
          this.matSnackBar.open('El registro se proceso correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          }
          else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 }) 
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 2500,
        }))
      }})
  }

}

