import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { SeguridadControlGuiaService } from 'src/app/services/seguridad-control-guia.service';
import { DialogDetallePackComponent } from './dialog-detalle-pack/dialog-detalle-pack.component';

@Component({
  selector: 'app-historial-pack-jaba',
  templateUrl: './historial-pack-jaba.component.html',
  styleUrls: ['./historial-pack-jaba.component.scss']
})
export class HistorialPackJabaComponent implements OnInit {

  displayedColumns: string[] = [
    'Fecha_Registro',
    'Cod_Packing_Jaba',
    'Cod_Usuario',
    'Num_Planta',
    'Num_Planta_Destino',
    'Cod_Usuario_Ingreso',
    'Flg_Estado',
    'Detalle'
  ];

  dataJaba: Array<any> = [];
  Num_Jaba: string = '';
  Estado: string = '';
  Ubicacion: string = '';
  des_planta: string = '';

  dataSource: MatTableDataSource<any>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  constructor(private seguridadControlGuiaService: SeguridadControlGuiaService, private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private spinnerService: NgxSpinnerService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    if (GlobalVariable.num_planta == 1) {
      this.des_planta = 'SANTA MARIA'
    } else if (GlobalVariable.num_planta == 2) {
      this.des_planta = 'SANTA CECILIA'
    } else if (GlobalVariable.num_planta == 3) {
      this.des_planta = 'HUACHIPA SEDE I'
    } else if (GlobalVariable.num_planta == 4) {
      this.des_planta = 'HUACHIPA SEDE II'
    } else if (GlobalVariable.num_planta == 5) {
      this.des_planta = 'INDEPENDENCIA'
    } else if (GlobalVariable.num_planta == 14) {
      this.des_planta = 'INDEPENDENCIA II'
    } else if (GlobalVariable.num_planta == 13) {
      this.des_planta = 'SANTA ROSA'
    } else if (GlobalVariable.num_planta == 15) {
      this.des_planta = 'FARADAY'
    } else if (GlobalVariable.num_planta == 17) {
      this.des_planta = 'HUACHIPA SEDE III'
    } else {
      this.des_planta = ''
    }

    this.changeJaba();
  }


  detalleJaba(Cod_Packing_Jaba){
    let dialogRef = this.dialog.open(DialogDetallePackComponent, {
      data: {
        Cod_Packing_Jaba: Cod_Packing_Jaba
      },
      maxHeight: '90vh' 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        
      }
    })
  }

  changeJaba() {
    this.seguridadControlGuiaService.Lg_Man_Packing_Jaba_Web('R', 0, GlobalVariable.vusu, GlobalVariable.num_planta, GlobalVariable.num_planta, GlobalVariable.vusu, this.Num_Jaba, '').subscribe(
      (result: any) => {
        if (result.length > 0) {
          this.dataJaba = result;
          this.dataSource.data = this.dataJaba;
        } else {
          this.dataJaba = [];
          this.dataSource.data = this.dataJaba;
          this.matSnackBar.open('No se encontraron registros', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  changeFecha() {

  }

  limpiarValor() {
    this.Num_Jaba = '';
  }

  Guardar() {
    //console.log(this.dataJaba);
    this.seguridadControlGuiaService.Lg_Man_Packing_Jaba_Web_Post(
      this.dataJaba
    ).subscribe(
      (result: any) => {
        if (result.msg == 'OK') {
          this.dataJaba = [];
          this.dataSource.data = this.dataJaba;
          this.Num_Jaba = '';
          this.matSnackBar.open('Se registro correctamente el estado de la Jaba', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
        else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  changeRadio(Id, valor) {
    this.dataJaba.forEach(element => {
      if (element.Codigo_Barra == Id) {
        element.OK = '';
        element.RL = '';
        element['2RL'] = '';
        element['RT'] = '';
        element['2RT'] = '';
        element.G = '';
        element.OUT = '';
        element.RO = '';

        element[valor] = valor;
      }
    });
  }

  registrarSeguridad() {
    this.spinnerService.show();
    this.seguridadControlGuiaService.Lg_Packing_Select_Jaba('I', this.dataJaba[0].Codigo_Barra, '', this.Estado, this.des_planta, GlobalVariable.vusu).subscribe(
      (result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.dataJaba = [];
          this.matSnackBar.open('Se registro correctamente el ingreso.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.Num_Jaba = '';
          this.spinnerService.hide();

        } else {
          this.spinnerService.hide();
          this.matSnackBar.open('Ocurrió un error al generar el ingreso.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

      })
  }

}
