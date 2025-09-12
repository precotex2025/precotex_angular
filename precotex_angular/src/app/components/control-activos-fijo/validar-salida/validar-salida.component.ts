import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
import { DatePipe } from "@angular/common";
import * as _moment from 'moment';

import { ControlActivoFijoService } from 'src/app/services/control-activo-fijo.service';
import { EventosService } from 'src/app/services/eventos.service';
import { GlobalVariable } from 'src/app/VarGlobals';

@Component({
  selector: 'app-validar-salida',
  templateUrl: './validar-salida.component.html',
  styleUrls: ['./validar-salida.component.scss']
})
export class ValidarSalidaComponent implements OnInit {

  formulario = this.formBuilder.group({
      Id_Registro: [0],
      Fec_Registro: [new Date],
      Fec_Registro2: [new Date],
      Cod_Activo_Fijo: [{value: 0, disabled: true}],
      Dni_Responsable: ['', Validators.minLength(8)],
      Num_Planta_Origen: [0, Validators.required],
      Num_Planta_Destino: [0, Validators.required],
      Usu_Registro: [{value: "", disabled: true}],
      Nom_Responsable: [{value: "", disabled: true}]
    },{
    validators: this.validarTrabajador
  });

  dataPlantaOrigen: any[];
  dataPlantaDestino: any[];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  regSalida: boolean = false;
  codActivoFijo: string = "";
  planta: number = 1;
  fecha = new Date();

  displayedColumns1: string[] = ['Cod_Activo','Descripcion','Nom_Marca','Nom_Modelo', 'Num_Serie_Equipo', 'Nom_Area', 'Nom_Responsable','Flg_Salida','Acciones']
  displayedColumns2: string[] = ['Fec_Registro','Cod_Activo','Descripcion','Nom_Marca','Nom_Modelo','Num_Serie_Equipo','Nom_Area','Planta_Origen','Planta_Destino','Nom_Responsable','Usu_Registro']

  dataSource1: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;
  
  @ViewChild('sortData1') sortData1 = new MatSort();
  @ViewChild('sortData2') sortData2 = new MatSort();
  
  @ViewChild('paginatorData1') paginatorData1!: MatPaginator;
  @ViewChild('paginatorData2') paginatorData2!: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private datePipe: DatePipe,
    private spinnerService: NgxSpinnerService,
    private eventosService: EventosService,
    private controlActivoFijoService: ControlActivoFijoService
  ) {
    this.dataSource1 = new MatTableDataSource();
    this.range.controls['start'].setValue(new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate()));
    this.range.controls['end'].setValue(new Date(this.fecha.getFullYear(), this.fecha.getMonth(), this.fecha.getDate()));
  }

  ngOnInit(): void {
   this.listarPlantas();
   this.onListarSalidas();
  }

  onBuscarActivo(){
    if (this.codActivoFijo.length >= 7){
      this.spinnerService.show();
      this.controlActivoFijoService.valActivosFijo(this.codActivoFijo)
        .subscribe((result: any) => {
          if (result.length > 0) {
            this.dataSource1 = new MatTableDataSource(result);
            this.spinnerService.hide();
          }else{
            this.dataSource1.data = [];
            this.matSnackBar.open('No se encontro registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
            this.spinnerService.hide();
          }
        },
        (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      );

    }

  }

  limpiarValor() {
    this.codActivoFijo = '';
    this.dataSource1.data = [];
    this.regSalida = false;
    this.formulario.reset();
    this.formulario.controls['Nom_Responsable'].setValue('');
  }

  onRegistraSalida(data: any){
    let planta: any[];

    planta = this.dataPlantaOrigen.filter(d=> d.Cod_Establecimiento == data.Cod_Establecimiento);
    this.regSalida = true;
    this.formulario.controls['Cod_Activo_Fijo'].setValue(data.Cod_Activo_Fijo);
    this.formulario.controls['Num_Planta_Origen'].setValue(planta[0].Id_Planta);
    this.filtrarPlantas(planta[0].Cod_Establecimiento);
  }

  filtrarPlantas(idPlanta: any){
    this.dataPlantaDestino = this.dataPlantaOrigen.filter(d=> d.Id_Planta != idPlanta);
  }

  listarPlantas(){
    this.eventosService.listaPlantaEventos()
      .subscribe((response) => {
        this.dataPlantaOrigen = response;
        this.dataPlantaDestino = response;
      });
  }

  onListarSalidas(){
    let fecha = new Date();
    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Id_Registro', '0');
    formData.append('Fec_Registro', this.range.get('start')?.value ? this.datePipe.transform(this.range.get('start')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Fec_Registro2', this.range.get('start')?.value ? this.datePipe.transform(this.range.get('end')?.value, 'yyyy-MM-ddTHH:mm:ss') : '');
    formData.append('Cod_Activo_Fijo', '0');
    formData.append('Dni_Responsable', '');
    formData.append('Num_Planta_Origen', this.planta.toString());
    formData.append('Num_Planta_Destino', '0');
    formData.append('Usu_Registro', GlobalVariable.vusu);

    this.spinnerService.show();
    this.controlActivoFijoService.manRegistroSalidas(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {

          this.dataSource2 = new MatTableDataSource(result);
          this.dataSource2.paginator = this.paginatorData2;
          this.dataSource2.sort = this.sortData2;
          
          this.spinnerService.hide();
        } else {
          this.dataSource2 = new MatTableDataSource([]);
          this.matSnackBar.open('No existen registros!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );    
  }

  onSubmit(){
    let fecRegisto = new Date();
    const formValues = this.formulario.getRawValue();
    const formData = new FormData();
    formData.append('Accion', 'I');
    formData.append('Id_Registro', '0');
    formData.append('Fec_Registro', fecRegisto.toISOString());
    formData.append('Fec_Registro2', fecRegisto.toISOString());
    formData.append('Cod_Activo_Fijo', formValues.Cod_Activo_Fijo);
    formData.append('Dni_Responsable', formValues.Dni_Responsable);
    formData.append('Num_Planta_Origen', formValues.Num_Planta_Origen);
    formData.append('Num_Planta_Destino', formValues.Num_Planta_Destino);
    formData.append('Usu_Registro', GlobalVariable.vusu);

    this.spinnerService.show();
    this.controlActivoFijoService.manRegistroSalidas(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
          this.limpiarValor();
        } else {
          this.matSnackBar.open('Error al guardar el registpo!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );
  }

  onBuscarDocumento(documentoIdentidad: any){
    const formData = new FormData();
    formData.append('Accion', 'C');
    formData.append('DocumentoIdentidad', documentoIdentidad);
    formData.append('NumeroHijos', '0');
    formData.append('UsuarioRegistro', GlobalVariable.vusu);

    this.spinnerService.show();
    this.eventosService.consutarFirmaColaborador(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
          this.formulario.controls['Nom_Responsable'].setValue(result[0].NombreCompleto);
          this.spinnerService.hide();
        }else{
          this.formulario.controls['Nom_Responsable'].setValue('');
          this.matSnackBar.open('Documento de identidad inválido!', 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.spinnerService.hide();
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    );

  }  

  onExportarSalidas(){}

  validarTrabajador(form: FormGroup){
    const nomResp = form.get('Nom_Responsable')?.value != null ? form.get('Nom_Responsable')?.value : '';
    return nomResp.length > 0 ? null : { mismatch: true };
  }  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }


}
