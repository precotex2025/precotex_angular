import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { LiquidadorTransitoService } from 'src/app/services/modular/liquidador-transito.service';
import { DialogGenerarPaqueteComponent } from './dialog-generar-paquete/dialog-generar-paquete.component';
import { DialogImprimirTicketComponent } from './dialog-imprimir-ticket/dialog-imprimir-ticket.component';


interface data_det {
  Cod_OrdPro:string,
  Cod_Present:string,
  Color:string,
  Cantidad_Ticket:string,
  Prendas_Paq:string,
  Paq_Generados:string,
  Cod_Tarifado: string
}

@Component({
  selector: 'app-modular-liquidador-transito',
  templateUrl: './modular-liquidador-transito.component.html',
  styleUrls: ['./modular-liquidador-transito.component.scss']
})
export class ModularLiquidadorTransitoComponent implements OnInit {
  //flg para dar clase css cuando es reproceso o proceso normal
  grid_border = ' border: 1px solid #337ab7;'
  background = 'background-color: #2962FF; border: 1px solid #2962FF;'
  btn_background = 'background-color: #2962FF; color: #ffffff;'

  displayedColumns: string[] = [
    'Cod_OrdPro',
    'Cod_Present',
    'Color',
    'Cantidad_Ticket',
    'Prendas_Paq',
    'Paq_Generados'
  ];
  Cod_OrdPro: string = '';
  dataSource: MatTableDataSource<data_det>;
  array: Array<any> = [];
  Des_OP: string = ''
  columnsToDisplay: string[] = this.displayedColumns.slice();
  Cod_Present = 0;
  Tipo = 'C';
  Opcion = 'A';

  selectedRowIndex = -1;
  dataOp:data_det;
  
  constructor(private matSnackBar: MatSnackBar, private SpinnerService: NgxSpinnerService, private liquidadorTransitoService: LiquidadorTransitoService,  public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
  }

  muestraOP() {
    if (this.Cod_OrdPro.length == 5) {
      this.liquidadorTransitoService.SM_MUESTRA_Cod_OrdPro(
        '001',
        this.Cod_OrdPro
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          if (result.length == 0) {
            this.matSnackBar.open('No se encontraron registros.', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top'
            });
            this.Des_OP = '';
          } else {
            this.Des_OP = result[0].Des_EstPro
            console.log(this.Des_OP);
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


  }

  generarPaquetes(){

    if(this.dataOp != null){
      let dialogRef = this.dialog.open(DialogGenerarPaqueteComponent, {
        disableClose: false,
        minWidth: '800px',
        panelClass: 'my-class',
        maxWidth: '95%',
        data: {
          datos: this.dataOp
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
          console.log(result); 
          if(result == undefined) {
            
          }
      });

    }else{
      this.matSnackBar.open('Debes seleccionar un registro de la tabla.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }

  generarTickets(){

    if(this.dataOp != null){
      let dialogRef = this.dialog.open(DialogImprimirTicketComponent, {
        disableClose: false,
        minWidth: '800px',
        panelClass: 'my-class',
        maxWidth: '95%',
        data: {
          datos: this.dataOp
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
          console.log(result); 
          if(result == undefined) {
            
          }
      });

    }else{
      this.matSnackBar.open('Debes seleccionar un registro de la tabla.', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }

  GuardarCabecera() {
    if (this.Cod_OrdPro != '') {
      this.liquidadorTransitoService.GNRAR_TICKET_INSPECCION_ACABADOS(
        this.Cod_OrdPro,
        this.Cod_Present,
        this.Tipo,
        this.Opcion
      ).subscribe(
        (result: any) => {
          this.SpinnerService.hide();
          console.log(result);
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
    } else {
      this.matSnackBar.open('Debes ingresar el Ticket por agregar', 'Cerrar', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }

  highlight(row: any) {
    if (this.selectedRowIndex != row.Cod_Present) {
      this.selectedRowIndex = row.Cod_Present;
      this.dataOp = row;
    } else {
      this.selectedRowIndex = -1;
      this.dataOp = null;
    }

  }

}
