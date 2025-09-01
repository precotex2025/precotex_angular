import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { GlobalVariable } from 'src/app/VarGlobals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DespachoOpIncompletaService} from 'src/app/services/despacho-op-incompleta.service'
import * as _moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

interface data{
  Cod_Ordtra: string
  Estado: string
}

interface data_det1 {
  Tela: string,
  Des_Comb: string,
  Tipo: string,
  Ancho_Acab: number,
  Ancho_Reposo: number,
  Ancho_Acab_T: number,
  Gramaje_Acab: number,
  Gramaje_Reposo: number,
  Gramaje_Acab_T: number,
  Encog_Ancho: number,
  EncogA_Lavado: number,
  Encog_Ancho_T: number,
  Encog_Largo: number,
  EncogL_Lavado: number,
  Encog_largo_T: number,
  Revirado: number,
  Revirado_Lavado: number,
  Revirado_T: number,
  Encogimiento_Tramo_Izquierdo: number,
  Encogimiento_Tramo_Centro: number,
  Encogimiento_Ancho_Derecho: number,
  Gramaje_Lavado: number,
  Nom_Auditor: string,
  Flg_Status_Apro: string,
  Fec_Registro: string,
  Observaciones: string
}

interface data_det2 {
  Cliente: string,	
  OP: string,
  Estilo: string,
  Tela: string,
  Comb: string,
  Kgs_Req_Acabado: number,
  Kgs_Tenidos_1ras: number,
  Estado: string                                           	
}

interface Motivo {
  IdMotivo: number;
  Nom_Motivo: string;
}



@Component({
  selector: 'app-dialog-despacho-op-incompleta',
  templateUrl: './dialog-despacho-op-incompleta.component.html',
  styleUrls: ['./dialog-despacho-op-incompleta.component.scss']
})
export class DialogDespachoOpIncompletaComponent implements OnInit {

  listar_operacionMotivo: Motivo[] = [];

  // nuevas variables
  
  Cod_Accion              = ''
  Cod_Ordtra              = ''
  Flg_Aprobado            = ''
  Nom_Motivo              = ''
  Cod_Usuario             = ''
  Fec_Creacion            = ''
  Cod_Usuario_Aprobacion  = ''
  Fec_Creacion_Aprobacion = ''
  Id_Motivo: 0
  Flg_visible_button = true


  formulario = this.formBuilder.group({
    Partida:          [''],
    Kgacabado:        [0],
    Kgtenido:         [0],
    Motivo:           ['']
  }) 

  dataSource1: MatTableDataSource<data_det1>;
  displayedColumns_cab1: string[] = ['Cliente','OP','Estilo','Tela2','Comb','Kgs_Req_Acabado','Kgs_Tenidos_1ras','Estado']
  dataSource2: MatTableDataSource<data_det2>;
  displayedColumns_cab2: string[] = ['Tela','Des_Comb','Tipo','Ancho_Acab','Ancho_Reposo','Ancho_Acab_T','Gramaje_Acab','Gramaje_Reposo','Gramaje_Acab_T','Encog_Ancho','EncogA_Lavado','Encog_Ancho_T','Encog_Largo','EncogL_Lavado','Encog_largo_T','Revirado','Revirado_Lavado','Revirado_T','Encogimiento_Tramo_Izquierdo','Encogimiento_Tramo_Centro','Gramaje_Lavado','Nom_Auditor','Flg_Status_Apro','Fec_Registro','Observaciones']


 
  constructor(private formBuilder: FormBuilder,
              private matSnackBar: MatSnackBar, 
              private despachoOpIncompletaService: DespachoOpIncompletaService,
              @Inject(MAT_DIALOG_DATA) public data: data) 
  {
    this.dataSource1 = new MatTableDataSource();
    this.dataSource2 = new MatTableDataSource();
    this.formulario = formBuilder.group({
      //Partida:            ['', Validators.required],
      Partida:          ['', Validators.required],
      Kgacabado:        ['', Validators.required],
      Kgtenido:         ['', Validators.required],
      Motivo:           ['', Validators.required] 
    });

  }


