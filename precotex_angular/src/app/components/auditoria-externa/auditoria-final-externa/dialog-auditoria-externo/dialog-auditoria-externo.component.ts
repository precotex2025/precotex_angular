import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";

import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogCabeceraExternoComponent } from './dialog-cabecera-externo/dialog-cabecera-externo.component';
import { DialogDetalleExternoComponent } from './dialog-detalle-externo/dialog-detalle-externo.component';

interface data_det {
    Num_Auditoria:    number, 
    Cod_Supervisor:   string,
    Nom_Supervisor:   string,
    Cod_Auditor:      String, 
    Nom_Auditor:      string,
    Fecha_Auditoria:  string,
    Cod_LinPro:       string,
    Observacion:      string,
    Flg_Status:       string,
    Cod_Usuario:      string,
    Cod_Equipo:       string,
    Fecha_Reg:        string
}
 
interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
}

@Component({
  selector: 'app-dialog-auditoria-externo',
  templateUrl: './dialog-auditoria-externo.component.html',
  styleUrls: ['./dialog-auditoria-externo.component.scss']
})
export class DialogAuditoriaExternoComponent implements OnInit {
 
  listar_operacionAuditor:      Auditor[] = [];
  filtroOperacionAuditor:       Observable<Auditor[]> | undefined;

  public data_det = [{
    Num_Auditoria:    0,
    Cod_Supervisor:   "",
    Nom_Supervisor:   "",
    Cod_Auditor:      "",
    Nom_Auditor:      "",
    Fecha_Auditoria:  "",
    Cod_LinPro:       "",
    Observacion:      "",
    Flg_Status:       "",
    Cod_Usuario:      "",
    Cod_Equipo:       "",
    Fecha_Reg:        ""	 		
  }]

