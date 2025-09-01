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
import { Router} from '@angular/router';
import { DialogRegistrarEstadoControlMovmientosJabasComponent} from './dialog-seguridad-control-movimientos-jabas/dialog-registrar-estado-control-movmientos-jabas/dialog-registrar-estado-control-movmientos-jabas.component'
import { DialogConfirmacionComponent} from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  Cod_Mov_Jaba:     number,
  Cod_Jaba:         number,
  Des_Jaba:         string,
  Cod_Barras:       string,
  Cod_Jaba_Estado:  number,
  Des_Jaba_Estado:  string,
  Observacion:      string,
  Cod_Accion:       string,
  Accion:           string,
  Fec_Registro:     string,
  Fecha:            string,
  Hora:             string,
  Cod_Usuario:      string,
  Cod_Estado:       string
}
@Component({
  selector: 'app-seguridad-control-movimientos-jabas',
  templateUrl: './seguridad-control-movimientos-jabas.component.html',
  styleUrls: ['./seguridad-control-movimientos-jabas.component.scss']
})
export class SeguridadControlMovimientosJabasComponent implements OnInit {
  
  num_guiaMascara = [/[A-Z-0-9]/i, /[A-Z-0-9]/i, /[A-Z-0-9]/i, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

 // nuevas variables
 Cod_Accion       = ''
 Cod_Mov_Jaba     =  0
 Cod_Jaba         =  0
 Cod_Baras        = ''
 Cod_Jaba_Estado  = 0
 Cod_Estado       = ''
 Observacion      = ''
 Des_Jaba         = ''
 Cod_Barras       = ''
 Operacion        = GlobalVariable.Accion
 Fec_Registro     = ''
 Fecha            = ''
 Hora             = ''
 Cod_Usuario      = ''
 Titulo           = ''
 Cod_Barras_Flg   = ''
 nom_proveedor = ''
 ruc_proveedor = ''
 cod_proveedor = ''
 Id_Mov_Jaba_Cab = 0
 Id_Mov_Jaba_Det = 0
 Num_Guia = ''

 @ViewChild('myinputGuia') inputGuia!: ElementRef;
 @ViewChild('myinputAdd') inputAdd!: ElementRef;
 @ViewChild('myinputDel') inputDel!: ElementRef;

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    bulto_añadir:     [''],
    bulto_eliminar:   [''],
    num_guia:         [''],
    ruc_proveedor:    [''],
    nom_proveedor:    ['']
  })



  displayedColumns_cab: string[] = ['Estado', 'Fecha','Hora', 'Observacion','Usuario']
  dataSource: MatTableDataSource<data_det>;




  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlJabaService: SeguridadControlJabaService,
    public dialog: MatDialog,
    public router: Router,
    private SpinnerService: NgxSpinnerService,) { this.dataSource = new MatTableDataSource(); }


     
    
  ngOnInit(): void { 
   if(this.Operacion == 'S'){
     this.Titulo = 'Salida'
   }
   else if(this.Operacion == 'I'){
     this.Titulo = 'Ingreso'
   }

   this.formulario.controls['nom_proveedor'].disable()
  }

  ListarMovimientosJabas() {
    this.SpinnerService.show();
    this.Cod_Accion         = 'L'
    this.Cod_Mov_Jaba       = 0 
    this.Cod_Barras         = this.Cod_Barras_Flg
    this.Cod_Estado         = ''
    this.Observacion        = ''
    this.Operacion          = ''
    this.Fec_Registro       = ''        
    this.seguridadControlJabaService.ListarMovimientosJabas(
      this.Cod_Accion,
      this.Cod_Mov_Jaba,
      this.Cod_Barras,
      this.Cod_Estado,
      this.Observacion,
      this.Operacion,
      this.Fec_Registro
    ).subscribe(
      (result: any) => { 
        if (result.length > 0) {
   
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


  
  BuscarNomProveedor() {
    this.ruc_proveedor = this.formulario.get('ruc_proveedor')?.value

    if (this.ruc_proveedor.length !== 11 || this.ruc_proveedor == null) {
      this.formulario.patchValue({ cod_proveedor: '' })
      this.nom_proveedor = ''
    } else {

      this.seguridadControlJabaService.BuscarNomProveedorService(this.ruc_proveedor).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {


            this.cod_proveedor =  result[0].Codigo
            this.formulario.controls['nom_proveedor'].setValue(result[0].Nombres)
       
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 })
            this.cod_proveedor =  ''
            this.formulario.controls['nom_proveedor'].setValue('')
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center',  verticalPosition: 'top',duration: 1500 }))
    }
  }
 

  applyEnterAdd(event: any) {
    this.InsertarRegistroCab()
    
  }

  applyEnterDel(event: any) {
    this.EliminarRegistroDetalle()
  }

  EliminarRegistroDetalle(){
    alert('eliminar')
  }

  ActualizarProcedenciaJaba(){
    this.Cod_Accion         = 'U'
    this.Cod_Mov_Jaba       = 0
    this.Cod_Barras         = this.formulario.get('bulto_añadir')?.value
    this.Cod_Estado         = ''
    this.Observacion        = ''
    this.Operacion          = ''
    this.Fec_Registro       = ''
    this.seguridadControlJabaService.ListarMovimientosJabas(
      this.Cod_Accion,
      this.Cod_Mov_Jaba,
      this.Cod_Barras,
      this.Cod_Estado,
      this.Observacion,
      this.Operacion,
      this.Fec_Registro
    ).subscribe(
      (result: any) => { 
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open("Proceso Correcto..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          this.Cod_Baras = this.formulario.get('bulto_añadir')?.value
          this.ListarMovimientosJabas()
          this.formulario.controls['num_guia'].disable()
          this.formulario.controls['ruc_proveedor'].disable()
          this.Cod_Barras_Flg = this.formulario.get('bulto_añadir')?.value
          this.formulario.controls['bulto_añadir'].setValue('')
          this.inputAdd.nativeElement.focus()
     
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          this.formulario.controls['bulto_añadir'].setValue('')
          this.Cod_Baras = ''
          this.Cod_Barras_Flg = ''
          this.dataSource.data = []
          this.inputAdd.nativeElement.focus()
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }

  InsertarRegistroCab() {
    if(this.Id_Mov_Jaba_Cab == 0){
    this.cod_proveedor
    this.Num_Guia = this.formulario.get('num_guia')?.value
    if(this.cod_proveedor != '' && this.Num_Guia != ''){
    this.Cod_Accion         = 'I'
    this.Id_Mov_Jaba_Cab   
    this.Id_Mov_Jaba_Det   
    this.cod_proveedor
    this.Num_Guia = this.Num_Guia
    this.Cod_Baras = this.formulario.get('bulto_añadir')?.value
    this.seguridadControlJabaService.LG_MOVIMIENTOS_JABA(
      this.Cod_Accion,
     this.Id_Mov_Jaba_Cab,
     this.Id_Mov_Jaba_Det,
     this.cod_proveedor,
     this.Num_Guia,
     this.Cod_Baras
    ).subscribe(
      (result: any) => { 
        if (result[0].Id_Mov_Jaba_Cab != undefined) {

            this.Id_Mov_Jaba_Cab = result[0].Id_Mov_Jaba_Cab
            this.formulario.controls['num_guia'].disable()
            this.formulario.controls['ruc_proveedor'].disable()
            console.log(result[0].Id_Mov_Jaba_Cab)
            console.log(this.Id_Mov_Jaba_Cab)
            this.InsertarRegistroDet()
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
         
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
    }else{
      this.matSnackBar.open("Debe llenar todos los campos...", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
    }
    } else{
      this.InsertarRegistroDet()
    }
  }


  
  InsertarRegistroDet() {
    this.Cod_Baras = this.formulario.get('bulto_añadir')?.value
    console.log(this.Id_Mov_Jaba_Cab)
    if(this.Id_Mov_Jaba_Cab != 0){
    this.Cod_Accion  = 'D'
    this.Id_Mov_Jaba_Det   
    this.cod_proveedor
    this.Num_Guia = this.formulario.get('num_guia')?.value
    this.Cod_Baras =  this.Cod_Baras
    this.seguridadControlJabaService.LG_MOVIMIENTOS_JABA(
    this.Cod_Accion,
     this.Id_Mov_Jaba_Cab,
     this.Id_Mov_Jaba_Det,
     this.cod_proveedor,
     this.Num_Guia,
     this.Cod_Baras
    ).subscribe(
      (result: any) => { 
        if (result[0].Respuesta == 'OK') {
          this.Cod_Barras_Flg = this.formulario.get('bulto_añadir')?.value
          this.Cod_Baras = ''
          this.inputAdd.nativeElement.focus()
          this.ListarMovimientosJabas()
          this.formulario.controls['bulto_añadir'].setValue('')
          this.inputAdd.nativeElement.focus()
          this.matSnackBar.open("Proceso Correcto..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
         
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
    }else{
      this.matSnackBar.open("Debe llenar todos los campos detalle..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
    }
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


  DarDeBajaJaba(){
    let dialogRef =  this.dialog.open(DialogConfirmacionComponent, {disableClose: true,data: { }});
      dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.Cod_Accion         = 'B'
        this.Cod_Mov_Jaba       = 0
        this.Cod_Barras         
        this.Cod_Estado         = 'OUT'
        this.Observacion        = ''
        this.Operacion          = ''
        this.Fec_Registro       = ''
        this.seguridadControlJabaService.ListarMovimientosJabas(
          this.Cod_Accion,
          this.Cod_Mov_Jaba,
          this.Cod_Barras,
          this.Cod_Estado,
          this.Observacion,
          this.Operacion,
          this.Fec_Registro
        ).subscribe(
          (result: any) => { 
            if (result[0].Respuesta == 'OK') {
              this.matSnackBar.open("Proceso Correcto..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
              this.Cod_Barras_Flg = ''
              this.dataSource.data = []
              this.inputAdd.nativeElement.focus()
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
  

  VerDetalle(){

    let dialogRef =  this.dialog.open(DialogRegistrarEstadoControlMovmientosJabasComponent, { 
      disableClose: true,
      panelClass: 'my-class',
      data: { Cod_Barras: this.Cod_Barras_Flg
        }});
        dialogRef.afterClosed().subscribe(result => {
          if (result == 'true') { 
            this.ListarMovimientosJabas()

          }})
  }


  Limpiar(){
    this.formulario.controls['num_guia'].enable()
    this.formulario.controls['ruc_proveedor'].enable()
    this.formulario.controls['num_guia'].setValue('')
    this.formulario.controls['ruc_proveedor'].setValue('')
    this.formulario.controls['bulto_añadir'].setValue('')
    this.Cod_Baras = ''
    this.Cod_Barras_Flg = ''
    this.dataSource.data = []
    this.inputGuia.nativeElement.focus()
    this.Id_Mov_Jaba_Cab = 0
    this.Id_Mov_Jaba_Det = 0

  }

}

