import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { GlobalVariable } from 'src/app/VarGlobals';
import { DialogCabeceraLiquidacionComponent } from '../liquidacion-avios-costura/dialog-cabecera-liquidacion/dialog-cabecera-liquidacion.component';
import { MovimientoLiquidacionAviosService } from 'src/app/services/movimiento-liquidacion-avios.service';
import { DialogDetalleLiquidacionComponent } from './dialog-detalle-liquidacion/dialog-detalle-liquidacion.component';


import { DialogConfirmacionComponent } from 'src/app/components/dialogs/dialog-confirmacion/dialog-confirmacion.component'
import { ExceljsAviosService } from 'src/app/services/exceljs-avios.service';
import { ExceljsAviosVoucherService } from 'src/app/services/exceljs-avios-voucher.service';
import { ExceljsAviosRotuladoService } from 'src/app/services/exceljs-avios-rotulado.service';


interface data_det {
  Num_Auditoria: number,
  Cod_Supervisor: string,
  Nom_Supervisor: string,
  Cod_Auditor: String,
  Nom_Auditor: string,
  Fecha_Auditoria: string,
  Cod_LinPro: string,
  Observacion: string,
  Flg_Status: string,
  Cod_Usuario: string,
  Cod_Equipo: string,
  Fecha_Reg: string,
  total_detalle: string
}
interface data_det_avios {
  Item: string,
  Estado: string,
  OPEstilo: string,
  Articulo: string,
  Grosor: string,
  Talla: string,
  CodColor: string,
  Color: string,
  Lote: string,
  Marca: string,
  Cantidad: string,
  Descripcion: string,
  idliquida: string
}

interface data_cab_avios {
  liquidacion: string,
  idplanta: string,
  idliquida: string,
  fecha_liquida: string,
  area: string,
  linea: string,
  cod_cliente: string
}


interface planta {
  num_planta: string,
  des_planta: string
}


interface Cliente {
  Cod_Cliente: string;
  Nom_Cliente: string;
  Abr_Cliente: string;
}

@Component({
  selector: 'app-liquidacion-avios-costura.component',
  templateUrl: './liquidacion-avios-costura.component.html',
  styleUrls: ['./liquidacion-avios-costura.component.scss']
})
export class LiquidacionAviosCosturaComponent implements OnInit {
  filtroCliente: Observable<Cliente[]> | undefined;
  listar_planta: planta[] = [];

  public data_det = [{
    Num_Auditoria: 0,
    Cod_Supervisor: "",
    Nom_Supervisor: "",
    Cod_Auditor: "",
    Nom_Auditor: "",
    Fecha_Auditoria: "",
    Cod_LinPro: "",
    Observacion: "",
    Flg_Status: "",
    Cod_Usuario: "",
    Cod_Equipo: "",
    Fecha_Reg: ""
  }]

  Num_Liquidacion = "";
  idplanta = "";


  Cod_Accion = ""
  Num_Auditoria = 0
  Cod_Supervisor = ""
  Nom_Supervisor = ""
  Cod_Auditor = ""
  Nom_Auditor = ""
  Fecha_Auditoria = ""
  Fecha_Auditoria2 = ""
  Cod_LinPro = ""
  Observacion = ""
  Flg_Status = ""
  Cod_Usuario = ""
  Cod_Equipo = ""
  Fecha_Reg = ""
  Cod_OrdPro = ""
  Cod_EstCli = ""
  Can_Lote = 0
  Cod_Motivo = ''


