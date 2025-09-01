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
//import { DialogCabeceraExternoComponent } from './dialog-auditoria-externo/dialog-cabecera-externo/dialog-cabecera-externo.component';
import { DialogReversionDetalleExternoComponent } from '../reversion-auditoria-final-externa/dialog-reversion-detalle-externo/dialog-reversion-detalle-externo.component';
 
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
    Fecha_Reg:        string,
    Fecha_Reversion: string
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
}

@Component({
  selector: 'app-reversion-auditoria-final-externa',
  templateUrl: './reversion-auditoria-final-externa.component.html',
  styleUrls: ['./reversion-auditoria-final-externa.component.scss']
})
export class ReversionAuditoriaFinalExternaComponent implements OnInit {

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
 
  formulario = this.formBuilder.group({   
    Num_Auditoria:           [''],
    fec_registro: ['']
  })

  displayedColumns_cab: string[] = ['Num_Auditoria', 'Nom_Auditor', 'Fecha_Auditoria', 'Cod_LinPro', 'Observacion', 'Flg_Status', 'Acciones']
  dataSource: MatTableDataSource<data_det>;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    public dialog: MatDialog,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    this.validarCRUDUsuario(174);
    this.MostrarCabeceraAuditoria()
   // this.CargarOperacionAuditor()
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

  MostrarCabeceraAuditoria() {
    
  if(this.formulario.get('Num_Auditoria')?.value!=''){
    this.Num_Auditoria = this.formulario.get('Num_Auditoria')?.value;
  }else{
    this.Num_Auditoria = 0;
  }
    
    this.SpinnerService.show();
    this.Cod_Accion         = 'L'     
    this.Cod_Supervisor     = ''
    this.Cod_Auditor        = ''
    this.Fecha_Auditoria    = this.range.get('start')?.value
    this.Fecha_Auditoria2   = this.range.get('end')?.value
    this.Cod_LinPro         = ''
    this.Observacion        = ''
    this.Flg_Status         = ''
    this.Cod_OrdPro         = ''
    this.Cod_EstCli         = ''
    this.auditoriaInspeccionCosturaService.BuscarAuditoriaFinalExternaService(
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
          console.log('resultado: ',result)
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
 

  openReversion(Cod_LinPro: string, Num_Auditoria: number, Flg_Status: string){

    //if(Flg_Status == 'P' || GlobalVariable.vusu.toUpperCase() == 'RHUAYANA' || GlobalVariable.vusu.toUpperCase() == 'SISTEMAS'){
    if(Flg_Status == 'P' || this.ll_Supervisor){
      let dialogRef = this.dialog.open(DialogReversionDetalleExternoComponent, {
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
      this.matSnackBar.open('Reversión finalizada..', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }

  } 

  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    let fecha = new Date()
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          this.ll_Supervisor = crud[0].Flg_Verificar == 1 ? true : false;
        } else {
          this.formulario.patchValue({
            CodAuditor: GlobalVariable.vtiptra.trim().concat("-").concat(GlobalVariable.vcodtra.trim())
          });
        }
      });
  }  
}

