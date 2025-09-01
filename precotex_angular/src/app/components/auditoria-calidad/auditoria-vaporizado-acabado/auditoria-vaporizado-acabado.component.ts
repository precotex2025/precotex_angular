import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { ExceljsService } from 'src/app/services/exceljs.service';

import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogCabeceraVaporizadoAcabadoComponent } from './dialog-cabecera-vaporizado-acabado/dialog-cabecera-vaporizado-acabado.component';
import { DialogDetalleVaporizadoAcabadoComponent } from './dialog-detalle-vaporizado-acabado/dialog-detalle-vaporizado-acabado.component';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';

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
    Lectura_Manual:   string,
}

interface data_det_reporte {
  Num_Auditoria?:   number, 
  Num_Detalle?:     number, 
  Fecha?:           string,
  Usuario?:         string,
  Cod_Auditor?:     string,
  Auditor?:         string,
  Tip_Auditoria?:   string, 
  Cod_Operario?:    string,
  Operario?:        string,
  //Cod_LinPro?:      string,
  //Servicio?:        string,
  Cliente?:         string,
  Cod_Estilo?:      string,
  Estilo?:          string,
  OrdPro?:          string,
  Color?:           string,
  Muestra?:         number,
  Motivo?:          string,
  Des_Defecto?:     string,
  Cantidad?:        number,
  Estado?:          string,
  Obs_Cabecera?:    string,
  Obs_Detalle?:     string
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
}

