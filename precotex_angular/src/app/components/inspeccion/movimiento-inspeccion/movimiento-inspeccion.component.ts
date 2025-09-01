import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MovimientoInspeccionService } from 'src/app/services/movimiento-inspeccion.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { startWith, map, debounceTime } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';
import {SelectionModel} from '@angular/cdk/collections';
import { NgxSpinnerService }  from "ngx-spinner";
interface Color {
  Codigo:       string;
  Descripcion:  string;
}

@Component({
  selector: 'app-movimiento-inspeccion',
  templateUrl: './movimiento-inspeccion.component.html',
  styleUrls: ['./movimiento-inspeccion.component.scss']
})
export class MovimientoInspeccionComponent implements OnInit {

  listar_operacionColor: Color[] = [];

  displayedColumns: string[] = ['Sel', 'Codigo', 'Color','Stock'];
  dataSource = new MatTableDataSource<Color>(this.listar_operacionColor);
  selection = new SelectionModel<Color>(true, []);

  Op             = ''
  Color          = []
  Cod_Accion     = ''
  ColorConcat    = ''
  Flg_Btn_Buscar = false

  formulario = this.formBuilder.group({
    op:         [''],
    color:      ['']
  }) 

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,private SpinnerService: NgxSpinnerService, private movimientoInspeccionService: MovimientoInspeccionService
  
  ) {

    this.formulario = formBuilder.group({
      op:          ['', Validators.required]
    });
  }
 

  ngOnInit(): void {
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Color): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Codigo + 1}`;
  }


  llenarColorPorOp(){
    this.listar_operacionColor = []
    this.ColorConcat = ''
    this.Cod_Accion = 'F'
    this.Op         = this.formulario.get('op')?.value
    this.movimientoInspeccionService.llenarColorPorOp(this.Cod_Accion,this.Op).subscribe(
      (result: any) => {
        console.log(result[0].Respuesta)
        if (result[0].Respuesta == undefined) {
        this.dataSource.data = result
        }else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  ValidarActivarBuscar(){
    if(this.formulario.get('op')?.value.length == 5){
      this.Flg_Btn_Buscar = true
    }
    else{
      this.reset()

    }
  }





  submit(formDirective) :void {
    this.SpinnerService.show();
    this.ColorConcat = ''
    this.Op     = this.formulario.get('op')?.value
    this.Color  = this.selection.selected
    this.Color.forEach((currentValue, index) => {
    this.ColorConcat += this.Color[index].Codigo + '-'
    });

    this.movimientoInspeccionService.generaMovimientoIngresoOpColor(this.Op, this.ColorConcat).subscribe(
      (result: any) => {
        if (result[0].Respuesta  == 'OK') {
          this.matSnackBar.open('El movimiento se genero correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.reset()
          this.SpinnerService.hide();
        }
        else{
          this.SpinnerService.hide();
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
    


  }

 
  reset(){
      this.Flg_Btn_Buscar = false
      this.ColorConcat = ''
      this.dataSource.data = []
      this.Color = []
      this.selection = new SelectionModel<Color>(true, []);
    
  }

}
