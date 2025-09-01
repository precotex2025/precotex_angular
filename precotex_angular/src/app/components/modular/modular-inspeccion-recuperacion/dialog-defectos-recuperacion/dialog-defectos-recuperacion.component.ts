import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import { InspeccionPrendaService } from 'src/app/services/modular/inspeccion-prenda.service';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaPrendaService } from 'src/app/services/modular/auditoria-prenda.service';
import { InspeccionSegundaService } from 'src/app/services/modular/inspeccion-segunda.service';

interface data {
  Cod_Familia: string
  Id: string,
  Total: number,
  Tipo: string,
  Id_N: number,
}

interface data_det {
  Abr_Motivo: string;
  Descripcion: string;
  Cantidad: number;
}

@Component({
  selector: 'app-dialog-defectos-recuperacion',
  templateUrl: './dialog-defectos-recuperacion.component.html',
  styleUrls: ['./dialog-defectos-recuperacion.component.scss']
})
export class DialogDefectosRecuperacionComponent implements OnInit {

  Id = 0
  Cod_Familia = ""
  Total = 0

  displayedColumns_cab: string[] = ['Tallas', 'Defecto_Leve', 'Defecto_Critico', 'Cantidad']
  dataSource: MatTableDataSource<data_det>;

  constructor(public dialogRef: MatDialogRef<DialogDefectosRecuperacionComponent>,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private segundasPrendaService: InspeccionSegundaService,
    @Inject(MAT_DIALOG_DATA) public data: data) {
    this.dataSource = new MatTableDataSource();


  }

  ngOnInit(): void {
    this.Total = this.data.Total
    this.MostrarDefectoPorTipo()
  }


  /* --------------- REGISTRAR CABECERA ------------------------------------------ */



  selectMedida(Abr_Motivo: string) {
    if (this.Total == 0) {
      this.dialogRef.close({ data: Abr_Motivo });
    } else {
      this.SpinnerService.show();
      this.segundasPrendaService.CF_Man_Modular_Segundas_Detalle_Web(
        'I',
        this.data.Id_N,
        this.data.Cod_Familia,
        Abr_Motivo,
        this.data.Id,
        '',
        '',
        GlobalVariable.vusu
      ).subscribe(
        (result: any) => {
          //this.obtenerPendienteHabilitador();
          this.SpinnerService.hide();
          console.log(result);
          if (result[0]['Respuesta'] == 'OK') {
            this.matSnackBar.open('Se agrego el defecto correctamente.', 'Cerrar', {
              duration: 3000,
            });
            this.MostrarDefectoPorTipo();
          } else {
            this.matSnackBar.open(result[0]['Respuesta'], 'Cerrar', {
              duration: 3000,
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 3000,
          });
          this.SpinnerService.hide();
        })
    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changeCheck(event, data, tipo) {
    console.log(data);
    console.log(event.target.checked);
    var checked = event.target.checked;
    if (tipo == 1) {
      if (checked == true) {
        this.SpinnerService.show();
        this.segundasPrendaService.CF_Man_Modular_Segundas_Detalle_Web(
          'L',
          this.data.Id_N,
          this.data.Cod_Familia,
          data.Abr_Motivo,
          this.data.Id,
          '1',
          '0',
          GlobalVariable.vusu
        ).subscribe(
          (result: any) => {
            //this.obtenerPendienteHabilitador();
            this.SpinnerService.hide();
            console.log(result);
            if (result[0]['Respuesta'] == 'OK') {
              this.matSnackBar.open('Se agrego el tipo de defecto correctamente.', 'Cerrar', {
                duration: 3000,
              });
              this.MostrarDefectoPorTipo();
            } else {
              this.matSnackBar.open(result[0]['Respuesta'], 'Cerrar', {
                duration: 3000,
              });
            }
          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 3000,
            });
            this.SpinnerService.hide();
          })
      } else {
        this.SpinnerService.show();
        this.segundasPrendaService.CF_Man_Modular_Segundas_Detalle_Web(
          'L',
          this.data.Id_N,
          this.data.Cod_Familia,
          data.Abr_Motivo,
          this.data.Id,
          '0',
          '0',
          GlobalVariable.vusu
        ).subscribe(
          (result: any) => {
            //this.obtenerPendienteHabilitador();
            this.SpinnerService.hide();
            console.log(result);
            if (result[0]['Respuesta'] == 'OK') {
              this.matSnackBar.open('Se quito el tipo de defecto correctamente.', 'Cerrar', {
                duration: 3000,
              });
              this.MostrarDefectoPorTipo();
            } else {
              this.matSnackBar.open(result[0]['Respuesta'], 'Cerrar', {
                duration: 3000,
              });
            }
          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 3000,
            });
            this.SpinnerService.hide();
          })
      }
    } else {
      if (checked == true) {
        this.SpinnerService.show();
        this.segundasPrendaService.CF_Man_Modular_Segundas_Detalle_Web(
          'L',
          this.data.Id_N,
          this.data.Cod_Familia,
          data.Abr_Motivo,
          this.data.Id,
          '0',
          '1',
          GlobalVariable.vusu
        ).subscribe(
          (result: any) => {
            //this.obtenerPendienteHabilitador();
            this.SpinnerService.hide();
            console.log(result);
            if (result[0]['Respuesta'] == 'OK') {
              this.matSnackBar.open('Se agrego el tipo de defecto correctamente.', 'Cerrar', {
                duration: 3000,
              });
              this.MostrarDefectoPorTipo();
            } else {
              this.matSnackBar.open(result[0]['Respuesta'], 'Cerrar', {
                duration: 3000,
              });
            }
          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 3000,
            });
            this.SpinnerService.hide();
          })
       } else {
        this.SpinnerService.show();
        this.segundasPrendaService.CF_Man_Modular_Segundas_Detalle_Web(
          'L',
          this.data.Id_N,
          this.data.Cod_Familia,
          data.Abr_Motivo,
          this.data.Id,
          '0',
          '0',
          GlobalVariable.vusu
        ).subscribe(
          (result: any) => {
            //this.obtenerPendienteHabilitador();
            this.SpinnerService.hide();
            console.log(result);
            if (result[0]['Respuesta'] == 'OK') {
              this.matSnackBar.open('Se quito el tipo de defecto correctamente.', 'Cerrar', {
                duration: 3000,
              });
              this.MostrarDefectoPorTipo();
            } else {
              this.matSnackBar.open(result[0]['Respuesta'], 'Cerrar', {
                duration: 3000,
              });
            }
          },
          (err: HttpErrorResponse) => {
            this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 3000,
            });
            this.SpinnerService.hide();
          })
      }
    }
  }

  MostrarDefectoPorTipo() {
    this.SpinnerService.show();
    this.Id = parseInt(this.data.Id)
    this.Cod_Familia = this.data.Cod_Familia
    this.segundasPrendaService.CF_MODULAR_SEGUNDA_DEFECTO_FAMILIA(
      this.Id,
      this.Cod_Familia
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        this.dataSource.data = result
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 5000,
      })
    })
  }
}

