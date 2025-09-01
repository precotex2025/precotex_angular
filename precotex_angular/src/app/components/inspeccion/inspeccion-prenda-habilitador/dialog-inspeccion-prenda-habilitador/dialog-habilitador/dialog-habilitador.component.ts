import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { InspeccionPrendaService } from 'src/app/services/inspeccion-prenda.service'
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

interface data {
  Ticket: string
  Cod_Ordpro: string
  Des_Present: string
  Prendas_Recoger: number
  Cod_Talla: string
  ImagePath: string
}


@Component({
  selector: 'app-dialog-habilitador',
  templateUrl: './dialog-habilitador.component.html',
  styleUrls: ['./dialog-habilitador.component.scss']
})
export class DialogHabilitadorComponent implements OnInit {

  Id = 0
  Cod_Modulo = ""
  Cod_Familia = ""
  Ticket = ""
  Total = 0
  Cod_OrdPro = ""
  Cod_Present = 0
  Cod_Talla = ""
  Prendas_Paq = 0
  ImagePath = this.data.ImagePath

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    OP: [''],
    Color: [''],
    Talla: [''],
    Codigo: [''],
    Cantidad: ['']
  })


  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private inspeccionPrendaService: InspeccionPrendaService,
    private dialogRef: MatDialogRef<DialogHabilitadorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: data) {


  }

  ngOnInit(): void {
    this.formulario.controls['Codigo'].disable()
    this.formulario.controls['OP'].disable()
    this.formulario.controls['Color'].disable()
    this.formulario.controls['Talla'].disable()
    this.formulario.controls['Cantidad'].disable()

    this.formulario.controls['Codigo'].setValue(this.data.Ticket)
    this.formulario.controls['OP'].setValue(this.data.Cod_Ordpro)
    this.formulario.controls['Color'].setValue(this.data.Des_Present)
    this.formulario.controls['Talla'].setValue(this.data.Cod_Talla)
    this.formulario.controls['Cantidad'].setValue(this.data.Prendas_Recoger)

    //this.MostrarRecojoPrenda()
  }


  /* --------------- REGISTRAR CABECERA ------------------------------------------ */



  /*selectMedida(Abr_Motivo: string){
    
    this.dialogRef.close({data:Abr_Motivo});
  }*/

  MostrarRecojoPrenda() {

  }
  closeModal() {
    this.dialogRef.close(true);
  }
}
