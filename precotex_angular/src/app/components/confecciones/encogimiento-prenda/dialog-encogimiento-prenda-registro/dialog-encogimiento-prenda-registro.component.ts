import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { NgxSpinnerService }  from "ngx-spinner";
import { DatePipe } from "@angular/common";
import { AgGridAngular } from 'ag-grid-angular';
import * as _moment from 'moment';

import { AuditoriaHojaMedidaService } from 'src/app/services/auditoria-hoja-medida.service'
import { AuditoriaInspeccionCosturaService } from 'src/app/services/auditoria-inspeccion-costura.service'
import { GlobalVariable } from 'src/app/VarGlobals';
import { CellClickedEvent } from 'ag-grid-community';

import { DialogConfirmacion2Component} from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component';
import { DialogEncogimientoPrendaMedidasComponent } from '../dialog-encogimiento-prenda-medidas/dialog-encogimiento-prenda-medidas.component';
import { DialogEncogimientoPrendaValorComponent } from '../dialog-encogimiento-prenda-valor/dialog-encogimiento-prenda-valor.component';

interface data {
  Id_Registro?: number;
  Cod_OrdPro?: string;
  Nom_Cliente?: string;
  Sec?: string;
  Cod_Talla?: string;
  Cod_Modelista?: string;
  Flg_Estado?: string;
  Fecha_Registro?: string;
  Cod_EstPro?: string;
  Cod_EstCli?: string;
  Cod_Cliente?: string;
  Cod_Version?: string;
  Nom_TemCli?: string;
  Cod_OrdTra?: string;
  Ruta_Prenda?: string;
  Codigo_Molde?: string;
  Encogimiento_Hilo?: string;
  Encogimiento_Travez?: string;
  Tipo_Tela?: string;
  Color_Tela?: string;
  Nom_Modelista?: string;
}

interface data_det {
  Id_Registro?: number;
  Des_TipMedida?: string
  Sec_Medida?: string
  Des_Medida?: string
  Tip_Proceso?: string
  Num_Medida?: string
  Orden?: string
  Valor?: string
  Val_Medida?: number;
  Flg_Estado?: string;
}

interface data_esp {
  Color_Tela?: string;
  Cod_OrdPro?: string;
  Cod_Color?: string;
  Cod_OrdTra?: string;
  Cod_Tela?: string;
  Tipo_Tela?: string;
  Codigo_Molde?: string;
  Encogimiento_Hilo?: string;
  Encogimiento_Travez?: string;
  Encog_Ancho_Real_1Lav?: string;
  Encog_Largo_Real_1Lav?: string;
  Encog_Ancho_Real_3Lav?: string;
  Encog_Largo_Real_3Lav?: string;
  Densidad_Real?: string;
  Densidad_Std?: string;
  Encog_Ancho_Residual?: string;
  Encog_Ancho_Std?: string;
  Encog_Largo_Residual?: string;
  Encog_Largo_Std?: string;
  Inc_Tramo_Res_Der?: string;
  Inc_Tramo_Res_Cen?: string;
  Inc_Tramo_Res_Izq?: string;
  Inc_Tramo_Cen?: string;
  Inc_Tramo_Der?: string;
  Inc_Tramo_Izq?: string;
  Revirado_1er_Lav?: string;
  Revirado_3er_Lav?: string;
  Revirado_Std?: string;  
}

interface Modelista {
  Cod_Auditor: string;
  Nom_Auditor: string;
  Tip_Trabajador: string;
}

@Component({
  selector: 'app-dialog-encogimiento-prenda-registro',
  templateUrl: './dialog-encogimiento-prenda-registro.component.html',
  styleUrls: ['./dialog-encogimiento-prenda-registro.component.scss']
})
export class DialogEncogimientoPrendaRegistroComponent implements OnInit {

  @ViewChild('gGridEmpty') gGridEmpty!: AgGridAngular;
  
