import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";

import { ExceljsService } from 'src/app/services/exceljs.service';

import { GlobalVariable } from 'src/app/VarGlobals';
import { AuditoriaAcabadosService } from 'src/app/services/auditoria-acabados.service';
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';

import { DialogRegistroEmpaqueCajasComponent } from './dialog-registro-empaque-cajas/dialog-registro-empaque-cajas.component'
import { DialogResumenEmpaqueCajasComponent } from './dialog-resumen-empaque-cajas/dialog-resumen-empaque-cajas.component'
import { DialogPendienteEmpaqueCajasComponent } from './dialog-pendiente-empaque-cajas/dialog-pendiente-empaque-cajas.component';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component';

interface data_det {
  Num_Auditoria?: number; 
  Num_Caja?: string; 
  Cod_Auditor?: string; 
  Nom_Auditor?: string;
  Fec_Ini_Auditoria?: string;
  Fec_Fin_Auditoria?: string;
  Num_Vez?: number;
  Cod_Supervisor?: string;
  Flg_Estado?: string;
  Num_Packing?: number;
  Cod_Modulo?: string;
  Cod_Cliente?: string;
  Des_Modulo?: string;
  Des_Cliente?: string;
  Des_Destino?: string;
  Cod_Usuario?: string;
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

@Component({
  selector: 'app-auditoria-empaque-cajas',
  templateUrl: './auditoria-empaque-cajas.component.html',
  styleUrls: ['./auditoria-empaque-cajas.component.scss']
})
export class AuditoriaEmpaqueCajasComponent implements OnInit {

  @ViewChild("numCaja") numCajaInput: ElementRef;

  dataForExcel = [];
  dataReporteAuditoria: any[] = [];
  displayedColumns: string[] = ['Num_Auditoria','Fec_Ini_Auditoria','Num_Packing','Num_Caja','Des_Cliente','Des_Modulo','Num_Vez','Nom_Auditor','Flg_Estado','Acciones']
  dataSource: MatTableDataSource<data_det>;
  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataOperacionAuditor: Auditor[] = [];
  filtroOperacionAuditor: Observable<Auditor[]> | undefined;

  formulario = this.formBuilder.group({
    CodAuditor: [''],
    NomAuditor: [''],
    NumPacking: [''],
    NumCaja: [''],
    numSemana: ['']
  });

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  ln_TotalCajas: number = 0;
  ln_CajasDefecto: number = 0;
  ll_Supervisor: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaAcabadosService: AuditoriaAcabadosService,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    public dialog: MatDialog,
    //private exceljsAviosService: ExceljsAviosService,
    private exceljsService: ExceljsService,
    private spinnerService: NgxSpinnerService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.validarCRUDUsuario(200);    
  }

  ngAfterViewInit() {
    this.numCajaInput.nativeElement.focus();
  }