  ngOnInit(): void {    
    this.ListarKgProgramadoTenido()
    this.CargarOperacionMotivo()
    this.formulario.controls['Partida'].setValue(this.data.Cod_Ordtra)
    this.formulario.controls['Partida'].disable()
    this.formulario.controls['Kgacabado'].disable()
    this.formulario.controls['Kgtenido'].disable()
    this.ListarDetalle1()
    this.ListarDetalle2()

    if(this.data.Estado == 'SI'){
      this.Flg_visible_button = false
      this.formulario.controls['Motivo'].disable();
    }
    else if(this.data.Estado == 'NO'){
      this.Flg_visible_button = true
      this.formulario.controls['Motivo'].enable();
    }
  }


  GuardarMotivo(){
   

    if(this.formulario.get('Motivo')?.value == ''){
      this.matSnackBar.open("No ha seleccionado ningun motivo para guardar..!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
    }else{
        
    this.Cod_Accion     = 'M'
    this.Cod_Ordtra     = this.data.Cod_Ordtra
    this.Id_Motivo      = this.formulario.get('Motivo')?.value
    this.despachoOpIncompletaService.MantenimientoDespachoOpIncompleta(
      this.Cod_Accion,
      this.Cod_Ordtra,
      this.Id_Motivo   
    ).subscribe(
      (result: any) => { 
    
          this.matSnackBar.open("Proceso Correcto!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
    }
   
  }

/* --------------- REGISTRAR CABECERA ------------------------------------------ */

  submit(formDirective) :void {
    this.Cod_Accion           = 'U'
    this.Cod_Ordtra           = this.data.Cod_Ordtra
    this.Id_Motivo            = this.formulario.get('Motivo')?.value
    this.despachoOpIncompletaService.MantenimientoDespachoOpIncompleta(
      this.Cod_Accion,
      this.Cod_Ordtra,
      this.Id_Motivo   
    ).subscribe(
      (result: any) => { 
    
          this.matSnackBar.open("Proceso Correcto!!", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }

  CargarOperacionMotivo(){
    this.despachoOpIncompletaService.ListarMotivoDespachoOpIncompleta().subscribe(
      (result: any) => {
        console.log(result)
        this.listar_operacionMotivo = result
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 }))
  }



  

  ListarDetalle1(){
    this.Cod_Accion           = 'D'
    this.Cod_Ordtra           = this.data.Cod_Ordtra
    this.Id_Motivo            = 0
    this.despachoOpIncompletaService.MantenimientoDespachoOpIncompleta(
      this.Cod_Accion,
      this.Cod_Ordtra,
      this.Id_Motivo   
    ).subscribe(
      (result: any) => { 
        if (result.length > 0) {
         
          this.dataSource1.data = result

        }
        else {
          this.matSnackBar.open("No se encontraron registros...", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource1.data = []

        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }

  ListarDetalle2(){
    this.Cod_Accion           = 'S'
    this.Cod_Ordtra           = this.data.Cod_Ordtra
    this.Id_Motivo            = 0
    this.despachoOpIncompletaService.MantenimientoDespachoOpIncompleta(
      this.Cod_Accion,
      this.Cod_Ordtra,
      this.Id_Motivo   
    ).subscribe(
      (result: any) => { 
        if (result.length > 0) {
         
          this.dataSource2.data = result

        }
        else {
          this.matSnackBar.open("No se encontraron registros...", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
          this.dataSource2.data = []

        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }

  ListarKgProgramadoTenido(){
    this.Cod_Accion           = 'T'
    this.Cod_Ordtra           = this.data.Cod_Ordtra
    this.Id_Motivo            = 0
    this.despachoOpIncompletaService.MantenimientoDespachoOpIncompleta(
      this.Cod_Accion,
      this.Cod_Ordtra,
      this.Id_Motivo   
    ).subscribe(
      (result: any) => { 
        if (result.length > 0) {
          console.log(result)
         this.formulario.controls['Kgacabado'].setValue(result[0].Can_Programada_Tex);
         this.formulario.controls['Kgtenido'].setValue(result[0].Kgs_Tenidos_1ras);
         if(result[0].Id_Motivo != ''){
         this.formulario.controls['Motivo'].setValue(result[0].Id_Motivo);
       
         }else{
          this.formulario.controls['Motivo'].setValue('');

         }

        }
        else { 
          this.matSnackBar.open("No se encontraron registros...", 'Cerrar', { horizontalPosition: 'center', verticalPosition: 'top', duration: 1500 })
        }
      },
      (err: HttpErrorResponse) => this.matSnackBar.open(err.message, 'Cerrar', {
        duration: 2500,
      }))
  }

  

}
