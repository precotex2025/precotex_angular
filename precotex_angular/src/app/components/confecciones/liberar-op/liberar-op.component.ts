import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LiberacionOpTendidoService } from 'src/app/services/modular/liberacion-op-tendido.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTable } from '@angular/material/table';
import { DialogConfirmacionComponent } from '../../dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  Cod_OrdPro: string,
  Flg_Estado: string,
  Fecha_Registro: Date,
  Fecha_Validacion: Date
}

@Component({
  selector: 'app-liberar-op',
  templateUrl: './liberar-op.component.html',
  styleUrls: ['./liberar-op.component.scss']
})
export class LiberarOpComponent implements OnInit {

  displayedColumns: string[] = [
    'Fecha_Registro',
    'Cod_Usuario',
    'Cod_OrdPro',
    'Flg_Estado',
    'Fecha_Validacion',
    'acciones'
  ];

  Buscar: String = ''
  Estado: String = 'P'

  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private _router: Router,
    private liberacionopservice: LiberacionOpTendidoService,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.obtenerOpTendido();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'items por pagina';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1}  - ${endIndex} de ${length}`;
    };
  }

  obtenerOpTendido() {
    console.log("Prueba")
    this.dataSource.data = [];
    this.SpinnerService.show();
    this.liberacionopservice.obtenerLiberacionOP(
      'P',
      '',
      '',
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
        }else{
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

  OpenDialogConfirmacion(Cod_OrdPro: string) {
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, {
      disableClose: true,
      data: {}
    });
    var usuario = GlobalVariable.vusu;
    console.log(usuario);
    dialogRef.afterClosed().subscribe(result => {

      if (result == 'true') {
        console.log('aceptado');

        this.SpinnerService.show();
        this.liberacionopservice.obtenerLiberacionOP(
          'U',
          Cod_OrdPro,
          'A'
        ).subscribe(
          (result: any) => {
            console.log(result);
            if(result[0].Respuesta == 'OK'){
              this.matSnackBar.open("SE ACTUALIZO EL PAQUETE CORRECTAMENTE..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.obtenerOpTendido();
              this.SpinnerService.hide();
            }else{
              this.matSnackBar.open("Ha ocurrido un error!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.SpinnerService.hide();
            }
              
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))
      }

    })
  }

  obtenerLista($event) {
    console.log($event)
    this.dataSource.data = [];
    this.SpinnerService.show();
    this.liberacionopservice.obtenerLiberacionOP(
      $event.value,
      '',
      '',
    ).subscribe(
      (result: any) => {
        this.SpinnerService.hide();
        if (result.length > 0) {
          this.dataSource.data = result;
        }else{
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

  applyFilter() {
    console.log(this.Buscar)
    const filterValue = this.Buscar;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
