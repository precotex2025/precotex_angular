import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService }  from "ngx-spinner";
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

  regSalida: boolean = false;
  codActivoFijo: string = "";

  displayedColumns: string[] = ['Cod_Activo', 'Descripcion', 'Nom_Marca', 'Nom_Modelo', 'Num_Serie_Equipo', 'Nom_Area', 'Nom_Responsable','Flg_Salida','Acciones']
  dataSource1: MatTableDataSource<any>;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService,
    private eventosService: EventosService,
    private controlActivoFijoService: ControlActivoFijoService
  ) {
    this.dataSource1 = new MatTableDataSource();
  }

  ngOnInit(): void {
   this.listarPlantas();
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
    console.log(idPlanta)
    this.dataPlantaDestino = this.dataPlantaOrigen.filter(d=> d.Id_Planta != idPlanta);
    console.log(this.dataPlantaDestino)
  }

  listarPlantas(){
    this.eventosService.listaPlantaEventos()
      .subscribe((response) => {
        this.dataPlantaOrigen = response;
        this.dataPlantaDestino = response;
      });
  }

  onListarSalids(){
    let fecha = new Date();
    const formData = new FormData();
    formData.append('Accion', 'L');
    formData.append('Id_Registro', '0');
    formData.append('Fec_Registro', fecha.toISOString());
    formData.append('Fec_Registro2', fecha.toISOString());
    formData.append('Cod_Activo_Fijo', '');
    formData.append('Dni_Responsable', '');
    formData.append('Num_Planta_Origen', '');
    formData.append('Num_Planta_Destino', '');
    formData.append('Usu_Registro', GlobalVariable.vusu);

    this.spinnerService.show();
    this.controlActivoFijoService.manRegistroSalidas(formData)
      .subscribe((result: any) => {
        if (result.length > 0) {
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

  onSubmit(){
    let fecha = new Date();
    const formValues = this.formulario.getRawValue();
    const formData = new FormData();
    formData.append('Accion', 'I');
    formData.append('Id_Registro', '0');
    formData.append('Fec_Registro', fecha.toISOString());
    formData.append('Fec_Registro2', fecha.toISOString());
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

  validarTrabajador(form: FormGroup){
    const nomResp = form.get('Nom_Responsable')?.value != null ? form.get('Nom_Responsable')?.value : '';
    return nomResp.length > 0 ? null : { mismatch: true };
  }  


}
