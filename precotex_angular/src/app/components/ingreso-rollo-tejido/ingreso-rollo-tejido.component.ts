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
import { GlobalVariable } from '../../VarGlobals'; //<==== this one
import { ActivatedRoute, Router } from '@angular/router';

interface data_det {
  Num_movstk:     string
  Orden_Servicio: string
  Peso:           number
  Bultos:         number 		
}

interface dataAlmacen {
  Codigo : string,
  Descripcion: string
}

@Component({
  selector: 'app-ingreso-rollo-tejido',
  templateUrl: './ingreso-rollo-tejido.component.html',
  styleUrls: ['./ingreso-rollo-tejido.component.scss']
})
export class IngresoRolloTejidoComponent implements OnInit {
  lstAlmacen: dataAlmacen[] = [];
  Orden_ServicioMascara = [/[0-9]/i, /[0-9]/i, /[0-9]/i, '-', /[0-9]/i, /[0-9]/i, /[0-9]/i, /[0-9]/i, /[0-9]/i,/[0-9]/i];
  
  
  public data_det = [{
    num_movstk:     '',
    Orden_Servicio: '',
    peso:           '',
    bultos:         '' 	
  }]


 // nuevas variables
 num_movstk       = ''
 Orden_Servicio   = ''
 peso             = ''
 bultos           = '' 	


  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Fec_Despacho:   [''],
    Orden_Servicio: [''],
    ctrol_almacen : [''],
  })


  displayedColumns_cab: string[] = ['Movimiento', 'Orden', 'Peso', 'Bultos', 'Acciones']
  dataSource: MatTableDataSource<data_det>;



  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private ingresoRolloTejidoService: IngresoRolloTejidoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private router              : Router                ,) { this.dataSource = new MatTableDataSource(); }



  ngOnInit(): void { 
    GlobalVariable.Num_movstk = '';
    this.CargaAlmacen();
    this.ListarRolloTejido()
  }


 
  clearDate(event) {
    event.stopPropagation();
    this.formulario.controls['Fec_Despacho'].setValue('')
  }

  ListarRolloTejido() {
    

    this.SpinnerService.show();
    console.log(this.formulario.get('Fec_Despacho')?.value)
    console.log(this.formulario.get('Orden_Servicio')?.value)

    this.ingresoRolloTejidoService.ListarRolloTejidoService(
      this.formulario.get('Fec_Despacho')?.value,
      this.formulario.get('Orden_Servicio')?.value
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


  AgregarRolloTejido(){
    GlobalVariable.Orden_servicio = ''
    GlobalVariable.Num_movstk = ''

    const _codAlmacen = this.formulario.get('ctrol_almacen')?.value ?? '';
    if (!_codAlmacen || _codAlmacen.trim() === ''){
      this.matSnackBar.open("¡Seleccione almacen...!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }        

    this.router.navigate(['/IngresoRolloTejidoDetalle', _codAlmacen]);
  }


  VerDetalleRolloTejido(Orden_Servicio: string, num_movstk: string) {
    GlobalVariable.Orden_servicio = Orden_Servicio
    GlobalVariable.Num_movstk = num_movstk

    const _codAlmacen = this.formulario.get('ctrol_almacen')?.value ?? '';
    if (!_codAlmacen || _codAlmacen.trim() === ''){
      this.matSnackBar.open("¡Seleccione almacen...!", 'Cerrar', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 1500,
      });
      return;
    }        

    this.router.navigate(['/IngresoRolloTejidoDetalle', _codAlmacen]);    
  }

  CargaAlmacen() {

    this.ingresoRolloTejidoService.ListarAlmacenesService().subscribe(
        (result: any) => {
          this.lstAlmacen = result;
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))    

  }  

}

