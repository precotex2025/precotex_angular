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
import { DialogAuditoriaHojaMoldeMedidasComponent } from '../dialog-auditoria-hoja-molde-medidas/dialog-auditoria-hoja-molde-medidas.component';

interface data {
  Id_Hoja_Medida?: number;
  Cod_OrdPro?: string;
  Nom_Cliente?: string;
  Cod_Modulo?: string;
  Sec?: number;
  Cod_Auditor?: string;
  Flg_Estado?: string;
  Fecha_Registro?: string;
  Cod_EstPro?: string;
  Cod_EstCli?: string;
  Cod_Cliente?: string;
  Cod_Version?: string;
  Nom_TemCli?: string;
  Cod_ColCli?: string;
  Nom_Auditor?: string;
  Encogimiento?: string;
  ColorPartida?: string;
}

interface data_det {
  Id_Hoja_Medida?: number;
  Des_TipMedida?: string
  Sec_Medida?: string
  Des_Medida?: string
  Cod_Talla?: string
  Num_Medida?: string
  Orden?: string
  Valor?: string
  Flg_Estado?: string;
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

interface Medida {
  Sec: string;
  Des_Molde: string;
  Encogimiento?: string;
  ColorPartida?: string;
}

@Component({
  selector: 'app-dialog-auditoria-hoja-molde-registro',
  templateUrl: './dialog-auditoria-hoja-molde-registro.component.html',
  styleUrls: ['./dialog-auditoria-hoja-molde-registro.component.scss']
})
export class DialogAuditoriaHojaMoldeRegistroComponent implements OnInit {

  @ViewChild('gGridEmpty') gGridEmpty!: AgGridAngular;