  columnDefs0 = [];
  columnDefinitions = [];
  gridOptions = {
    defaultColDef: {
      sortable: false,
      resizable: false,
      width: 100,
    },
  
    columnDefs: this.columnDefs0,
    pagination: false,
  };

  formulario = this.formBuilder.group({
    OP: ['', Validators.required],
    NomCliente: [{value: "", disabled: true}],
    CodEstCli: [{value: "", disabled: true}],
    CodVersion: [{value: "", disabled: true}],
    CodEstPro: [{value: "", disabled: true}],
    EstProVer: [{value: "", disabled: true}],
    NomTemCli: [{value: "", disabled: true}],
    CodOrdTra: [{value: "", disabled: true}],
    RutaPrenda: [{value: "", disabled: true}],
    TipoTela: [{value: "", disabled: true}],
    CodTalla: [{value: "", disabled: true}],
    Sec: [{value: "", disabled: true}],
    FlgEstado: [''],
    CodModelista: ['', Validators.required],
    NomModelista: ['', Validators.required]
  });

  flgEnable = false;
  idRegistro: number = 0;
  img64: string = "";

  rowData: any[];
  dataMedidas: data_det[] = [];
  cabecera: data[] = [];
  especificaciones: data_esp[] = [];
  dataOperacionModelista: Modelista[] = [];
  filtroOperacionModelista: Observable<Modelista[]> | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaHojaMedidaService: AuditoriaHojaMedidaService,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private SpinnerService: NgxSpinnerService,
    private datepipe: DatePipe,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogEncogimientoPrendaRegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: data
  ) { }

  ngOnInit(): void {
    this.formulario.reset();
    this.formulario.patchValue({
      OP: this.data.Cod_OrdPro,
      NomCliente: this.data.Nom_Cliente,
      CodEstCli: this.data.Cod_EstCli,
      CodVersion: this.data.Cod_Version,
      CodEstPro: this.data.Cod_EstPro,
      EstProVer: this.data.Cod_EstPro ? this.data.Cod_EstPro + ' / ' + this.data.Cod_Version : "",
      NomTemCli: this.data.Nom_TemCli,
      CodOrdTra: this.data.Cod_OrdTra,
      RutaPrenda: this.data.Ruta_Prenda,
      TipoTela: this.data.Tipo_Tela,
      CodTalla: this.data.Cod_Talla,
      Sec: this.data.Sec,
      FlgEstado: this.data.Flg_Estado,
      CodModelista: this.data.Cod_Modelista,
      NomModelista: this.data.Nom_Modelista,
    });

    this.idRegistro = this.data.Id_Registro;
    this.cabecera = [{}];
    this.especificaciones = [{}];

    if(this.idRegistro > 0){
      this.onBuscarOP();
      this.cargaDetalleHojaMedida();

      this.formulario.controls['OP'].disable();
      this.formulario.controls['NomModelista'].disable();

      this.flgEnable = this.data.Flg_Estado == 'F' ? false: true;
    }

    this.cargarOperacionModelista();
  }

  onBuscarOP(){
    let codOrdPro = this.formulario.get('OP')?.value;

    const formData = new FormData();
    formData.append('Accion', 'O');
    formData.append('Id_Registro', '0');
    formData.append('Cod_Fabrica', '001');
    formData.append('Cod_OrdPro', codOrdPro);
    formData.append('Cod_Talla', '');    
    formData.append('Sec', '0');
    formData.append('Cod_Modelista', '');
    formData.append('Flg_Estado', '');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    if (codOrdPro.length == 5) {
      this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProceso(formData)
        .subscribe((result: any) => {
          //console.log(result)
          if (result.length > 0) {
            this.formulario.patchValue({
              NomCliente: result[0].Nom_Cliente,
              CodEstCli: result[0].Cod_EstCli,
              CodEstPro: result[0].Cod_EstPro,
              CodVersion: result[0].Cod_Version,
              EstProVer: result[0].Cod_EstPro + ' / ' + result[0].Cod_Version,
              NomTemCli: result[0].Nom_TemCli,
              CodOrdTra: result[0].Cod_OrdTra,
              CodTalla: result[0].Cod_Talla,
              Sec: '0',  //result[0].Sec,
              RutaPrenda: result[0].Ruta_Prenda,
              TipoTela: result[0].Tipo_Tela
            });

            formData.set("Accion", "E")
            this.listarEspecificaciones(formData);
            this.cabecera = result;
            this.img64 = result[0].Icono1;
            //console.log(this.cabecera)

          } else {
            this.matSnackBar.open('No hay datos en la OP ingresada...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );
    }

  }

  listarEspecificaciones(formData: FormData){
    this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProceso(formData)
      .subscribe((response: any) => {
        this.especificaciones = response;
        console.log("this.especificaciones")
        console.log(this.especificaciones)
    });
  }

  onConfirmarRegistro(formDirective){
    let fecha = new Date();
    let accion = this.idRegistro == 0 ? 'I' : 'U'

    console.log("this.formulario.get('FlgEstado')?.value")
    console.log(this.formulario.get('FlgEstado')?.value)

    const formData = new FormData();
    formData.append('Accion', accion);
    formData.append('Id_Registro', this.idRegistro.toString());
    formData.append('Cod_Fabrica', '001');
    formData.append('Cod_OrdPro', this.formulario.get('OP')?.value);
    formData.append('Cod_Talla', this.formulario.get('CodTalla')?.value);    
    formData.append('Sec', this.formulario.get('Sec')?.value);
    formData.append('Cod_Modelista', this.formulario.get('CodModelista')?.value);
    formData.append('Flg_Estado', this.formulario.get('FlgEstado')?.value);
    formData.append('Fecha_Registro', this.datepipe.transform(fecha, 'yyyy-MM-ddTHH:mm:ss'));
    formData.append('Fecha_Registro2', this.datepipe.transform(fecha, 'yyyy-MM-ddTHH:mm:ss'));
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProceso(formData)
      .subscribe((result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.idRegistro = result[0].Id_Registro;
          this.flgEnable = true;
          this.cargaDetalleHojaMedida();

          this.matSnackBar.open('Proceso correcto..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        } else {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  onFinalizarRegistro(){
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea finalizar la ficha?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        const formData = new FormData();
        formData.append('Accion', 'F');
        formData.append('Id_Registro', this.data.Id_Registro.toString());
        formData.append('Cod_Fabrica', '');
        formData.append('Cod_OrdPro', '');
        formData.append('Cod_Talla', '');
        formData.append('Sec', '0');
        formData.append('Cod_Modelista', '');
        formData.append('Flg_Estado', 'F');
        formData.append('Fecha_Registro', '');
        formData.append('Fecha_Registro2', '');
        formData.append('Cod_Usuario', GlobalVariable.vusu);

        this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProceso(formData)
          .subscribe((result: any) => {        
            if (result[0].Respuesta == 'OK') {
              this.flgEnable = false;
              this.matSnackBar.open('Proceso correcto..!!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            } else {
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );
      }
    });
  }

  cargaDetalleHojaMedida(){
    this.SpinnerService.show();

    this.auditoriaHojaMedidaService.HojaEncogimientoPrendaProceso(
      this.formulario.get('CodEstPro')?.value, 
      this.formulario.get('CodVersion')?.value, 
      this.formulario.get('CodTalla')?.value, 
      this.idRegistro
      ).subscribe((result: any) => {
        if (result.length > 0) {
          this.rowData = result
          const colDefs = this.gGridEmpty.api.getColumnDefs();
          colDefs!.length = 0;
          const keys = Object.keys(result[0]);
          delete keys[0];

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
          this.gGridEmpty.api.setRowData(this.rowData);

          this.SpinnerService.hide();

          this.cargarDetalleMedidas();
          this.cargarOperacionMedida();
        } else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  onCellClicked(e: CellClickedEvent, params): void{
    let numOrden = e.colDef.field.charAt(1);  // Segundo caracter  -> Num_Orden
    let TipProceso = e.colDef.field.charAt(2);  // Tercer caracter  -> Tip_Proceso
    let numMedia = e.colDef.field.substring(4).trim();  // A partir del cuarto caracter -> Num_Medida
    //console.log(e.colDef.field)

    if (this.flgEnable == true) {
      if ((numOrden == '1' || numOrden == '2' || numOrden == '3' || numOrden == '4' || numOrden == '5' || numOrden == '6') && numMedia != "Prom") {        
        let data_det: data_det = {}
        data_det.Id_Registro = this.idRegistro;
        data_det.Des_Medida = e.data.Des_Medida;
        data_det.Sec_Medida = e.data.Sec_Medida;
        data_det.Tip_Proceso = TipProceso;
        data_det.Num_Medida = numMedia.length.toString(),
        data_det.Flg_Estado = this.data.Flg_Estado;        
        
        let dialogRef = this.dialog.open(DialogEncogimientoPrendaMedidasComponent, {
          disableClose: true,
          panelClass: 'my-class',
          data: data_det
        });
              
        dialogRef.afterClosed().subscribe(result => {
          if (result != 'false') {

            params.newValue = result.data
            const focusedCell = params.api.getFocusedCell();
            const column = focusedCell.column.colDef.field;
            const rowNode = params.api.getRowNode(focusedCell.rowIndex);
            rowNode.setDataValue(column, params.newValue);

            params.api.refreshCells({
              force: true,
              columns: [column],
              rowNodes: [params.api.getRowNode(focusedCell.rowIndex)]
            });
            
            this.data.Flg_Estado = result.estado;
            data_det.Valor = result.data;
            data_det.Val_Medida = result.valor;

            this.calcularPromedio(data_det, params)
          }
        });
      } else if(numOrden == '9') {        
        let data_det: data_det = {}
        data_det.Id_Registro = this.idRegistro;
        data_det.Sec_Medida = e.data.Sec_Medida;
        data_det.Tip_Proceso = 'F';
        data_det.Num_Medida = '4';

        let dialogRef = this.dialog.open(DialogEncogimientoPrendaValorComponent, {
          disableClose: true,
          data: {medida: ""}
        });
            
        dialogRef.afterClosed().subscribe(result => {
          if(result && result != ''){
            params.newValue = result;
            const focusedCell = params.api.getFocusedCell();
            const column = ' 9F-Valor';
            const rowNode = params.api.getRowNode(focusedCell.rowIndex);
            rowNode.setDataValue(column, params.newValue)

            params.api.refreshCells({
              force: true,
              columns: [column],
              rowNodes: [params.api.getRowNode(focusedCell.rowIndex)]
            });

            this.registrarPromedio(data_det, result)
          }
        });
      }
    }
  }

  calcularPromedio(data_det: data_det, params){

    let ln_Index = this.dataMedidas.indexOf(this.dataMedidas.find(x => x.Sec_Medida == data_det.Sec_Medida && x.Tip_Proceso == data_det.Tip_Proceso && x.Num_Medida == data_det.Num_Medida));
    if(ln_Index < 0)
      this.dataMedidas.push(data_det);
    else
      this.dataMedidas[ln_Index] = data_det;

    let prom: string = "";
    let i: number = 0;
    let s: number = 0;
    
    this.dataMedidas.filter(x => x.Sec_Medida == data_det.Sec_Medida && x.Tip_Proceso == data_det.Tip_Proceso).forEach(e => {
      if(e.Valor != ""){
        i += 1;
        s += parseFloat(e.Val_Medida.toString());
      }
    });
    
    //console.log(s/i)
    if(s != 0){
      let num = s/i;
      let fraccion = this.devuelveFraccion(Math.abs(num), 0.000001, 20);
      prom = (num > 0 ? '+' : '-') + fraccion;
    } else 
      prom = 'cero'
    
    params.newValue = prom;
    const focusedCell = params.api.getFocusedCell();
    const column = focusedCell.column.colDef.field.substring(0,4).concat("Prom");
    const rowNode = params.api.getRowNode(focusedCell.rowIndex);
    rowNode.setDataValue(column, params.newValue)

    params.api.refreshCells({
      force: true,
      columns: [column],
      rowNodes: [params.api.getRowNode(focusedCell.rowIndex)]
    });
    
    this.registrarPromedio(data_det, prom)
  }

  registrarPromedio(data_det: data_det, prom: string){
    const formData = new FormData();
    formData.append('Accion', 'I');
    formData.append('Id_Registro', this.idRegistro.toString());
    formData.append('Sec_Medida', data_det.Sec_Medida);
    formData.append('Tip_Proceso', data_det.Tip_Proceso);
    formData.append('Num_Medida', '4');
    formData.append('Valor', prom);
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProcesoDetalle(formData)
      .subscribe((result: any) => {
        this.matSnackBar.open("Proceso Correcto..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })        
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    );    
  }

  devuelveFraccion(num: number, epsilon: number, max_iter: number): string{
    let d: number[] = [0, 1];
    let z = num;
    let n = 1;
    let t = 1;

    while(t < max_iter && Math.abs(n/d[t] - num) > epsilon){
        t += 1;
        z = 1/(z - Math.trunc(z));
        d.push(d[t-1] * Math.trunc(z) + d[t-2]);
        //int(x + 0.5) es equivalente a redondear x
        n = Math.trunc(num * d[t] + 0.5);
    }
    
    return (n.toString() + '/' + d[t].toString());

  }

  cargarDetalleMedidas(){
    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Id_Registro', this.idRegistro.toString());
    formData.append('Sec_Medida', '');
    formData.append('Tip_Proceso', '');
    formData.append('Num_Medida', '');
    formData.append('Valor', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProcesoDetalle(formData)
      .subscribe((result: any) => {
        this.dataMedidas = result;
        console.log(this.dataMedidas)
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    );        
  }

  cargarOperacionMedida() {
    GlobalVariable.Arr_Medidas = []
    const formData = new FormData();
    formData.append('Accion', 'M');
    formData.append('Id_Registro', this.idRegistro.toString());
    formData.append('Sec_Medida', '');
    formData.append('Tip_Proceso', '');
    formData.append('Num_Medida', '');
    formData.append('Valor', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);
    
    this.auditoriaHojaMedidaService.MantenimientoEncogimientoPrendaProcesoDetalle(formData)
      .subscribe((result: any) => {
        GlobalVariable.Arr_Medidas = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  cargarOperacionModelista(){
    this.dataOperacionModelista = [];
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento('L', '', '', '', 0, '')
      .subscribe(
        (result: any) => {
          this.dataOperacionModelista = result;
          this.recargarOperacionModelista();
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );
  }
  
  recargarOperacionModelista(){
    this.filtroOperacionModelista = this.formulario.controls['NomModelista'].valueChanges.pipe(
      startWith(''),
      map(option => (option ? this._filterOperacionModelista(option) : this.dataOperacionModelista.slice())),
    );
  }
  
  private _filterOperacionModelista(value: string): Modelista[] {
    this.formulario.controls['CodModelista'].setValue('')
    const filterValue = value.toLowerCase();
    return this.dataOperacionModelista.filter(option => String(option.Cod_Auditor).toLowerCase().indexOf(filterValue ) > -1 || option.Nom_Auditor.toLowerCase().indexOf(filterValue ) > -1);
  }

  seleccionarModelista(option: Modelista){
    this.formulario.controls['CodModelista'].setValue(option.Tip_Trabajador.concat("-").concat(option.Cod_Auditor));
  }

}
