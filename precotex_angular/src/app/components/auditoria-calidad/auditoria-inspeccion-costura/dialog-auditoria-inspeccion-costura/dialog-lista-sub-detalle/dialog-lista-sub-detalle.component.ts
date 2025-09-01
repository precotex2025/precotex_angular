import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { DialogRegistrarSubDetalleComponent} from '../dialog-registrar-sub-detalle/dialog-registrar-sub-detalle.component'
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'

interface data{
  Num_Auditoria: number
  Num_Auditoria_Detalle: number
}

interface data_det {
  Num_Auditoria_Sub_Detalle:  number
  Num_Auditoria_Detalle:      number
  Cod_Motivo:                 string
  Descripcion:                string
  Cantidad:                   number
}

@Component({
  selector: 'app-dialog-lista-sub-detalle',
  templateUrl: './dialog-lista-sub-detalle.component.html',
  styleUrls: ['./dialog-lista-sub-detalle.component.scss']
})
export class DialogListaSubDetalleComponent implements OnInit {
  public data_det = [{
    Num_Auditoria_Sub_Detalle:  0,
    Num_Auditoria_Detalle:      0,
    Cod_Motivo:                 '',
    Descripcion:                '',
    Cantidad:                   0		
  }]



 

 // nuevas variables




  Num_Auditoria             = this.data.Num_Auditoria
  Cod_Accion                = ''
  Num_Auditoria_Sub_Detalle = 0
  Num_Auditoria_Detalle     = this.data.Num_Auditoria_Detalle
  Cod_Motivo                = ''
  Cantidad                  = 0
  Cod_Usuario               = ''
  

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    supervisor:   [''],
    fec_registro: [''],
    auditor:      ['']
  })


  displayedColumns_cab: string[] = ['Num_Auditoria_Detalle', 'Cod_Motivo', 'Descripcion', 'Cantidad', 'Acciones']
  dataSource: MatTableDataSource<data_det>;



  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: data) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    this.MostrarSubDetalleAuditoria()
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
 

  clearDate(event) {
    event.stopPropagation();
    this.formulario.controls['fec_registro'].setValue('')
  }


  MostrarSubDetalleAuditoria() {

    this.SpinnerService.show();
    this.Cod_Accion                 = 'L'
    this.Num_Auditoria_Sub_Detalle  = 0
    this.Num_Auditoria_Detalle      = this.data.Num_Auditoria_Detalle
    this.Cod_Motivo                 = ''
    this.Cantidad                   = 0
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaSubDetalleService(
      this.Cod_Accion,
      this.Num_Auditoria_Sub_Detalle,
      this.Num_Auditoria_Detalle,
      this.Cod_Motivo,
      this.Cantidad 
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {

          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }


  EliminarSubDetalle(Cod_Motivo: string) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        
        this.Cod_Accion                 = 'D'
        this.Num_Auditoria_Sub_Detalle  = 0
        this.Num_Auditoria_Detalle      = this.data.Num_Auditoria_Detalle
        this.Cod_Motivo                 = Cod_Motivo
        this.Cantidad                   = 0
        this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaSubDetalleService(
          this.Cod_Accion,
          this.Num_Auditoria_Sub_Detalle,
          this.Num_Auditoria_Detalle,
          this.Cod_Motivo,
          this.Cantidad 
        ).subscribe(
          (result: any) => {
            this.MostrarSubDetalleAuditoria()
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

      }

    })
  }

 
  ModificarSubDetalle(Cod_Motivo: string, Descripcion: string, Cantidad: number) {

    let dialogRef = this.dialog.open(DialogRegistrarSubDetalleComponent, {
      disableClose: true,
      data: { Num_Auditoria_Detalle: this.data.Num_Auditoria_Detalle,
              Cod_Motivo:   Cod_Motivo,
              Descripcion:  Descripcion,
              Cantidad:     Cantidad}
    });

    dialogRef.afterClosed().subscribe(result => {

      
        this.MostrarSubDetalleAuditoria()
   
 
    })
  }

  openDialogRegistrarSubDetalle(){
    let dialogRef = this.dialog.open(DialogRegistrarSubDetalleComponent, {
      disableClose: true,
      data: {Num_Auditoria_Detalle: this.data.Num_Auditoria_Detalle}
    });

    dialogRef.afterClosed().subscribe(result => {
        this.MostrarSubDetalleAuditoria()
    })
  }


   


}

