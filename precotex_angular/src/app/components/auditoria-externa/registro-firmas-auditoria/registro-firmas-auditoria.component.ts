import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalVariable } from 'src/app/VarGlobals';
import { Router } from '@angular/router';

import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { DialogRegistroFirmasComponent } from './dialog-registro-firmas/dialog-registro-firmas.component';
import { DialogFirmaDigitalComponent } from './dialog-firma-digital/dialog-firma-digital.component'
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';

interface data_det {
  Id_Firma: string,
  Tip_Origen: string,
  Cod_Origen: string,
  Imagen: string,
  Cod_Usuario: string,
  Nombre: string,
  Img64: any
}

@Component({
  selector: 'app-registro-firmas-auditoria',
  templateUrl: './registro-firmas-auditoria.component.html',
  styleUrls: ['./registro-firmas-auditoria.component.scss']
})
export class RegistroFirmasAuditoriaComponent implements OnInit {

  displayedColumns: string[] = ['Tip_Origen','Cod_Trabajador','Nombre','acciones'];

  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
    private _router: Router,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private SpinnerService: NgxSpinnerService) {
      this.dataSource = new MatTableDataSource();
    }

  ngOnInit(): void {
    this.cargarFirmas()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  cargarFirmas() {
    this.dataSource.data = [];
    this.SpinnerService.show();

    const formData = new FormData();
    formData.append('Tipo', 'L');
    formData.append('Id_Firma', '0');
    formData.append('Tip_Origen', '');
    formData.append('Cod_Origen', '');
    formData.append('Imagen', '');
    formData.append('Usuario', GlobalVariable.vusu);

    this.auditoriaInspeccionCosturaService.cargarImagenesFirmas(formData).subscribe(
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

  //--- PRUEBA DE FIRMA DIGITAL
  onFirmaDigital(){
    let dialogRef = this.dialog.open(DialogFirmaDigitalComponent, {
      disableClose: true,
      data: {Nombre: "Nombre prueba"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }
  //--

  onInsertarFirma(){
    let data_det: data_det = {Id_Firma: "0", Tip_Origen: "0", Cod_Origen:"", Imagen:"", Cod_Usuario:"", Nombre:"", Img64:"" } ;

    let dialogRef = this.dialog.open(DialogRegistroFirmasComponent, {
      disableClose: true,
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cargarFirmas()
    });
  }

  onEditarFirma(data_det: data_det){
    let data_firma: data_det;
    const formData = new FormData();
    formData.append('Tipo', 'V');
    formData.append('Id_Firma', data_det.Id_Firma);
    formData.append('Tip_Origen', '');
    formData.append('Cod_Origen', '');
    formData.append('Imagen', '');
    formData.append('Usuario', GlobalVariable.vusu);

    this.auditoriaInspeccionCosturaService.cargarImagenesFirmas(formData)
      .subscribe(
      (result: any) => {
        if (result.length > 0) {
          data_firma = result;

          let dialogRef = this.dialog.open(DialogRegistroFirmasComponent, {
            disableClose: true,
            data: data_firma[0]
          });
      
          dialogRef.afterClosed().subscribe(result => {
            this.cargarFirmas()
          });

        }
        else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }));


  }
  
  onAnulaFirma(data_det: data_det){
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {

        const formData = new FormData();
        formData.append('Tipo', 'D');
        formData.append('Id_Firma', data_det.Id_Firma);
        formData.append('Tip_Origen', '');
        formData.append('Cod_Origen', '');
        formData.append('Imagen', '');
        formData.append('Usuario', GlobalVariable.vusu);
        formData.append('Foto', '');

        this.auditoriaInspeccionCosturaService.cargarImagenesFirmas(
          formData).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
              this.cargarFirmas()
            }
            else{
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));
      }
    });

  }

}
