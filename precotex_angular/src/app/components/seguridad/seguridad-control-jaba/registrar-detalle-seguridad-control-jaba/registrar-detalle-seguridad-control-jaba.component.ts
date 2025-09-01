import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
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
import { DialogEliminarComponent } from '../../../dialogs/dialog-eliminar/dialog-eliminar.component';
import { DialogColorRegistrarDetalleComponent} from '../dialog-seguridad-control-jaba/dialog-color-registrar-detalle/dialog-color-registrar-detalle.component'
import { DialogTallaRegistrarDetalleComponent} from '../dialog-seguridad-control-jaba/dialog-talla-registrar-detalle/dialog-talla-registrar-detalle.component'
import { DialogCantidadRegistrarDetalleComponent} from '../dialog-seguridad-control-jaba/dialog-cantidad-registrar-detalle/dialog-cantidad-registrar-detalle.component'
import { DialogConfirmacionComponent} from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component'
import { DialogAdicionalComponent} from 'src/app/components/dialogs/dialog-adicional/dialog-adicional.component'
interface data_det {
    Cod_Registro_Sub_Det: number,
    Cod_Registro_Det:     number,
    Cod_fabrica:          string,
    Cod_OrdPro:           string,
    Cod_Cliente:          string,
    Des_Cliente:          string,
    Cod_EstPro:           string,
    Des_EstPro:           string,
    Cod_Present:          string,
    Des_Present:          string,
    Cod_Talla:            string,
    Cant_Prendas:         number,
    Fec_Registro:         string

}

interface Color {
  Cod_Present: string;
  Des_Present: string;  
}

interface Talla {
  Cod_Talla: string;
}


@Component({
  selector: 'app-registrar-detalle-seguridad-control-jaba',
  templateUrl: './registrar-detalle-seguridad-control-jaba.component.html',
  styleUrls: ['./registrar-detalle-seguridad-control-jaba.component.scss']
})
export class RegistrarDetalleSeguridadControlJabaComponent implements OnInit {

  Orden_ServicioMascara = [/[0-9]/i, /[0-9]/i, /[0-9]/i, '-', /[0-9]/i, /[0-9]/i, /[0-9]/i, /[0-9]/i, /[0-9]/i,/[0-9]/i];
  listar_operacionColor:        Color[] = [];
  listar_operacionTalla:       Talla[] = [];

  public data_det = [{
    Cod_Registro_Sub_Det: 0,
    Cod_Registro_Det:     0,
    Cod_fabrica:          '',
    Cod_OrdPro:           '',
    Cod_Cliente:          '',
    Des_Cliente:          '',
    Cod_EstPro:           '',
    Des_EstPro:           '',
    Cod_Present:          '',
    Des_Present:          '',
    Cod_Talla:            '',
    Cant_Prendas:         0,
    Fec_Registro:         '' 
  }]


 // nuevas variables
 Cod_Accion           = ''
 Cod_Registro_Sub_Det = 0
 Cod_Registro_Det     = 0
 Cod_fabrica          = ''
 Cod_OrdPro           = ''
 Cod_Cliente          = ''
 Des_Cliente          = ''
 Cod_EstPro           = ''
 Des_EstPro           = ''
 Cod_Present          = ''
 Des_Present          = ''
 Cod_Talla            = ''
 Cant_Prendas         = 0
 Titulo               = ''
 Fec_Registro         = ''
 Flg_Borrar           = 0
 isDisableAll       = false