  Opcion = "";
  Id_Liquidacion = "";
  Resp_Liquidacion = "";
  Planta = "";
  Liquidacion = "";
  Fecha = "";
  Usuario = "";
  Area = "";
  Linea = "";
  IdCliente = "";

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    Fecha_Movimiento: [''],
    Cliente: [''],
    Area: [''],
    Linea: [''],
    Planta: [''],
    NombreCliente: [''],
    Responsable: ['']
  })


  displayedColumns_cab: string[] = [
    'N° LIQ',
    'Fecha',
    'IdCliente',
    'Cliente',
    'area_liquida',
    'linea_liquida',
    'idliquida',
    'resp_liquida',
    'idplanta',
    'des_planta',
    'cerrar_liquida',
    'reportes',
    'Acciones']

  dataSource: MatTableDataSource<data_det>;
  dataSourceVoucher: MatTableDataSource<data_det_avios>;
  dataSourceCabecera: MatTableDataSource<data_cab_avios>;
  dataSourceRotulado: MatTableDataSource<data_det_avios>;

  dataForExcel = [];
  dataForExcelVoucher = [];
  dataForExcelRotulado = [];
  Abr = ''
  Nom_Cliente = ''
  Cod_Cliente = ''
  listar_Cliente: Cliente[] = [];
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private movimientoLiquidacionAviosService: MovimientoLiquidacionAviosService,
    public dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private exceljsAviosService: ExceljsAviosService,
    private exceljsAviosVoucherService: ExceljsAviosVoucherService,
    private exceljsAviosRotuladoService: ExceljsAviosRotuladoService) {
      this.dataSource = new MatTableDataSource();
    this.dataSourceVoucher = new MatTableDataSource();
    this.dataSourceCabecera = new MatTableDataSource();
    this.dataSourceRotulado = new MatTableDataSource();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.MostrarLiquidacionAvios();
    this.MostrarPlanta();
    this.CargarCliente();
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


  agregarDialog() {

    if (this.formulario.get('Planta')?.value == '') {
      this.matSnackBar.open("Ingrese la Planta...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    } else {
      let dialogRef = this.dialog.open(DialogCabeceraLiquidacionComponent, {
        disableClose: false,
        minWidth: '700px',
        maxWidth: '98wh',
        data: { idplanta: this.formulario.get('Planta')?.value }
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result == 'false') {
          this.MostrarLiquidacionAvios();
        }

      })
    }



  }


  ModificarLiquidacionCabecera(idliquida: string, Num_Liquidacion: string, Fecha: string, area_liquida: string, linea_liquida: string, IdCliente: string, Cliente: string, resp_liquid: string, idplanta: string, cliente: string) {

    let dialogRef = this.dialog.open(DialogCabeceraLiquidacionComponent, {
      disableClose: false,
      data: {
        Num_Liquidacion: Num_Liquidacion,
        Fecha: Fecha,
        area_liquida: area_liquida,
        linea_liquida: linea_liquida,
        IdCliente: IdCliente,
        Cliente: Cliente,
        resp_liquid: resp_liquid,
        idplanta: idplanta,
        idliquida: idliquida,
        cliente: cliente
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'false') {
        this.MostrarLiquidacionAvios();
      }
    })

  }


  MostrarLiquidacionAvios() {

    if (this.formulario.get('NombreCliente')?.value == '') {
      this.formulario.controls['Cliente'].setValue('');
    }
    this.Fecha = this.formulario.get('Fecha_Movimiento')?.value;
    if (!_moment(this.Fecha).isValid()) {
      this.Fecha = '01/01/1900';
    }
    this.Fecha = _moment(this.Fecha.valueOf()).format('DD/MM/YYYY');

    if (this.Fecha == '') { this.Fecha = 'null'; }

    this.SpinnerService.show();
    const formData = new FormData();
    formData.append('Opcion', 'V');
    formData.append('Id_Liquidacion', '0');
    formData.append('Fecha_Liquidacion', this.Fecha);
    formData.append('Cod_Cliente', this.formulario.get('Cliente')?.value);
    formData.append('Area_Liquidacion', this.formulario.get('Area')?.value);
    formData.append('Linea_Liquidacion', this.formulario.get('Linea')?.value);
    formData.append('Resp_Liquidacion', this.formulario.get('Responsable')?.value);
    formData.append('Id_Planta', this.formulario.get('Planta')?.value);
    formData.append('Liquidacion', '');

    this.movimientoLiquidacionAviosService.MantMovimientoLiquidacionAviosService(
      formData
    ).subscribe(
      (result: any) => {
        if (result.data.length > 0) {
 
          this.dataSource.data = result.data
          this.SpinnerService.hide();
          this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.formulario.controls['Cliente'].setValue('');
          this.formulario.controls['NombreCliente'].setValue('');
          this.formulario.controls['Linea'].setValue('');
          this.formulario.controls['Responsable'].setValue('');
        } else {
          this.SpinnerService.hide();
          this.dataSource.data = [];
          this.matSnackBar.open('Proceso Correcto !!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.formulario.controls['Cliente'].setValue('');
          this.formulario.controls['NombreCliente'].setValue('');
          this.formulario.controls['Linea'].setValue('');
          this.formulario.controls['Responsable'].setValue('');
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    )

  }


  EliminarLiquidacionCabecera(idliquida: string, Num_Liquidacion: string, idplanta: string) {


    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: false, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        const formData = new FormData();
        formData.append('Opcion', 'B');
        formData.append('Id_Liquidacion', idliquida);
        formData.append('Fecha_Liquidacion', '');
        formData.append('Cod_Cliente', '');
        formData.append('Area_Liquidacion', '');
        formData.append('Linea_Liquidacion', '');
        formData.append('Resp_Liquidacion', '');
        formData.append('Id_Planta', idplanta);
        formData.append('Liquidacion', '');



        this.movimientoLiquidacionAviosService.MantMovimientoLiquidacionAviosCabService(formData).subscribe(
          (result: any) => {
            if (result.msg == 'OK') {
              this.MostrarLiquidacionAvios();
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

      }

    })


  }


  openDialogDetalle(Liquidacion: string, Flg_Status: string, IdLiquidacion: string) {

    let dialogRef = this.dialog.open(DialogDetalleLiquidacionComponent, {
      disableClose: false,
      panelClass: 'my-class',
      maxWidth: '98vw',
      maxHeight: '98vh',
      data: { Liquidacion: Liquidacion, Flg_Status: Flg_Status, IdLiquidacion: IdLiquidacion }
    });

    dialogRef.afterClosed().subscribe(result => {

      this.MostrarLiquidacionAvios()

    })


  }



  /* --------------- LLENAR SELECT AUDITOR ------------------------------------------ */

  MostrarPlanta() {

    this.Cod_Accion = 'P'
    this.movimientoLiquidacionAviosService.MostrarPlantaService(
    ).subscribe(
      (result: any) => {
        this.listar_planta = result;
        //this.RecargarOperacionAuditor()
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  CambiarValorCodAuditor(Cod_Auditor: string) {
    this.formulario.controls['CodAuditor'].setValue(Cod_Auditor)
  }

  CerrarLiquidacionCabecera(IdLiquida: string,) {


    let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: false, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        const formData = new FormData();
        formData.append('Opcion', 'C');
        formData.append('Id_Liquidacion', IdLiquida);
        formData.append('Fecha_Liquidacion', '');
        formData.append('Cod_Cliente', '');
        formData.append('Area_Liquidacion', '');
        formData.append('Linea_Liquidacion', '');
        formData.append('Resp_Liquidacion', '');
        formData.append('Id_Planta', '');
        formData.append('Liquidacion', '');



        this.movimientoLiquidacionAviosService.MantMovimientoLiquidacionAviosCabService(formData).subscribe(
          (result: any) => {
            
            if (result.msg == 'OK') {
              this.MostrarLiquidacionAvios();
            }
            else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
            duration: 1500,
          }))

      }

    })


  }

  ExportarLiquidacion() {



    this.dataForExcel = [];
    if (this.dataSource.data.length == 0) {
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }
    else {

      this.dataSource.data.forEach((row: any) => {
        row['Fecha'] = row['Fecha'].date.substring(0, 10);
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REPORTE DE LIQUIDACION DE AVIOS DE COSTURA',
        data: this.dataForExcel,
        headers: Object.keys(this.dataSource.data[0])
      }

      this.exceljsAviosService.exportExcel(reportData);


    }

  }

  ImprimirVoucher(IdLiquidacion, resp_liquida) {
    this.SpinnerService.show();

    const formData = new FormData();
    formData.append('Opcion', 'Y');
    formData.append('IdLiquidacion', IdLiquidacion);
    formData.append('Estado', '');
    formData.append('Item', '');
    formData.append('OP', '');
    formData.append('Articulo', '');
    formData.append('Grosor', '');
    formData.append('Talla', '');
    formData.append('CodigoColorPro', '');
    formData.append('Color', '');
    formData.append('Lote', '');
    formData.append('Marca', '');
    formData.append('CantidadConos', '');
    formData.append('Descripcion', '');
    this.movimientoLiquidacionAviosService.BuscarDetalleAvios(formData
    ).subscribe(
      (result: any) => {
        this.dataForExcelVoucher = [];

        if (result.data.length > 0) {


          this.dataSourceCabecera.data = result.data.map(itemCab => ({
            liquidacion: itemCab.liquidacion,
            idplanta: itemCab.idplanta,
            idliquida: itemCab.idliquida,
            fecha_liquida: itemCab.fecha_liquida.date,
            area: itemCab.area,
            linea: itemCab.linea,
            cod_cliente: itemCab.cod_cliente,
            resp_liquida: resp_liquida
          }));

          this.dataSourceVoucher.data = result.data.map(item => ({
            Item: item.Item,
            Estado: item.Estado,
            OPEstilo: item['OP/Estilo'],
            Articulo: item.Articulo,
            Grosor: item.Grosor,
            Talla: item.Talla,
            CodColor: item.CodColor,
            Color: item.color_liquida,
            Lote: item.Lote,
            Marca: item.Marca,
            Cantidad: item.Cantidad,
            Descripcion: item.Descripcion
          }));


          //    this.dataSourceVoucher.data = result.data; 


          if (this.dataSourceVoucher.data.length == 0) {
            this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
          else {

            this.dataSourceVoucher.data.forEach((row: any) => {

              this.dataForExcelVoucher.push(Object.values(row))
            })

            let reportDataVoucher = {
              title: 'LIQUIDACION DE AVIOS',
              data: this.dataForExcelVoucher,
              headers: Object.keys(this.dataSourceVoucher.data[0]),
              encabezado: this.dataSourceCabecera.data[0]
            }

            this.exceljsAviosVoucherService.exportExcel(reportDataVoucher);


          }


          this.SpinnerService.hide();



        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSourceVoucher.data = []
          this.SpinnerService.hide();
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }
  ImprimirRotulado(IdLiquidacion, Cliente) {
    this.SpinnerService.show();

    const formData = new FormData();
    formData.append('Opcion', 'Y');
    formData.append('IdLiquidacion', IdLiquidacion);
    formData.append('Estado', '');
    formData.append('Item', '');
    formData.append('OP', '');
    formData.append('Articulo', '');
    formData.append('Grosor', '');
    formData.append('Talla', '');
    formData.append('CodigoColorPro', '');
    formData.append('Color', '');
    formData.append('Lote', '');
    formData.append('Marca', '');
    formData.append('CantidadConos', '');
    formData.append('Descripcion', '');
    this.movimientoLiquidacionAviosService.BuscarDetalleAvios(formData
    ).subscribe(
      (result: any) => {
        this.dataForExcelRotulado = [];

        if (result.data.length > 0) {
          this.dataSourceRotulado.data = result.data.map(item => ({
            Item: item.Item,
            Estado: item.Estado,
            OPEstilo: item['OP/Estilo'],
            Articulo: item.Articulo,
            Grosor: item.Grosor,
            Talla: item.Talla,
            CodColor: item.CodColor,
            Color: item.color_liquida,
            Lote: item.Lote,
            Marca: item.Marca,
            Cantidad: item.Cantidad,
            Descripcion: item.Descripcion
          }));

          if (this.dataSourceRotulado.data.length == 0) {
            this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          }
          else {

            this.dataSourceRotulado.data.forEach((row: any) => {

              this.dataForExcelRotulado.push(Object.values(row))
            })

            let reportDataVoucher = {
              title: 'Liquidación Avios Costura Rot',
              data: this.dataSourceRotulado.data,
              headers: Object.keys(this.dataSourceRotulado.data[0]),
              cliente: Cliente
            }

            this.exceljsAviosRotuladoService.exportExcel(reportDataVoucher);


          }
          this.SpinnerService.hide();
        }
        else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSourceRotulado.data = []
          //   this.SpinnerService.hide();
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))

  }


  CargarCliente() {

    this.listar_Cliente = [];
    this.Abr = ''
    this.Cod_Cliente = ''
    this.Nom_Cliente = this.formulario.get('Cliente')?.value
    this.Cod_Accion = 'L'

    this.movimientoLiquidacionAviosService.cargarClienteService(this.Abr, this.Cod_Cliente, this.Nom_Cliente, this.Cod_Accion).subscribe(
      (result: any) => {
        this.listar_Cliente = result
        this.RecargarCliente();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }
  RecargarCliente() {
    this.filtroCliente = this.formulario.controls['NombreCliente'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterCliente(option) : this.listar_Cliente.slice())),
    );
  }


  private _filterCliente(value: string): Cliente[] {
    if (value == null || value == undefined) {
      value = ''
    }
    const filterValue = value.toLowerCase();
    return this.listar_Cliente.filter(option => option.Nom_Cliente.toLowerCase().includes(filterValue));
  }

  CambiarValorCliente(Cod_Cliente: string, Abr_Cliente: string) {
    this.formulario.controls['Cliente'].setValue(Abr_Cliente);
  }
}