  columnDefs0 = [
  ];
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
    EstProVer: [{value: "", disabled: true}],
    CodEstPro: [{value: "", disabled: true}],
    NomTemCli: [{value: "", disabled: true}],
    CodVersion: [{value: "", disabled: true}],
    CodAuditor: ['', Validators.required],
    NomAuditor: ['', Validators.required],
    CodColCli: ['', Validators.required],
    CodModulo: ['', Validators.required],
    Sec: ['', Validators.required],
    Encogimiento: [{value: "", disabled: true}],
    ColorPartida: [{value: "", disabled: true}]
  });

  flgEnable = false;
  idHojaMedida: number = 0;

  rowData: any[];
  dataColorOP: Color[] = [];
  dataMedidaOP: Medida[] = [];
  dataModulo: any[];
  dataOperacionAuditor: Auditor[] = [];
  filtroOperacionAuditor: Observable<Auditor[]> | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private auditoriaHojaMedidaService: AuditoriaHojaMedidaService,
    private auditoriaInspeccionCosturaService: AuditoriaInspeccionCosturaService,
    private SpinnerService: NgxSpinnerService,
    private datepipe: DatePipe,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogAuditoriaHojaMoldeRegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: data
  ) {}

  ngOnInit(): void {
    this.formulario.reset();
    this.formulario.patchValue({
      OP: this.data.Cod_OrdPro,
      NomCliente: this.data.Nom_Cliente,
      CodEstCli: this.data.Cod_EstCli,
      EstProVer: this.data.Cod_EstPro ? this.data.Cod_EstPro + ' / ' + this.data.Cod_Version : "",
      CodEstPro: this.data.Cod_EstPro,
      CodVersion: this.data.Cod_Version,
      NomTemCli: this.data.Nom_TemCli,
      CodAuditor: this.data.Cod_Auditor,
      NomAuditor: this.data.Nom_Auditor,
      CodColCli: this.data.Cod_ColCli,
      CodModulo: this.data.Cod_Modulo,
      Sec: this.data.Sec,
      Encogimiento: this.data.Encogimiento,
      ColorPartida: this.data.ColorPartida
    });

    this.idHojaMedida = this.data.Id_Hoja_Medida;

    if(this.idHojaMedida > 0){
      this.cargaDetalleHojaMedida();
      this.onCargarColorOP(this.data.Cod_OrdPro);
      this.onCargarMedidaOP(this.data.Cod_OrdPro);

      this.formulario.controls['OP'].disable();
      this.formulario.controls['NomAuditor'].disable();
      this.formulario.controls['CodColCli'].disable();
      this.formulario.controls['CodModulo'].disable();
      this.formulario.controls['Sec'].disable();

      this.flgEnable = this.data.Flg_Estado == '2' ? false: true;
    }

    this.cargarOperacionAuditor();
    this.cargarModulo();
      
  }

  onConformarRegistro(formDirective): void{
    let fecha = new Date();
    let accion = this.idHojaMedida == 0 ? 'I' : 'U'
    
    const formData = new FormData();
    formData.append('Accion', accion);
    formData.append('Id_Hoja_Medida', this.idHojaMedida.toString());
    formData.append('Cod_OrdPro', this.formulario.get('OP')?.value);
    formData.append('Cod_ColCli', this.formulario.get('CodColCli')?.value);
    formData.append('Cod_Modulo', this.formulario.get('CodModulo')?.value);
    formData.append('Sec', this.formulario.get('Sec')?.value);
    formData.append('Cod_Auditor', this.formulario.get('CodAuditor')?.value);
    formData.append('Flg_Estado', this.data.Flg_Estado);
    formData.append('Fecha_Registro', this.datepipe.transform(fecha, 'yyyy-MM-ddTHH:mm:ss'));
    formData.append('Fecha_Registro2', this.datepipe.transform(fecha, 'yyyy-MM-ddTHH:mm:ss'));
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    /*this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes(accion, 
      this.idHojaMedida, 
      this.formulario.get('OP')?.value,
      this.formulario.get('CodColCli')?.value,
      this.formulario.get('CodModulo')?.value,
      this.formulario.get('Sec')?.value,
      this.formulario.get('CodAuditor')?.value,
      this.data.Flg_Estado,
      this.datepipe.transform(fecha, 'yyyy-MM-ddTHH:mm:ss'),
      this.datepipe.transform(fecha, 'yyyy-MM-ddTHH:mm:ss')*/
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes(formData)
      .subscribe((result: any) => {
        if (result[0].Respuesta == 'OK') {
          this.idHojaMedida = result[0].Id_Hoja_Medida;
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

  onFinalizarFicha(){
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea finalizar la ficha de medida?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        const formData = new FormData();
        formData.append('Accion', 'F');
        formData.append('Id_Hoja_Medida', this.data.Id_Hoja_Medida.toString());
        formData.append('Cod_OrdPro', '');
        formData.append('Cod_ColCli', '');
        formData.append('Cod_Modulo', '');
        formData.append('Sec', '0');
        formData.append('Cod_Auditor', '');
        formData.append('Flg_Estado', '2');
        formData.append('Fecha_Registro', '');
        formData.append('Fecha_Registro2', '');
        formData.append('Cod_Usuario', GlobalVariable.vusu);

        //this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes('F', this.data.Id_Hoja_Medida, '', '', '', '', '', '2', '', '')
        this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes(formData)
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

  onBuscarOP(){
    let codOrdPro = this.formulario.get('OP')?.value;

    const formData = new FormData();
    formData.append('Accion', 'O');
    formData.append('Id_Hoja_Medida', '0');
    formData.append('Cod_OrdPro', codOrdPro);
    formData.append('Cod_ColCli', '');
    formData.append('Cod_Modulo', '');
    formData.append('Sec', '0');
    formData.append('Cod_Auditor', '');
    formData.append('Flg_Estado', '');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    if (codOrdPro.length == 5) {
      //this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes('O', 0, codOrdPro, '', '', '0' , '', '', '', '')
      this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes(formData)
        .subscribe((result: any) => {
          //console.log(result)
          if (result.length > 0) {
            this.formulario.patchValue({
              NomCliente: result[0].Nom_Cliente,
              CodEstCli: result[0].Cod_EstCli,
              EstProVer: result[0].Cod_EstPro + ' / ' + result[0].Cod_Version,
              CodEstPro: result[0].Cod_EstPro,
              CodVersion: result[0].Cod_Version,
              NomTemCli: result[0].Nom_TemCli
            });

            this.onCargarColorOP(codOrdPro);
            this.onCargarMedidaOP(codOrdPro);
            //this.getHojasMedida();
            //this.MostrarCabeceraCargaMedida()

          } else {
            this.matSnackBar.open('No hay datos con la OP ingresada...', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 });
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );
    }

  }

  cargaDetalleHojaMedida() {
    this.SpinnerService.show();

    this.auditoriaHojaMedidaService.AuditoriaHojaMedidaMoldesTallas(
      this.formulario.get('CodEstPro')?.value, 
      this.formulario.get('CodVersion')?.value, 
      this.formulario.get('OP')?.value, 
      this.formulario.get('Sec')?.value, 
      this.idHojaMedida)
      .subscribe((result: any) => {
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
          this.cargarOperacionMedida();
        } else {
          this.matSnackBar.open("No existen registros..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.SpinnerService.hide();
        }

      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }

  cargarOperacionMedida() {
    GlobalVariable.Arr_Medidas = []
    const formData = new FormData();
    formData.append('Accion', 'M');
    formData.append('Id_Hoja_Medida', this.idHojaMedida.toString());
    formData.append('Des_TipMedida', '');
    formData.append('Sec_Medida', '');
    formData.append('Cod_Talla', '');
    formData.append('Num_Medida', '');
    formData.append('Valor', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);
    
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldesDetalle(formData)
      .subscribe((result: any) => {
        GlobalVariable.Arr_Medidas = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      }))
  }

  onCellClicked(e: CellClickedEvent, params): void{

    //console.log('cellClicked', e);
    let ultimoCaracter = e.colDef.field.charAt(e.colDef.field.length - 1)

    if (this.flgEnable == true) {
      if (ultimoCaracter == '1' || ultimoCaracter == '2' || ultimoCaracter == '3' || ultimoCaracter == '4' || ultimoCaracter == '5') {
        let data_det: data_det = {}
        data_det.Id_Hoja_Medida = this.idHojaMedida;
        data_det.Des_TipMedida = e.data.Des_TipMedida;
        data_det.Des_Medida = e.data.Des_Medida;
        data_det.Sec_Medida = e.data.Sec_Medida;
        data_det.Cod_Talla = e.colDef.field;
        data_det.Num_Medida = ultimoCaracter;
        data_det.Flg_Estado = this.data.Flg_Estado;
        //data_det.Orden = e.data.Orden

        let dialogRef = this.dialog.open(DialogAuditoriaHojaMoldeMedidasComponent, {
          disableClose: true,
          panelClass: 'my-class',
          data: data_det
        });
          
        dialogRef.afterClosed().subscribe(result => {
          console.log(result)
          if (result != 'false') {
            params.newValue = result.data
            const focusedCell = params.api.getFocusedCell();
            const column = focusedCell.column.colDef.field;
            const rowNode = params.api.getRowNode(focusedCell.rowIndex);
            rowNode.setDataValue(column, params.newValue)
            
            params.api.refreshCells({
              force: true,
              columns: [column],
              rowNodes: [params.api.getRowNode(focusedCell.rowIndex)]
            });

            this.data.Flg_Estado = result.estado;
          }
        });
      } 
    }
  }

  onCargarColorOP(codOrdPro: string){
    const formData = new FormData();
    formData.append('Accion', 'C');
    formData.append('Id_Hoja_Medida', '0');
    formData.append('Cod_OrdPro', codOrdPro);
    formData.append('Cod_ColCli', '');
    formData.append('Cod_Modulo', '');
    formData.append('Sec', '0');
    formData.append('Cod_Auditor', '');
    formData.append('Flg_Estado', '');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    //this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes('C', 0, codOrdPro, '', '', '0' , '', '', '', '')
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes(formData)
      .subscribe((result: any) => {
        console.log(result)
        if (result.length > 0) {
          this.dataColorOP = result;
        } else {
          this.dataColorOP = [];
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  onCargarMedidaOP(codOrdPro: string){
    const formData = new FormData();
    formData.append('Accion', 'H');
    formData.append('Id_Hoja_Medida', '0');
    formData.append('Cod_OrdPro', codOrdPro);
    formData.append('Cod_ColCli', '');
    formData.append('Cod_Modulo', '');
    formData.append('Sec', '0');
    formData.append('Cod_Auditor', '');
    formData.append('Flg_Estado', '');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    //this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes('H', 0, codOrdPro, '', '', '0' , '', '', '', '')
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes(formData)
      .subscribe((result: any) => {
        //console.log(result)
        if (result.length > 0) {
          this.dataMedidaOP = result;
        } else {
          this.dataMedidaOP = [];
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  cargarModulo(){
    const formData = new FormData();
    formData.append('Accion', 'M');
    formData.append('Id_Hoja_Medida', '0');
    formData.append('Cod_OrdPro', '');
    formData.append('Cod_ColCli', '');
    formData.append('Cod_Modulo', '');
    formData.append('Sec', '0');
    formData.append('Cod_Auditor', '');
    formData.append('Flg_Estado', '');
    formData.append('Fecha_Registro', '');
    formData.append('Fecha_Registro2', '');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    //this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes('M', 0, '', '', '', '0' , '', '', '', '')
    this.auditoriaHojaMedidaService.MantenimientoAuditoriaHojaMedidaMoldes(formData)
      .subscribe((result: any) => {
        //console.log(result)
        if (result.length > 0) {
          this.dataModulo = result;
        } else {
          this.dataModulo = [];
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  cargarOperacionAuditor(){
    this.dataOperacionAuditor = [];
    this.auditoriaInspeccionCosturaService.MantenimientoAuditoriaInspeccionCosturaComplemento('L', '', '', '', 0, '')
      .subscribe(
      (result: any) => {
        this.dataOperacionAuditor = result;
        this.recargarOperacionAuditor();
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
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
    this.formulario.controls['CodAuditor'].setValue(option.Tip_Trabajador.concat("-").concat(option.Cod_Auditor));
  }

  seleccionarHojaMedida(option: Medida){
    this.formulario.controls['Encogimiento'].setValue(option.Encogimiento);
    this.formulario.controls['ColorPartida'].setValue(option.ColorPartida);
  }

}