  onListarAuditoriaEmpaqueCajas(){
    let numPacking = this.formulario.get('NumPacking').value ? this.formulario.get('NumPacking').value : 0;
    
    this.spinnerService.show();
    this.auditoriaAcabadosService.Mant_AuditoriaEmpaqueCajas('L', 0, 0, numPacking, this.formulario.get('CodAuditor').value, this.range.get('start')?.value, this.range.get('end').value, 0, '', '')
      .subscribe((result: any) => {
        if (result.length > 0) {     
          let cajasDefecto: data_det[]
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          cajasDefecto = result.filter(d => d.Flg_Estado == 'R')
          this.ln_TotalCajas = result.length;
          this.ln_CajasDefecto = cajasDefecto.length;

          this.spinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.spinnerService.hide();
        }

        this.numCajaInput.nativeElement.focus();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }));
  }

  onNumeroSemana(){
    let numSemana: string = this.formulario.get('numSemana')?.value;
    let fecha = new Date()

    if(this.getWeekNumber(fecha) >= parseInt(numSemana)){
      let totalDias = ((parseInt(numSemana) - 1) * 7) + 1;
      let fechaRef = new Date(fecha.getFullYear(), 0, totalDias)
      let FechaIni = this.getStartOfWeek(fechaRef);
      let FechaFin = new Date(FechaIni.getFullYear(), FechaIni.getMonth(), FechaIni.getDate() + 6)
  
      this.range.controls['start'].setValue(new Date(FechaIni.getFullYear(), FechaIni.getMonth(), FechaIni.getDate()));
      this.range.controls['end'].setValue(new Date(FechaFin.getFullYear(), FechaFin.getMonth(), FechaFin.getDate()));
    } else {
      this.range.controls['start'].setValue(new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
      this.range.controls['end'].setValue(new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));

      this.matSnackBar.open("Número de semana inválida!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
   
  }

  getWeekNumber(date): number {
    const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / (24 * 60 * 60 * 1000);
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  getStartOfWeek(date): Date {
    // Crear una nueva fecha basada en la fecha proporcionada
    let startOfWeek = new Date(date);
    
    // Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
    let day = startOfWeek.getDay();
    
    // Calcular la diferencia para llegar al lunes
    let diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    
    // Ajustar la fecha al inicio de la semana
    startOfWeek.setDate(diff);
    
    // Establecer la hora a las 00:00:00 para obtener el inicio del día
    startOfWeek.setHours(0, 0, 0, 0);
    
    return startOfWeek;
  }

  onValidarNumeroCaja(){
    let numCaja: string = this.formulario.get('NumCaja')?.value;
    //cambiar8
    if(numCaja.toString().length >= 8){
      this.onInsertarAuditoria(numCaja)
    }
  }

  onInsertarAuditoria(numCaja: string){
    let auditor: Auditor[] = [];
    auditor = this.dataOperacionAuditor.filter(d => d.Tip_Trabajador == GlobalVariable.vtiptra.trim() && d.Cod_Auditor == GlobalVariable.vcodtra.trim());
    let codAuditor: string = GlobalVariable.vtiptra.trim().concat("-").concat(GlobalVariable.vcodtra.trim())
    let nomAuditor: string = auditor.length > 0 ? auditor[0].Nom_Auditor : "";
    let data_det: data_det = {Num_Auditoria: 0, Cod_Auditor: codAuditor, Nom_Auditor: nomAuditor, Num_Vez: 1, Flg_Estado: 'P', Num_Caja: numCaja};
    
    let dialogRef = this.dialog.open(DialogRegistroEmpaqueCajasComponent, {
      disableClose: true,
      width: "1050px",
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onListarAuditoriaEmpaqueCajas();
      this.formulario.controls['NumCaja'].setValue('');
      this.numCajaInput.nativeElement.focus();
    });

  }

  onEditarAuditoria(data_det: data_det){
    let dialogRef = this.dialog.open(DialogRegistroEmpaqueCajasComponent, {
      disableClose: true,
      width: "1050px",
      data: data_det
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onListarAuditoriaEmpaqueCajas();
      this.numCajaInput.nativeElement.focus();
    });

  }

  onEliminarAuditoria(data_det: data_det){

    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.spinnerService.show();

        this.auditoriaAcabadosService.Mant_AuditoriaEmpaqueCajas('D', data_det.Num_Auditoria, 0, 0, '', this.range.get('start')?.value, this.range.get('end').value, 0, '', '')
          .subscribe((result: any) => {
            if (result.length > 0) {
              if(result[0].Respuesta == "OK"){
                this.onListarAuditoriaEmpaqueCajas();
                this.spinnerService.hide();
              } else{
                this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                this.spinnerService.hide();
              }
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }));
      }
    });
  }

  onAvanceAuditoria(){
    let numPacking = this.formulario.get('NumPacking').value ? this.formulario.get('NumPacking').value : 0;

    this.auditoriaAcabadosService.Mant_AuditoriaEmpaqueCajas('R', 0, 0, numPacking, this.formulario.get('CodAuditor').value, this.range.get('start')?.value, this.range.get('end').value, 0, '', '')
    .subscribe((result: any) => {
      if (result.length > 0) {     
        this.spinnerService.hide();

        let dialogRef = this.dialog.open(DialogResumenEmpaqueCajasComponent, {
          disableClose: true,
          width: "300",
          data: result[0]
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log("")
          this.numCajaInput.nativeElement.focus();
        });
        
      }
      else {
        this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

        this.spinnerService.hide();
      }
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
      duration: 1500,
    }));

  }

  onPendienteAuditoria(){
    this.spinnerService.show();
    this.auditoriaAcabadosService.Mant_AuditoriaEmpaqueCajas('F', 0, 0, 0, this.formulario.get('CodAuditor').value, this.range.get('start')?.value, this.range.get('end').value, 0, '', '')
    .subscribe((result: any) => {
      if (result.length > 0) {     
        this.spinnerService.hide();

        let dialogRef = this.dialog.open(DialogPendienteEmpaqueCajasComponent, {
          disableClose: true,
          width: "300",
          data: result
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log("")
          this.numCajaInput.nativeElement.focus();
        });
        
      }
      else {
        this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

        this.spinnerService.hide();
      }
    },
    (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
      duration: 1500,
    }));
  }

  onGenerarReporteAuditoria(tipo: string){
    let numPacking = this.formulario.get('NumPacking').value ? this.formulario.get('NumPacking').value : 0;

    this.spinnerService.show();
    this.auditoriaAcabadosService.Mant_AuditoriaEmpaqueCajas(tipo, 0, 0, numPacking, this.formulario.get('CodAuditor').value, this.range.get('start')?.value, this.range.get('end').value, 0, '', '')
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.dataReporteAuditoria = result;
          this.spinnerService.hide();
          
          switch(tipo){
            case 'X':
              this.generateExcelAuditoria();
              break;
            case 'A':
              this.generateExcelPacking();
              break;
            case 'P':
              this.generateExcelIngenieria();
              break;
          }

          /*if(tipo == 'X')
            this.generateExcelAuditoria();
          else
            this.generateExcelIngenieria();*/
          }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

          this.dataReporteAuditoria = []
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }));
  }

  onGenerarPackingAuditoria(){
    let numPacking = this.formulario.get('NumPacking').value ? this.formulario.get('NumPacking').value : 0;

    if(numPacking != 0){
      this.spinnerService.show();
      this.auditoriaAcabadosService.Get_PackingCajaEmpaque(numPacking)
      .subscribe((result: any) => {
        this.spinnerService.hide();
        //console.log(result)
        if (result.length > 0) {
          this.dataReporteAuditoria = result;
          console.log(this.dataReporteAuditoria)
          //this.exceljsService.exportExcel(this.dataReporteAuditoria);  

          this.dataForExcel = [];
          this.dataReporteAuditoria.forEach((row: any) => {
            this.dataForExcel.push(Object.values(row))
          })

          let reportData = {
            title: 'REPORTE AVANCE PACKING',
            data: this.dataForExcel,
            headers: Object.keys(this.dataReporteAuditoria[0])
          }
        
          this.exceljsService.exportExcel(reportData);




        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }));
    } else {
      this.matSnackBar.open('Ingrese el numero de packing', 'Cerrar', {duration: 1500,})
    }
  }

  generateExcelAuditoria(){
    this.dataForExcel = [];
    if(this.dataReporteAuditoria.length > 0){
      let dataReporte: any[] = [];
      let cantidadDefecto: number = 0;
      
      this.dataReporteAuditoria.forEach((row: any) => {
        let data: any = {};

        data.Fecha_Auditoria = row.Fecha;
        data.Des_Planta = row.Des_Planta;
        data.Des_Modulo = row.Des_Modulo;
        data.Des_Cliente = row.Des_Cliente;
        data.Cod_Defecto = row.Cod_Defecto;
        data.Des_Defecto = row.Des_Defecto;
        data.Cantidad = row.Cantidad;
        data.Nom_Auditor = row.Nom_Auditor;
        data.Cod_EstCli = row.Cod_EstCli;
        data.Cod_ColCli = row.Cod_ColCli;

        cantidadDefecto += parseInt(row.Cantidad.toString());

        dataReporte.push(data);
      });
      
      let rowTotales: any = {
        Fecha_Auditoria: "",
        Des_Planta: "",
        Des_Modulo: "",
        Des_Cliente: "",
        Cod_Defecto: "",
        Des_Defecto: "TOTALES",
        Cantidad: cantidadDefecto,
        Nom_Auditor: "",
        Cod_EstCli: "",
        Cod_ColCli: ""
      }

      dataReporte.push(rowTotales);

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE DEFECTOS EMPAQUE APT',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
  }

  generateExcelPacking(){



    this.dataForExcel = [];
    if(this.dataReporteAuditoria[0].Num_Caja != 0){
      let dataReporte: any[] = [];
      //let cantidadDefecto: number = 0;
      
      this.dataReporteAuditoria.forEach((row: any) => {
        let data: any = {};

        data.Num_Packing = row.Num_Packing;
        data.Num_Caja = row.Num_Caja;
        data.Flg_Status_Caja = row.Flg_Status_Caja;
        data.Nom_Cliente = row.Nom_Cliente;
        data.Cod_EstCli = row.Cod_EstCli;
        data.Cod_ColCli = row.Cod_ColCli;
        data.Des_Modulo = row.Des_Modulo;
        data.Fec_Auditoria = row.Fec_Ini_Auditoria;
        data.Num_Auditoria = row.Num_Vez;
        data.Est_Auditoria = row.Flg_Estado;
        data.Nom_Auditor = row.Nom_Auditor;

        dataReporte.push(data);
      });
      
      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE AVANCE PACKING',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open(this.dataReporteAuditoria[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }


  }

  generateExcelIngenieria(){
    this.dataForExcel = [];

    this.dataReporteAuditoria.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })

    let reportData = {
      title: 'REPORTE INCENTIVOS INGENIERIA',
      data: this.dataForExcel,
      headers: Object.keys(this.dataReporteAuditoria[0]),
      subtotal: true
    }

    this.exceljsService.exportExcelTotal(reportData);

  }

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }

  cargarOperacionAuditor(){    
    this.dataOperacionAuditor = [];
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento('L', '', '', '', 0, '')
      .subscribe(
      (result: any) => {
        this.dataOperacionAuditor = result;
        this.recargarOperacionAuditor();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  recargarOperacionAuditor(){
    this.filtroOperacionAuditor = this.formulario.controls['NomAuditor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionAuditor(option) : this.dataOperacionAuditor.slice())),
    );
    
  }
 
  private _filterOperacionAuditor(value: string): Auditor[] {
    this.formulario.controls['CodAuditor'].setValue('')
    const filterValue = value.toLowerCase();

    return this.dataOperacionAuditor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }

  seleccionarAuditor(option: Auditor){
    //console.log(option)
    this.formulario.controls['CodAuditor'].setValue(option.Tip_Trabajador.concat("-").concat(option.Cod_Auditor));
  }

  limpiarAuditor(){
    //this.formulario.controls['CodAuditor'].setValue('');
    this.formulario.patchValue({
      CodAuditor: '',
      NomAuditor: ''
    });
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

        if(!this.ll_Supervisor){
          this.range.controls['start'].setValue(new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
          this.range.controls['end'].setValue(new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
        } else {
          this.range.controls['start'].setValue(new Date(fecha.getFullYear(), fecha.getMonth() - 1, fecha.getDate()));
          this.range.controls['end'].setValue(new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
        }

        this.cargarOperacionAuditor();
        this.onListarAuditoriaEmpaqueCajas();

      });
  }

}
