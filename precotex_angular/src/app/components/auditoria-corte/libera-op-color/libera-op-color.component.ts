import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";

import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaProcesoCorteService } from 'src/app/services/auditoria-proceso-corte.service';
import { DialogColorComponent } from './dialog-color/dialog-color.component';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';

@Component({
  selector: 'app-libera-op-color',
  templateUrl: './libera-op-color.component.html',
  styleUrls: ['./libera-op-color.component.scss']
})
export class LiberaOpColorComponent implements OnInit {

  codOrdPro: string = "";

  displayedColumns: string[] = ['Id','OP', 'Color', 'Fec_Creacion', 'Cod_Usuario','Acciones']
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private auditoriaProcesoCorteService: AuditoriaProcesoCorteService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.onListarRegistros();
  }

  onListarRegistros(){
    let accion: string = 'V';
    if(this.codOrdPro.trim() != '')
      accion = 'W';
    
    this.spinnerService.show()
    this.auditoriaProcesoCorteService.MantenimientLiberaOPColor(accion, this.codOrdPro.trim(), '', GlobalVariable.vusu)
      .subscribe((result: any) => {
        if(result.length > 0){
          if(result[0].Id != 0){
            this.dataSource = new MatTableDataSource(result);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }else{
            this.matSnackBar.open(result[0].MENSAJE, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.dataSource.data = []          
          }
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []          
        }
        this.spinnerService.hide();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  onInsertarRegistro(){
    let color: any = {};
    let cadena: string = "";

    let dialogRef = this.dialog.open(DialogColorComponent, {
      disableClose: true,
      width: "600px",
      data: color
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        color = result.selected;
        
        color.forEach(e => {
          cadena = cadena + e.Cod_Present + '|'
        });
        cadena = cadena.substring(0, cadena.length - 1);

        this.spinnerService.show();
        this.auditoriaProcesoCorteService.MantenimientLiberaOPColor('I', color[0].Cod_OrdPro, cadena, GlobalVariable.vusu)
          .subscribe((result: any) => {
            if(result.length > 0){
              this.matSnackBar.open('Registro Ok!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.onListarRegistros();
            }else{
              this.matSnackBar.open('Error en el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            }
            this.spinnerService.hide();
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );
        
      }
    });
  }

  onAnularRegistro(data: any){

    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        this.spinnerService.show();
        this.auditoriaProcesoCorteService.MantenimientLiberaOPColor('D', data.OP, data.Id, GlobalVariable.vusu)
          .subscribe((result: any) => {
            if(result.length > 0){
              this.matSnackBar.open('Registro anulado!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.onListarRegistros();
            }else{
              this.matSnackBar.open('Error en el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
            }
            this.spinnerService.hide();
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );        

      }
    });


  }

}
