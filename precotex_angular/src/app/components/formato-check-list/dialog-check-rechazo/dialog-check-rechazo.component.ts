import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariable } from 'src/app/VarGlobals';
import { CheckListService } from 'src/app/services/check-list.service';

interface Investigacion {
  Id_Investigacion:string;
  Id_CheckList:string;
  Tipo: string;
  Descripcion: string;
  Fec_Registro: string;
}

interface PlanAccion {
  Id_Plan_Accion:string;
  Id_CheckList: string;
  Actividad: string;
  Fec_Registro: string;
}

@Component({
  selector: 'app-dialog-check-rechazo',
  templateUrl: './dialog-check-rechazo.component.html',
  styleUrls: ['./dialog-check-rechazo.component.scss']
})
export class DialogCheckRechazoComponent implements OnInit {
 
  sCod_Usuario = GlobalVariable.vusu;




  myControl = new FormControl();
  fec_registro = new FormControl(new Date())

  formulario = this.formBuilder.group({
    Opcion: [''],
    Id_CheckList: [''],
    Corte: [''],
	  Costura_Ate: [''],
	  Costura_Indep: [''],
	  Estampado_Pieza: [''],
	  Estampado_Prenda: [''],
	  Bordado: [''],
	  Lavanderia: [''],
	  Inspeccion: [''],
	  Acabados: ['']
  });

  Indicaciones:any = '';

  idCabecera: any = '';
  dataSource: MatTableDataSource<Investigacion>;
  dataSource2: MatTableDataSource<PlanAccion>;

  dataDefectos:any = [];
  dataIndicaciones:any = [];

