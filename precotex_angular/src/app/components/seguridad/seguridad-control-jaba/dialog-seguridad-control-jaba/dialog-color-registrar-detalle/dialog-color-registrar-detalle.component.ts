import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlJabaService } from 'src/app/services/seguridad-control-jaba.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import { DialogConfirmacionComponent} from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component'
import { DialogAdicionalComponent} from 'src/app/components/dialogs/dialog-adicional/dialog-adicional.component'

interface data{
  
}


interface data_det {
  Cod_Present: string,
  Des_Present: string

}

interface data_det2 {
  Cod_Talla: string;
}




@Component({
  selector: 'app-dialog-color-registrar-detalle',
  templateUrl: './dialog-color-registrar-detalle.component.html',
  styleUrls: ['./dialog-color-registrar-detalle.component.scss']
})
export class DialogColorRegistrarDetalleComponent implements OnInit {



 public data_det = [{
  Cod_Present: '',
  Des_Present: ''
}]

Cod_Present =''
Des_Present = ''
Cod_OrdPro  = GlobalVariable.Cod_OrdProG

// nuevas variables
 Arr_Color  = GlobalVariable.Arr_ColorG
 tabIsActiveColor     = true
 tabIsActiveTalla     = false
 tabIsActiveCantidad  = false

// tallas

Cod_Accion           = ''
Cod_Registro_Sub_Det = 0
Cod_Registro_Det     = 0
Cod_fabrica          = ''

Cod_Cliente          = ''
Des_Cliente          = ''
Cod_EstPro           = ''
Des_EstPro           = ''
Cod_Talla            = ''
Cant_Prendas         = 0
Fec_Registro         = ''


//cantidad

Cantidad = 0



 formulario = this.formBuilder.group({
  Cantidad:  ['']
 }) 


 displayedColumns_cab: string[] = ['Colores']
 dataSource: MatTableDataSource<data_det>;

 displayedColumns_cab2: string[] = ['Tallas']
 dataSource2: MatTableDataSource<data_det2>;


 constructor(private formBuilder: FormBuilder,
             private matSnackBar: MatSnackBar, 
             private seguridadControlJabaService: SeguridadControlJabaService,
             public dialog: MatDialog,
             @Inject(MAT_DIALOG_DATA) public data: data) 
 {  this.dataSource = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();

    this.formulario = formBuilder.group({
      Cantidad:  ['', Validators.required],
    });

 }

 ngOnInit(): void { 
  this.dataSource.data = this.Arr_Color
 }
 

 GuardarColor(Cod_Present: string, Des_Present: string, tabgroup: MatTabGroup, number: number){
  GlobalVariable.Cod_PresentG = Cod_Present
  GlobalVariable.Des_present = Des_Present
  tabgroup.selectedIndex = number;
  this.CargarOperacionTalla()
  this.tabIsActiveColor = false
  this.tabIsActiveTalla = true
 }


 GuardarTalla(Cod_Talla: string, tabgroup: MatTabGroup, number: number){
  GlobalVariable.Cod_TallaG = Cod_Talla
  tabgroup.selectedIndex = number;
 }


 CargarOperacionTalla(){
  this.Cod_Accion             = 'T'
  this.Cod_Registro_Sub_Det   = 0
  this.Cod_Registro_Det   
  this.Cod_fabrica            = ''
  this.Cod_OrdPro             
  this.Cod_Present            = GlobalVariable.Cod_PresentG
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
      console.log(result) 
      this.dataSource2.data = result
      this.tabIsActiveColor     = false
      this.tabIsActiveTalla     = false
      this.tabIsActiveCantidad  = true
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
      duration: 1500,
    }))
}

 changeIndex(tabgroup: MatTabGroup, number: number){
  tabgroup.selectedIndex = number;
}

submit(formDirective) :void {

  this.Cantidad = this.formulario.get('Cantidad')?.value
  GlobalVariable.Cant_PrendasG = this.Cantidad 
  
  console.log(GlobalVariable.Cod_OrdProG)
  console.log(GlobalVariable.Cod_PresentG)
  console.log(GlobalVariable.Cod_TallaG)
  console.log(GlobalVariable.Cant_PrendasG)
 }


 

}