 // nuevas variables
  Cod_Accion        =   ""
  Num_Auditoria     =   0
  Cod_Supervisor    =   ""
  Nom_Supervisor    =   ""
  Cod_Auditor       =   ""
  Nom_Auditor       =   ""
  Fecha_Auditoria   =   ""
  Fecha_Auditoria2  =   ""
  Cod_LinPro        =   ""
  Observacion       =   ""
  Flg_Status        =   ""
  Cod_Usuario       =   ""
  Cod_Equipo        =   ""
  Fecha_Reg         =   ""	 	
  Cod_OrdPro        =   ""
  Cod_EstCli        =   ""
  Can_Lote          = 0
  Cod_Motivo        = ''
  ll_Supervisor: boolean = false;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    OP:           [''],
    Estilo:       [''],
    fec_registro: [''],
    auditor:      [''],
    CodAuditor:   [''] 
  })


  displayedColumns_cab: string[] = ['Num_Auditoria', 'Nom_Supervisor', 'Nom_Auditor', 'Fecha_Auditoria', 'Cod_LinPro', 'Observacion', 'Flg_Status', 'Acciones']
  dataSource: MatTableDataSource<data_det>;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    this.MostrarCabeceraAuditoria()
    this.CargarOperacionAuditor()
    this.validarCRUDUsuario(103);
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
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }


  openDialog() {

   let dialogRef = this.dialog.open(DialogCabeceraExternoComponent, {
      disableClose: true,
      
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'false') {
        this.MostrarCabeceraAuditoria()
      }
 
    })

  }


  ModificarRegistroCabecera(Num_Auditoria: number,Cod_Supervisor: string, Nom_Supervisor: string, Cod_Auditor: string, Nom_Auditor: string, Fecha_Auditoria: string, Cod_LinPro: string, Observacion: string, Flg_Status: string) {
   
      
    let dialogRef = this.dialog.open(DialogCabeceraExternoComponent, {
      disableClose: true,
      data: { Num_Auditoria:    Num_Auditoria,
              Cod_Supervisor:   Cod_Supervisor, 
              Nom_Supervisor:   Nom_Supervisor, 
              Cod_Auditor:      Cod_Auditor, 
              Nom_Auditor:      Nom_Auditor, 
              Fecha_Auditoria:  Fecha_Auditoria, 
              Cod_LinPro:       Cod_LinPro, 
              Observacion:      Observacion 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        this.MostrarCabeceraAuditoria()
    })

  

  } 



  MostrarCabeceraAuditoria() {
    

    this.SpinnerService.show();
    this.Cod_Accion         = 'L'
    this.Num_Auditoria      = 0
    this.Cod_Supervisor     = ''
    this.Cod_Auditor        = this.formulario.get('CodAuditor')?.value
    this.Fecha_Auditoria    = this.range.get('start')?.value
    this.Fecha_Auditoria2   = this.range.get('end')?.value
    this.Cod_LinPro         = ''
    this.Observacion        = ''
    this.Flg_Status         = ''
    this.Cod_OrdPro         = this.formulario.get('OP')?.value
    this.Cod_EstCli         = this.formulario.get('Estilo')?.value
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaCabeceraService(
      this.Cod_Accion,
      this.Num_Auditoria,
      this.Cod_Supervisor,
      this.Cod_Auditor,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2,
      this.Cod_LinPro,
      this.Observacion,
      this.Flg_Status,
      this.Cod_OrdPro,
      this.Cod_EstCli
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result)
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


  EliminarRegistrocCabecera(Num_Auditoria: number, Cod_LinPro: string, Cod_Auditor) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.Cod_Accion         = 'D'
        this.Num_Auditoria      = Num_Auditoria
        this.Cod_Supervisor     = ''
        this.Cod_Auditor        = Cod_Auditor
        this.Fecha_Auditoria    = ''
        this.Fecha_Auditoria2   = ''
        this.Cod_LinPro         = ''
        this.Observacion        = ''
        this.Flg_Status         = ''
        this.Cod_OrdPro         = ''
        this.Cod_EstCli         = ''
        this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaCabeceraService(
          this.Cod_Accion,
          this.Num_Auditoria,
          this.Cod_Supervisor,
          this.Cod_Auditor,
          this.Fecha_Auditoria,
          this.Fecha_Auditoria2,
          this.Cod_LinPro,
          this.Observacion,
          this.Flg_Status,
          this.Cod_OrdPro,
          this.Cod_EstCli
        ).subscribe(
          (result: any) => {
            if(result[0].Respuesta == 'OK'){
            this.MostrarCabeceraAuditoria()
            }
            else{
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

      }

    })
  }


  openDialogDetalle(Cod_LinPro: string, Num_Auditoria: number, Flg_Status: string){
    //if(Flg_Status == 'P' || GlobalVariable.vusu.toUpperCase() == 'RHUAYANA' || GlobalVariable.vusu.toUpperCase() == 'IVARGAS' || GlobalVariable.vusu.toUpperCase() == 'SISTEMAS'){
    if(Flg_Status == 'P' || this.ll_Supervisor){
    let dialogRef = this.dialog.open(DialogDetalleExternoComponent, {
      disableClose: true,
      panelClass: 'my-class',
      maxWidth: '98vw',
      maxHeight: '98vh',
      data: {Cod_LinPro: Cod_LinPro, Num_Auditoria: Num_Auditoria}
    });

    dialogRef.afterClosed().subscribe(result => {

        this.MostrarCabeceraAuditoria()
  
    })
  }else{
    this.matSnackBar.open('Auditoria finalizada..', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
  }
  }


  
  /* --------------- LLENAR SELECT AUDITOR ------------------------------------------ */

  CargarOperacionAuditor(){

    this.listar_operacionAuditor = [];
    this.Cod_Accion   = 'L'
    this.Cod_Auditor  = ''
    this.Nom_Auditor  = ''
    this.Cod_OrdPro   = ''
    this.Can_Lote     = 0
    this.Cod_Motivo   = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
      this.Cod_Accion,
      this.Cod_Auditor,
      this.Nom_Auditor,
      this.Cod_OrdPro,
      this.Can_Lote,
      this.Cod_Motivo
      ).subscribe(
      (result: any) => {
        this.listar_operacionAuditor = result
        this.RecargarOperacionAuditor()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }
  
  
  RecargarOperacionAuditor(){
    this.filtroOperacionAuditor = this.formulario.controls['auditor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionAuditor(option) : this.listar_operacionAuditor.slice())),
    );
    
  }
 
  private _filterOperacionAuditor(value: string): Auditor[] {
    this.formulario.controls['CodAuditor'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionAuditor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || 
    option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }



  /* --------------- CAMBIAR VALOR DEL INPUT COD SUPERVISOR ------------------------------------------ */

  CambiarValorCodAuditor(Cod_Auditor: string){
    this.formulario.controls['CodAuditor'].setValue(Cod_Auditor)
  }

  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          //console.log(crud)
          this.ll_Supervisor = crud[0].Flg_Verificar == 1 ? true : false;
        } 
      });

  }  


}

