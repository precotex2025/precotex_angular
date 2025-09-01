import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LiquidadorTransitoService } from 'src/app/services/modular/liquidador-transito.service';
import { MatTableDataSource } from '@angular/material/table';
import { DialogMuestraPaquetesComponent } from './dialog-muestra-paquetes/dialog-muestra-paquetes.component';


interface data {
  datos: any
}

interface data_det {
  Color: string,
  Cod_Talla: string,
  Ticket_Generar: string,
  Prendas_Generadas: string,
  Num_Paquetes: Number,
  PrendasPaq: Number,
  Saldo: Number,
  COD_PRESENT: string,
  COD_ORDPRO: string
}

@Component({
  selector: 'app-dialog-generar-paquete',
  templateUrl: './dialog-generar-paquete.component.html',
  styleUrls: ['./dialog-generar-paquete.component.scss']
})
export class DialogGenerarPaqueteComponent implements OnInit {


  displayedColumns: string[] = [
    'Color',
    'Cod_Talla',
    'Ticket_Generar',
    'Prendas_Generadas',
    'Num_Paquetes',
    'PrendasPaq',
    'Saldo',
    'COD_ORDPRO'
  ];


  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();

  array: Array<any> = [];
  real: Array<any> = [];


  selectedRowIndex = -1;
  dataOp: data_det;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SpinnerService: NgxSpinnerService,
    private liquidadorTransitoService: LiquidadorTransitoService,
    @Inject(MAT_DIALOG_DATA) public data: data) {

    this.dataSource = new MatTableDataSource();

  }

  ngOnInit(): void {
    console.log(this.data.datos);
    this.obtenerPrendasDisponibles();
  }


  changeCantidadPaq(event, data_det) {
    console.log(data_det);
    var paquetes = data_det.Num_Paquetes;
    var prendas = data_det.PrendasPaq;
    var totalPrendas = Number(paquetes) * Number(prendas);
    if (Number(totalPrendas) > Number(data_det.Saldo)) {
      data_det.Num_Paquetes = 0;
      data_det.PrendasPaq = 0;

      this.getPrendasDisponibles();
      var array = this.real.filter(element => {
        return data_det.Cod_Talla == element.Cod_Talla
      });
      console.log(array);
      console.log(this.real);
      data_det.Saldo = array[0].Saldo;

      this.matSnackBar.open('El saldo no puede ser negativo.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
    } else {
      data_det.Saldo = Number(data_det.Saldo) - totalPrendas;
    }
  }

  changeCantidad(event, data_det: data_det) {
    var paquetes = data_det.Num_Paquetes;
    var prendas = data_det.PrendasPaq;
    var totalPrendas = Number(paquetes) * Number(prendas);
    if (Number(totalPrendas) > Number(data_det.Saldo)) {
      data_det.Num_Paquetes = 0;
      data_det.PrendasPaq = 0;

      this.getPrendasDisponibles();
      var array = this.real.filter(element => {
        return data_det.Cod_Talla == element.Cod_Talla
      });
      console.log(array);
      console.log(this.real);
      data_det.Saldo = array[0].Saldo;

      this.matSnackBar.open('El saldo no puede ser negativo.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
    } else {
      data_det.Saldo = Number(data_det.Saldo) - totalPrendas;
    }
  }

  obtenerPrendasDisponibles() {
    this.liquidadorTransitoService.GNRAR_TICKET_INSPECCION_ACABADOS(
      this.data.datos.Cod_OrdPro,
      this.data.datos.Cod_Present,
      'D',
      'A'
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        console.log(result);
        this.real = result;
        this.array = result;
        if (this.array.length > 0) {
          this.dataSource.data = this.array;
        } else {
          this.matSnackBar.open('No se encontraron registros.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      })
  }



  verNuevosPaquetes() {
    if (this.dataOp != null) {
      this.SpinnerService.show();
      this.liquidadorTransitoService.CF_MUESTRA_DETALLE_PAQUETES(
        '001',
        this.dataOp.COD_ORDPRO,
        this.dataOp.COD_PRESENT,
        '25',
        this.dataOp.Cod_Talla,
        'A'
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          if (result.length > 0) {
            console.log(result);
            let dialogRef = this.dialog.open(DialogMuestraPaquetesComponent, {
              disableClose: false,
              minWidth: '800px',
              panelClass: 'my-class',
              maxWidth: '95%',
              data: {
                datos: this.dataOp,
                paquetes: result
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log(result);
              if (result == undefined) {

              }
            });
          } else {
            this.matSnackBar.open('No se encontraron registros.', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            });
          }
        },
        (err: HttpErrorResponse) => {
          this.SpinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
        })
    } else {
      this.matSnackBar.open('Debes seleccionar una talla de la tabla.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }

  }

  getPrendasDisponibles() {
    this.liquidadorTransitoService.GNRAR_TICKET_INSPECCION_ACABADOS(
      this.data.datos.Cod_OrdPro,
      this.data.datos.Cod_Present,
      'D',
      'A'
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        console.log(result);
        this.real = result;
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      })
  }

  generarPaquetes(){
    this.array = this.dataSource.data.filter(element => {
      return element.Num_Paquetes != 0 && element.PrendasPaq != 0;
    });
    //console.log(this.array);

    this.SpinnerService.show();
    this.liquidadorTransitoService.CF_MAN_GENERAR_CF_ORDPRO_PAQ_PRENDAS_INSPECCION_NEW(
        this.array
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        console.log(result);
        if(result['msg'] == 'OK'){
          this.matSnackBar.open('Información Salvada', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.dialog.closeAll();
        }else{
          this.matSnackBar.open('Ha ocurrido un error al registrar los paquetes.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
        
      },
      (err: HttpErrorResponse) => {
        this.SpinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top'
        });
      })
  }

  highlight(row: any) {
    if (this.selectedRowIndex != row.Cod_Talla) {
      this.selectedRowIndex = row.Cod_Talla;
      this.dataOp = row;
    } else {
      this.selectedRowIndex = -1;
      this.dataOp = null;
    }

  }
}