@Component({
  selector: 'app-auditoria-vaporizado-acabado',
  templateUrl: './auditoria-vaporizado-acabado.component.html',
  styleUrls: ['./auditoria-vaporizado-acabado.component.scss']
})
export class AuditoriaVaporizadoAcabadoComponent implements OnInit {

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
    Fecha_Reg:        "",
    Lectura_Manual:   "" 		
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
  Cod_OrdCor        =   ""
  Can_Lote          = 0
  Cod_Motivo        = ''
  Rol               = '';

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    OC:           [''],
    OP:           [''],
    fec_registro: [''],
    auditor:      [''],
    CodAuditor:   [''] 
  })

  dataForExcel = [];
  dataReporteAuditoria: any[] = [];

  displayedColumns_cab: string[] = ['Verificado', 'Num_Auditoria', 'Nom_Auditor', 'Fecha_Auditoria', 'Observacion', 'Flg_Status', 'Acciones']
  dataSource: MatTableDataSource<data_det>;
  showTooltip: boolean = false;
  mostrar = false;
  verificacion = false;
  detalle = false;

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    private exceljsService: ExceljsService,
    private SpinnerService: NgxSpinnerService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void { 
    this.MostrarCabeceraAuditoria();
    this.CargarOperacionAuditor();
    this.Rol = GlobalVariable.vusu;

    // Reemplaza validación los permisos a usuarios.  2024Nov11, Ahmed
    // 192 - Auditoria Vaporizado Acabado
    this.validarCRUDUsuario(192);    
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

  /*
  INSERTAR NUEVO REGISTRO DE AUDITORIA DE VAPORIZADO
  */

  openDialog() {
  
   let dialogRef = this.dialog.open(DialogCabeceraVaporizadoAcabadoComponent, {
      disableClose: true,
      minWidth:'800px',
      maxWidth:'98wh',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'false') {
        this.MostrarCabeceraAuditoria()
      }
 
    })
  
  }

  /*
  MODIFICAR REGISTRO DE AUDITORIA DE VAPORIZADO
  */

  ModificarRegistroCabecera(Num_Auditoria: number,Cod_Supervisor: string, Nom_Supervisor: string, Cod_Auditor: string, Nom_Auditor: string, Fecha_Auditoria: string, Observacion: string, Flg_Status: string) {
    let dialogRef = this.dialog.open(DialogCabeceraVaporizadoAcabadoComponent, {
      disableClose: true,
      data: { Num_Auditoria:    Num_Auditoria,
              Cod_Supervisor:   Cod_Supervisor, 
              Nom_Supervisor:   Nom_Supervisor, 
              Cod_Auditor:      Cod_Auditor, 
              Nom_Auditor:      Nom_Auditor, 
              Fecha_Auditoria:  Fecha_Auditoria, 
              Observacion:      Observacion 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
        this.MostrarCabeceraAuditoria()
    })
  } 

  /*
  LISTAR REGISTROS DE AUDITORIA DE VAPORIZADO
  */

  MostrarCabeceraAuditoria() {
    
    this.SpinnerService.show();
    this.Cod_Accion         = 'L'
    this.Num_Auditoria      = 0
    this.Cod_Supervisor     = ''
    this.Cod_Auditor        = this.formulario.get('CodAuditor')?.value
    this.Fecha_Auditoria    = this.range.get('start')?.value
    this.Fecha_Auditoria2   = this.range.get('end')?.value
    this.Observacion        = ''
    this.Flg_Status         = ''
    this.Cod_OrdPro         = this.formulario.get('OP')?.value
    
    this.auditoriaAcabadosService.Mant_AuditoriaModuloVaporizadoCabService(
      this.Cod_Accion,
      this.Num_Auditoria,
      this.Cod_Supervisor,
      this.Cod_Auditor,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2,
      this.Observacion,
      this.Flg_Status,
      this.Cod_OrdPro
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
     
          this.dataSource.data = result;
          this.SpinnerService.hide();
          this.formulario.controls['CodAuditor'].setValue('');

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

  /*
  ELIMINAR REGISTRO DE AUDITORIA DE VAPORIZADO
  */

  EliminarRegistrocCabecera(Num_Auditoria: number, Cod_Auditor: string) {
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.Cod_Accion         = 'D'
        this.Num_Auditoria      = Num_Auditoria
        this.Cod_Supervisor     = ''
        this.Cod_Auditor        = Cod_Auditor
        this.Fecha_Auditoria    = ''
        this.Fecha_Auditoria2   = ''
        this.Observacion        = ''
        this.Flg_Status         = ''
        this.Cod_OrdPro         = ''
        this.Cod_OrdCor         = ''
        this.auditoriaAcabadosService.Mant_AuditoriaModuloVaporizadoCabService(
          this.Cod_Accion,
          this.Num_Auditoria,
          this.Cod_Supervisor,
          this.Cod_Auditor,
          this.Fecha_Auditoria,
          this.Fecha_Auditoria2,
          this.Observacion,
          this.Flg_Status,
          this.Cod_OrdPro
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

  /*
  VISUALIZAR DETALLE DE REGISTRO DE AUDITORIA DE VAPORIZADO
  */

  openDialogDetalle(Num_Auditoria: number, Flg_Status: string, Lectura_Manual: string){
    //console.log(this.detalle)
    if(Flg_Status == 'P' || this.detalle) {
      let dialogRef = this.dialog.open(DialogDetalleVaporizadoAcabadoComponent, {
        disableClose: true,
        panelClass: 'my-class',
        maxWidth: '98vw',
        maxHeight: '98vh',
        data: {Num_Auditoria: Num_Auditoria, Flg_Status: Flg_Status, Lectura_Manual: Lectura_Manual}
      });

      dialogRef.afterClosed().subscribe(result => {

          this.MostrarCabeceraAuditoria();
    
      });
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

  generateExcel() {
    console.log(this.dataSource.data)

    this.dataForExcel = [];
    if (this.dataReporteAuditoria.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {

      let dataReporte: data_det_reporte[] = [];
      let totalTamMuestra=0;
      let totalCantDefecto=0;

      this.dataReporteAuditoria.forEach((row: any) => {
        let data: data_det_reporte = {};

        data.Fecha = row.Fecha_Auditoria;
        data.Num_Auditoria = row.Num_Auditoria;
        data.Num_Detalle = row.Num_Auditoria_Detalle;
        data.Usuario = row.Cod_Usuario;
        data.Cod_Auditor = row.Cod_Auditor;
        data.Auditor = row.Nom_Auditor;
        data.Tip_Auditoria = row.Tip_Auditoria == 1? "INTERNO" : "EXTERNO";
        data.Cod_Operario = row.Tip_Auditoria == 1 ? row.Cod_Operario : row.Cod_LinPro;
        data.Operario = row.Tip_Auditoria == 1 ? row.Nom_Operario : row.Nom_Servicio;
        //data.Cod_LinPro = row.Cod_LinPro;
        //data.Servicio = row.Nom_Servicio;
        data.Cliente = row.Des_Cliente;
        data.Cod_Estilo = row.Cod_EstCli;
        data.Estilo = row.Des_EstPro;
        data.OrdPro = row.Cod_OrdPro;
        data.Color = row.Des_Present;
        data.Muestra = row.Can_Muestra;
        data.Motivo = row.Cod_Motivo;
        data.Des_Defecto = row.Des_Defecto;
        data.Cantidad = row.Can_Defecto;
        data.Estado = row.Estado;
        data.Obs_Cabecera = row.Observacion_Cab;
        data.Obs_Detalle = row.Observacion;

        totalTamMuestra += parseInt(row.Can_Muestra);
        totalCantDefecto += parseInt(row.Can_Defecto);

        dataReporte.push(data);
      })

      let rowTotales: data_det_reporte  = {
        Fecha: "",
        Num_Auditoria: 0,
        Num_Detalle: 0,
        Usuario: "TOTALES",
        Cod_Auditor: "",
        Auditor: "",
        Tip_Auditoria: "",
        Cod_Operario: "",
        Operario: "",
        //Cod_LinPro: "",
        //Servicio: "",
        Cliente: "",
        Cod_Estilo: "",
        Estilo: "",
        OrdPro: "",
        Color: "",
        Muestra: totalTamMuestra,
        Motivo: "",
        Des_Defecto: "",
        Cantidad: totalCantDefecto,
        Estado: "",
        Obs_Cabecera: "",
        Obs_Detalle: ""
      }

      dataReporte.push(rowTotales);

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE DE VAPORIZADO DE ACABADO',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);
      //this.dataSource.data = [];

    }

  }

  generarDataReporteAuditoria() {
    this.SpinnerService.show();
    this.Cod_Accion         = 'X'
    this.Num_Auditoria      = 0
    this.Cod_Supervisor     = ''
    this.Cod_Auditor        = this.formulario.get('CodAuditor')?.value
    this.Fecha_Auditoria    = this.range.get('start')?.value
    this.Fecha_Auditoria2   = this.range.get('end')?.value
    this.Observacion        = ''
    this.Flg_Status         = ''
    this.Cod_OrdPro         = this.formulario.get('OP')?.value

    this.auditoriaAcabadosService.Mant_AuditoriaModuloVaporizadoCabService(
      this.Cod_Accion,
      this.Num_Auditoria,
      this.Cod_Supervisor,
      this.Cod_Auditor,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2,
      this.Observacion,
      this.Flg_Status,
      this.Cod_OrdPro
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
     
          this.dataReporteAuditoria = result;
          this.SpinnerService.hide();
          this.formulario.controls['CodAuditor'].setValue('');

          this.generateExcel();

        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataReporteAuditoria = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  /*
  Validar y establecer accesos CRUD del Usuario
  2024Nov11, Ahmed
  */
  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          //console.log(crud)
          this.mostrar = crud[0].Flg_Insertar == 1 ? true : false;
          this.verificacion = crud[0].Flg_Verificar == 1 ? true : false;
          this.detalle = crud[0].Flg_Detalle == 1 ? true : false;
        } 
      });

  }

}

