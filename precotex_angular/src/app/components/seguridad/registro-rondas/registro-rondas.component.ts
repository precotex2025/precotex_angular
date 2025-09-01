import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { DialogRegistoOcurrenciaComponent } from './dialog-registo-ocurrencia/dialog-registo-ocurrencia.component';
import { DialogConfirmacion2Component} from 'src/app/components/dialogs/dialog-confirmacion2/dialog-confirmacion2.component';
import { DialogEliminarComponent} from 'src/app/components/dialogs/dialog-eliminar/dialog-eliminar.component'

import { GlobalVariable } from 'src/app/VarGlobals';
import { SeguridadRondasService } from 'src/app/services/seguridad-rondas.service';
import { EventosService } from 'src/app/services/eventos.service';
import { SeguridadControlVehiculoService } from 'src/app/services/seguridad-control-vehiculo.service';
import { ExceljsService } from 'src/app/services/exceljs.service';

@Component({
  selector: 'app-registro-rondas',
  templateUrl: './registro-rondas.component.html',
  styleUrls: ['./registro-rondas.component.scss']
})
export class RegistroRondasComponent implements OnInit {

  formulario = this.formBuilder.group({
    Id_Ronda: [0],
    Id_Planta: [0, Validators.required],
    Fec_Inicio: [{value: new Date, disabled: true}],
    Cod_Agente: ["", Validators.required],
    Fec_Fin: [{value: new Date, disabled: true}],
    Flg_Estado: ["P"],
    Flg_Activo: [1],
    Cod_Usuario: [""]
  });

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  dataPlanta: any[];
  dataAgente: any[];

  planta: number = 1;
  fecha = new Date();

  ll_listado: boolean = true;
  ll_lista: boolean = false;
  ll_inicio: boolean = true;
  ll_fin: boolean = true;

  selected = new FormControl(0);
  dataForExcel = [];
  displayedColumns1: string[] = ['Des_Planta','Fec_Inicio','Fec_Fin','Nom_Agente','Flg_Estado','Acciones']
  displayedColumns2: string[] = ['Fec_Ocurrencia','Des_Area','Des_TipoEstandar','Des_Estandar','Des_Riesgo','Nom_Responsable','Des_Ocurrencia','Acciones']
  displayedColumns3: string[] = ['Fec_Ocurrencia','Des_Planta','Des_Area','Des_TipoEstandar','Des_Estandar','Des_Riesgo','Nom_Responsable','Des_Ocurrencia','Des_Accion','Nom_Agente','Flg_Estado','Acciones']
  
  dataSource1: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;
  dataSource3!: MatTableDataSource<any>;

  @ViewChild('sortData1') sortData1 = new MatSort();
  @ViewChild('sortData2') sortData2 = new MatSort();
  @ViewChild('sortData3') sortData3 = new MatSort();

