import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment'; 
import { Observable } from 'rxjs';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals'; 
interface data_det {
  Num_movstk:     string
  Orden_Servicio: string
  Peso:           number
  Bultos:         number 		

}
 
@Component({
  selector: 'app-ingreso-rollo-tejido-detalle',
  templateUrl: './ingreso-rollo-tejido-detalle.component.html',
  styleUrls: ['./ingreso-rollo-tejido-detalle.component.scss']
})
export class IngresoRolloTejidoDetalleComponent implements OnInit {

  Orden_ServicioMascara = [/[0-9]/i, /[0-9]/i, /[0-9]/i, '-', /[0-9]/i, /[0-9]/i, /[0-9]/i, /[0-9]/i, /[0-9]/i,/[0-9]/i];

  
  public data_det = [{
    secuencia:     '',
    tela:          '',
    peso:          '',
    bultos:        '' 	
  }]


 // nuevas variables
 num_movstk = GlobalVariable.Num_movstk
 Orden_Servicio = GlobalVariable.Orden_servicio
 secuencia        = ''
 tela             = '' 	
 peso             = ''
 bultos           = '' 	
 Cod_Accion       = ''
 Codigo_Barras    = ''

 @ViewChild('myinputAdd') inputAdd!: ElementRef;
 @ViewChild('myinputDel') inputDel!: ElementRef;


  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Orden_Servicio:   [''],
    bulto_añadir:     [''],
    bulto_eliminar:   ['']
  })


  displayedColumns_cab: string[] = ['Secuencia', 'Tela', 'Peso', 'Bultos']
  dataSource: MatTableDataSource<data_det>;
 


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private ingresoRolloTejidoService: IngresoRolloTejidoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }



  ngOnInit(): void { 
    if(this.num_movstk != ''){
      this.ListarDetalleRolloTejido()
    }
    
  }


  applyEnterPartida(event: any) {
    
    this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
  }

  applyEnterAdd(event: any) {
    this.AnadirBulto()
  }

  applyEnterDel(event: any) {
    this.EliminarBulto()
  }



  AnadirBulto() {

    this.Cod_Accion = 'I';
    //this.Orden_Servicio = this.formulario.get('Orden_Servicio')?.value
    this.Codigo_Barras = this.formulario.get('bulto_añadir')?.value

   /* if (this.Orden_Servicio.length < 5) {
      this.ReproducirError();
      this.matSnackBar.open("Partida Longitud Incorrecta", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else*/
     if (this.Codigo_Barras.length >= 5) {

      if (this.num_movstk.length == 0) {
        //creamos el movimiento
        this.GenerarMovimiento();
      }

      else if (this.num_movstk.length > 4) {
        //insertamos el detalle
        this.LecturarBulto(this.Cod_Accion);
      }

    }
    else if (this.Codigo_Barras.length > 2) {
      this.ReproducirError();
      this.matSnackBar.open("Rollo Longitud Incorrecta", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    this.inputAdd.nativeElement.focus() // hace focus sobre "myInput"
  }




  GenerarMovimiento() {
    this.num_movstk = '';

    this.ingresoRolloTejidoService.GenerarMovimientoRolloTejidoService(this.Codigo_Barras).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.num_movstk = result[0].Num_Movstk

          this.LecturarBulto(this.Cod_Accion);
        }
        else {
          this.formulario.patchValue({ bulto_añadir: '' });
          this.ReproducirError();
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.ReproducirError();
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
        })
      })
  } 

  LecturarBulto(Accion: string) {
    this.ingresoRolloTejidoService.LecturarBultoRolloTejidoService(Accion, 'T7', this.num_movstk, this.Codigo_Barras).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.ReproducirOk;
          this.formulario.patchValue({ bulto_añadir: '' });
          this.formulario.patchValue({ bulto_eliminar: '' });
          this.ListarDetalleRolloTejido();
        }
        else {
          
          this.ReproducirError();
          this.formulario.patchValue({ bulto_añadir: '' });
           this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.ReproducirError();
        this.matSnackBar.open(err.message, 'Cerrar', {
          horizontalPosition: 'center', verticalPosition: 'top', duration: 1500
          
        })
      })
  }



  ReproducirError() {
    const audio = new Audio('assets/error.mp3');
    audio.play();
  }
 
  ReproducirOk() {
    const audio = new Audio('assets/aceptado.mp3');
    audio.play();
  } 

  EliminarBulto() {
    this.Cod_Accion = 'D';
    this.Codigo_Barras = this.formulario.get('bulto_eliminar')?.value

    if (this.Codigo_Barras.length >= 5) {

      if (this.num_movstk.length == 0) {
        this.ReproducirError();
        this.matSnackBar.open("Movimiento vacio", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }

      if (this.num_movstk.length > 4) {
        //insertamos el detalle
        this.LecturarBulto(this.Cod_Accion);
      }

    }
    else if (this.Codigo_Barras.length > 2) {
      this.ReproducirError();
      this.matSnackBar.open("Rollo Longitud Incorrecta", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    this.inputDel.nativeElement.focus() // hace focus sobre "myInput"

  }

 
  ListarDetalleRolloTejido() {
  
    this.SpinnerService.show();
    console.log(this.num_movstk)
   
    this.ingresoRolloTejidoService.ListarDetalleRolloTejidoService(
      this.num_movstk
    ).subscribe(
      (result: any) => { 
        if (result.length > 0) {
          console.log(result)
          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }




}

