import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { GlobalVariable } from '../../../../VarGlobals'; //<==== this one
import { FormBuilder, FormControl, Validators, FormControlName, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { NgxSpinnerService } from 'ngx-spinner';

import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { DialogMaestroBolsaTransService } from 'src/app/services/bolsa/dialog-maestro-bolsa-trans.service';
import { Console } from 'console';

interface data_det {
  Id: number,
  Cod_OrdPro: string,
  Cod_Present: number,
  Des_Present: string,
  Cod_Talla: string
}

interface data {
  Id_Bolsa: number
  Id_Bolsa_Det: number
  Cod_Barra: string
  Cod_Barra_Destino: string
  Cantidad: number
}

@Component({
  selector: 'app-dialog-maestro-bolsa-trans',
  templateUrl: './dialog-maestro-bolsa-trans.component.html',
  styleUrls: ['./dialog-maestro-bolsa-trans.component.scss']
})
export class DialogMaestroBolsaTransComponent implements OnInit {

  Cod_Usuario = GlobalVariable.vusu;
  listar_cabeceras = [];
  Id_Bolsa: number = 0;
  Id_Bolsa_Det: number = 0;
  Id_Barra: number = 0;
  Cod_Barra: string = "";
  Cod_Barra_Destino: string = '';
  RsptaOpColor: string = '';

  sum: number = 0;
  array: Array<any> = [];
  total: number = 0;
  dataSource: MatTableDataSource<data_det>;

  displayedColumns: string[] = ['Cod_OrdPro', 'Des_Present', 'Cod_Talla', 'Cantidad'];
  columnsToDisplay: string[] = this.displayedColumns.slice();

  constructor(
    private dialog: MatDialogRef<DialogMaestroBolsaTransComponent>,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private bolsaTransferService: DialogMaestroBolsaTransService,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data
  ) { this.dataSource = new MatTableDataSource(); }

  formulario = this.formBuilder.group({ Cod_BarraOri: ['', Validators.required], Cod_BarraDes: ['', Validators.required] });

  ngOnInit(): void {
    this.Id_Bolsa = this.data.Id_Bolsa
    this.Id_Bolsa_Det = this.data.Id_Bolsa_Det
    this.Cod_Barra = this.data.Cod_Barra
    this.obtenerDatos();
    this.formulario.patchValue({
      Cod_BarraOri: this.data.Cod_Barra
    })
    this.sumaTotales();
  }

  obtenerDatos() {
    this.dataSource.data = [];
    this.SpinnerService.show();
    this.bolsaTransferService.obtenerDatos_Trans(
      'V',
      this.Id_Bolsa,
      this.Id_Bolsa_Det,
      this.Id_Barra,
      '',
      0
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        this.array = result;
        if (this.array.length > 0) {
          this.dataSource.data = this.array;
          console.log(this.dataSource.data);
          this.sumaTotales();
        } else {
          this.matSnackBar.open('No se encontraron registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

  sumaTotales() {
    this.sum = 0;
    console.log("suma", this.dataSource.data);
    this.array.forEach((array) => {
      this.sum = this.sum + parseInt(array.Cantidad);
    })
    console.log("El total: ",this.sum);
  }

  sumaTotales2(data, data_det) {
    this.sum = 0;
    this.array.forEach((array) => {
      if(array.Id_Bolsa == data_det.Id_Bolsa && array.Id_Bolsa_Det == data_det.Id_Bolsa_Det && array.Id_Barra == data_det.Id_Barra)
      {
        array.Cantidad = data.target.value
      }
    })
    console.log("El total es: ",this.sum);
    this.sumaTotales();
  }

  grabarTallas() {
    //if (this.formulario.valid) {
    let datos = {
      Cod_BarraDes: this.formulario.get("Cod_BarraDes").value,
      array: this.array,
      Cod_Usuario: GlobalVariable.vusu
    }
    console.log(datos);
    //this.array = this.dataSource.data;
    //console.log(this.array);
    this.SpinnerService.show();
    this.bolsaTransferService.grabarDatos_Trans(
      datos
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        console.log(result);
        if(result['msg'] == 'OK'){
          this.matSnackBar.open('Información Salvada', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.dialog.close(1);
        }else{
          this.matSnackBar.open('Ha ocurrido un error al registrar las prendas.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
        
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
    /*}else{
      this.matSnackBar.open('Debe ingresar los campos obligatorios.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }*/
  }

  validarJabaConOpColor(){
    if (this.formulario.valid) {
      //console.log(this.Id_Bolsa,this.Id_Bolsa_Det, this.formulario.get("Cod_BarraDes").value)
      
      this.SpinnerService.show();
      this.bolsaTransferService.obtenerDatos_Trans(
        'C',
        this.Id_Bolsa,
        this.Id_Bolsa_Det,
        this.Id_Barra,
        this.formulario.get("Cod_BarraDes").value,
        0
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          this.RsptaOpColor = result[0].Respuesta
          //console.log(result[0].Respuesta)
          if (this.RsptaOpColor == 'OK') {
            this.grabarTallas()
          } else {
            this.matSnackBar.open(this.RsptaOpColor, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            //this.dialog.close(1);
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          })
        })

      }else{
        this.matSnackBar.open('Debe ingresar los campos obligatorios.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      }
  }

}
