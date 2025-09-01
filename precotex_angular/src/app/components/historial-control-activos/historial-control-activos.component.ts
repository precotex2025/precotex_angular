import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { SeguridadActivoFijoReporteService } from 'src/app/services/seguridad-activo-fijo-reporte.service';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';
import { IngresoRolloTejidoService } from 'src/app/services/ingreso-rollo-tejido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { GlobalVariable } from 'src/app/VarGlobals';

interface data_det {
  Cod_Activo_Fijo: number;
  Empresa: string;
  Sede: string;
  Piso: string;
  Area: string;
  Centro_Costo: string;
  Responsable: string;
  Cod_Usuario: string;
  ClaseActivo: string;
  Cod_Activo: string;
  Descripcion: string;
  Marca: string;
  Modelo: string;
  Serie: string;
  Color: string;
  Medida: string;
  Serie_Motor: string;
  Serie_Chasis: string;
  Placa: string;
  Tipo_Combustible: string;
  Tipo_Caja: string;
  Cantidad_Asiento: string;
  Cantidad_Eje: string;
  Ano_Fabricacion: string;
  Uso_Desuso: string;
  Observacion: string;
  fec_registro: string;
}

@Component({
  selector: 'app-historial-control-activos',
  templateUrl: './historial-control-activos.component.html',
  styleUrls: ['./historial-control-activos.component.scss']
})
export class HistorialControlActivosComponent implements OnInit {
  public data_det = [{
    Empresa: '',
    Sede: '',
    Piso: '',
    Area: '',
    Centro_Costo: '',
    Responsable: '',
    Cod_Usuario: '',
    ClaseActivo: '',
    Cod_Activo: '',
    Descripcion: '',
    Marca: '',
    Modelo: '',
    Serie: '',
    Color: '',
    Medida: '',
    Serie_Motor: '',
    Serie_Chasis: '',
    Placa: '',
    Tipo_Combustible: '',
    Tipo_Caja: '',
    Cantidad_Asiento: '',
    Cantidad_Eje: '',
    Ano_Fabricacion: '',
    Uso_Desuso: '',
    Observacion: '',
    fec_registro: ''
  }]


  Fecha_Auditoria = ""
  Fecha_Auditoria2 = ""

  // range = new FormGroup({
  //   start: new FormControl(),
  //   end: new FormControl(),
  // });
  range =  this.formBuilder.group({
    start: [''],
    end: ['']
  })
  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({

  })



  displayedColumns: string[] = [
    'select',
    'Empresa',
    'Sede',
    'Piso',
    'Area',
    'Centro_Costo',
    'Responsable',
    'Cod_Usuario',
    'ClaseActivo',
    'Cod_Activo',
    'Descripcion',
    'Marca',
    'Modelo',
    'Serie',
    'Color',
    'Medida',
    'Serie_Motor',
    'Serie_Chasis',
    'Placa',
    'Tipo_Combustible',
    'Tipo_Caja',
    'Cantidad_Asiento',
    'Cantidad_Eje',
    'Ano_Fabricacion',
    'Uso_Desuso',
    'Observacion',
    'fec_registro',
    'acciones'
  ]
  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();




  dataForExcel = [];
  dataForDelete = [];

  empPerformance = [
    { ID: 10011, NAME: "A", DEPARTMENT: "Sales", MONTH: "Jan", YEAR: 2020, SALES: 132412, CHANGE: 12, LEADS: 35 },
    { ID: 10012, NAME: "A", DEPARTMENT: "Sales", MONTH: "Feb", YEAR: 2020, SALES: 232324, CHANGE: 2, LEADS: 443 },
    { ID: 10013, NAME: "A", DEPARTMENT: "Sales", MONTH: "Mar", YEAR: 2020, SALES: 542234, CHANGE: 45, LEADS: 345 },
    { ID: 10014, NAME: "A", DEPARTMENT: "Sales", MONTH: "Apr", YEAR: 2020, SALES: 223335, CHANGE: 32, LEADS: 234 },
    { ID: 10015, NAME: "A", DEPARTMENT: "Sales", MONTH: "May", YEAR: 2020, SALES: 455535, CHANGE: 21, LEADS: 12 },
  ];


