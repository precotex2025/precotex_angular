import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GlobalVariable } from 'src/app/VarGlobals';
import { ActivatedRoute, Router } from '@angular/router';

import { data } from 'jquery';
import { MantMaestroBolsaItemDetService } from 'src/app/services/bolsa/mant-maestro-bolsa-item-det.service';

interface data_det{
  Cod_Barra: string,
  Id_Bolsa: number,
  Id_Bolsa_Det: number,
  Id_Barra: number,
  Cod_OrdPro: string,
  Cod_Present: string,
  Cod_Talla: string,
  Num_SecOrd: number,
  Cod_Item: string,
  Cantidad: number
}

@Component({
  selector: 'app-dialog-maestro-bolsa-ite-det-modificar',
  templateUrl: './dialog-maestro-bolsa-ite-det-modificar.component.html',
  styleUrls: ['./dialog-maestro-bolsa-ite-det-modificar.component.scss']
})
export class DialogMaestroBolsaIteDetModificarComponent implements OnInit {

  Cod_Usuario = GlobalVariable.vusu;
  Id_Bolsa = 0;
  Id_Bolsa_Det = 0; 
  Id_Barra = 0;
  Cod_Barra = '';
  Cod_Present = 0;
  

  displayedColumns: string[] = [
    'Cod_OrdPro',
    'Des_Present',
    'Cod_Talla',
    'Num_SecOrd',
    'Cod_Item',
    'Cantidad',
  ];

  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();

  constructor(
    private matSnackBar: MatSnackBar,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private bolsaitemdetService: MantMaestroBolsaItemDetService,
    private dialog: MatDialogRef<DialogMaestroBolsaIteDetModificarComponent>,
    @Inject(MAT_DIALOG_DATA) public data_det: data_det
  ) { this.dataSource = new MatTableDataSource(); }

  ngOnInit(): void {
    this.Id_Bolsa = this.data_det.Id_Bolsa,
    this.Id_Bolsa_Det = this.data_det.Id_Bolsa_Det,
    this.Id_Barra = this.data_det.Id_Barra,
    this.Cod_Present = parseInt(this.data_det.Cod_Present),
    console.log(this.data_det);
    this.obtenerCantidad();
  }

  obtenerCantidad() {
    this.dataSource.data = [];
    this.SpinnerService.show();
    this.bolsaitemdetService.obtenerDatos_D(
      'V',
      this.Id_Bolsa,
      this.Id_Bolsa_Det,
      this.Id_Barra,
      '',
      this.Cod_Present,
      '',
      '',
      0,
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
          //console.log(this.dataSource.data);
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

  capturarCant(data_det) {
    this.data_det.Cantidad = data_det.target.value
    console.log("Cantidad nueva: ",this.data_det.Cantidad)
  }

  guardarCantidad() {
    //this.dataSource.data = [];
    console.log(this.data_det)
    console.log(this.dataSource.data)
    
    console.log(
      'Accion: ','U',
      'Id_Bolsa: ',this.Id_Bolsa,
      'Id_Bolsa_Det: ',this.Id_Bolsa_Det,
      'Id_Barra: ',this.Id_Barra,
      'Cod_OrdPro',this.data_det.Cod_OrdPro,
      'Cod_Present:',this.Cod_Present,
      'Cod_Talla: ', this.data_det.Cod_Talla,
      'Num_SecOrd: ',
      'Cantidad: ',this.data_det.Cantidad,
    )

    this.SpinnerService.show();
    this.bolsaitemdetService.obtenerDatos_D(
      'U',
      this.Id_Bolsa,
      this.Id_Bolsa_Det,
      this.Id_Barra,
      this.data_det.Cod_OrdPro,
      this.Cod_Present,
      this.data_det.Cod_Talla,
      '',
      this.data_det.Cantidad,
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        console.log('----------------------------------------------------')
        console.log(result)
        console.log('----------------------------------------------------')
        if (result.length > 0 && result[0].Respuesta == 'OK') {
          this.dataSource.data = result;
          this.dialog.close();
          this.matSnackBar.open('Cantidad guardada!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          //console.log(this.dataSource.data);
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
  }

}
