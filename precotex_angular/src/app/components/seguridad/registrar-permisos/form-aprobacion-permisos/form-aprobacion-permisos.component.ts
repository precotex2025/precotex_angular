import { Component, OnInit, AfterViewInit, inject,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { RegistroPermisosService } from 'src/app/services/registro-permisos.service';
import { startWith, map,debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import { GlobalVariable } from 'src/app/VarGlobals';
import { Router } from '@angular/router';



interface data_det {
  Ano_Fabricacion: string,
  Cod_Item_Cab: string,
  Cod_Item_Det: string,
  Des_Color: string,
  Des_Empresa: string,
  Des_Estado: string,
  Des_Tip_Caja: string,
  Des_Tip_Comb: string,
  Des_Uso_Desuso: string,
  Descripcion: string,
  Fec_Registro: string,
  Medida: string,
  Nom_Marca: string,
  Nom_Modelo: string,
  Nombre_Categoria: string,
  Num_Asiento: string,
  Num_Eje: string,
  Num_Placa: string,
  Num_Serie_Chasis: string,
  Num_Serie_Motor: string,
  Observacion: string,
}

@Component({
  selector: 'app-form-aprobacion-permisos',
  templateUrl: './form-aprobacion-permisos.component.html',
  styleUrls: ['./form-aprobacion-permisos.component.scss']
})
export class FormAprobacionPermisosComponent implements OnInit {

  public data_det = [{
    Des_Empresa:    '',
    Ano_Fabricacion:    '',
    Cod_Item_Cab:    '',
    Cod_Item_Det:    '',
    Des_Color:    '',
    Des_Estado:    '',
    Des_Tip_Caja:    '',
    Des_Tip_Comb:    '',
    Des_Uso_Desuso:    '',
    Descripcion:    '',
    Fec_Registro:    '',
    Medida:    '',
    Nom_Marca:    '',
    Nom_Modelo:    '',
    Nombre_Categoria:    '',
    Num_Asiento:    '',
    Num_Eje:    '',
    Num_Placa:    '',
    Num_Serie_Chasis:    '',
    Num_Serie_Motor:    '',
    Observacion:    ''
  }]


  Fecha_Auditoria   =   ""
  Fecha_Auditoria2  =   ""

  range = new FormGroup({
    start: new FormControl(new Date),
    end: new FormControl(new Date),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({

  })

  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }




  displayedColumns: string[] = [
    'Num_Permiso',
    'Fecha',
    'Nom_Trabajador',
    'Des_Tipo_Permiso',
    'Inicio',
    'Termino',
    'Nom_Trabajador_Aprob',
    'Observacion',
    'acciones'
  ];

  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();




  dataForExcel = [];

  empPerformance = [
    { ID: 10011, NAME: "A", DEPARTMENT: "Sales", MONTH: "Jan", YEAR: 2020, SALES: 132412, CHANGE: 12, LEADS: 35 },
    { ID: 10012, NAME: "A", DEPARTMENT: "Sales", MONTH: "Feb", YEAR: 2020, SALES: 232324, CHANGE: 2, LEADS: 443 },
    { ID: 10013, NAME: "A", DEPARTMENT: "Sales", MONTH: "Mar", YEAR: 2020, SALES: 542234, CHANGE: 45, LEADS: 345 },
    { ID: 10014, NAME: "A", DEPARTMENT: "Sales", MONTH: "Apr", YEAR: 2020, SALES: 223335, CHANGE: 32, LEADS: 234 },
    { ID: 10015, NAME: "A", DEPARTMENT: "Sales", MONTH: "May", YEAR: 2020, SALES: 455535, CHANGE: 21, LEADS: 12 },
  ];

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SeguridadActivoFijoReporteService:RegistroPermisosService,
    public dialog: MatDialog,
    private _router: Router,
    private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService,
    private exceljsService:ExceljsService) {  this.dataSource = new MatTableDataSource(); }

    @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    var tra = [];
    GlobalVariable.Arr_Trabajadores = [];
    this.buscarReporteControlVehiculos();
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

  OpenDialogConfirmacion(data){
    console.log(data);
    if(confirm('Esta seguro de Aprobar el Permiso?')){
      this.SpinnerService.show();
      this.SeguridadActivoFijoReporteService.Rh_Jefatura_Aprueba_Permisos(
        data.Num_Permiso,
        data.Cod_Trabajador,
        data.Tip_Trabajador,
       ).subscribe(
         (result: any) => {
          this.SpinnerService.show();
           if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open("Se actualizo el registro correctamente...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.buscarReporteControlVehiculos();
           }
           else {
             this.matSnackBar.open("Ha ocurrido un error al aprobar el permiso...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
             this.SpinnerService.hide();
           }
         },
         (err: HttpErrorResponse) => {
          this.matSnackBar.open(err.message, 'Cerrar', {
           duration: 1500,
          })
          this.SpinnerService.hide();
        })
    }
  }

  OpenDeleteConfirmacion(data){
    
  }


  exportAsXLSX():void {

    this.excelService.exportAsExcelFile(this.dataSource.data, 'Reporte-Control_Vehiculos');

  }



  buscarReporteControlVehiculos() {
    this.dataSource.data = [];
    var Cod_Empresa = '';
    if (GlobalVariable.empresa == '03') {
      Cod_Empresa = '07';
    }else{
      Cod_Empresa = GlobalVariable.empresa;
    }
    this.SpinnerService.show();
    this.SeguridadActivoFijoReporteService.Rh_Muestra_Permisos_Por_Aprobar(
     '',
     GlobalVariable.vtiptra,
     GlobalVariable.vcodtra,
     Cod_Empresa
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result)
          this.dataSource.data = result
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource.data = []
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }

  openDialogTipos() {
    this._router.navigate(['/FormTrabajadoresPermisos']);
  }

}