  displayedColumns: string[] = ['Tipo', 'Descripcion', 'Eliminar'];
  displayedColumns2: string[] = ['Actividad', 'Eliminar'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  

  flg_btn_cabecera = false;
  mostrarRechazo = false;

  Tipo:any = '';
  Descripcion:any = '';
  Actividad:any = '';
  constructor(private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private checkListService: CheckListService,
    private elementRef: ElementRef,
    private spinnerService: NgxSpinnerService,
   @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.dataSource = new MatTableDataSource();
      this.dataSource2 = new MatTableDataSource();
   }

  ngOnInit(): void {
    console.log(this.data);
    this.formulario.patchValue({
      Id_CheckList: this.data
    });

    this.listarCabecera();
    this.listarInvestigacion();
    this.listarPlanAccion();
  }

  RegistrarCabecera(){
    this.spinnerService.show();
    console.log(this.formulario.value);
    var Opcion = this.formulario.get('Opcion').value;
    var Id_CheckList = this.formulario.get('Id_CheckList').value;
    var Corte = this.formulario.get('Corte').value == true ? '1' : '0';
    var Costura_Ate = this.formulario.get('Costura_Ate').value == true ? '1' : '0';
    var Costura_Indep = this.formulario.get('Costura_Indep').value == true ? '1' : '0';
    var Estampado_Pieza = this.formulario.get('Estampado_Pieza').value == true ? '1' : '0';
    var Estampado_Prenda = this.formulario.get('Estampado_Prenda').value == true ? '1' : '0';
    var Bordado = this.formulario.get('Bordado').value == true ? '1' : '0'; 
    var Lavanderia = this.formulario.get('Lavanderia').value == true ? '1' : '0';
    var Inspeccion = this.formulario.get('Inspeccion').value == true ? '1' : '0';
    var Acabados = this.formulario.get('Acabados').value == true ? '1' : '0';

    this.checkListService.CF_CHECK_CREAR_DETECTO_OBS(
      'I',
      Id_CheckList,
      Corte,
      Costura_Ate,
      Costura_Indep,
      Estampado_Pieza,
      Estampado_Prenda,
      Bordado,
      Lavanderia,
      Inspeccion,
      Acabados
    ).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se guardo el registro correctamente', 'Cerrar', { duration: 1500})
          // this.formulario.disable();
          
          //this.flg_btn_cabecera = true;
        }else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500})
        }

      },
      (err: HttpErrorResponse) =>{
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })
  }

  listarCabecera(){
    this.checkListService.CF_CHECK_CREAR_DETECTO_OBS(
      'L',
      this.formulario.get('Id_CheckList').value,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ).subscribe(
      (result: any) => {
          console.log(result);
          this.formulario.patchValue({
            Corte: result[0].Corte == '1' ? true : false,
            Costura_Ate: result[0].Costura_Ate == '1' ? true : false,
            Costura_Indep: result[0].Costura_Indep == '1' ? true : false,
            Estampado_Pieza: result[0].Estampado_Pieza == '1' ? true : false,
            Estampado_Prenda: result[0].Estampado_Prenda == '1' ? true : false,
            Bordado: result[0].Bordado == '1' ? true : false,
            Lavanderia: result[0].Lavanderia == '1' ? true : false,
            Inspeccion: result[0].Inspeccion == '1' ? true : false,
            Acabados: result[0].Acabados == '1' ? true : false
          })
      },
      (err: HttpErrorResponse) =>{
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })
  }

  listarInvestigacion(){
    this.checkListService.CF_CHECK_CREAR_INVESTIGACION(
      'L',
      '',
      this.formulario.get('Id_CheckList').value,
      '',
      '',
    ).subscribe(
      (result: any) => {

        this.dataSource.data = result;
      },
      (err: HttpErrorResponse) =>{
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })
  }

  listarPlanAccion(){
    this.checkListService.CF_CHECK_CREAR_PLAN_ACCION(
      'L',
      '',
      this.formulario.get('Id_CheckList').value,
      ''
    ).subscribe(
      (result: any) => {
        this.dataSource2.data = result;
      },
      (err: HttpErrorResponse) =>{
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })
  }

  InsertarFila(){
    if(this.Tipo != '' && this.Descripcion != ''){
      this.checkListService.CF_CHECK_CREAR_INVESTIGACION(
        'I',
        '0',
        this.formulario.get('Id_CheckList').value,
        this.Tipo,
        this.Descripcion
      ).subscribe(
        (result: any) => {
  
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Se inserto el registro correctamente', 'Cerrar', { duration: 1500})
            // this.formulario.disable();
            this.Tipo = '';
            this.Descripcion = '';
            this.listarInvestigacion();
          }else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500})
          }
  
        },
        (err: HttpErrorResponse) =>{
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
    }else{
      this.matSnackBar.open('Debes seleccionar el tipo e ingresar la descripción', 'Cerrar', {
        duration: 1500,
      })
    }
  }

  eliminarFila(data_det: Investigacion){
    console.log(data_det)
    this.spinnerService.show();
    this.checkListService.CF_CHECK_CREAR_INVESTIGACION(
      'D',
      data_det.Id_Investigacion,
      this.formulario.get('Id_CheckList').value,
      this.Tipo,
      this.Descripcion
    ).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se Elimino el registro correctamente', 'Cerrar', { duration: 1500})
          // this.formulario.disable();
          this.Tipo = '';
          this.Descripcion = '';
          this.listarInvestigacion();
        }else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500})
        }

      },
      (err: HttpErrorResponse) =>{
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })
  }

  InsertarFilaActividad(){
    if(this.Actividad != ''){
      this.checkListService.CF_CHECK_CREAR_PLAN_ACCION(
        'I',
        '0',
        this.formulario.get('Id_CheckList').value,
        this.Actividad
      ).subscribe(
        (result: any) => {
  
          if (result[0].Respuesta == 'OK') {
            this.matSnackBar.open('Se inserto el registro correctamente', 'Cerrar', { duration: 1500})
            // this.formulario.disable();
            this.Actividad = '';
            this.listarPlanAccion();
          }else{
            this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500})
          }
  
        },
        (err: HttpErrorResponse) =>{
          this.spinnerService.hide();
          this.matSnackBar.open(err.message, 'Cerrar', {
          duration: 1500,
        })
      })
    }else{
      this.matSnackBar.open('Debes ingresar la actividad.', 'Cerrar', {
        duration: 1500,
      })
    }
  }

  eliminarFilaActividad(data_det:PlanAccion){
    this.spinnerService.show();
    this.checkListService.CF_CHECK_CREAR_PLAN_ACCION(
      'D',
      data_det.Id_Plan_Accion,
      this.formulario.get('Id_CheckList').value,
      this.Actividad
    ).subscribe(
      (result: any) => {
        this.spinnerService.hide();
        if (result[0].Respuesta == 'OK') {
          this.matSnackBar.open('Se elimino el registro correctamente', 'Cerrar', { duration: 1500})
          // this.formulario.disable();
          this.Actividad = '';
          this.listarPlanAccion();
        }else{
          this.matSnackBar.open(result[0].Respuesta, 'Cerrar', { duration: 1500})
        }

      },
      (err: HttpErrorResponse) =>{
        this.spinnerService.hide();
        this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 1500,
      })
    })
  }
}
