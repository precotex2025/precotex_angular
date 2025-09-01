import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";

import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';
import { DialogRegistrarDefectoSalidaAcabadoComponent } from '../dialog-registrar-defecto-salida-acabado/dialog-registrar-defecto-salida-acabado.component';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';

interface data_det {
  Num_Auditoria_Defecto:  number;
  Num_Auditoria: number;
  Cod_Defecto: string;
  Descripcion: string;
  Cantidad: number;
  Tipo: string;
}

@Component({
  selector: 'app-dialog-defectos-salida-acabado',
  templateUrl: './dialog-defectos-salida-acabado.component.html',
  styleUrls: ['./dialog-defectos-salida-acabado.component.scss']
})
export class DialogDefectosSalidaAcabadoComponent implements OnInit {

  ln_numAuditoria: number;

  displayedColumns: string[] = ['Num_Auditoria_Defecto', 'Cod_Defecto', 'Descripcion', 'Cantidad', 'Tipo', 'Acciones']
  dataSource: MatTableDataSource<data_det>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private matSnackBar: MatSnackBar,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    public dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data_det
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.ln_numAuditoria = this.data.Num_Auditoria
    this.onListarDefectosSalidaAcabados();
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
 

  onListarDefectosSalidaAcabados(){
    this.auditoriaAcabadosService.Mant_AuditoriaModuloSalidaAcabadoDefecto("L", 0, this.data.Num_Auditoria, "", "0", "0")
      .subscribe((result: any) => {
        if (result.length > 0) {

          this.dataSource.data = result
          this.spinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }));
  }

  onInsertarDefecto(){
    let data_det: data_det = {Num_Auditoria_Defecto: 0, Num_Auditoria: this.ln_numAuditoria, Cod_Defecto: '', Descripcion: '', Cantidad: 0, Tipo: '1'};

    let dialogRef = this.dialog.open(DialogRegistrarDefectoSalidaAcabadoComponent, {
      disableClose: true,
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
        this.onListarDefectosSalidaAcabados()
    });
  }

  onEditarDefecto(data_det: data_det){
    let dialogRef = this.dialog.open(DialogRegistrarDefectoSalidaAcabadoComponent, {
      disableClose: true,
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
        this.onListarDefectosSalidaAcabados()
    });
  }

  onEliminarDefecto(data_det: data_det){

    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.spinnerService.show();

        this.auditoriaAcabadosService.Mant_AuditoriaModuloSalidaAcabadoDefecto("D", data_det.Num_Auditoria_Defecto, 0, "", "0", "0")
        .subscribe((result: any) => {
          this.spinnerService.hide();
          this.onListarDefectosSalidaAcabados()
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }));
  

      }
    });


  }

}
