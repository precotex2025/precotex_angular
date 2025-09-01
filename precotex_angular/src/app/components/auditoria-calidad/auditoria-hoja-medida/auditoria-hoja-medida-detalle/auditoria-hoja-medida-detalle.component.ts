import { Component, OnInit, AfterViewInit, inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Observable } from 'rxjs';
import { AuditoriaHojaMedidaService } from 'src/app/services/auditoria-hoja-medida.service'
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service'
import { DefectosAlmacenDerivadosService } from 'src/app/services/defectos-almacen-derivados.service'
import { startWith, map, debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { DialogEliminarComponent } from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'
import { GlobalVariable } from 'src/app/VarGlobals';
import { CellClickedEvent, ColDef } from 'ag-grid-community';

import { DialogConfirmacionComponent } from '../../../dialogs/dialog-confirmacion/dialog-confirmacion.component';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { DialogRegistroHojaMedidaComponent } from '../dialog-auditoria-hoja-medida/dialog-registro-hoja-medida/dialog-registro-hoja-medida.component';

interface data_det {
  SEC_MEDIDA: string
  Orden: number
  DES_MEDIDA: string
  TOLERANCIA: string
}

interface Supervisor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface Auditor {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

interface Color {
  Cod_ColCli: string;
  Nom_ColCli: string;
}

@Component({
  selector: 'app-auditoria-hoja-medida-detalle',
  templateUrl: './auditoria-hoja-medida-detalle.component.html',
  styleUrls: ['./auditoria-hoja-medida-detalle.component.scss']
})
export class AuditoriaHojaMedidaDetalleComponent implements OnInit {

  listar_operacionColor: Color[] = [];

  /*rowData;
  columnDefs;*/

  @ViewChild('gGridEmpty') gGridEmpty!: AgGridAngular;


  columnDefs0 = [
  ];




  gridOptions = {

    defaultColDef: {
      sortable: false,
      //filter: 'agTextColumnFilter',
      resizable: false,
      width: 100,

    },

    columnDefs: this.columnDefs0,
    pagination: false,
  };


  listar_operacionSupervisor: Supervisor[] = [];
  filtroOperacionSupervisor: Observable<Supervisor[]> | undefined;
  listar_operacionAuditor: Auditor[] = [];
  filtroOperacionAuditor: Observable<Auditor[]> | undefined;

  public data_det = [{
    SEC_MEDIDA: '',
    Orden: 0,
    DES_MEDIDA: '',
    TOLERANCIA: ''
  }]


  /*Cod_EstProG = GlobalVariable.Cod_EstProG
  Cod_VersionG  = GlobalVariable.Cod_VersionG
  Cod_ClienteG  = GlobalVariable.Cod_ClienteG
  Cod_EstCliG   = GlobalVariable.Cod_EstCliG*/

  Cod_Accion = ''
  Cod_Cliente = ''
  Cod_EstCli = ''

  //var
  Cod_Auditor = ''
  Nom_Auditor = ''
  Cod_OrdPro = ''
  Can_Lote = 0
  Cod_Motivo = ''
  InputFechaDesHabilitado = true

  Cod_EstPro = ''
  Cod_Version = ''

  Cod_ColCli = ''
  Cod_TemCli = ''
  Cod_Clientev2 = ''
  Cod_Hoja_Medida_Cab = 0
  Cod_LinPro = ''
  Observaciones = ''
  Flg_Estado = ''
  Cod_Supervisor = ''
  Flg_Color = false

  dataHojasMedida:Array<any> = [];
  Cod_Hoja_Medida_Det = 0
  Sec = 0
  Tip_Medida = ''
  Sec_Medida = ''
  Cod_Talla = ''
  Medida1 = ''
  Medida2 = ''
  Medida3 = ''
  Medida4 = ''
  Medida5 = ''


  Fecha_Auditoria = ''
  Fecha_Auditoria2 = ''

  Flg_Enable = true


  columnDefinitions = [];
  myControl = new FormControl();
  Fecha = new FormControl(new Date())

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    //-----------NUEVO
    inputCliente: [''],
    inputEstCli: [''],
    inputEstPro: [''],
    inputVersion: [''],
    inputOps: [''],
    Linea: [''],
    CodSupervisor: [''],
    Supervisor: [''],
    CodAuditor: [''],
    Auditor: [''],
    OP: [''],
    Color: [''],
    Sec: [''],
  })
  
  displayedColumns_cab: string[] = []
  dataSource: MatTableDataSource<data_det>;
  columnsToDisplay: string[] = this.displayedColumns_cab.slice();
  rowData: any[];

  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaHojaMedidaService: AuditoriaHojaMedidaService,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private defectosAlmacenDerivadosService: DefectosAlmacenDerivadosService,
    public dialog: MatDialog,
    private router: Router,
    private SpinnerService: NgxSpinnerService) {
      this.dataSource = new MatTableDataSource();

    this.formulario = formBuilder.group({
      inputCliente: [''],
      inputEstCli: [''],
      inputEstPro: [''],
      inputVersion: [''],
      inputOps: [''],
      Linea: ['', Validators.required],
      CodSupervisor: ['', Validators.required],
      Supervisor: ['', Validators.required],
      CodAuditor: ['', Validators.required],
      Auditor: ['', Validators.required],
      OP: ['', Validators.required],
      Color: ['', Validators.required],
      Sec: ['']
    });

  }


  ngOnInit(): void {
    this.formulario.controls['inputCliente'].disable()
    this.formulario.controls['inputEstCli'].disable()
    this.formulario.controls['inputEstPro'].disable()
    this.formulario.controls['inputVersion'].disable()
    this.formulario.controls['inputOps'].disable()
    this.formulario.controls['CodSupervisor'].disable()
    this.formulario.controls['CodAuditor'].disable()
    this.CargarOperacionSupervisor()
    this.CargarOperacionAuditor()

    if (GlobalVariable.Cod_Hoja_Medida_Cab == 0 && GlobalVariable.vCod_Rol != 6) {
      this.Cod_Hoja_Medida_Cab = 0
      GlobalVariable.Cod_Hoja_Medida_Cab = 0
      this.Flg_Color = false
    }
    else if (GlobalVariable.Cod_Hoja_Medida_Cab != 0 && GlobalVariable.vCod_Rol != 6) {
      this.Flg_Color = true
      this.formulario.controls['OP'].disable()
      this.formulario.controls['inputCliente'].disable()
      this.formulario.controls['inputEstCli'].disable()
      this.formulario.controls['inputEstPro'].disable()
      this.formulario.controls['Linea'].disable()
      this.formulario.controls['Color'].disable()
      this.formulario.controls['Supervisor'].disable()
      this.formulario.controls['Auditor'].disable()
      this.formulario.controls['Sec'].disable()
      this.Cod_Hoja_Medida_Cab = GlobalVariable.Cod_Hoja_Medida_Cab
      this.traerInfoCabecera()
      this.verificarEstadoFicha()
      this.CargarOperacionMedida()
    }


    else if (GlobalVariable.vCod_Rol == 6) {
      this.Flg_Color = true
      this.formulario.controls['OP'].disable()
      this.formulario.controls['inputCliente'].disable()
      this.formulario.controls['inputEstCli'].disable()
      this.formulario.controls['inputEstPro'].disable()
      this.formulario.controls['Linea'].disable()
      this.formulario.controls['Color'].disable()
      this.formulario.controls['Supervisor'].disable()
      this.formulario.controls['Auditor'].disable()
      this.Cod_Hoja_Medida_Cab = GlobalVariable.Cod_Hoja_Medida_Cab
      this.traerInfoCabecera()
      this.Flg_Enable = false
    }


  }

  generateColumns(data: any[]) {
    this.columnDefinitions = [];

    data.map(object => {

      Object
        .keys(object)
        .map(key => {
          let mappedColumn = {
            headerName: key.toUpperCase(),
            field: key,
            resizable: true,
            headerClass: 'resizable-header',
            width: 100,
            cellClass: 'grid-align',
            suppressColumnVirtualisation: true,
            rowBuffer: 9999
          }
          this.columnDefinitions.push(mappedColumn);
        })
    })
    //Remove duplicate columns
    this.columnDefinitions = this.columnDefinitions.filter((column, index, self) =>
      index === self.findIndex((colAtIndex) => (
        colAtIndex.field === column.field
      ))
    )

    return this.columnDefinitions;
  }

  verificarEstadoFicha() {
    this.Cod_Accion = 'V'
    this.Cod_Hoja_Medida_Cab
    this.Cod_OrdPro = ''
    this.Cod_ColCli = ''
    this.Cod_Clientev2 = ''
    this.Cod_EstCli = ''
    this.Cod_TemCli = ''
    this.Cod_EstPro = ''
    this.Cod_Version = ''
    this.Cod_LinPro = ''
    this.Cod_Supervisor = ''
    this.Cod_Auditor = ''
    this.Observaciones = ''
    this.Flg_Estado = 'P'
    this.Fecha_Auditoria = ''
    this.Fecha_Auditoria2 = ''
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaCabecera(
      this.Cod_Accion,
      this.Cod_Hoja_Medida_Cab,
      this.Cod_OrdPro,
      this.Cod_ColCli,
      this.Cod_Clientev2,
      this.Cod_EstCli,
      this.Cod_TemCli,
      this.Cod_EstPro,
      this.Cod_Version,
      this.Cod_LinPro,
      this.Cod_Supervisor,
      this.Cod_Auditor,
      this.Observaciones,
      this.Flg_Estado,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2,
      0
    ).subscribe(
      (result: any) => {
        if (result[0].Flg_Estado == 'E') {
          this.Flg_Enable = false
        }
        else if (result[0].Flg_Estado == 'P') {
          this.Flg_Enable = true
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }


  traerInfoCabecera() {
    this.SpinnerService.show();
    this.Cod_Accion = 'T'
    this.Cod_Hoja_Medida_Cab
    this.Cod_OrdPro = ''
    this.Cod_ColCli = ''
    this.Cod_Clientev2 = ''
    this.Cod_EstCli = ''
    this.Cod_TemCli = ''
    this.Cod_EstPro = ''
    this.Cod_Version = ''
    this.Cod_LinPro = ''
    this.Cod_Supervisor = ''
    this.Cod_Auditor = ''
    this.Observaciones = ''
    this.Flg_Estado = 'P'
    this.Fecha_Auditoria = ''
    this.Fecha_Auditoria2 = ''
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaCabecera(
      this.Cod_Accion,
      this.Cod_Hoja_Medida_Cab,
      this.Cod_OrdPro,
      this.Cod_ColCli,
      this.Cod_Clientev2,
      this.Cod_EstCli,
      this.Cod_TemCli,
      this.Cod_EstPro,
      this.Cod_Version,
      this.Cod_LinPro,
      this.Cod_Supervisor,
      this.Cod_Auditor,
      this.Observaciones,
      this.Flg_Estado,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2,
      0
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {

          this.formulario.controls['OP'].setValue(result[0].Cod_OrdPro)
          this.Cod_Cliente = result[0].Cod_Cliente
          this.Cod_EstCli = result[0].Cod_EstCli
          this.Cod_TemCli = result[0].Cod_TemCli
          this.formulario.controls['Color'].setValue(result[0].Nom_ColCli)
          this.formulario.controls['Supervisor'].setValue(result[0].Supervisor)
          this.formulario.controls['Linea'].setValue(result[0].Cod_LinPro)
          this.formulario.controls['Auditor'].setValue(result[0].Auditor)
          this.formulario.controls['Sec'].setValue(result[0].Sec != null ? result[0].Sec.toString() : 0)
          this.Cod_EstPro = result[0].Cod_EstPro
          this.Cod_Version = result[0].Cod_Version

          this.buscarPorOp()
          //this.MostrarCabeceraCargaMedida()
          this.MostrarCargaMedida()

          this.SpinnerService.hide();
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }


  buscarPorOp() {
    this.Cod_OrdPro = this.formulario.get('OP')?.value
    if (this.Cod_OrdPro.length == 5) {
      this.Cod_Accion = '4'
      this.Cod_Cliente = ''
      this.Cod_EstCli = ''
      this.Cod_OrdPro
      this.auditoriaHojaMedidaService.AuditoriaHojaMedidaPrendaService(
        this.Cod_Accion,
        this.Cod_Cliente,
        this.Cod_EstCli,
        this.Cod_OrdPro
      ).subscribe(
        (result: any) => {
          console.log(result)
          if (result.length > 0) {
            this.Cod_EstPro = result[0].Codigo
            this.Cod_Version = result[0].Cod_Version
            this.Cod_Cliente = result[0].Cod_Cliente
            this.Cod_Clientev2 = result[0].Cod_Cliente
            this.Cod_EstCli = result[0].Cod_EstCli
            this.Cod_TemCli = result[0].Cod_TemCli
            this.formulario.controls['inputCliente'].setValue(result[0].Nom_Cliente)
            this.formulario.controls['inputEstCli'].setValue(result[0].Cod_EstCli)
            this.formulario.controls['inputEstPro'].setValue(result[0].Cod_EstProVersion)
            this.formulario.controls['inputVersion'].setValue(result[0].Cod_Version)

            this.CargarOperacionColor();
            this.getHojasMedida();
            //this.MostrarCabeceraCargaMedida()

          } else {
            this.matSnackBar.open('No hay datos con la OP ingresada...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })

          }
          /*this.MostrarOrdenesCargaMedida()*/
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

    }
  }

  getHojasMedida(){
    this.auditoriaHojaMedidaService.ObtenerAuditoriaHojaMedida(
      this.Cod_EstPro,
      this.Cod_Version
    ).subscribe(
      (result: any) => {
        console.log(result.length);
        if (result.length > 0) {
          this.dataHojasMedida = result;
        } else {
          this.matSnackBar.open('No se encontraron hojas de medida operativas.', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  traerRegistrosDetalle(Cod_Hoja_Medida_Cab: number, Sec: number, Tip_Medida: string, Sec_Medida: string, Cod_Talla: string) {
    this.Cod_Accion = 'T'
    this.Cod_Hoja_Medida_Det
    this.Cod_Hoja_Medida_Cab = Cod_Hoja_Medida_Cab
    this.Sec = Sec
    this.Tip_Medida = Tip_Medida
    this.Sec_Medida = Sec_Medida
    this.Cod_Talla = Cod_Talla
    this.Medida1 = this.Medida1
    this.Medida2 = this.Medida2
    this.Medida3 = this.Medida3
    this.Medida4 = this.Medida4
    this.Medida5 = this.Medida5
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaDetalle(
      this.Cod_Accion,
      this.Cod_Hoja_Medida_Det,
      this.Cod_Hoja_Medida_Cab,
      this.Sec,
      this.Tip_Medida,
      this.Sec_Medida,
      this.Cod_Talla,
      this.Medida1,
      this.Medida2
    ).subscribe(
      (result: any) => {
        if (result.length > 0) {
          //console.log(result)
          /*this.Medida1 = result[0].Medida1
          this.Medida2 = result[0].Medida2
          this.Medida3 = result[0].Medida3
          this.Medida4 = result[0].Medida4
          this.Medida5 = result[0].Medida5*/

        } else {

        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }





  onCellClicked(e: CellClickedEvent, params): void {


    console.log('cellClicked', e);

    let ultimoCaracter = e.colDef.field.charAt(e.colDef.field.length - 1)
    console.log(ultimoCaracter)
    if (this.Flg_Enable == true) {
      if (ultimoCaracter == '1' || ultimoCaracter == '2' || ultimoCaracter == '3' || ultimoCaracter == '4' || ultimoCaracter == '5') {
        let dialogRef = this.dialog.open(DialogRegistroHojaMedidaComponent,
          {
            disableClose: true,
            panelClass: 'my-class',
            data: {
              Cod_Talla: e.colDef.field,
              Des_Medida: e.data.DES_MEDIDA,
              Sec: e.data.ORDEN,
              Tip_Medida: e.data.DES_TIPMEDIDA,
              Sec_Medida: e.data.SEC_MEDIDA,
              Cod_Hoja_Medida_Cab: this.Cod_Hoja_Medida_Cab,
              Flg_Enable: this.Flg_Enable
              /*Medida1: this.Medida1,
              Medida2: this.Medida2,
              Medida3: this.Medida3,
              Medida4: this.Medida4,
              Medida5: this.Medida5*/
            }
          });
        dialogRef.afterClosed().subscribe(result => {

          if (result == 'false') {

          } else {
            //console.log(params.value)
            //console.log(result.data)
            params.newValue = result.data
            //params.value = params.newValue; // assign to new adjacent column
            const focusedCell = params.api.getFocusedCell();
            /*console.log("focusedCell")
            console.log(focusedCell)*/
            const column = focusedCell.column.colDef.field;
            /*console.log("column")
            console.log(column)*/
            const rowNode = params.api.getRowNode(focusedCell.rowIndex);
            /*console.log("rowNode")
            console.log(rowNode)*/
            //params.event.pointerId
            rowNode.setDataValue(column, params.newValue)

            //focusedCell.value =  params.newValue;

            //rowNode.setDataValue(focusedCell,params.newValue)
            //params.api.refreshCells({columns : [column]}) ;
            //console.log(params.value)

            //params.data[params.event.pointerId] = params.newValue 
            params.api.refreshCells({
              force: true,
              columns: [column],
              rowNodes: [params.api.getRowNode(focusedCell.rowIndex)]

            });

            /*console.log(params)
            const focusedCell =  params.api.getFocusedCell();
            const rowNode = params.api.getRowNode(focusedCell.rowIndex);
            const column = focusedCell.column.colDef.field;

            console.log(focusedCell)CLIENTE
            console.log(rowNode)
            console.log(column)
            focusedCell.column.colDef.cellStyle = { 'background-color': '#b7e4ff' };
            params.api.refreshCells({
                force: true,
                columns: [column],
                rowNodes: [params.api.getRowNode(focusedCell.rowIndex)]
            });*/

          }
        })
      } else {

      }
    }

  }

  MostrarCabeceraCargaMedida() {

    this.Cod_Accion = 'M'
    this.Cod_Cliente = ''
    //console.log(this.Cod_Cliente)
    this.Cod_EstCli = ''
    this.Cod_EstPro
    this.Cod_Version
    this.auditoriaHojaMedidaService.AuditoriaHojaMedidaComplementoService(
      this.Cod_Accion,
      this.Cod_Cliente,
      this.Cod_EstCli,
      this.Cod_EstPro,
      this.Cod_Version
    ).subscribe(
      (result: any) => {
        console.log(result)
        //console.log(result[0].CLIENTE)
        this.formulario.controls['inputCliente'].setValue(result[0].CLIENTE)
        this.formulario.controls['inputEstCli'].setValue(result[0].ESTILO)
        this.formulario.controls['inputEstPro'].setValue(result[0].EP)
        this.formulario.controls['inputVersion'].setValue(result[0].VERSION)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))

  }

  MostrarOrdenesCargaMedida() {
    /*this.Cod_Accion   = 'O'
    this.Cod_Cliente  = ''
    this.Cod_EstCli   = ''
    this.Cod_EstPro
    this.Cod_Version
      this.auditoriaHojaMedidaService.AuditoriaHojaMedidaComplementoService(
      this.Cod_Accion,
      this.Cod_Cliente,
      this.Cod_EstCli,
      this.Cod_EstPro,
      this.Cod_Version
      ).subscribe(
       (result: any) => {
         //console.log(result)

         var OPS = ''
        result.forEach((currentValue, index) => {
          OPS += result[index].COD_ORDPRO + ' - '
        });

        //OPS = OPS.replace(/.$/,'')
        this.formulario.controls['inputOps'].setValue(OPS)
        

       },
       (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
   */
  }


  print() {
    const printContent = document.getElementById("container");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }


  MostrarCargaMedida() {
    this.SpinnerService.show();

    if (GlobalVariable.Cod_EstProHojaMedida != '' && GlobalVariable.Cod_VersionHojaMedida != '') {
      this.Cod_EstPro = GlobalVariable.Cod_EstProHojaMedida
      this.Cod_Version = GlobalVariable.Cod_VersionHojaMedida
      this.Cod_Hoja_Medida_Cab = GlobalVariable.Cod_Hoja_Medida_Cab
    } else {
      this.Cod_EstPro = this.Cod_EstPro
      this.Cod_Version = this.formulario.get('inputVersion')?.value
    }

    this.Cod_Hoja_Medida_Cab
    this.auditoriaHojaMedidaService.AuditoriaHojaMedidaCargaMedidaService(
      this.Cod_EstPro,
      this.Cod_Version,
      this.formulario.get('OP')?.value,
      this.Cod_Hoja_Medida_Cab
    ).subscribe(
      (result: any) => {

        if (result.length > 0) {
          //TRAE TODOS LOS NOMBRES DE LOS INDICES DE UN ARREGLO

          /* Object.keys(result[0]).forEach((currentValue, index) => {
            console.log(Object.keys(result[0])[index])
            this.displayedColumns_cab.push(Object.keys(result[0])[index])
            this.columnDefs.push({field : Object.keys(result[0])[index]})
            //keys.forEach(key => colDefs.push({field : key}));
          })
          console.log(this.columnDefs)
          this.columnsToDisplay = this.displayedColumns_cab.slice()
          this.dataSource.data = result
          this.rowData = result*/

          this.rowData = result
          const colDefs = this.gGridEmpty.api.getColumnDefs();
          colDefs!.length = 0;
          const keys = Object.keys(result[0])
          delete keys[0]

          /*let cont = 5
          let contadorGeneral = keys.length - cont
          keys.forEach((currentValue, index) => {  
            if(index == cont)
            {
              for (let j = 0; j < contadorGeneral; j++) {
               
              let inicializador = (1+cont)
              let final =  (inicializador + 5)
              let medida = 1
              //console.log(keys[cont])
              for (let i = inicializador; i < final; i++) {
                keys.splice(i, 0, (keys[cont].trim())+medida);
                medida++
                if(i + 1 == final){
                  cont = final
                }
              }
            }
              
            }
          });*/

          // agregamos cada key a colDefs con el valor de field
          keys.forEach((currentValue, index) => {
            if (index == 3) {
              colDefs!.push({ field: keys[index], suppressMovable: true, pinned: 'left', lockPinned: true, cellClass: 'lock-pinned', width: 300, resizable: true })
            }
            else if (index == 4) {
              colDefs!.push({ field: keys[index], suppressMovable: true, pinned: 'left', lockPinned: true, cellClass: 'lock-pinned', width: 120 })
            }
            else {
              colDefs!.push({ field: keys[index], suppressMovable: true })
            }
          })

          this.gGridEmpty.api.setColumnDefs(colDefs!);

          //console.log(this.rowData)
          this.gGridEmpty.api.setRowData(this.rowData)

          this.SpinnerService.hide();
          GlobalVariable.Cod_EstProHojaMedida = ''
          GlobalVariable.Cod_VersionHojaMedida = ''
          GlobalVariable.Cod_Hoja_Medida_Cab = 0
        } else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
          GlobalVariable.Cod_EstProHojaMedida = ''
          GlobalVariable.Cod_VersionHojaMedida = ''
          GlobalVariable.Cod_Hoja_Medida_Cab = 0
        }


      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))


  }


  /* --------------- LLENAR SELECT SUPERVISOR ------------------------------------------ */

  CargarOperacionSupervisor() {

    this.listar_operacionSupervisor = [];
    this.Cod_Accion = 'I'
    this.Cod_Auditor = ''
    this.Nom_Auditor = ''
    this.Cod_OrdPro = ''
    this.Can_Lote = 0
    this.Cod_Motivo = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
      this.Cod_Accion,
      this.Cod_Auditor,
      this.Nom_Auditor,
      this.Cod_OrdPro,
      this.Can_Lote,
      this.Cod_Motivo
    ).subscribe(
      (result: any) => {
        this.listar_operacionSupervisor = result
        this.RecargarOperacionSupervisor()

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  RecargarOperacionSupervisor() {
    this.filtroOperacionSupervisor = this.formulario.controls['Supervisor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionSupervisor(option) : this.listar_operacionSupervisor.slice())),
    );

  }



  private _filterOperacionSupervisor(value: string): Supervisor[] {
    this.formulario.controls['CodSupervisor'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionSupervisor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue) > -1 ||
      option.Nom_Auditor.toLowerCase().indexOf(filterValue) > -1);
  }



  /* --------------- CAMBIAR VALOR DEL INPUT COD SUPERVISOR ------------------------------------------ */

  CambiarValorCodSupervisor(Cod_Auditor: string, Tip_Trabajador: string) {
    this.formulario.controls['CodSupervisor'].setValue(Tip_Trabajador + '-' + Cod_Auditor)
  }


  /* --------------- BUSCAR SUPERVISOR Y LLENAR INPUT SUPERVISOR ------------------------------------------ */
  BuscarSupervisor() {
    this.listar_operacionSupervisor = [];
    this.Cod_Accion = 'T'
    this.Cod_Auditor = this.formulario.get('CodSupervisor')?.value
    this.Nom_Auditor = ''
    this.Cod_OrdPro = ''
    this.Can_Lote = 0
    this.Cod_Motivo = ''
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento(
      this.Cod_Accion,
      this.Cod_Auditor,
      this.Nom_Auditor,
      this.Cod_OrdPro,
      this.Can_Lote,
      this.Cod_Motivo
    ).subscribe(
      (result: any) => {
        this.formulario.controls['Supervisor'].setValue(result[0].Nom_Auditor)
        this.formulario.controls['CodSupervisor'].setValue(result[0].Cod_Auditor)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }



  /* --------------- LLENAR SELECT AUDITOR ------------------------------------------ */

  CargarOperacionAuditor() {

    this.listar_operacionAuditor = [];
    this.Cod_Accion = 'L'
    this.Cod_Auditor = ''
    this.Nom_Auditor = ''
    this.Cod_OrdPro = ''
    this.Can_Lote = 0
    this.Cod_Motivo = ''
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


  RecargarOperacionAuditor() {
    this.filtroOperacionAuditor = this.formulario.controls['Auditor'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionAuditor(option) : this.listar_operacionAuditor.slice())),
    );

  }

  private _filterOperacionAuditor(value: string): Auditor[] {
    this.formulario.controls['CodAuditor'].setValue('')
    const filterValue = value.toLowerCase();
    //PERMITE BUSCAR POR 2 VARIABLES
    return this.listar_operacionAuditor.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue) > -1 ||
      option.Nom_Auditor.toLowerCase().indexOf(filterValue) > -1);
  }

  /* --------------- CAMBIAR VALOR DEL INPUT COD SUPERVISOR ------------------------------------------ */

  CambiarValorCodAuditor(Cod_Auditor: string, Tip_Trabajador: string) {
    this.formulario.controls['CodAuditor'].setValue(Tip_Trabajador + '-' + Cod_Auditor)
  }

  CargarOperacionColor() {

    this.Cod_Cliente = this.Cod_Cliente
    this.Cod_EstCli = this.Cod_EstCli
    this.Cod_TemCli = this.Cod_TemCli
    this.defectosAlmacenDerivadosService.Cf_Buscar_Derivado_Estilo_Color(this.Cod_Cliente, this.Cod_TemCli, this.Cod_EstCli).subscribe(
      (result: any) => {

        this.listar_operacionColor = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  submit(formDirective): void {
    this.Cod_Accion = 'I'
    this.Cod_Hoja_Medida_Cab
    this.Cod_OrdPro
    this.Cod_ColCli = this.formulario.get('Color')?.value
    this.Cod_Clientev2
    this.Cod_EstCli = this.formulario.get('inputEstCli')?.value
    this.Cod_TemCli
    this.Cod_EstPro
    this.Cod_Version
    this.Cod_LinPro = this.formulario.get('Linea')?.value
    this.Cod_Supervisor = this.formulario.get('CodSupervisor')?.value
    this.Cod_Auditor = this.formulario.get('CodAuditor')?.value
    this.Observaciones
    this.Flg_Estado = 'P',
      this.Fecha_Auditoria = ''
    this.Fecha_Auditoria2 = ''
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaCabecera(
      this.Cod_Accion,
      this.Cod_Hoja_Medida_Cab,
      this.Cod_OrdPro,
      this.Cod_ColCli,
      this.Cod_Clientev2,
      this.Cod_EstCli,
      this.Cod_TemCli,
      this.Cod_EstPro,
      this.Cod_Version,
      this.Cod_LinPro,
      this.Cod_Supervisor,
      this.Cod_Auditor,
      this.Observaciones,
      this.Flg_Estado,
      this.Fecha_Auditoria,
      this.Fecha_Auditoria2,
      this.formulario.get('Sec')?.value
    ).subscribe(
      (result: any) => {

        if (result[0].Respuesta == 'OK') {
          this.Cod_Hoja_Medida_Cab = result[0].Cod_Hoja_Medida_Cab
          this.MostrarCargaMedida()
          this.formulario.controls['OP'].disable()
          this.formulario.controls['inputCliente'].disable()
          this.formulario.controls['inputEstCli'].disable()
          this.formulario.controls['inputEstPro'].disable()
          this.formulario.controls['Linea'].disable()
          this.formulario.controls['Color'].disable()
          this.formulario.controls['Supervisor'].disable()
          this.formulario.controls['Auditor'].disable()
          this.Cod_Hoja_Medida_Cab = result[0].Cod_Hoja_Medida_Cab
          this.Cod_Hoja_Medida_Cab = result[0].Cod_Hoja_Medida_Cab
          this.Cod_Hoja_Medida_Cab = result[0].Cod_Hoja_Medida_Cab
          this.Cod_Hoja_Medida_Cab = result[0].Cod_Hoja_Medida_Cab
          this.CargarOperacionMedida()

          this.matSnackBar.open('Proceso correcto..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))


  }


  FinalizarFicha() {
    let dialogRef = this.dialog.open(DialogConfirmacionComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.Cod_Accion = 'F'
        this.Cod_Hoja_Medida_Cab
        this.Cod_OrdPro
        this.Cod_ColCli = ''
        this.Cod_Clientev2
        this.Cod_EstCli = ''
        this.Cod_TemCli
        this.Cod_EstPro
        this.Cod_Version
        this.Cod_LinPro = ''
        this.Cod_Supervisor = ''
        this.Cod_Auditor = ''
        this.Observaciones
        this.Flg_Estado = 'E',
          this.Fecha_Auditoria = ''
        this.Fecha_Auditoria2 = ''
        this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaCabecera(
          this.Cod_Accion,
          this.Cod_Hoja_Medida_Cab,
          this.Cod_OrdPro,
          this.Cod_ColCli,
          this.Cod_Clientev2,
          this.Cod_EstCli,
          this.Cod_TemCli,
          this.Cod_EstPro,
          this.Cod_Version,
          this.Cod_LinPro,
          this.Cod_Supervisor,
          this.Cod_Auditor,
          this.Observaciones,
          this.Flg_Estado,
          this.Fecha_Auditoria,
          this.Fecha_Auditoria2,
          0
        ).subscribe(
          (result: any) => {

            if (result[0].Respuesta == 'OK') {
              this.router.navigate(['/AuditoriaHojaMedida']);
              this.matSnackBar.open('La auditoria se proceso correctamente..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            } else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }

          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))


      }

    })
  }




  CargarOperacionMedida() {
    GlobalVariable.Arr_Medidas = []
    this.Cod_Accion = 'M'
    this.Cod_Hoja_Medida_Det
    this.Cod_Hoja_Medida_Cab
    this.Sec = 0
    this.Tip_Medida = ''
    this.Sec_Medida = ''
    this.Cod_Talla = ''
    this.Medida1 = ''
    this.Medida2 = ''
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaDetalle(
      this.Cod_Accion,
      this.Cod_Hoja_Medida_Det,
      this.Cod_Hoja_Medida_Cab,
      this.Sec,
      this.Tip_Medida,
      this.Sec_Medida,
      this.Cod_Talla,
      this.Medida1,
      this.Medida2
    ).subscribe(
      (result: any) => {
        GlobalVariable.Arr_Medidas = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }


}
