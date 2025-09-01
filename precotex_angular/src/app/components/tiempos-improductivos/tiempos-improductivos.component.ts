import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabGroup } from '@angular/material/tabs';
import * as moment from 'moment';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
//import { DialogTiemposImproductivosComponent } from '../tiempos-improductivos/dialog-tiempos-improductivos/dialog-tiempos-improductivos.component';
import { startWith, map,Observable } from 'rxjs';

import { TiemposImproductivosService } from '../../services/tiempos-improductivos.service';
import { GlobalVariable } from '../../VarGlobals'; //<==== this one
import { DialogTiemposImproductivosComponent } from './dialog-tiempos-improductivos/dialog-tiempos-improductivos.component';
import { DialogModificaTiemposImproductivosComponent } from './dialog-modifica-tiempos-improductivos/dialog-modifica-tiempos-improductivos.component';

import { ExcelService } from 'src/app/services/excel.service';
import { ExceljsService } from 'src/app/services/exceljs.service';


interface maquinas {
  Codigo: string,
  Descripcion: string,
}




interface data_det {
  Accion: string,
  Fec_Registro: string,
  Cod_Maquina: string,
  Nro_DocIde: string,
  Cod_Motivo: string,
  Fec_Hora_Inicio: string,
  Fec_Hora_Fin: string,
  Observacion: string,
  Cod_Usuario: string,
  Fec_Registro1: string,
  Fec_Registro2: string,
}



@Component({
  selector: 'app-tiempos-improductivos',
  templateUrl: './tiempos-improductivos.component.html',
  styleUrls: ['./tiempos-improductivos.component.scss']
})
export class TiemposImproductivosComponent implements OnInit {
  mask_cod_ordtra = [/[A-Z-0-9]/i, /\d/, /\d/, /\d/, /\d/];

  listar_operacionConductor:  maquinas[] = [];
  filtroOperacionConductor:   Observable<maquinas[]> | undefined;

  Fec_Registro1="";
  Fec_Registro2="";

  //* Declaramos formulario para obtener los controles */
  formulario = this.formBuilder.group({
    fec_registro1: [new Date()],
    fec_registro2: [new Date()],
    fec_registro: [''],
    cod_ordtra:   [''],
    Cod_Maquina:[''],
  })

  dataForExcel = [];

  public data_det = [{
    Cod_Motivo:"",
    Cod_Trabajador_Tejedor:"",
    Cod_Usuario:"",
    Des_Maquina_Tejeduria:"",
    Des_Motivo:"",
    Fec_Creacion:"",
    Fec_Hora_Fin:"",
    Fec_Hora_Inicio:"",
    Fec_Registro:"",
    Fec_Registro1:"",
    Fec_Registro2:"",
    Nombres:"",
    Observacion:""
  }]



  //displayedColumns_cab: string[] = ['Fec_Registro','Cod_Maquina','Des_Maquina_Tejeduria','Tip_Trabajador_Tejedor','Cod_Trabajador_Tejedor','Nombres','Cod_Motivo','Des_Motivo','Fec_Hora_Inicio','Fec_Hora_Fin','Observacion','Fec_Creacion','Cod_Usuario']
  //dataSource: MatTableDataSource<data_det>;
  //columnsToDisplay: string[] = this.displayedColumns_cab.slice();

  displayedColumns: string[] = ['Fec_Registro','Cod_Maquina','Des_Maquina_Tejeduria','Tip_Trabajador_Tejedor','Cod_Trabajador_Tejedor','nodoc','Nombres','Cod_Motivo',  'Des_Motivo','Fec_Hora_Inicio','Fec_Hora_Fin','Observacion','Fec_Creacion','Cod_Usuario','Acciones','Accion_Borrar']
  dataSource: MatTableDataSource<data_det>;
  /*columnsToDisplay: string[] = this.displayedColumns.slice();
  clickedRows = new Set<data_det>();*/



  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private SpinnerService: NgxSpinnerService,
    private excelService:ExcelService,
    private exceljsService:ExceljsService,
    private despachoTelaCrudaService: TiemposImproductivosService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    // this.formulario = new FormGroup({
    //   'Fec_Registro': new FormControl(''),
    //   'Cod_Maquina': new FormControl(''),
    //  });

