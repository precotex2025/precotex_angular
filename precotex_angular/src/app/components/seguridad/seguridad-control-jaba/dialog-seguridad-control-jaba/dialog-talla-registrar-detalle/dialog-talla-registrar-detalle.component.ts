import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguridadControlJabaService } from 'src/app/services/seguridad-control-jaba.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';


interface data{
 
}



interface data_det {
  Cod_Talla: string;
}

@Component({
  selector: 'app-dialog-talla-registrar-detalle',
  templateUrl: './dialog-talla-registrar-detalle.component.html',
  styleUrls: ['./dialog-talla-registrar-detalle.component.scss']
})
export class DialogTallaRegistrarDetalleComponent implements OnInit {

 // nuevas variables

 Cod_Present = GlobalVariable.Cod_PresentG
 Des_Present = GlobalVariable.Des_present
 Cod_OrdPro  = GlobalVariable.Cod_OrdProG
  // nuevas variables
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

  displayedColumns_cab: string[] = ['Tallas']
  dataSource: MatTableDataSource<data_det>;

 formulario = this.formBuilder.group({
   
 }) 

 constructor(private formBuilder: FormBuilder,
             private matSnackBar: MatSnackBar, 
             private seguridadControlJabaService: SeguridadControlJabaService,
             @Inject(MAT_DIALOG_DATA) public data: data) 
 {
  this.dataSource = new MatTableDataSource();
   this.formulario = formBuilder.group({
   
   });

 }

 ngOnInit(): void { 
  console.log(this.Cod_Present)
  console.log(this.Des_Present)
  this.CargarOperacionTalla()
 
 }


 GuardarTalla(Cod_Talla: string){
  GlobalVariable.Cod_TallaG = Cod_Talla
 }


 CargarOperacionTalla(){
  this.Cod_Accion             = 'T'
  this.Cod_Registro_Sub_Det   = 0
  this.Cod_Registro_Det   
  this.Cod_fabrica            = ''
  this.Cod_OrdPro             
  this.Cod_Present            
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
      this.dataSource.data = result
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
      duration: 1500,
    }))
}


 

}