  selection = new SelectionModel<data_det>(true, []);
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private SeguridadActivoFijoReporteService: SeguridadActivoFijoReporteService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private excelService: ExcelService,
    private _router: Router,
    private route:ActivatedRoute,
    private exceljsService: ExceljsService) { this.dataSource = new MatTableDataSource(); }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.route.queryParams.subscribe((res) => {
      console.log(res);
      if(res['start'] != null && res['start'] != undefined){
        this.range.controls['start'].setValue(GlobalVariable.start)
        this.range.controls['end'].setValue(GlobalVariable.end)
        this.range.get('start').value;
        // this.range.patchValue({
        //   start: res['start'],
        //   end: res['end']
        // })
        console.log(this.range);
        this.buscarReporteControlVehiculos();
      }
    })
  }

  eliminarActivos() {
    console.log(this.selection.selected);
    this.dataForDelete = [];
    if (this.selection.selected.length > 0) {
      if (confirm("Esta seguro de eliminar este registro?")) {
        this.selection.selected.forEach(element => {
          this.dataForDelete.push(element.Cod_Activo_Fijo);
        });

        console.log(this.dataForDelete);

        for (let i = 0; i < this.dataForDelete.length; i++) {
          this.SeguridadActivoFijoReporteService.verActivoFijo(
            'D',
            this.dataForDelete[i]
          ).subscribe(
            (result: any) => {
              console.log(result)
              if (i == (this.dataForDelete.length - 1)) {
                this.matSnackBar.open("Se elimino los registro correctamente.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
                this.buscarReporteControlVehiculos();
              }
            },
            (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
              duration: 1500,
            }))

        }
      }

    } else {
      this.matSnackBar.open("Debes seleccionar al menos un elemento a eliminar...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 2500 })
    }

  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    console.log(this.isAllSelected());
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: data_det): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Cod_Activo_Fijo + 1}`;
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


  clearDate(event) {
    event.stopPropagation();
    this.range.controls['start'].setValue('')
    this.range.controls['end'].setValue('')
  }



  buscarReporteControlVehiculos() {
    this.dataSource.data = [];
    this.selection.clear();
    this.SpinnerService.show();
    console.log(this.range);
    this.Fecha_Auditoria = this.range.get('start')?.value
    this.Fecha_Auditoria2 = this.range.get('end')?.value
    this.SeguridadActivoFijoReporteService.verHistorialActivoFijo(
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2
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

  EliminarRegistro(Cod_Activo_Fijo) {
    if (confirm("Esta seguro de eliminar este registro?")) {
      this.SeguridadActivoFijoReporteService.verActivoFijo(
        'D',
        Cod_Activo_Fijo
      ).subscribe(
        (result: any) => {
          if (result.length > 0) {
            console.log(result)
            this.matSnackBar.open("Se elimino el registro correctamente.", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.buscarReporteControlVehiculos();
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
  }
  openModificarActivo(Cod_Activo_Fijo) {
    console.log(Cod_Activo_Fijo);
    this.SeguridadActivoFijoReporteService.verActivoFijo(
      'O',
      Cod_Activo_Fijo
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          console.log(this.range.value)
          var Fecha_Auditoria = this.range.get('start')?.value
          var Fecha_Auditoria2 = this.range.get('end')?.value
          GlobalVariable.start = Fecha_Auditoria;
          GlobalVariable.end = Fecha_Auditoria2;
          let data = {
            start: Fecha_Auditoria,
            end: Fecha_Auditoria2
          }
          let objeto = Object.assign({}, this.range.value, result[0]);
          console.log(objeto)
          this._router.navigate(['/ActualizarActivosFijo'], { queryParams: objeto, skipLocationChange: true });

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

}