    GlobalVariable.num_movdespacho = '';
    this.CargarMaquinas();
    this.CargarLista();

  }

  pasarfecha() {
    this.Fec_Registro1=this.formulario.get('fec_registro1')?.value;
    this.formulario.get('fec_registro1').setValue(this.Fec_Registro1);
    //this.formulario.get('fec_registro').disable();
  }

  CargarLista() {
    //this.SpinnerService.show();
    let fec_despacho1 = this.formulario.value['fec_registro1'];
    fec_despacho1 = moment(fec_despacho1).format('DD-MM-YYYY');

    let fec_despacho2 = this.formulario.value['fec_registro2'];
    fec_despacho2 = moment(fec_despacho2).format('DD-MM-YYYY');

    console.log(fec_despacho1);

    this.despachoTelaCrudaService.ListarDespachoService(fec_despacho1, fec_despacho2, this.formulario.get('Cod_Maquina')?.value).subscribe(
        (result: any) => {
          //this.data_det = result
          this.dataSource.data = result
          //console.log(this.data_det);
          console.log(this.dataSource.data);
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
  }


  

  generateExcel() {   

    this.SpinnerService.show();
    let fec_despacho1 = this.formulario.value['fec_registro1'];
    fec_despacho1 = moment(fec_despacho1).format('DD-MM-YYYY');

    let fec_despacho2 = this.formulario.value['fec_registro2'];
    fec_despacho2 = moment(fec_despacho2).format('DD-MM-YYYY');

    this.despachoTelaCrudaService.ExportarExcel(fec_despacho1, fec_despacho2,  this.formulario.get('Cod_Maquina')?.value).subscribe(
      (result: any) => {
          console.log(result[0].Respuesta)
  
          this.dataForExcel = [];
          result.forEach((row: any) => {
            this.dataForExcel.push(Object.values(row)) 
          })
      
          let reportData = {
            title: 'REPORTE DE TIEMPOS IMPRODUCTIVOS',
            data: this.dataForExcel,
            headers: Object.keys(result[0])
          }
      
          this.exceljsService.exportExcel(reportData);
          this.dataForExcel = []
          this.SpinnerService.hide();


        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
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



  CargarMaquinas() {
    this.despachoTelaCrudaService.mantenimientoConductorService().subscribe(
      (result: any) => {
        this.listar_operacionConductor = result
        console.log(this.listar_operacionConductor);
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }


  openDialog() {

    let fec_despacho = this.formulario.value['Fec_Registro'];
    fec_despacho = moment(fec_despacho).format('YYYY-MM-DDTHH:mm:ss');

    console.log(fec_despacho);

      let dialogRef = this.dialog.open(DialogTiemposImproductivosComponent, {
        disableClose: true,
        data: {sFec_Registro: fec_despacho, cod_maquina: this.formulario.get('Cod_Maquina')?.value}
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result == 'false') {
          //this.CargarOperacionConductor()
        // this.MostrarCabeceraVehiculo()
        }

      })

    }

    openDialogModificar(sFec_Registro: string, cod_maquina: string, cod_motivo: string,finicio: string, ffin: string, observaciones: string, titulo: string , Fec_Creacion: string) {

    let dialogRef = this.dialog.open(DialogModificaTiemposImproductivosComponent, {
     disableClose: true,
     data: {sFec_Registro: sFec_Registro, cod_maquina: cod_maquina, cod_motivo: cod_motivo, finicio: finicio, ffin: ffin,observaciones:observaciones,Titulo:titulo, sFec_Creacion:Fec_Creacion}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.CargarLista()
        if (result == 'false') {
          // this.CargarOperacionConductor()
          // this.MostrarCabeceraVehiculo()
        }
      })
   }

  EliminarRegistro(sFec_Registro: string, cod_maquina: string, cod_motivo: string,finicio: string, ffin: string,dni: string, Fec_Creacion:  string) {
    if(confirm("Desea Eliminar este registro?")) {
      console.log("Implement delete functionality here");
      this.despachoTelaCrudaService.eliminarTiempoimproductivo(
        sFec_Registro,
        cod_maquina,
        cod_motivo,
        finicio,
        ffin,
        dni, 
        Fec_Creacion
      ).subscribe(
        (result: any) => {
          if (result[0].Respuesta == 'OK') {
            //this.MostrarCabeceraConductor()
            this.CargarLista()
            this.matSnackBar.open('El registro se elimino correctamente!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          } else {
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', {
              duration: 1500,
            })
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        }))
    }
  }

  









}
