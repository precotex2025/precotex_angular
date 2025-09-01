import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from '../../../../../VarGlobals';
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
  selector: 'app-dialog-defecto-audi',
  templateUrl: './dialog-defecto-audi.component.html',
  styleUrls: ['./dialog-defecto-audi.component.scss']
})
export class DialogDefectoAudiComponent implements OnInit {
  Id = 0
  Cod_Familia = ""
  Total = 0
  
 displayedColumns_cab: string[] = ['Tallas', 'Cantidad']
 dataSource: MatTableDataSource<data_det>;

 constructor(public dialogRef: MatDialogRef<DialogDefectoAudiComponent>,
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

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

MostrarDefectoPorTipo(){  
    this.Id = this.data.Id
    this.Cod_Familia = this.data.Cod_Familia
    this.inspeccionPrendaService.CF_MUESTRA_INSPECCION_DEFECTO_FAMILIA_AUDI_JP(
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

