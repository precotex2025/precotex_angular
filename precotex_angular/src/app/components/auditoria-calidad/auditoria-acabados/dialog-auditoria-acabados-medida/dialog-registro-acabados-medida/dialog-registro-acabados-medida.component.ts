import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../../../VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { AuditoriaHojaMedidaService} from 'src/app/services/auditoria-hoja-medida.service'
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

interface data{
  Cod_Talla:  string
  Des_Medida:  string
  Sec: number
  Tip_Medida: string
  Sec_Medida: string
  Cod_Hoja_Medida_Cab: number
  Flg_Enable: boolean
}

interface data_det {
  Cod_Medida: number;
  Des_Medida: string;

}

@Component({
  selector: 'app-dialog-registro-acabados-medida',
  templateUrl: './dialog-registro-acabados-medida.component.html',
  styleUrls: ['./dialog-registro-acabados-medida.component.scss']
})
export class DialogRegistroAcabadosMedidaComponent implements OnInit {
  Titulo        = ''
  Cod_Talla     = ''
  Des_Medida    = ''
  Cod_Accion    = ''
  Cod_Hoja_Medida_Det = 0
  Cod_Hoja_Medida_Cab = 0
  Sec = 0
  Tip_Medida    = ''
  Sec_Medida    = ''
  Medida1       = ''
  Medida2       = ''
  Medida3       = ''
  Medida4       = ''
  Medida5       = ''

  Menos = ''
 displayedColumns_cab: string[] = ['Tallas']
 dataSource: MatTableDataSource<data_det>;

 constructor(public dialogRef: MatDialogRef<DialogRegistroAcabadosMedidaComponent>,
          private formBuilder: FormBuilder,
             private matSnackBar: MatSnackBar, 
             private auditoriaHojaMedidaService: AuditoriaHojaMedidaService,
             @Inject(MAT_DIALOG_DATA) public data: data) 
 {
    this.dataSource = new MatTableDataSource();
  
   
 }

 ngOnInit(): void {  
  //this.CargarOperacionMedida()
  this.dataSource.data = GlobalVariable.Arr_Medidas
  this.Cod_Talla            = this.data.Cod_Talla
  this.Des_Medida           = this.data.Des_Medida
  this.Sec                  = this.data.Sec
  this.Tip_Medida           = this.data.Tip_Medida
  this.Sec_Medida           = this.data.Sec_Medida
  this.Cod_Hoja_Medida_Cab  = this.data.Cod_Hoja_Medida_Cab

 }


/* --------------- REGISTRAR CABECERA ------------------------------------------ */


doAction(){
  this.dialogRef.close({data:'XS'});
}



selectMedida(medida: string){
  if(medida == 'Eliminar'){
    medida = ''
  }
  if(medida == '-'){
    this.Menos = medida
  }else{
    if(this.Menos == '-'){
      medida = medida.replace('+','-')
    }

  //console.log(this.Cod_Talla.substring(0, this.Cod_Talla.length - 1))
  let ColumnHeader = this.Cod_Talla.substring(0, this.Cod_Talla.length - 1)
  let ultimoCaracter = this.Cod_Talla.charAt(this.Cod_Talla.length-1)
  let ColumnHeaderSave = this.Cod_Talla.replace(this.Cod_Talla,'Medida')+ultimoCaracter
  console.log(ColumnHeader)
  console.log(ColumnHeaderSave)
  console.log(this.Des_Medida)
  console.log(this.Sec)
  console.log(this.Tip_Medida)
  console.log(this.Sec_Medida)
  console.log(this.Cod_Hoja_Medida_Cab)
  
  
if(ColumnHeader != ''){
  this.Cod_Accion   = 'I'
      this.Cod_Hoja_Medida_Det
      this.Cod_Hoja_Medida_Cab = this.data.Cod_Hoja_Medida_Cab
      this.Sec = this.data.Sec
      this.Tip_Medida = this.data.Tip_Medida
      this.Sec_Medida = this.data.Sec_Medida
      this.Cod_Talla = ColumnHeader
     this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaAcabadosDetalle(
      this.Cod_Accion,
      this.Cod_Hoja_Medida_Det,
      this.Cod_Hoja_Medida_Cab,
      this.Sec,
      this.Tip_Medida,
      this.Sec_Medida,
      this.Cod_Talla,
      ColumnHeaderSave,
      medida
      ).subscribe(
        (result: any) => { 
          this.matSnackBar.open("Proceso Correcto..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    }
    else{
      this.matSnackBar.open("Talla vacia..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }






  this.dialogRef.close({data:medida});
  this.Menos = ''
}
}

    CargarOperacionMedida(){  
      this.Cod_Accion   = 'M'
      this.Cod_Hoja_Medida_Det
      this.Cod_Hoja_Medida_Cab = this.data.Cod_Hoja_Medida_Cab
      this.Sec = this.data.Sec
      this.Tip_Medida = ''
      this.Sec_Medida = ''
      this.Cod_Talla = ''
      this.Medida1 = ''
      this.Medida2 = ''
     this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaDetalle(
      this.Cod_Accion,
      this.Cod_Hoja_Medida_Det,
      this.Cod_Hoja_Medida_Cab,
      this.Sec,
      this.Tip_Medida,
      this.Sec_Medida,
      this.Cod_Talla,
      this.Medida1,
      this.Medida2
      ).subscribe(
        (result: any) => { 
          this.dataSource.data = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    }
}