 /*@ViewChild('myinputAdd') inputAdd!: ElementRef;
 @ViewChild('myinputDel') inputDel!: ElementRef;*/

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    OP:       [''],
    Color:    [''],
    Talla:    [''],
    Cantidad: ['']
  })



  //displayedColumns_cab: string[] = ['Cod_Registro_Sub_Det', 'Cod_OrdPro', 'Des_Cliente','Cod_EstPro', 'Des_Estpro', 'Des_Present', 'Cod_Talla', 'Cant_Prendas', 'Acciones']
  displayedColumns_cab: string[] = ['Cod_OrdPro', 'Des_Cliente','Cod_EstPro', 'Des_Present', 'Cod_Talla', 'Cant_Prendas', 'Acciones']
  dataSource: MatTableDataSource<data_det>;



  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private seguridadControlJabaService: SeguridadControlJabaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource();
    
    this.formulario = formBuilder.group({
        OP:       ['', Validators.required],
        Color:    ['', Validators.required],
        Talla:    ['', Validators.required],
        Cantidad: [0, Validators.required],
       
          
      });
    
    }



  ngOnInit(): void { 
    
    if(GlobalVariable.Flg_Estado == 'S'){
      this.isDisableAll       =   true
      this.formulario.controls['OP'].disable()
    }
     

    this.Cod_Registro_Det   =  GlobalVariable.Cod_Registro_DetG 
    this.Titulo             =  GlobalVariable.Cod_Registro_DetG.toString()

    if(this.Cod_Registro_Det != 0){
      this.ListarSubDetalleJaba()}

  }

  ListarSubDetalleJaba() {
    this.SpinnerService.show();
    this.Cod_Accion             = 'L'
    this.Cod_Registro_Sub_Det   = 0
    this.Cod_Registro_Det   
    this.Cod_fabrica            = ''
    this.Cod_OrdPro             = ''
    this.Cod_Present            = ''
    this.Cod_Talla              = ''
    this.Cant_Prendas           = 0
    this.Fec_Registro           = ''

    this.seguridadControlJabaService.ListarSubDetalleJabaService(
      this.Cod_Accion,
      this.Cod_Registro_Sub_Det,
      this.Cod_Registro_Det,   
      this.Cod_fabrica,
      this.Cod_OrdPro, 
      this.Cod_Present,
      this.Cod_Talla,
      this.Cant_Prendas,
      this.Fec_Registro
    ).subscribe(
      (result: any) => { 
        if (result.length > 0) {
         // console.log(result)
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
 
  EliminarRegistroSubDetalle(Cod_Registro_Sub_Det: number){
    let dialogRef =  this.dialog.open(DialogEliminarComponent, { disableClose: true});
    dialogRef.afterClosed().subscribe(result =>{
    if(result == 'true'){

    this.Cod_Accion             = 'D'
    this.Cod_Registro_Sub_Det   = Cod_Registro_Sub_Det
    this.Cod_Registro_Det   
    this.Cod_fabrica            = ''
    this.Cod_OrdPro             = ''
    this.Cod_Present            = ''
    this.Cod_Talla              = ''
    this.Cant_Prendas           = 0
    this.Fec_Registro           = ''
    this.seguridadControlJabaService.ListarSubDetalleJabaService(
      this.Cod_Accion,
      this.Cod_Registro_Sub_Det,
      this.Cod_Registro_Det,   
      this.Cod_fabrica,
      this.Cod_OrdPro,
      this.Cod_Present,
      this.Cod_Talla,
      this.Cant_Prendas,
      this.Fec_Registro
    ).subscribe(
      (result: any) => { 
        if(result[0].Respuesta == 'OK'){
          this.ListarSubDetalleJaba()
          this.matSnackBar.open('Se proceso correctamente!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        }
        else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
    }

  })
}
  

  applyEnterAdd(event: any) {
    //this.InsertarRegistroSubDetalle()
  }

  applyEnterDel(event: any) {
    //this.EliminarRegistroDetalle()
  }


  CargarOperacionColor(){
    
    
    

    this.Cod_OrdPro             = this.formulario.get('OP')?.value
    if(this.Cod_OrdPro.length == 5){
      if(this.Cod_Registro_Det != 0){
      this.Cod_Accion             = 'C'
      this.Cod_Registro_Sub_Det   = 0
      this.Cod_Registro_Det   
      this.Cod_fabrica            = ''
      this.Cod_OrdPro             
      this.Cod_Present            = ''
      this.Cod_Talla              = ''
      this.Cant_Prendas           = 0
      this.Fec_Registro           = ''
      this.seguridadControlJabaService.ListarSubDetalleJabaService(
        this.Cod_Accion,
        this.Cod_Registro_Sub_Det,
        this.Cod_Registro_Det,   
        this.Cod_fabrica,
        this.Cod_OrdPro,
        this.Cod_Present,
        this.Cod_Talla,
        this.Cant_Prendas,
        this.Fec_Registro
      ).subscribe(
        (result: any) => { 
          if(result[0].Respuesta){
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
          }else{   
            this.listar_operacionColor = result
            GlobalVariable.Cod_OrdProG = this.Cod_OrdPro 
            GlobalVariable.Arr_ColorG = result 
            let dialogRef =  this.dialog.open(DialogColorRegistrarDetalleComponent, { disableClose: true,
              panelClass: 'my-class'});  
              dialogRef.afterClosed().subscribe(result => {
                  if (result == 'true') { 
                    let dialogRef =  this.dialog.open(DialogConfirmacionComponent, { disableClose: true});
                    dialogRef.afterClosed().subscribe(result => {
                      if (result == 'true') {
                          this.InsertarRegistroSubDetalle()
                          let dialogRef =  this.dialog.open(DialogAdicionalComponent, { disableClose: true});
                          dialogRef.afterClosed().subscribe(result => {
                          if (result == 'true') {
                              this.CargarOperacionColor()
                          }
                          else{
                              GlobalVariable.Cod_OrdProG    = ''
                              this.formulario.controls['OP'].setValue('')
                          }}) 
                      }})
                      /* let dialogRef =  this.dialog.open(DialogTallaRegistrarDetalleComponent, { disableClose: true});
                      dialogRef.afterClosed().subscribe(result => {
                        if (result == 'true') {    
                          let dialogRef =  this.dialog.open(DialogCantidadRegistrarDetalleComponent, { disableClose: true});
                          dialogRef.afterClosed().subscribe(result => {
                            if (result == 'true') {
                              console.log(GlobalVariable.Cod_OrdProG)
                              console.log(GlobalVariable.Cod_PresentG)
                              console.log(GlobalVariable.Cod_TallaG)
                              console.log(GlobalVariable.Cant_PrendasG)
                              let dialogRef =  this.dialog.open(DialogConfirmacionComponent, { disableClose: true});
                              dialogRef.afterClosed().subscribe(result => {
                                if (result == 'true') {
                                  this.InsertarRegistroSubDetalle()
                                  let dialogRef =  this.dialog.open(DialogAdicionalComponent, { disableClose: true});
                                  dialogRef.afterClosed().subscribe(result => {
                                    if (result == 'true') {
                                      this.CargarOperacionColor()
                                    }
                                    else{
                                      GlobalVariable.Cod_OrdProG    = ''
                                      this.formulario.controls['OP'].setValue('')
                                    }}) 
                                  }}) 

                                }})   
                      
                            }})*/
                    }else{
                        GlobalVariable.Cod_OrdProG    = ''
                        this.formulario.controls['OP'].setValue('')
                    }})
                }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 2500,
        }))
      }
      else{
        this.matSnackBar.open('No hay cabecera..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      }

    }
    
  }


  CargarOperacionTalla(){
    this.Cod_Accion             = 'T'
    this.Cod_Registro_Sub_Det   = 0
    this.Cod_Registro_Det   
    this.Cod_fabrica            = ''
    this.Cod_OrdPro             = this.formulario.get('OP')?.value
    this.Cod_Present            = this.formulario.get('Color')?.value
    this.Cod_Talla              = ''
    this.Cant_Prendas           = 0
    this.Fec_Registro           = ''

    this.seguridadControlJabaService.ListarSubDetalleJabaService(
      this.Cod_Accion,
      this.Cod_Registro_Sub_Det,
      this.Cod_Registro_Det,   
      this.Cod_fabrica,
      this.Cod_OrdPro,
      this.Cod_Present,
      this.Cod_Talla,
      this.Cant_Prendas,
      this.Fec_Registro
    ).subscribe(
      (result: any) => { 
        this.listar_operacionTalla = result
  
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }

 
submit(formDirective) :void {
  /*this.Cod_Accion             = 'I'
  this.Cod_Registro_Sub_Det   = 0
  this.Cod_Registro_Det   
  this.Cod_fabrica            = '001'
  this.Cod_OrdPro             = this.formulario.get('OP')?.value
  this.Cod_Present            = this.formulario.get('Color')?.value
  this.Cod_Talla              = this.formulario.get('Talla')?.value
  this.Cant_Prendas           = this.formulario.get('Cantidad')?.value
  this.Fec_Registro           = ''
  this.seguridadControlJabaService.ListarSubDetalleJabaService(
    this.Cod_Accion,
    this.Cod_Registro_Sub_Det,
    this.Cod_Registro_Det,   
    this.Cod_fabrica,
    this.Cod_OrdPro,
    this.Cod_Present,
    this.Cod_Talla,
    this.Cant_Prendas,
    this.Fec_Registro
  ).subscribe(
    (result: any) => { 
      if(result[0].Respuesta == 'OK'){
        this.ListarSubDetalleJaba()
        this.matSnackBar.open('Se proceso correctamente!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      }
      else{
        this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      }
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
      duration: 2500,
    }))*/
  
}


InsertarRegistroSubDetalle(){
  this.Cod_Accion             = 'I'
  this.Cod_Registro_Sub_Det   = 0
  this.Cod_Registro_Det   
  this.Cod_fabrica            = '001'
  this.Cod_OrdPro             = GlobalVariable.Cod_OrdProG
  this.Cod_Present            = GlobalVariable.Cod_PresentG
  this.Cod_Talla              = GlobalVariable.Cod_TallaG
  this.Cant_Prendas           = GlobalVariable.Cant_PrendasG
  this.Fec_Registro           = ''
  this.seguridadControlJabaService.ListarSubDetalleJabaService(
    this.Cod_Accion,
    this.Cod_Registro_Sub_Det,
    this.Cod_Registro_Det,   
    this.Cod_fabrica,
    this.Cod_OrdPro,
    this.Cod_Present,
    this.Cod_Talla,
    this.Cant_Prendas,
    this.Fec_Registro
  ).subscribe(
    (result: any) => { 
      if(result[0].Respuesta == 'OK'){
        this.ListarSubDetalleJaba()
        
        GlobalVariable.Cod_PresentG   = ''
        GlobalVariable.Cod_TallaG     = ''
        GlobalVariable.Cant_PrendasG  = 0
        this.matSnackBar.open('Se proceso correctamente!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      }
      else{
        this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
      }
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
      duration: 2500,
    }))
}


  InsertarRegistroDetalle(){
    /*this.Cod_Accion         = 'I'
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
        }
        else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.ReproducirError()
        }
    
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))*/
  }



  EliminarRegistroDetalle(){
    /*this.Cod_Accion         = 'D'
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
        }
        else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.ReproducirError()
        }
    
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))*/
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
    /*this.Observacion      = this.formulario.get('Observacion')?.value
 
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
        duration: 1500,
      }))*/

    
  }

}
