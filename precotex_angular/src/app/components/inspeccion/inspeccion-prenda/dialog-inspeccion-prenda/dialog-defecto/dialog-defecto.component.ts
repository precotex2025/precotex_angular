import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { InspeccionPrendaService} from 'src/app/services/inspeccion-prenda.service'
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

interface data{
  Cod_Familia: string
  Id: number
  Total: number
}

interface data_det {
  Abr_Motivo: string;
  Descripcion: string;
  Cantidad: number;

}


@Component({
  selector: 'app-dialog-defecto',
  templateUrl: './dialog-defecto.component.html',
  styleUrls: ['./dialog-defecto.component.scss']
})
export class DialogDefectoComponent implements OnInit {

  Id = 0
  Cod_Familia = ""
  Total = 0
  
 displayedColumns_cab: string[] = ['Tallas', 'Cantidad']
 dataSource: MatTableDataSource<data_det>;

 constructor(public dialogRef: MatDialogRef<DialogDefectoComponent>,
          private formBuilder: FormBuilder,
             private matSnackBar: MatSnackBar, 
             private inspeccionPrendaService: InspeccionPrendaService,
             @Inject(MAT_DIALOG_DATA) public data: data) 
 {
    this.dataSource = new MatTableDataSource();
  
   
 }

 ngOnInit(): void {  
  this.Total = this.data.Total
  this.MostrarDefectoPorTipo()
 }


/* --------------- REGISTRAR CABECERA ------------------------------------------ */



selectMedida(Abr_Motivo: string){
  
  this.dialogRef.close({data:Abr_Motivo});
}

MostrarDefectoPorTipo(){  
    this.Id = this.data.Id
    this.Cod_Familia = this.data.Cod_Familia
    this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_DEFECTO_FAMILIA(
      this.Id,
      this.Cod_Familia
      ).subscribe(
        (result: any) => { 
         this.dataSource.data = result
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 5000,
        }))
    }
}
