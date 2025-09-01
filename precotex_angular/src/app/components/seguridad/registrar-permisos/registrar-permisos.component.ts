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
import { DialogDetalleTrabajadoresComponent } from './dialog-detalle-trabajadores/dialog-detalle-trabajadores.component';
import { Router } from '@angular/router';
import { TiposPermisosComponent } from './tipos-permisos/tipos-permisos.component';


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
  selector: 'app-registrar-permisos',
  templateUrl: './registrar-permisos.component.html',
  styleUrls: ['./registrar-permisos.component.scss']
})
export class RegistrarPermisosComponent implements OnInit {

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

  iSpring: any = [];
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
    'Fec_Permiso',
    'Des_Tipo_Permiso',
    'Nombres_Autoriza',
    'Observacion',
    'Trabajador',
    'Cod_Usuario',
    'acciones'
    ]
  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();


  mostrarBoton = false;

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
    private registroPermisosService:RegistroPermisosService,
    public dialog: MatDialog,
    private _router:Router,
    private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService,
    private exceljsService:ExceljsService) {  this.dataSource = new MatTableDataSource(); }

    @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    var tra = [];
    GlobalVariable.Arr_Trabajadores = [];
    this.getTipoTrabajador();
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
    
    let dialogRef = this.dialog.open(DialogDetalleTrabajadoresComponent, {
      disableClose: false,
      panelClass: 'my-class',
      data: {
        Permiso: data.Num_Permiso,
        Fecha:  data.Fec_Permiso['date']
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    })
  }

  getTipoTrabajador(){
    var Cod_Empresa = '';
    if (GlobalVariable.empresa == '03') {
      Cod_Empresa = '07';
    }else if(GlobalVariable.empresa == 'DBKAPRA'){
      Cod_Empresa = '78';
    }else if(GlobalVariable.empresa == 'DBSABOR_CRIOLLO'){
      Cod_Empresa = '77';
    }
    else{
      Cod_Empresa = GlobalVariable.empresa;
    }
    this.registroPermisosService.Rh_Muestra_Trabajadores_Jefe_Web(
     'C',
     GlobalVariable.vcodtra,
     GlobalVariable.vtiptra,
     Cod_Empresa
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(result);
          if(result[0]['Tipo'] == 'C'){
            this.mostrarBoton = false;
          }else{
            this.mostrarBoton = true;
          }
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

  OpenDeleteConfirmacion(data){

    if(confirm('Esta seguro(a) de eliminar el siguiente registro?')){
      console.log(data)
      this.SpinnerService.show();

      // Obtener datos de interface Spring antes de anular el registro de permiso. 2024Nov08, Ahmed
      this.registroPermisosService.interfaceSpring(data.Num_Permiso.trim(), data.Tip_Trabajador.trim(), data.Cod_Trabajador.trim(), 1)
      .subscribe((res: any) => {
        this.iSpring = res;
        console.log(res)

        // Anular registro 
        this.registroPermisosService.eliminarPermiso(
          data.Num_Permiso
         ).subscribe(
           (result: any) => {
            this.SpinnerService.hide();
             if (result.length > 0) {
              
              // AQUI RECHARZAR REGISTRO SPRING
              if(this.iSpring.length > 0 && this.iSpring[0].NroDocumento != '0'){
                
                this.registroPermisosService.generarPermisoSpring(
                  'R',  // Marca como Rechazado registro
                  this.iSpring[0].NroDocumento.trim(),
                  this.iSpring[0].CompaniaSocio.trim(),
                  this.getFecha(this.iSpring[0].Fecha),
                  this.iSpring[0].ConceptoAcceso.trim(),
                  this.getFecha(this.iSpring[0].Desde),
                  this.getFecha(this.iSpring[0].FechaFin),
                  this.getFecha(this.iSpring[0].Hasta),
                  this.getFecha(this.iSpring[0].FechaAutorizacion),
                  this.iSpring[0].Observacion.trim(),
                  this.getFecha(this.iSpring[0].FechaSolicitud),
                  this.iSpring[0].UltimoUsuario.trim(),
                  this.getFecha(this.iSpring[0].UltimaFechaModif),
                  this.iSpring[0].FlagPermisoInicioFinJornada.trim()
                ).subscribe((res: any) => {
                  console.log("ok")
                })
                

              }
              // FIN GRABAR EN SPRINT
                    
              this.buscarReporteControlVehiculos();
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
             }
             else {
               this.matSnackBar.open("Ha ocurrido un error al eliminar el registro...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
               this.SpinnerService.hide();
             }
           },
           (err: HttpErrorResponse) => 
           {
            this.SpinnerService.hide();
            this.matSnackBar.open(err.message, 'Cerrar', {
             duration: 1500,
            });
          });
      });

    }
    
  }

  generateExcel() {
    console.log(this.dataSource.data)
    
    this.dataForExcel = [];
    if(this.dataSource.data.length == 0){
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else{

    this.dataSource.data.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })

    let reportData = {
      title: 'REPORTE DE TOMA DE INVENTARIO DE ACTIVOS',
      data: this.dataForExcel,
      headers: Object.keys(this.dataSource.data[0])
    }

    this.exceljsService.exportExcel(reportData);
    //this.dataSource.data = [];

  }
  }


  exportAsXLSX():void {

    this.excelService.exportAsExcelFile(this.dataSource.data, 'Reporte-Control_Vehiculos');

  }

  buscarReporteControlVehiculos() {
    this.dataSource.data = [];

    this.SpinnerService.show();
    this.Fecha_Auditoria    = this.range.get('start')?.value
    this.Fecha_Auditoria2   = this.range.get('end')?.value
    this.registroPermisosService.listarPermisosXFecha(
     this.Fecha_Auditoria,
     this.Fecha_Auditoria2,
     GlobalVariable.empresa
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
    let dialogRef = this.dialog.open(TiposPermisosComponent, {
      disableClose: false,
      //minWidth: '600px',
      panelClass: 'my-class',
      maxWidth: '95%',
      data: { eltipo: this.formulario.get('tipos')?.value }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == 'false') {
        //this.CargarOperacionConductor()
        //this.MostrarCabeceraVehiculo()
      }

    })
  }

  openDialogPermisos() {
    this._router.navigate(['/FormAprobacionPermisos']);
  }

  //-- Obtener fecha en formato UTC del objeto fecha enviado por la DB
  //-- 2024Nov07, Ahmed
  getFecha(fecha: any){
    let arr = Object.entries(fecha);
    let fec = new Date(arr[0][1].toString().substring(0,16).concat(" UTC"));

    return fec.toISOString();
  }


}