  @ViewChild('paginatorData1') paginatorData1!: MatPaginator;
  @ViewChild('paginatorData2') paginatorData2!: MatPaginator;
  @ViewChild('paginatorData3') paginatorData3!: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private spinnerService: NgxSpinnerService,
    private seguridadRondasService: SeguridadRondasService,
    private seguridadControlVehiculoService: SeguridadControlVehiculoService,
    private eventosService: EventosService,
    private datePipe: DatePipe,
    private exceljsService: ExceljsService    
  ) {
    this.range.controls['start'].setValue(new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate()));
    this.range.controls['end'].setValue(new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate()));
    this.dataSource1 = new MatTableDataSource();
  }

  ngOnInit(): void {
    //console.log(this.range.get('start')?.value)
    this.validarCRUDUsuario(226);
    this.listarPlantas();
    this.listarAgentes();
  }

  onListarRondas(){
    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Id_Ronda', '0');
    formData.append('Id_Planta', this.planta.toString());
    formData.append('Fec_Inicio', this.fecha ? this.datePipe.transform(this.fecha, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Cod_Agente', '');
    formData.append('Fec_Fin', this.fecha ? this.datePipe.transform(this.fecha, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Flg_Estado', '');
    formData.append('Flg_Activo', '1');
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.spinnerService.show();
    this.seguridadRondasService.registroRondas(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.dataSource1 = new MatTableDataSource(result);
          this.dataSource1.paginator = this.paginatorData1;
          this.dataSource1.sort = this.sortData1;

          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource1 = new MatTableDataSource([]);
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }  

  onInsertarRegistro(){
    let agente: any = [];

    agente = this.dataAgente.filter(d => d.Codigo == GlobalVariable.vtiptra.trim().concat(GlobalVariable.vcodtra.trim()));

    this.formulario.reset();
    this.formulario.patchValue({
      Id_Ronda: 0,
      Id_Planta: 1,
      Fec_Inicio: '',
      Cod_Agente: agente.length > 0 ? agente[0].Codigo : '',
      Fec_Fin: '', // this.datePipe.transform(new Date(1900,0,1), 'yyyy-MM-ddTHH:mm:ss'),
      Flg_Estado: "P",
      Flg_Activo: 1,
      Cod_Usuario: GlobalVariable.vusu  
    });

    this.ll_listado = false;
    this.ll_inicio = true;
    this.ll_fin = false;

    this.formulario.controls['Id_Planta'].enable();
    this.formulario.controls['Cod_Agente'].enable();
    this.dataSource2 = new MatTableDataSource([]);
  }

  onEditarRegistro(data: any){
    this.ll_listado = false;

    this.formulario.reset();
    this.formulario.patchValue({
      Id_Ronda: data.Id_Ronda,
      Id_Planta: data.Id_Planta,
      Fec_Inicio: data.Fec_Inicio,
      Cod_Agente: data.Cod_Agente,
      Fec_Fin: data.Fec_Fin ? data.Fec_Fin : '',
      Flg_Estado: data.Flg_Estado,
      Flg_Activo: data.Flg_Activo,
      Cod_Usuario: GlobalVariable.vusu      
    });

    //console.log(data)
    this.ll_inicio = false;
    this.ll_fin = data.Fec_Fin ? false : true;

    this.formulario.controls['Id_Planta'].disable();
    this.formulario.controls['Cod_Agente'].disable();
    this.onListarOcurrencia(data.Id_Ronda);
  }

  onAnularRegistro(idRonda: number){
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        const formData = new FormData();
        formData.append('Accion', 'D');
        formData.append('Id_Ronda', idRonda.toString());
        formData.append('Id_Planta', '0');
        formData.append('Fec_Inicio', '');
        formData.append('Cod_Agente', '');
        formData.append('Fec_Fin', '');
        formData.append('Flg_Estado', '');
        formData.append('Flg_Activo', '0');
        formData.append('Cod_Usuario', GlobalVariable.vusu);

        this.spinnerService.show();
        this.seguridadRondasService.registroRondas(formData)
          .subscribe((result: any) => {
            if (result.length > 0) {
              this.onListarRondas();
              this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
              this.spinnerService.hide();
            }else{
              this.matSnackBar.open('Error en anular el registro!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            }
          },
          (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        );        
      }
    });

  }

  onExportarRegistro(){}

  onListarOcurrencia(idRonda: number){
    const formData = new FormData();
    formData.append('Accion', 'C');
    formData.append('Id_Ocurrencia', '0');
    formData.append('Id_Ronda', idRonda.toString());
    formData.append('Fec_Ocurrencia', '');
    formData.append('Id_Area', '0');
    formData.append('Id_Estandar', '0');
    formData.append('Des_Lugar', '');
    formData.append('Cod_ResArea', '');
    formData.append('Cod_Responsable', '');
    formData.append('Tip_Riesgo', '0');
    formData.append('Des_Ocurrencia', '');
    formData.append('Des_Accion', '');
    formData.append('Evidencia_1', '');
    formData.append('Evidencia_2', '');
    formData.append('Fec_Ocurrencia2', '');
    formData.append('Flg_Activo', '1');
    formData.append('Usu_Registro', GlobalVariable.vusu);

    this.spinnerService.show();
    this.seguridadRondasService.registroOcurrencias(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.dataSource2 = new MatTableDataSource(result);
          this.dataSource2.paginator = this.paginatorData2;
          this.dataSource2.sort = this.sortData2;

          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource2 = new MatTableDataSource([]);
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  onIniciarRonda(){
    this.formulario.controls['Fec_Inicio'].setValue(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    this.onGuardarRonda('I')
  }

  onTerminarRonda(){
    let dialogRef = this.dialog.open(DialogConfirmacion2Component, { disableClose: true, data: { TELA: "Desea finalizar la Ronda?" } });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        this.formulario.controls['Fec_Fin'].setValue(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
        this.onGuardarRonda('U')
      }
    });
  
  }

  onGuardarRonda(accion: string){
    const formValues = this.formulario.getRawValue();
    const formData = new FormData();
    formData.append('Accion', accion);
    formData.append('Id_Ronda', formValues.Id_Ronda);
    formData.append('Id_Planta', formValues.Id_Planta);
    formData.append('Fec_Inicio', formValues.Fec_Inicio);
    formData.append('Cod_Agente', formValues.Cod_Agente);
    formData.append('Fec_Fin', formValues.Fec_Fin);
    formData.append('Flg_Estado', accion == 'I' ? 'P' : 'F');
    formData.append('Flg_Activo', formValues.Flg_Activo);
    formData.append('Cod_Usuario', GlobalVariable.vusu);

    this.spinnerService.show();
    this.seguridadRondasService.registroRondas(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          if(result[0].Id_Registro != 0){
            this.ll_inicio = false;
            this.ll_fin = formValues.Fec_Fin ? false : true;
            this.formulario.controls['Id_Ronda'].setValue(result[0].Id_Registro);
          }

          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
        } else {
          this.matSnackBar.open('Error en el inicio de ronda!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }

  onInsertarOcurrencia(){
    let ocurrencia: any = {Accion: 'I', Id_Ocurrencia: 0, Id_Ronda: this.formulario.get('Id_Ronda')?.value, Id_Planta: this.formulario.get('Id_Planta')?.value, Fec_Ocurrencia: new Date(), Flg_Estado: 'P', Flg_Activo: 1, Usu_Registro: GlobalVariable.vusu};

    let dialogRef = this.dialog.open(DialogRegistoOcurrenciaComponent, {
      disableClose: true,
      width: "100vw",
      height: "95vh",
      data: ocurrencia
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        ocurrencia = result;

        this.onGuardarOcurrencia(ocurrencia);
        
      }
    });
  }

  onEditarOcurrencia(ocurrencia: any){
    ocurrencia.Accion = this.ll_fin ? 'U' : '';

    let dialogRef = this.dialog.open(DialogRegistoOcurrenciaComponent, {
      disableClose: true,
      width: "100vw",
      height: "95vh",
      data: ocurrencia
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        ocurrencia = result;

        this.onGuardarOcurrencia(ocurrencia);
      }
    });
  }

  onAnularOcurrencia(ocurrencia: any){
    let dialogRef = this.dialog.open(DialogEliminarComponent, { disableClose: true, data: {} });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'true') {
        ocurrencia.Accion = 'D';
        //console.log(ocurrencia)
        this.onGuardarOcurrencia(ocurrencia);
      }
    });

  }

  onGuardarOcurrencia(ocurrencia: any){
    const formData = new FormData();
    formData.append('Accion', ocurrencia.Accion);
    formData.append('Id_Ocurrencia', ocurrencia.Id_Ocurrencia.toString());
    formData.append('Id_Ronda', ocurrencia.Id_Ronda.toString());
    formData.append('Fec_Ocurrencia', this.datePipe.transform(ocurrencia.Fec_Ocurrencia, 'yyyy-MM-ddTHH:mm:ss'));
    formData.append('Id_Area', ocurrencia.Id_Area.toString());
    formData.append('Id_Estandar', ocurrencia.Id_Estandar.toString());
    formData.append('Des_Lugar', ocurrencia.Des_Lugar);
    formData.append('Cod_ResArea', ocurrencia.Cod_ResArea);
    formData.append('Cod_Responsable', ocurrencia.Cod_Responsable);
    formData.append('Tip_Riesgo', ocurrencia.Tip_Riesgo);
    formData.append('Des_Ocurrencia', ocurrencia.Des_Ocurrencia);
    formData.append('Des_Accion', ocurrencia.Des_Accion);
    formData.append('Evidencia_1', ocurrencia.Evidencia_1);
    formData.append('Evidencia_2', ocurrencia.Evidencia_2);
    formData.append('Fec_Ocurrencia2', '');
    formData.append('Flg_Activo', ocurrencia.Flg_Activo);
    formData.append('Usu_Registro', GlobalVariable.vusu);
    
    this.spinnerService.show();
    this.seguridadRondasService.registroOcurrencias(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.onListarOcurrencia(ocurrencia.Id_Ronda);
          this.spinnerService.hide();
        } else {
          this.matSnackBar.open('Error en el registro de ocurrencia!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  onCerrarRonda(){
    this.ll_listado = true;
    this.onListarRondas();
  }

  onExportarRonda(){
    this.dataForExcel = [];
    if(this.dataSource3.filteredData.length > 0){
      let dataReporte: any[] = [];

      this.dataSource3.filteredData.forEach((row: any) => {
        let data: any = {};

        data.FechaOcurrencia = row.Fec_Ocurrencia;
        data.Planta = row.Des_Planta;
        data.Area = row.Des_Area;
        data.Lugar = row.Des_Lugar;
        data.TipoEstandar = row.Des_TipoEstandar;
        data.ActoCondicion = row.Des_Estandar;
        data.Riesgo = row.Des_Riesgo;
        data.Nom_ResponsableArea = row.Nom_ResArea;
        data.Responsable = row.Nom_Responsable;
        data.Descripcion = row.Des_Ocurrencia;
        data.Accion = row.Des_Accion;
        data.Agente = row.Nom_Agente;
        data.Estado = row.Flg_Estado == 'P' ? 'PROCESO' : 'FINALIZADO';
        
        dataReporte.push(data);
      });      

      dataReporte.forEach((row: any) => {
        this.dataForExcel.push(Object.values(row))
      })

      let reportData = {
        title: 'REGISTRO DE OCURRENCIAS DE RONDAS',
        data: this.dataForExcel,
        headers: Object.keys(dataReporte[0])
      }

      this.exceljsService.exportExcel(reportData);

    } else{
      this.matSnackBar.open("No existen registros...!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }    
  }

  onListarOcurrencias(){
    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Id_Ocurrencia', '0');
    formData.append('Id_Ronda', '0');
    formData.append('Fec_Ocurrencia', this.range.get('start')?.value ? this.datePipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Id_Area', this.planta.toString());
    formData.append('Id_Estandar', '0');
    formData.append('Des_Lugar', '');
    formData.append('Cod_ResArea', '');
    formData.append('Cod_Responsable', '');
    formData.append('Tip_Riesgo', '0');
    formData.append('Des_Ocurrencia', '');
    formData.append('Des_Accion', '');
    formData.append('Evidencia_1', '');
    formData.append('Evidencia_2', '');
    formData.append('Fec_Ocurrencia2', this.range.get('end')?.value ? this.datePipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Flg_Activo', '1');
    formData.append('Usu_Registro', GlobalVariable.vusu);

    this.spinnerService.show();
    this.seguridadRondasService.registroOcurrencias(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          console.log(result)
          this.dataSource3 = new MatTableDataSource(result);
          this.dataSource3.paginator = this.paginatorData3;
          this.dataSource3.sort = this.sortData3;

          this.spinnerService.hide();
        }else{
          this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource3 = new MatTableDataSource([]);
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );    
  }

  listarPlantas(){
    let plantas: any[];
    this.dataPlanta = [{Id_Planta: 0, des_planta: 'TODAS', num_planta: "00"}]

    this.eventosService.listaPlantaEventos()
      .subscribe((response) => {
        plantas = response;
        this.dataPlanta = this.dataPlanta.concat(plantas);

        this.onListarRondas();
      });
  }

  listarAgentes(){
    this.seguridadRondasService.listarOperarioAreas('001','000040')
      .subscribe((response) => {
        this.dataAgente = response;
      });
  }

  validarCRUDUsuario(Cod_Opcion: number){
    let crud: any = [];
    this.seguridadControlVehiculoService.seg_crud_opcion_usuario(GlobalVariable.empresa, GlobalVariable.vCod_Rol, Cod_Opcion, GlobalVariable.vusu)
      .subscribe((res) => {
        crud = res;

        if(crud.length > 0){
          this.ll_lista = crud[0].Flg_Verificar == 1 ? true : false;
        } else {
          //this.formulario.patchValue({
          //  Cod_Agente: GlobalVariable.vtiptra.trim().concat(GlobalVariable.vcodtra.trim())
          //});          
          this.formulario.controls['Cod_Agente'].setValue(GlobalVariable.vtiptra.trim().concat(GlobalVariable.vcodtra.trim()))
          this.formulario.controls['Cod_Agente'].disable()
        }

        //if(!this.ll_planta)
        //  this.formulario.controls['Id_Planta'].disable()
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }
}
